// ================================================================
// FILE: src/lib/certs.ts
// Purpose: Shared types + category helpers + (derived) slug/id maps
// ----------------------------------------------------------------

import { CERTS } from "@/certifications/registry";

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
  base: {
    wrapper: "bg-blue-50 border border-blue-200 hover:ring-2 hover:ring-blue-200/70",
    header: "bg-blue-50 border border-blue-200",
  },
  sicurezza: {
    wrapper: "bg-red-50 border border-red-200 hover:ring-2 hover:ring-red-200/70",
    header: "bg-red-50 border border-red-200",
  },
  reti: {
    wrapper: "bg-green-50 border border-green-200 hover:ring-2 hover:ring-green-200/70",
    header: "bg-green-50 border border-green-200",
  },
  cloud: {
    wrapper: "bg-purple-50 border border-purple-200 hover:ring-2 hover:ring-purple-200/70",
    header: "bg-purple-50 border border-purple-200",
  },
  database: {
    wrapper: "bg-yellow-50 border border-yellow-200 hover:ring-2 hover:ring-yellow-200/70",
    header: "bg-yellow-50 border border-yellow-200",
  },
  programmazione: {
    wrapper: "bg-teal-50 border border-teal-200 hover:ring-2 hover:ring-teal-200/70",
    header: "bg-teal-50 border border-teal-200",
  },
  virtualizzazione: {
    wrapper: "bg-orange-50 border border-orange-200 hover:ring-2 hover:ring-orange-200/70",
    header: "bg-orange-50 border border-orange-200",
  },
  ai: {
    wrapper: "bg-cyan-50 border border-cyan-200 hover:ring-2 hover:ring-cyan-200/70",
    header: "bg-cyan-50 border border-cyan-200",
  },
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
 * Supporta sia gli slug "vecchi" del frontend sia quelli reali del DB.
 */
export const CERT_CATEGORY_BY_SLUG: Record<string, CategoryKey> = {
  // Base
  itfplus: "base",
  "comptia-itf-plus": "base",
  "a-plus": "base",
  "comptia-a-plus": "base",
  eipass: "base",
  ecdl: "base",
  icdl: "base",
  pekit: "base",

  // Sicurezza
  "security-plus": "sicurezza",
  "comptia-security-plus": "sicurezza", // alias vecchio (categoria)
  ceh: "sicurezza",
  cissp: "sicurezza",
  cism: "sicurezza",
  "isc2-cc": "sicurezza",
  "cisco-ccst-security": "sicurezza",
  "cisco-ccst-cybersecurity": "sicurezza", // alias vecchio (categoria)

  // Reti
  ccna: "reti",
  "comptia-network-plus": "reti",
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

/* ======================  ID <-> SLUG (DERIVED)  ====================== */

/**
 * ✅ Single source of truth:
 * Deriva le mappe da CERTS (registry), così non vanno mai fuori sync.
 */
export const CERT_SLUG_BY_ID: Record<number, string> = Object.fromEntries(
  CERTS.map((c) => [c.id, c.slug])
) as Record<number, string>;

export const CERT_ID_BY_SLUG: Record<string, number> = Object.fromEntries(
  CERTS.map((c) => [c.slug, c.id])
) as Record<string, number>;

/**
 * Alias compat / vecchi link.
 * (Se non esiste il target, l’assegnazione resta undefined → safe.)
 */
if (CERT_ID_BY_SLUG["security-plus"] != null) {
  CERT_ID_BY_SLUG["comptia-security-plus"] = CERT_ID_BY_SLUG["security-plus"];
}
if (CERT_ID_BY_SLUG["cisco-ccst-security"] != null) {
  CERT_ID_BY_SLUG["cisco-ccst-cybersecurity"] = CERT_ID_BY_SLUG["cisco-ccst-security"];
}

/** Helper sicuro id -> slug */
export const getCertSlugById = (id: number): string | null => {
  return CERT_SLUG_BY_ID[id] ?? null;
};
