// File: src/app/[lang]/certificazioni/[slug]/page.tsx
// Purpose: Pagina dettaglio certificazione (Next 15, server-first, SEO completo)

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { locales, type Locale, isLocale } from "@/lib/i18n";
import { getCertBySlug, getCertList, type Cert } from "@/lib/data";

export const revalidate = 86400; // 24h

// ✅ Base URL normalizzata (senza slash finale)
const RAW_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.certifyquiz.com";
const SITE_URL = RAW_SITE_URL.replace(/\/+$/, "");

// ✅ Percorsi lista per lingua
const listPathByLang: Record<Locale, string> = {
  it: "/it/certificazioni",
  es: "/es/certificaciones",
  fr: "/fr/certifications",
  en: "/en/certifications",
};

// ✅ Label localizzata per breadcrumb
const listLabelByLang: Record<Locale, string> = {
  it: "Certificazioni",
  en: "Certifications",
  fr: "Certifications",
  es: "Certificaciones",
};

// ✅ Conversione lingua → hreflang completo
const toHreflang = (l: Locale): string =>
  l === "it" ? "it-IT" :
  l === "en" ? "en-US" :
  l === "fr" ? "fr-FR" :
  l === "es" ? "es-ES" : "it-IT";

// ✅ Helper per avere immagini assolute negli OG/Twitter
const toAbsolute = (url?: string) => {
  if (!url) return undefined;
  try {
    // se è già assoluto, lo ritorna; altrimenti lo risolve su SITE_URL
    return new URL(url, SITE_URL).toString();
  } catch {
    return undefined;
  }
};

/* -------------------------- Static params (SSG/ISR) -------------------------- */
export async function generateStaticParams() {
  // Prerender di base: prendi la lista per ogni lingua e prebuilda gli slug noti
  const params: Array<{ lang: Locale; slug: string }> = [];
  for (const lang of locales) {
    const list = await getCertList(lang);
    for (const c of list) {
      params.push({ lang, slug: c.slug });
    }
  }
  return params;
}

/* ------------------------------- METADATA -------------------------------- */
export async function generateMetadata(
  { params }: { params: Promise<{ lang: string; slug: string }> }
): Promise<Metadata> {
  const { lang, slug } = await params;
  const L: Locale = isLocale(lang) ? (lang as Locale) : "it";

  const cert: Cert | null = await getCertBySlug(slug, L);
  if (!cert) {
    return { title: "Certificazione non trovata", robots: { index: false, follow: false } };
  }

  const title = cert.title || slug;
  const description = cert.seoDescription || cert.intro || "";

  // ✅ hreflang completi + x-default
  const languages: Record<string, string> = {};
  for (const l of locales) {
    const href = new URL(`${listPathByLang[l]}/${slug}`, SITE_URL).toString();
    languages[toHreflang(l)] = href;
  }
  languages["x-default"] = new URL(`${listPathByLang.it}/${slug}`, SITE_URL).toString();

  const canonical = new URL(`${listPathByLang[L]}/${slug}`, SITE_URL).toString();

  const ogImage = toAbsolute(cert.imageUrl);

  return {
    title,
    description,
    alternates: {
      canonical,
      languages,
    },
    openGraph: {
      type: "article",
      title,
      description,
      url: canonical,
      siteName: "CertifyQuiz",
      locale: toHreflang(L),
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

/* ------------------------------- PAGINA ---------------------------------- */
export default async function Page(
  { params }: { params: Promise<{ lang: string; slug: string }> }
) {
  const { lang, slug } = await params;
  const L: Locale = isLocale(lang) ? (lang as Locale) : "it";

  const cert: Cert | null = await getCertBySlug(slug, L);
  if (!cert) return notFound();

  const listUrl = new URL(listPathByLang[L], SITE_URL).toString();
  const detailUrl = new URL(`${listPathByLang[L]}/${slug}`, SITE_URL).toString();

  // ✅ Breadcrumb JSON-LD
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: new URL(`/${L}`, SITE_URL).toString() },
      { "@type": "ListItem", position: 2, name: listLabelByLang[L], item: listUrl },
      { "@type": "ListItem", position: 3, name: cert.title, item: detailUrl },
    ],
  };

  // ✅ Course JSON-LD
  const course = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: cert.title,
    description: cert.seoDescription || cert.intro,
    provider: { "@type": "Organization", name: "CertifyQuiz", sameAs: SITE_URL },
    url: detailUrl,
  };

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">{cert.title}</h1>
        {cert.intro && (
          <p className="mt-3 text-sm text-gray-700 dark:text-neutral-300">
            {cert.intro}
          </p>
        )}
      </header>

      <section className="space-y-6">
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-neutral-700 dark:bg-neutral-900">
          <h2 className="text-lg font-semibold">Preparati alla certificazione</h2>
          <p className="mt-2 text-sm leading-relaxed text-gray-700 dark:text-neutral-300">
            Approfondisci i concetti chiave e verifica le tue conoscenze attraverso quiz realistici con spiegazioni dettagliate.
          </p>
          <div className="mt-4">
            <a
              href={`/${L}/quiz/${slug}`}
              className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Vai ai quiz →
            </a>
          </div>
        </div>

        {cert.faq?.length ? (
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-neutral-700 dark:bg-neutral-900">
            <h2 className="text-lg font-semibold mb-2">Domande frequenti</h2>
            <ul className="space-y-3 text-sm">
              {cert.faq.map((qa, i) => (
                <li key={i}>
                  <p className="font-medium">{qa.q}</p>
                  <p className="text-gray-700 dark:text-neutral-300">{qa.a}</p>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </section>

      {/* ✅ JSON-LD SEO */}
      <script
        id="cert-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <script
        id="cert-course"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(course) }}
      />
    </main>
  );
}
