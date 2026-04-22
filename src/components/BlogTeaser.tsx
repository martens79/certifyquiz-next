"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import type { Locale } from "@/lib/i18n";
import { blogPath } from "@/lib/paths";

type Article = {
  slug: string;
  title: string;
  excerpt?: string;
  publishedAt?: string;
  coverUrl?: string;
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
  limit = 1,
}: {
  lang: Locale;
  className?: string;
  variant?: "default" | "compact" | "home";
  limit?: number;
}) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch(`/api/blog/latest?lang=${lang}&limit=${limit}`, {
          cache: "no-store",
        });

        if (!res.ok) {
          if (!cancelled) setArticles([]);
          return;
        }

        const data = await res.json();

        if (!cancelled) {
          if (Array.isArray(data?.articles)) {
            setArticles(data.articles);
          } else if (data?.article) {
            setArticles([data.article]);
          } else {
            setArticles([]);
          }
        }
      } catch {
        if (!cancelled) setArticles([]);
      } finally {
        if (!cancelled) setLoaded(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [lang, limit]);

  if (!loaded || articles.length === 0) return null;

  /* ---------------- HOME GRID ---------------- */
  if (variant === "home") {
  return (
    <div className={cx("grid gap-2 grid-cols-1 md:grid-cols-2", className)}>
      {articles.map((article) => {
        const href = blogPath(lang, article.slug);
        const date = formatDate(lang, article.publishedAt);
        const thumb = article.coverUrl
          ? sanityThumb(article.coverUrl, 120, 120)
          : null;

        return (
          <Link
            key={article.slug}
            href={href}
            className="flex items-center gap-3 rounded-xl border bg-white p-2.5 shadow-sm hover:shadow-md transition"
          >
            {/* mini image */}
            <div className="w-14 h-14 rounded-md overflow-hidden bg-zinc-100 shrink-0">
              {thumb && (
                <Image
                  src={thumb}
                  alt={article.title}
                  width={56}
                  height={56}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {/* text */}
            <div className="min-w-0 flex-1">
              <p className="text-[10px] text-zinc-500">
                {date}
              </p>

              <h3 className="text-sm font-semibold text-zinc-900 line-clamp-2 leading-tight">
                {article.title}
              </h3>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
  /* ---------------- SINGLE CARD ---------------- */
  const article = articles[0];
  const href = blogPath(lang, article.slug);
  const date = formatDate(lang, article.publishedAt);
  const thumb = article.coverUrl
    ? sanityThumb(article.coverUrl, 160, 160)
    : null;

  return (
    <div
      className={cx(
        "rounded-xl border bg-white p-3 shadow-sm hover:shadow-md transition",
        className
      )}
    >
      <div className="flex gap-3 items-center">
        <Link href={href}>
          <div className="w-16 h-16 md:w-[72px] md:h-[72px] rounded-lg overflow-hidden bg-zinc-100">
            {thumb && (
              <Image
                src={thumb}
                alt={article.title}
                width={72}
                height={72}
                className="w-full h-full object-cover"
              />
            )}
          </div>
        </Link>

        <div className="flex-1 min-w-0">
          <p className="text-xs text-zinc-500">
            From the blog {date && `· ${date}`}
          </p>

          <h3 className="font-semibold text-sm md:text-base line-clamp-2">
            <Link href={href} className="hover:underline">
              {article.title}
            </Link>
          </h3>

          {article.excerpt && variant !== "compact" && (
            <p className="text-xs text-zinc-600 line-clamp-2 mt-1">
              {article.excerpt}
            </p>
          )}
        </div>

        <Link
          href={href}
          className="bg-blue-600 text-white text-xs px-3 py-2 rounded-lg font-semibold shrink-0"
        >
          Read →
        </Link>
      </div>
    </div>
  );
}