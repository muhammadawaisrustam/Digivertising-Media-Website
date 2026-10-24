import { defaultLocale, isLocale, locales, type Locale } from "./config";

/**
 * Builds the public URL path for a page in a given language.
 * localizedPath("en", "/about") -> "/about"
 * localizedPath("ar", "/about") -> "/ar/about"
 */
export function localizedPath(locale: Locale, path: string): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  if (locale === defaultLocale) return clean;
  return clean === "/" ? `/${locale}` : `/${locale}${clean}`;
}

/** Splits a public pathname into its language and the language-neutral path. */
export function splitLocale(pathname: string): { locale: Locale; path: string } {
  const segments = pathname.split("/");
  const first = segments[1] ?? "";
  if (isLocale(first)) {
    const rest = "/" + segments.slice(2).join("/");
    return { locale: first, path: rest === "/" ? "/" : rest.replace(/\/$/, "") };
  }
  return { locale: defaultLocale, path: pathname || "/" };
}

/** The same page in another language. */
export function switchLocalePath(pathname: string, target: Locale): string {
  return localizedPath(target, splitLocale(pathname).path);
}

export function alternatePaths(path: string): Record<Locale, string> {
  return Object.fromEntries(locales.map((l) => [l, localizedPath(l, path)])) as Record<Locale, string>;
}
