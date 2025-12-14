"use client";

import { useMemo, useState } from "react";
import { CertificationCard } from "./CertificationCard";

type LevelKey = "base" | "intermediate" | "advanced" | null;

type CertListClientItem = {
  slug: string;
  href: string;
  title: string;
  level?: string | null;
  description?: string | null;
  imageUrl?: string | null;
  levelKey?: LevelKey;
  category?: string | null;
};

export function CertificationListClient({
  items,
}: {
  items: CertListClientItem[];
}) {
  const [query, setQuery] = useState("");
  const [levelFilter, setLevelFilter] = useState<LevelKey | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState<string | "all">("all");

  const categories = useMemo(() => {
    const set = new Set<string>();
    for (const c of items) {
      if (c.category && c.category.trim().length > 0) {
        set.add(c.category);
      }
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [items]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return items.filter((c) => {
      // search
      if (q) {
        const haystack =
          (c.title ?? "") +
          " " +
          (c.level ?? "") +
          " " +
          (c.description ?? "") +
          " " +
          (c.category ?? "");
        if (!haystack.toLowerCase().includes(q)) return false;
      }

      // livello
      if (levelFilter !== "all") {
        if ((c.levelKey ?? null) !== levelFilter) return false;
      }

      // categoria
      if (categoryFilter !== "all") {
        if ((c.category ?? null) !== categoryFilter) return false;
      }

      return true;
    });
  }, [items, query, levelFilter, categoryFilter]);

  if (!items.length) {
    return (
      <div className="rounded-xl border border-dashed p-6 text-sm text-gray-500 dark:text-neutral-400">
        Nessuna certificazione disponibile.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cerca certificazione…"
          className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm
                     shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200
                     dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
        />
      </div>

      {/* Filtri */}
      <div className="flex flex-wrap gap-2 text-xs sm:text-[13px]">
        {/* Livello */}
        <div className="flex items-center gap-1">
          <span className="mr-1 font-medium text-gray-600 dark:text-neutral-300">
            Livello:
          </span>
          {[
            { key: "all" as const, label: "Tutti" },
            { key: "base" as const, label: "Base" },
            { key: "intermediate" as const, label: "Intermedio" },
            { key: "advanced" as const, label: "Avanzato" },
          ].map((opt) => (
            <button
              key={opt.key}
              type="button"
              onClick={() =>
                setLevelFilter(opt.key === "all" ? "all" : (opt.key as LevelKey))
              }
              className={`rounded-full border px-3 py-1 transition ${
                levelFilter === opt.key
                  ? "border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-900/30 dark:text-blue-100"
                  : "border-gray-300 bg-white text-gray-700 hover:border-blue-400 hover:bg-blue-50 dark:border-neutral-600 dark:bg-neutral-900 dark:text-neutral-200"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Categoria */}
        {categories.length > 0 && (
          <div className="flex flex-wrap items-center gap-1">
            <span className="mr-1 font-medium text-gray-600 dark:text-neutral-300">
              Categoria:
            </span>
            <button
              type="button"
              onClick={() => setCategoryFilter("all")}
              className={`rounded-full border px-3 py-1 transition ${
                categoryFilter === "all"
                  ? "border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-900/30 dark:text-blue-100"
                  : "border-gray-300 bg-white text-gray-700 hover:border-blue-400 hover:bg-blue-50 dark:border-neutral-600 dark:bg-neutral-900 dark:text-neutral-200"
              }`}
            >
              Tutte
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoryFilter(cat)}
                className={`rounded-full border px-3 py-1 transition ${
                  categoryFilter === cat
                    ? "border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-900/30 dark:text-blue-100"
                    : "border-gray-300 bg-white text-gray-700 hover:border-blue-400 hover:bg-blue-50 dark:border-neutral-600 dark:bg-neutral-900 dark:text-neutral-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Grid */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.length ? (
          filtered.map((c) => (
            <CertificationCard
              key={c.slug}
              href={c.href}
              title={c.title}
              imageUrl={c.imageUrl ?? undefined}
              level={c.level ?? undefined}
              description={c.description ?? undefined}
            />
          ))
        ) : (
          <div className="col-span-full rounded-xl border border-dashed p-6 text-sm text-gray-500 dark:text-neutral-400">
            Nessuna certificazione trovata per “{query}”.
          </div>
        )}
      </section>
    </div>
  );
}
