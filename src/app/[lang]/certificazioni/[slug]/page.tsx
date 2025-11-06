// src/app/[lang]/certificazioni/[slug]/page.tsx
// Pagina dettaglio certificazione — Next 15 (PPR compatibile), SSG + ISR con fallback al data layer

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { locales, type Locale, isLocale } from "@/lib/i18n";
import {
  CERTS_BY_SLUG,
  CERT_SLUGS,
  type CertificationData,
} from "@/certifications/registry";
import CertificationPage from "@/components/CertificationPage";
import { getAllCertSlugs, getCertBySlug, type Cert } from "@/lib/data";

export const revalidate = 86400; // ISR 24h
export const dynamic = "force-static";
export const dynamicParams = true;

type Lang = Locale;
type Params = { lang: string; slug: string };

const RAW_SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.certifyquiz.com";
const SITE_URL = RAW_SITE_URL.replace(/\/+$/, "");

// Liste/dettaglio per lingua (per canonical e backRoute)
const listPathByLang: Record<Lang, string> = {
  it: "/it/certificazioni",
  en: "/en/certifications",
  fr: "/fr/certifications",
  es: "/es/certificaciones",
};

const toHreflang = (l: Lang): string =>
  l === "it" ? "it-IT" : l === "en" ? "en-US" : l === "fr" ? "fr-FR" : "es-ES";

/* ----------------------------- generate params ---------------------------- */

export async function generateStaticParams() {
  // Unione: registry (CERT_SLUGS già pronte) ∪ data layer LIVE
  const fromRegistry = CERT_SLUGS;
  const fromData = await getAllCertSlugs("it"); // gli slug sono language-agnostic
  const all = Array.from(new Set([...fromRegistry, ...fromData]));
  return locales.flatMap((lang) => all.map((slug) => ({ lang, slug })));
}

/* ------------------------------ SEO/Metadata ------------------------------ */

export async function generateMetadata(
  { params }: { params: Promise<Params> }
): Promise<Metadata> {
  const { lang, slug } = await params;
  const L: Lang = isLocale(lang) ? (lang as Lang) : "it";

  // 1) Registry
  const reg = CERTS_BY_SLUG[slug];
  let titleBase: string | undefined;
  let description: string | undefined;
  let ogImage: string | undefined;

  if (reg) {
    titleBase = reg.title?.[L] ?? reg.title?.it ?? undefined;
    description = reg.description?.[L] ?? reg.description?.it ?? undefined;
    ogImage = reg.imageUrl;
  } else {
    // 2) Fallback data layer
    const cert = await getCertBySlug(slug, L);
    if (cert) {
      titleBase = cert.title || cert.h1;
      description = cert.seoDescription || cert.intro;
      ogImage = cert.imageUrl ?? undefined;
    }
  }

  if (!titleBase) return {};

  const suffix =
    L === "it"
      ? "Quiz ed esame"
      : L === "fr"
      ? "Quiz et examen"
      : L === "es"
      ? "Cuestionarios y examen"
      : "Quizzes & Exam";

  const title = `${titleBase} — ${suffix} | CertifyQuiz`;
  const canonical = new URL(`${listPathByLang[L]}/${slug}`, SITE_URL).toString();

  const languages: Record<string, string> = {};
  for (const l of locales) {
    languages[toHreflang(l)] = new URL(
      `${listPathByLang[l]}/${slug}`,
      SITE_URL
    ).toString();
  }
  languages["x-default"] = new URL(
    `${listPathByLang.en}/${slug}`,
    SITE_URL
  ).toString();

  const ogAbs =
    ogImage?.startsWith("http")
      ? ogImage
      : ogImage
      ? new URL(ogImage.replace(/^\/+/, "/"), SITE_URL).toString()
      : undefined;

  return {
    title,
    description,
    alternates: { canonical, languages },
    openGraph: {
      type: "website",
      title,
      description,
      url: canonical,
      siteName: "CertifyQuiz",
      images: ogAbs ? [{ url: ogAbs }] : undefined,
      locale: toHreflang(L),
    },
  };
}

/* ------------------------------- Adapter ---------------------------------- */

// Duplica una stringa su tutte le lingue richieste dal tipo
const allLocales = (s: string) => ({ it: s, en: s, fr: s, es: s } as const);

// Costruisce le route localizzate richieste dal tipo
const makeQuizRoute = (slug: string) =>
  ({
    it: `/it/quiz/${slug}`,
    en: `/en/quiz/${slug}`,
    fr: `/fr/quiz/${slug}`,
    es: `/es/quiz/${slug}`,
  } as const);

const makeBackRoute = () =>
  ({
    it: listPathByLang.it,
    en: listPathByLang.en,
    fr: listPathByLang.fr,
    es: listPathByLang.es,
  } as const);

// Adatta "Cert" (data layer) → "CertificationData" (usato da <CertificationPage/>)
function adaptCertToRegistryShape(cert: Cert): CertificationData {
  const title = cert.title || cert.h1 || "Certification";
  const desc = cert.seoDescription || cert.intro || cert.title || "";
  const img = cert.imageUrl ?? "/og/cert-default.png";

  return {
    slug: cert.slug,
    imageUrl: img,            // string obbligatoria
    officialUrl: "",          // string obbligatoria (se ce l’hai, metti l’URL ufficiale)

    title: allLocales(title),
    level: allLocales(""),
    description: allLocales(desc),

    topics: [] as const,      // ReadonlyArray<LocalizedText>
    extraContent: undefined,

    quizRoute: makeQuizRoute(cert.slug), // LocalizedRoute
    backRoute: makeBackRoute(),          // LocalizedRoute

    // imageSide: "left", // opzionale; il tuo componente ha default "left"
  };
}

/* ---------------------------------- Page ---------------------------------- */

export default async function Page({ params }: { params: Promise<Params> }) {
  const { lang, slug } = await params;
  const L: Lang = isLocale(lang) ? (lang as Lang) : "it";

  // 1) Preferisci i contenuti completi del registry
  const reg = CERTS_BY_SLUG[slug];
  if (reg) return <CertificationPage lang={L} data={reg} />;

  // 2) Fallback: data layer LIVE/MOCK (evita 404 mentre completi il registry)
  const cert = await getCertBySlug(slug, L);
  if (!cert) return notFound();

  const data = adaptCertToRegistryShape(cert);
  return <CertificationPage lang={L} data={data} />;
}
