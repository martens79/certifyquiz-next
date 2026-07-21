// src/lib/paths.ts
// SINGLE SOURCE OF TRUTH FOR URL PATHS
// Regola:
// - SEO pages → EN senza /en
// - QUIZ → sempre /{lang}

export type Locale = "it" | "en" | "fr" | "es";

/* ------------------------------------------------------------------ */
/* LOCALE HELPERS                                                      */
/* ------------------------------------------------------------------ */

export const isLocale = (v: unknown): v is Locale =>
  v === "it" || v === "en" || v === "fr" || v === "es";

export const toLocale = (v: unknown, fallback: Locale = "en"): Locale =>
  isLocale(v) ? v : fallback;

/* ------------------------------------------------------------------ */
/* PREFIXES                                                            */
/* ------------------------------------------------------------------ */

/**
 * ✅ SEO prefix
 * EN  → ""
 * ALT → /it /fr /es
 */
export const seoPrefix = (lang: Locale): string =>
  lang === "en" ? "" : `/${lang}`;

/**
 * ✅ QUIZ prefix
 * SEMPRE /{lang}
 */
export const quizPrefix = (lang: Locale): string => `/${lang}`;

/* ------------------------------------------------------------------ */
/* CERTIFICATIONS (SEO)                                                 */
/* ------------------------------------------------------------------ */

/**
 * /certifications/...
 * /it/certificazioni/...
 * /fr/certifications/...
 * /es/certificaciones/...
 */
export const certPath = (lang: Locale, slug: string): string => {
  switch (lang) {
    case "it":
      return `/it/certificazioni/${slug}`;
    case "en":
      return `/certifications/${slug}`;
    case "fr":
      return `/fr/certifications/${slug}`;
    case "es":
      return `/es/certificaciones/${slug}`;
    default:
      return `/certifications/${slug}`;
  }
};

export const certificationsPath = (lang: Locale): string => {
  switch (lang) {
    case "it":
      return `/it/certificazioni`;
    case "en":
      return `/certifications`;
    case "fr":
      return `/fr/certifications`;
    case "es":
      return `/es/certificaciones`;
    default:
      return `/certifications`;
  }
};

export const certSeoPath = (lang: Locale, certSlug: string): string => {
  if (lang === "en") return `/certifications/${certSlug}`;
  if (lang === "it") return `/it/certificazioni/${certSlug}`;
  if (lang === "fr") return `/fr/certifications/${certSlug}`;
  return `/es/certificaciones/${certSlug}`;
};

export const topicSeoPath = (
  lang: Locale,
  certSlug: string,
  topicSlug: string
): string => {
  if (lang === "en") return `/certifications/${certSlug}/${topicSlug}`;
  if (lang === "it") return `/it/certificazioni/${certSlug}/${topicSlug}`;
  if (lang === "fr") return `/fr/certifications/${certSlug}/${topicSlug}`;
  return `/es/certificaciones/${certSlug}/${topicSlug}`;
};
/* ------------------------------------------------------------------ */
/* CATEGORIES (SEO)                                                     */
/* ------------------------------------------------------------------ */

export type CategoryKey =
  | "default"
  | "base"
  | "sicurezza"
  | "reti"
  | "cloud"
  | "database"
  | "programmazione"
  | "virtualizzazione"
  | "management"
  | "ai"
  | "data-analytics"
  | "foundations";

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
    management: "management",
    ai: "intelligenza-artificiale",
    "data-analytics": "analisi-dei-dati",
    foundations: "fondamenti",
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
    management: "management",
    ai: "artificial-intelligence",
    "data-analytics": "data-analytics",
    foundations: "foundations",
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
    management: "management",
    ai: "intelligence-artificielle",
    "data-analytics": "analyse-des-donnees",
    foundations: "fondamentaux",
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
    management: "gestion-management",
    ai: "inteligencia-artificial",
    "data-analytics": "analisis-de-datos",
    foundations: "fundamentos",
  },
};

export const CAT_SLUG_TO_KEY: Record<Locale, Record<string, CategoryKey>> = {
  it: {
    base: "base",
    sicurezza: "sicurezza",
    reti: "reti",
    cloud: "cloud",
    database: "database",
    programmazione: "programmazione",
    virtualizzazione: "virtualizzazione",
    management: "management",
    "intelligenza-artificiale": "ai",
    "analisi-dei-dati": "data-analytics",
    fondamenti: "foundations",
  },

  en: {
    fundamentals: "base",
    security: "sicurezza",
    networking: "reti",
    cloud: "cloud",
    databases: "database",
    programming: "programmazione",
    virtualization: "virtualizzazione",
    management: "management",
    "artificial-intelligence": "ai",
    "data-analytics": "data-analytics",
    foundations: "foundations",
  },

 fr: {
  bases: "base",
  securite: "sicurezza",
  reseaux: "reti",
  cloud: "cloud",
  "bases-de-donnees": "database",
  programmation: "programmazione",
  virtualisation: "virtualizzazione",
  management: "management",
  "intelligence-artificielle": "ai",
  "analyse-des-donnees": "data-analytics",
  fondamentaux: "foundations",
},

es: {
  basico: "base",
  seguridad: "sicurezza",
  redes: "reti",
  cloud: "cloud",
  "bases-de-datos": "database",
  programacion: "programmazione",
  virtualizacion: "virtualizzazione",
  "gestion-management": "management",
  "inteligencia-artificial": "ai",
  "analisis-de-datos": "data-analytics",
  fundamentos: "foundations",
},
};

