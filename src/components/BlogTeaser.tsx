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

  // ✅ Ora possiamo calcolare tutto SENZA hooks extra
  const base = `/${lang}/${BLOG_SEGMENT_BY_LANG[lang]}`;
  const href = article?.slug ? `${base}/${article.slug}` : "";
  const dateLabel = formatDate(lang, article?.publishedAt);
  const excerpt = (article?.excerpt ?? "").trim();

  // Regola: se non c'è articolo per la lingua → NASCONDI
  if (!loaded) return null;
  if (!article?.slug) return null;

  return (
    <section
      className={cx(
        "overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm",
        "transition hover:border-zinc-300 hover:shadow-md",
        className
      )}
    >
      {/* Cover */}
      {article.coverUrl ? (
        <Link href={href} className="block">
          <div className="relative h-36 w-full bg-zinc-100">
            <img
              src={article.coverUrl}
              alt={article.title}
              className="h-full w-full object-cover"
              loading="lazy"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-black/0 to-black/0" />
          </div>
        </Link>
      ) : null}

      <div className="p-4">
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

        <h3 className="mt-2 text-lg font-semibold leading-snug text-zinc-900">
          <Link className="hover:underline" href={href}>
            {article.title}
          </Link>
        </h3>

        {excerpt ? <p className="mt-2 line-clamp-3 text-sm text-zinc-600">{excerpt}</p> : null}

        <div className="mt-4 flex items-center justify-between gap-3">
          <Link
            href={href}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
          >
            {LBL_READ[lang]} <span aria-hidden>→</span>
          </Link>

          <Link href={base} className="text-sm font-medium text-zinc-700 hover:underline">
            {lang === "it" ? "Tutti gli articoli" : "All posts"}
          </Link>
        </div>
      </div>
    </section>
  );
}
