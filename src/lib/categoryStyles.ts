// src/lib/categoryStyles.ts
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

type CatStyle = {
  wrapper: string; // bg + border + hover ring
  header: string;  // per il header della pagina
};

export const CATEGORY_STYLES: Record<CategoryKey, CatStyle> = {
  base: {
    wrapper: "bg-blue-50 border border-blue-200 hover:ring-2 hover:ring-blue-200/70",
    header:  "bg-blue-50 border border-blue-200",
  },
  sicurezza: {
    wrapper: "bg-red-50 border border-red-200 hover:ring-2 hover:ring-red-200/70",
    header:  "bg-red-50 border border-red-200",
  },
  reti: {
    wrapper: "bg-green-50 border border-green-200 hover:ring-2 hover:ring-green-200/70",
    header:  "bg-green-50 border border-green-200",
  },
  cloud: {
    wrapper: "bg-purple-50 border border-purple-200 hover:ring-2 hover:ring-purple-200/70",
    header:  "bg-purple-50 border border-purple-200",
  },
  database: {
    wrapper: "bg-yellow-50 border border-yellow-200 hover:ring-2 hover:ring-yellow-200/70",
    header:  "bg-yellow-50 border border-yellow-200",
  },
  programmazione: {
    wrapper: "bg-teal-50 border border-teal-200 hover:ring-2 hover:ring-teal-200/70",
    header:  "bg-teal-50 border border-teal-200",
  },
  virtualizzazione: {
    wrapper: "bg-orange-50 border border-orange-200 hover:ring-2 hover:ring-orange-200/70",
    header:  "bg-orange-50 border border-orange-200",
  },
  ai: {
    wrapper: "bg-cyan-50 border border-cyan-200 hover:ring-2 hover:ring-cyan-200/70",
    header:  "bg-cyan-50 border border-cyan-200",
  },
  default: {
    wrapper: "bg-gray-50 border border-gray-200 hover:ring-2 hover:ring-gray-200/70",
    header:  "bg-gray-50 border border-gray-200",
  },
};

export const getCategoryStyle = (key?: string): CatStyle => {
  const k = (key || "default").toLowerCase() as CategoryKey;
  return CATEGORY_STYLES[k] ?? CATEGORY_STYLES.default;
};
