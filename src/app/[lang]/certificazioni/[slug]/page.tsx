// src/app/[lang]/certificazioni/[slug]/page.tsx
// Pagina dettaglio certificazione — Next 15, SSG + ISR, SEO EN-root safe
// Pattern: View in file normale + Page (await params Promise)

import type { Metadata } from "next";

import { locales, type Locale, isLocale } from "@/lib/i18n";
import { CERTS_BY_SLUG, CERT_SLUGS } from "@/certifications/registry";
import { getAllCertSlugs, getCertBySlug } from "@/lib/data";
import { CertificationDetailView } from "@/app/_views/CertificationDetailView";
import { enRootDetailPath, localizedDetailPath, toHreflang } from "@/lib/paths";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

type Lang = Locale;

const RAW_SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.certifyquiz.com";
const SITE_URL = RAW_SITE_URL.replace(/\/+$/, "");

// Alias → slug PUBBLICO canonico. Stessa mappa di
// certifications/[slug]/page.tsx (non consolidata in un modulo condiviso:
// refactor separato), coerente con middleware.ts.
const normalizeCertSlug = (slug: string) => {
  if (slug === "network-plus") return "comptia-network-plus";
  if (slug === "comptia-network") return "comptia-network-plus";
  if (slug === "tensorflow-developer") return "tensorflow";
  if (slug === "google-tensorflow") return "tensorflow";
  if (slug === "microsoft-csharp") return "csharp";
  if (slug === "microsoft-c") return "csharp";
  if (slug === "comptia-a") return "comptia-a-plus";
  if (slug === "comptia-cloud") return "comptia-cloud-plus";
  if (slug === "comptia-security") return "security-plus";
  if (slug === "cisco-ccst-security") return "cisco-ccst-cybersecurity";
  return slug;
};

// Slug pubblico → chiave registry/DB, solo dove le due cose differiscono.
const PUBLIC_TO_REGISTRY_KEY: Record<string, string> = {
  tensorflow: "google-tensorflow",
  csharp: "microsoft-csharp",
};
const toRegistryKey = (publicSlug: string) =>
  PUBLIC_TO_REGISTRY_KEY[publicSlug] ?? publicSlug;

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
  const { lang, slug: rawSlug } = await params;

  // Slug pubblico canonico (usato per canonical/hreflang/pageUrl più sotto)
  // e chiave registry/DB corrispondente (usata solo per i lookup dati).
  const slug = normalizeCertSlug(rawSlug);
  const registryKey = toRegistryKey(slug);

  const L: Lang = isLocale(lang) ? (lang as Lang) : "it";

  const suffix =
    L === "it"
      ? "Quiz ed esame"
      : L === "fr"
      ? "Quiz et examen"
      : L === "es"
      ? "Cuestionarios y examen"
      : "Quizzes & Exam";

  // 1) Registry
  const reg = CERTS_BY_SLUG[registryKey];
  let titleBase: string | undefined;
  let description: string | undefined;
  let ogImage: string | undefined;

  if (reg) {
    titleBase = reg.metaTitle?.[L] ?? reg.metaTitle?.it ?? reg.title?.[L] ?? reg.title?.it;
    description = reg.metaDescription?.[L] ?? reg.metaDescription?.it ?? reg.description?.[L] ?? reg.description?.it;
    ogImage = reg.imageUrl;
  } else {
    // 2) Fallback data layer
    const cert = await getCertBySlug(registryKey, L);
    if (cert) {
      titleBase = cert.title || cert.h1;
      description = cert.seoDescription || cert.intro;
      ogImage = cert.imageUrl ?? undefined;
    }
  }

  if (!titleBase) return {};

  const title = reg?.metaTitle?.[L] ?? reg?.metaTitle?.it
    ? titleBase
    : `${titleBase} — ${suffix} | CertifyQuiz`;

  // canonical
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
    robots: { index: true, follow: true },
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