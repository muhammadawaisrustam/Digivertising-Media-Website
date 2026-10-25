import type { Locale } from "@/i18n/config";
import { getDictionaryFor } from "@/i18n/get-dictionary-static";
import { localizedPath } from "@/i18n/paths";
import type { PageLocaleContent } from "./schema";

/**
 * Default (built-in) versions of the editable pages. They are used until the
 * owner publishes an edited version, so the site always has valid content even
 * with an empty database.
 */
export const editablePages = {
  home: { path: "/", label: "Homepage" },
  about: { path: "/about", label: "About" },
} as const;

export type FixedPageSlug = keyof typeof editablePages;

export function isFixedPage(slug: string): slug is FixedPageSlug {
  return slug in editablePages;
}

/** Public path for any editable page. Landing pages live under /landing/<slug>. */
export function pagePath(slug: string): string {
  return isFixedPage(slug) ? editablePages[slug].path : `/landing/${slug}`;
}

const s = { background: "default", spacing: "normal", align: "start" } as const;
const subtle = { ...s, background: "subtle" } as const;

export function seedPage(slug: string, locale: Locale): PageLocaleContent | null {
  const t = getDictionaryFor(locale);
  const lp = (p: string) => localizedPath(locale, p);
  const h = t.home;

  if (slug === "home") {
    return {
      meta: { title: `${t.meta.titleSuffix} | ${h.metaTitle}`.slice(0, 70), description: t.meta.siteDescription.slice(0, 170) },
      blocks: [
        {
          id: "home-hero", type: "hero", settings: s,
          data: {
            eyebrow: h.hero.eyebrow, title: h.hero.title, titleAccent: h.hero.titleAccent, lead: h.hero.lead,
            primaryCta: { label: t.common.startProject, href: lp("/request-a-proposal") },
            secondaryCta: { label: t.common.exploreServices, href: lp("/services") },
            facts: h.hero.facts, visual: "globe",
          },
        },
        {
          id: "home-services", type: "serviceGrid", settings: s,
          data: { eyebrow: h.services.eyebrow, heading: h.services.title, lead: h.services.lead, layout: "explorer", categories: [] },
        },
        {
          id: "home-process", type: "process", settings: subtle,
          data: { eyebrow: h.process.eyebrow, heading: h.process.title, steps: h.process.steps },
        },
        {
          id: "home-workforce", type: "visual", settings: s,
          data: { eyebrow: h.workforce.eyebrow, heading: h.workforce.title, lead: h.workforce.lead, points: h.workforce.points, visual: "workforce" },
        },
        {
          id: "home-principles", type: "featureList", settings: subtle,
          data: { eyebrow: h.principles.eyebrow, heading: h.principles.title, lead: "", items: h.principles.items },
        },
        {
          id: "home-cta", type: "cta", settings: s,
          data: { title: h.cta.title, text: h.cta.text, button: { label: t.common.startProject, href: lp("/request-a-proposal") } },
        },
      ],
    };
  }

  if (slug === "about") {
    const a = t.about;
    return {
      meta: { title: a.metaTitle, description: a.metaDescription },
      blocks: [
        { id: "about-hero", type: "hero", settings: s, data: { eyebrow: a.eyebrow, title: a.title, titleAccent: "", lead: a.lead, facts: [], visual: "none" } },
        { id: "about-believe", type: "text", settings: s, data: { eyebrow: "", heading: a.positioningHeading, paragraphs: a.positioning } },
        { id: "about-values", type: "featureList", settings: subtle, data: { eyebrow: "", heading: a.valuesHeading, lead: "", items: a.values } },
        { id: "about-process", type: "process", settings: s, data: { eyebrow: "", heading: a.processHeading, steps: h.process.steps } },
        {
          id: "about-cta", type: "cta", settings: s,
          data: { title: h.cta.title, text: h.cta.text, button: { label: t.common.startProject, href: lp("/request-a-proposal") } },
        },
      ],
    };
  }

  return null;
}

/** A blank starting point for a new landing page. */
export function blankLandingPage(title: string): PageLocaleContent {
  return {
    meta: { title: title.slice(0, 70), description: `${title}. Learn how Digivertising Media & PR can help.`.slice(0, 170) },
    blocks: [
      { id: "lp-hero", type: "hero", settings: s, data: { eyebrow: "", title, titleAccent: "", lead: "", facts: [], visual: "none" } },
      { id: "lp-cta", type: "cta", settings: s, data: { title: "Ready to talk?", text: "", button: { label: "Request a proposal", href: "/request-a-proposal" } } },
    ],
  };
}
