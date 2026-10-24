import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/config/site";
import { localeMeta, locales } from "@/i18n/config";
import { localizedPath } from "@/i18n/paths";
import { publicPaths } from "@/lib/seo/public-paths";

export default function sitemap(): MetadataRoute.Sitemap {
  return publicPaths().flatMap((path) => {
    const languages = Object.fromEntries(locales.map((l) => [localeMeta[l].hreflang, absoluteUrl(localizedPath(l, path))]));
    return locales.map((locale) => ({
      url: absoluteUrl(localizedPath(locale, path)),
      changeFrequency: "monthly" as const,
      priority: path === "/" ? 1 : path.startsWith("/services/") ? 0.8 : 0.6,
      alternates: { languages: { ...languages, "x-default": absoluteUrl(localizedPath("en", path)) } },
    }));
  });
}
