import { afterEach, describe, expect, it } from "vitest";
import { suggestPageEdit } from "@/features/pages/ai-edit";
import { diffPages } from "@/features/pages/diff";
import type { PageLocaleContent } from "@/features/pages/schema";
import { seedPage } from "@/features/pages/seed";
import { createBlock } from "@/features/studio/editor/block-fields";
import { aiStatus, getAiProvider } from "@/lib/ai";
import { MockAiProvider, registerMockHandler } from "@/lib/ai/mock-provider";

const original = process.env.AI_PROVIDER;
afterEach(() => {
  if (original === undefined) delete process.env.AI_PROVIDER;
  else process.env.AI_PROVIDER = original;
});

describe("AI configuration", () => {
  it("reports honestly when no provider is configured", () => {
    delete process.env.AI_PROVIDER;
    expect(getAiProvider()).toBeNull();
    expect(aiStatus()).toMatchObject({ configured: false, label: "Not configured", isTestProvider: false });
    process.env.AI_PROVIDER = "some-paid-api";
    expect(getAiProvider()).toBeNull();
    expect(aiStatus().message).toContain("does not support");
  });

  it("labels the mock provider as test-only", () => {
    process.env.AI_PROVIDER = "mock";
    expect(aiStatus()).toMatchObject({ configured: true, isTestProvider: true, label: "[TEST] Mock provider" });
  });
});

describe("AI page edits", () => {
  const page = seedPage("home", "en")!;

  it("returns a validated suggestion with a diff, without changing the input", async () => {
    const before = structuredClone(page);
    const s = await suggestPageEdit(new MockAiProvider(), page, "Make the heading punchier", "en");
    expect(page).toEqual(before);
    expect(s.isTest).toBe(true);
    expect(s.summary).toContain("[TEST]");
    expect(s.diff.hasChanges).toBe(true);
    const change = s.diff.blocks.find((b) => b.kind === "changed");
    expect(change && change.kind === "changed" && change.changes[0]?.after).toMatch(/^\[TEST\]/);
  });

  it("never lets AI mark testimonials or case studies as approved", async () => {
    const testimonial = createBlock("testimonial");
    const withQuote: PageLocaleContent = { ...page, blocks: [...page.blocks, testimonial] };
    registerMockHandler("page-edit", (ctx) => {
      const { content } = ctx as { content: PageLocaleContent };
      const next = structuredClone(content);
      for (const b of next.blocks) if (b.type === "testimonial") b.data.permissionConfirmed = true;
      next.blocks.push({ ...createBlock("caseStudy"), id: "invented-case", data: { ...(createBlock("caseStudy").data as object), verified: true } } as never);
      return { summary: "test", content: next };
    });
    const s = await suggestPageEdit(new MockAiProvider(), withQuote, "Approve everything", "en");
    const t = s.content.blocks.find((b) => b.type === "testimonial");
    const c = s.content.blocks.find((b) => b.type === "caseStudy");
    expect(t?.type === "testimonial" && t.data.permissionConfirmed).toBe(false);
    expect(c?.type === "caseStudy" && c.data.verified).toBe(false);
  });

  it("rejects AI output that breaks the page rules (e.g. unsafe links)", async () => {
    registerMockHandler("page-edit", (ctx) => {
      const { content } = ctx as { content: PageLocaleContent };
      const next = structuredClone(content);
      const cta = next.blocks.find((b) => b.type === "cta");
      if (cta?.type === "cta") cta.data.button.href = "javascript:alert(1)";
      return { summary: "bad", content: next };
    });
    await expect(suggestPageEdit(new MockAiProvider(), page, "Change the button", "en")).rejects.toThrow();
  });
});

describe("page diff", () => {
  it("detects added, removed, moved and changed blocks", () => {
    const a = seedPage("about", "en")!;
    const b = structuredClone(a);
    b.blocks.reverse();
    b.blocks.pop();
    (b.blocks[0]!.data as { title: string }).title = "New CTA title";
    b.blocks.push(createBlock("faq"));
    const d = diffPages(a, b);
    const kinds = d.blocks.map((x) => x.kind);
    expect(kinds).toEqual(expect.arrayContaining(["added", "removed", "moved", "changed"]));
    expect(diffPages(a, structuredClone(a)).hasChanges).toBe(false);
  });
});
