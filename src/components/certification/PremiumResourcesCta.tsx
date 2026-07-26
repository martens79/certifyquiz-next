"use client";

import Link from "next/link";
import type { Locale } from "@/lib/paths";
import { pricingPath } from "@/lib/paths";
import { useAuth } from "@/components/auth/AuthProvider";

type Props = {
  lang: Locale;
  certificationName: string;
  /** risorse effettivamente disponibili: l'elenco non promette ciò che non c'è */
  hasGuide: boolean;
  hasMaps: boolean;
  hasScenarios: boolean;
};

const COPY = {
  it: {
    title: (n: string) => `Preparazione completa per ${n}`,
    quiz: "Quiz ed esercitazioni",
    explain: "Spiegazioni dettagliate",
    guide: "Guide PDF",
    maps: "Mappe concettuali",
    scenarios: "Scenari pratici",
    cta: "Passa a Premium",
    already: "Tutte le risorse Premium sono disponibili nel tuo account.",
  },
  en: {
    title: (n: string) => `Complete preparation for ${n}`,
    quiz: "Quizzes and practice",
    explain: "Detailed explanations",
    guide: "PDF guides",
    maps: "Concept maps",
    scenarios: "Practice scenarios",
    cta: "Go Premium",
    already: "All Premium resources are available in your account.",
  },
  fr: {
    title: (n: string) => `Préparation complète pour ${n}`,
    quiz: "Quiz et exercices",
    explain: "Explications détaillées",
    guide: "Guides PDF",
    maps: "Cartes conceptuelles",
    scenarios: "Scénarios pratiques",
    cta: "Passer à Premium",
    already: "Toutes les ressources Premium sont disponibles dans votre compte.",
  },
  es: {
    title: (n: string) => `Preparación completa para ${n}`,
    quiz: "Cuestionarios y práctica",
    explain: "Explicaciones detalladas",
    guide: "Guías PDF",
    maps: "Mapas conceptuales",
    scenarios: "Escenarios prácticos",
    cta: "Hazte Premium",
    already: "Todos los recursos Premium están disponibles en tu cuenta.",
  },
} as const;

export default function PremiumResourcesCta({
  lang,
  certificationName,
  hasGuide,
  hasMaps,
  hasScenarios,
}: Props) {
  const t = COPY[lang];
  const { loading, user } = useAuth();

  // Finché l'auth non è risolta non mostro nulla: meglio niente che far
  // lampeggiare "Passa a Premium" a chi è già abbonato.
  if (loading) return null;

  const isPremium = !!user?.premium;

  if (isPremium) {
    return (
      <p className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-900">
        ✅ {t.already}
      </p>
    );
  }

  const voci = [t.quiz, t.explain, hasGuide ? t.guide : null, hasMaps ? t.maps : null, hasScenarios ? t.scenarios : null]
    .filter(Boolean)
    .join(" · ");

  return (
    <section className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-sm font-bold text-slate-900">
            ⭐ {t.title(certificationName)}
          </p>
          <p className="mt-0.5 text-xs leading-snug text-slate-700">{voci}</p>
        </div>

        <Link
          href={pricingPath(lang)}
          className="inline-flex shrink-0 items-center justify-center rounded-lg bg-amber-500 px-4 py-2 text-sm font-bold text-white transition hover:bg-amber-600"
        >
          {t.cta}
        </Link>
      </div>
    </section>
  );
}
