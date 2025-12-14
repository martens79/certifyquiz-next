// ================================================================
// NEW FILE: src/lib/certs.ts
// Purpose: Shared types for certification list/detail payloads
// ----------------------------------------------------------------

export type Localized<T = string> = T | Record<string, T>;

export interface CertListItem {
  slug: string;
  title: Localized<string>;
  imageUrl?: string | null;
  level?: Localized<string> | null;
  description?: Localized<string> | null;

  /** opzionale: categoria visiva per colori coerenti (base, sicurezza, reti, ...) */
  category?: CategoryKey | null;
}

export interface CertDetail extends CertListItem {
  quizRoute?: string;
  topics?: Array<{ id?: number | string; slug?: string; title: Localized<string> }>;
  sections?: { topicsTitle?: Localized<string> };
  ctaButton?: Localized<string>;
  extraContent?: {
    learn?: { title?: Localized<string>; items?: Localized<string[]> };
    whyChoose?: { title?: Localized<string>; items?: Localized<string[]> };
    faq?: { title?: Localized<string>; items?: Localized<Array<{ q: string; a: string }>> };
  };
  seo?: {
    title?: Localized<string>;
    description?: Localized<string>;
  };
}

/* ======================  CATEGORY / STYLE HELPERS  ====================== */

export type CategoryKey =
  | "base"
  | "sicurezza"
  | "reti"
  | "cloud"
  | "database"
  | "programmazione"
  | "virtualizzazione"
  | "ai"
  | "default";

export type CatStyle = {
  /** bg pastello + bordo tenue + hover ring, coerenti con la Quiz Home */
  wrapper: string;
  /** header/splash della pagina */
  header: string;
};

export const CATEGORY_STYLES: Record<CategoryKey, CatStyle> = {
  // Blu (Base)
  base: {
    wrapper: "bg-blue-50 border border-blue-200 hover:ring-2 hover:ring-blue-200/70",
    header: "bg-blue-50 border border-blue-200",
  },
  // Rosso/Rosa (Sicurezza)
  sicurezza: {
    wrapper: "bg-red-50 border border-red-200 hover:ring-2 hover:ring-red-200/70",
    header: "bg-red-50 border border-red-200",
  },
  // Verde (Reti)
  reti: {
    wrapper: "bg-green-50 border border-green-200 hover:ring-2 hover:ring-green-200/70",
    header: "bg-green-50 border border-green-200",
  },
  // Lilla/Viola (Cloud)
  cloud: {
    wrapper: "bg-purple-50 border border-purple-200 hover:ring-2 hover:ring-purple-200/70",
    header: "bg-purple-50 border border-purple-200",
  },
  // Giallo (Database)
  database: {
    wrapper: "bg-yellow-50 border border-yellow-200 hover:ring-2 hover:ring-yellow-200/70",
    header: "bg-yellow-50 border border-yellow-200",
  },
  // Indaco/Turchese tenue (Programmazione)
  programmazione: {
    wrapper: "bg-teal-50 border border-teal-200 hover:ring-2 hover:ring-teal-200/70",
    header: "bg-teal-50 border border-teal-200",
  },
  // Arancio (Virtualizzazione)
  virtualizzazione: {
    wrapper: "bg-orange-50 border border-orange-200 hover:ring-2 hover:ring-orange-200/70",
    header: "bg-orange-50 border border-orange-200",
  },
  // Ciano (AI) — come nella home “originale”
  ai: {
    wrapper: "bg-cyan-50 border border-cyan-200 hover:ring-2 hover:ring-cyan-200/70",
    header: "bg-cyan-50 border border-cyan-200",
  },
  // Default neutro
  default: {
    wrapper: "bg-gray-50 border border-gray-200 hover:ring-2 hover:ring-gray-200/70",
    header: "bg-gray-50 border border-gray-200",
  },
};

export const getCategoryStyle = (key?: string | null): CatStyle => {
  const k = (key ?? "default").toLowerCase() as CategoryKey;
  return CATEGORY_STYLES[k] ?? CATEGORY_STYLES.default;
};

/**
 * Fallback slug → categoria.
 * Supporta sia gli slug "vecchi" del frontend (itfplus, a-plus, ...)
 * sia quelli reali del DB (/certifications).
 */
