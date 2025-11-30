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
 * (Opzionale) Fallback se non vuoi toccare le 34 cert:
 * mappa slug→categoria per colorare subito le pagine topic.
 */
export const CERT_CATEGORY_BY_SLUG: Record<string, CategoryKey> = {
  // Base
  itfplus: "base",
  eipass: "base",
  ecdl: "base",
  pekit: "base",
  "a-plus": "base",

  // Sicurezza
  "security-plus": "sicurezza",
  ceh: "sicurezza",
  cissp: "sicurezza",
  cism: "sicurezza",
  "isc2-cc": "sicurezza",
  "cisco-ccst-security": "sicurezza",

  // Reti
  ccna: "reti",
  "cisco-ccst-networking": "reti",
  jncie: "reti",
  "f5-cts": "reti",

  // Cloud
  "aws-cloud-practitioner": "cloud",
  "azure-fundamentals": "cloud",
  "google-cloud": "cloud",
  "comptia-cloud-plus": "cloud",
  "ibm-cloud-v5": "cloud",
  "aws-solutions-architect": "cloud",

  // Database
  "microsoft-sql-server": "database",
  oracle: "database",
  mysql: "database",
  "mongodb-developer": "database",

  // Programmazione
  "java-se": "programmazione",
  python: "programmazione",
  javascript: "programmazione",
  csharp: "programmazione",
  typescript: "programmazione",
  kotlin: "programmazione",
  go: "programmazione",
  rust: "programmazione",
  swift: "programmazione",

  // Virtualizzazione
  "vmware-vcp": "virtualizzazione",
  "hyper-v": "virtualizzazione",
  "microsoft-virtualization": "virtualizzazione",

  // AI
  "google-tensorflow-developer": "ai",
  pytorch: "ai",
  openai: "ai",
  "microsoft-ai-fundamentals": "ai",
};
