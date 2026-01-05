"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Locale } from "@/lib/i18n";

type Variant = "inline" | "grid";

type Article = {
  slug: string;
  title: string;
  excerpt?: string;
  publishedAt?: string;
  coverUrl?: string;
};

const BLOG_SEGMENT_BY_LANG: Record<Locale, string> = {
  it: "blog",
  en: "blog",
  fr: "blog",
  es: "blog",
};

const LBL_FROM_BLOG: Record<Locale, string> = {
  it: "Dal blog",
  en: "From the blog",
  fr: "Du blog",
  es: "Del blog",
};

const LBL_READ: Record<Locale, string> = {
  it: "Leggi",
  en: "Read",
  fr: "Lire",
  es: "Leer",
};

const LBL_ALL_POSTS: Record<Locale, string> = {
  it: "Tutti gli articoli",
  en: "All posts",
  fr: "Tous les articles",
  es: "Todos los artículos",
};

function cx(...parts: Array<string | undefined | false | null>) {
  return parts.filter(Boolean).join(" ");
}

function formatDate(lang: Locale, iso?: string) {
  if (!iso) return "";
  try {
    const locale = lang === "en" ? "en-US" : lang;
    return new Date(iso).toLocaleDateString(locale, {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  } catch {
    return "";
  }
}

export default function BlogTeaser({
  lang,
  variant = "inline",
  className,
}: {
  lang: Locale;
  variant?: Variant;
  className?: string;
}) {
  const [article, setArticle] = useState<Article | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch(`/api/blog/latest?lang=${lang}`, { cache: "no-store" });
        const data = await res.json();
        if (!cancelled) setArticle(data.article ?? null);
      } catch {
        if (!cancelled) setArticle(null);
      } finally {
        if (!cancelled) setLoaded(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [lang]);

  // Regola: se non c'è articolo per la lingua → NASCONDI
  if (!loaded) return null;
  if (!article?.slug) return null;

  const base = `/${lang}/${BLOG_SEGMENT_BY_LANG[lang]}`;
  const href = `${base}/${article.slug}`;
  const dateLabel = formatDate(lang, article.publishedAt);
  const excerpt = (article.excerpt ?? "").trim();

  // per ora usiamo lo stesso layout anche se un domani vuoi "grid"
  void variant;

  return (
    <section
      className={cx(
        "overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm",
        "transition hover:border-zinc-300 hover:shadow-md",
        "md:flex md:items-stretch",
        className
      )}
    >
      {/* Cover: compatta, non dominante (home-friendly) */}
      {article.coverUrl ? (
        <Link href={href} className="block md:w-1/3">
          <div className="relative h-20 w-full bg-zinc-100 md:h-full">
            <img
              src={article.coverUrl}
              alt={article.title}
              className="h-full w-full object-cover"
              loading="lazy"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/15 via-black/0 to-black/0" />
          </div>
        </Link>
      ) : null}

      <div className="flex-1 p-3 md:p-4">
        {/* Meta */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm text-zinc-500">{LBL_FROM_BLOG[lang]}</p>

          <div className="flex items-center gap-2">
            <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700">
              {lang.toUpperCase()}
            </span>
            {dateLabel ? (
              <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs text-zinc-600">
                {dateLabel}
              </span>
            ) : null}
          </div>
        </div>

        {/* Title */}
        <h3 className="mt-2 text-base font-semibold leading-snug text-zinc-900 md:text-lg">
          <Link className="hover:underline" href={href}>
            {article.title}
          </Link>
        </h3>

        {/* Excerpt (più corto in home) */}
        {excerpt ? (
          <p className="mt-1 line-clamp-2 text-sm text-zinc-600 md:mt-2 md:line-clamp-3">
            {excerpt}
          </p>
        ) : null}

        {/* CTA */}
        <div className="mt-3 flex items-center justify-between gap-3 md:mt-4">
          <Link
            href={href}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
          >
            {LBL_READ[lang]} <span aria-hidden>→</span>
          </Link>

          <Link href={base} className="text-sm font-medium text-zinc-700 hover:underline">
            {LBL_ALL_POSTS[lang]}
          </Link>
        </div>
      </div>
    </section>
  );
}
