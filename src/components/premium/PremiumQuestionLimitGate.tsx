"use client";

import Link from "next/link";
import type { Locale } from "@/lib/quiz-types";
import { pricingPath } from "@/lib/paths";

type Props = {
  lang: Locale;
  currentCount: number;
  freeLimit: number;
  mode?: "training" | "exam";
  onBack?: () => void;
};

const COPY = {
  badge: {
    it: "Limite gratuito raggiunto",
    en: "Free limit reached",
    fr: "Limite gratuite atteinte",
    es: "Límite gratuito alcanzado",
  },
  title: {
    it: "Vuoi continuare il quiz?",
    en: "Want to continue the quiz?",
    fr: "Tu veux continuer le quiz ?",
    es: "¿Quieres continuar el cuestionario?",
  },
  text: {
    it: "Hai completato {current}/{limit} domande gratuite. Con Premium sblocchi l’esperienza completa.",
    en: "You completed {current}/{limit} free questions. Premium unlocks the full experience.",
    fr: "Tu as complété {current}/{limit} questions gratuites. Premium débloque l’expérience complète.",
    es: "Has completado {current}/{limit} preguntas gratuitas. Premium desbloquea la experiencia completa.",
  },
  features: {
    it: ["Quiz completi", "Modalità esame", "Allenamento illimitato", "Ripasso errori"],
    en: ["Full quizzes", "Exam mode", "Unlimited training", "Error review"],
    fr: ["Quiz complets", "Mode examen", "Entraînement illimité", "Révision des erreurs"],
    es: ["Cuestionarios completos", "Modo examen", "Entrenamiento ilimitado", "Repaso de errores"],
  },
  cta: {
    it: "Attiva Premium",
    en: "Activate Premium",
    fr: "Activer Premium",
    es: "Activar Premium",
  },
  back: {
    it: "Torna indietro",
    en: "Go back",
    fr: "Retour",
    es: "Volver",
  },
} as const;

function safeLang(lang?: Locale): Locale {
  return lang === "it" || lang === "en" || lang === "fr" || lang === "es" ? lang : "en";
}

function interpolate(value: string, vars: Record<string, string | number>) {
  return value.replace(/\{(\w+)\}/g, (_, key) => String(vars[key] ?? ""));
}

export default function PremiumQuestionLimitGate({
  lang,
  currentCount,
  freeLimit,
  onBack,
}: Props) {
  const L = safeLang(lang);

  return (
    <div className="mx-auto max-w-2xl rounded-2xl bg-white p-6 text-gray-900 shadow-xl sm:p-8">
      <div className="mb-4 inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900">
        🔒 {COPY.badge[L]}
      </div>

      <h2 className="mb-3 text-2xl font-semibold tracking-tight sm:text-3xl">
        {COPY.title[L]}
      </h2>

      <p className="mb-5 text-sm text-gray-600 sm:text-base">
        {interpolate(COPY.text[L], {
          current: currentCount,
          limit: freeLimit,
        })}
      </p>

      <div className="mb-6 rounded-xl border border-gray-200 bg-gray-50 p-4">
        <ul className="space-y-2 text-sm text-gray-800">
          {COPY.features[L].map((feature) => (
            <li key={feature} className="flex items-center gap-2">
              <span className="text-emerald-600">✓</span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          href={pricingPath(L)}
          className="inline-flex items-center justify-center rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90"
        >
          {COPY.cta[L]}
        </Link>

        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-800 hover:bg-gray-50"
          >
            {COPY.back[L]}
          </button>
        )}
      </div>
    </div>
  );
}