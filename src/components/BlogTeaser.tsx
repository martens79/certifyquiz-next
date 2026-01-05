"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Locale } from "@/lib/i18n";

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
  it: "Tutti",
  en: "All",
  fr: "Tous",
  es: "Todos",
};

function cx(...parts: Array<string | undefined | false | null>) {
  return parts.filter(Boolean).join(" ");
}

function formatDate(lang: Locale, iso?: string) {
  if (!iso) return "";
  try {
    const locale = lang === "en" ? "en-US" : lang;
    return new Date(iso).toLocaleDateString(locale, {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

export default function BlogTeaser({
  lang,
  className,
}: {
  lang: Locale;
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

  return (
    <section
      className={cx(
        "rounded-2xl border border-zinc-200 bg-white shadow-sm",
        "transition hover:border-zinc-300 hover:shadow-md",
        className
      )}
    >
      <div className="flex items-center gap-3 p-3 md:p-4">
        {/* Thumbnail (piccola!) */}
        <Link href={href} className="shrink-0">
          <div className="h-16 w-16 overflow-hidden rounded-xl bg-zinc-100 md:h-20 md:w-20">
            {article.coverUrl ? (
              <img
                src={article.coverUrl}
                alt={article.title}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            ) : null}
          </div>
        </Link>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs text-zinc-500">
              {LBL_FROM_BLOG[lang]}
              {dateLabel ? <span className="ml-2 text-zinc-400">· {dateLabel}</span> : null}
            </p>

            <div className="flex items-center gap-2">
              <span className="hidden rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-700 sm:inline">
                {lang.toUpperCase()}
              </span>
              <Link
                href={base}
                className="text-xs font-medium text-zinc-600 hover:underline"
                title={lang === "it" ? "Tutti gli articoli" : "All posts"}
              >
                {LBL_ALL_POSTS[lang]}
              </Link>
            </div>
          </div>

          <h3 className="mt-0.5 truncate text-sm font-semibold text-zinc-900 md:text-base">
            <Link href={href} className="hover:underline">
              {article.title}
            </Link>
          </h3>

          {excerpt ? (
            <p className="mt-1 line-clamp-1 text-xs text-zinc-600 md:line-clamp-2 md:text-sm">
              {excerpt}
            </p>
          ) : null}
        </div>

        {/* CTA */}
        <div className="shrink-0">
          <Link
            href={href}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 md:text-sm"
          >
            {LBL_READ[lang]} <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
