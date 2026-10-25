import { z } from "zod";
import { serviceSlugs } from "@/content/services/slugs";

/** Shared between the browser (instant feedback) and the server (the real check). */

export const timelineOptions = ["asap", "1-3-months", "3-6-months", "flexible"] as const;
export const budgetOptions = ["under-1k", "1k-5k", "5k-15k", "15k-50k", "50k-plus", "not-sure", "prefer-not"] as const;

const serviceSlug = z.enum(serviceSlugs);

const name = z.string().trim().min(2, "name_short").max(100, "too_long");
const email = z.string().trim().max(200, "too_long").email("email_invalid");
const optional = (max: number) => z.string().trim().max(max, "too_long").optional().default("");

/** Anti-spam fields every public form carries. */
const antiSpam = {
  /** Honeypot: hidden from people, often filled in by bots. Must stay empty. */
  companyWebsite: z.string().max(0, "spam").optional().default(""),
  /** When the form was first shown (ms since epoch). */
  startedAt: z.coerce.number().int().positive(),
};

export const contactInputSchema = z.object({
  name,
  email,
  businessName: optional(120),
  services: z.array(serviceSlug).max(24).default([]),
  message: z.string().trim().min(10, "message_short").max(3000, "too_long"),
  consent: z.literal(true, { message: "consent_required" }),
  locale: z.enum(["en", "ar"]),
  ...antiSpam,
});

export const proposalInputSchema = z.object({
  name,
  businessName: optional(120),
  email,
  phone: z
    .string()
    .trim()
    .max(40, "too_long")
    .regex(/^[+()\d\s.-]*$/, "phone_invalid")
    .optional()
    .default(""),
  country: optional(80),
  timezone: optional(60),
  services: z.array(serviceSlug).min(1, "services_required").max(24),
  goals: z.string().trim().min(10, "goals_short").max(2000, "too_long"),
  website: optional(500),
  scope: optional(3000),
  timeline: z.enum(timelineOptions),
  budget: z.enum(budgetOptions),
  details: optional(3000),
  consent: z.literal(true, { message: "consent_required" }),
  locale: z.enum(["en", "ar"]),
  ...antiSpam,
});

export type ContactInput = z.infer<typeof contactInputSchema>;
export type ProposalInput = z.infer<typeof proposalInputSchema>;

/** First error code per field, e.g. { email: "email_invalid" }. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}
