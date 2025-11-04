// src/app/[lang]/certificazioni/page.tsx
// Lista certificazioni — Next 15 (PPR-compatible), ISR, SEO + JSON-LD

import type { Metadata } from "next";
import Script from "next/script";

import { locales, type Locale, isLocale } from "@/lib/i18n";
import { getCertList, type CertListItem } from "@/lib/apiClient";
import { CertificationCard } from "@/components/CertificationCard";
import { canonicalUrl } from "@/lib/seo";

export const revalidate = 86400; // ISR: 24h
// export const experimental_ppr = true; // opzionale

const RAW_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.certifyquiz.com";
const SITE_URL = RAW_SITE_URL.replace(/\/+$/, "");

// ⚠️ ROUTE effettiva dell'app è /[lang]/certificazioni per tutte le lingue,
// ma per SEO/canonical/hreflang vogliamo i path "belli" localizzati:
const listPathByLang: Record<Locale, string> = {
  it: "/it/certificazioni",
  en: "/en/certifications",
  fr: "/fr/certifications",
  es: "/es/certificaciones",
};

// Dettaglio coerente con i path "belli"
const detailPath = (lang: Locale, slug: string) => `${listPathByLang[lang]}/${slug}`;

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

/* ------------------------------- Metadata -------------------------------- */
export async function generateMetadata(
  { params }: { params: Promise<{ lang: string }> }
): Promise<Metadata> {
  const { lang } = await params;
  const L: Locale = isLocale(lang) ? (lang as Locale) : "it";
  const { title, description } = SEO[L];

  // hreflang con locale completi, *sempre* dalla mappa
  const languages: Record<string, string> = {};
  for (const l of locales as readonly Locale[]) {
    const hreflang =
      l === "it" ? "it-IT" :
      l === "en" ? "en-US" :
      l === "fr" ? "fr-FR" : "es-ES";
    languages[hreflang] = canonicalUrl(listPathByLang[l]);
  }
  // x-default → IT (puoi cambiare a EN)
  languages["x-default"] = canonicalUrl(listPathByLang.it);

  const canonical = canonicalUrl(listPathByLang[L]);

  return {
    title,
    description,
    alternates: { canonical, languages },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "CertifyQuiz",
      type: "website",
      locale:
        L === "it" ? "it-IT" :
        L === "en" ? "en-US" :
        L === "fr" ? "fr-FR" : "es-ES",
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

/* -------------------------- Static params (SSG) -------------------------- */
export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

/* --------------------------------- Page ---------------------------------- */
export default async function Page(
  { params }: { params: Promise<{ lang: string }> }
) {
  const { lang } = await params;
  const L: Locale = isLocale(lang) ? (lang as Locale) : "it";

  const certs: CertListItem[] = await getCertList(L);

  const visible = certs.filter(
    (c): c is CertListItem & { slug: string } =>
      typeof c.slug === "string" && c.slug.trim().length > 0
  );

  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: SEO[L].title,
    itemListElement: visible.map((c, i) => {
      const title = (c.name ?? c.slug).trim() || `Certificazione ${c.id}`;
      return {
        "@type": "ListItem",
        position: i + 1,
        url: new URL(detailPath(L, c.slug), SITE_URL).toString(),
        name: title,
      };
    }),
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
        {visible.length ? (
          visible.map((c) => {
            const title = (c.name ?? c.slug).trim() || `Certificazione ${c.id}`;
            return (
              <CertificationCard
                key={c.slug}
                href={detailPath(L, c.slug)}
                title={title}
                imageUrl={undefined}
                level={undefined}
                description={undefined}
              />
            );
          })
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
