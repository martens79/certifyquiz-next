"use client";

import { useState } from "react";
import { authFetch } from "@/lib/auth";
import type { Locale } from "@/lib/quiz-types";

type Plan = "premium_monthly" | "premium_quarterly" | "premium_annual";

type PlanOption = {
  id: Plan;
  label: string;
  price: string;
  badge?: string;
};

type Props = {
  lang: Locale;
  currentCount: number;
  freeLimit: number;
  mode?: "training" | "exam";
  onBack?: () => void;
  certificationSlug?: string;
  topicSlug?: string;
  certificationName?: string;
  correctCount?: number;
  wrongCount?: number;
  totalAnswered?: number;
};

const PLANS: Record<Locale, PlanOption[]> = {
  it: [
    { id: "premium_monthly", label: "Mensile", price: "9,99€/mese" },
    { id: "premium_quarterly", label: "Trimestrale", price: "19,99€", badge: "-33%" },
    { id: "premium_annual", label: "Annuale", price: "59,99€", badge: "-50%" },
  ],
  en: [
    { id: "premium_monthly", label: "Monthly", price: "€9.99/mo" },
    { id: "premium_quarterly", label: "Quarterly", price: "€19.99", badge: "-33%" },
    { id: "premium_annual", label: "Annual", price: "€59.99", badge: "-50%" },
  ],
  fr: [
    { id: "premium_monthly", label: "Mensuel", price: "9,99€/mois" },
    { id: "premium_quarterly", label: "Trimestriel", price: "19,99€", badge: "-33%" },
    { id: "premium_annual", label: "Annuel", price: "59,99€", badge: "-50%" },
  ],
  es: [
    { id: "premium_monthly", label: "Mensual", price: "9,99€/mes" },
    { id: "premium_quarterly", label: "Trimestral", price: "19,99€", badge: "-33%" },
    { id: "premium_annual", label: "Anual", price: "59,99€", badge: "-50%" },
  ],
};

