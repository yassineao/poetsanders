import type { LocaleDictionary } from "../../interfaces/LocaleDictionary";
import type { Locale } from "../../interfaces/locale";
import { deCopy } from "./locales/de";
import { enCopy } from "./locales/en";
import { nlCopy } from "./locales/nl";

export type { LocaleDictionary } from "../../interfaces/LocaleDictionary";
export type { Locale } from "../../interfaces/locale";

export const locales = ["de", "en", "nl"] as const satisfies readonly Locale[];

export const dictionaries: Record<Locale, LocaleDictionary> = {
  de: deCopy,
  en: enCopy,
  nl: nlCopy,
};

export function isValidLocale(value: string): value is Locale {
  return locales.some((locale) => locale === value);
}

export function getDictionary(locale: Locale): LocaleDictionary {
  return dictionaries[locale];
}

export function getLanguageTag(locale: Locale): string {
  const languageTags: Record<Locale, string> = {
    de: "de-DE",
    en: "en-US",
    nl: "nl-NL",
  };

  return languageTags[locale];
}
