"use client";

import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { authFetch } from "@/lib/auth";

type Lang = "it" | "es" | "en" | "fr";

type Props = {
  forceLang?: Lang;
};

type FeatureItem = {
  h: string;
  p: string;
};

type CopyEntry = {
  badge: string;
  title: string;
  subtitle: string;
  priceLine: string;
  cta: string;
  ctaLoading: string;
  subCta: string;
  featuresTitle: string;
  checkoutError: string;
  features: FeatureItem[];
};

function getLangFromPathname(pathname: string | null): Lang {
  const seg = (pathname?.split("/")[1] || "").toLowerCase();

  if (seg === "it" || seg === "es" || seg === "en" || seg === "fr") {
    return seg as Lang;
  }

  return "en";
}

const COPY: Record<Lang, CopyEntry> = {
  it: {
    badge: "PREMIUM",
    title: "Sblocca CertifyQuiz Premium",
    subtitle:
      "Continua i quiz senza limiti e preparati davvero ai tuoi esami con spiegazioni complete, modalità esame e ripasso errori.",
    priceLine: "7€/mese • Disdici quando vuoi",
    cta: "Sblocca Premium – 7€/mese",
    ctaLoading: "Apertura checkout...",
    subCta: "Accesso immediato. Nessun vincolo.",
    featuresTitle: "Cosa include Premium",
    checkoutError: "Errore durante l'apertura del checkout. Riprova.",
    features: [
      {
        h: "Spiegazioni complete",
        p: "Sblocca tutte le spiegazioni per capire davvero gli errori e non limitarti a memorizzare.",
      },
      {
        h: "Modalità esame reale",
        p: "Allenati in modo più vicino all’esperienza d’esame, con un approccio più serio e focalizzato.",
      },
      {
        h: "Ripasso errori",
        p: "Rivedi le domande sbagliate e concentrati sui punti deboli invece di ripartire ogni volta da zero.",
      },
      {
        h: "Quiz illimitati",
        p: "Continua ad allenarti senza il limite del piano gratuito e completa davvero il tuo percorso.",
      },
    ],
  },

  es: {
    badge: "PREMIUM",
    title: "Desbloquea CertifyQuiz Premium",
    subtitle:
      "Continúa los quizzes sin límites y prepárate de verdad para tus exámenes con explicaciones completas, modo examen y repaso de errores.",
    priceLine: "7€/mes • Cancela cuando quieras",
    cta: "Desbloquea Premium – 7€/mes",
    ctaLoading: "Abriendo checkout...",
    subCta: "Acceso inmediato. Sin compromiso.",
    featuresTitle: "Qué incluye Premium",
    checkoutError: "Error al abrir el checkout. Inténtalo de nuevo.",
    features: [
      {
        h: "Explicaciones completas",
        p: "Desbloquea todas las explicaciones para entender de verdad tus errores y no solo memorizar.",
      },
      {
        h: "Modo examen real",
        p: "Entrena de una forma más cercana a la experiencia real del examen, con un enfoque más serio.",
      },
      {
        h: "Repaso de errores",
        p: "Revisa tus fallos y céntrate en tus puntos débiles en lugar de empezar siempre desde cero.",
      },
      {
        h: "Quizzes ilimitados",
        p: "Sigue practicando sin el límite del plan gratuito y completa de verdad tu preparación.",
      },
    ],
  },

  en: {
    badge: "PREMIUM",
    title: "Unlock CertifyQuiz Premium",
    subtitle:
      "Keep practicing without limits and prepare seriously for your exams with full explanations, exam mode, and error review.",
    priceLine: "€7/month • Cancel anytime",
    cta: "Unlock Premium – €7/month",
    ctaLoading: "Opening checkout...",
    subCta: "Instant access. No long-term commitment.",
    featuresTitle: "What Premium includes",
    checkoutError: "Error while opening checkout. Please try again.",
    features: [
      {
        h: "Full explanations",
        p: "Unlock every explanation so you can actually understand mistakes instead of just memorizing answers.",
      },
      {
        h: "Real exam mode",
        p: "Practice in a way that feels closer to the real exam experience, with a more focused approach.",
      },
      {
        h: "Error review",
        p: "Go back over your incorrect answers and focus on weak areas instead of restarting blindly.",
      },
      {
        h: "Unlimited quizzes",
        p: "Keep training without the Free plan limit and build real consistency in your preparation.",
      },
    ],
  },

  fr: {
    badge: "PREMIUM",
    title: "Débloquez CertifyQuiz Premium",
    subtitle:
      "Continuez les quiz sans limite et préparez-vous sérieusement à vos examens avec des explications complètes, le mode examen et la révision des erreurs.",
    priceLine: "7€/mois • Annulez quand vous voulez",
    cta: "Débloquez Premium – 7€/mois",
    ctaLoading: "Ouverture du checkout...",
    subCta: "Accès immédiat. Sans engagement.",
    featuresTitle: "Ce que Premium inclut",
    checkoutError: "Erreur lors de l'ouverture du checkout. Réessayez.",
    features: [
      {
        h: "Explications complètes",
        p: "Débloquez toutes les explications pour vraiment comprendre vos erreurs au lieu de mémoriser les réponses.",
      },
      {
        h: "Mode examen réel",
        p: "Entraînez-vous dans des conditions plus proches de l’examen réel, avec une approche plus sérieuse.",
      },
      {
        h: "Révision des erreurs",
        p: "Revenez sur vos erreurs et concentrez-vous sur vos points faibles au lieu de recommencer au hasard.",
      },
      {
        h: "Quiz illimités",
        p: "Continuez à vous entraîner sans la limite du plan gratuit et progressez vraiment.",
      },
    ],
  },
};

