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
  variant = "default",
}: {
  lang: Locale;
  className?: string;
  variant?: "default" | "compact";
}) {
  const [article, setArticle] = useState<Article | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch(`/api/blog/latest?lang=${lang}`, {
          cache: "no-store",
        });
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

  const isCompact = variant === "compact";

  return (
    <section
      className={cx(
        "rounded-2xl border border-zinc-200 bg-white shadow-sm",
        "transition hover:border-zinc-300 hover:shadow-md",
        className
      )}
    >
      <div
        className={cx(
          "flex items-center gap-3",
          isCompact ? "p-2 md:p-3" : "p-3 md:p-4"
        )}
      >
        {/* Thumbnail */}
        <Link href={href} className="shrink-0">
          <div
            className={cx(
              "overflow-hidden rounded-xl bg-zinc-100",
              isCompact ? "h-12 w-12 md:h-14 md:w-14" : "h-16 w-16 md:h-20 md:w-20"
            )}
          >
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
            <p className={cx("text-zinc-500", isCompact ? "text-[11px]" : "text-xs")}>
              {LBL_FROM_BLOG[lang]}
              {dateLabel ? (
                <span className="ml-2 text-zinc-400">· {dateLabel}</span>
              ) : null}
            </p>

            <div className="flex items-center gap-2">
              <span
                className={cx(
                  "hidden rounded-full bg-zinc-100 px-2 py-0.5 font-medium text-zinc-700 sm:inline",
                  isCompact ? "text-[10px]" : "text-[11px]"
                )}
              >
                {lang.toUpperCase()}
              </span>
              <Link
                href={base}
                className={cx(
                  "font-medium text-zinc-600 hover:underline",
                  isCompact ? "text-[11px]" : "text-xs"
                )}
                title={lang === "it" ? "Tutti gli articoli" : "All posts"}
              >
                {LBL_ALL_POSTS[lang]}
              </Link>
            </div>
          </div>

          <h3
            className={cx(
              "mt-0.5 truncate font-semibold text-zinc-900",
              isCompact ? "text-sm" : "text-sm md:text-base"
            )}
          >
            <Link href={href} className="hover:underline">
              {article.title}
            </Link>
          </h3>

          {excerpt ? (
            <p
              className={cx(
                "mt-1 text-zinc-600",
                // compact: 1 riga, default: 1 su mobile e 2 su desktop
                isCompact
                  ? "line-clamp-1 text-xs"
                  : "line-clamp-1 text-xs md:line-clamp-2 md:text-sm"
              )}
            >
              {excerpt}
            </p>
          ) : null}
        </div>

        {/* CTA */}
        <div className="shrink-0">
          <Link
            href={href}
            className={cx(
              "inline-flex items-center gap-2 rounded-xl bg-blue-600 font-semibold text-white shadow-sm hover:bg-blue-700",
              isCompact ? "px-3 py-1.5 text-xs" : "px-3 py-2 text-xs md:text-sm"
            )}
          >
            {LBL_READ[lang]} <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
