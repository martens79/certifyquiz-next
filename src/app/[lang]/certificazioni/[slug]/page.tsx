// src/app/[lang]/certificazioni/[slug]/page.tsx
// Pagina dettaglio certificazione — Next 15, PPR-compatible (params come Promise)

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { locales, type Locale, isLocale } from "@/lib/i18n";
import { CERTS_BY_SLUG, CERT_SLUGS } from "@/certifications/registry";
import CertificationPage from "@/components/CertificationPage";

export const revalidate = 86400; // 24h ISR
// (facoltativo) puoi lasciare questa riga o rimuoverla; con PPR on a livello globale non è necessario
// export const experimental_ppr = true;

const RAW_SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.certifyquiz.com";
const SITE_URL = RAW_SITE_URL.replace(/\/+$/, "");

type Lang = "it" | "en" | "fr" | "es";

const listPathByLang: Record<Lang, string> = {
  it: "/it/certificazioni",
  es: "/es/certificaciones",
  fr: "/fr/certifications",
  en: "/en/certifications",
};

const toHreflang = (l: Lang): string =>
  l === "it" ? "it-IT" : l === "en" ? "en-US" : l === "fr" ? "fr-FR" : "es-ES";

// ▲ Pre-render di tutte le combinazioni lingua/slug
export function generateStaticParams() {
  return CERT_SLUGS.flatMap((slug) =>
    locales.map((lang) => ({ lang, slug }))
  );
}

type Params = { lang: string; slug: string };

// SEO (PPR: params come Promise)
export async function generateMetadata(
  { params }: { params: Promise<Params> }
): Promise<Metadata> {
  const { lang, slug } = await params;
  const L: Lang = isLocale(lang) ? (lang as Lang) : "it";

  const data = CERTS_BY_SLUG[slug];
  if (!data) return {};

  const titleBase = data.title?.[L] ?? data.title?.it ?? "Certification";
  const suffix =
    L === "it" ? "Quiz ed esame" :
    L === "fr" ? "Quiz et examen" :
    L === "es" ? "Cuestionarios y examen" :
                 "Quizzes & Exam";
  const title = `${titleBase} — ${suffix} | CertifyQuiz`;
  const description = data.description?.[L] ?? data.description?.it ?? "";

  const canonical = new URL(`${listPathByLang[L]}/${slug}`, SITE_URL).toString();

  const languages: Record<string, string> = {};
  const ALL_LANGS = locales as readonly Lang[];
for (const l of ALL_LANGS) {
  languages[toHreflang(l)] = new URL(`${listPathByLang[l]}/${slug}`, SITE_URL).toString();
}
  languages["x-default"] = new URL(
    `${listPathByLang.en}/${slug}`, SITE_URL
  ).toString();

  const ogImage =
    data.imageUrl?.startsWith("http")
      ? data.imageUrl
      : data.imageUrl
      ? new URL(data.imageUrl.replace(/^\/+/, "/"), SITE_URL).toString()
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
      images: ogImage ? [{ url: ogImage }] : undefined,
      locale: toHreflang(L),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

// Pagina (PPR: params come Promise)
export default async function Page({ params }: { params: Promise<Params> }) {
  const { lang, slug } = await params;
  const L: Lang = isLocale(lang) ? (lang as Lang) : "it";

  const data = CERTS_BY_SLUG[slug];
  if (!data) return notFound();

  return <CertificationPage lang={L} data={data} />;
}
