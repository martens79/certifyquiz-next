// src/lib/prettyPaths.ts
// Mappa centralizzata delle "pretty URLs" (slug localizzati)

export type Lang = "it" | "en" | "fr" | "es";

// LISTE certificazioni
const list = {
  it: "/it/certificazioni",
  en: "/en/certifications",
  fr: "/fr/certifications",
  es: "/es/certificaciones",
} as const;

// PAGINA prezzi
const pricing = {
  it: "/it/prezzi",
  en: "/en/pricing",
  fr: "/fr/tarifs",
  es: "/es/precios",
} as const;

// DETTAGLI certificazioni (funzioni perché serve lo slug)
const detail = {
  it: (slug: string) => `/it/certificazioni/${slug}`,
  en: (slug: string) => `/en/certifications/${slug}`,
  fr: (slug: string) => `/fr/certifications/${slug}`,
  es: (slug: string) => `/es/certificaciones/${slug}`,
} as const;

// Helpers esportati
export function prettyList(lang: Lang): string {
  return list[lang];
}

export function prettyPricing(lang: Lang): string {
  return pricing[lang];
}

export function prettyDetail(lang: Lang, slug: string): string {
  return detail[lang](slug);
}
