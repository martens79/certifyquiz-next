// src/lib/paths.ts
export type Locale = "it" | "en" | "fr" | "es";

/* ------------------------------------------------------------------ */
/* INTERNAL HELPERS                                                    */
/* ------------------------------------------------------------------ */

const isLocale = (v: unknown): v is Locale =>
  v === "it" || v === "en" || v === "fr" || v === "es";

const toLocale = (v: unknown, fallback: Locale = "en"): Locale =>
  isLocale(v) ? v : fallback;

/* ------------------------------------------------------------------ */
/* CERTIFICATIONS                                                      */
/* ------------------------------------------------------------------ */

export const certPath = (lang: Locale, slug: string): string => {
  switch (lang) {
    case "it":
      return `/it/certificazioni/${slug}`;
    case "en":
      // ✅ EN = root (NO /en)
      return `/certifications/${slug}`;
    case "fr":
      return `/fr/certifications/${slug}`;
    case "es":
      return `/es/certificaciones/${slug}`;
    default:
      return `/it/certificazioni/${slug}`;
  }
};

/* ------------------------------------------------------------------ */
/* CATEGORIES                                                          */
/* ------------------------------------------------------------------ */

/**
 * ✅ CategoryKey = chiave interna stabile (NON slug, NON tradotta)
 * "default" serve per fallback safe quando lo slug non è mappato.
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

/** ✅ key → slug canonico per lingua (SEO) */
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

/** ✅ slug → key (reverse mapping) */
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

/** ✅ sezione URL per lingua */
const categorySection = (lang: Locale): string =>
  lang === "it" ? "categorie" : lang === "es" ? "categorias" : "categories";

/**
 * ✅ path builder categorie (ROBUSTO)
 * Accetta anche lang "sporco" / undefined in runtime e fa fallback a EN.
 */
export const categoryPath = (lang: unknown, key: CategoryKey): string => {
  const safeLang = toLocale(lang, "en");
  const prefix = safeLang === "en" ? "" : `/${safeLang}`;
  return `${prefix}/${categorySection(safeLang)}/${CAT_KEY_TO_SLUG[safeLang][key]}`;
};

/**
 * ✅ utile per wrapper dinamici: slug URL → key interna (ROBUSTO)
 * Se non trova lo slug, torna "default".
 */
export const categoryKeyFromSlug = (lang: unknown, slug: string): CategoryKey => {
  const safeLang = toLocale(lang, "en");
  return CAT_SLUG_TO_KEY[safeLang][slug] ?? "default";
};
