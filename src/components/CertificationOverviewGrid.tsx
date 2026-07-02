"use client";

import { useMemo, useState } from "react";
import CertificationOverviewCard from "@/components/CertificationOverviewCard";
import type { Locale } from "@/lib/data";

type OverviewItem = {
  id: number;
  certificationTitle: string;
  title: string;
  href: string;
};

type Props = {
  lang: Locale;
  items: OverviewItem[];
};

const labels = {
  it: {
    title: "Ripassi rapidi",
    subtitle: "Rivedi i concetti principali prima di affrontare un quiz o una simulazione d’esame.",
    badge: "CertifyQuiz Reviews",
    available: "ripassi",
    open: "Apri ripassi",
    search: "Cerca certificazione o topic...",
    empty: "Nessun ripasso disponibile al momento.",
    noResults: "Nessun risultato trovato.",
    more: "altri ripassi",
    certifications: "certificazioni",
    reviews: "ripassi",
  },
  en: {
    title: "Quick reviews",
    subtitle: "Review the key concepts before taking a quiz or a mock exam.",
    badge: "CertifyQuiz Reviews",
    available: "reviews",
    open: "Open reviews",
    search: "Search certification or topic...",
    empty: "No reviews available yet.",
    noResults: "No results found.",
    more: "more reviews",
    certifications: "certifications",
    reviews: "reviews",
  },
  fr: {
    title: "Révisions rapides",
    subtitle: "Révisez les concepts clés avant de passer un quiz ou un examen blanc.",
    badge: "CertifyQuiz Reviews",
    available: "révisions",
    open: "Ouvrir les révisions",
    search: "Rechercher une certification ou un sujet...",
    empty: "Aucune révision disponible pour le moment.",
    noResults: "Aucun résultat trouvé.",
    more: "autres révisions",
    certifications: "certifications",
    reviews: "révisions",
  },
  es: {
    title: "Repasos rápidos",
    subtitle: "Repasa los conceptos clave antes de hacer un quiz o una simulación de examen.",
    badge: "CertifyQuiz Reviews",
    available: "repasos",
    open: "Abrir repasos",
    search: "Buscar certificación o tema...",
    empty: "No hay repasos disponibles por el momento.",
    noResults: "No se encontraron resultados.",
    more: "repasos más",
    certifications: "certificaciones",
    reviews: "repasos",
  },
};

function certAccent(index: number) {
  const styles = [
    "border-blue-200 bg-gradient-to-br from-blue-50 to-white",
    "border-emerald-200 bg-gradient-to-br from-emerald-50 to-white",
    "border-violet-200 bg-gradient-to-br from-violet-50 to-white",
    "border-amber-200 bg-gradient-to-br from-amber-50 to-white",
    "border-rose-200 bg-gradient-to-br from-rose-50 to-white",
    "border-cyan-200 bg-gradient-to-br from-cyan-50 to-white",
  ];

  return styles[index % styles.length];
}

export default function CertificationOverviewGrid({ lang, items }: Props) {
  const t = labels[lang];
  const [query, setQuery] = useState("");

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    const map = new Map<string, OverviewItem[]>();

    for (const item of items) {
      const matches =
        !q ||
        item.certificationTitle.toLowerCase().includes(q) ||
        item.title.toLowerCase().includes(q);

      if (!matches) continue;

      if (!map.has(item.certificationTitle)) {
        map.set(item.certificationTitle, []);
      }

      map.get(item.certificationTitle)!.push(item);
    }

    return Array.from(map.entries());
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

            <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">
              {t.title}
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-200 md:text-base">
              {t.subtitle}
            </p>
          </div>

          <div className="flex gap-3">
            <div className="rounded-2xl bg-white/10 px-4 py-3 text-center">
              <div className="text-2xl font-extrabold">{new Set(items.map((i) => i.certificationTitle)).size}</div>
              <div className="text-xs font-semibold text-slate-300">{t.certifications}</div>
            </div>

            <div className="rounded-2xl bg-white/10 px-4 py-3 text-center">
              <div className="text-2xl font-extrabold">{items.length}</div>
              <div className="text-xs font-semibold text-slate-300">{t.reviews}</div>
            </div>
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

      {groups.length === 0 ? (
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 text-slate-600">
          {t.noResults}
        </section>
      ) : (
        <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {groups.map(([certTitle, groupItems], index) => (
            <CertificationOverviewCard
              key={certTitle}
              certificationTitle={certTitle}
              items={groupItems}
              availableLabel={t.available}
              openLabel={t.open}
              moreLabel={t.more}
              accentClass={certAccent(index)}
            />
          ))}
        </section>
      )}
    </main>
  );
}