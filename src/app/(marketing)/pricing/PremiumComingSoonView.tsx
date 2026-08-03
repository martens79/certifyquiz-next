// src/app/(marketing)/pricing/PremiumComingSoonView.tsx
"use client";

import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { authFetch } from "@/lib/auth";
import { useAuth } from "@/components/auth/AuthProvider";
import { trackMetaPixel, PREMIUM_PLAN_VALUES } from "@/lib/metaPixel";
import { analyticsUserStateFrom, trackEvent, trackEventOnce, trackFunnelEvent } from "@/lib/analytics";

type Lang = "it" | "es" | "en" | "fr";
type Plan = "premium_monthly" | "premium_quarterly" | "premium_annual";

type Props = {
  forceLang?: Lang;
};

type FeatureItem = {
  h: string;
  p: string;
};

type PlanOption = {
  id: Plan;
  label: string;
  price: string;
  perMonth: string;
  badge?: string;
  trialBadge?: string;
  popular?: boolean;
};

type CopyEntry = {
  badge: string;
  // Framing per perdita
  title: string;
  subtitle: string;
  lossPoints: string[];
  // Prova sociale (placeholder — vedi TODO-SOCIAL-PROOF)
  socialProofLine: string;
  plans: PlanOption[];
  cta: string;
  ctaLoading: string;
  subCta: string;
  subCtaMonthly: string;
  trialNote: string;
  featuresTitle: string;
  checkoutError: string;
  pizzaLine: string;
  urgencyLine: string;
  finalLine: string;
  features: FeatureItem[];
  tableTitle: string;
  tableFeature: string;
  tableFree: string;
  tablePremium: string;
  tableRows: { label: string; free: string; premium: string }[];
  guaranteeTitle: string;
  guaranteeDesc: string;
  faqTitle: string;
  faqs: { question: string; answer: string }[];
  popularLabel: string;
  explanationsUsedTemplate: string;
  testimonialsTitle: string;
  testimonials: { text: string; name: string; cert: string }[];
  businessBannerTitle: string;
  businessBannerBody: string;
  businessBannerCta: string;
};

function getLangFromPathname(pathname: string | null): Lang {
  const seg = (pathname?.split("/")[1] || "").toLowerCase();
  if (seg === "it" || seg === "es" || seg === "en" || seg === "fr") {
    return seg as Lang;
  }
  return "en";
}

