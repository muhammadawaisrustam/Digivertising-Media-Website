import "server-only";
import type { Locale } from "@/i18n/config";
import { getStore } from "@/lib/database";
import type { LeadRecord } from "@/lib/database/types";
import { rateLimit } from "@/lib/security/rate-limit";
import { qualifyProposal, type Qualification } from "./qualification";
import { contactInputSchema, fieldErrors, proposalInputSchema } from "./schema";

/** Shortest believable time for a person to fill in a form. Faster submissions are treated as bots. */
const MIN_FILL_MS = 3000;
/** Submissions allowed per IP per 10 minutes. FORM_RATE_LIMIT exists only so automated tests can raise it. */
const LIMIT = { count: Number(process.env.FORM_RATE_LIMIT) || 5, windowMs: 10 * 60 * 1000 };

export type SubmitResult<T = undefined> =
  | { ok: true; data: T }
  | { ok: false; fieldErrors: Record<string, string>; formError?: "rate_limited" | "spam" | "server" };

function spamCheck(startedAt: number, now: number): boolean {
  return now - startedAt < MIN_FILL_MS || startedAt > now + 60_000;
}

export async function submitContact(raw: unknown, ip: string, now = Date.now()): Promise<SubmitResult> {
  const parsed = contactInputSchema.safeParse(raw);
  if (!parsed.success) {
    const errors = fieldErrors(parsed.error);
    if (errors.companyWebsite) return { ok: false, fieldErrors: {}, formError: "spam" };
    return { ok: false, fieldErrors: errors };
  }
  const input = parsed.data;
  if (spamCheck(input.startedAt, now)) return { ok: false, fieldErrors: {}, formError: "spam" };
  if (!rateLimit(`lead:${ip}`, LIMIT.count, LIMIT.windowMs, now).allowed) return { ok: false, fieldErrors: {}, formError: "rate_limited" };

  try {
    await getStore().createLead({
      source: "website_contact",
      locale: input.locale,
      name: input.name,
      businessName: input.businessName,
      email: input.email,
      phone: "",
      country: "",
      timezone: "",
      services: input.services,
      goals: "",
      website: "",
      scope: "",
      timeline: "",
      budget: "",
      details: input.message,
      consentAt: new Date(now).toISOString(),
      qualification: null,
    });
    return { ok: true, data: undefined };
  } catch (err) {
    console.error("Failed to store contact lead", err);
    return { ok: false, fieldErrors: {}, formError: "server" };
  }
}

export async function submitProposal(raw: unknown, ip: string, now = Date.now()): Promise<SubmitResult<{ reference: string; qualification: Qualification }>> {
  const parsed = proposalInputSchema.safeParse(raw);
  if (!parsed.success) {
    const errors = fieldErrors(parsed.error);
    if (errors.companyWebsite) return { ok: false, fieldErrors: {}, formError: "spam" };
    return { ok: false, fieldErrors: errors };
  }
  const input = parsed.data;
  if (spamCheck(input.startedAt, now)) return { ok: false, fieldErrors: {}, formError: "spam" };
  if (!rateLimit(`lead:${ip}`, LIMIT.count, LIMIT.windowMs, now).allowed) return { ok: false, fieldErrors: {}, formError: "rate_limited" };

  const qualification = qualifyProposal(input, input.locale as Locale);
  try {
    const lead: LeadRecord = await getStore().createLead({
      source: "website_proposal",
      locale: input.locale,
      name: input.name,
      businessName: input.businessName,
      email: input.email,
      phone: input.phone,
      country: input.country,
      timezone: input.timezone,
      services: input.services,
      goals: input.goals,
      website: input.website,
      scope: input.scope,
      timeline: input.timeline,
      budget: input.budget,
      details: input.details,
      consentAt: new Date(now).toISOString(),
      qualification: {
        categories: qualification.categories,
        missingInfo: qualification.missingInfo,
        discoveryQuestions: qualification.discoveryQuestions,
        priority: qualification.priority,
      },
    });
    return { ok: true, data: { reference: lead.id.slice(0, 8).toUpperCase(), qualification } };
  } catch (err) {
    console.error("Failed to store proposal lead", err);
    return { ok: false, fieldErrors: {}, formError: "server" };
  }
}
