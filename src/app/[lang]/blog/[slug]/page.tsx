// src/app/[lang]/blog/[slug]/page.tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import { PortableText } from "@portabletext/react";

import { sanityServerClient } from "@/lib/sanity.server";
import { articleBySlugLang } from "@/lib/sanity.queries";
import { portableTextComponents } from "@/components/blog/PortableTextComponents";

import type { Locale } from "@/lib/i18n";
import { blogIndexPath, certificationsPath, quizHomePath } from "@/lib/paths";

function formatDate(lang: Locale, iso?: string) {
  if (!iso) return "";
  try {
    const locale = lang === "en" ? "en-US" : lang;
    return new Date(iso).toLocaleDateString(locale);
  } catch {
    return "";
  }
}

function getLabels(lang: Locale) {
  switch (lang) {
    case "it":
      return {
        fromBlog: "Dal blog",
        readMore: "Leggi l’articolo",
        ctaTitle: "Pronto a fare pratica?",
        ctaBody:
          "Passa ai quiz, allenati con domande realistiche e traccia i tuoi progressi.",
        ctaPrimary: "Esplora i quiz",
        ctaSecondary: "Vedi certificazioni",
        moreArticles: "Altri articoli",
        blog: "Blog",
      };
    case "fr":
      return {
        fromBlog: "Du blog",
        readMore: "Lire l’article",
        ctaTitle: "Prêt à pratiquer ?",
        ctaBody:
          "Passe aux quiz, entraîne-toi avec des questions réalistes et suis tes progrès.",
        ctaPrimary: "Explorer les quiz",
        ctaSecondary: "Voir les certifications",
        moreArticles: "Plus d’articles",
        blog: "Blog",
      };
    case "es":
      return {
        fromBlog: "Del blog",
        readMore: "Leer el artículo",
        ctaTitle: "¿Listo para practicar?",
        ctaBody:
          "Pasa a los quizzes, entrena con preguntas realistas y sigue tu progreso.",
        ctaPrimary: "Explorar quizzes",
        ctaSecondary: "Ver certificaciones",
        moreArticles: "Más artículos",
        blog: "Blog",
      };
    default:
      return {
        fromBlog: "From the blog",
        readMore: "Read the article",
        ctaTitle: "Ready to practice?",
        ctaBody:
          "Jump into quizzes, train with realistic questions, and track your progress.",
        ctaPrimary: "Explore quizzes",
        ctaSecondary: "Browse certifications",
        moreArticles: "More articles",
        blog: "Blog",
      };
  }
}

function cx(...parts: Array<string | undefined | false | null>) {
  return parts.filter(Boolean).join(" ");
}

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ lang: Locale; slug: string }>; // ✅ Next 15: params async
}) {
  const { lang, slug } = await params; // ✅ FIX: await params

  const article = await sanityServerClient.fetch<any>(articleBySlugLang, {
    lang,
    slug,
  });

  if (!article) return notFound();

  const value = article.body ?? [];
  const labels = getLabels(lang);

  const date = formatDate(lang, article.publishedAt ?? article.date);
  const coverUrl: string | undefined = article.coverUrl || undefined;

  const blogBase = blogIndexPath(lang);
  const hrefQuizHome = quizHomePath(lang);
  const hrefCerts = certificationsPath(lang);

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <div className="mb-4 text-sm text-zinc-500">
        <Link className="hover:underline" href={blogBase}>
          {labels.blog}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-zinc-700">{article.title}</span>
      </div>

      <header className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-6 md:flex-row md:items-start">
          {coverUrl ? (
            <div className="relative h-52 w-full overflow-hidden rounded-2xl bg-zinc-100 md:h-44 md:w-64">
              <img
                src={coverUrl}
                alt={article.title ?? "Cover"}
                className="h-full w-full object-cover"
                loading="eager"
              />
            </div>
          ) : (
            <div className="hidden md:block md:h-44 md:w-64" />
          )}

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700">
                {labels.fromBlog}
              </span>
              <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700">
                {lang.toUpperCase()}
              </span>
              {date ? (
                <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-600">
                  {date}
                </span>
              ) : null}
            </div>

            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-zinc-900 md:text-4xl">
              {article.title}
            </h1>

            {article.excerpt ? (
              <p className="mt-4 text-base leading-relaxed text-zinc-700">
                {article.excerpt}
              </p>
            ) : null}

            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href={hrefQuizHome}
                className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
              >
                {labels.ctaPrimary}
              </Link>

              <Link
                href={hrefCerts}
                className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
              >
                {labels.ctaSecondary}
              </Link>
            </div>
          </div>
        </div>
      </header>

      <section className="mt-8">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className={cx("prose prose-zinc lg:prose-lg", "max-w-none")}>
            <PortableText value={value} components={portableTextComponents} />
          </div>
        </div>
      </section>

      <section className="mt-10 rounded-2xl border border-zinc-200 bg-gradient-to-b from-white to-zinc-50 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-zinc-900">
          {labels.ctaTitle}
        </h3>
        <p className="mt-2 text-zinc-600">{labels.ctaBody}</p>

        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href={hrefQuizHome}
            className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
          >
            {labels.ctaPrimary}
          </Link>
          <Link
            href={blogBase}
            className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
          >
            {labels.moreArticles}
          </Link>
        </div>
      </section>
    </main>
  );
}
