// src/app/[lang]/(marketing)/_pricing/PricingPage.tsx
import Link from "next/link";
import StructuredData from "@/components/StructuredData";
import type { Locale } from "@/lib/paths";
import { quizHomePath, seoPrefix } from "@/lib/paths";

const labels = {
  h1: {
    it: "CertifyQuiz Premium",
    en: "CertifyQuiz Premium",
    fr: "CertifyQuiz Premium",
    es: "CertifyQuiz Premium",
  },
  subtitle: {
    it: "Tutto quello che ti serve per passare la certificazione.",
    en: "Everything you need to pass your certification.",
    fr: "Tout ce dont vous avez besoin pour réussir votre certification.",
    es: "Todo lo que necesitas para aprobar tu certificación.",
  },
  price: {
    it: "9,99 €",
    en: "€9.99",
    fr: "9,99 €",
    es: "9,99 €",
  },
  perMonth: {
    it: "/ mese",
    en: "/ month",
    fr: "/ mois",
    es: "/ mes",
  },
  cancelAnytime: {
    it: "Disdici quando vuoi",
    en: "Cancel anytime",
    fr: "Annulez quand vous voulez",
    es: "Cancela cuando quieras",
  },
  guarantee: {
    it: "Garanzia 7 giorni — rimborso senza domande",
    en: "7-day money-back guarantee — no questions asked",
    fr: "Garantie 7 jours — remboursement sans conditions",
    es: "Garantía 7 días — reembolso sin preguntas",
  },
  ctaPrimary: {
    it: "Sblocca Premium – 9,99€/mese",
    en: "Unlock Premium – €9.99/month",
    fr: "Débloquez Premium – 9,99€/mois",
    es: "Desbloquea Premium – 9,99€/mes",
  },
  featuresTitle: {
    it: "Cosa include Premium",
    en: "What Premium includes",
    fr: "Ce que Premium inclut",
    es: "Qué incluye Premium",
  },
  features: {
    it: [
      { title: "Quiz illimitati", desc: "Nessun limite giornaliero. Studia quanto vuoi, quando vuoi." },
      { title: "Spiegazioni complete", desc: "Ogni domanda ha una spiegazione dettagliata per capire davvero gli errori." },
      { title: "Modalità esame reale", desc: "Simulazioni con timer e punteggio finale, come l'esame ufficiale." },
      { title: "Ripasso errori", desc: "Concentrati sui punti deboli invece di ricominciare ogni volta da zero." },
      { title: "Tutte le certificazioni", desc: "AWS, Cisco, CompTIA, ISC2, Microsoft e molto altro." },
      { title: "Accesso multilingua", desc: "Italiano, inglese, francese e spagnolo." },
    ],
    en: [
      { title: "Unlimited quizzes", desc: "No daily limit. Study as much as you want, whenever you want." },
      { title: "Full explanations", desc: "Every question has a detailed explanation so you truly understand your mistakes." },
      { title: "Real exam mode", desc: "Timed simulations with a final score, just like the official exam." },
      { title: "Error review", desc: "Focus on weak spots instead of starting over every time." },
      { title: "All certifications", desc: "AWS, Cisco, CompTIA, ISC2, Microsoft and much more." },
      { title: "Multilingual access", desc: "Italian, English, French and Spanish." },
    ],
    fr: [
      { title: "Quiz illimités", desc: "Aucune limite journalière. Étudiez autant que vous voulez, quand vous voulez." },
      { title: "Explications complètes", desc: "Chaque question a une explication détaillée pour vraiment comprendre vos erreurs." },
      { title: "Mode examen réel", desc: "Simulations chronométrées avec score final, comme l'examen officiel." },
      { title: "Révision des erreurs", desc: "Concentrez-vous sur vos points faibles plutôt que de recommencer à zéro." },
      { title: "Toutes les certifications", desc: "AWS, Cisco, CompTIA, ISC2, Microsoft et bien plus." },
      { title: "Accès multilingue", desc: "Italien, anglais, français et espagnol." },
    ],
    es: [
      { title: "Quizzes ilimitados", desc: "Sin límite diario. Estudia cuanto quieras, cuando quieras." },
      { title: "Explicaciones completas", desc: "Cada pregunta tiene una explicación detallada para entender de verdad tus errores." },
      { title: "Modo examen real", desc: "Simulaciones con temporizador y puntuación final, como el examen oficial." },
      { title: "Repaso de errores", desc: "Céntrate en tus puntos débiles en lugar de empezar desde cero cada vez." },
      { title: "Todas las certificaciones", desc: "AWS, Cisco, CompTIA, ISC2, Microsoft y mucho más." },
      { title: "Acceso multilingüe", desc: "Italiano, inglés, francés y español." },
    ],
  },
  tableTitle: {
    it: "Free vs Premium",
    en: "Free vs Premium",
    fr: "Gratuit vs Premium",
    es: "Gratis vs Premium",
  },
  tableRows: {
    it: [
      { label: "Quiz al giorno", free: "20", premium: "Illimitati" },
      { label: "Spiegazioni risposte", free: "❌", premium: "✅ Tutte" },
      { label: "Modalità esame reale", free: "❌", premium: "✅" },
      { label: "Ripasso errori", free: "❌", premium: "✅" },
      { label: "Tutte le certificazioni", free: "✅", premium: "✅" },
      { label: "Accesso multilingua", free: "✅", premium: "✅" },
    ],
    en: [
      { label: "Quizzes per day", free: "20", premium: "Unlimited" },
      { label: "Answer explanations", free: "❌", premium: "✅ All" },
      { label: "Real exam mode", free: "❌", premium: "✅" },
      { label: "Error review", free: "❌", premium: "✅" },
      { label: "All certifications", free: "✅", premium: "✅" },
      { label: "Multilingual access", free: "✅", premium: "✅" },
    ],
    fr: [
      { label: "Quiz par jour", free: "20", premium: "Illimités" },
      { label: "Explications", free: "❌", premium: "✅ Toutes" },
      { label: "Mode examen réel", free: "❌", premium: "✅" },
      { label: "Révision des erreurs", free: "❌", premium: "✅" },
      { label: "Toutes les certifications", free: "✅", premium: "✅" },
      { label: "Accès multilingue", free: "✅", premium: "✅" },
    ],
    es: [
      { label: "Quizzes por día", free: "20", premium: "Ilimitados" },
      { label: "Explicaciones", free: "❌", premium: "✅ Todas" },
      { label: "Modo examen real", free: "❌", premium: "✅" },
      { label: "Repaso de errores", free: "❌", premium: "✅" },
      { label: "Todas las certificaciones", free: "✅", premium: "✅" },
      { label: "Acceso multilingüe", free: "✅", premium: "✅" },
    ],
  },
  faqTitle: {
    it: "Domande frequenti",
    en: "Frequently asked questions",
    fr: "Questions fréquentes",
    es: "Preguntas frecuentes",
  },
  ctaBottom: {
    it: "Sblocca Premium",
    en: "Unlock Premium",
    fr: "Débloquer Premium",
    es: "Desbloquear Premium",
  },
  ctaFree: {
    it: "Continua gratis",
    en: "Continue for free",
    fr: "Continuer gratuitement",
    es: "Continuar gratis",
  },
} as const;

