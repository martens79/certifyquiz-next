// src/app/[lang]/(marketing)/_pricing/PricingPage.tsx
// Shared Pricing page (server component) — reused by /prezzi, /pricing, /prix, /precios
//
// ✅ Supports BOTH:
// 1) inside [lang] routes  -> props.params.lang
// 2) EN root route /pricing -> props.lang = "en"
//
// NOTE: This page is content-only. Header/Footer come from the layout shell.

import Link from "next/link";
import StructuredData from "@/components/StructuredData";
import type { Locale } from "@/lib/i18n";
import { withLang } from "@/lib/i18n";

/* -------------------------------- Labels -------------------------------- */

const labels = {
  h1: {
    it: "Come funziona l’accesso Premium",
    en: "How Premium access works",
    fr: "Comment fonctionne l’accès Premium",
    es: "Cómo funciona el acceso Premium",
  },
  subtitle: {
    it: "Scegli se abbonarti o sbloccare solo ciò che ti serve.",
    en: "Choose between a subscription or unlocking only what you need.",
    fr: "Choisissez un abonnement ou débloquez seulement ce dont vous avez besoin.",
    es: "Elige entre suscripción o desbloquear solo lo que necesitas.",
  },
  betaBanner: {
    it: "🚧 Sito in beta: per ora l’accesso è completamente gratuito. I prezzi qui sotto sono indicativi e potranno cambiare al lancio.",
    en: "🚧 Beta version: for now access is completely free. Prices below are indicative and may change at launch.",
    fr: "🚧 Version bêta : pour l’instant l’accès est entièrement gratuit. Les prix ci-dessous sont indicatifs et pourront changer au lancement.",
    es: "🚧 Versión beta: por ahora el acceso es completamente gratuito. Los precios siguientes son orientativos y podrán cambiar en el lanzamiento.",
  },

  weekly: {
    it: "Premium settimanale",
    en: "Weekly Premium",
    fr: "Premium hebdomadaire",
    es: "Premium semanal",
  },
  weeklyUnit: {
    it: "settimana",
    en: "week",
    fr: "semaine",
    es: "semana",
  },
  weeklyDesc: {
    it: "Perfetto per un ripasso intensivo prima dell’esame.",
    en: "Perfect for an intensive review right before the exam.",
    fr: "Parfait pour une révision intensive juste avant l’examen.",
    es: "Perfecto para un repaso intenso justo antes del examen.",
  },
  weeklyBullets1: {
    it: "Accesso completo alle spiegazioni dei quiz inclusi.",
    en: "Full access to explanations for included quizzes.",
    fr: "Accès complet aux explications des quiz inclus.",
    es: "Acceso completo a las explicaciones de los cuestionarios incluidos.",
  },
  weeklyBullets2: {
    it: "Statistiche di base sui tuoi tentativi.",
    en: "Basic stats on your attempts.",
    fr: "Statistiques de base sur vos tentatives.",
    es: "Estadísticas básicas de tus intentos.",
  },

  monthly: {
    it: "Premium mensile",
    en: "Monthly Premium",
    fr: "Premium mensuel",
    es: "Premium mensual",
  },
  monthlyUnit: {
    it: "mese",
    en: "month",
    fr: "mois",
    es: "mes",
  },
  monthlyDesc: {
    it: "La scelta ideale se stai preparando più certificazioni.",
    en: "The ideal choice if you're preparing multiple certifications.",
    fr: "Le choix idéal si vous préparez plusieurs certifications.",
    es: "La opción ideal si estás preparando varias certificaciones.",
  },
  monthlyBullets1: {
    it: "Accesso a tutte le spiegazioni delle certificazioni incluse.",
    en: "Access to all explanations for included certifications.",
    fr: "Accès à toutes les explications pour les certifications incluses.",
    es: "Acceso a todas las explicaciones de las certificaciones incluidas.",
  },
  monthlyBullets2: {
    it: "Nuovi quiz e aggiornamenti inclusi automaticamente.",
    en: "New quizzes and updates automatically included.",
    fr: "Nouveaux quiz et mises à jour inclus automatiquement.",
    es: "Nuevos cuestionarios y actualizaciones incluidos automáticamente.",
  },
  monthlyBullets3: {
    it: "Badge e obiettivi per monitorare i tuoi progressi.",
    en: "Badges and goals to track your progress.",
    fr: "Badges et objectifs pour suivre vos progrès.",
    es: "Insignias y objetivos para seguir tu progreso.",
  },

  single: {
    it: "Certificazione singola",
    en: "Single certification",
    fr: "Certification à l’unité",
    es: "Certificación individual",
  },
  singleUnit: {
    it: "una tantum",
    en: "one-time",
    fr: "paiement unique",
    es: "pago único",
  },
  singleDesc: {
    it: "Sblocca per sempre una certificazione o un singolo esame.",
    en: "Unlock a single certification or exam forever.",
    fr: "Débloquez une certification ou un examen unique pour toujours.",
    es: "Desbloquea una certificación o examen único para siempre.",
  },
  singleBullets1: {
    it: "Paghi una sola volta, senza abbonamento.",
    en: "Pay once, no subscription.",
    fr: "Vous payez une seule fois, sans abonnement.",
    es: "Pagas una sola vez, sin suscripción.",
  },
  singleBullets2: {
    it: "Accesso finché la certificazione resta su CertifyQuiz.",
    en: "Access as long as the certification remains on CertifyQuiz.",
    fr: "Accès tant que la certification reste disponible sur CertifyQuiz.",
    es: "Acceso mientras la certificación siga disponible en CertifyQuiz.",
  },

  availableAtLaunch: {
    it: "Disponibile al lancio",
    en: "Available at launch",
    fr: "Disponible au lancement",
    es: "Disponible en el lanzamiento",
  },

  whichTitle: {
    it: "Qual è la soluzione giusta per te?",
    en: "Which option is right for you?",
    fr: "Quelle option est faite pour vous ?",
    es: "¿Qué opción es mejor para ti?",
  },
  whichA: {
    it: "Scegli l’abbonamento Premium se stai preparando più certificazioni o vuoi avere sempre nuovi quiz.",
    en: "Choose Premium if you're preparing multiple certifications or want a steady flow of new quizzes.",
    fr: "Choisissez Premium si vous préparez plusieurs certifications ou souhaitez de nouveaux quiz en continu.",
    es: "Elige Premium si estás preparando varias certificaciones o quieres nuevos cuestionarios de forma continua.",
  },
  whichB: {
    it: "Scegli l’acquisto singolo se ti serve solo una certificazione specifica o vuoi testare CertifyQuiz su un singolo esame.",
    en: "Choose a one-time purchase if you only need one certification or want to test CertifyQuiz on a single exam.",
    fr: "Choisissez l’achat à l’unité si vous n’avez besoin que d’une certification ou souhaitez tester CertifyQuiz sur un seul examen.",
    es: "Elige compra única si solo necesitas una certificación o quieres probar CertifyQuiz con un único examen.",
  },

  faqTitle: {
    it: "Domande frequenti",
    en: "Frequently Asked Questions",
    fr: "Questions fréquentes",
    es: "Preguntas frecuentes",
  },

  ctaQuizzes: {
    it: "Vai ai quiz",
    en: "Go to quizzes",
    fr: "Accéder aux quiz",
    es: "Ir a los cuestionarios",
  },
  ctaRegister: {
    it: "Crea un account gratuito",
    en: "Create a free account",
    fr: "Créer un compte gratuit",
    es: "Crear una cuenta gratuita",
  },
} as const;

