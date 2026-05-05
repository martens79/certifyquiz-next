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

  // ✅ Dati risultato free test
  correctCount?: number;
  wrongCount?: number;
  totalAnswered?: number;
};

const COPY = {
  badge: {
    it: "Limite gratuito raggiunto",
    en: "Free limit reached",
    fr: "Limite gratuit atteint",
    es: "Límite gratuito alcanzado",
  },
  title: {
    it: "Hai completato il tuo test gratuito 🎯",
    en: "You completed your free test 🎯",
    fr: "Vous avez terminé votre test gratuit 🎯",
    es: "Has completado tu test gratuito 🎯",
  },
  subtitle: {
    it: "Prima di continuare, guarda dove sei davvero.",
    en: "Before you continue, see where you really stand.",
    fr: "Avant de continuer, voyez où vous en êtes vraiment.",
    es: "Antes de continuar, mira dónde estás realmente.",
  },
  progress: {
    it: "Hai completato {current}/{limit} domande gratuite.",
    en: "You've completed {current}/{limit} free questions.",
    fr: "Vous avez complété {current}/{limit} questions gratuites.",
    es: "Has completado {current}/{limit} preguntas gratuitas.",
  },
  resultTitle: {
    it: "Risultato del test",
    en: "Test result",
    fr: "Résultat du test",
    es: "Resultado del test",
  },
  correct: {
    it: "Risposte corrette",
    en: "Correct answers",
    fr: "Bonnes réponses",
    es: "Respuestas correctas",
  },
  score: {
    it: "Punteggio",
    en: "Score",
    fr: "Score",
    es: "Puntuación",
  },
  mistakes: {
    it: "Errori",
    en: "Mistakes",
    fr: "Erreurs",
    es: "Errores",
  },
  diagnosisGood: {
    it: "Buon inizio. Ma l’esame reale è più lungo e meno permissivo.",
    en: "Good start. But the real exam is longer and less forgiving.",
    fr: "Bon début. Mais le vrai examen est plus long et moins indulgent.",
    es: "Buen comienzo. Pero el examen real es más largo y menos permisivo.",
  },
  diagnosisMedium: {
    it: "Sei vicino, ma questi errori possono ancora costarti l’esame.",
    en: "You are close, but these mistakes can still cost you the exam.",
    fr: "Vous êtes proche, mais ces erreurs peuvent encore vous coûter l’examen.",
    es: "Estás cerca, pero estos errores todavía pueden costarte el examen.",
  },
  diagnosisLow: {
    it: "Con questo livello, oggi non sei ancora pronto per l’esame reale.",
    en: "At this level, you are not ready for the real exam yet.",
    fr: "À ce niveau, vous n’êtes pas encore prêt pour le vrai examen.",
    es: "Con este nivel, todavía no estás listo para el examen real.",
  },
  mistakeLine: {
    it: "Hai fatto {wrong} errori. Premium ti aiuta a capire perché hai sbagliato e come correggere le lacune.",
    en: "You made {wrong} mistakes. Premium helps you understand why and fix your gaps.",
    fr: "Vous avez fait {wrong} erreurs. Premium vous aide à comprendre pourquoi et à corriger vos lacunes.",
    es: "Has cometido {wrong} errores. Premium te ayuda a entender por qué y a corregir tus lagunas.",
  },
  text: {
    it: "La differenza la fa chi continua. Con Premium sblocchi l’esperienza completa, studi con più continuità e trasformi il quiz in una preparazione vera.",
    en: "The difference is made by the people who keep going. With Premium, you unlock the full experience and turn the quiz into real preparation.",
    fr: "La différence, ce sont ceux qui continuent. Avec Premium, vous débloquez l’expérience complète et transformez le quiz en vraie préparation.",
    es: "La diferencia la marca quien sigue adelante. Con Premium desbloqueas la experiencia completa y conviertes el quiz en una preparación real.",
  },
  urgencyLine: {
    it: "Hai già iniziato. Fermarti ora sarebbe il momento peggiore.",
    en: "You've already started. Stopping now would be the worst moment.",
    fr: "Vous avez déjà commencé. S’arrêter maintenant serait le pire moment.",
    es: "Ya empezaste. Detenerte ahora sería el peor momento.",
  },
  pizzaLine: {
    it: "Al prezzo di una pizza, continui senza limiti e ti prepari davvero alla certificazione.",
    en: "For the price of a pizza, you keep going without limits and prepare seriously for your certification.",
    fr: "Pour le prix d’une pizza, vous continuez sans limites et vous vous préparez vraiment à la certification.",
    es: "Por el precio de una pizza, sigues sin límites y te preparas de verdad para la certificación.",
  },
  tableTitle: {
    it: "Free vs Premium",
    en: "Free vs Premium",
    fr: "Gratuit vs Premium",
    es: "Gratis vs Premium",
  },
  tableFeature: {
    it: "Funzionalità",
    en: "Feature",
    fr: "Fonctionnalité",
    es: "Función",
  },
  tableFree: {
    it: "Gratis",
    en: "Free",
    fr: "Gratuit",
    es: "Gratis",
  },
  tablePremium: {
    it: "Premium",
    en: "Premium",
    fr: "Premium",
    es: "Premium",
  },
  tableRows: {
    it: [
      { label: "Quiz al giorno", free: "20", premium: "Illimitati" },
      { label: "Spiegazioni risposte", free: "❌", premium: "✅ Tutte" },
      { label: "Modalità esame reale", free: "❌", premium: "✅" },
      { label: "Ripasso errori", free: "❌", premium: "✅" },
      { label: "Tutte le certificazioni", free: "✅", premium: "✅" },
    ],
    en: [
      { label: "Quizzes per day", free: "20", premium: "Unlimited" },
      { label: "Answer explanations", free: "❌", premium: "✅ All" },
      { label: "Real exam mode", free: "❌", premium: "✅" },
      { label: "Error review", free: "❌", premium: "✅" },
      { label: "All certifications", free: "✅", premium: "✅" },
    ],
    fr: [
      { label: "Quiz par jour", free: "20", premium: "Illimités" },
      { label: "Explications", free: "❌", premium: "✅ Toutes" },
      { label: "Mode examen réel", free: "❌", premium: "✅" },
      { label: "Révision des erreurs", free: "❌", premium: "✅" },
      { label: "Toutes les certifications", free: "✅", premium: "✅" },
    ],
    es: [
      { label: "Quizzes por día", free: "20", premium: "Ilimitados" },
      { label: "Explicaciones", free: "❌", premium: "✅ Todas" },
      { label: "Modo examen real", free: "❌", premium: "✅" },
      { label: "Repaso de errores", free: "❌", premium: "✅" },
      { label: "Todas las certificaciones", free: "✅", premium: "✅" },
    ],
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
      "Ripasso errori",
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
    it: "Sblocca Premium – 9,99€/mese",
    en: "Unlock Premium – €9.99/month",
    fr: "Débloquez Premium – 9,99€/mois",
    es: "Desbloquea Premium – 9,99€/mes",
  },
  ctaLoading: {
    it: "Apertura checkout...",
    en: "Opening checkout...",
    fr: "Ouverture du checkout...",
    es: "Abriendo checkout...",
  },
  cancelNote: {
    it: "Disdici quando vuoi. Nessun vincolo.",
    en: "Cancel anytime. No commitment.",
    fr: "Annulez quand vous voulez. Aucun engagement.",
    es: "Cancela cuando quieras. Sin compromiso.",
  },
  back: {
    it: "Torna indietro",
    en: "Go back",
    fr: "Retour",
    es: "Volver",
  },
  checkoutError: {
    it: "Errore durante l’apertura del checkout. Riprova.",
    en: "Error while opening checkout. Please try again.",
    fr: "Erreur lors de l’ouverture du checkout. Réessayez.",
    es: "Error al abrir el checkout. Inténtalo de nuevo.",
  },
} as const;

