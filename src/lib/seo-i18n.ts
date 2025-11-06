// src/lib/seo-i18n.ts
import type { Metadata } from "next";
import { buildMeta, type Lang } from "@/lib/seo";  // 👈 usa Lang di seo.ts per coerenza
import { dict, withLang } from "@/lib/i18n";

/** Lingue effettivamente disponibili (derivate dal dizionario) */
const AVAILABLE_LOCALES = Object.keys(dict) as Lang[];

/** Crea la mappa hreflang (slug senza lingua → URL per lingua) */
function makeAlternates(slugNoLang: string): Partial<Record<Lang | "x-default", string>> {
  const map: Partial<Record<Lang | "x-default", string>> = {};
  for (const l of AVAILABLE_LOCALES) map[l] = withLang(l, slugNoLang);
  map["x-default"] = withLang("it", slugNoLang); // default IT (cambia se vuoi)
  return map;
}

/** Adapter SEO i18n → produce Metadata Next tipato */
export function buildI18nMeta(opts: {
  lang: Lang;
  slugNoLang: string; // es. "/" o "/certificazioni"
  title?: string;
  description?: string;
  images?: string[];
  noindex?: boolean;
}): Metadata {
  const { lang, slugNoLang, title, description, images, noindex } = opts;
  const t = dict[lang];

  const fallbackTitle =
    title ??
    t.seo?.titles?.[slugNoLang] ??
    (lang === "it" ? "CertifyQuiz — Certificazioni IT" : "CertifyQuiz — IT Certifications");

  const fallbackDesc =
    description ??
    t.seo?.descriptions?.[slugNoLang] ??
    (lang === "it"
      ? "Quiz aggiornati, spiegazioni premium e badge per le principali certificazioni IT."
      : "Practice exams, premium explanations and badges for top IT certifications.");

  return buildMeta({
    title: fallbackTitle,
    description: fallbackDesc,
    lang,                                       // 👈 tipo Lang (compatibile con buildMeta)
    path: withLang(lang, slugNoLang),
    alternates: makeAlternates(slugNoLang),     // 👈 Partial<Record<Lang|"x-default", string>>
    images,
    noindex,
  }) as Metadata;                                // 👈 buildMeta restituisce Metadata compatibile
}
