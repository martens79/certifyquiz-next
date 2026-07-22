"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Locale } from "@/lib/paths";
import { guidePath } from "@/lib/paths";
import type { GuideOverviewItem } from "@/lib/data";
import { apiFetch } from "@/lib/auth";
import { useAuth } from "@/components/auth/AuthProvider";

type Props = {
  lang: Locale;
  items: GuideOverviewItem[];
};

const LABELS = {
  it: {
    badge: "CertifyQuiz Guide",
    title: "Guide PDF di studio",
    subtitle:
      "Sintesi scaricabili in PDF per prepararti alle certificazioni: anteprima gratuita, incluse in Premium o acquistabili singolarmente.",
    search: "Cerca certificazione o guida...",
    empty: "Nessuna guida disponibile al momento.",
    noResults: "Nessun risultato trovato.",
    count: "guide",
    open: "Apri guida",
    statusPremium: "Incluso in Premium",
    statusPurchased: "Acquistata",
    statusLocked: (price: string) => price,
    statusFree: "Anteprima gratuita",
    italianOnly: "",
  },
  en: {
    badge: "CertifyQuiz Guides",
    title: "Study PDF guides",
    subtitle:
      "Downloadable PDF summaries to prepare for certifications: free preview, included in Premium, or available as a single purchase.",
    search: "Search certification or guide...",
    empty: "No guides available yet.",
    noResults: "No results found.",
    count: "guides",
    open: "Open guide",
    statusPremium: "Included in Premium",
    statusPurchased: "Purchased",
    statusLocked: (price: string) => price,
    statusFree: "Free preview",
    italianOnly: "🇮🇹 Currently in Italian only",
  },
  fr: {
    badge: "CertifyQuiz Guides",
    title: "Guides PDF d'étude",
    subtitle:
      "Résumés PDF téléchargeables pour préparer vos certifications : aperçu gratuit, inclus dans Premium ou achetables à l'unité.",
    search: "Rechercher une certification ou un guide...",
    empty: "Aucun guide disponible pour le moment.",
    noResults: "Aucun résultat trouvé.",
    count: "guides",
    open: "Ouvrir le guide",
    statusPremium: "Inclus dans Premium",
    statusPurchased: "Acheté",
    statusLocked: (price: string) => price,
    statusFree: "Aperçu gratuit",
    italianOnly: "🇮🇹 Disponible uniquement en italien pour l'instant",
  },
  es: {
    badge: "CertifyQuiz Guías",
    title: "Guías PDF de estudio",
    subtitle:
      "Resúmenes en PDF descargables para preparar certificaciones: vista previa gratuita, incluidas en Premium o disponibles como compra única.",
    search: "Buscar certificación o guía...",
    empty: "No hay guías disponibles por el momento.",
    noResults: "No se encontraron resultados.",
    count: "guías",
    open: "Abrir guía",
    statusPremium: "Incluida en Premium",
    statusPurchased: "Comprada",
    statusLocked: (price: string) => price,
    statusFree: "Vista previa gratuita",
    italianOnly: "🇮🇹 Por ahora solo en italiano",
  },
} as const;

function formatPrice(lang: Locale, price: number) {
  const locale =
    lang === "it" ? "it-IT" : lang === "fr" ? "fr-FR" : lang === "es" ? "es-ES" : "en-US";

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "EUR",
  }).format(price);
}

function StatusBadge({
  lang,
  access,
  price,
}: {
  lang: Locale;
  access: GuideOverviewItem["access"];
  price: number;
}) {
  const t = LABELS[lang];

  const style =
    access === "premium"
      ? "bg-emerald-50 text-emerald-800"
      : access === "purchased"
      ? "bg-blue-50 text-blue-800"
      : "bg-amber-50 text-amber-800";

  const label =
    access === "premium"
      ? t.statusPremium
      : access === "purchased"
      ? t.statusPurchased
      : t.statusLocked(formatPrice(lang, price));

  return (
    <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${style}`}>
      {label}
    </span>
  );
}

export default function GuideOverviewGrid({ lang, items }: Props) {
  const t = LABELS[lang];
  const [query, setQuery] = useState("");
  const { loading: authLoading, user } = useAuth();
  const [liveAccess, setLiveAccess] = useState<Record<
    number,
    GuideOverviewItem["access"]
  > | null>(null);

  // items sopra sono da un fetch server-side non autenticato (cache 1h) —
  // qui rifacciamo la stessa chiamata lato client con il token, per mostrare
  // lo stato reale (Premium/Acquistata) invece del prezzo generico a tutti.
  useEffect(() => {
    let cancelled = false;

    async function refreshAccess() {
      if (!user) return;
      try {
        const res = await apiFetch(`/guides?lang=${lang}`);
        const json = await res.json().catch(() => null);
        if (!cancelled && Array.isArray(json?.items)) {
          const map: Record<number, GuideOverviewItem["access"]> = {};
          for (const it of json.items) map[it.id] = it.access;
          setLiveAccess(map);
        }
      } catch {
        // silenzioso: si resta sul fallback SSR (prezzo)
      }
    }

    if (!authLoading) refreshAccess();

    return () => {
      cancelled = true;
    };
  }, [authLoading, user, lang]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;

    return items.filter(
      (item) =>
        item.certification_name.toLowerCase().includes(q) ||
        item.title.toLowerCase().includes(q)
    );
  }, [items, query]);

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-8">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-600">
          {t.empty}
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 md:py-8">
      <section className="rounded-3xl bg-slate-950 px-5 py-6 text-white shadow-sm md:px-8 md:py-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <p className="mb-3 inline-flex rounded-full bg-blue-500/15 px-3 py-1 text-xs font-bold uppercase tracking-wide text-blue-200">
              {t.badge}
            </p>

            <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">{t.title}</h1>

            <p className="mt-3 text-sm leading-6 text-slate-200 md:text-base">{t.subtitle}</p>
          </div>

          <div className="rounded-2xl bg-white/10 px-4 py-3 text-center">
            <div className="text-2xl font-extrabold">{items.length}</div>
            <div className="text-xs font-semibold text-slate-300">{t.count}</div>
          </div>
        </div>
      </section>

      <section className="mt-5">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.search}
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
        />
      </section>

      {filtered.length === 0 ? (
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 text-slate-600">
          {t.noResults}
        </section>
      ) : (
        <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {filtered.map((item) => (
            <Link
              key={item.id}
              href={guidePath(lang, item.slug)}
              className="flex flex-col rounded-2xl border border-slate-200 bg-gradient-to-br from-blue-50 to-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="mb-3 flex items-start justify-between gap-3">
                <p className="text-xs font-semibold text-slate-500">
                  {item.certification_name}
                </p>
                <StatusBadge
                  lang={lang}
                  access={liveAccess?.[item.id] ?? item.access}
                  price={item.price}
                />
              </div>

              <h2 className="mb-2 line-clamp-2 text-lg font-extrabold text-slate-950">
                {item.title}
              </h2>

              {lang !== "it" && !item.lang_available && t.italianOnly ? (
                <p className="mb-2 inline-flex w-fit rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                  {t.italianOnly}
                </p>
              ) : null}

              {item.page_count ? (
                <p className="mb-3 text-xs font-semibold text-slate-500">
                  {item.page_count} pp.
                </p>
              ) : null}

              <span className="mt-auto inline-flex justify-end text-sm font-extrabold text-blue-700">
                {t.open} →
              </span>
            </Link>
          ))}
        </section>
      )}
    </main>
  );
}
