import type { Locale } from "./config";
import { ar } from "./dictionaries/ar";
import { en, type Dictionary } from "./dictionaries/en";

const dictionaries: Record<Locale, Dictionary> = { en, ar };

/** Dictionary for an explicit locale. Safe to use anywhere (server, client, tests). */
export function getDictionaryFor(locale: Locale): Dictionary {
  return dictionaries[locale];
}
