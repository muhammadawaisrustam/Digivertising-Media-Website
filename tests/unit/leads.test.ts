import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { qualifyProposal } from "@/features/leads/qualification";
import { rateLimit, resetRateLimits } from "@/lib/security/rate-limit";

let dir: string;
beforeAll(async () => {
  dir = await mkdtemp(path.join(tmpdir(), "dv-leads-"));
  process.env.DATA_DIR = dir;
});
afterAll(async () => {
  await rm(dir, { recursive: true, force: true });
});
beforeEach(() => resetRateLimits());

const NOW = 1_800_000_000_000;
const contact = (extra: Record<string, unknown> = {}) => ({
  name: "Test Person",
  email: "test@example.com",
  message: "We would like help with our SEO.",
  consent: true,
  locale: "en",
  startedAt: NOW - 10_000,
  ...extra,
});

describe("rate limit", () => {
  it("allows up to the limit, then blocks until the window resets", () => {
    for (let i = 0; i < 3; i++) expect(rateLimit("k", 3, 1000, 0).allowed).toBe(true);
    expect(rateLimit("k", 3, 1000, 10).allowed).toBe(false);
    expect(rateLimit("k", 3, 1000, 1001).allowed).toBe(true);
  });
});

describe("lead submissions", () => {
  it("stores a valid contact message", async () => {
    const { submitContact } = await import("@/features/leads/service");
    const { getStore } = await import("@/lib/database");
    const res = await submitContact(contact(), "1.1.1.1", NOW);
    expect(res.ok).toBe(true);
    const leads = await getStore().listLeads();
    expect(leads[0]).toMatchObject({ name: "Test Person", source: "website_contact", status: "new" });
  });

  it("returns field errors without storing anything", async () => {
    const { submitContact } = await import("@/features/leads/service");
    const res = await submitContact(contact({ email: "nope", consent: false }), "1.1.1.2", NOW);
    expect(res.ok).toBe(false);
    if (!res.ok) expect(res.fieldErrors).toMatchObject({ email: "email_invalid", consent: "consent_required" });
  });

  it("treats the honeypot and very fast submissions as spam", async () => {
    const { submitContact } = await import("@/features/leads/service");
    const honeypot = await submitContact(contact({ companyWebsite: "x" }), "1.1.1.3", NOW);
    expect(honeypot).toMatchObject({ ok: false, formError: "spam" });
    const fast = await submitContact(contact({ startedAt: NOW - 500 }), "1.1.1.3", NOW);
    expect(fast).toMatchObject({ ok: false, formError: "spam" });
  });

  it("limits repeated submissions from one address", async () => {
    const { submitContact } = await import("@/features/leads/service");
    for (let i = 0; i < 5; i++) expect((await submitContact(contact(), "2.2.2.2", NOW)).ok).toBe(true);
    expect(await submitContact(contact(), "2.2.2.2", NOW)).toMatchObject({ ok: false, formError: "rate_limited" });
  });

  it("stores a proposal with its automated qualification", async () => {
    const { submitProposal } = await import("@/features/leads/service");
    const res = await submitProposal(
      { ...contact(), services: ["seo", "google-ads"], goals: "Short goal", timeline: "asap", budget: "not-sure" },
      "3.3.3.3",
      NOW,
    );
    expect(res.ok).toBe(true);
    if (res.ok) {
      expect(res.data.reference).toMatch(/^[0-9A-F]{8}$/);
      expect(res.data.qualification.categories).toEqual(expect.arrayContaining(["search", "growth"]));
    }
  });
});

describe("qualification", () => {
  type Input = Parameters<typeof qualifyProposal>[0];
  const base: Input = { services: ["seo"], goals: "", website: "", scope: "", timeline: "flexible", budget: "not-sure", country: "" };

  it("flags missing information instead of guessing", () => {
    const q = qualifyProposal({ ...base, services: ["seo"] }, "en");
    expect(q.missingInfo).toEqual(expect.arrayContaining(["Current website or relevant links", "Budget range", "Project scope or requirements"]));
    expect(q.priority).toBe("low");
  });

  it("is deterministic and bilingual", () => {
    const input: Input = { ...base, services: ["public-relations", "web-development"], goals: "A detailed description of our goals for the next year.", scope: "New site", website: "https://example.com", timeline: "asap", budget: "15k-50k", country: "UAE" };
    const en = qualifyProposal(input, "en");
    expect(qualifyProposal(input, "en")).toEqual(en);
    expect(en.priority).toBe("high");
    expect(en.missingInfo).toEqual([]);
    const ar = qualifyProposal(input, "ar");
    expect(ar.discoveryQuestions[0]).toMatch(/[؀-ۿ]/);
  });
});
