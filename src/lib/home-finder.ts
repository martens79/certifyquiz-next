// src/lib/home-finder.ts
// Logica pura (senza server/client) del finder certificazioni della home mobile.

import type { Locale } from "@/lib/paths";

/** Voce leggera della lista certificazioni passata dal server alla home. */
export type FinderCert = {
  slug: string;
  title: string;
  href: string;
  /** Testo extra cercabile: slug, codici esame, titoli nelle altre lingue. */
  keywords: string;
};

/** Certificazioni mostrate come chip. Le etichette sono nomi di brand, non si traducono. */
export const POPULAR_CERTS: ReadonlyArray<{ slug: string; label: string }> = [
  { slug: "ccna", label: "CCNA" },
  { slug: "aws-cloud-practitioner", label: "AWS Cloud Practitioner" },
  { slug: "security-plus", label: "Security+" },
  { slug: "comptia-a-plus", label: "CompTIA A+" },
  { slug: "microsoft-azure-fundamentals", label: "Azure AZ-900" },
  { slug: "isc2-cc", label: "ISC2 CC" },
  { slug: "ceh", label: "CEH" },
  { slug: "lfs101", label: "Linux LFS101" },
];

export const FINDER_MAX_RESULTS = 6;

/** Minuscolo, senza accenti: "Sécurité" e "securite" si equivalgono. */
export function normalizeQuery(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}

/** Solo lettere/cifre e i simboli che fanno parte dei nomi (A+, C#): "az-900" e "az900" coincidono. */
function compact(value: string): string {
  return normalizeQuery(value).replace(/[^a-z0-9+#]/g, "");
}

export type PreparedFinderRow = {
  cert: FinderCert;
  index: number;
  title: string;
  haystack: string;
  titleCompact: string;
  haystackCompact: string;
};

export function prepareFinderIndex(certs: ReadonlyArray<FinderCert>): PreparedFinderRow[] {
  return certs.map((cert, index) => {
    const title = normalizeQuery(cert.title);
    const haystack = `${title} ${normalizeQuery(cert.keywords)}`;
    return {
      cert,
      index,
      title,
      haystack,
      titleCompact: compact(cert.title),
      haystackCompact: compact(haystack),
    };
  });
}

/**
 * Cerca per nome, slug o codice esame. Ogni parola della query deve comparire
 * (anche senza separatori: "az900" trova "AZ-900"). I titoli che iniziano con la
 * query escono per primi, poi quelli che la contengono, poi le corrispondenze sulle keyword.
 */
export function searchFinder(
  index: ReadonlyArray<PreparedFinderRow>,
  query: string,
  limit = FINDER_MAX_RESULTS
): FinderCert[] {
  const q = normalizeQuery(query);
  if (!q) return [];
  const tokens = q.split(/\s+/).filter(Boolean);
  const qCompact = compact(q);

  const scored: Array<{ cert: FinderCert; score: number; index: number }> = [];
  for (const row of index) {
    const matches = tokens.every((t) => {
      if (row.haystack.includes(t)) return true;
      const tc = compact(t);
      return tc.length > 0 && row.haystackCompact.includes(tc);
    });
    if (!matches) continue;
    const score = row.titleCompact.startsWith(qCompact)
      ? 0
      : row.title.includes(q) || row.titleCompact.includes(qCompact)
      ? 1
      : 2;
    scored.push({ cert: row.cert, score, index: row.index });
  }
  scored.sort((a, b) => a.score - b.score || a.index - b.index);
  return scored.slice(0, limit).map((s) => s.cert);
}

export const FINDER_COPY: Record<
  Locale,
  {
    title: string;
    label: string;
    placeholder: string;
    popular: string;
    categories: string;
    results: (n: number) => string;
    noResults: (q: string) => string;
    seeAll: string;
  }
> = {
  it: {
    title: "Trova la tua certificazione",
    label: "Cerca una certificazione per nome o codice esame",
    placeholder: "Cerca: CCNA, AWS, AZ-900…",
    popular: "Certificazioni popolari",
    categories: "Categorie",
    results: (n) => (n === 1 ? "1 risultato" : `${n} risultati`),
    noResults: (q) => `Nessuna certificazione trovata per “${q}”`,
    seeAll: "Vedi tutte le certificazioni →",
  },
  en: {
    title: "Find your certification",
    label: "Search certifications by name or exam code",
    placeholder: "Search: CCNA, AWS, AZ-900…",
    popular: "Popular certifications",
    categories: "Categories",
    results: (n) => (n === 1 ? "1 result" : `${n} results`),
    noResults: (q) => `No certification found for “${q}”`,
    seeAll: "See all certifications →",
  },
  fr: {
    title: "Trouvez votre certification",
    label: "Rechercher une certification par nom ou code d'examen",
    placeholder: "Rechercher : CCNA, AWS, AZ-900…",
    popular: "Certifications populaires",
    categories: "Catégories",
    results: (n) => (n <= 1 ? `${n} résultat` : `${n} résultats`),
    noResults: (q) => `Aucune certification trouvée pour « ${q} »`,
    seeAll: "Voir toutes les certifications →",
  },
  es: {
    title: "Encuentra tu certificación",
    label: "Buscar una certificación por nombre o código de examen",
    placeholder: "Buscar: CCNA, AWS, AZ-900…",
    popular: "Certificaciones populares",
    categories: "Categorías",
    results: (n) => (n === 1 ? "1 resultado" : `${n} resultados`),
    noResults: (q) => `No se encontró ninguna certificación para «${q}»`,
    seeAll: "Ver todas las certificaciones →",
  },
};
