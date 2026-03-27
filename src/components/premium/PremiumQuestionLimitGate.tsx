"use client";

import { useState } from "react";
import { authFetch } from "@/lib/auth";
import type { Locale } from "@/lib/quiz-types";

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
    fr: "Limite de la version gratuite atteinte",
    es: "Límite gratuito alcanzado",
  },
  title: {
    it: "Hai completato {limit} domande 🎯",
    en: "You’ve completed {limit} questions 🎯",
    fr: "Vous avez complété {limit} questions 🎯",
    es: "Has completado {limit} preguntas 🎯",
  },
  subtitle: {
    it: "Vuoi continuare il quiz?",
    en: "Want to keep going?",
    fr: "Vous voulez continuer ?",
    es: "¿Quieres continuar el quiz?",
  },
  progress: {
    it: "Sei arrivato a {current}/{limit} domande gratuite.",
    en: "You’ve reached {current}/{limit} free questions.",
    fr: "Vous avez atteint {current}/{limit} questions gratuites.",
    es: "Has llegado a {current}/{limit} preguntas gratuitas.",
  },
  text: {
    it: "La versione gratuita si ferma qui. Con Premium sblocchi l’esperienza completa e continui senza interruzioni.",
    en: "The free version stops here. Premium unlocks the full experience so you can keep going without interruptions.",
    fr: "La version gratuite s’arrête ici. Premium débloque l’expérience complète pour continuer sans interruption.",
    es: "La versión gratuita termina aquí. Premium desbloquea la experiencia completa para seguir sin interrupciones.",
  },
  featuresTitle: {
    it: "Con Premium sblocchi:",
    en: "With Premium you unlock:",
    fr: "Avec Premium, vous débloquez :",
    es: "Con Premium desbloqueas:",
  },
  features: {
    it: [
      "Quiz illimitati",
      "Modalità esame reale",
      "Ripasso degli errori",
      "Spiegazioni complete per ogni domanda",
    ],
    en: [
      "Unlimited quizzes",
      "Real exam mode",
      "Error review",
      "Full explanations for every question",
    ],
    fr: [
      "Quiz illimités",
      "Mode examen réel",
      "Révision des erreurs",
      "Explications complètes pour chaque question",
    ],
    es: [
      "Quizzes ilimitados",
      "Modo examen real",
      "Repaso de errores",
      "Explicaciones completas para cada pregunta",
    ],
  },
  cta: {
    it: "Sblocca Premium – 7€/mese",
    en: "Unlock Premium – €7/month",
    fr: "Débloquez Premium – 7€/mois",
    es: "Desbloquea Premium – 7€/mes",
  },
  ctaLoading: {
    it: "Apertura checkout...",
    en: "Opening checkout...",
    fr: "Ouverture du checkout...",
    es: "Abriendo checkout...",
  },
  cancelNote: {
    it: "Disdici quando vuoi",
    en: "Cancel anytime",
    fr: "Annulez quand vous voulez",
    es: "Cancela cuando quieras",
  },
  finalLine: {
    it: "Hai già iniziato. Non fermarti proprio adesso.",
    en: "You’re already in. Don’t stop now.",
    fr: "Vous avez déjà commencé. Ne vous arrêtez pas maintenant.",
    es: "Ya empezaste. No te detengas ahora.",
  },
  back: {
    it: "Torna indietro",
    en: "Go back",
    fr: "Retour",
    es: "Volver",
  },
  checkoutError: {
    it: "Errore durante l'apertura del checkout. Riprova.",
    en: "Error while opening checkout. Please try again.",
    fr: "Erreur lors de l'ouverture du checkout. Réessayez.",
    es: "Error al abrir el checkout. Inténtalo de nuevo.",
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
  const [isLoading, setIsLoading] = useState(false);

  async function startPremiumCheckout() {
    if (isLoading) return;

    try {
      setIsLoading(true);

      const res = await authFetch("/api/backend/billing/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-lang": L,
        },
        body: JSON.stringify({ lang: L }),
      });

      let data: { url?: string; error?: string } | null = null;

      try {
        data = await res.json();
      } catch {
        throw new Error("Invalid server response");
      }

      if (!res.ok || !data?.url) {
        throw new Error(data?.error || "Failed to create checkout session");
      }

      window.location.href = data.url;
    } catch (err) {
      console.error("Premium checkout error:", err);
      alert(COPY.checkoutError[L]);
      setIsLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl rounded-2xl bg-white p-6 text-gray-900 shadow-xl sm:p-8">
      <div className="mb-4 inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900">
        🔒 {COPY.badge[L]}
      </div>

      <h2 className="mb-2 text-2xl font-semibold tracking-tight sm:text-3xl">
        {interpolate(COPY.title[L], { limit: freeLimit })}
      </h2>

      <p className="mb-4 text-base font-medium text-gray-900 sm:text-lg">
        {COPY.subtitle[L]}
      </p>

      <p className="mb-2 text-sm text-gray-600 sm:text-base">
        {interpolate(COPY.progress[L], {
          current: currentCount,
          limit: freeLimit,
        })}
      </p>

      <p className="mb-6 text-sm text-gray-600 sm:text-base">
        {COPY.text[L]}
      </p>

      <div className="mb-6 rounded-xl border border-gray-200 bg-gray-50 p-4">
        <p className="mb-3 text-sm font-semibold text-gray-900">
          {COPY.featuresTitle[L]}
        </p>

        <ul className="space-y-2 text-sm text-gray-800">
          {COPY.features[L].map((feature) => (
            <li key={feature} className="flex items-start gap-2">
              <span className="mt-0.5 text-emerald-600">✓</span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={startPremiumCheckout}
          disabled={isLoading}
          className="inline-flex items-center justify-center rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? COPY.ctaLoading[L] : COPY.cta[L]}
        </button>

        {onBack && (
          <button
            type="button"
            onClick={onBack}
            disabled={isLoading}
            className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-800 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {COPY.back[L]}
          </button>
        )}
      </div>

      <p className="mt-3 text-xs text-gray-500 sm:text-sm">
        {COPY.cancelNote[L]}
      </p>

      <p className="mt-4 text-sm font-medium text-gray-900 sm:text-base">
        {COPY.finalLine[L]}
      </p>
    </div>
  );
}