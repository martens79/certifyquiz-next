// src/components/CertificationHubPage.tsx
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import type { Locale } from "@/lib/i18n";
import { getLabel } from "@/lib/i18n";

export type HubCertItem = {
  slug: string; // slug CERT (es. "google-cloud")
  badge?: string; // es. "Beginner", "Associate", "Professional"
  examCode?: string; // es. "CDL", "ACE", "PCA"
  popularity?: number; // opzionale 0..100
};

export type HubData = {
  hubSlug: string;
  hubType: "vendor" | "category";
  vendorKey?: string;
  categoryKey?: string;

  title: Record<Locale, string>;
  description: Record<Locale, string>;

  certs: HubCertItem[];
};

export type HubResolvedCert = HubCertItem & {
  name: string;
  shortDescription?: string;
  logoUrl?: string;

  certPageHref: string; // link pagina certificazione
  quizHref: string; // link quiz (REGOLA: /{lang}/quiz/...)
};

export default function CertificationHubPage({
  lang,
  title,
  description,
  certs,
}: {
  lang: Locale;
  title: Record<Locale, string>;
  description: Record<Locale, string>;
  certs: HubResolvedCert[];
}) {
  const [q, setQ] = useState("");
  const [levelFilter, setLevelFilter] = useState<string>("");

  const levels = useMemo(() => {
    const set = new Set<string>();
    for (const c of certs) if (c.badge) set.add(c.badge);
    return Array.from(set).sort();
  }, [certs]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return certs.filter((c) => {
      const matchesQuery =
        !query ||
        c.name.toLowerCase().includes(query) ||
        (c.shortDescription ?? "").toLowerCase().includes(query) ||
        (c.examCode ?? "").toLowerCase().includes(query) ||
        (c.badge ?? "").toLowerCase().includes(query);

      const matchesLevel = !levelFilter || (c.badge ?? "") === levelFilter;

      return matchesQuery && matchesLevel;
    });
  }, [certs, q, levelFilter]);

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">
          {getLabel(title, lang)}
        </h1>
        <p className="mt-2 text-base text-neutral-600">
          {getLabel(description, lang)}
        </p>
      </header>

      {/* Filters */}
      <section className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={getLabel(
              {
                it: "Cerca certificazione, livello o exam code…",
                en: "Search certification, level, or exam code…",
                fr: "Rechercher certification, niveau ou code d’examen…",
                es: "Buscar certificación, nivel o código de examen…",
              },
              lang
            )}
            className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-neutral-300"
          />

          {levels.length > 0 && (
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-neutral-300 sm:w-64"
            >
              <option value="">
                {getLabel(
                  {
                    it: "Tutti i livelli",
                    en: "All levels",
                    fr: "Tous les niveaux",
                    es: "Todos los niveles",
                  },
                  lang
                )}
              </option>
              {levels.map((lv) => (
                <option key={lv} value={lv}>
                  {lv}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="text-sm text-neutral-600">
          {filtered.length}{" "}
          {getLabel(
            { it: "certificazioni", en: "certifications", fr: "certifications", es: "certificaciones" },
            lang
          )}
        </div>
      </section>

      {/* Grid */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {filtered.map((c) => (
          <article
            key={c.slug}
            className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start gap-4">
              {/* Logo */}
              <div className="h-14 w-14 shrink-0 overflow-hidden rounded-2xl border border-neutral-100 bg-neutral-50">
                {c.logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={c.logoUrl}
                    alt={c.name}
                    className="h-full w-full object-contain p-2"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-neutral-400">
                    CQ
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="truncate text-base font-semibold">{c.name}</h2>

                  {c.badge && (
                    <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-semibold text-neutral-700">
                      {c.badge}
                    </span>
                  )}

                  {c.examCode && (
                    <span className="rounded-full border border-neutral-200 bg-white px-2 py-0.5 text-xs font-semibold text-neutral-700">
                      {c.examCode}
                    </span>
                  )}
                </div>

                {c.shortDescription && (
                  <p className="mt-1 line-clamp-2 text-sm text-neutral-600">
                    {c.shortDescription}
                  </p>
                )}

                <div className="mt-4 flex flex-wrap gap-2">
                  {/* ✅ QUIZ: SEMPRE /{lang}/quiz/... */}
                  <Link
                    href={c.quizHref}
                    className="inline-flex items-center justify-center rounded-xl bg-yellow-400 px-3 py-2 text-sm font-semibold text-neutral-900 hover:bg-yellow-300"
                  >
                    🚀{" "}
                    {getLabel(
                      { it: "Vai ai quiz", en: "Go to quiz", fr: "Aller au quiz", es: "Ir al quiz" },
                      lang
                    )}
                  </Link>

                  <Link
                    href={c.certPageHref}
                    className="inline-flex items-center justify-center rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm font-semibold text-neutral-800 hover:bg-neutral-50"
                  >
                    {getLabel(
                      { it: "Dettagli", en: "Details", fr: "Détails", es: "Detalles" },
                      lang
                    )}
                  </Link>
                </div>
              </div>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
