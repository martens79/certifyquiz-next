import { type Locale } from "@/lib/i18n";

export const LEGAL_PAGES = {
  privacy:  { it: "privacy",     en: "privacy",      fr: "confidentialite", es: "privacidad" },
  terms:    { it: "termini",     en: "terms",        fr: "conditions",      es: "terminos" },
  cookies:  { it: "cookie",      en: "cookies",      fr: "cookies",         es: "cookies" },
  contact:  { it: "contatti",    en: "contact",      fr: "contact",         es: "contacto" },
} as const;

export type LegalKey = keyof typeof LEGAL_PAGES;

const prefix = (lang: Locale) => (lang === "en" ? "" : `/${lang}`);

export function legalPath(lang: Locale, key: LegalKey) {
  return `${prefix(lang)}/${LEGAL_PAGES[key][lang]}`;
}
