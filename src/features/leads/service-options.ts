import { categoryOrder, getServicesByCategory, serviceCategories } from "@/content/services";
import type { Locale } from "@/i18n/config";

/** Service checkbox options for the public forms (server-side helper). */
export function serviceOptions(locale: Locale) {
  return categoryOrder.flatMap((c) =>
    getServicesByCategory(c).map((s) => ({ value: s.slug, label: s.content[locale].title, group: serviceCategories[c][locale].label })),
  );
}