function safeLang(lang?: Locale): Locale {
  return lang === "it" || lang === "en" || lang === "fr" || lang === "es"
    ? lang
    : "en";
}

function interpolate(value: string, vars: Record<string, string | number>) {
  return value.replace(/\{(\w+)\}/g, (_, key) => String(vars[key] ?? ""));
}

export default function PremiumQuestionLimitGate({
  lang,
  currentCount,
  freeLimit,
  onBack,
  correctCount,
  wrongCount,
  totalAnswered,
}: Props) {
  const L = safeLang(lang);
  const [isLoading, setIsLoading] = useState(false);

  // ✅ Calcolo sicuro risultato test
  const total = totalAnswered ?? currentCount ?? freeLimit;
  const correct = correctCount ?? 0;
  const wrong = wrongCount ?? Math.max(total - correct, 0);
  const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;

  const resultLevel =
    percentage >= 80 ? "good" : percentage >= 60 ? "medium" : "low";

  const diagnosis =
    resultLevel === "good"
      ? COPY.diagnosisGood[L]
      : resultLevel === "medium"
        ? COPY.diagnosisMedium[L]
        : COPY.diagnosisLow[L];

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

      const data: { url?: string; error?: string } = await res.json();

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
        {COPY.title[L]}
      </h2>

      <p className="mb-3 text-base font-semibold text-gray-900 sm:text-lg">
        {COPY.subtitle[L]}
      </p>

      <p className="mb-5 text-sm text-gray-600 sm:text-base">
        {interpolate(COPY.progress[L], {
          current: currentCount,
          limit: freeLimit,
        })}
      </p>

      {/* ✅ RISULTATO DEL FREE TEST */}
      <div className="mb-5 rounded-2xl border border-gray-200 bg-gray-50 p-4">
        <p className="mb-3 text-sm font-semibold text-gray-900">
          📊 {COPY.resultTitle[L]}
        </p>

        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl bg-white p-3 text-center shadow-sm">
            <div className="text-2xl font-bold text-gray-950">
              {correct}/{total}
            </div>
            <div className="mt-1 text-xs text-gray-600">{COPY.correct[L]}</div>
          </div>

          <div className="rounded-xl bg-white p-3 text-center shadow-sm">
            <div className="text-2xl font-bold text-gray-950">
              {percentage}%
            </div>
            <div className="mt-1 text-xs text-gray-600">{COPY.score[L]}</div>
          </div>

          <div className="rounded-xl bg-white p-3 text-center shadow-sm">
            <div className="text-2xl font-bold text-red-600">{wrong}</div>
            <div className="mt-1 text-xs text-gray-600">{COPY.mistakes[L]}</div>
          </div>
        </div>

        <div className="mt-4 h-3 overflow-hidden rounded-full bg-gray-200">
          <div
            className={`h-full rounded-full ${
              resultLevel === "good"
                ? "bg-emerald-500"
                : resultLevel === "medium"
                  ? "bg-amber-500"
                  : "bg-red-500"
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>

        <div
          className={`mt-4 rounded-xl border p-3 ${
            resultLevel === "good"
              ? "border-emerald-200 bg-emerald-50"
              : resultLevel === "medium"
                ? "border-amber-200 bg-amber-50"
                : "border-red-200 bg-red-50"
          }`}
        >
          <p
            className={`text-sm font-semibold ${
              resultLevel === "good"
                ? "text-emerald-900"
                : resultLevel === "medium"
                  ? "text-amber-900"
                  : "text-red-900"
            }`}
          >
            {diagnosis}
          </p>

          <p
            className={`mt-1 text-sm ${
              resultLevel === "good"
                ? "text-emerald-800"
                : resultLevel === "medium"
                  ? "text-amber-800"
                  : "text-red-800"
            }`}
          >
            {interpolate(COPY.mistakeLine[L], { wrong })}
          </p>
        </div>
      </div>

      <p className="mb-4 text-sm text-gray-700 sm:text-base">
        {COPY.text[L]}
      </p>

      <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 p-4">
        <p className="text-sm font-semibold text-amber-900 sm:text-base">
          {COPY.urgencyLine[L]}
        </p>
        <p className="mt-2 text-sm text-amber-800 sm:text-base">
          {COPY.pizzaLine[L]}
        </p>
      </div>

      <div className="mb-5 overflow-hidden rounded-xl border border-gray-200">
        <div className="bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-900">
          {COPY.tableTitle[L]}
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="px-4 py-2 text-left font-medium text-gray-600">
                {COPY.tableFeature[L]}
              </th>
              <th className="px-4 py-2 text-center font-medium text-gray-500">
                {COPY.tableFree[L]}
              </th>
              <th className="px-4 py-2 text-center font-semibold text-black">
                {COPY.tablePremium[L]}
              </th>
            </tr>
          </thead>

          <tbody>
            {COPY.tableRows[L].map((row, i) => (
              <tr key={row.label} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-4 py-2 text-gray-800">{row.label}</td>
                <td className="px-4 py-2 text-center text-gray-500">{row.free}</td>
                <td className="px-4 py-2 text-center font-medium text-emerald-700">
                  {row.premium}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mb-5 rounded-xl border border-gray-200 bg-gray-50 p-4">
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
          className="inline-flex items-center justify-center rounded-lg bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? COPY.ctaLoading[L] : COPY.cta[L]}
        </button>

        {onBack && (
          <button
            type="button"
            onClick={onBack}
            disabled={isLoading}
            className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-800 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {COPY.back[L]}
          </button>
        )}
      </div>

      <p className="mt-3 text-xs text-gray-500 sm:text-sm">
        {COPY.cancelNote[L]}
      </p>
    </div>
  );
}