function FeatureCard({
  title,
  desc,
  variant,
}: {
  title: string;
  desc: string;
  variant: "blue" | "purple" | "green" | "amber";
}) {
  const variantClass =
    variant === "blue"
      ? "border-blue-200 bg-gradient-to-br from-blue-50 to-white"
      : variant === "purple"
      ? "border-purple-200 bg-gradient-to-br from-purple-50 to-white"
      : variant === "green"
      ? "border-emerald-200 bg-gradient-to-br from-emerald-50 to-white"
      : "border-amber-200 bg-gradient-to-br from-amber-50 to-white";

  return (
    <div className={`rounded-2xl border p-5 shadow-sm ${variantClass}`}>
      <div className="text-base font-semibold text-gray-900">{title}</div>
      <div className="mt-1 text-sm text-gray-700">{desc}</div>
    </div>
  );
}

export default function PremiumComingSoonView({ forceLang }: Props) {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);

  const lang = useMemo<Lang>(() => {
    if (
      forceLang === "it" ||
      forceLang === "es" ||
      forceLang === "en" ||
      forceLang === "fr"
    ) {
      return forceLang;
    }

    return getLangFromPathname(pathname);
  }, [forceLang, pathname]);

  const t = COPY[lang];

  async function startPremiumCheckout() {
    if (isLoading) return;

    try {
      setIsLoading(true);

      const res = await authFetch("/api/backend/billing/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-lang": lang,
        },
        body: JSON.stringify({ lang }),
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
      alert(t.checkoutError);
      setIsLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
        <section className="border-b border-gray-200 bg-gradient-to-b from-gray-50 to-white px-6 py-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-semibold text-gray-700">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            {t.badge}
          </div>

          <h1 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
            {t.title}
          </h1>

          <p className="mt-3 max-w-2xl text-sm text-gray-700 sm:text-base">
            {t.subtitle}
          </p>

          <p className="mt-4 text-base font-semibold text-gray-900">
            {t.priceLine}
          </p>
        </section>

        <section className="grid gap-6 px-6 py-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-gray-200 p-6">
            <div className="text-lg font-semibold text-gray-900">{t.title}</div>

            <p className="mt-2 text-sm text-gray-700">{t.subtitle}</p>

            <div className="mt-6">
              <button
                type="button"
                onClick={startPremiumCheckout}
                disabled={isLoading}
                className="inline-flex items-center justify-center rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? t.ctaLoading : t.cta}
              </button>

              <p className="mt-3 text-sm text-gray-600">{t.subCta}</p>
            </div>
          </div>

          <div>
            <div className="mb-3 text-lg font-semibold text-gray-900">
              {t.featuresTitle}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <FeatureCard
                title={t.features[0].h}
                desc={t.features[0].p}
                variant="blue"
              />
              <FeatureCard
                title={t.features[1].h}
                desc={t.features[1].p}
                variant="purple"
              />
              <FeatureCard
                title={t.features[2].h}
                desc={t.features[2].p}
                variant="amber"
              />
              <FeatureCard
                title={t.features[3].h}
                desc={t.features[3].p}
                variant="green"
              />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}