// src/app/[lang]/certificazioni/[slug]/page.tsx
// Pagina dettaglio certificazione — Next 15, SSG + ISR, SEO EN-root safe
// Pattern: View (props sync) + Page (await params Promise)

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

export const revalidate = 86400;
export const dynamic = "force-static";
export const dynamicParams = true;

type Lang = Locale;

const RAW_SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.certifyquiz.com";
const SITE_URL = RAW_SITE_URL.replace(/\/+$/, "");

// ------------------------- PATH PER LINGUA -------------------------
// Nota strategia SEO:
// - EN ufficiale = root (senza /en) → /certifications/:slug
// - /en/* resta route tecnica ma non deve indicizzarsi (noindex + canonical verso root)
const listPathByLang: Record<Lang, string> = {
  it: "/it/certificazioni",
  en: "/en/certifications", // route tecnica (NOINDEX)
  fr: "/fr/certifications",
  es: "/es/certificaciones",
};

// 🔥 EN ufficiale = root
const EN_ROOT_LIST_PATH = "/certifications";
const enRootDetailPath = (slug: string) => `${EN_ROOT_LIST_PATH}/${slug}`;

const localizedDetailPath = (l: Lang, slug: string) =>
  `${listPathByLang[l]}/${slug}`;

const toHreflang = (l: Lang): string =>
  l === "it" ? "it-IT" : l === "en" ? "en-US" : l === "fr" ? "fr-FR" : "es-ES";

/* ----------------------------- Static params ----------------------------- */

export async function generateStaticParams() {
  const fromRegistry = CERT_SLUGS;
  const fromData = await getAllCertSlugs("it");
  const all = Array.from(new Set([...fromRegistry, ...fromData]));
  return locales.flatMap((lang) => all.map((slug) => ({ lang, slug })));
}

/* ------------------------------ SEO / Metadata ----------------------------- */

type MetaProps = {
  params: Promise<{ lang: string; slug: string }>;
};

export async function generateMetadata({ params }: MetaProps): Promise<Metadata> {
  const { lang, slug } = await params;

  const L: Lang = isLocale(lang) ? (lang as Lang) : "it";

  // 1) Registry
  const reg = CERTS_BY_SLUG[slug];
  let titleBase: string | undefined;
  let description: string | undefined;
  let ogImage: string | undefined;

  if (reg) {
    titleBase = reg.title?.[L] ?? reg.title?.it;
    description = reg.description?.[L] ?? reg.description?.it;
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

  // 🔥 canonical
  const canonical =
    L === "en"
      ? new URL(enRootDetailPath(slug), SITE_URL).toString()
      : new URL(localizedDetailPath(L, slug), SITE_URL).toString();

  // hreflang
  const languages: Record<string, string> = {};
  for (const l of locales) {
    languages[toHreflang(l)] =
      l === "en"
        ? new URL(enRootDetailPath(slug), SITE_URL).toString()
        : new URL(localizedDetailPath(l, slug), SITE_URL).toString();
  }

  // x-default → EN root
  languages["x-default"] = new URL(enRootDetailPath(slug), SITE_URL).toString();

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

    // 🔥 anti-duplicati: /en/* non indicizzabile
    robots:
      L === "en"
        ? { index: false, follow: true }
        : { index: true, follow: true },

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

const allLocales = (s: string) => ({ it: s, en: s, fr: s, es: s } as const);

const makeQuizRoute = (slug: string) =>
  ({
    it: `/it/quiz/${slug}`,
    en: `/en/quiz/${slug}`, // ✅ quiz sempre con /en
    fr: `/fr/quiz/${slug}`,
    es: `/es/quiz/${slug}`,
  } as const);

const makeBackRoute = () =>
  ({
    it: listPathByLang.it,
    en: EN_ROOT_LIST_PATH, // 🔥 torna all’elenco ufficiale EN root
    fr: listPathByLang.fr,
    es: listPathByLang.es,
  } as const);

function adaptCertToRegistryShape(cert: Cert): CertificationData {
  const title = cert.title || cert.h1 || "Certification";
  const desc = cert.seoDescription || cert.intro || cert.title || "";
  const img = cert.imageUrl ?? "/og/cert-default.png";

  return {
    slug: cert.slug,
    imageUrl: img,
    officialUrl: "",

    title: allLocales(title),
    level: allLocales(""),
    description: allLocales(desc),

    topics: [] as const,
    extraContent: undefined,

    quizRoute: makeQuizRoute(cert.slug),
    backRoute: makeBackRoute(),
  };
}

/* ------------------------------------------------------------------------ */
/*                         VIEW (riusabile nei wrapper)                      */
/* ------------------------------------------------------------------------ */

type ViewProps = { lang: Lang; slug: string };

export async function CertificationDetailView({ lang, slug }: ViewProps) {
  const L = lang;

  const reg = CERTS_BY_SLUG[slug];
  if (reg) return <CertificationPage lang={L} data={reg} />;

  const cert = await getCertBySlug(slug, L);
  if (!cert) return notFound();

  const data = adaptCertToRegistryShape(cert);
  return <CertificationPage lang={L} data={data} />;
}

/* ------------------------------------------------------------------------ */
/*                          PAGE (solo Next: await params)                   */
/* ------------------------------------------------------------------------ */

type PageProps = {
  params: Promise<{ lang: string; slug: string }>;
};

export default async function Page({ params }: PageProps) {
  const { lang, slug } = await params;
  const L: Lang = isLocale(lang) ? (lang as Lang) : "it";
  return <CertificationDetailView lang={L} slug={slug} />;
}
