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
  triggeredByGoodScore?: boolean;
};

const PLANS: Record<Locale, PlanOption[]> = {
  it: [
    { id: "premium_monthly", label: "Mensile", price: "9,99€/mese", badge: "7gg gratis" },
    { id: "premium_quarterly", label: "Trimestrale", price: "19,99€", badge: "-33%" },
    { id: "premium_annual", label: "Annuale", price: "59,99€", badge: "-50%" },
  ],
  en: [
    { id: "premium_monthly", label: "Monthly", price: "€9.99/mo", badge: "7 days free" },
    { id: "premium_quarterly", label: "Quarterly", price: "€19.99", badge: "-33%" },
    { id: "premium_annual", label: "Annual", price: "€59.99", badge: "-50%" },
  ],
  fr: [
    { id: "premium_monthly", label: "Mensuel", price: "9,99€/mois", badge: "7j gratuits" },
    { id: "premium_quarterly", label: "Trimestriel", price: "19,99€", badge: "-33%" },
    { id: "premium_annual", label: "Annuel", price: "59,99€", badge: "-50%" },
  ],
  es: [
    { id: "premium_monthly", label: "Mensual", price: "9,99€/mes", badge: "7 días gratis" },
    { id: "premium_quarterly", label: "Trimestral", price: "19,99€", badge: "-33%" },
    { id: "premium_annual", label: "Anual", price: "59,99€", badge: "-50%" },
  ],
};

