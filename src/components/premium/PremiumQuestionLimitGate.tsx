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
    fr: "Limite gratuit atteinte",
    es: "Límite gratuito alcanzado",
  },
  title: {
    it: "Ti sei fermato a {limit} domande 🎯",
    en: "You've reached {limit} questions 🎯",
    fr: "Vous êtes arrivé à {limit} questions 🎯",
    es: "Has llegado a {limit} preguntas 🎯",
  },
  subtitle: {
    it: "Ed è proprio qui che molti si fermano.",
    en: "And this is exactly where many people stop.",
    fr: "Et c'est exactement ici que beaucoup s'arrêtent.",
    es: "Y es justo aquí donde muchos se detienen.",
  },
  progress: {
    it: "Hai completato {current}/{limit} domande gratuite.",
    en: "You've completed {current}/{limit} free questions.",
    fr: "Vous avez complété {current}/{limit} questions gratuites.",
    es: "Has completado {current}/{limit} preguntas gratuitas.",
  },
  text: {
    it: "La differenza la fa chi continua. Con Premium sblocchi l'esperienza completa, studi con più continuità e trasformi il quiz in una preparazione vera, non in una semplice prova veloce.",
    en: "The difference is made by the people who keep going. With Premium, you unlock the full experience, study with more consistency, and turn the quiz into real preparation instead of a quick test.",
    fr: "La différence, ce sont ceux qui continuent. Avec Premium, vous débloquez l'expérience complète, étudiez avec plus de régularité et transformez le quiz en vraie préparation.",
    es: "La diferencia la marca quien sigue adelante. Con Premium desbloqueas la experiencia completa, estudias con más constancia y conviertes el quiz en una preparación real.",
  },
  urgencyLine: {
    it: "Hai già iniziato bene. Fermarti adesso sarebbe il momento peggiore.",
    en: "You've already started well. Stopping now would be the worst moment.",
    fr: "Vous avez déjà bien commencé. S'arrêter maintenant serait le pire moment.",
    es: "Ya empezaste bien. Detenerte ahora sería el peor momento.",
  },
  pizzaLine: {
    it: "Al prezzo di una pizza, continui senza limiti e ti prepari davvero alla certificazione.",
    en: "For the price of a pizza, you keep going without limits and prepare seriously for your certification.",
    fr: "Pour le prix d'une pizza, vous continuez sans limites et vous vous préparez vraiment à la certification.",
    es: "Por el precio de una pizza, sigues sin límites y te preparas de verdad para la certificación.",
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
  // Tabella
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
      { label: "Explications des réponses", free: "❌", premium: "✅ Toutes" },
      { label: "Mode examen réel", free: "❌", premium: "✅" },
      { label: "Révision des erreurs", free: "❌", premium: "✅" },
      { label: "Toutes les certifications", free: "✅", premium: "✅" },
    ],
    es: [
      { label: "Quizzes por día", free: "20", premium: "Ilimitados" },
      { label: "Explicaciones de respuestas", free: "❌", premium: "✅ Todas" },
      { label: "Modo examen real", free: "❌", premium: "✅" },
      { label: "Repaso de errores", free: "❌", premium: "✅" },
      { label: "Todas las certificaciones", free: "✅", premium: "✅" },
    ],
  },
  // Garanzia
  guaranteeTitle: {
    it: "Garanzia 7 giorni",
    en: "7-day money-back guarantee",
    fr: "Garantie 7 jours",
    es: "Garantía de 7 días",
  },
  guaranteeDesc: {
    it: "Se nei primi 7 giorni non sei soddisfatto, ti rimborsiamo senza fare domande. Zero rischi.",
    en: "If you're not satisfied within the first 7 days, we'll refund you — no questions asked. Zero risk.",
    fr: "Si vous n'êtes pas satisfait dans les 7 premiers jours, nous vous remboursons sans poser de questions. Zéro risque.",
    es: "Si en los primeros 7 días no estás satisfecho, te reembolsamos sin preguntas. Sin riesgos.",
  },
  // Testimonials
  testimonialsTitle: {
    it: "Chi ha continuato, ha passato l'esame",
    en: "Those who kept going, passed",
    fr: "Ceux qui ont continué ont réussi",
    es: "Quienes siguieron adelante, aprobaron",
  },
  testimonials: {
    it: [
      { text: "Ho passato il CCNA al primo tentativo dopo 3 settimane. Le spiegazioni Premium fanno davvero la differenza.", name: "Marco R.", cert: "Cisco CCNA" },
      { text: "Senza Premium mi sarei fermato ai primi quiz. Con le spiegazioni ho capito dove sbagliavo davvero.", name: "Sara T.", cert: "CompTIA Security+" },
    ],
    en: [
      { text: "Passed the CCNA on my first attempt after 3 weeks. The Premium explanations make a real difference.", name: "Mark R.", cert: "Cisco CCNA" },
      { text: "Without Premium I would have stopped at the first quizzes. The explanations helped me understand where I was actually going wrong.", name: "Sarah T.", cert: "CompTIA Security+" },
    ],
    fr: [
      { text: "J'ai réussi le CCNA du premier coup après 3 semaines. Les explications Premium font vraiment la différence.", name: "Marc R.", cert: "Cisco CCNA" },
      { text: "Sans Premium je me serais arrêté aux premiers quiz. Les explications m'ont aidé à comprendre mes erreurs.", name: "Sophie T.", cert: "CompTIA Security+" },
    ],
    es: [
      { text: "Aprobé el CCNA al primer intento después de 3 semanas. Las explicaciones Premium marcan la diferencia.", name: "Carlos M.", cert: "Cisco CCNA" },
      { text: "Sin Premium me habría detenido en los primeros quizzes. Las explicaciones me ayudaron a entender mis errores.", name: "Ana P.", cert: "CompTIA Security+" },
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
  finalLine: {
    it: "Chi passa l'esame non è sempre il più bravo. Spesso è quello che non si ferma.",
    en: "The one who passes is not always the smartest. Often, it's the one who doesn't stop.",
    fr: "Celui qui réussit n'est pas toujours le plus fort. Souvent, c'est celui qui ne s'arrête pas.",
    es: "Quien aprueba no siempre es el más brillante. Muchas veces es quien no se detiene.",
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

      {/* Badge */}
      <div className="mb-4 inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900">
        🔒 {COPY.badge[L]}
      </div>

      {/* Titolo */}
      <h2 className="mb-2 text-2xl font-semibold tracking-tight sm:text-3xl">
        {interpolate(COPY.title[L], { limit: freeLimit })}
      </h2>

      <p className="mb-3 text-base font-semibold text-gray-900 sm:text-lg">
        {COPY.subtitle[L]}
      </p>

      <p className="mb-2 text-sm text-gray-600 sm:text-base">
        {interpolate(COPY.progress[L], { current: currentCount, limit: freeLimit })}
      </p>

      <p className="mb-4 text-sm text-gray-700 sm:text-base">
        {COPY.text[L]}
      </p>

      {/* Urgency */}
      <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 p-4">
        <p className="text-sm font-semibold text-amber-900 sm:text-base">
          {COPY.urgencyLine[L]}
        </p>
        <p className="mt-2 text-sm text-amber-800 sm:text-base">
          {COPY.pizzaLine[L]}
        </p>
      </div>

      {/* Tabella Free vs Premium */}
      <div className="mb-5 overflow-hidden rounded-xl border border-gray-200">
        <div className="bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-900">
          {COPY.tableTitle[L]}
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="px-4 py-2 text-left font-medium text-gray-600">{COPY.tableFeature[L]}</th>
              <th className="px-4 py-2 text-center font-medium text-gray-500">{COPY.tableFree[L]}</th>
              <th className="px-4 py-2 text-center font-semibold text-black">{COPY.tablePremium[L]}</th>
            </tr>
          </thead>
          <tbody>
            {COPY.tableRows[L].map((row, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-4 py-2 text-gray-800">{row.label}</td>
                <td className="px-4 py-2 text-center text-gray-500">{row.free}</td>
                <td className="px-4 py-2 text-center font-medium text-emerald-700">{row.premium}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Features list */}
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

      {/* CTA principale */}
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

      {/* Garanzia */}
      <div className="mt-5 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
        <div className="text-2xl">🛡️</div>
        <div>
          <div className="text-sm font-semibold text-emerald-900">{COPY.guaranteeTitle[L]}</div>
          <p className="mt-1 text-xs text-emerald-800">{COPY.guaranteeDesc[L]}</p>
        </div>
      </div>

      {/* Testimonials */}
      <div className="mt-5">
        <p className="mb-3 text-sm font-semibold text-gray-900">{COPY.testimonialsTitle[L]}</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {COPY.testimonials[L].map((item, i) => (
            <div key={i} className="rounded-xl border border-gray-200 bg-white p-4">
              <div className="mb-2 text-yellow-400 text-xs">★★★★★</div>
              <p className="text-xs text-gray-700 italic">"{item.text}"</p>
              <div className="mt-3">
                <div className="text-xs font-semibold text-gray-900">{item.name}</div>
                <div className="text-xs text-gray-500">{item.cert}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="mt-5 text-sm font-medium text-gray-900 sm:text-base">
        {COPY.finalLine[L]}
      </p>
    </div>
  );
}