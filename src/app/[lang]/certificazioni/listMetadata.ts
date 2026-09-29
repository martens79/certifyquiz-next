// src/app/[lang]/certificazioni/listMetadata.ts
// Metadata per le liste certificazioni pubbliche:
// /certifications (EN root), /it/certificazioni, /fr/certifications, /es/certificaciones.
// Quelle route statiche non esportavano metadata: niente title, niente canonical,
// e l'header linka `?search=1`, che Google indicizzava come URL separato.

import type { Metadata } from "next";

import { locales, type Locale } from "@/lib/i18n";
import { certificationsPath, toHreflang } from "@/lib/paths";
import { canonicalUrl } from "@/lib/seo";

const SEO: Record<Locale, { title: string; description: string }> = {
  it: {
    title: "Certificazioni — Elenco completo | CertifyQuiz",
    description:
      "Esplora tutte le certificazioni IT su CertifyQuiz: scopri i percorsi, leggi i dettagli e allenati con quiz realistici in italiano.",
  },
  es: {
    title: "Certificaciones — Lista completa | CertifyQuiz",
    description:
      "Explora todas las certificaciones de TI en CertifyQuiz: descubre itinerarios, detalles y practica con cuestionarios realistas en español.",
  },
  fr: {
    title: "Certifications — Liste complète | CertifyQuiz",
    description:
      "Parcourez toutes les certifications IT sur CertifyQuiz : découvrez les parcours, les détails et entraînez-vous avec des quiz réalistes en français.",
  },
  en: {
    title: "Certifications — Full list | CertifyQuiz",
    description:
      "Browse all IT certifications on CertifyQuiz: explore paths, read details, and practice with realistic quizzes in English.",
  },
};

export function certificationsListMetadata(lang: Locale): Metadata {
  const { title, description } = SEO[lang];
  const canonical = canonicalUrl(certificationsPath(lang));

  const languages: Record<string, string> = {};
  for (const l of locales as readonly Locale[]) {
    languages[toHreflang(l)] = canonicalUrl(certificationsPath(l));
  }
  languages["x-default"] = canonicalUrl(certificationsPath("en"));

  return {
    title,
    description,
    alternates: { canonical, languages },
    robots: { index: true, follow: true },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "CertifyQuiz",
      type: "website",
      locale: toHreflang(lang),
    },
    twitter: { card: "summary_large_image", title, description },
  };
}
