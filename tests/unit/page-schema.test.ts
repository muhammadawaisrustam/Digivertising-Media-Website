import { describe, expect, it } from "vitest";
import { blockSchema, blockTypes, pageLocaleContentSchema, type PageLocaleContent } from "@/features/pages/schema";
import { blankLandingPage, seedPage } from "@/features/pages/seed";
import { createBlock } from "@/features/studio/editor/block-fields";

describe("page content schema", () => {
  it("accepts the built-in home and about pages in both languages", () => {
    for (const slug of ["home", "about"]) {
      for (const locale of ["en", "ar"] as const) {
        const page = seedPage(slug, locale);
        const result = pageLocaleContentSchema.safeParse(page);
        expect(result.success, `${slug}/${locale}: ${!result.success && JSON.stringify(result.error.issues)}`).toBe(true);
      }
    }
    expect(pageLocaleContentSchema.safeParse(blankLandingPage("Test page")).success).toBe(true);
  });

  it("creates a valid starting block for every block type", () => {
    expect(blockTypes).toHaveLength(12);
    for (const type of blockTypes) {
      const block = createBlock(type);
      expect(blockSchema.safeParse(block).success, type).toBe(true);
    }
  });

  it("blocks unsafe links and images", () => {
    const cta = createBlock("cta");
    for (const href of ["javascript:alert(1)", "data:text/html,hi", "//evil.example", "http://insecure.example"]) {
      const bad = { ...cta, data: { ...cta.data, button: { label: "Go", href } } };
      expect(blockSchema.safeParse(bad).success, href).toBe(false);
    }
    for (const href of ["/contact", "/ar/contact", "https://example.com/page", "mailto:hello@example.com", "#faq"]) {
      const ok = { ...cta, data: { ...cta.data, button: { label: "Go", href } } };
      expect(blockSchema.safeParse(ok).success, href).toBe(true);
    }
    const img = createBlock("imageText");
    expect(blockSchema.safeParse({ ...img, data: { ...img.data, image: { src: "javascript:x", alt: "" } } }).success).toBe(false);
  });

  it("rejects empty required text, duplicate ids and a second hero", () => {
    const page = seedPage("home", "en")!;
    const emptyTitle = structuredClone(page);
    (emptyTitle.blocks[0]!.data as { title: string }).title = "   ";
    expect(pageLocaleContentSchema.safeParse(emptyTitle).success).toBe(false);

    const dup: PageLocaleContent = { ...page, blocks: [...page.blocks, { ...page.blocks[1]! }] };
    expect(pageLocaleContentSchema.safeParse(dup).success).toBe(false);

    const twoHeroes: PageLocaleContent = { ...page, blocks: [...page.blocks, { ...page.blocks[0]!, id: "second-hero" }] };
    expect(pageLocaleContentSchema.safeParse(twoHeroes).success).toBe(false);
  });

  it("limits search title and description length", () => {
    const page = seedPage("about", "en")!;
    expect(pageLocaleContentSchema.safeParse({ ...page, meta: { ...page.meta, title: "x".repeat(71) } }).success).toBe(false);
    expect(pageLocaleContentSchema.safeParse({ ...page, meta: { ...page.meta, description: "x".repeat(171) } }).success).toBe(false);
  });
});