// Prezzo annuale reale su Stripe: 59,90€ (verificato su dashboard il 2026-07-27).
// Risparmio calcolato su 9,99 × 12 = 119,88 → (119,88 - 59,90) / 119,88 = 50,03% ≈ 50%.
// Equivalente mensile: 59,90 / 12 = 4,9917 → 4,99€/mese.
const COPY: Record<Lang, CopyEntry> = {
  it: {
    badge: "PREMIUM",
    title: "Trasforma ogni errore in una preparazione più efficace per il tuo esame",
    subtitle:
      "Premium riunisce spiegazioni complete, ripasso degli errori, guide, mappe e simulazioni per aiutarti a capire cosa migliorare.",
    lossPoints: [
      "Spiegazioni dettagliate per capire ogni errore",
      "Guide PDF e mappe concettuali complete incluse",
      "Ripasso mirato delle risposte sbagliate",
      "Simulazioni e Tutor AI senza i limiti del piano Free",
    ],
    // TODO-SOCIAL-PROOF: sostituire con il numero reale di utenti attivi
    socialProofLine: "[TODO: numero utenti reali] persone si stanno preparando con CertifyQuiz",
    plans: [
      { id: "premium_monthly", label: "Mensile", price: "9,99€", perMonth: "9,99€/mese", trialBadge: "7gg gratis" },
      { id: "premium_annual", label: "Annuale", price: "59,90€", perMonth: "Pagamento unico per 12 mesi", badge: "Risparmi il 50%", popular: true },
    ],
    cta: "Inizia Premium",
    ctaLoading: "Apertura checkout...",
    subCta: "59,90€ addebitati oggi in un unico pagamento per 12 mesi",
    subCtaMonthly: "7 giorni gratis · Nessun addebito ora · Disdici quando vuoi",
    trialNote: "Prova gratis per 7 giorni, poi 9,99€/mese.",
    featuresTitle: "Cosa include Premium",
    checkoutError: "Errore durante l'apertura del checkout. Riprova.",
    pizzaLine: "Scegli il mensile per provare senza addebito per 7 giorni, oppure risparmia il 50% con l'annuale.",
    urgencyLine: "Tutti gli strumenti Premium lavorano insieme: pratica, comprensione degli errori e ripasso mirato.",
    finalLine: "Scegli il piano più adatto al tempo che ti separa dall'esame.",
    popularLabel: "Più popolare",
    features: [
      { h: "Spiegazioni complete", p: "Sblocca tutte le spiegazioni per capire davvero gli errori e non limitarti a memorizzare." },
      { h: "Modalità esame reale", p: "Allenati in modo più vicino all'esperienza d'esame, con un approccio più serio e focalizzato." },
      { h: "Ripasso errori", p: "Rivedi le domande sbagliate e concentrati sui punti deboli invece di ripartire ogni volta da zero." },
      { h: "Guide e mappe incluse", p: "Usa le risorse complete della tua certificazione per ripassare i concetti tra una sessione e l'altra." },
    ],
    tableTitle: "Free vs Premium",
    tableFeature: "Funzionalità",
    tableFree: "Gratis",
    tablePremium: "Premium",
    tableRows: [
      { label: "Spiegazioni errori", free: "10 gratuite", premium: "✅ Illimitate" },
      { label: "Modalità esame reale", free: "❌", premium: "✅" },
      { label: "Ripasso errori", free: "❌", premium: "✅" },
      { label: "Guide PDF", free: "Anteprima gratuita", premium: "✅ Incluse" },
      { label: "Mappe concettuali", free: "Anteprima gratuita", premium: "✅ Incluse" },
      { label: "Scenari d'esame", free: "Alcuni scenari", premium: "✅ Tutti inclusi" },
      { label: "AI Tutor", free: "Limitato", premium: "✅ Illimitato" },
    ],
    guaranteeTitle: "Prezzi chiari, checkout sicuro",
    guaranteeDesc: "Mensile: 7 giorni gratis e nessun addebito oggi. Annuale: 59,90€ addebitati oggi per 12 mesi. Puoi gestire l'abbonamento online.",
    faqTitle: "Domande prima di iniziare",
    faqs: [
      { question: "Quando viene effettuato l'addebito?", answer: "Con il mensile non paghi nulla oggi: l'addebito di 9,99€ avviene dopo i 7 giorni gratuiti. Con l'annuale paghi 59,90€ oggi per 12 mesi." },
      { question: "Come posso annullare?", answer: "Puoi gestire o annullare l'abbonamento online dal tuo profilo." },
      { question: "Cosa succede dopo la prova gratuita?", answer: "Se non annulli, il piano mensile si rinnova a 9,99€ al mese. La prova gratuita è disponibile solo sul mensile." },
      { question: "Premium vale per tutte le certificazioni?", answer: "Sì. Premium sblocca le risorse Premium disponibili nel catalogo, non una sola certificazione." },
    ],
    explanationsUsedTemplate: "Hai già usato {used} delle tue {limit} spiegazioni gratuite.",
    testimonialsTitle: "Chi lo usa, lo consiglia",
    testimonials: [
      // TODO-SOCIAL-PROOF: sostituire con una recensione reale
      { text: "[TODO: testimonial reale]", name: "[TODO: nome reale]", cert: "[TODO: certificazione reale]" },
      { text: "[TODO: testimonial reale]", name: "[TODO: nome reale]", cert: "[TODO: certificazione reale]" },
      { text: "[TODO: testimonial reale]", name: "[TODO: nome reale]", cert: "[TODO: certificazione reale]" },
    ],
    businessBannerTitle: "Stai cercando un piano per il tuo team?",
    businessBannerBody: "Se gestisci un team IT, dai un'occhiata ai piani aziendali: dashboard di progresso condivisa per tutto il team e fattura unica.",
    businessBannerCta: "Scopri i piani aziendali",
  },

  es: {
    badge: "PREMIUM",
    title: "Convierte cada error en una preparación más eficaz para tu examen",
    subtitle:
      "Premium reúne explicaciones completas, repaso de errores, guías, mapas y simulaciones para ayudarte a saber qué mejorar.",
    lossPoints: [
      "Explicaciones detalladas para entender cada error",
      "Guías PDF y mapas conceptuales completos incluidos",
      "Repaso específico de las respuestas incorrectas",
      "Simulaciones y Tutor AI sin los límites del plan Free",
    ],
    // TODO-SOCIAL-PROOF: sustituir por el número real de usuarios activos
    socialProofLine: "[TODO: número real de usuarios] personas se están preparando con CertifyQuiz",
    plans: [
      { id: "premium_monthly", label: "Mensual", price: "9,99€", perMonth: "9,99€/mes", trialBadge: "7 días gratis" },
      { id: "premium_annual", label: "Anual", price: "59,90€", perMonth: "Pago único por 12 meses", badge: "Ahorra el 50%", popular: true },
    ],
    cta: "Empezar Premium",
    ctaLoading: "Abriendo checkout...",
    subCta: "59,90€ cobrados hoy en un único pago por 12 meses",
    subCtaMonthly: "7 días gratis · Sin cargo ahora · Cancela cuando quieras",
    trialNote: "Prueba gratis 7 días, luego 9,99€/mes.",
    featuresTitle: "Qué incluye Premium",
    checkoutError: "Error al abrir el checkout. Inténtalo de nuevo.",
    pizzaLine: "Elige el plan mensual para probar 7 días sin cargo o ahorra un 50% con el anual.",
    urgencyLine: "Todas las herramientas Premium trabajan juntas: práctica, comprensión de errores y repaso específico.",
    finalLine: "Elige el plan que mejor se adapta al tiempo que falta para tu examen.",
    popularLabel: "Más popular",
    features: [
      { h: "Explicaciones completas", p: "Desbloquea todas las explicaciones para entender de verdad tus errores y no solo memorizar." },
      { h: "Modo examen real", p: "Entrena de una forma más cercana a la experiencia real del examen, con un enfoque más serio." },
      { h: "Repaso de errores", p: "Revisa tus fallos y céntrate en tus puntos débiles en lugar de empezar siempre desde cero." },
      { h: "Guías y mapas incluidos", p: "Usa todos los recursos de tu certificación para repasar entre sesiones." },
    ],
    tableTitle: "Gratis vs Premium",
    tableFeature: "Función",
    tableFree: "Gratis",
    tablePremium: "Premium",
    tableRows: [
      { label: "Explicaciones de errores", free: "10 gratuitas", premium: "✅ Ilimitadas" },
      { label: "Modo examen real", free: "❌", premium: "✅" },
      { label: "Repaso de errores", free: "❌", premium: "✅" },
      { label: "Guías PDF", free: "Vista previa gratuita", premium: "✅ Incluidas" },
      { label: "Mapas conceptuales", free: "Vista previa gratuita", premium: "✅ Incluidos" },
      { label: "Escenarios de examen", free: "Algunos escenarios", premium: "✅ Todos incluidos" },
      { label: "AI Tutor", free: "Limitado", premium: "✅ Ilimitado" },
    ],
    guaranteeTitle: "Precios claros y checkout seguro",
    guaranteeDesc: "Mensual: 7 días gratis y ningún cargo hoy. Anual: 59,90€ cobrados hoy por 12 meses. Puedes gestionar la suscripción online.",
    faqTitle: "Preguntas antes de empezar",
    faqs: [
      { question: "¿Cuándo se realiza el cobro?", answer: "Con el mensual no pagas nada hoy: el cobro de 9,99€ se realiza después de los 7 días gratis. Con el anual pagas 59,90€ hoy por 12 meses." },
      { question: "¿Cómo puedo cancelar?", answer: "Puedes gestionar o cancelar la suscripción online desde tu perfil." },
      { question: "¿Qué ocurre después de la prueba?", answer: "Si no cancelas, el plan mensual se renueva a 9,99€ al mes. La prueba gratuita solo está disponible con el mensual." },
      { question: "¿Premium sirve para todas las certificaciones?", answer: "Sí. Premium desbloquea los recursos Premium disponibles en todo el catálogo." },
    ],
    explanationsUsedTemplate: "Ya has usado {used} de tus {limit} explicaciones gratuitas.",
    testimonialsTitle: "Quienes lo usan, lo recomiendan",
    testimonials: [
      // TODO-SOCIAL-PROOF: sustituir por una reseña real
      { text: "[TODO: testimonio real]", name: "[TODO: nombre real]", cert: "[TODO: certificación real]" },
      { text: "[TODO: testimonio real]", name: "[TODO: nombre real]", cert: "[TODO: certificación real]" },
      { text: "[TODO: testimonio real]", name: "[TODO: nombre real]", cert: "[TODO: certificación real]" },
    ],
    businessBannerTitle: "¿Buscas un plan para tu equipo?",
    businessBannerBody: "Si gestionas un equipo IT, descubre nuestros planes para empresas: panel de progreso compartido para todo el equipo y factura única.",
    businessBannerCta: "Ver planes para empresas",
  },

  en: {
    badge: "PREMIUM",
    title: "Turn every mistake into more effective exam preparation",
    subtitle:
      "Premium brings full explanations, mistake review, guides, maps, and simulations together so you know exactly what to improve.",
    lossPoints: [
      "Detailed explanations to understand every mistake",
      "Complete PDF guides and concept maps included",
      "Focused review of your incorrect answers",
      "Simulations and AI Tutor without Free-plan limits",
    ],
    // TODO-SOCIAL-PROOF: replace with the real number of active users
    socialProofLine: "[TODO: real user count] people are preparing with CertifyQuiz",
    plans: [
      { id: "premium_monthly", label: "Monthly", price: "€9.99", perMonth: "€9.99/month", trialBadge: "7 days free" },
      { id: "premium_annual", label: "Annual", price: "€59.90", perMonth: "One payment for 12 months", badge: "Save 50%", popular: true },
    ],
    cta: "Start Premium",
    ctaLoading: "Opening checkout...",
    subCta: "€59.90 charged today as one payment for 12 months",
    subCtaMonthly: "7 days free · No charge today · Cancel anytime",
    trialNote: "Try free for 7 days, then €9.99/month.",
    featuresTitle: "What Premium includes",
    checkoutError: "Error while opening checkout. Please try again.",
    pizzaLine: "Choose monthly to try Premium for 7 days with no charge, or save 50% with annual.",
    urgencyLine: "Every Premium tool works together: practice, mistake understanding, and focused review.",
    finalLine: "Choose the plan that best fits the time left before your exam.",
    popularLabel: "Most popular",
    features: [
      { h: "Full explanations", p: "Unlock every explanation so you can actually understand mistakes instead of just memorizing answers." },
      { h: "Real exam mode", p: "Practice in a way that feels closer to the real exam experience, with a more focused approach." },
      { h: "Error review", p: "Go back over your incorrect answers and focus on weak areas instead of restarting blindly." },
      { h: "Guides and maps included", p: "Use the complete resources for your certification to review concepts between practice sessions." },
    ],
    tableTitle: "Free vs Premium",
    tableFeature: "Feature",
    tableFree: "Free",
    tablePremium: "Premium",
    tableRows: [
      { label: "Wrong answer explanations", free: "10 free", premium: "✅ Unlimited" },
      { label: "Real exam mode", free: "❌", premium: "✅" },
      { label: "Error review", free: "❌", premium: "✅" },
      { label: "PDF guides", free: "Free preview", premium: "✅ Included" },
      { label: "Concept maps", free: "Free preview", premium: "✅ Included" },
      { label: "Exam scenarios", free: "Some scenarios", premium: "✅ All included" },
      { label: "AI Tutor", free: "Limited", premium: "✅ Unlimited" },
    ],
    guaranteeTitle: "Clear pricing and secure checkout",
    guaranteeDesc: "Monthly: 7 days free and no charge today. Annual: €59.90 charged today for 12 months. Manage your subscription online.",
    faqTitle: "Questions before you start",
    faqs: [
      { question: "When will I be charged?", answer: "With monthly, you pay nothing today: the €9.99 charge starts after the 7-day free trial. With annual, €59.90 is charged today for 12 months." },
      { question: "How do I cancel?", answer: "You can manage or cancel your subscription online from your profile." },
      { question: "What happens after the free trial?", answer: "Unless you cancel, monthly renews at €9.99 per month. The free trial is available on monthly only." },
      { question: "Does Premium cover every certification?", answer: "Yes. Premium unlocks the Premium resources available across the catalog, not just one certification." },
    ],
    explanationsUsedTemplate: "You've already used {used} of your {limit} free explanations.",
    testimonialsTitle: "Those who use it, recommend it",
    testimonials: [
      // TODO-SOCIAL-PROOF: replace with a real testimonial
      { text: "[TODO: real testimonial]", name: "[TODO: real name]", cert: "[TODO: real certification]" },
      { text: "[TODO: real testimonial]", name: "[TODO: real name]", cert: "[TODO: real certification]" },
      { text: "[TODO: real testimonial]", name: "[TODO: real name]", cert: "[TODO: real certification]" },
    ],
    businessBannerTitle: "Looking for a plan for your team?",
    businessBannerBody: "If you manage an IT team, check out our business plans: a shared progress dashboard for the whole team and a single company invoice.",
    businessBannerCta: "See business plans",
  },

  fr: {
    badge: "PREMIUM",
    title: "Transformez chaque erreur en une préparation plus efficace à votre examen",
    subtitle:
      "Premium réunit explications complètes, révision des erreurs, guides, cartes et simulations pour vous aider à progresser.",
    lossPoints: [
      "Explications détaillées pour comprendre chaque erreur",
      "Guides PDF et cartes conceptuelles complètes inclus",
      "Révision ciblée de vos réponses incorrectes",
      "Simulations et Tutor IA sans les limites du plan gratuit",
    ],
    // TODO-SOCIAL-PROOF: remplacer par le nombre réel d'utilisateurs actifs
    socialProofLine: "[TODO : nombre réel d'utilisateurs] personnes se préparent avec CertifyQuiz",
    plans: [
      { id: "premium_monthly", label: "Mensuel", price: "9,99€", perMonth: "9,99€/mois", trialBadge: "7j gratuits" },
      { id: "premium_annual", label: "Annuel", price: "59,90€", perMonth: "Paiement unique pour 12 mois", badge: "Économisez 50%", popular: true },
    ],
    cta: "Commencer Premium",
    ctaLoading: "Ouverture du checkout...",
    subCta: "59,90€ débités aujourd'hui en un paiement unique pour 12 mois",
    subCtaMonthly: "7 jours gratuits · Aucun débit aujourd'hui · Annulez quand vous voulez",
    trialNote: "Essayez gratuitement 7 jours, puis 9,99€/mois.",
    featuresTitle: "Ce que Premium inclut",
    checkoutError: "Erreur lors de l'ouverture du checkout. Réessayez.",
    pizzaLine: "Choisissez le mensuel pour essayer 7 jours sans débit, ou économisez 50% avec l'annuel.",
    urgencyLine: "Tous les outils Premium fonctionnent ensemble : pratique, compréhension des erreurs et révision ciblée.",
    finalLine: "Choisissez l'offre adaptée au temps qu'il vous reste avant l'examen.",
    popularLabel: "Le plus populaire",
    features: [
      { h: "Explications complètes", p: "Débloquez toutes les explications pour vraiment comprendre vos erreurs." },
      { h: "Mode examen réel", p: "Entraînez-vous dans des conditions plus proches de l'examen réel." },
      { h: "Révision des erreurs", p: "Revenez sur vos erreurs et concentrez-vous sur vos points faibles." },
      { h: "Guides et cartes inclus", p: "Utilisez toutes les ressources de votre certification pour réviser entre les sessions." },
    ],
    tableTitle: "Gratuit vs Premium",
    tableFeature: "Fonctionnalité",
    tableFree: "Gratuit",
    tablePremium: "Premium",
    tableRows: [
      { label: "Explications des erreurs", free: "10 gratuites", premium: "✅ Illimitées" },
      { label: "Mode examen réel", free: "❌", premium: "✅" },
      { label: "Révision des erreurs", free: "❌", premium: "✅" },
      { label: "Guides PDF", free: "Aperçu gratuit", premium: "✅ Inclus" },
      { label: "Cartes conceptuelles", free: "Aperçu gratuit", premium: "✅ Incluses" },
      { label: "Scénarios d'examen", free: "Quelques scénarios", premium: "✅ Tous inclus" },
      { label: "AI Tutor", free: "Limité", premium: "✅ Illimité" },
    ],
    guaranteeTitle: "Tarifs clairs et paiement sécurisé",
    guaranteeDesc: "Mensuel : 7 jours gratuits sans débit aujourd'hui. Annuel : 59,90€ débités aujourd'hui pour 12 mois. Gérez votre abonnement en ligne.",
    faqTitle: "Questions avant de commencer",
    faqs: [
      { question: "Quand serai-je débité ?", answer: "Avec le mensuel, vous ne payez rien aujourd'hui : le débit de 9,99€ intervient après les 7 jours gratuits. Avec l'annuel, 59,90€ sont débités aujourd'hui pour 12 mois." },
      { question: "Comment annuler ?", answer: "Vous pouvez gérer ou annuler votre abonnement en ligne depuis votre profil." },
      { question: "Que se passe-t-il après l'essai ?", answer: "Sans annulation, le mensuel est renouvelé à 9,99€ par mois. L'essai gratuit est réservé au mensuel." },
      { question: "Premium couvre-t-il toutes les certifications ?", answer: "Oui. Premium débloque les ressources Premium disponibles dans tout le catalogue." },
    ],
    explanationsUsedTemplate: "Vous avez déjà utilisé {used} de vos {limit} explications gratuites.",
    testimonialsTitle: "Ceux qui l'utilisent le recommandent",
    testimonials: [
      // TODO-SOCIAL-PROOF: remplacer par un témoignage réel
      { text: "[TODO : témoignage réel]", name: "[TODO : nom réel]", cert: "[TODO : certification réelle]" },
      { text: "[TODO : témoignage réel]", name: "[TODO : nom réel]", cert: "[TODO : certification réelle]" },
      { text: "[TODO : témoignage réel]", name: "[TODO : nom réel]", cert: "[TODO : certification réelle]" },
    ],
    businessBannerTitle: "Vous cherchez une offre pour votre équipe ?",
    businessBannerBody: "Si vous gérez une équipe IT, découvrez nos offres entreprises : tableau de bord de progression partagé pour toute l'équipe et facture unique.",
    businessBannerCta: "Découvrir les offres entreprises",
  },
};

