import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { locales, type Locale } from "@/lib/i18n";
import { seo } from "@/dict/seo";

// mappa slug locali per lingua (ce l'hai già)
const PAGES = {
  privacy: { it: "privacy", en: "privacy", fr: "confidentialite", es: "privacidad" },
  terms:   { it: "termini",  en: "terms",   fr: "conditions",      es: "terminos"    },
  cookies: { it: "cookie",   en: "cookies", fr: "cookies",         es: "cookies"     },
  contact: { it: "contatti", en: "contact", fr: "contact",         es: "contacto"    },
} as const;

type PageKey = keyof typeof PAGES;

function resolveKeyFromSlug(lang: Locale, slug: string): PageKey | null {
  for (const key of Object.keys(PAGES) as PageKey[]) {
    if (PAGES[key][lang] === slug) return key;
  }
  return null;
}

/* 🔗 NOVITÀ: loader MDX per ogni lingua+chiave
   (file names come da tua cartella: privacy.it.mdx, terms.en.mdx, ecc.) */
const MDX_MAP: Record<Locale, Record<PageKey, () => Promise<{ default: React.ComponentType }>>> = {
  it: {
    privacy: () => import("@/content/legal/privacy.it.mdx"),
    terms:   () => import("@/content/legal/termini.it.mdx"),
    cookies: () => import("@/content/legal/cookie.it.mdx"),
    contact: () => import("@/content/legal/contatti.it.mdx"),
  },
  en: {
    privacy: () => import("@/content/legal/privacy.en.mdx"),
    terms:   () => import("@/content/legal/terms.en.mdx"),
    cookies: () => import("@/content/legal/cookies.en.mdx"),
    contact: () => import("@/content/legal/contact.en.mdx"),
  },
  fr: {
    privacy: () => import("@/content/legal/confidentialite.fr.mdx"),
    terms:   () => import("@/content/legal/conditions.fr.mdx"),
    cookies: () => import("@/content/legal/cookies.fr.mdx"),
    contact: () => import("@/content/legal/contact.fr.mdx"),
  },
  es: {
    privacy: () => import("@/content/legal/privacidad.es.mdx"),
    terms:   () => import("@/content/legal/terminos.es.mdx"),
    cookies: () => import("@/content/legal/cookies.es.mdx"),
    contact: () => import("@/content/legal/contacto.es.mdx"),
  },
};

type MetaShape = { title?: string; description?: string };
function getSeoMeta(lang: Locale, key: PageKey, slug: string): MetaShape | undefined {
  const langSeo = (seo as any)?.[lang] as Record<string, MetaShape> | undefined;
  if (!langSeo) return undefined;
  return langSeo[`/${slug}`] ?? langSeo[slug] ?? langSeo[key];
}

export async function generateStaticParams() {
  const params: Array<{ lang: Locale; page: string }> = [];
  for (const lang of locales) {
    for (const key of Object.keys(PAGES) as PageKey[]) {
      params.push({ lang, page: PAGES[key][lang] });
    }
  }
  return params;
}

export async function generateMetadata(
  props: { params: Promise<{ lang: Locale; page: string }> }
): Promise<Metadata> {
  const { lang, page } = await props.params;
  const key = resolveKeyFromSlug(lang, page);
  const siteUrl = "https://www.certifyquiz.com";

  if (!key) {
    return { title: "CertifyQuiz", description: "Pagina non trovata", robots: { index: false, follow: false } };
  }

  const meta = getSeoMeta(lang, key, page);

  return {
    title: meta?.title ?? "CertifyQuiz",
    description: meta?.description ?? "Quiz realistici con spiegazioni per le principali certificazioni IT.",
    alternates: {
      canonical: `${siteUrl}/${lang}/${page}`,
      languages: {
        it: `${siteUrl}/it/${PAGES[key].it}`,
        en: `${siteUrl}/en/${PAGES[key].en}`,
        fr: `${siteUrl}/fr/${PAGES[key].fr}`,
        es: `${siteUrl}/es/${PAGES[key].es}`,
        "x-default": `${siteUrl}/it/${PAGES[key].it}`,
      },
    },
  };
}

export default async function Page(
  props: { params: Promise<{ lang: Locale; page: string }> }
) {
  const { lang, page } = await props.params;
  const key = resolveKeyFromSlug(lang, page);
  if (!key) return notFound();

  const loader = MDX_MAP[lang][key];
  if (!loader) return notFound();

  const MDX = (await loader()).default;

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <article className="prose prose-zinc dark:prose-invert">
        <MDX />
      </article>
    </main>
  );
}
