import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/en";
import { localizedPath } from "@/i18n/paths";

export type NavItem = { href: string; label: string };

export function getNavItems(locale: Locale, t: Dictionary): NavItem[] {
  return [
    { href: localizedPath(locale, "/services"), label: t.nav.services },
    { href: localizedPath(locale, "/about"), label: t.nav.about },
    { href: localizedPath(locale, "/contact"), label: t.nav.contact },
  ];
}