const BUSINESS_HREF: Record<Lang, string> = {
  en: "/business",
  it: "/it/aziende",
  fr: "/fr/entreprises",
  es: "/es/empresas",
};

// ── Componenti interni ──────────────────────────────────────────

function PlanSelector({
  plans,
  selected,
  onChange,
  popularLabel,
}: {
  plans: PlanOption[];
  selected: Plan;
  onChange: (p: Plan) => void;
  popularLabel: string;
}) {
  return (
    <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
      {plans.map((plan) => {
        const isSelected = plan.id === selected;
        const activeBadge = plan.trialBadge ?? plan.badge;
        return (
          <div key={plan.id} className="relative">
            {/* Badge "Più popolare" sopra la card — solo annuale */}
            {plan.popular && (
              <div className="absolute -top-3 left-0 right-0 flex justify-center">
                <span className="rounded-full bg-emerald-500 px-2.5 py-0.5 text-[10px] font-bold text-white whitespace-nowrap">
                  ⭐ {popularLabel}
                </span>
              </div>
            )}
            <button
              type="button"
              onClick={() => onChange(plan.id)}
              aria-pressed={isSelected}
              className={`relative w-full rounded-2xl border-2 p-4 text-left transition ${
                plan.popular && !isSelected
                  ? "border-emerald-400 bg-white text-gray-900 hover:border-emerald-500"
                  : isSelected
                  ? "border-black bg-black text-white"
                  : "border-gray-200 bg-white text-gray-900 hover:border-gray-400"
              } ${plan.popular ? "pt-5" : ""}`}
            >
              {activeBadge && (
                <span className={`absolute -top-2.5 left-3 rounded-full px-2 py-0.5 text-xs font-semibold ${
                  plan.trialBadge
                    ? isSelected ? "bg-emerald-400 text-white" : "bg-emerald-500 text-white"
                    : isSelected ? "bg-white text-black" : "bg-black text-white"
                }`}>
                  {activeBadge}
                </span>
              )}
              <div className="text-sm font-semibold">{plan.label}</div>
              <div className="mt-1 text-lg font-bold">{plan.price}</div>
              <div className={`text-xs mt-0.5 ${isSelected ? "text-gray-300" : "text-gray-500"}`}>
                {plan.perMonth}
              </div>
            </button>
          </div>
        );
      })}
    </div>
  );
}

