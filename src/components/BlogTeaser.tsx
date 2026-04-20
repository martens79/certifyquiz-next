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

  const base = blogIndexPath(lang);

  /* ---------------- SINGLE CARD (vecchio comportamento) ---------------- */
  if (articles.length === 1) {
    const article = articles[0];
    const href = blogPath(lang, article.slug);
    const date = formatDate(lang, article.publishedAt);
    const thumb = article.coverUrl
      ? sanityThumb(article.coverUrl, 200, 200)
      : null;

    return (
      <div
        className={cx(
          "rounded-xl border bg-white p-4 shadow-sm hover:shadow-md transition",
          className
        )}
      >
        <div className="flex gap-4 items-center">
          {/* image */}
          <Link href={href}>
            <div className="w-20 h-20 rounded-lg overflow-hidden bg-zinc-100">
              {thumb && (
                <Image
                  src={thumb}
                  alt={article.title}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          </Link>

          {/* text */}
          <div className="flex-1 min-w-0">
            <p className="text-xs text-zinc-500">
              From the blog {date && `· ${date}`}
            </p>

            <h3 className="font-semibold text-sm md:text-base truncate">
              <Link href={href} className="hover:underline">
                {article.title}
              </Link>
            </h3>

            {article.excerpt && (
              <p className="text-xs md:text-sm text-zinc-600 line-clamp-2 mt-1">
                {article.excerpt}
              </p>
            )}
          </div>

          <Link
            href={href}
            className="bg-blue-600 text-white text-xs md:text-sm px-3 py-2 rounded-lg font-semibold"
          >
            Read →
          </Link>
        </div>
      </div>
    );
  }

  /* ---------------- GRID (HOME VERSION) ---------------- */
  return (
    <div
      className={cx(
        "grid gap-4",
        "grid-cols-1 md:grid-cols-2",
        className
      )}
    >
      {articles.map((article, i) => {
        const href = blogPath(lang, article.slug);
        const date = formatDate(lang, article.publishedAt);
        const thumb = article.coverUrl
          ? sanityThumb(article.coverUrl, 400, 300)
          : null;

        return (
          <Link
            key={article.slug}
            href={href}
            className={cx(
              "rounded-xl border bg-white overflow-hidden shadow-sm hover:shadow-md transition",
              i === 0 ? "md:col-span-1" : ""
            )}
          >
            {/* image */}
            {thumb && (
              <div className="h-40 bg-zinc-100">
                <Image
                  src={thumb}
                  alt={article.title}
                  width={400}
                  height={300}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* content */}
            <div className="p-4">
              <p className="text-xs text-zinc-500">
                From the blog {date && `· ${date}`}
              </p>

              <h3 className="font-bold text-base md:text-lg mt-1 line-clamp-2">
                {article.title}
              </h3>

              {article.excerpt && (
                <p className="text-sm text-zinc-600 mt-2 line-clamp-3">
                  {article.excerpt}
                </p>
              )}

              <div className="mt-3 text-blue-600 font-semibold text-sm">
                Read →
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}