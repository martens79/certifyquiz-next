// File: src/app/[lang]/certificazioni/page.tsx
// Purpose: CLEAN implementation (no legacy adapters). Server-first, ISR, full SEO.

import type { Metadata } from "next";
import Script from "next/script";

// 🧩 Local project types & utils
import { locales, type Locale, isLocale } from "@/lib/i18n";
import { getCertList, type Cert } from "@/lib/data";
import { CertificationCard } from "@/components/CertificationCard";
import { canonicalUrl } from "@/lib/seo";

export const revalidate = 86400; // 24h

const RAW_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.certifyquiz.com";
const SITE_URL = RAW_SITE_URL.replace(/\/+$/, "");

// Pretty localized paths for the list page
const listPathByLang: Record<Locale, string> = {
  it: "/it/certificazioni",
  es: "/es/certificaciones",
  fr: "/fr/certifications",
  en: "/en/certifications",
};

// Pretty localized paths for the **detail** page (fix: not always "certificazioni")
const detailPath = (lang: Locale, slug: string) => {
  switch (lang) {
    case "it": return `/it/certificazioni/${slug}`;
    case "en": return `/en/certifications/${slug}`;
    case "fr": return `/fr/certifications/${slug}`;
    case "es": return `/es/certificaciones/${slug}`;
  }
};

const SEO = {
  it: {
    title: "Certificazioni — Elenco completo",
    description:
      "Esplora tutte le certificazioni IT su CertifyQuiz: scopri i percorsi, leggi i dettagli e allenati con quiz realistici in italiano.",
  },
  es: {
    title: "Certificaciones — Lista completa",
    description:
      "Explora todas las certificaciones de TI en CertifyQuiz: descubre los itinerarios, detalles y practica con cuestionarios realistas en español.",
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

/* ------------------------------- Metadata -------------------------------- */
// ⬇️ Next 15: params è awaitable → tipizza come Promise e fai await
export async function generateMetadata(
  { params }: { params: Promise<{ lang: string }> }
): Promise<Metadata> {
  const { lang } = await params;
  const L: Locale = isLocale(lang) ? lang as Locale : "it";
  const { title, description } = SEO[L];

  // hreflang con locale completi
  const languages: Record<string, string> = {};
  for (const l of locales) {
    const hreflang =
      l === "it" ? "it-IT" :
      l === "en" ? "en-US" :
      l === "fr" ? "fr-FR" :
      l === "es" ? "es-ES" : l;
    languages[hreflang] = canonicalUrl(listPathByLang[l]);
  }
  // x-default → IT
  languages["x-default"] = canonicalUrl(listPathByLang["it"]);

  const canonical = canonicalUrl(listPathByLang[L]);

  return {
    title,
    description,
    alternates: {
      canonical,
      languages,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "CertifyQuiz",
      type: "website",
      locale:
        L === "it" ? "it-IT" :
        L === "en" ? "en-US" :
        L === "fr" ? "fr-FR" :
        L === "es" ? "es-ES" : "it-IT",
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

/* -------------------------- Static params (SSG) -------------------------- */
export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

/* --------------------------------- Page ---------------------------------- */
// ⬇️ Next 15: anche qui params è Promise → fai await
export default async function Page(
  { params }: { params: Promise<{ lang: string }> }
) {
  const { lang } = await params;
  const L: Locale = isLocale(lang) ? (lang as Locale) : "it";
  const certs: Cert[] = await getCertList(L);

  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: SEO[L].title,
    itemListElement: certs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: new URL(detailPath(L, c.slug), SITE_URL).toString(),
      name: c.title || c.slug,
    })),
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">{SEO[L].title}</h1>
        <p className="mt-2 max-w-3xl text-sm text-gray-600 dark:text-neutral-300">
          {SEO[L].description}
        </p>
      </header>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {certs.length ? (
          certs.map((c) => (
            <CertificationCard
              key={c.slug}
              href={detailPath(L, c.slug)}
              title={c.title}
              imageUrl={undefined}
              level={undefined}
              description={c.intro}
            />
          ))
        ) : (
          <div className="col-span-full rounded-xl border border-dashed p-6 text-sm text-gray-500 dark:text-neutral-400">
            Nessuna certificazione disponibile.
          </div>
        )}
      </section>

      <Script
        id="certifyquiz-cert-list-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }}
      />
    </main>
  );
}
