// File: src/app/[lang]/[page]/page.tsx
// Render pagine legali da Markdown → HTML (Remark/Rehype). Niente React/MDX runtime.

import type React from "react"; // ✅ Aggiunta per JSX.Element
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";

import { locales, type Locale } from "@/lib/i18n";
import { seo } from "@/dict/seo";

/* -------------------------- Slug localizzati -------------------------- */
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

/* ---------------------------- Mappatura file --------------------------- */
function filenameFor(lang: Locale, key: PageKey): string {
  const files = {
    privacy: { it: "privacy.it.mdx", en: "privacy.en.mdx", fr: "confidentialite.fr.mdx", es: "privacidad.es.mdx" },
    terms:   { it: "termini.it.mdx",  en: "terms.en.mdx",   fr: "conditions.fr.mdx",      es: "terminos.es.mdx"    },
    cookies: { it: "cookie.it.mdx",   en: "cookies.en.mdx", fr: "cookies.fr.mdx",         es: "cookies.es.mdx"     },
    contact: { it: "contatti.it.mdx", en: "contact.en.mdx", fr: "contact.fr.mdx",         es: "contacto.es.mdx"    },
  } as const;
  return files[key][lang];
}

/* -------------------------------- SEO --------------------------------- */
type MetaShape = { title?: string; description?: string };
type SEOByLang = Partial<Record<Locale, Record<string, MetaShape>>>;

const SEO_MAP = seo as SEOByLang;

function getSeoMeta(lang: Locale, key: PageKey, slug: string): MetaShape | undefined {
  const langSeo = SEO_MAP?.[lang];
  if (!langSeo) return undefined;
  return langSeo[`/${slug}`] ?? langSeo[slug] ?? langSeo[key];
}

/* --------------------------- Static params (SSG) --------------------------- */
export async function generateStaticParams(): Promise<Array<{ lang: Locale; page: string }>> {
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
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.certifyquiz.com").replace(/\/+$/, "");

  if (!key) {
    return {
      title: "CertifyQuiz",
      description: "Pagina non trovata",
      robots: { index: false, follow: false },
    };
  }

  const meta = getSeoMeta(lang, key, page);
  const canonical = `${siteUrl}/${lang}/${page}`;

  const languages: NonNullable<Metadata["alternates"]>["languages"] = {
  "en-US": `${siteUrl}/${PAGES[key].en}`,   // 👈 ROOT = inglese
  "it-IT": `${siteUrl}/it/${PAGES[key].it}`,
  "es-ES": `${siteUrl}/es/${PAGES[key].es}`,
  "fr-FR": `${siteUrl}/fr/${PAGES[key].fr}`,
  "x-default": `${siteUrl}/${PAGES[key].en}`, // 👈 default = EN
};


  return {
    title: meta?.title ?? "CertifyQuiz",
    description: meta?.description ?? "Quiz realistici con spiegazioni per le principali certificazioni IT.",
    alternates: { canonical, languages },
    openGraph: {
      title: meta?.title ?? "CertifyQuiz",
      description: meta?.description ?? "Quiz realistici con spiegazioni per le principali certificazioni IT.",
      url: canonical,
      siteName: "CertifyQuiz",
      type: "article",
      locale: lang === "it" ? "it-IT" : lang === "en" ? "en-US" : lang === "fr" ? "fr-FR" : "es-ES",
    },
    twitter: { card: "summary_large_image" },
  };
}

/* ------------------------------ Markdown → HTML ------------------------------ */
async function renderMarkdownToHtml(markdown: string): Promise<string> {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeStringify)
    .process(markdown);

  return String(file);
}

/* --------------------------------- Page ---------------------------------- */
export default async function Page(
  props: { params: Promise<{ lang: Locale; page: string }> }
): Promise<React.JSX.Element> {   // ✅ Tipo corretto
  const { lang, page } = await props.params;
  const key = resolveKeyFromSlug(lang, page);
  if (!key) return notFound();

  const filePath = path.join(process.cwd(), "content", "legal", filenameFor(lang, key));

  let raw: string;
  try {
    raw = await fs.readFile(filePath, "utf8");
  } catch {
    return notFound();
  }

  const { content } = matter(raw);
  const html = await renderMarkdownToHtml(content);

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <article
        className="prose prose-zinc dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </main>
  );
}
