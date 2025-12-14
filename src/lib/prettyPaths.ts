// src/lib/prettyPaths.ts
// ======================================================================
//  Pretty URLs localizzate per tutto il sito (certificazioni, prezzi,
//  quiz topic, ecc.). Questo file è la fonte unica di verità per gli
//  URL pubblici multilingua del sito CertifyQuiz.
// ======================================================================

export type Lang = "it" | "en" | "fr" | "es";

/* ----------------------------------------------------------------------
 * LISTA CERTIFICAZIONI
 * -------------------------------------------------------------------- */

const list = {
  it: "/it/certificazioni",
  en: "/en/certifications",
  fr: "/fr/certifications",
  es: "/es/certificaciones",
} as const;

export function prettyList(lang: Lang): string {
  return list[lang];
}

/* ----------------------------------------------------------------------
 * PAGINA PREZZI
 * -------------------------------------------------------------------- */

const pricing = {
  it: "/it/prezzi",
  en: "/en/pricing",
  fr: "/fr/tarifs",
  es: "/es/precios",
} as const;

export function prettyPricing(lang: Lang): string {
  return pricing[lang];
}

/* ----------------------------------------------------------------------
 * DETTAGLIO CERTIFICAZIONE (richiede slug)
 * -------------------------------------------------------------------- */

const detail = {
  it: (slug: string) => `/it/certificazioni/${slug}`,
  en: (slug: string) => `/en/certifications/${slug}`,
  fr: (slug: string) => `/fr/certifications/${slug}`,
  es: (slug: string) => `/es/certificaciones/${slug}`,
} as const;

export function prettyDetail(lang: Lang, slug: string): string {
  return detail[lang](slug);
}

/* ----------------------------------------------------------------------
 * QUIZ TOPIC – percorso localizzato (novità)
 * Esempio: /it/quiz/topic/105
 * -------------------------------------------------------------------- */

const topicQuiz = {
  it: (id: number | string) => `/it/quiz/topic/${id}`,
  en: (id: number | string) => `/en/quiz/topic/${id}`,
  fr: (id: number | string) => `/fr/quiz/topic/${id}`,
  es: (id: number | string) => `/es/quiz/topic/${id}`,
} as const;

/**
 * prettyTopicQuiz(lang, id)
 * Genera l’URL localizzata per il quiz di un topic.
 * Uso:
 *   <Link href={prettyTopicQuiz(lang, topic.id)}>...</Link>
 */
export function prettyTopicQuiz(lang: Lang, id: number | string): string {
  return topicQuiz[lang](id);
}

// ======================================================================
// Fine file — se devi aggiungere altre route SEO-friendly, usa lo stesso
// stile e mantieni questo file come riferimento unico delle pretty URLs.
// ======================================================================