const COPY = {
  badge: {
    it: "Hai usato le tue 20 spiegazioni gratuite",
    en: "You've used your 20 free explanations",
    fr: "Vous avez utilisé vos 20 explications gratuites",
    es: "Has usado tus 20 explicaciones gratuitas",
  },
  badgeGoodScore: {
    it: "Stai andando bene — non fermarti adesso",
    en: "You're doing great — don't stop now",
    fr: "Vous progressez bien — ne vous arrêtez pas",
    es: "Lo estás haciendo bien — no te detengas ahora",
  },
  titleGeneric: {
    it: "Capisci ogni errore. Non tirare a indovinare.",
    en: "Understand every mistake. Don't just guess.",
    fr: "Comprenez chaque erreur. Ne faites pas que deviner.",
    es: "Entiende cada error. No adivines.",
  },
  titleWithCert: {
    it: (cert: string) => `Stai preparando il ${cert} — capire gli errori fa la differenza.`,
    en: (cert: string) => `You're preparing for ${cert} — understanding mistakes makes the difference.`,
    fr: (cert: string) => `Tu prépares le ${cert} — comprendre tes erreurs fait la différence.`,
    es: (cert: string) => `Estás preparando el ${cert} — entender los errores marca la diferencia.`,
  },
  titleGoodScore: {
    it: (score: number) => `Sei al ${score}% — sei vicino. Non perdere il ritmo adesso.`,
    en: (score: number) => `You're at ${score}% — you're close. Don't lose momentum now.`,
    fr: (score: number) => `Vous êtes à ${score}% — vous y êtes presque. Ne perdez pas votre élan.`,
    es: (score: number) => `Estás al ${score}% — estás cerca. No pierdas el ritmo ahora.`,
  },
  titleGoodScoreWithCert: {
    it: (cert: string, score: number) => `Sei al ${score}% su ${cert}. Sei vicino all'esame — non fermarti adesso.`,
    en: (cert: string, score: number) => `You're at ${score}% on ${cert}. You're close to the exam — don't stop now.`,
    fr: (cert: string, score: number) => `Vous êtes à ${score}% sur ${cert}. Vous êtes près de l'examen — ne vous arrêtez pas.`,
    es: (cert: string, score: number) => `Estás al ${score}% en ${cert}. Estás cerca del examen — no te detengas.`,
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
    it: "Hai fatto {wrong} errori. Senza spiegazioni non capisci dove stai sbagliando davvero.",
    en: "You made {wrong} mistakes. Without explanations you can't understand where you're really going wrong.",
    fr: "Vous avez fait {wrong} erreurs. Sans explications, vous ne comprenez pas où vous vous trompez vraiment.",
    es: "Has cometido {wrong} errores. Sin explicaciones no entiendes dónde te estás equivocando de verdad.",
  },
  urgencyLineGood: {
    it: "Sei al {score}% — ma senza spiegazioni sugli errori rischi di ripetere gli stessi sbagli all'esame.",
    en: "You're at {score}% — but without explanations on mistakes you risk repeating the same errors in the exam.",
    fr: "Vous êtes à {score}% — mais sans explications sur vos erreurs, vous risquez de les répéter à l'examen.",
    es: "Estás al {score}% — pero sin explicaciones sobre los errores arriesgas repetir los mismos fallos en el examen.",
  },
  urgencyLineMedium: {
    it: "Hai {wrong} errori da correggere. Senza capire il perché, continuerai a sbagliarli.",
    en: "You have {wrong} mistakes to fix. Without understanding why, you'll keep making them.",
    fr: "Vous avez {wrong} erreurs à corriger. Sans en comprendre la raison, vous continuerez à les faire.",
    es: "Tienes {wrong} errores por corregir. Sin entender el porqué, seguirás cometiéndolos.",
  },
  urgencyLineLow: {
    it: "Con {wrong} errori e senza spiegazioni, non riuscirai a colmare le lacune prima dell'esame.",
    en: "With {wrong} mistakes and no explanations, you won't be able to close your gaps before the exam.",
    fr: "Avec {wrong} erreurs et sans explications, vous ne pourrez pas combler vos lacunes avant l'examen.",
    es: "Con {wrong} errores y sin explicaciones, no podrás cerrar tus lagunas antes del examen.",
  },
  ctaHook: {
    it: "Con Premium capisci ogni errore — illimitatamente.",
    en: "With Premium you understand every mistake — unlimited.",
    fr: "Avec Premium, vous comprenez chaque erreur — sans limite.",
    es: "Con Premium entiendes cada error — ilimitadamente.",
  },
  pizzaLine: {
    it: "Al prezzo di una pizza: spiegazioni illimitate, ripasso errori e modalità esame reale.",
    en: "For the price of a pizza: unlimited explanations, error review and real exam mode.",
    fr: "Pour le prix d'une pizza : explications illimitées, révision des erreurs et mode examen réel.",
    es: "Por el precio de una pizza: explicaciones ilimitadas, repaso de errores y modo examen real.",
  },
  cta: {
    it: "Inizia 7 giorni gratis",
    en: "Start 7-day free trial",
    fr: "Commencer 7 jours gratuits",
    es: "Empezar 7 días gratis",
  },
  ctaMonthly: {
    it: "Inizia 7 giorni gratis",
    en: "Start 7-day free trial",
    fr: "Commencer 7 jours gratuits",
    es: "Empezar 7 días gratis",
  },
  ctaOther: {
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
    it: "7 giorni gratis · Nessun addebito ora · Disdici quando vuoi",
    en: "7 days free · No charge now · Cancel anytime",
    fr: "7 jours gratuits · Aucun débit maintenant · Annulez quand vous voulez",
    es: "7 días gratis · Sin cargo ahora · Cancela cuando quieras",
  },
  cancelNoteOther: {
    it: "Accesso immediato · Disdici quando vuoi · Garanzia 7 giorni",
    en: "Instant access · Cancel anytime · 7-day guarantee",
    fr: "Accès immédiat · Annulez quand vous voulez · Garantie 7 jours",
    es: "Acceso inmediato · Cancela cuando quieras · Garantía 7 días",
  },
  back: {
    it: "Continua senza spiegazioni",
    en: "Continue without explanations",
    fr: "Continuer sans explications",
    es: "Continuar sin explicaciones",
  },
  detailsToggle: {
    it: "Cosa include Premium",
    en: "What Premium includes",
    fr: "Ce que Premium inclut",
    es: "Qué incluye Premium",
  },
  features: {
    it: ["Il tutor AI che ti segue domanda per domanda, con spiegazioni personalizzate sui tuoi errori", "Spiegazioni illimitate su ogni errore", "Modalità esame reale con timer", "Ripasso errori mirati", "Quiz illimitati su tutte le certificazioni"],
    en: ["The AI tutor that follows you question by question, with personalized explanations on your mistakes", "Unlimited explanations on every mistake", "Real exam mode with timer", "Targeted error review", "Unlimited quizzes on all certifications"],
    fr: ["Le tuteur IA qui vous suit question par question, avec des explications personnalisées sur vos erreurs", "Explications illimitées sur chaque erreur", "Mode examen réel avec minuterie", "Révision ciblée des erreurs", "Quiz illimités sur toutes les certifications"],
    es: ["El tutor IA que te acompaña pregunta por pregunta, con explicaciones personalizadas sobre tus errores", "Explicaciones ilimitadas sobre cada error", "Modo examen real con temporizador", "Repaso específico de errores", "Quizzes ilimitados en todas las certificaciones"],
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
  triggeredByGoodScore = false,
}: Props) {
  const L = safeLang(lang);
  const [isLoading, setIsLoading] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan>("premium_monthly");

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

  const title = (() => {
    if (triggeredByGoodScore) {
      return certificationName
        ? COPY.titleGoodScoreWithCert[L](certificationName, percentage)
        : COPY.titleGoodScore[L](percentage);
    }
    return certificationName
      ? COPY.titleWithCert[L](certificationName)
      : COPY.titleGeneric[L];
  })();

  const badgeText = triggeredByGoodScore ? COPY.badgeGoodScore[L] : COPY.badge[L];

  const badgeClass = triggeredByGoodScore
    ? "mb-4 inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-900"
    : "mb-4 inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900";

  const isMonthly = selectedPlan === "premium_monthly";

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
          triggered_by_good_score: triggeredByGoodScore,
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
      <div className={badgeClass}>
        {triggeredByGoodScore ? "🎯" : "🔒"} {badgeText}
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
        {isLoading
          ? COPY.ctaLoading[L]
          : isMonthly
          ? COPY.ctaMonthly[L]
          : COPY.ctaOther[L]}
      </button>

      {/* Nota sotto CTA */}
      <p className="mt-2 text-center text-xs text-gray-400">
        {isMonthly ? COPY.cancelNote[L] : COPY.cancelNoteOther[L]}
      </p>

      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="mx-auto mt-3 block text-xs text-gray-400 underline underline-offset-2 hover:text-gray-600"
        >
          {COPY.back[L]}
        </button>
      )}

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