export const locales = ["en", "ar"] as const;
export type Locale = (typeof locales)[number];

/** English is served without a prefix (/about); Arabic lives under /ar (/ar/about). */
export const defaultLocale: Locale = "en";

export const localeMeta: Record<Locale, { dir: "ltr" | "rtl"; label: string; hreflang: string; ogLocale: string }> = {
  en: { dir: "ltr", label: "English", hreflang: "en", ogLocale: "en_US" },
  ar: { dir: "rtl", label: "العربية", hreflang: "ar", ogLocale: "ar_AR" },
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
