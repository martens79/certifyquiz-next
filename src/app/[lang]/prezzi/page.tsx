// src/app/[lang]/prezzi/page.tsx (o Premium, a seconda del path reale)
// Pagina Premium & prezzi — nuova UI con "carte" cliccabili

import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n";
import { withLang } from "@/lib/i18n";
import StructuredData from "@/components/StructuredData";

const SITE = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.certifyquiz.com").replace(
  /\/+$/,
  ""
);

const ogLocale: Record<Locale, string> = {
  it: "it_IT",
  en: "en_US",
  fr: "fr_FR",
  es: "es_ES",
};

const labels = {
  title: {
    it: "Premium & acquisti singoli | CertifyQuiz",
    en: "Premium & one-time purchases | CertifyQuiz",
    fr: "Premium & achats à l’unité | CertifyQuiz",
    es: "Premium y compras únicas | CertifyQuiz",
  },
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
} as const;

function L(map: Record<Locale, string>, lang: Locale): string {
  return map[lang] ?? map.it;
}

export async function generateMetadata(
  props: { params: Promise<{ lang: Locale }> }
): Promise<Metadata> {
  const { lang } = await props.params;

  const title = L(labels.title, lang);
  const description =
    lang === "it"
      ? "Scopri la differenza tra abbonamento Premium e acquisti singoli su CertifyQuiz: sblocca spiegazioni, quiz completi e badge ufficiali nel modo che preferisci."
      : lang === "en"
      ? "Learn the difference between Premium subscription and one-time purchases on CertifyQuiz: unlock explanations, full quizzes and official badges the way you prefer."
      : lang === "fr"
      ? "Découvrez la différence entre l’abonnement Premium et les achats à l’unité sur CertifyQuiz : débloquez explications, quiz complets et badges officiels comme vous le souhaitez."
      : "Descubre la diferencia entre suscripción Premium y compras únicas en CertifyQuiz: desbloquea explicaciones, cuestionarios completos e insignias oficiales como prefieras.";

  const canonical = `${SITE}/${lang}/prezzi`;

  return {
    metadataBase: new URL(SITE),
    title,
    description,
    alternates: {
      canonical,
      languages: {
        it: `${SITE}/it/prezzi`,
        en: `${SITE}/en/prezzi`,
        fr: `${SITE}/fr/prezzi`,
        es: `${SITE}/es/prezzi`,
      },
    },
    openGraph: {
      url: canonical,
      title,
      description,
      siteName: "CertifyQuiz",
      locale: ogLocale[lang],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      site: "@CertifyQuiz",
    },
    robots: { index: true, follow: true },
  };
}

