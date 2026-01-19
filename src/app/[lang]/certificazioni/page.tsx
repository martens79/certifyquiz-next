// src/app/[lang]/certificazioni/page.tsx
// Lista certificazioni — Next 15 (params Promise), ISR, SEO + hreflang/canonical
// ✅ In page.tsx esportiamo SOLO ciò che Next permette: default, metadata, revalidate, generateStaticParams.

import type { Metadata } from "next";

import { locales, type Locale, isLocale } from "@/lib/i18n";
import { canonicalUrl } from "@/lib/seo";

import CertificationsListView from "./CertificationsListView";

export const revalidate = 86400; // ISR: 24h

// Nota strategia SEO:
// - EN ufficiale = root (senza /en) → /certifications
// - /en/* resta route tecnica ma non deve indicizzarsi (noindex + canonical verso root)
const listPathByLang: Record<Locale, string> = {
  it: "/it/certificazioni",
  en: "/en/certificazioni", // route tecnica (non indicizzare)
  fr: "/fr/certificazioni",
  es: "/es/certificaciones",
};

const EN_ROOT_LIST_PATH = "/certifications";

const SEO = {
  it: {
    title: "Certificazioni — Elenco completo",
    description:
      "Esplora tutte le certificazioni IT su CertifyQuiz: scopri i percorsi, leggi i dettagli e allenati con quiz realistici in italiano.",
  },
  es: {
    title: "Certificaciones — Lista completa",
    description:
      "Explora todas las certificaciones de TI en CertifyQuiz: descubre itinerarios, detalles y practica con cuestionarios realistas en español.",
  },
  fr: {
    title: "Certifications — Liste complète",
    description:
      "Parcourez toutes les certifications IT sur CertifyQuiz : découvrez les parcours, les détails et entraînez-vous avec des quiz réalistes en français.",
  },
  en: {
    title: "Certifications — Full list",
    description:
      "Browse all IT certifications on CertifyQuiz: explore paths, read details, and practice with realistic quizzes in English.",
  },
} satisfies Record<Locale, { title: string; description: string }>;

/* ------------------------------------------------------------------------ */
/*                                METADATA                                  */
/* ------------------------------------------------------------------------ */

type LangParams = { lang: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<LangParams>;
}): Promise<Metadata> {
  const { lang } = await params;
  const L: Locale = isLocale(lang) ? (lang as Locale) : "it";
  const { title, description } = SEO[L];

  // hreflang map (EN sempre verso root ufficiale)
  const languages: Record<string, string> = {};
  for (const l of locales as readonly Locale[]) {
    const hreflang =
      l === "it"
        ? "it-IT"
        : l === "en"
        ? "en-US"
        : l === "fr"
        ? "fr-FR"
        : "es-ES";

    languages[hreflang] =
      l === "en"
        ? canonicalUrl(EN_ROOT_LIST_PATH)
        : canonicalUrl(listPathByLang[l]);
  }

  // x-default = EN root
  languages["x-default"] = canonicalUrl(EN_ROOT_LIST_PATH);

  // canonical: EN → root, altre → localizzato
  const canonical =
    L === "en"
      ? canonicalUrl(EN_ROOT_LIST_PATH)
      : canonicalUrl(listPathByLang[L]);

  return {
    title,
    description,
    alternates: { canonical, languages },

    // anti-duplicati: /en/* non indicizzabile
    robots:
      L === "en"
        ? { index: false, follow: true }
        : { index: true, follow: true },

    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "CertifyQuiz",
      type: "website",
      locale:
        L === "it"
          ? "it-IT"
          : L === "en"
          ? "en-US"
          : L === "fr"
          ? "fr-FR"
          : "es-ES",
    },

    twitter: { card: "summary_large_image", title, description },
  };
}

/* -------------------------- Static params (SSG) -------------------------- */
export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

/* ------------------------------------------------------------------------ */
/*                                   PAGE                                   */
/* ------------------------------------------------------------------------ */

export default async function Page({
  params,
}: {
  params: Promise<LangParams>;
}) {
  const { lang } = await params;
  const L: Locale = isLocale(lang) ? (lang as Locale) : "it";
  return <CertificationsListView lang={L} />;
}
