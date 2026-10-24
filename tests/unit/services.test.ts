import { describe, expect, it } from "vitest";
import { getRelatedServices, getService, services } from "@/content/services";
import { serviceSlugs } from "@/content/services/slugs";

const requiredSlugs = [
  "digital-marketing", "google-ads", "meta-ads", "seo", "aeo-ai-search", "social-media",
  "content-marketing", "email-marketing", "lead-generation", "analytics-cro", "branding",
  "graphic-design", "video-production", "public-relations", "personal-branding",
  "reputation-management", "wordpress", "web-development", "ecommerce", "mobile-apps",
  "backend-apis", "erp-crm", "automation-ai-agents", "ui-ux-3d",
];

describe("service content", () => {
  it("contains every required service exactly once", () => {
    const slugs = services.map((s) => s.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect([...slugs].sort()).toEqual([...requiredSlugs].sort());
  });

  it("keeps the proxy slug list in sync with the content", () => {
    expect([...serviceSlugs].sort()).toEqual(services.map((s) => s.slug).sort());
  });

  it("only links to related services that exist and are not itself", () => {
    for (const s of services) {
      expect(getRelatedServices(s).length, s.slug).toBe(s.related.length);
      expect(s.related, s.slug).not.toContain(s.slug);
    }
  });

  it("has unique titles and meta descriptions per language", () => {
    for (const lang of ["en", "ar"] as const) {
      const titles = services.map((s) => s.content[lang].metaTitle);
      const descs = services.map((s) => s.content[lang].metaDescription);
      expect(new Set(titles).size).toBe(titles.length);
      expect(new Set(descs).size).toBe(descs.length);
    }
  });

  it("does not make guarantee claims in English copy", () => {
    const risky = /\b(we guarantee|guaranteed (rankings|results|leads)|#1 on google)\b/i;
    for (const s of services) {
      expect(JSON.stringify(s.content.en), s.slug).not.toMatch(risky);
    }
  });

  it("Arabic copy is actually Arabic", () => {
    for (const s of services) expect(s.content.ar.title, s.slug).toMatch(/[؀-ۿ]/);
  });

  it("returns undefined for unknown slugs", () => {
    expect(getService("not-a-service")).toBeUndefined();
  });
});
