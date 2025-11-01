// src/lib/seo-i18n.ts
import type { Metadata } from "next";
import { buildMeta } from "@/lib/seo";
import { dict, type Locale, withLang } from "@/lib/i18n";

// Lingue effettivamente disponibili
const AVAILABLE_LOCALES = Object.keys(dict) as Locale[];

// Crea mappa hreflang automatica partendo da uno slug “senza lingua”
function makeAlternates(slugNoLang: string) {
  const map: Partial<Record<Locale | "x-default", string>> = {};
  for (const l of AVAILABLE_LOCALES) map[l] = withLang(l, slugNoLang);
  map["x-default"] = withLang("it" as Locale, slugNoLang); // default IT
  return map;
}

// Adapter SEO collegato al tuo sistema i18n
export function buildI18nMeta(opts: {
  lang: Locale;
  slugNoLang: string; // es. "/" o "/certificazioni"
  title?: string;
  description?: string;
  images?: string[];
  noindex?: boolean;
}): Metadata {
  const { lang, slugNoLang, title, description, images, noindex } = opts;
  const t = dict[lang] || {};

  const fallbackTitle =
    title ??
    t.seo?.titles?.[slugNoLang] ??
    (lang === "it"
      ? "CertifyQuiz — Certificazioni IT"
      : "CertifyQuiz — IT Certifications");

  const fallbackDesc =
    description ??
    t.seo?.descriptions?.[slugNoLang] ??
    (lang === "it"
      ? "Quiz aggiornati, spiegazioni premium e badge per le principali certificazioni IT."
      : "Practice exams, premium explanations and badges for top IT certifications.");

  return buildMeta({
    title: fallbackTitle,
    description: fallbackDesc,
    lang: lang as any,
    path: withLang(lang, slugNoLang),
    alternates: makeAlternates(slugNoLang),
    images,
    noindex,
  });
}
