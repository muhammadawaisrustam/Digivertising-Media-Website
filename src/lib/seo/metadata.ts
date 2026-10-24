import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { localeMeta, locales, type Locale } from "@/i18n/config";
import { localizedPath } from "@/i18n/paths";

type PageMetaInput = {
  locale: Locale;
  /** Language-neutral path, e.g. "/services/seo". */
  path: string;
  title: string;
  description: string;
  /** Use for the homepage so the title is not suffixed twice. */
  absoluteTitle?: boolean;
  /** Draft/legal/private pages that must stay out of search results. */
  noIndex?: boolean;
};

/** Canonical URL, hreflang alternates, Open Graph and robots for a public page. */
export function pageMetadata({ locale, path, title, description, absoluteTitle, noIndex }: PageMetaInput): Metadata {
  const url = localizedPath(locale, path);
  const languages: Record<string, string> = Object.fromEntries(
    locales.map((l) => [localeMeta[l].hreflang, localizedPath(l, path)]),
  );
  languages["x-default"] = localizedPath("en", path);

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: url, languages },
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      title,
      description,
      url,
      locale: localeMeta[locale].ogLocale,
      alternateLocale: locales.filter((l) => l !== locale).map((l) => localeMeta[l].ogLocale),
      images: [{ url: "/og-default.png", width: 1200, height: 630, alt: siteConfig.name }],
    },
    twitter: { card: "summary_large_image", title, description, images: ["/og-default.png"] },
    robots: noIndex ? { index: false, follow: true } : undefined,
  };
}
