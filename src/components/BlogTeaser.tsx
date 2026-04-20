"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import type { Locale } from "@/lib/i18n";
import { blogIndexPath, blogPath } from "@/lib/paths";

type Article = {
  slug: string;
  title: string;
  excerpt?: string;
  publishedAt?: string;
  coverUrl?: string;
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

function sanityThumb(url: string, w: number, h: number) {
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}w=${w}&h=${h}&fit=crop&auto=format`;
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

        if (!res.ok) {
          if (!cancelled) setArticle(null);
          return;
        }

        const data = await res.json();
        if (!cancelled) setArticle(data?.article ?? null);
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

  const isCompact = variant === "compact";
  const imageSize = isCompact ? 72 : 112;

  const thumbUrl =
    article?.coverUrl ? sanityThumb(article.coverUrl, imageSize * 2, imageSize * 2) : null;

  if (!loaded) return null;
  if (!article?.slug) return null;

  const base = blogIndexPath(lang);
  const href = blogPath(lang, article.slug);
  const dateLabel = formatDate(lang, article.publishedAt);
  const excerpt = (article.excerpt ?? "").trim();

  return (
    <section
      className={cx(
        "rounded-2xl border border-zinc-200 bg-white shadow-sm transition hover:border-zinc-300 hover:shadow-md",
        className
      )}
    >
      <div
        className={cx(
          "flex gap-4",
          isCompact
            ? "items-center p-3"
            : "flex-col sm:flex-row sm:items-center p-4 md:p-5"
        )}
      >
        {/* Thumbnail */}
        <Link
          href={href}
          className={cx(
            "shrink-0 overflow-hidden rounded-2xl bg-zinc-100",
            isCompact ? "h-[72px] w-[72px]" : "h-[96px] w-full sm:h-[112px] sm:w-[112px]"
          )}
          aria-label={article.title}
        >
          {thumbUrl ? (
            <Image
              src={thumbUrl}
              alt={article.title}
              width={imageSize}
              height={imageSize}
              sizes={isCompact ? "72px" : "(max-width: 640px) 100vw, 112px"}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : null}
        </Link>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className={cx("text-zinc-500", isCompact ? "text-[11px]" : "text-xs md:text-sm")}>
              {LBL_FROM_BLOG[lang]}
              {dateLabel ? <span className="ml-2 text-zinc-400">· {dateLabel}</span> : null}
            </p>

            <div className="flex items-center gap-2">
              <span
                className={cx(
                  "rounded-full bg-zinc-100 px-2 py-0.5 font-medium text-zinc-700",
                  isCompact ? "text-[10px]" : "text-[11px]"
                )}
              >
                {lang.toUpperCase()}
              </span>

              <Link
                href={base}
                className={cx(
                  "font-medium text-zinc-600 hover:underline",
                  isCompact ? "text-[11px]" : "text-xs md:text-sm"
                )}
                title={lang === "it" ? "Tutti gli articoli" : "All posts"}
              >
                {LBL_ALL_POSTS[lang]}
              </Link>
            </div>
          </div>

          <h3
            className={cx(
              "mt-1 font-bold text-zinc-900 leading-tight",
              isCompact ? "text-sm line-clamp-2" : "text-base md:text-xl line-clamp-2"
            )}
          >
            <Link href={href} className="hover:underline">
              {article.title}
            </Link>
          </h3>

          {excerpt ? (
            <p
              className={cx(
                "mt-2 text-zinc-600 leading-relaxed",
                isCompact
                  ? "text-xs line-clamp-2"
                  : "text-sm md:text-base line-clamp-3"
              )}
            >
              {excerpt}
            </p>
          ) : null}

          {!isCompact && (
            <div className="mt-4 flex items-center justify-between gap-3">
              <Link
                href={base}
                className="text-sm font-medium text-zinc-600 hover:text-zinc-900 hover:underline"
              >
                {LBL_ALL_POSTS[lang]} →
              </Link>

              <Link
                href={href}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
              >
                {LBL_READ[lang]} <span aria-hidden>→</span>
              </Link>
            </div>
          )}
        </div>

        {/* CTA compact */}
        {isCompact && (
          <div className="shrink-0">
            <Link
              href={href}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700"
            >
              {LBL_READ[lang]} <span aria-hidden>→</span>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}