export const CERT_CATEGORY_BY_SLUG: Record<string, CategoryKey> = {
  // Base
  itfplus: "base",
  "comptia-itf-plus": "base",
  "a-plus": "base",
  "comptia-a-plus": "base",
  eipass: "base",
  ecdl: "base",
  pekit: "base",

  // Sicurezza
  "security-plus": "sicurezza",
  "comptia-security-plus": "sicurezza",
  ceh: "sicurezza",
  cissp: "sicurezza",
  cism: "sicurezza",
  "isc2-cc": "sicurezza",

  // Reti
  ccna: "reti",
  "comptia-network-plus": "reti",
  "cisco-ccst": "reti",
  "cisco-ccst-networking": "reti",
  jncie: "reti",
  f5: "reti",
  "f5-cts": "reti",

  // Cloud
  "aws-cloud-practitioner": "cloud",
  "comptia-cloud-plus": "cloud",
  "ibm-cloud-v5": "cloud",
  "aws-solutions-architect": "cloud",
  "azure-fundamentals": "cloud",
  "microsoft-azure-fundamentals": "cloud",
  "google-cloud": "cloud",

  // Database
  "microsoft-sql-server": "database",
  "oracle-database-sql": "database",
  oracle: "database",
  mysql: "database",
  "mysql-certification": "database",
  "mongodb-developer": "database",

  // Programmazione
  "java-se": "programmazione",
  python: "programmazione",
  javascript: "programmazione",
  "javascript-developer": "programmazione",
  csharp: "programmazione",
  "microsoft-csharp": "programmazione",
  typescript: "programmazione",
  kotlin: "programmazione",
  go: "programmazione",
  rust: "programmazione",
  swift: "programmazione",

  // Virtualizzazione
  "vmware-vcp": "virtualizzazione",
  "vmware-certified-professional": "virtualizzazione",
  "hyper-v": "virtualizzazione",
  "microsoft-virtualization": "virtualizzazione",

  // AI
  "google-tensorflow-developer": "ai",
  "google-tensorflow": "ai",
  pytorch: "ai",
  openai: "ai",
  "microsoft-ai-fundamentals": "ai",
  "microsoft-ai": "ai",
};

/* ======================  ID → SLUG HELPERS (per backToHref)  ====================== */

/**
 * Mappa certification_id (DB/backend) → slug usato nel frontend
 * per la route /[lang]/quiz/[slug].
 *
 * Gli slug qui sono presi 1:1 dalla tabella `certifications`
 * che hai in backend.
 */
export const CERT_SLUG_BY_ID: Record<number, string> = {
  1: "comptia-itf-plus",
  2: "comptia-a-plus",
  3: "eipass",
  4: "ecdl",
  5: "pekit",
  6: "comptia-security-plus",
  7: "cissp",
  8: "isc2-cc",
  9: "ceh",
  10: "ccna",
  11: "comptia-network-plus",
  12: "cisco-ccst",
  13: "comptia-cloud-plus",
  14: "ibm-cloud-v5",
  15: "aws-solutions-architect",
  16: "microsoft-azure-fundamentals",
  17: "oracle-database-sql",
  18: "microsoft-csharp",
  19: "python",
  20: "java-se",
  21: "javascript-developer",
  22: "vmware-certified-professional",
  23: "microsoft-virtualization",
  24: "microsoft-ai",
  25: "google-tensorflow",
  26: "mongodb-developer",
  27: "mysql-certification",
  28: "jncie",
  29: "f5",
  30: "microsoft-sql-server",
  31: "google-cloud",
  32: "aws-cloud-practitioner",
  33: "cisco-ccst-networking",
};

/**
 * Helper sicuro per ottenere lo slug di una certificazione
 * partendo dal suo `id` (proveniente dai quiz/topic del backend).
 *
 * Uso tipico:
 *   const certSlug = getCertSlugById(meta.topic.certification_id);
 *   const backToHref = certSlug
 *     ? `/${lang}/quiz/${certSlug}`
 *     : `/${lang}/quiz-home`;
 */
export const getCertSlugById = (id: number): string | null => {
  return CERT_SLUG_BY_ID[id] ?? null;
};