function T(map: Record<Locale, string>, lang: Locale): string {
  return map[lang] ?? map.en;
}

const pricingPath = (lang: Locale) => {
  if (lang === "it") return "/it/prezzi";
  if (lang === "fr") return "/fr/prix";
  if (lang === "es") return "/es/precios";
  return "/pricing";
};

export default function PricingPage({ lang }: { lang: Locale }) {
  const faq =
    lang === "it" ? [
      { q: "Posso disdire quando voglio?", a: "Sì, puoi annullare in qualsiasi momento dal tuo profilo. Non ci sono vincoli o penali." },
      { q: "C'è una garanzia soddisfatti o rimborsati?", a: "Sì. Se nei primi 7 giorni non sei soddisfatto, ti rimborsiamo senza fare domande." },
      { q: "Cosa succede alle mie domande gratuite?", a: "Con Premium non hai più limiti. Puoi fare tutti i quiz che vuoi ogni giorno." },
      { q: "Il prezzo cambierà in futuro?", a: "Il prezzo attuale è bloccato per chi si abbona ora. Gli abbonati esistenti non subiscono variazioni di prezzo." },
    ] : lang === "fr" ? [
      { q: "Puis-je annuler à tout moment ?", a: "Oui, vous pouvez annuler à tout moment depuis votre profil. Aucun engagement ni pénalité." },
      { q: "Y a-t-il une garantie satisfait ou remboursé ?", a: "Oui. Si dans les 7 premiers jours vous n'êtes pas satisfait, nous vous remboursons sans poser de questions." },
      { q: "Que devient ma limite de questions gratuites ?", a: "Avec Premium, il n'y a plus de limite. Vous pouvez faire autant de quiz que vous voulez chaque jour." },
      { q: "Le prix changera-t-il à l'avenir ?", a: "Le prix actuel est garanti pour les abonnés actuels. Les abonnés existants ne subiront aucune variation de prix." },
    ] : lang === "es" ? [
      { q: "¿Puedo cancelar cuando quiera?", a: "Sí, puedes cancelar en cualquier momento desde tu perfil. Sin compromisos ni penalizaciones." },
      { q: "¿Hay garantía de devolución?", a: "Sí. Si en los primeros 7 días no estás satisfecho, te reembolsamos sin preguntas." },
      { q: "¿Qué pasa con mis preguntas gratuitas?", a: "Con Premium no hay límites. Puedes hacer todos los quizzes que quieras cada día." },
      { q: "¿Cambiará el precio en el futuro?", a: "El precio actual está garantizado para quienes se suscriban ahora. Los suscriptores existentes no verán cambios de precio." },
    ] : [
      { q: "Can I cancel anytime?", a: "Yes, you can cancel at any time from your profile. No commitments or penalties." },
      { q: "Is there a money-back guarantee?", a: "Yes. If you're not satisfied within the first 7 days, we'll refund you — no questions asked." },
      { q: "What happens to my free question limit?", a: "With Premium there's no limit. You can do as many quizzes as you want every day." },
      { q: "Will the price change in the future?", a: "The current price is locked in for anyone who subscribes now. Existing subscribers won't see price changes." },
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

  const checkoutHref = `${seoPrefix(lang)}/premium`;
  const quizzesHref = quizHomePath(lang);

  return (
    <>
      <StructuredData id="ld-pricing-faq" data={faqLd} />

      <main id="main" className="mx-auto max-w-4xl px-4 py-10">

        {/* Header */}
        <header className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            {T(labels.h1, lang)}
          </h1>
          <p className="mt-2 text-base text-gray-600">
            {T(labels.subtitle, lang)}
          </p>
        </header>

        {/* Piano unico */}
        <section className="mb-10">
          <div className="mx-auto max-w-sm rounded-2xl border-2 border-gray-900 bg-white p-6 shadow-lg text-center">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-gray-900 px-3 py-1 text-xs font-semibold text-white">
              ✦ Premium
            </div>
            <div className="mt-2 text-5xl font-bold text-gray-900">
              {T(labels.price, lang)}
              <span className="text-lg font-normal text-gray-500">
                {T(labels.perMonth, lang)}
              </span>
            </div>
            <p className="mt-1 text-xs text-gray-400">{T(labels.cancelAnytime, lang)}</p>

            <Link
              href={checkoutHref}
              className="mt-5 flex w-full items-center justify-center rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            >
              {T(labels.ctaPrimary, lang)}
            </Link>

            <p className="mt-3 text-xs text-gray-400">{T(labels.guarantee, lang)}</p>
          </div>
        </section>

        {/* Features */}
        <section className="mb-10">
          <h2 className="mb-5 text-center text-lg font-semibold text-gray-900">
            {T(labels.featuresTitle, lang)}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {labels.features[lang].map((f) => (
              <div key={f.title} className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                <div className="mb-1 text-sm font-semibold text-gray-900">✓ {f.title}</div>
                <div className="text-xs text-gray-600">{f.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Tabella Free vs Premium */}
        <section className="mb-10 overflow-hidden rounded-2xl border border-gray-200">
          <div className="bg-gray-50 px-5 py-3 text-sm font-semibold text-gray-900">
            {T(labels.tableTitle, lang)}
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-5 py-3 text-left font-medium text-gray-500">
                  {lang === "it" ? "Funzionalità" : lang === "fr" ? "Fonctionnalité" : lang === "es" ? "Función" : "Feature"}
                </th>
                <th className="px-5 py-3 text-center font-medium text-gray-400">
                  {lang === "it" ? "Gratis" : lang === "fr" ? "Gratuit" : lang === "es" ? "Gratis" : "Free"}
                </th>
                <th className="px-5 py-3 text-center font-semibold text-gray-900">Premium</th>
              </tr>
            </thead>
            <tbody>
              {labels.tableRows[lang].map((row, i) => (
                <tr key={row.label} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="px-5 py-3 text-gray-700">{row.label}</td>
                  <td className="px-5 py-3 text-center text-gray-400">{row.free}</td>
                  <td className="px-5 py-3 text-center font-medium text-emerald-700">{row.premium}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* FAQ */}
        <section className="mb-10">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            {T(labels.faqTitle, lang)}
          </h2>
          <div className="space-y-3">
            {faq.map((item, i) => (
              <details key={i} className="rounded-xl border border-gray-200 bg-white p-4 text-sm">
                <summary className="cursor-pointer font-semibold text-gray-900">
                  {item.q}
                </summary>
                <p className="mt-2 text-gray-600">{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* CTA finale */}
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href={checkoutHref}
            className="rounded-xl bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
          >
            {T(labels.ctaBottom, lang)}
          </Link>
          <Link
            href={quizzesHref}
            className="rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            {T(labels.ctaFree, lang)}
          </Link>
        </div>

      </main>
    </>
  );
}