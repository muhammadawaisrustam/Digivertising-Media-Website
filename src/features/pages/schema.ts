import { z } from "zod";
import { locales } from "@/i18n/config";

/**
 * Page content model: a page is an ordered list of typed blocks per language.
 * Everything the visual editor and AI editor produce is validated against this
 * schema before it can be saved or published.
 *
 * Supported blocks are listed in docs/editor.md. Adding a block type means:
 * 1) add a schema here, 2) add a renderer in blocks/, 3) add editor fields in
 * editor-fields.ts.
 */

const text = (max: number) => z.string().trim().min(1).max(max);
const optionalText = (max: number) => z.string().trim().max(max).optional().default("");

/** Links: site-relative paths, https URLs, mailto. Blocks javascript: and data: URLs. */
export const safeHref = z
  .string()
  .trim()
  .max(500)
  .refine((v) => /^(\/(?!\/)[^\s]*|https:\/\/[^\s]+|mailto:[^\s@]+@[^\s@]+|#[\w-]*)$/.test(v), {
    message: "Use a site path like /contact, a full https:// address, or mailto:",
  });

/** Images: site-relative paths or https URLs only. */
export const safeImageSrc = z
  .string()
  .trim()
  .max(500)
  .refine((v) => /^(\/(?!\/)[^\s]+|https:\/\/[^\s]+)$/.test(v), {
    message: "Use an image path like /images/photo.jpg or a full https:// address",
  });

const linkSchema = z.object({ label: text(60), href: safeHref });

export const blockSettingsSchema = z
  .object({
    background: z.enum(["default", "subtle", "glow"]).default("default"),
    spacing: z.enum(["compact", "normal", "spacious"]).default("normal"),
    align: z.enum(["start", "center"]).default("start"),
  })
  .default({ background: "default", spacing: "normal", align: "start" });

export type BlockSettings = z.infer<typeof blockSettingsSchema>;

const base = { id: z.string().regex(/^[a-zA-Z0-9_-]{4,40}$/), settings: blockSettingsSchema };

export const heroBlock = z.object({
  ...base,
  type: z.literal("hero"),
  data: z.object({
    eyebrow: optionalText(120),
    title: text(140),
    titleAccent: optionalText(80),
    lead: optionalText(400),
    primaryCta: linkSchema.optional(),
    secondaryCta: linkSchema.optional(),
    facts: z.array(text(80)).max(4).default([]),
    visual: z.enum(["globe", "none"]).default("globe"),
  }),
});

export const textBlock = z.object({
  ...base,
  type: z.literal("text"),
  data: z.object({
    eyebrow: optionalText(80),
    heading: optionalText(140),
    paragraphs: z.array(text(2000)).min(1).max(12),
  }),
});

export const imageTextBlock = z.object({
  ...base,
  type: z.literal("imageText"),
  data: z.object({
    heading: text(140),
    text: text(2000),
    image: z.object({ src: safeImageSrc, alt: z.string().trim().max(200) }),
    imagePosition: z.enum(["start", "end"]).default("end"),
    cta: linkSchema.optional(),
  }),
});

export const serviceGridBlock = z.object({
  ...base,
  type: z.literal("serviceGrid"),
  data: z.object({
    eyebrow: optionalText(80),
    heading: text(140),
    lead: optionalText(400),
    layout: z.enum(["explorer", "grid"]).default("explorer"),
    categories: z.array(z.enum(["growth", "search", "brand", "pr", "technology"])).default([]),
  }),
});

export const featureListBlock = z.object({
  ...base,
  type: z.literal("featureList"),
  data: z.object({
    eyebrow: optionalText(80),
    heading: text(140),
    lead: optionalText(400),
    items: z.array(z.object({ title: text(100), text: text(400) })).min(1).max(12),
  }),
});

export const processBlock = z.object({
  ...base,
  type: z.literal("process"),
  data: z.object({
    eyebrow: optionalText(80),
    heading: text(140),
    steps: z.array(z.object({ title: text(80), text: text(400) })).min(2).max(8),
  }),
});

/** Real, permission-confirmed testimonials only. Unconfirmed ones never render publicly. */
export const testimonialBlock = z.object({
  ...base,
  type: z.literal("testimonial"),
  data: z.object({
    quote: text(800),
    name: text(80),
    role: optionalText(80),
    company: optionalText(80),
    permissionConfirmed: z.boolean().default(false),
  }),
});

/** Case studies must come from real, verified projects. Unverified ones never render publicly. */
export const caseStudyBlock = z.object({
  ...base,
  type: z.literal("caseStudy"),
  data: z.object({
    title: text(140),
    client: text(100),
    challenge: text(1000),
    approach: text(1000),
    outcome: text(1000),
    link: linkSchema.optional(),
    verified: z.boolean().default(false),
  }),
});

export const faqBlock = z.object({
  ...base,
  type: z.literal("faq"),
  data: z.object({
    heading: text(140),
    items: z.array(z.object({ q: text(200), a: text(1500) })).min(1).max(20),
  }),
});

export const ctaBlock = z.object({
  ...base,
  type: z.literal("cta"),
  data: z.object({ title: text(140), text: optionalText(400), button: linkSchema }),
});

export const contactFormBlock = z.object({
  ...base,
  type: z.literal("contactForm"),
  data: z.object({ heading: text(140), lead: optionalText(400) }),
});

/** "3D visual section": the AI workforce network or the globe. */
export const visualBlock = z.object({
  ...base,
  type: z.literal("visual"),
  data: z.object({
    eyebrow: optionalText(80),
    heading: text(140),
    lead: optionalText(600),
    points: z.array(text(200)).max(6).default([]),
    visual: z.enum(["workforce", "globe"]).default("workforce"),
  }),
});

export const blockSchema = z.discriminatedUnion("type", [
  heroBlock,
  textBlock,
  imageTextBlock,
  serviceGridBlock,
  featureListBlock,
  processBlock,
  testimonialBlock,
  caseStudyBlock,
  faqBlock,
  ctaBlock,
  contactFormBlock,
  visualBlock,
]);

export type Block = z.infer<typeof blockSchema>;
export type BlockType = Block["type"];
export const blockTypes = blockSchema.options.map((o) => o.shape.type.value) as BlockType[];

export const pageBlocksSchema = z
  .array(blockSchema)
  .max(40)
  .superRefine((blocks, ctx) => {
    const ids = new Set<string>();
    blocks.forEach((b, i) => {
      if (ids.has(b.id)) ctx.addIssue({ code: "custom", path: [i, "id"], message: "Duplicate block id" });
      ids.add(b.id);
    });
    if (blocks.filter((b) => b.type === "hero").length > 1) {
      ctx.addIssue({ code: "custom", message: "A page can only have one hero block" });
    }
  });

export const pageMetaSchema = z.object({
  title: text(70),
  description: text(170),
});

export const pageLocaleContentSchema = z.object({
  meta: pageMetaSchema,
  blocks: pageBlocksSchema,
});

export type PageLocaleContent = z.infer<typeof pageLocaleContentSchema>;

/** Editable pages. "home" and "about" are fixed routes; others are landing pages at /landing/<slug>. */
export const pageSlugSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(60);

export const localeEnum = z.enum(locales);

/** Turns a zod error into short, human-readable messages for the editor. */
export function describeIssues(error: z.ZodError): string[] {
  return error.issues.slice(0, 8).map((i) => {
    const where = i.path.length ? `${i.path.join(" › ")}: ` : "";
    return `${where}${i.message}`;
  });
}