function ExplanationsUsedNote({ t, used, limit }: { t: CopyEntry; used: number; limit: number }) {
  const text = t.explanationsUsedTemplate
    .replace("{used}", String(used))
    .replace("{limit}", String(limit));
  return (
    <p className="mt-3 inline-flex items-center gap-2 rounded-lg bg-amber-50 border border-amber-200 px-3 py-1.5 text-xs font-semibold text-amber-900">
      📊 {text}
    </p>
  );
}

function CtaBlock({
  t,
  activePlan,
  isLoading,
  onCta,
}: {
  t: CopyEntry;
  activePlan: PlanOption;
  isLoading: boolean;
  onCta: () => void;
}) {
  const isMonthly = activePlan.id === "premium_monthly";
  return (
    <div className="mt-5">
      {isMonthly && (
        <p className="mb-2 text-sm font-medium text-emerald-700">
          🎁 {t.trialNote}
        </p>
      )}
      <button
        type="button"
        onClick={onCta}
        disabled={isLoading}
        className="inline-flex w-full items-center justify-center rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60 sm:w-auto"
      >
        {isLoading ? t.ctaLoading : t.cta}
      </button>
      <p className="mt-2 text-xs text-gray-500">
        {isMonthly ? t.subCtaMonthly : t.subCta}
      </p>
    </div>
  );
}