function L(map: Record<Locale, string>, lang: Locale): string {
  return map[lang] ?? map.it;
}

/* -------------------------------- Types -------------------------------- */

type Props =
  | { params: Promise<{ lang: Locale }> } // inside /[lang]/...
  | { lang: Locale }; // EN root /pricing

function getLangFromProps(props: Props): Promise<Locale> | Locale {
  return "lang" in props ? props.lang : props.params.then((p) => p.lang);
}

/* -------------------------------- Page -------------------------------- */

export default async function PricingPage(props: Props) {
  const maybe = getLangFromProps(props);
  const lang: Locale = typeof maybe === "string" ? maybe : await maybe;

  const faq =
    lang === "it"
      ? [
          {
            q: "Qual è la differenza tra Premium e acquisto singolo?",
            a: "Con Premium hai accesso a più certificazioni e a tutte le spiegazioni incluse nel piano. Con l’acquisto singolo sblocchi solo una certificazione, un argomento o un pacchetto specifico, senza abbonamento.",
          },
          {
            q: "Posso iniziare con un acquisto singolo e poi passare a Premium?",
            a: "Sì, in futuro potrai passare a un abbonamento Premium anche se hai già sbloccato certificazioni singole.",
          },
          {
            q: "Per quanto tempo rimane valido un acquisto singolo?",
            a: "L’acquisto singolo rimane valido finché la relativa certificazione è disponibile su CertifyQuiz.",
          },
        ]
      : lang === "en"
      ? [
          {
            q: "What is the difference between Premium and a one-time purchase?",
            a: "With Premium you get access to multiple certifications and all explanations included in the plan. With a one-time purchase you only unlock a specific certification, topic or bundle, with no subscription.",
          },
          {
            q: "Can I start with a one-time purchase and upgrade to Premium later?",
            a: "Yes, in the future you will be able to upgrade to a Premium subscription even if you already unlocked single certifications.",
          },
          {
            q: "How long does a one-time purchase remain valid?",
            a: "Your one-time purchase remains valid as long as the related certification is available on CertifyQuiz.",
          },
        ]
      : lang === "fr"
      ? [
          {
            q: "Quelle est la différence entre Premium et un achat à l’unité ?",
            a: "Avec Premium, vous avez accès à plusieurs certifications et à toutes les explications incluses dans l’abonnement. Avec un achat à l’unité, vous débloquez seulement une certification, un sujet ou un pack spécifique, sans abonnement.",
          },
          {
            q: "Puis-je commencer par un achat à l’unité puis passer à Premium ?",
            a: "Oui, vous pourrez passer à un abonnement Premium même si vous avez déjà débloqué des certifications individuelles.",
          },
          {
            q: "Combien de temps un achat à l’unité reste-t-il valide ?",
            a: "Votre achat à l’unité reste valide tant que la certification correspondante est disponible sur CertifyQuiz.",
          },
        ]
      : [
          {
            q: "¿Cuál es la diferencia entre Premium y una compra única?",
            a: "Con Premium tienes acceso a varias certificaciones y a todas las explicaciones incluidas en el plan. Con una compra única solo desbloqueas una certificación, tema o paquete específico, sin suscripción.",
          },
          {
            q: "¿Puedo empezar con una compra única y luego pasar a Premium?",
            a: "Sí, en el futuro podrás pasar a una suscripción Premium incluso si ya has desbloqueado certificaciones individuales.",
          },
          {
            q: "¿Durante cuánto tiempo es válida una compra única?",
            a: "Tu compra única sigue siendo válida mientras la certificación correspondiente esté disponible en CertifyQuiz.",
          },
        ];

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  } as const;

  return (
    <>
      <StructuredData id="ld-pricing-faq" data={faqLd} />

      <main id="main" className="mx-auto max-w-5xl px-4 py-8">
        {/* Beta banner */}
        <div className="mb-5 rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900 shadow-sm">
          {L(labels.betaBanner, lang)}
        </div>

        {/* Page header */}
        <header className="mb-10 text-center">
          <h1 className="text-3xl font-extrabold text-slate-900">
            {L(labels.h1, lang)}
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            {L(labels.subtitle, lang)}
          </p>
        </header>

        {/* Cards */}
        <section className="mb-10">
          <div className="grid gap-4 md:grid-cols-3">
            {/* Weekly */}
            <article className="flex flex-col rounded-2xl border border-blue-200 bg-gradient-to-b from-blue-50 to-white p-5 shadow-md transition hover:-translate-y-0.5 hover:shadow-lg">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-blue-700">
                {L(labels.weekly, lang)}
              </h2>
              <p className="mt-3 text-3xl font-extrabold text-slate-900">
                4,99 €
                <span className="ml-1 text-xs font-medium text-slate-500">
                  / {L(labels.weeklyUnit, lang)}
                </span>
              </p>
              <p className="mt-2 text-xs text-slate-600">
                {L(labels.weeklyDesc, lang)}
              </p>
              <ul className="mt-3 flex-1 list-disc space-y-1 pl-4 text-xs text-slate-700">
                <li>{L(labels.weeklyBullets1, lang)}</li>
                <li>{L(labels.weeklyBullets2, lang)}</li>
              </ul>
              <button
                type="button"
                className="mt-4 cursor-not-allowed rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white opacity-70"
              >
                {L(labels.availableAtLaunch, lang)}
              </button>
            </article>

            {/* Monthly */}
            <article className="flex flex-col rounded-2xl border border-violet-200 bg-gradient-to-b from-violet-50 to-white p-5 shadow-md transition hover:-translate-y-0.5 hover:shadow-lg">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-violet-700">
                {L(labels.monthly, lang)}
              </h2>
              <p className="mt-3 text-3xl font-extrabold text-slate-900">
                8,99 €
                <span className="ml-1 text-xs font-medium text-slate-500">
                  / {L(labels.monthlyUnit, lang)}
                </span>
              </p>
              <p className="mt-2 text-xs text-slate-600">
                {L(labels.monthlyDesc, lang)}
              </p>
              <ul className="mt-3 flex-1 list-disc space-y-1 pl-4 text-xs text-slate-700">
                <li>{L(labels.monthlyBullets1, lang)}</li>
                <li>{L(labels.monthlyBullets2, lang)}</li>
                <li>{L(labels.monthlyBullets3, lang)}</li>
              </ul>
              <button
                type="button"
                className="mt-4 cursor-not-allowed rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white opacity-70"
              >
                {L(labels.availableAtLaunch, lang)}
              </button>
            </article>

            {/* Single */}
            <article className="flex flex-col rounded-2xl border border-emerald-200 bg-gradient-to-b from-emerald-50 to-white p-5 shadow-md transition hover:-translate-y-0.5 hover:shadow-lg">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
                {L(labels.single, lang)}
              </h2>
              <p className="mt-3 text-3xl font-extrabold text-slate-900">
                3,99 €
                <span className="ml-1 text-xs font-medium text-slate-500">
                  / {L(labels.singleUnit, lang)}
                </span>
              </p>
              <p className="mt-2 text-xs text-slate-600">
                {L(labels.singleDesc, lang)}
              </p>
              <ul className="mt-3 flex-1 list-disc space-y-1 pl-4 text-xs text-slate-700">
                <li>{L(labels.singleBullets1, lang)}</li>
                <li>{L(labels.singleBullets2, lang)}</li>
              </ul>
              <button
                type="button"
                className="mt-4 cursor-not-allowed rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white opacity-70"
              >
                {L(labels.availableAtLaunch, lang)}
              </button>
            </article>
          </div>
        </section>

        {/* Which one */}
        <section className="mb-10 rounded-2xl border bg-slate-50 p-5">
          <h2 className="mb-2 text-lg font-bold text-slate-900">
            {L(labels.whichTitle, lang)}
          </h2>
          <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700">
            <li>{L(labels.whichA, lang)}</li>
            <li>{L(labels.whichB, lang)}</li>
          </ul>
        </section>

        {/* FAQ */}
        <section className="mb-10">
          <h2 className="mb-3 text-lg font-bold text-slate-900">
            {L(labels.faqTitle, lang)}
          </h2>
          <div className="space-y-3">
            {faq.map((item, idx) => (
              <details
                key={idx}
                className="rounded-xl border bg-white p-3 text-sm shadow-sm"
              >
                <summary className="cursor-pointer font-semibold text-slate-900">
                  {item.q}
                </summary>
                <p className="mt-1 text-slate-700">{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Final CTAs */}
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href={withLang(lang, "/quiz-home")}
            className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow hover:bg-blue-700"
          >
            {L(labels.ctaQuizzes, lang)}
          </Link>

          <Link
            href={withLang(lang, "/register")}
            className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50"
          >
            {L(labels.ctaRegister, lang)}
          </Link>
        </div>
      </main>
    </>
  );
}