const categorySection = (lang: Locale): string =>
  lang === "it"
    ? "categorie"
    : lang === "es"
    ? "categorias"
    : "categories";

/**
 * /categories/security
 * /it/categorie/sicurezza
 * /fr/categories/securite
 * /es/categorias/seguridad
 */
export const categoryPath = (lang: unknown, key: CategoryKey): string => {
  const safeLang = toLocale(lang, "en");
  const base = seoPrefix(safeLang);
  const section = categorySection(safeLang);
  const slug = CAT_KEY_TO_SLUG[safeLang][key];

  return base ? `${base}/${section}/${slug}` : `/${section}/${slug}`;
};

export const categoryKeyFromSlug = (
  lang: unknown,
  slug: string
): CategoryKey => {
  const safeLang = toLocale(lang, "en");
  return CAT_SLUG_TO_KEY[safeLang][slug] ?? "default";
};
/* ------------------------------------------------------------------ */
/* BLOG (sempre con lingua)                                            */
/* ------------------------------------------------------------------ */

export const blogPath = (lang: Locale, slug: string): string => {
  const clean = slug.replace(/^\/+/, "");
  return `/${lang}/blog/${clean}`;
};

export const blogIndexPath = (lang: Locale): string => {
  return `/${lang}/blog`;
};

/* ------------------------------------------------------------------ */
/* PRICING / PREMIUM (SEO)                                             */
/* ------------------------------------------------------------------ */

export const PRICING_SLUG_BY_LANG: Record<Locale, string> = {
  it: "prezzi",
  en: "pricing",
  fr: "prix",
  es: "precios",
};

export const pricingPath = (lang: Locale): string => {
  const base = seoPrefix(lang); // EN -> "" ; altri -> "/it|/fr|/es"
  const slug = PRICING_SLUG_BY_LANG[lang];
  return base ? `${base}/${slug}` : `/${slug}`;
};

/* ------------------------------------------------------------------ */
/* GUIDE PDF (SEO)                                                      */
/* ------------------------------------------------------------------ */

export const GUIDES_SLUG_BY_LANG: Record<Locale, string> = {
  it: "guide",
  en: "guide",
  fr: "guides",
  es: "guias",
};

export const guidesPath = (lang: Locale): string => {
  const base = seoPrefix(lang); // EN -> "" ; altri -> "/it|/fr|/es"
  const slug = GUIDES_SLUG_BY_LANG[lang];
  return base ? `${base}/${slug}` : `/${slug}`;
};

export const guidePath = (lang: Locale, slug: string): string =>
  `${guidesPath(lang)}/${slug}`;

/* ------------------------------------------------------------------ */
/* QUIZ (sempre con lingua)                                            */
/* ------------------------------------------------------------------ */

export const quizHomePath = (lang: Locale): string =>
  `/${lang}/quiz-home`;

export const quizTopicPath = (
  lang: Locale,
  certSlug: string,
  topicId: number
): string =>
  `/${lang}/quiz/${certSlug}/topic/${topicId}`;

export const mixedQuizPath = (
  lang: Locale,
  certSlug: string
): string =>
  `/${lang}/quiz/${certSlug}/mixed`;


  export const reviewErrorsPath = (params?: {
  certificationId?: string;
  topicId?: string;
  limit?: number | string;
}) => {
  const qs = new URLSearchParams();
  if (params?.certificationId) qs.set("certificationId", String(params.certificationId));
  if (params?.topicId) qs.set("topicId", String(params.topicId));
  if (params?.limit != null) qs.set("limit", String(params.limit));

  const q = qs.toString();
  return `/review/errors${q ? `?${q}` : ""}`;
};


/* ------------------------------------------------------------------ */
/* LANGUAGE SWITCH — URL SAFE (SEO + QUIZ + BLOG)                      */
/* ------------------------------------------------------------------ */
/**
 * Usare SOLO per il cambio lingua dal menu header.
 * NON usare per costruire link.
 */

const LOCALES = ["it", "en", "fr", "es"] as const;

export function switchLangPathname(
  pathname: string,
  nextLang: Locale
): string {
  // Pulizia query e hash
  const cleanPath = pathname.split("?")[0].split("#")[0];

  /* ----------------------------- QUIZ ----------------------------- */
  // /{lang}/quiz/... → cambia SOLO la lingua
  const quizRegex = new RegExp(`^/(${LOCALES.join("|")})/quiz(/|$)`);
  if (quizRegex.test(cleanPath)) {
    return cleanPath.replace(quizRegex, `/${nextLang}/quiz$2`);
  }

  /* ----------------------------- BLOG ----------------------------- */
  // BLOG è SEMPRE /{lang}/blog/...
  const blogRegex = new RegExp(`^/(${LOCALES.join("|")})/blog(/|$)`);
  if (blogRegex.test(cleanPath)) {
    return cleanPath.replace(blogRegex, `/${nextLang}/blog$2`);
  }

  // Caso legacy /blog/... (EN normalizzato dal middleware)
  if (cleanPath === "/blog" || cleanPath.startsWith("/blog/")) {
    return `/${nextLang}${cleanPath}`;
  }

  /* ------------------------------ SEO ------------------------------ */
  // EN senza prefisso, altre lingue con /{lang}
  const seoRegex = new RegExp(`^/(${LOCALES.join("|")})(/|$)`);
  const pathWithoutLang = cleanPath.replace(seoRegex, "/");

  return nextLang === "en"
    ? pathWithoutLang
    : `/${nextLang}${pathWithoutLang}`;
}

