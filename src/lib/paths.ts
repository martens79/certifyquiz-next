// src/lib/paths.ts
// SINGLE SOURCE OF TRUTH FOR URL PATHS
// Regola: TUTTE le rotte sono /[lang]/... (EN incluso)

export type Locale = "it" | "en" | "fr" | "es";

/* ------------------------------------------------------------------ */
/* INTERNAL HELPERS                                                    */
/* ------------------------------------------------------------------ */

export const isLocale = (v: unknown): v is Locale =>
  v === "it" || v === "en" || v === "fr" || v === "es";

export const toLocale = (v: unknown, fallback: Locale = "en"): Locale =>
  isLocale(v) ? v : fallback;

/**
 * ✅ Prefisso lingua CANONICO
 * SEMPRE presente, anche per EN
 */
export const langPrefix = (lang: Locale): string => `/${lang}`;

/* ------------------------------------------------------------------ */
/* CERTIFICATIONS                                                      */
/* ------------------------------------------------------------------ */

/**
 * ✅ Path certificazione (CANONICO)
 * /it/certificazioni/...
 * /en/certifications/...
 * /fr/certifications/...
 * /es/certificaciones/...
 */
export const certPath = (lang: Locale, slug: string): string => {
  switch (lang) {
    case "it":
      return `/it/certificazioni/${slug}`;
    case "en":
      return `/en/certifications/${slug}`;
    case "fr":
      return `/fr/certifications/${slug}`;
    case "es":
      return `/es/certificaciones/${slug}`;
    default:
      return `/en/certifications/${slug}`;
  }
};

/* ------------------------------------------------------------------ */
/* CATEGORIES                                                          */
/* ------------------------------------------------------------------ */

/**
 * ✅ CategoryKey = chiave interna stabile
 */
export type CategoryKey =
  | "default"
  | "base"
  | "sicurezza"
  | "reti"
  | "cloud"
  | "database"
  | "programmazione"
  | "virtualizzazione"
  | "ai";

/**
 * ✅ key → slug canonico per lingua
 */
export const CAT_KEY_TO_SLUG: Record<Locale, Record<CategoryKey, string>> = {
  it: {
    default: "base",
    base: "base",
    sicurezza: "sicurezza",
    reti: "reti",
    cloud: "cloud",
    database: "database",
    programmazione: "programmazione",
    virtualizzazione: "virtualizzazione",
    ai: "intelligenza-artificiale",
  },
  en: {
    default: "fundamentals",
    base: "fundamentals",
    sicurezza: "security",
    reti: "networking",
    cloud: "cloud",
    database: "databases",
    programmazione: "programming",
    virtualizzazione: "virtualization",
    ai: "artificial-intelligence",
  },
  fr: {
    default: "fondamentaux",
    base: "fondamentaux",
    sicurezza: "securite",
    reti: "reseaux",
    cloud: "cloud",
    database: "bases-de-donnees",
    programmazione: "programmation",
    virtualizzazione: "virtualisation",
    ai: "intelligence-artificielle",
  },
  es: {
    default: "fundamentos",
    base: "fundamentos",
    sicurezza: "seguridad",
    reti: "redes",
    cloud: "cloud",
    database: "bases-de-datos",
    programmazione: "programacion",
    virtualizzazione: "virtualizacion",
    ai: "inteligencia-artificial",
  },
};

/**
 * ✅ slug → key interna
 */
export const CAT_SLUG_TO_KEY: Record<Locale, Record<string, CategoryKey>> = {
  it: {
    base: "base",
    sicurezza: "sicurezza",
    reti: "reti",
    cloud: "cloud",
    database: "database",
    programmazione: "programmazione",
    virtualizzazione: "virtualizzazione",
    "intelligenza-artificiale": "ai",
  },
  en: {
    fundamentals: "base",
    security: "sicurezza",
    networking: "reti",
    cloud: "cloud",
    databases: "database",
    programming: "programmazione",
    virtualization: "virtualizzazione",
    "artificial-intelligence": "ai",
  },
  fr: {
    fondamentaux: "base",
    securite: "sicurezza",
    reseaux: "reti",
    cloud: "cloud",
    "bases-de-donnees": "database",
    programmation: "programmazione",
    virtualisation: "virtualizzazione",
    "intelligence-artificielle": "ai",
  },
  es: {
    fundamentos: "base",
    seguridad: "sicurezza",
    redes: "reti",
    cloud: "cloud",
    "bases-de-datos": "database",
    programacion: "programmazione",
    virtualizacion: "virtualizzazione",
    "inteligencia-artificial": "ai",
  },
};

/* ------------------------------------------------------------------ */
/* CATEGORY PATH HELPERS                                               */
/* ------------------------------------------------------------------ */

const categorySection = (lang: Locale): string =>
  lang === "it"
    ? "categorie"
    : lang === "es"
    ? "categorias"
    : "categories";

/**
 * ✅ Path categoria CANONICO
 * Accetta lang sporco ma RESTITUISCE SEMPRE /[lang]/...
 */
export const categoryPath = (lang: unknown, key: CategoryKey): string => {
  const safeLang = toLocale(lang, "en");
  return `${langPrefix(safeLang)}/${categorySection(
    safeLang
  )}/${CAT_KEY_TO_SLUG[safeLang][key]}`;
};

/**
 * ✅ slug URL → key interna
 * fallback: "default"
 */
export const categoryKeyFromSlug = (
  lang: unknown,
  slug: string
): CategoryKey => {
  const safeLang = toLocale(lang, "en");
  return CAT_SLUG_TO_KEY[safeLang][slug] ?? "default";
};