const COPY = {
  badge: {
    it: "Limite gratuito raggiunto",
    en: "Free limit reached",
    fr: "Limite gratuit atteint",
    es: "Límite gratuito alcanzado",
  },
  titleGeneric: {
    it: "Non fermarti adesso.",
    en: "Don't stop now.",
    fr: "Ne t'arrête pas maintenant.",
    es: "No te detengas ahora.",
  },
  titleWithCert: {
    it: (cert: string) => `Stai preparando il ${cert} — non fermarti adesso.`,
    en: (cert: string) => `You're preparing for ${cert} — don't stop now.`,
    fr: (cert: string) => `Tu prépares le ${cert} — ne t'arrête pas maintenant.`,
    es: (cert: string) => `Estás preparando el ${cert} — no te detengas ahora.`,
  },
  resultTitle: {
    it: "Risultato del test",
    en: "Test result",
    fr: "Résultat du test",
    es: "Resultado del test",
  },
  correct: { it: "Corrette", en: "Correct", fr: "Correctes", es: "Correctas" },
  score: { it: "Punteggio", en: "Score", fr: "Score", es: "Puntuación" },
  mistakes: { it: "Errori", en: "Mistakes", fr: "Erreurs", es: "Errores" },
  diagnosisGood: {
    it: "Buon inizio. Ma l'esame reale è più lungo e meno permissivo.",
    en: "Good start. But the real exam is longer and less forgiving.",
    fr: "Bon début. Mais le vrai examen est plus long et moins indulgent.",
    es: "Buen comienzo. Pero el examen real es más largo y menos permisivo.",
  },
  diagnosisMedium: {
    it: "Sei vicino, ma questi errori possono ancora costarti l'esame.",
    en: "You are close, but these mistakes can still cost you the exam.",
    fr: "Vous êtes proche, mais ces erreurs peuvent encore vous coûter l'examen.",
    es: "Estás cerca, pero estos errores todavía pueden costarte el examen.",
  },
  diagnosisLow: {
    it: "Con questo livello, oggi non sei ancora pronto per l'esame reale.",
    en: "At this level, you are not ready for the real exam yet.",
    fr: "À ce niveau, vous n'êtes pas encore prêt pour le vrai examen.",
    es: "Con este nivel, todavía no estás listo para el examen real.",
  },
  mistakeLine: {
    it: "Hai fatto {wrong} errori. Premium ti aiuta a capire perché hai sbagliato e come correggere le lacune.",
    en: "You made {wrong} mistakes. Premium helps you understand why and fix your gaps.",
    fr: "Vous avez fait {wrong} erreurs. Premium vous aide à comprendre pourquoi et à corriger vos lacunes.",
    es: "Has cometido {wrong} errores. Premium te ayuda a entender por qué y a corregir tus lagunas.",
  },
  urgencyLineGood: {
    it: "Hai fatto 20 domande e sei già al {score}%. Sei vicino — non perdere il ritmo adesso.",
    en: "You answered 20 questions and you're already at {score}%. You're close — don't lose momentum now.",
    fr: "Vous avez répondu à 20 questions et vous êtes déjà à {score}%. Vous êtes proche — ne perdez pas votre élan.",
    es: "Has respondido 20 preguntas y ya estás al {score}%. Estás cerca — no pierdas el ritmo ahora.",
  },
  urgencyLineMedium: {
    it: "Hai usato le 20 domande gratuite di oggi. Con {wrong} errori da correggere, aspettare domani ti costa.",
    en: "You've used your 20 free questions today. With {wrong} mistakes to fix, waiting until tomorrow costs you.",
    fr: "Vous avez utilisé vos 20 questions gratuites. Avec {wrong} erreurs à corriger, attendre demain vous coûte.",
    es: "Has usado tus 20 preguntas gratuitas. Con {wrong} errores por corregir, esperar a mañana te cuesta.",
  },
  urgencyLineLow: {
    it: "Hai usato le 20 domande gratuite di oggi. Con questo livello, non puoi permetterti di aspettare domani.",
    en: "You've used your 20 free questions today. At this level, you can't afford to wait until tomorrow.",
    fr: "Vous avez utilisé vos 20 questions gratuites. À ce niveau, vous ne pouvez pas vous permettre d'attendre.",
    es: "Has usado tus 20 preguntas gratuitas. Con este nivel, no puedes permitirte esperar hasta mañana.",
  },
  ctaHook: {
    it: "Non perdere il ritmo. Continua adesso senza aspettare.",
    en: "Don't lose your momentum. Keep going now without waiting.",
    fr: "Ne perdez pas votre élan. Continuez maintenant sans attendre.",
    es: "No pierdas el ritmo. Continúa ahora sin esperar.",
  },
  pizzaLine: {
    it: "Al prezzo di una pizza, sblocchi quiz illimitati, spiegazioni e ripasso errori.",
    en: "For the price of a pizza, unlock unlimited quizzes, explanations and error review.",
    fr: "Pour le prix d'une pizza, débloquez quiz illimités, explications et révision des erreurs.",
    es: "Por el precio de una pizza, desbloquea quizzes ilimitados, explicaciones y repaso de errores.",
  },
  cta: {
    it: "Sblocca Premium",
    en: "Unlock Premium",
    fr: "Débloquez Premium",
    es: "Desbloquea Premium",
  },
  ctaLoading: {
    it: "Apertura checkout...",
    en: "Opening checkout...",
    fr: "Ouverture du checkout...",
    es: "Abriendo checkout...",
  },
  cancelNote: {
    it: "Accesso immediato · Disdici quando vuoi · Garanzia 7 giorni",
    en: "Instant access · Cancel anytime · 7-day guarantee",
    fr: "Accès immédiat · Annulez quand vous voulez · Garantie 7 jours",
    es: "Acceso inmediato · Cancela cuando quieras · Garantía 7 días",
  },
  back: {
    it: "Aspetto domani",
    en: "I'll wait until tomorrow",
    fr: "J'attendrai demain",
    es: "Esperaré hasta mañana",
  },
  detailsToggle: {
    it: "Cosa include Premium",
    en: "What Premium includes",
    fr: "Ce que Premium inclut",
    es: "Qué incluye Premium",
  },
  features: {
    it: ["Quiz illimitati", "Spiegazioni complete per ogni domanda", "Modalità esame reale", "Ripasso errori mirati"],
    en: ["Unlimited quizzes", "Full explanations for every question", "Real exam mode", "Targeted error review"],
    fr: ["Quiz illimités", "Explications complètes pour chaque question", "Mode examen réel", "Révision des erreurs ciblée"],
    es: ["Quizzes ilimitados", "Explicaciones completas para cada pregunta", "Modo examen real", "Repaso de errores específico"],
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
  certificationSlug,
  topicSlug,
  certificationName,
  correctCount,
  wrongCount,
  totalAnswered,
}: Props) {
  const L = safeLang(lang);
  const [isLoading, setIsLoading] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan>("premium_annual");

  const plans = PLANS[L];

  const total = totalAnswered ?? currentCount ?? freeLimit;
  const correct = correctCount ?? 0;
  const wrong = wrongCount ?? Math.max(total - correct, 0);
  const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;

  const resultLevel = percentage >= 80 ? "good" : percentage >= 60 ? "medium" : "low";

  const diagnosis =
    resultLevel === "good" ? COPY.diagnosisGood[L]
    : resultLevel === "medium" ? COPY.diagnosisMedium[L]
    : COPY.diagnosisLow[L];

  const title = certificationName
    ? COPY.titleWithCert[L](certificationName)
    : COPY.titleGeneric[L];

  async function startPremiumCheckout() {
    if (isLoading) return;
    try {
      setIsLoading(true);
      fetch("/api/backend/funnel-event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event: "premium_clicked",
          cert_slug: certificationSlug ?? null,
          topic_slug: topicSlug ?? null,
          lang: L,
          score: percentage,
          plan: selectedPlan,
        }),
      }).catch(console.error);

      const res = await authFetch("/api/backend/billing/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-lang": L },
        body: JSON.stringify({ lang: L, plan: selectedPlan }),
      });

      const data: { url?: string; error?: string } = await res.json();
      if (!res.ok || !data?.url) throw new Error(data?.error || "Failed");
      window.location.href = data.url;
    } catch (err) {
      console.error("Premium checkout error:", err);
      alert(COPY.checkoutError[L]);
      setIsLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md rounded-2xl bg-white p-6 text-gray-900 shadow-xl sm:p-8">

      {/* Badge */}
      <div className="mb-4 inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900">
        🔒 {COPY.badge[L]}
      </div>

      {/* Titolo */}
      <h2 className="mb-4 text-xl font-semibold leading-snug tracking-tight text-gray-900 sm:text-2xl">
        {title}
      </h2>

      {/* Score */}
      <div className="mb-4 rounded-xl border border-gray-100 bg-gray-50 p-4">
        <div className="grid grid-cols-3 gap-3 mb-3">
          <div className="rounded-xl bg-white p-3 text-center shadow-sm">
            <div className="text-xl font-bold text-gray-950">{correct}/{total}</div>
            <div className="mt-1 text-xs text-gray-500">{COPY.correct[L]}</div>
          </div>
          <div className="rounded-xl bg-white p-3 text-center shadow-sm">
            <div className="text-xl font-bold text-gray-950">{percentage}%</div>
            <div className="mt-1 text-xs text-gray-500">{COPY.score[L]}</div>
          </div>
          <div className="rounded-xl bg-white p-3 text-center shadow-sm">
            <div className="text-xl font-bold text-red-600">{wrong}</div>
            <div className="mt-1 text-xs text-gray-500">{COPY.mistakes[L]}</div>
          </div>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-gray-200">
          <div
            className={`h-full rounded-full ${
              resultLevel === "good" ? "bg-emerald-500"
              : resultLevel === "medium" ? "bg-amber-500"
              : "bg-red-500"
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>

        <p className="mt-3 text-sm text-gray-600">
          {diagnosis}{" "}
          {wrong > 0 && (
            <span className="font-medium text-gray-800">
              {interpolate(COPY.mistakeLine[L], { wrong })}
            </span>
          )}
        </p>
      </div>

      {/* Urgency */}
      <p className="mb-1 text-sm font-semibold text-amber-900">
        {interpolate(
          resultLevel === "good" ? COPY.urgencyLineGood[L]
          : resultLevel === "medium" ? COPY.urgencyLineMedium[L]
          : COPY.urgencyLineLow[L],
          { score: percentage, wrong }
        )}
      </p>
      <p className="mb-1 text-sm font-semibold text-gray-900">{COPY.ctaHook[L]}</p>
      <p className="mb-4 text-sm text-gray-500">{COPY.pizzaLine[L]}</p>

      {/* Selettore piano */}
      <div className="mb-3 grid grid-cols-3 gap-2">
        {plans.map((plan) => {
          const isSelected = plan.id === selectedPlan;
          return (
            <button
              key={plan.id}
              type="button"
              onClick={() => setSelectedPlan(plan.id)}
              className={`relative rounded-xl border-2 p-2.5 text-center transition ${
                isSelected
                  ? "border-gray-900 bg-gray-900 text-white"
                  : "border-gray-200 bg-white text-gray-900 hover:border-gray-400"
              }`}
            >
              {plan.badge && (
                <span className={`absolute -top-2 right-1 rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                  isSelected ? "bg-white text-black" : "bg-gray-900 text-white"
                }`}>
                  {plan.badge}
                </span>
              )}
              <div className="text-xs font-semibold">{plan.label}</div>
              <div className="text-xs mt-0.5 font-bold">{plan.price}</div>
            </button>
          );
        })}
      </div>

      {/* CTA */}
      <button
        type="button"
        onClick={startPremiumCheckout}
        disabled={isLoading}
        className="w-full rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? COPY.ctaLoading[L] : COPY.cta[L]}
      </button>

      <p className="mt-2 text-center text-xs text-gray-400">{COPY.cancelNote[L]}</p>

      {/* Link torna indietro */}
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="mx-auto mt-3 block text-xs text-gray-400 underline underline-offset-2 hover:text-gray-600"
        >
          {COPY.back[L]}
        </button>
      )}

      {/* Accordion dettagli */}
      <div className="mt-5 border-t border-gray-100">
        <button
          type="button"
          onClick={() => setDetailsOpen(v => !v)}
          className="flex w-full items-center justify-between py-3 text-sm text-gray-500 hover:text-gray-700"
        >
          <span>{COPY.detailsToggle[L]}</span>
          <span>{detailsOpen ? "▲" : "▼"}</span>
        </button>

        {detailsOpen && (
          <ul className="space-y-2 pb-3">
            {COPY.features[L].map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="mt-0.5 text-emerald-600">✓</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}