// src/components/ScenarioIndexPage.tsx
// Pagina indice scenari d'esame — stessa struttura di ReviewsIndexPage

import Link from "next/link";
import { getScenariosByCertSlug, type ScenarioListItem, type Locale } from "@/lib/data";

type Lang = Locale;

const labels: Record<Lang, {
  title: string;
  subtitle: string;
  available: string;
  open: string;
  empty: string;
  difficulty: Record<string, string>;
  premium: string;
  locked: string;
}> = {
  it: {
    title: "Scenari d'esame",
    subtitle: "Metti alla prova le tue competenze con scenari pratici che simulano l'esame reale.",
    available: "scenari disponibili",
    open: "Inizia",
    empty: "Nessuno scenario disponibile al momento.",
    difficulty: { base: "Base", advanced: "Avanzato", exam: "Esame" },
    premium: "Premium",
    locked: "Solo Premium",
  },
  en: {
    title: "Exam Scenarios",
    subtitle: "Test your skills with practical scenarios that simulate the real exam.",
    available: "available scenarios",
    open: "Start",
    empty: "No scenarios available yet.",
    difficulty: { base: "Basic", advanced: "Advanced", exam: "Exam" },
    premium: "Premium",
    locked: "Premium only",
  },
  fr: {
    title: "Scénarios d'examen",
    subtitle: "Testez vos compétences avec des scénarios pratiques qui simulent l'examen réel.",
    available: "scénarios disponibles",
    open: "Commencer",
    empty: "Aucun scénario disponible pour le moment.",
    difficulty: { base: "Basique", advanced: "Avancé", exam: "Examen" },
    premium: "Premium",
    locked: "Premium uniquement",
  },
  es: {
    title: "Escenarios de examen",
    subtitle: "Pon a prueba tus habilidades con escenarios prácticos que simulan el examen real.",
    available: "escenarios disponibles",
    open: "Empezar",
    empty: "No hay escenarios disponibles por el momento.",
    difficulty: { base: "Básico", advanced: "Avanzado", exam: "Examen" },
    premium: "Premium",
    locked: "Solo Premium",
  },
};

const difficultyColor: Record<string, string> = {
  base: "bg-green-100 text-green-800",
  advanced: "bg-orange-100 text-orange-800",
  exam: "bg-red-100 text-red-800",
};

function scenarioPath(lang: Lang, certSlug: string, scenarioId: number): string {
  switch (lang) {
    case "it": return `/it/certificazioni/${certSlug}/scenari/${scenarioId}`;
    case "en": return `/certifications/${certSlug}/scenarios/${scenarioId}`;
    case "fr": return `/fr/certifications/${certSlug}/scenarios/${scenarioId}`;
    case "es": return `/es/certificaciones/${certSlug}/escenarios/${scenarioId}`;
  }
}

type Props = {
  lang: Lang;
  certSlug: string;
  certTitle: string;
};

export default async function ScenarioIndexPage({ lang, certSlug, certTitle }: Props) {
  const t = labels[lang];
  const scenarios = await getScenariosByCertSlug(certSlug, lang);

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 md:py-10">
      {/* Hero */}
      <section className="overflow-hidden rounded-3xl bg-slate-950 px-6 py-9 text-white shadow-sm md:px-10 md:py-12 mb-8">
        <div className="max-w-3xl">
          <p className="mb-3 inline-flex rounded-full bg-yellow-500/15 px-3 py-1 text-xs font-bold uppercase tracking-wide text-yellow-200">
            {certTitle}
          </p>
          <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">
            {t.title}
          </h1>
          <p className="mt-4 text-base leading-7 text-slate-200 md:text-lg">
            {t.subtitle}
          </p>
          {scenarios.length > 0 && (
            <p className="mt-3 text-sm text-slate-400">
              {scenarios.length} {t.available}
            </p>
          )}
        </div>
      </section>

      {/* Lista scenari */}
      {scenarios.length === 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-600">
          {t.empty}
        </section>
      ) : (
        <section className="grid gap-4">
          {scenarios.map((scenario) => (
            <div
              key={scenario.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    {/* Badge difficoltà */}
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${difficultyColor[scenario.difficulty] ?? "bg-slate-100 text-slate-700"}`}>
                      {t.difficulty[scenario.difficulty] ?? scenario.difficulty}
                    </span>
                    {/* Badge premium */}
                    {scenario.is_premium && (
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800">
                        ⭐ {t.premium}
                      </span>
                    )}
                    {/* Contatore domande */}
                    <span className="text-xs text-slate-500">
                      {scenario.question_count} q.
                    </span>
                  </div>

                  <h2 className="text-base font-bold text-slate-900 leading-snug">
                    {scenario.title}
                  </h2>

                  {scenario.intro_text && (
                    <p className="mt-1 text-sm text-slate-600 line-clamp-2">
                      {scenario.intro_text}
                    </p>
                  )}
                </div>

                {/* CTA */}
                <div className="shrink-0">
                  {scenario.locked ? (
                    <span className="inline-flex items-center gap-1 px-4 py-2 rounded-full bg-slate-100 text-slate-500 text-sm font-semibold cursor-not-allowed">
                      🔒 {t.locked}
                    </span>
                  ) : (
                    <Link
                      href={scenarioPath(lang, certSlug, scenario.id)}
                      className="inline-flex items-center gap-1 px-4 py-2 rounded-full bg-yellow-400 hover:bg-yellow-500 text-black text-sm font-semibold transition"
                    >
                      {t.open} →
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </section>
      )}
    </main>
  );
}
