"use client";

// Finder certificazioni della home, SOLO mobile (md:hidden): ricerca live su una lista
// leggera passata dal server (nessuna chiamata API mentre si digita) + chip popolari
// + chip categoria. Se la lista non e' disponibile resta tutto tranne il campo di ricerca.

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId, useMemo, useState, type KeyboardEvent } from "react";
import { Search } from "lucide-react";

import { trackEvent, trackEventOnce } from "@/lib/analytics";
import {
  FINDER_COPY,
  POPULAR_CERTS,
  prepareFinderIndex,
  searchFinder,
  type FinderCert,
} from "@/lib/home-finder";
import { certPath, certificationsPath, type Locale } from "@/lib/paths";

export type FinderCategory = { key: string; title: string; href: string };

type Props = {
  lang: Locale;
  /** null = lista non disponibile (errore backend): niente campo di ricerca, solo chip. */
  certs: FinderCert[] | null;
  categories: FinderCategory[];
};

const CHIP =
  "inline-flex min-h-11 shrink-0 items-center rounded-full border px-4 text-sm font-semibold whitespace-nowrap transition";
const ROW =
  "-mx-4 flex snap-x scroll-px-4 gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden";

export default function MobileCertFinder({ lang, certs, categories }: Props) {
  const t = FINDER_COPY[lang];
  const router = useRouter();
  const baseId = useId();
  const listId = `${baseId}-results`;
  const optionId = (i: number) => `${baseId}-opt-${i}`;

  const [query, setQuery] = useState("");
  const [active, setActive] = useState(-1);

  const index = useMemo(() => (certs ? prepareFinderIndex(certs) : []), [certs]);
  const results = useMemo(() => searchFinder(index, query), [index, query]);

  const popular = useMemo(() => {
    if (!certs) return POPULAR_CERTS;
    const available = new Set(certs.map((c) => c.slug));
    return POPULAR_CERTS.filter((c) => available.has(c.slug));
  }, [certs]);

  const hasQuery = query.trim().length > 0;
  const open = hasQuery && certs !== null;

  const go = (cert: FinderCert) => {
    trackEvent("homepage_finder_result_selected", { language: lang, cert_slug: cert.slug });
    router.push(cert.href);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown" && results.length > 0) {
      e.preventDefault();
      setActive((i) => (i + 1) % results.length);
    } else if (e.key === "ArrowUp" && results.length > 0) {
      e.preventDefault();
      setActive((i) => (i <= 0 ? results.length - 1 : i - 1));
    } else if (e.key === "Enter") {
      const target = results[active >= 0 ? active : 0];
      if (target) {
        e.preventDefault();
        go(target);
      }
    } else if (e.key === "Escape" && hasQuery) {
      e.preventDefault();
      setQuery("");
      setActive(-1);
    }
  };

  const status = !open ? "" : results.length > 0 ? t.results(results.length) : t.noResults(query.trim());

  return (
    <section aria-labelledby={`${baseId}-title`} className="mt-5 text-left md:hidden">
      <h2 id={`${baseId}-title`} className="text-base font-extrabold text-slate-900">
        {t.title}
      </h2>

      {certs ? (
        <div className="mt-2">
          <div className="relative">
            <Search
              size={18}
              aria-hidden="true"
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
            />
            <input
              type="search"
              role="combobox"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActive(-1);
                trackEventOnce("homepage_finder_search_used", "homepage_finder_search_used", { language: lang });
              }}
              onKeyDown={onKeyDown}
              aria-label={t.label}
              aria-expanded={open && results.length > 0}
              aria-controls={listId}
              aria-autocomplete="list"
              aria-activedescendant={open && active >= 0 ? optionId(active) : undefined}
              placeholder={t.placeholder}
              enterKeyHint="go"
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
              className="h-12 w-full rounded-xl border border-slate-300 bg-white pl-10 pr-3 text-base text-slate-900 shadow-sm placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <p role="status" aria-live="polite" className="sr-only">
            {status}
          </p>

          {open && (
            <div className="mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              {results.length > 0 ? (
                <ul id={listId} role="listbox" aria-label={t.title} className="divide-y divide-slate-100">
                  {results.map((cert, i) => (
                    <li
                      key={cert.slug}
                      id={optionId(i)}
                      role="option"
                      aria-selected={i === active}
                      onClick={() => go(cert)}
                      className={`flex min-h-11 cursor-pointer items-center px-4 py-2 text-sm font-semibold text-slate-800 ${
                        i === active ? "bg-blue-50" : "active:bg-slate-50"
                      }`}
                    >
                      {cert.title}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="px-4 py-3 text-sm text-slate-600">{t.noResults(query.trim())}</p>
              )}
              <Link
                href={certificationsPath(lang)}
                className="flex min-h-11 items-center border-t border-slate-100 px-4 text-sm font-bold text-blue-700"
              >
                {t.seeAll}
              </Link>
            </div>
          )}
        </div>
      ) : (
        <Link
          href={certificationsPath(lang)}
          className="mt-2 flex h-12 items-center justify-center rounded-xl border border-slate-300 bg-white text-sm font-bold text-slate-900 shadow-sm"
        >
          {t.seeAll}
        </Link>
      )}

      <nav aria-label={t.popular} className="mt-3">
        <ul className={ROW}>
          {popular.map((c) => (
            <li key={c.slug} className="snap-start">
              <Link
                href={certPath(lang, c.slug)}
                onClick={() => trackEvent("homepage_finder_chip_clicked", { language: lang, chip_type: "popular", cert_slug: c.slug })}
                className={`${CHIP} border-blue-200 bg-blue-50 text-blue-900 hover:bg-blue-100`}
              >
                {c.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <nav aria-label={t.categories} className="mt-2">
        <ul className={ROW}>
          {categories.map((c) => (
            <li key={c.key} className="snap-start">
              <Link
                href={c.href}
                onClick={() => trackEvent("homepage_finder_chip_clicked", { language: lang, chip_type: "category", category: c.key })}
                className={`${CHIP} border-slate-300 bg-white text-slate-800 hover:bg-slate-50`}
              >
                {c.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </section>
  );
}