function FeatureCard({ title, desc, variant }: { title: string; desc: string; variant: "blue" | "purple" | "green" | "amber" }) {
  const variantClass =
    variant === "blue" ? "border-blue-200 bg-gradient-to-br from-blue-50 to-white"
    : variant === "purple" ? "border-purple-200 bg-gradient-to-br from-purple-50 to-white"
    : variant === "green" ? "border-emerald-200 bg-gradient-to-br from-emerald-50 to-white"
    : "border-amber-200 bg-gradient-to-br from-amber-50 to-white";

  return (
    <div className={`rounded-2xl border p-5 shadow-sm ${variantClass}`}>
      <div className="text-base font-semibold text-gray-900">{title}</div>
      <div className="mt-1 text-sm text-gray-700">{desc}</div>
    </div>
  );
}

function ComparisonTable({ t, onCta, isLoading, activePlan }: { t: CopyEntry; onCta: () => void; isLoading: boolean; activePlan: PlanOption }) {
  const isMonthly = activePlan.id === "premium_monthly";
  return (
    <section className="mt-6 overflow-hidden rounded-2xl border border-gray-200">
      <div className="bg-gray-50 px-6 py-4 text-lg font-semibold text-gray-900">{t.tableTitle}</div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="px-6 py-3 text-left font-medium text-gray-600">{t.tableFeature}</th>
              <th className="px-6 py-3 text-center font-medium text-gray-600">{t.tableFree}</th>
              <th className="px-6 py-3 text-center font-semibold text-black">{t.tablePremium}</th>
            </tr>
          </thead>
          <tbody>
            {t.tableRows.map((row, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-6 py-3 text-gray-800">{row.label}</td>
                <td className="px-6 py-3 text-center text-gray-500">{row.free}</td>
                <td className="px-6 py-3 text-center font-medium text-emerald-700">{row.premium}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="border-t border-gray-200 px-6 py-4 text-center">
        {isMonthly && (
          <p className="mb-2 text-sm font-medium text-emerald-700">🎁 {t.trialNote}</p>
        )}
        <button
          type="button"
          onClick={onCta}
          disabled={isLoading}
          className="inline-flex w-full items-center justify-center rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60 sm:w-auto"
        >
          {isLoading ? t.ctaLoading : t.cta}
        </button>
        {isMonthly && (
          <p className="mt-2 text-xs text-gray-500">{t.subCtaMonthly}</p>
        )}
      </div>
    </section>
  );
}

function Guarantee({ t }: { t: CopyEntry }) {
  return (
    <div className="mt-6 flex items-start gap-4 rounded-2xl border-2 border-emerald-300 bg-emerald-50 p-6 shadow-sm">
      <div className="text-4xl">🛡️</div>
      <div>
        <div className="text-lg font-bold text-emerald-900">{t.guaranteeTitle}</div>
        <p className="mt-1 text-sm text-emerald-800">{t.guaranteeDesc}</p>
      </div>
    </div>
  );
}

function PricingFaq({ t }: { t: CopyEntry }) {
  return (
    <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-6">
      <h2 className="text-xl font-semibold text-gray-900">{t.faqTitle}</h2>
      <div className="mt-4 divide-y divide-gray-200">
        {t.faqs.map((item) => (
          <details key={item.question} className="group py-4">
            <summary className="cursor-pointer list-none font-semibold text-gray-900 marker:hidden">
              <span className="flex items-center justify-between gap-4">
                {item.question}
                <span aria-hidden="true" className="text-lg text-gray-500 transition group-open:rotate-45">+</span>
              </span>
            </summary>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-600">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

function BusinessBanner({ t, href }: { t: CopyEntry; href: string }) {
  return (
    <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-[#0B1220] p-6 sm:flex sm:items-center sm:justify-between sm:gap-6">
      <div>
        <div className="text-base font-semibold text-white">{t.businessBannerTitle}</div>
        <p className="mt-1 text-sm text-slate-300">{t.businessBannerBody}</p>
      </div>
      <a
        href={href}
        className="mt-4 inline-flex shrink-0 items-center justify-center rounded-full bg-amber-400 px-5 py-2.5 text-sm font-semibold text-[#0B1220] transition hover:bg-amber-300 sm:mt-0"
      >
        {t.businessBannerCta} →
      </a>
    </div>
  );
}

// ── Componente principale ───────────────────────────────────────

export default function PremiumComingSoonView({ forceLang }: Props) {
  const pathname = usePathname();
  const { user, loading: authLoading, isPremiumUser: authPremium } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan>("premium_monthly");
  const [explanationsUsed, setExplanationsUsed] = useState<{ used: number; limit: number } | null>(null);

  const lang = useMemo<Lang>(() => {
    if (forceLang === "it" || forceLang === "es" || forceLang === "en" || forceLang === "fr") {
      return forceLang;
    }
    return getLangFromPathname(pathname);
  }, [forceLang, pathname]);

  const t = COPY[lang];
  const activePlan = t.plans.find((p) => p.id === selectedPlan) ?? t.plans[t.plans.length - 1];
  const isMonthly = selectedPlan === "premium_monthly";

  useEffect(() => {
    if (authLoading) return;
    const params = new URLSearchParams(window.location.search);
    trackEventOnce(`pricing_viewed:${window.location.pathname}:${window.location.search}`, "pricing_viewed", {
      language: lang,
      user_state: analyticsUserStateFrom(user),
      source_page: params.get("source") || document.referrer || "direct",
      certification_slug: params.get("certification_slug"),
    });
  }, [authLoading, lang, user]);

  function selectPlan(plan: Plan) {
    setSelectedPlan(plan);
    trackEvent("pricing_plan_selected", {
      language: lang,
      user_state: analyticsUserStateFrom(user),
      plan_type: plan,
      source_page: "pricing",
    });
  }

  // Leva costo-sommerso: mostra quante spiegazioni gratuite l'utente free ha già usato.
  // Solo dato reale (via /me/explanation-status), niente stime o numeri inventati.
  useEffect(() => {
    if (!user || authPremium) {
      setExplanationsUsed(null);
      return;
    }
    let cancelled = false;
    authFetch("/api/backend/me/explanation-status")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled || !data || data.unlimited) return;
        const used = Number(data.used ?? 0);
        const limit = Number(data.limit ?? 10);
        if (used > 0) setExplanationsUsed({ used, limit });
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [user, authPremium]);

  async function startPremiumCheckout() {
    if (isLoading) return;
    try {
      setIsLoading(true);
      trackEvent("checkout_started", {
        language: lang,
        user_state: analyticsUserStateFrom(user),
        plan_type: selectedPlan,
        purchase_type: "subscription",
        source_page: "pricing",
      });
      trackFunnelEvent({ event: "premium_clicked", lang, plan: selectedPlan });

      trackMetaPixel("InitiateCheckout", {
        value: PREMIUM_PLAN_VALUES[selectedPlan],
        currency: "EUR",
      });

      const res = await authFetch("/api/backend/billing/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-lang": lang },
        body: JSON.stringify({ lang, plan: selectedPlan }),
      });

      if (res.status === 401) {
        window.location.href = `/login?redirect=${encodeURIComponent(`${pathname || "/pricing"}${window.location.search}`)}`;
        return;
      }

      const data: { url?: string; error?: string } = await res.json();
      if (!res.ok || !data?.url) throw new Error(data?.error || "Failed");

      try {
        sessionStorage.setItem(
          "cq_pending_purchase",
          JSON.stringify({ value: PREMIUM_PLAN_VALUES[selectedPlan], currency: "EUR", plan: selectedPlan })
        );
      } catch {}

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
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-semibold text-gray-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              {t.badge}
            </div>
          </div>

          <h1 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
            {t.title}
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-gray-700 sm:text-base">{t.subtitle}</p>

          <ul className="mt-4 max-w-2xl space-y-1.5">
            {t.lossPoints.map((point, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="mt-0.5 text-emerald-600">✓</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>

          {/* Selettore piani */}
          <PlanSelector plans={t.plans} selected={selectedPlan} onChange={selectPlan} popularLabel={t.popularLabel} />

          {explanationsUsed && (
            <ExplanationsUsedNote t={t} used={explanationsUsed.used} limit={explanationsUsed.limit} />
          )}

          {/* CTA principale */}
          <CtaBlock t={t} activePlan={activePlan} isLoading={isLoading} onCta={startPremiumCheckout} />

          <div className="mt-4 max-w-3xl rounded-2xl border border-amber-200 bg-amber-50 p-4">
            <p className="text-sm font-semibold text-amber-900">{t.urgencyLine}</p>
            <p className="mt-2 text-sm text-amber-800">{t.pizzaLine}</p>
          </div>
        </section>

        <div className="px-6 py-6">
          <Guarantee t={t} />

          {/* Features */}
          <section className="mt-6 grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-gray-200 p-6">
              <div className="text-lg font-semibold text-gray-900">{t.title}</div>
              <p className="mt-2 text-sm text-gray-700">{t.subtitle}</p>
              <CtaBlock t={t} activePlan={activePlan} isLoading={isLoading} onCta={startPremiumCheckout} />
              <p className="mt-4 text-sm font-medium text-gray-900">{t.finalLine}</p>
            </div>

            <div>
              <div className="mb-3 text-lg font-semibold text-gray-900">{t.featuresTitle}</div>
              <div className="grid gap-3 sm:grid-cols-2">
                <FeatureCard title={t.features[0].h} desc={t.features[0].p} variant="blue" />
                <FeatureCard title={t.features[1].h} desc={t.features[1].p} variant="purple" />
                <FeatureCard title={t.features[2].h} desc={t.features[2].p} variant="amber" />
                <FeatureCard title={t.features[3].h} desc={t.features[3].p} variant="green" />
              </div>
            </div>
          </section>

          <ComparisonTable t={t} onCta={startPremiumCheckout} isLoading={isLoading} activePlan={activePlan} />

          <PricingFaq t={t} />

          <BusinessBanner t={t} href={BUSINESS_HREF[lang]} />

          {/* CTA finale */}
          <div className="mt-8 rounded-2xl border border-gray-200 bg-gray-50 p-6 text-center">
            <p className="text-base font-semibold text-gray-900">{t.finalLine}</p>
              <PlanSelector plans={t.plans} selected={selectedPlan} onChange={selectPlan} popularLabel={t.popularLabel} />
            <div className="mt-5 flex flex-col items-center">
              {isMonthly && (
                <p className="mb-2 text-sm font-medium text-emerald-700">🎁 {t.trialNote}</p>
              )}
              <button
                type="button"
                onClick={startPremiumCheckout}
                disabled={isLoading}
                className="inline-flex w-full items-center justify-center rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60 sm:w-auto"
              >
                {isLoading ? t.ctaLoading : t.cta}
              </button>
              <p className="mt-2 text-xs text-gray-500">
                {isMonthly ? t.subCtaMonthly : t.subCta}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