export default async function PremiumPage(
  props: { params: Promise<{ lang: Locale }> }
) {
  const { lang } = await props.params;

  // FAQ (riuso testo esistente)
  const faq = (() => {
    if (lang === "it") {
      return [
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
      ];
    }
    if (lang === "en") {
      return [
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
      ];
    }
    if (lang === "fr") {
      return [
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
      ];
    }
    // es
    return [
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
  })();

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  } as const;

  return (
    <>
      <StructuredData id="ld-premium-faq" data={faqLd} />

      <main id="main" className="mx-auto max-w-5xl px-4 py-8">
        {/* Banner beta */}
        <div className="mb-4 rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900 shadow-sm">
          {L(labels.betaBanner, lang)}
        </div>

        {/* Header */}
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold text-slate-900">
            {L(labels.h1, lang)}
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            {L(labels.subtitle, lang)}
          </p>
        </header>

        {/* Carte prezzi */}
        <section className="mb-10">
          <div className="grid gap-4 md:grid-cols-3">
            {/* Settimanale */}
            <article className="flex flex-col rounded-2xl border border-blue-200 bg-gradient-to-b from-blue-50 to-white p-5 shadow-md transition hover:-translate-y-1 hover:shadow-lg">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-blue-700">
                {lang === "it"
                  ? "Premium settimanale"
                  : lang === "en"
                  ? "Weekly Premium"
                  : lang === "fr"
                  ? "Premium hebdomadaire"
                  : "Premium semanal"}
              </h2>
              <p className="mt-3 text-3xl font-extrabold text-slate-900">
                4,99 €
                <span className="ml-1 text-xs font-medium text-slate-500">
                  / {lang === "it" || lang === "es" ? "settimana" : lang === "fr" ? "semaine" : "week"}
                </span>
              </p>
              <p className="mt-2 text-xs text-slate-600">
                {lang === "it"
                  ? "Perfetto per un ripasso intensivo prima dell’esame."
                  : lang === "en"
                  ? "Perfect for an intensive review right before the exam."
                  : lang === "fr"
                  ? "Parfait pour une révision intensive juste avant l’examen."
                  : "Perfecto para un repaso intenso justo antes del examen."}
              </p>
              <ul className="mt-3 flex-1 list-disc space-y-1 pl-4 text-xs text-slate-700">
                <li>
                  {lang === "it"
                    ? "Accesso completo alle spiegazioni dei quiz inclusi."
                    : lang === "en"
                    ? "Full access to explanations for included quizzes."
                    : lang === "fr"
                    ? "Accès complet aux explications des quiz inclus."
                    : "Acceso completo a las explicaciones de los cuestionarios incluidos."}
                </li>
                <li>
                  {lang === "it"
                    ? "Statistiche di base sui tuoi tentativi."
                    : lang === "en"
                    ? "Basic stats on your attempts."
                    : lang === "fr"
                    ? "Statistiques de base sur vos tentatives."
                    : "Estadísticas básicas de tus intentos."}
                </li>
              </ul>
              <button
                type="button"
                className="mt-4 cursor-not-allowed rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white opacity-70"
              >
                {lang === "it"
                  ? "Disponibile al lancio"
                  : lang === "en"
                  ? "Available at launch"
                  : lang === "fr"
                  ? "Disponible au lancement"
                  : "Disponible en el lanzamiento"}
              </button>
            </article>

            {/* Mensile */}
            <article className="flex flex-col rounded-2xl border border-violet-200 bg-gradient-to-b from-violet-50 to-white p-5 shadow-md transition hover:-translate-y-1 hover:shadow-lg">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-violet-700">
                {lang === "it"
                  ? "Premium mensile"
                  : lang === "en"
                  ? "Monthly Premium"
                  : lang === "fr"
                  ? "Premium mensuel"
                  : "Premium mensual"}
              </h2>
              <p className="mt-3 text-3xl font-extrabold text-slate-900">
                8,99 €
                <span className="ml-1 text-xs font-medium text-slate-500">
                  / {lang === "it" || lang === "es" ? "mese" : lang === "fr" ? "mois" : "month"}
                </span>
              </p>
              <p className="mt-2 text-xs text-slate-600">
                {lang === "it"
                  ? "La scelta ideale se stai preparando più certificazioni."
                  : lang === "en"
                  ? "The ideal choice if you're preparing multiple certifications."
                  : lang === "fr"
                  ? "Le choix idéal si vous préparez plusieurs certifications."
                  : "La opción ideal si estás preparando varias certificaciones."}
              </p>
              <ul className="mt-3 flex-1 list-disc space-y-1 pl-4 text-xs text-slate-700">
                <li>
                  {lang === "it"
                    ? "Accesso a tutte le spiegazioni delle certificazioni incluse."
                    : lang === "en"
                    ? "Access to all explanations for included certifications."
                    : lang === "fr"
                    ? "Accès à toutes les explications pour les certifications incluses."
                    : "Acceso a todas las explicaciones de las certificaciones incluidas."}
                </li>
                <li>
                  {lang === "it"
                    ? "Nuovi quiz e aggiornamenti inclusi automaticamente."
                    : lang === "en"
                    ? "New quizzes and updates automatically included."
                    : lang === "fr"
                    ? "Nouveaux quiz et mises à jour inclus automatiquement."
                    : "Nuevos cuestionarios y actualizaciones incluidos automáticamente."}
                </li>
                <li>
                  {lang === "it"
                    ? "Badge e obiettivi per monitorare i tuoi progressi."
                    : lang === "en"
                    ? "Badges and goals to track your progress."
                    : lang === "fr"
                    ? "Badges et objectifs pour suivre vos progrès."
                    : "Insignias y objetivos para seguir tu progreso."}
                </li>
              </ul>
              <button
                type="button"
                className="mt-4 cursor-not-allowed rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white opacity-70"
              >
                {lang === "it"
                  ? "Disponibile al lancio"
                  : lang === "en"
                  ? "Available at launch"
                  : lang === "fr"
                  ? "Disponible au lancement"
                  : "Disponible en el lanzamiento"}
              </button>
            </article>

            {/* Acquisto singolo */}
            <article className="flex flex-col rounded-2xl border border-emerald-200 bg-gradient-to-b from-emerald-50 to-white p-5 shadow-md transition hover:-translate-y-1 hover:shadow-lg">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
                {lang === "it"
                  ? "Certificazione singola"
                  : lang === "en"
                  ? "Single certification"
                  : lang === "fr"
                  ? "Certification à l’unité"
                  : "Certificación individual"}
              </h2>
              <p className="mt-3 text-3xl font-extrabold text-slate-900">
                3,99 €
                <span className="ml-1 text-xs font-medium text-slate-500">
                  / {lang === "it" || lang === "es" ? "una tantum" : lang === "fr" ? "paiement unique" : "one-time"}
                </span>
              </p>
              <p className="mt-2 text-xs text-slate-600">
                {lang === "it"
                  ? "Sblocca per sempre una certificazione o un singolo esame."
                  : lang === "en"
                  ? "Unlock a single certification or exam forever."
                  : lang === "fr"
                  ? "Débloquez une certification ou un examen unique pour toujours."
                  : "Desbloquea una certificación o examen único para siempre."}
              </p>
              <ul className="mt-3 flex-1 list-disc space-y-1 pl-4 text-xs text-slate-700">
                <li>
                  {lang === "it"
                    ? "Paghi una sola volta, senza abbonamento."
                    : lang === "en"
                    ? "Pay once, no subscription."
                    : lang === "fr"
                    ? "Vous payez une seule fois, sans abonnement."
                    : "Pagas una sola vez, sin suscripción."}
                </li>
                <li>
                  {lang === "it"
                    ? "Accesso finché la certificazione resta su CertifyQuiz."
                    : lang === "en"
                    ? "Access as long as the certification remains on CertifyQuiz."
                    : lang === "fr"
                    ? "Accès tant que la certification reste disponible sur CertifyQuiz."
                    : "Acceso mientras la certificación siga disponible en CertifyQuiz."}
                </li>
              </ul>
              <button
                type="button"
                className="mt-4 cursor-not-allowed rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white opacity-70"
              >
                {lang === "it"
                  ? "Disponibile al lancio"
                  : lang === "en"
                  ? "Available at launch"
                  : lang === "fr"
                  ? "Disponible au lancement"
                  : "Disponible en el lanzamiento"}
              </button>
            </article>
          </div>
        </section>

        {/* Quale scegliere? */}
        <section className="mb-10 rounded-2xl border bg-slate-50 p-5">
          <h2 className="mb-2 text-lg font-bold text-slate-900">
            {lang === "it"
              ? "Qual è la soluzione giusta per te?"
              : lang === "en"
              ? "Which option is right for you?"
              : lang === "fr"
              ? "Quelle option est faite pour vous ?"
              : "¿Qué opción es mejor para ti?"}
          </h2>
          <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700">
            <li>
              {lang === "it"
                ? "Scegli l’abbonamento Premium se stai preparando più certificazioni o vuoi avere sempre nuovi quiz."
                : lang === "en"
                ? "Choose the Premium subscription if you are preparing multiple certifications or want continuous new quizzes."
                : lang === "fr"
                ? "Choisissez l’abonnement Premium si vous préparez plusieurs certifications ou souhaitez de nouveaux quiz en continu."
                : "Elige la suscripción Premium si estás preparando varias certificaciones o quieres tener siempre nuevos cuestionarios."}
            </li>
            <li>
              {lang === "it"
                ? "Scegli l’acquisto singolo se ti serve solo una certificazione specifica o vuoi testare CertifyQuiz su un singolo esame."
                : lang === "en"
                ? "Choose a one-time purchase if you only need one specific certification or want to test CertifyQuiz on a single exam."
                : lang === "fr"
                ? "Choisissez l’achat à l’unité si vous avez seulement besoin d’une certification spécifique ou souhaitez tester CertifyQuiz sur un seul examen."
                : "Elige una compra única si solo necesitas una certificación específica o quieres probar CertifyQuiz en un único examen."}
            </li>
          </ul>
        </section>

        {/* FAQ */}
        <section className="mb-10">
          <h2 className="mb-3 text-lg font-bold text-slate-900">
            {lang === "it"
              ? "Domande frequenti"
              : lang === "en"
              ? "Frequently Asked Questions"
              : lang === "fr"
              ? "Questions fréquentes"
              : "Preguntas frecuentes"}
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

        {/* CTA finale */}
        <div className="flex flex-wrap justify-center gap-3">
          <a
            href={withLang(lang, "/quiz-home")}
            className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow hover:bg-blue-700"
          >
            {lang === "it"
              ? "Vai ai quiz"
              : lang === "en"
              ? "Go to quizzes"
              : lang === "fr"
              ? "Accéder aux quiz"
              : "Ir a los cuestionarios"}
          </a>
          <a
            href={withLang(lang, "/register")}
            className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50"
          >
            {lang === "it"
              ? "Crea un account gratuito"
              : lang === "en"
              ? "Create a free account"
              : lang === "fr"
              ? "Créer un compte gratuit"
              : "Crear una cuenta gratuita"}
          </a>
        </div>
      </main>
    </>
  );
}
