import { z } from "zod";

/**
 * Service content model. Content is plain data, validated with zod, so it can be
 * edited without touching components and later moved into the database / a CMS.
 */
export const categoryIds = ["growth", "search", "brand", "pr", "technology"] as const;
export type CategoryId = (typeof categoryIds)[number];

const nonEmpty = z.string().trim().min(1);

export const serviceLocaleContentSchema = z.object({
  title: nonEmpty,
  /** <title> tag; keep under ~60 characters. */
  metaTitle: nonEmpty.max(70),
  /** Meta description; keep under ~160 characters. */
  metaDescription: nonEmpty.max(170),
  /** One or two sentences used on cards and as the page lead. */
  summary: nonEmpty,
  /** Opening paragraph that answers "what is this and who is it for". */
  intro: nonEmpty,
  /** Signs a business may need this service. */
  signals: z.array(nonEmpty).min(3),
  /** What the service covers. */
  includes: z.array(z.object({ title: nonEmpty, text: nonEmpty })).min(3),
  /** Typical outputs the client receives. */
  deliverables: z.array(nonEmpty).min(3),
  /** Honest expectation-setting note (e.g. no guaranteed rankings). */
  note: nonEmpty.optional(),
  faqs: z.array(z.object({ q: nonEmpty, a: nonEmpty })).min(2),
});

export const serviceSchema = z.object({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  category: z.enum(categoryIds),
  related: z.array(z.string()).max(4),
  content: z.object({ en: serviceLocaleContentSchema, ar: serviceLocaleContentSchema }),
});

export type ServiceLocaleContent = z.infer<typeof serviceLocaleContentSchema>;
export type Service = z.infer<typeof serviceSchema>;
