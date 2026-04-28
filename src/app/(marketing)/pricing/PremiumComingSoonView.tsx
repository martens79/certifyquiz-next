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
  pizzaLine: string;
  urgencyLine: string;
  finalLine: string;
  features: FeatureItem[];
  // Tabella
  tableTitle: string;
  tableFeature: string;
  tableFree: string;
  tablePremium: string;
  tableRows: { label: string; free: string; premium: string }[];
  // Garanzia
  guaranteeTitle: string;
  guaranteeDesc: string;
  // Testimonials
  testimonialsTitle: string;
  testimonials: { text: string; name: string; cert: string }[];
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
    priceLine: "9,99€/mese • Disdici quando vuoi",
    cta: "Sblocca Premium – 9,99€/mese",
    ctaLoading: "Apertura checkout...",
    subCta: "Accesso immediato. Nessun vincolo.",
    featuresTitle: "Cosa include Premium",
    checkoutError: "Errore durante l'apertura del checkout. Riprova.",
    pizzaLine:
      "Al prezzo di una pizza, sblocchi una preparazione più seria, continua e completa.",
    urgencyLine:
      "Molti si fermano dopo qualche quiz. Quelli che continuano sono quelli che arrivano preparati davvero.",
    finalLine:
      "Chi supera l'esame non è sempre il più bravo. Spesso è quello che non si ferma.",
    features: [
      {
        h: "Spiegazioni complete",
        p: "Sblocca tutte le spiegazioni per capire davvero gli errori e non limitarti a memorizzare.",
      },
      {
        h: "Modalità esame reale",
        p: "Allenati in modo più vicino all'esperienza d'esame, con un approccio più serio e focalizzato.",
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
    tableTitle: "Free vs Premium",
    tableFeature: "Funzionalità",
    tableFree: "Gratis",
    tablePremium: "Premium",
    tableRows: [
      { label: "Quiz al giorno", free: "20", premium: "Illimitati" },
      { label: "Spiegazioni risposte", free: "❌", premium: "✅ Tutte" },
      { label: "Modalità esame reale", free: "❌", premium: "✅" },
      { label: "Ripasso errori", free: "❌", premium: "✅" },
      { label: "Tutte le certificazioni", free: "✅", premium: "✅" },
      { label: "Accesso multilingua", free: "✅", premium: "✅" },
    ],
    guaranteeTitle: "Garanzia 7 giorni",
    guaranteeDesc:
      "Se nei primi 7 giorni non sei soddisfatto, ti rimborsiamo senza fare domande. Zero rischi.",
    testimonialsTitle: "Chi lo usa, lo consiglia",
    testimonials: [
      {
        text: "Ho passato il CCNA al primo tentativo dopo 3 settimane di quiz su CertifyQuiz. Le spiegazioni Premium fanno davvero la differenza.",
        name: "Marco R.",
        cert: "Cisco CCNA",
      },
      {
        text: "Finalmente una piattaforma seria per prepararsi al Security+. I quiz sono realistici e le spiegazioni mi hanno aiutato a capire i concetti, non solo memorizzare.",
        name: "Sara T.",
        cert: "CompTIA Security+",
      },
      {
        text: "9,99€ al mese è niente rispetto al costo dell'esame. Ho passato il CISSP e ne è valsa assolutamente la pena.",
        name: "Luca M.",
        cert: "CISSP",
      },
    ],
  },

  es: {
    badge: "PREMIUM",
    title: "Desbloquea CertifyQuiz Premium",
    subtitle:
      "Continúa los quizzes sin límites y prepárate de verdad para tus exámenes con explicaciones completas, modo examen y repaso de errores.",
    priceLine: "9,99€/mes • Cancela cuando quieras",
    cta: "Desbloquea Premium – 9,99€/mes",
    ctaLoading: "Abriendo checkout...",
    subCta: "Acceso inmediato. Sin compromiso.",
    featuresTitle: "Qué incluye Premium",
    checkoutError: "Error al abrir el checkout. Inténtalo de nuevo.",
    pizzaLine:
      "Por el precio de una pizza, desbloqueas una preparación más seria, constante y completa.",
    urgencyLine:
      "Muchos se detienen después de unos pocos quizzes. Los que siguen son los que llegan realmente preparados.",
    finalLine:
      "Quien aprueba no siempre es el más brillante. Muchas veces es quien no se detiene.",
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
    tableTitle: "Gratis vs Premium",
    tableFeature: "Función",
    tableFree: "Gratis",
    tablePremium: "Premium",
    tableRows: [
      { label: "Quizzes por día", free: "20", premium: "Ilimitados" },
      { label: "Explicaciones de respuestas", free: "❌", premium: "✅ Todas" },
      { label: "Modo examen real", free: "❌", premium: "✅" },
      { label: "Repaso de errores", free: "❌", premium: "✅" },
      { label: "Todas las certificaciones", free: "✅", premium: "✅" },
      { label: "Acceso multilingüe", free: "✅", premium: "✅" },
    ],
    guaranteeTitle: "Garantía de 7 días",
    guaranteeDesc:
      "Si en los primeros 7 días no estás satisfecho, te reembolsamos sin preguntas. Sin riesgos.",
    testimonialsTitle: "Quienes lo usan, lo recomiendan",
    testimonials: [
      {
        text: "Aprobé el CCNA al primer intento después de 3 semanas con CertifyQuiz. Las explicaciones Premium marcan la diferencia.",
        name: "Carlos M.",
        cert: "Cisco CCNA",
      },
      {
        text: "Por fin una plataforma seria para preparar el Security+. Los quizzes son realistas y las explicaciones me ayudaron a entender los conceptos.",
        name: "Ana P.",
        cert: "CompTIA Security+",
      },
      {
        text: "9,99€ al mes no es nada comparado con el coste del examen. Aprobé el CISSP y mereció totalmente la pena.",
        name: "David L.",
        cert: "CISSP",
      },
    ],
  },

  en: {
    badge: "PREMIUM",
    title: "Unlock CertifyQuiz Premium",
    subtitle:
      "Keep practicing without limits and prepare seriously for your exams with full explanations, exam mode, and error review.",
    priceLine: "€9.99/month • Cancel anytime",
    cta: "Unlock Premium – €9.99/month",
    ctaLoading: "Opening checkout...",
    subCta: "Instant access. No long-term commitment.",
    featuresTitle: "What Premium includes",
    checkoutError: "Error while opening checkout. Please try again.",
    pizzaLine:
      "For the price of a pizza, you unlock a more serious, consistent, and complete way to prepare.",
    urgencyLine:
      "Many people stop after a few quizzes. The ones who keep going are the ones who show up prepared.",
    finalLine:
      "The one who passes is not always the smartest. Often, it's the one who doesn't stop.",
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
    tableTitle: "Free vs Premium",
    tableFeature: "Feature",
    tableFree: "Free",
    tablePremium: "Premium",
    tableRows: [
      { label: "Quizzes per day", free: "20", premium: "Unlimited" },
      { label: "Answer explanations", free: "❌", premium: "✅ All" },
      { label: "Real exam mode", free: "❌", premium: "✅" },
      { label: "Error review", free: "❌", premium: "✅" },
      { label: "All certifications", free: "✅", premium: "✅" },
      { label: "Multilingual access", free: "✅", premium: "✅" },
    ],
    guaranteeTitle: "7-day money-back guarantee",
    guaranteeDesc:
      "If you're not satisfied within the first 7 days, we'll refund you — no questions asked. Zero risk.",
    testimonialsTitle: "Those who use it, recommend it",
    testimonials: [
      {
        text: "Passed the CCNA on my first attempt after 3 weeks of quizzes on CertifyQuiz. The Premium explanations make a real difference.",
        name: "Mark R.",
        cert: "Cisco CCNA",
      },
      {
        text: "Finally a serious platform for Security+ prep. The quizzes are realistic and the explanations helped me actually understand concepts, not just memorize.",
        name: "Sarah T.",
        cert: "CompTIA Security+",
      },
      {
        text: "€9.99 a month is nothing compared to the cost of the exam. Passed the CISSP and it was absolutely worth it.",
        name: "Luke M.",
        cert: "CISSP",
      },
    ],
  },

  fr: {
    badge: "PREMIUM",
    title: "Débloquez CertifyQuiz Premium",
    subtitle:
      "Continuez les quiz sans limite et préparez-vous sérieusement à vos examens avec des explications complètes, le mode examen et la révision des erreurs.",
    priceLine: "9,99€/mois • Annulez quand vous voulez",
    cta: "Débloquez Premium – 9,99€/mois",
    ctaLoading: "Ouverture du checkout...",
    subCta: "Accès immédiat. Sans engagement.",
    featuresTitle: "Ce que Premium inclut",
    checkoutError: "Erreur lors de l'ouverture du checkout. Réessayez.",
    pizzaLine:
      "Pour le prix d'une pizza, vous débloquez une préparation plus sérieuse, régulière et complète.",
    urgencyLine:
      "Beaucoup s'arrêtent après quelques quiz. Ceux qui continuent sont ceux qui arrivent vraiment préparés.",
    finalLine:
      "Celui qui réussit n'est pas toujours le plus fort. Souvent, c'est celui qui ne s'arrête pas.",
    features: [
      {
        h: "Explications complètes",
        p: "Débloquez toutes les explications pour vraiment comprendre vos erreurs au lieu de mémoriser les réponses.",
      },
      {
        h: "Mode examen réel",
        p: "Entraînez-vous dans des conditions plus proches de l'examen réel, avec une approche plus sérieuse.",
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
    tableTitle: "Gratuit vs Premium",
    tableFeature: "Fonctionnalité",
    tableFree: "Gratuit",
    tablePremium: "Premium",
    tableRows: [
      { label: "Quiz par jour", free: "20", premium: "Illimités" },
      { label: "Explications des réponses", free: "❌", premium: "✅ Toutes" },
      { label: "Mode examen réel", free: "❌", premium: "✅" },
      { label: "Révision des erreurs", free: "❌", premium: "✅" },
      { label: "Toutes les certifications", free: "✅", premium: "✅" },
      { label: "Accès multilingue", free: "✅", premium: "✅" },
    ],
    guaranteeTitle: "Garantie 7 jours",
    guaranteeDesc:
      "Si vous n'êtes pas satisfait dans les 7 premiers jours, nous vous remboursons sans poser de questions. Zéro risque.",
    testimonialsTitle: "Ceux qui l'utilisent le recommandent",
    testimonials: [
      {
        text: "J'ai réussi le CCNA du premier coup après 3 semaines de quiz sur CertifyQuiz. Les explications Premium font vraiment la différence.",
        name: "Marc R.",
        cert: "Cisco CCNA",
      },
      {
        text: "Enfin une plateforme sérieuse pour préparer le Security+. Les quiz sont réalistes et les explications m'ont aidé à vraiment comprendre.",
        name: "Sophie T.",
        cert: "CompTIA Security+",
      },
      {
        text: "9,99€ par mois, c'est rien comparé au coût de l'examen. J'ai réussi le CISSP et ça valait vraiment le coup.",
        name: "Lucas M.",
        cert: "CISSP",
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

function ComparisonTable({
  t,
  onCta,
  isLoading,
}: {
  t: CopyEntry;
  onCta: () => void;
  isLoading: boolean;
}) {
  return (
    <section className="mt-6 overflow-hidden rounded-2xl border border-gray-200">
      <div className="bg-gray-50 px-6 py-4 text-lg font-semibold text-gray-900">
        {t.tableTitle}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="px-6 py-3 text-left font-medium text-gray-600">
                {t.tableFeature}
              </th>
              <th className="px-6 py-3 text-center font-medium text-gray-600">
                {t.tableFree}
              </th>
              <th className="px-6 py-3 text-center font-semibold text-black">
                {t.tablePremium}
              </th>
            </tr>
          </thead>
          <tbody>
            {t.tableRows.map((row, i) => (
              <tr
                key={i}
                className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="px-6 py-3 text-gray-800">{row.label}</td>
                <td className="px-6 py-3 text-center text-gray-500">
                  {row.free}
                </td>
                <td className="px-6 py-3 text-center font-medium text-emerald-700">
                  {row.premium}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="border-t border-gray-200 px-6 py-4 text-center">
        <button
          type="button"
          onClick={onCta}
          disabled={isLoading}
          className="inline-flex items-center justify-center rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? t.ctaLoading : t.cta}
        </button>
      </div>
    </section>
  );
}

function Testimonials({ t }: { t: CopyEntry }) {
  return (
    <section className="mt-6">
      <div className="mb-4 text-lg font-semibold text-gray-900">
        {t.testimonialsTitle}
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {t.testimonials.map((item, i) => (
          <div
            key={i}
            className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <div className="mb-3 text-yellow-400">★★★★★</div>
            <p className="text-sm text-gray-700 italic">"{item.text}"</p>
            <div className="mt-4">
              <div className="text-sm font-semibold text-gray-900">
                {item.name}
              </div>
              <div className="text-xs text-gray-500">{item.cert}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Guarantee({ t }: { t: CopyEntry }) {
  return (
    <div className="mt-6 flex items-start gap-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
      <div className="text-3xl">🛡️</div>
      <div>
        <div className="text-base font-semibold text-emerald-900">
          {t.guaranteeTitle}
        </div>
        <p className="mt-1 text-sm text-emerald-800">{t.guaranteeDesc}</p>
      </div>
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

        {/* Hero */}
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

          <div className="mt-5 max-w-3xl rounded-2xl border border-amber-200 bg-amber-50 p-4">
            <p className="text-sm font-semibold text-amber-900 sm:text-base">
              {t.urgencyLine}
            </p>
            <p className="mt-2 text-sm text-amber-800 sm:text-base">
              {t.pizzaLine}
            </p>
          </div>
        </section>

        <div className="px-6 py-6">
          {/* Features + CTA */}
          <section className="grid gap-6 lg:grid-cols-2">
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
                <p className="mt-4 text-sm font-medium text-gray-900">
                  {t.finalLine}
                </p>
              </div>
            </div>

            <div>
              <div className="mb-3 text-lg font-semibold text-gray-900">
                {t.featuresTitle}
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <FeatureCard title={t.features[0].h} desc={t.features[0].p} variant="blue" />
                <FeatureCard title={t.features[1].h} desc={t.features[1].p} variant="purple" />
                <FeatureCard title={t.features[2].h} desc={t.features[2].p} variant="amber" />
                <FeatureCard title={t.features[3].h} desc={t.features[3].p} variant="green" />
              </div>
            </div>
          </section>

          {/* Tabella Free vs Premium */}
          <ComparisonTable t={t} onCta={startPremiumCheckout} isLoading={isLoading} />

          {/* Garanzia */}
          <Guarantee t={t} />

          {/* Testimonials */}
          <Testimonials t={t} />

          {/* CTA finale */}
          <div className="mt-8 rounded-2xl border border-gray-200 bg-gray-50 p-6 text-center">
            <p className="text-base font-semibold text-gray-900">{t.finalLine}</p>
            <button
              type="button"
              onClick={startPremiumCheckout}
              disabled={isLoading}
              className="mt-4 inline-flex items-center justify-center rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? t.ctaLoading : t.cta}
            </button>
            <p className="mt-2 text-xs text-gray-500">{t.subCta}</p>
          </div>
        </div>
      </div>
    </main>
  );
}
