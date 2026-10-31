// src/app/(marketing)/pricing/PremiumComingSoonView.tsx
"use client";

import { useConsent } from "@/components/analytics/ConsentProvider";
import { checkoutRequest } from "@/lib/checkout-analytics";

import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { authFetch, getToken } from "@/lib/auth";
import { useAuth } from "@/components/auth/AuthProvider";
import { trackMetaPixel, PREMIUM_PLAN_VALUES } from "@/lib/metaPixel";
import {
  analyticsUserStateFrom,
  trackEvent,
  trackCheckoutCreated,
  trackEventOnce,
  trackFunnelEvent,
  trackFunnelEventOnce,
  getAnonymousSessionId,
  getAnonymousVisitorId,
} from "@/lib/analytics";
import { readPostGateCohort } from "@/lib/post-gate-tracking";
import { resolveCommercialOrigin, type CommercialOrigin } from "@/lib/commercial-origin";
import {
  buildLoginHref,
  buildResumePath,
  consumeCheckoutIntent,
  CHECKOUT_BLOCKED_NOTICE,
  decideResume,
  isCheckoutAllowedHost,
  saveCheckoutIntent,
  stripResumeParams,
} from "@/lib/checkout-intent";
import PackagesUpsell from "./PackagesUpsell";
import { useTwa } from "@/hooks/useTwa";
import { isPaymentIssueCheckoutResponse, requestPortalUrl } from "@/lib/billing-recovery";
import PaymentRecoveryNotice from "@/components/billing/PaymentRecoveryNotice";
import { detectTwa, localeFromPathname } from "@/lib/twa";
import TwaNotice from "@/components/twa/TwaNotice";

type Lang = "it" | "es" | "en" | "fr";
const RESUME_WAIT_MS = 6000;
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
  // Equivalente mensile dell'annuale (59,90 / 12): solo aritmetica, non e' un prezzo Stripe.
  equivalent?: string;
  popular?: boolean;
};

type CopyEntry = {
  badge: string;
  // Framing per perdita
  title: string;
  subtitle: string;
  lossPoints: string[];
  plans: PlanOption[];
  cta: string;
  ctaLoading: string;
  subCta: string;
  subCtaMonthly: string;
  trialNote: string;
  trialPdfNotice: string;
  promoNote: string;
  featuresTitle: string;
  checkoutError: string;
  // Visitatore non autenticato: serve un account prima del pagamento.
  ctaAnon: string;
  anonNote: string;
  resumeManual: string;
  resumeExpired: string;
  pizzaLine: string;
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
      "Mock Review delle simulazioni e Tutor AI sulla domanda che stai svolgendo",
    ],
    plans: [
      { id: "premium_monthly", label: "Mensile", price: "9,99€", perMonth: "9,99€/mese", trialBadge: "7gg gratis" },
      { id: "premium_annual", label: "Annuale", price: "59,90€", perMonth: "Pagamento unico per 12 mesi", badge: "Risparmi il 50%", equivalent: "≈ 4,99€/mese", popular: true },
    ],
    cta: "Inizia Premium",
    ctaLoading: "Apertura checkout...",
    subCta: "59,90€ addebitati oggi in un unico pagamento per 12 mesi",
    subCtaMonthly: "7 giorni gratis · Nessun addebito ora · Disdici quando vuoi",
    trialPdfNotice: "Durante i 7 giorni di prova gratuita puoi consultare le anteprime, ma non scaricare le guide PDF e le mappe complete. I download sono disponibili dopo il primo pagamento o con acquisto singolo.",
    trialNote: "Prova gratis per 7 giorni, poi 9,99€/mese.",
    promoNote: "Sconto del 50% già applicato sul primo mese, addebitato subito — nessun periodo di prova.",
    featuresTitle: "Cosa include Premium",
    checkoutError: "Errore durante l'apertura del checkout. Riprova.",
    ctaAnon: "Accedi o registrati per continuare",
    anonNote: "Serve un account gratuito (anche con Google): dopo l'accesso torni qui e prosegui.",
    resumeManual: "Accesso eseguito! Premi il pulsante per proseguire al pagamento sicuro.",
    resumeExpired: "La sessione è scaduta. Accedi di nuovo e premi il pulsante Premium.",
    pizzaLine: "Scegli il mensile per provare senza addebito per 7 giorni, oppure risparmia il 50% con l'annuale.",
    finalLine: "Scegli il piano più adatto al tempo che ti separa dall'esame.",
    popularLabel: "Più popolare",
    features: [
      { h: "Spiegazioni complete", p: "Sblocca tutte le spiegazioni per capire davvero gli errori e non limitarti a memorizzare." },
      { h: "Mock Review", p: "Dopo ogni simulazione rivedi domanda per domanda la tua risposta e quella corretta, per capire dove hai perso punti." },
      { h: "Ripasso errori", p: "Rivedi le domande sbagliate e concentrati sui punti deboli invece di ripartire ogni volta da zero." },
      { h: "Guide e mappe incluse", p: "Usa le risorse complete della tua certificazione per ripassare i concetti tra una sessione e l'altra." },
    ],
    tableTitle: "Free vs Premium",
    tableFeature: "Funzionalità",
    tableFree: "Gratis",
    tablePremium: "Premium",
    tableRows: [
      { label: "Spiegazioni errori", free: "10 gratuite", premium: "✅ Illimitate" },
      { label: "Mock Exam", free: "Punteggio finale", premium: "✅ Con Mock Review" },
      { label: "Ripasso errori", free: "❌", premium: "✅" },
      { label: "Guide PDF", free: "Anteprima gratuita", premium: "✅ Incluse" },
      { label: "Mappe concettuali", free: "Anteprima gratuita", premium: "✅ Incluse" },
      { label: "Scenari d'esame", free: "Alcuni scenari", premium: "✅ Tutti inclusi" },
      { label: "AI Tutor", free: "Assistente generale", premium: "✅ Tutor sulla tua domanda" },
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
      "Mock Review de los simulacros y Tutor AI sobre la pregunta que estás resolviendo",
    ],
    plans: [
      { id: "premium_monthly", label: "Mensual", price: "9,99€", perMonth: "9,99€/mes", trialBadge: "7 días gratis" },
      { id: "premium_annual", label: "Anual", price: "59,90€", perMonth: "Pago único por 12 meses", badge: "Ahorra el 50%", equivalent: "≈ 4,99€/mes", popular: true },
    ],
    cta: "Empezar Premium",
    ctaLoading: "Abriendo checkout...",
    subCta: "59,90€ cobrados hoy en un único pago por 12 meses",
    subCtaMonthly: "7 días gratis · Sin cargo ahora · Cancela cuando quieras",
    trialPdfNotice: "Durante los 7 días de prueba gratuita puedes consultar las vistas previas, pero no descargar las guías PDF ni los mapas completos. Las descargas están disponibles tras el primer pago o con una compra individual.",
    trialNote: "Prueba gratis 7 días, luego 9,99€/mes.",
    promoNote: "Descuento del 50% ya aplicado en el primer mes, cobrado ahora — sin periodo de prueba.",
    featuresTitle: "Qué incluye Premium",
    checkoutError: "Error al abrir el checkout. Inténtalo de nuevo.",
    ctaAnon: "Inicia sesión o regístrate para continuar",
    anonNote: "Se necesita una cuenta gratuita (también con Google): después volverás aquí para continuar.",
    resumeManual: "¡Sesión iniciada! Pulsa el botón para continuar al pago seguro.",
    resumeExpired: "La sesión ha caducado. Inicia sesión de nuevo y pulsa el botón Premium.",
    pizzaLine: "Elige el plan mensual para probar 7 días sin cargo o ahorra un 50% con el anual.",
    finalLine: "Elige el plan que mejor se adapta al tiempo que falta para tu examen.",
    popularLabel: "Más popular",
    features: [
      { h: "Explicaciones completas", p: "Desbloquea todas las explicaciones para entender de verdad tus errores y no solo memorizar." },
      { h: "Mock Review", p: "Tras cada simulacro revisa pregunta por pregunta tu respuesta y la correcta para saber dónde perdiste puntos." },
      { h: "Repaso de errores", p: "Revisa tus fallos y céntrate en tus puntos débiles en lugar de empezar siempre desde cero." },
      { h: "Guías y mapas incluidos", p: "Usa todos los recursos de tu certificación para repasar entre sesiones." },
    ],
    tableTitle: "Gratis vs Premium",
    tableFeature: "Función",
    tableFree: "Gratis",
    tablePremium: "Premium",
    tableRows: [
      { label: "Explicaciones de errores", free: "10 gratuitas", premium: "✅ Ilimitadas" },
      { label: "Mock Exam", free: "Puntuación final", premium: "✅ Con Mock Review" },
      { label: "Repaso de errores", free: "❌", premium: "✅" },
      { label: "Guías PDF", free: "Vista previa gratuita", premium: "✅ Incluidas" },
      { label: "Mapas conceptuales", free: "Vista previa gratuita", premium: "✅ Incluidos" },
      { label: "Escenarios de examen", free: "Algunos escenarios", premium: "✅ Todos incluidos" },
      { label: "AI Tutor", free: "Asistente general", premium: "✅ Tutor sobre tu pregunta" },
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
      "Mock Review of your mock exams and an AI Tutor that knows the question you are answering",
    ],
    plans: [
      { id: "premium_monthly", label: "Monthly", price: "€9.99", perMonth: "€9.99/month", trialBadge: "7 days free" },
      { id: "premium_annual", label: "Annual", price: "€59.90", perMonth: "One payment for 12 months", badge: "Save 50%", equivalent: "≈ €4.99/month", popular: true },
    ],
    cta: "Start Premium",
    ctaLoading: "Opening checkout...",
    subCta: "€59.90 charged today as one payment for 12 months",
    subCtaMonthly: "7 days free · No charge today · Cancel anytime",
    trialPdfNotice: "During the 7-day free trial, previews are available but full PDF guides and maps cannot be downloaded. Downloads become available after the first payment or with an individual purchase.",
    trialNote: "Try free for 7 days, then €9.99/month.",
    promoNote: "50% off your first month already applied, charged now — no free trial.",
    featuresTitle: "What Premium includes",
    checkoutError: "Error while opening checkout. Please try again.",
    ctaAnon: "Log in or sign up to continue",
    anonNote: "A free account is required (Google works too): you'll come right back here to continue.",
    resumeManual: "You're signed in! Press the button to continue to secure checkout.",
    resumeExpired: "Your session expired. Log in again and press the Premium button.",
    pizzaLine: "Choose monthly to try Premium for 7 days with no charge, or save 50% with annual.",
    finalLine: "Choose the plan that best fits the time left before your exam.",
    popularLabel: "Most popular",
    features: [
      { h: "Full explanations", p: "Unlock every explanation so you can actually understand mistakes instead of just memorizing answers." },
      { h: "Mock Review", p: "After every mock exam, go through each question with your answer and the correct one to see where you lost points." },
      { h: "Error review", p: "Go back over your incorrect answers and focus on weak areas instead of restarting blindly." },
      { h: "Guides and maps included", p: "Use the complete resources for your certification to review concepts between practice sessions." },
    ],
    tableTitle: "Free vs Premium",
    tableFeature: "Feature",
    tableFree: "Free",
    tablePremium: "Premium",
    tableRows: [
      { label: "Wrong answer explanations", free: "10 free", premium: "✅ Unlimited" },
      { label: "Mock Exam", free: "Final score", premium: "✅ With Mock Review" },
      { label: "Error review", free: "❌", premium: "✅" },
      { label: "PDF guides", free: "Free preview", premium: "✅ Included" },
      { label: "Concept maps", free: "Free preview", premium: "✅ Included" },
      { label: "Exam scenarios", free: "Some scenarios", premium: "✅ All included" },
      { label: "AI Tutor", free: "General assistant", premium: "✅ Tutor on your question" },
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
      "Mock Review de vos examens blancs et Tutor IA qui connaît la question en cours",
    ],
    plans: [
      { id: "premium_monthly", label: "Mensuel", price: "9,99€", perMonth: "9,99€/mois", trialBadge: "7j gratuits" },
      { id: "premium_annual", label: "Annuel", price: "59,90€", perMonth: "Paiement unique pour 12 mois", badge: "Économisez 50%", equivalent: "≈ 4,99€/mois", popular: true },
    ],
    cta: "Commencer Premium",
    ctaLoading: "Ouverture du checkout...",
    subCta: "59,90€ débités aujourd'hui en un paiement unique pour 12 mois",
    subCtaMonthly: "7 jours gratuits · Aucun débit aujourd'hui · Annulez quand vous voulez",
    trialPdfNotice: "Pendant les 7 jours d’essai gratuit, les aperçus sont disponibles, mais le téléchargement des guides PDF et cartes complets est désactivé. Les téléchargements sont accessibles après le premier paiement ou un achat individuel.",
    trialNote: "Essayez gratuitement 7 jours, puis 9,99€/mois.",
    promoNote: "Réduction de 50% déjà appliquée sur le premier mois, débité maintenant — aucun essai gratuit.",
    featuresTitle: "Ce que Premium inclut",
    checkoutError: "Erreur lors de l'ouverture du checkout. Réessayez.",
    ctaAnon: "Connectez-vous ou inscrivez-vous pour continuer",
    anonNote: "Un compte gratuit est nécessaire (Google possible) : vous reviendrez ici pour continuer.",
    resumeManual: "Vous êtes connecté ! Appuyez sur le bouton pour passer au paiement sécurisé.",
    resumeExpired: "Votre session a expiré. Reconnectez-vous et appuyez sur le bouton Premium.",
    pizzaLine: "Choisissez le mensuel pour essayer 7 jours sans débit, ou économisez 50% avec l'annuel.",
    finalLine: "Choisissez l'offre adaptée au temps qu'il vous reste avant l'examen.",
    popularLabel: "Le plus populaire",
    features: [
      { h: "Explications complètes", p: "Débloquez toutes les explications pour vraiment comprendre vos erreurs." },
      { h: "Mock Review", p: "Après chaque examen blanc, revoyez chaque question avec votre réponse et la bonne réponse pour voir où vous avez perdu des points." },
      { h: "Révision des erreurs", p: "Revenez sur vos erreurs et concentrez-vous sur vos points faibles." },
      { h: "Guides et cartes inclus", p: "Utilisez toutes les ressources de votre certification pour réviser entre les sessions." },
    ],
    tableTitle: "Gratuit vs Premium",
    tableFeature: "Fonctionnalité",
    tableFree: "Gratuit",
    tablePremium: "Premium",
    tableRows: [
      { label: "Explications des erreurs", free: "10 gratuites", premium: "✅ Illimitées" },
      { label: "Mock Exam", free: "Score final", premium: "✅ Avec Mock Review" },
      { label: "Révision des erreurs", free: "❌", premium: "✅" },
      { label: "Guides PDF", free: "Aperçu gratuit", premium: "✅ Inclus" },
      { label: "Cartes conceptuelles", free: "Aperçu gratuit", premium: "✅ Incluses" },
      { label: "Scénarios d'examen", free: "Quelques scénarios", premium: "✅ Tous inclus" },
      { label: "AI Tutor", free: "Assistant général", premium: "✅ Tuteur sur votre question" },
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
    businessBannerTitle: "Vous cherchez une offre pour votre équipe ?",
    businessBannerBody: "Si vous gérez une équipe IT, découvrez nos offres entreprises : tableau de bord de progression partagé pour toute l'équipe et facture unique.",
    businessBannerCta: "Découvrir les offres entreprises",
  },
};

// Copy della pagina commerciale oltre al listino: percorso studio -> acquisto, esempio, fiducia.
// Solo fatti verificabili nel prodotto: nessun numero di utenti, recensione o garanzia inventati.
type StoryEntry = {
  journeyTitle: string;
  journeyIntro: string;
  steps: { tag: string; premiumTag: boolean; title: string; body: string }[];
  exampleLabel: string;
  exampleQuestion: string;
  exampleYourAnswer: string;
  exampleCorrect: string;
  exampleExplanation: string;
  exampleNote: string;
  trust: string[];
  trustLabel: string;
  stickyLabel: string;
  stickyCtaAnon: string;
  tableYes: string;
  tableNo: string;
};

const STORY: Record<Lang, StoryEntry> = {
  it: {
    journeyTitle: "Da ogni simulazione a un ripasso più mirato",
    journeyIntro: "Non devi indovinare cosa ripassare: usa i risultati per concentrarti sui tuoi punti deboli. Ecco dove finisce il piano gratuito e cosa aggiunge Premium.",
    steps: [
      { tag: "Gratis", premiumTag: false, title: "Allenati", body: "Affronta quiz e Mock Exam con punteggio della certificazione che stai preparando: si parte senza pagare." },
      { tag: "10 gratis, poi Premium", premiumTag: true, title: "Comprendi gli errori", body: "Leggi la spiegazione delle risposte sbagliate: 10 sono gratuite, con Premium sono illimitate." },
      { tag: "Premium", premiumTag: true, title: "Ripassa con Premium", body: "Ritrova le domande sbagliate nel Ripasso errori e usa guide PDF e mappe complete per colmare le lacune." },
    ],
    exampleLabel: "Esempio illustrativo",
    exampleQuestion: "Quale protocollo traduce un nome di dominio in un indirizzo IP?",
    exampleYourAnswer: "La tua risposta: ARP",
    exampleCorrect: "Risposta corretta: DNS",
    exampleExplanation: "Il DNS risolve i nomi in indirizzi IP. ARP lavora invece nella rete locale: associa un indirizzo IP a un indirizzo MAC.",
    exampleNote: "Con Premium le spiegazioni non finiscono dopo la decima e le domande sbagliate tornano nel Ripasso errori.",
    trustLabel: "Informazioni utili prima di pagare",
    trust: ["Pagamento sicuro con Stripe", "Disdici online dal tuo profilo", "Prezzi e addebiti chiari prima di pagare", "Disponibile in italiano, inglese, francese e spagnolo"],
    stickyLabel: "Riepilogo del piano scelto",
    stickyCtaAnon: "Accedi o registrati",
    tableYes: "Incluso",
    tableNo: "Non incluso",
  },
  es: {
    journeyTitle: "De cada simulacro a un repaso más preciso",
    journeyIntro: "No tienes que adivinar qué repasar: usa tus resultados para centrarte en tus puntos débiles. Aquí ves hasta dónde llega el plan gratuito y qué añade Premium.",
    steps: [
      { tag: "Gratis", premiumTag: false, title: "Practica", body: "Haz cuestionarios y Mock Exam con puntuación de la certificación que preparas: empiezas sin pagar." },
      { tag: "10 gratis, luego Premium", premiumTag: true, title: "Entiende tus errores", body: "Lee la explicación de las respuestas incorrectas: 10 son gratuitas y con Premium son ilimitadas." },
      { tag: "Premium", premiumTag: true, title: "Repasa con Premium", body: "Encuentra tus preguntas falladas en el Repaso de errores y usa guías PDF y mapas completos para cubrir las lagunas." },
    ],
    exampleLabel: "Ejemplo ilustrativo",
    exampleQuestion: "¿Qué protocolo traduce un nombre de dominio en una dirección IP?",
    exampleYourAnswer: "Tu respuesta: ARP",
    exampleCorrect: "Respuesta correcta: DNS",
    exampleExplanation: "El DNS resuelve nombres en direcciones IP. ARP, en cambio, trabaja en la red local: asocia una dirección IP con una dirección MAC.",
    exampleNote: "Con Premium las explicaciones no se acaban en la décima y las preguntas falladas vuelven en el Repaso de errores.",
    trustLabel: "Información útil antes de pagar",
    trust: ["Pago seguro con Stripe", "Cancela online desde tu perfil", "Precios y cobros claros antes de pagar", "Disponible en italiano, inglés, francés y español"],
    stickyLabel: "Resumen del plan elegido",
    stickyCtaAnon: "Accede o regístrate",
    tableYes: "Incluido",
    tableNo: "No incluido",
  },
  en: {
    journeyTitle: "From every mock exam to more focused revision",
    journeyIntro: "No need to guess what to revise: use your results to focus on weaker areas. Here is where the free plan ends and what Premium adds.",
    steps: [
      { tag: "Free", premiumTag: false, title: "Practise", body: "Take quizzes and scored Mock Exams for the certification you are preparing: you start without paying." },
      { tag: "10 free, then Premium", premiumTag: true, title: "Understand mistakes", body: "Read the explanation for wrong answers: 10 are free, with Premium they are unlimited." },
      { tag: "Premium", premiumTag: true, title: "Revise with Premium", body: "Find your wrong answers again in Error review and use full PDF guides and maps to close the gaps." },
    ],
    exampleLabel: "Illustrative example",
    exampleQuestion: "Which protocol translates a domain name into an IP address?",
    exampleYourAnswer: "Your answer: ARP",
    exampleCorrect: "Correct answer: DNS",
    exampleExplanation: "DNS resolves names into IP addresses. ARP works on the local network instead: it maps an IP address to a MAC address.",
    exampleNote: "With Premium the explanations do not stop after the tenth and wrong answers come back in Error review.",
    trustLabel: "Useful information before you pay",
    trust: ["Secure payment with Stripe", "Cancel online from your profile", "Clear prices and charges before you pay", "Available in English, Italian, French and Spanish"],
    stickyLabel: "Selected plan summary",
    stickyCtaAnon: "Log in or sign up",
    tableYes: "Included",
    tableNo: "Not included",
  },
  fr: {
    journeyTitle: "De chaque examen blanc à une révision plus ciblée",
    journeyIntro: "Plus besoin de deviner quoi réviser : utilisez vos résultats pour cibler vos points faibles. Voici où s'arrête le plan gratuit et ce que Premium ajoute.",
    steps: [
      { tag: "Gratuit", premiumTag: false, title: "Entraînez-vous", body: "Faites des quiz et des Mock Exam notés pour votre certification : vous commencez sans payer." },
      { tag: "10 gratuites, puis Premium", premiumTag: true, title: "Comprenez vos erreurs", body: "Lisez l'explication des mauvaises réponses : 10 sont gratuites, avec Premium elles sont illimitées." },
      { tag: "Premium", premiumTag: true, title: "Révisez avec Premium", body: "Retrouvez vos mauvaises réponses dans la Révision des erreurs et utilisez guides PDF et cartes complets pour combler vos lacunes." },
    ],
    exampleLabel: "Exemple illustratif",
    exampleQuestion: "Quel protocole traduit un nom de domaine en adresse IP ?",
    exampleYourAnswer: "Votre réponse : ARP",
    exampleCorrect: "Bonne réponse : DNS",
    exampleExplanation: "Le DNS résout les noms en adresses IP. ARP, lui, travaille sur le réseau local : il associe une adresse IP à une adresse MAC.",
    exampleNote: "Avec Premium, les explications ne s'arrêtent pas à la dixième et vos erreurs reviennent dans la Révision des erreurs.",
    trustLabel: "Informations utiles avant de payer",
    trust: ["Paiement sécurisé avec Stripe", "Annulez en ligne depuis votre profil", "Tarifs et débits clairs avant de payer", "Disponible en français, anglais, italien et espagnol"],
    stickyLabel: "Récapitulatif de l'offre choisie",
    stickyCtaAnon: "Connexion ou inscription",
    tableYes: "Inclus",
    tableNo: "Non inclus",
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
    <div className="mt-6 grid grid-cols-2 gap-2.5 sm:gap-3">
      {plans.map((plan) => {
        const isSelected = plan.id === selected;
        const activeBadge = plan.trialBadge ?? plan.badge;
        return (
          <div key={plan.id} className="relative">
            <button
              type="button"
              onClick={() => onChange(plan.id)}
              aria-pressed={isSelected}
              className={`relative h-full w-full rounded-2xl border-2 p-3 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 sm:p-4 ${
                plan.popular && !isSelected
                  ? "border-emerald-400 bg-white text-gray-900 hover:border-emerald-500"
                  : isSelected
                  ? "border-black bg-black text-white"
                  : "border-gray-200 bg-white text-gray-900 hover:border-gray-400"
              }`}
            >
              {activeBadge && (
                <span className={`absolute -top-2.5 left-3 rounded-full px-2 py-0.5 text-xs font-semibold ${
                  plan.trialBadge
                    ? isSelected ? "bg-emerald-300 text-emerald-950" : "bg-emerald-700 text-white"
                    : isSelected ? "bg-white text-black" : "bg-black text-white"
                }`}>
                  {activeBadge}
                </span>
              )}
              <div className="text-sm font-semibold">{plan.label}</div>
              <div className="mt-1 text-lg font-bold">{plan.price}</div>
              <div className={`mt-0.5 text-xs ${isSelected ? "text-gray-300" : "text-gray-600"}`}>
                {plan.perMonth}
              </div>
              {plan.equivalent && (
                <div className={`mt-0.5 text-xs font-semibold ${isSelected ? "text-emerald-300" : "text-emerald-700"}`}>
                  {plan.equivalent}
                </div>
              )}
              {plan.popular && (
                <div className={`mt-2 text-xs font-bold ${isSelected ? "text-white" : "text-emerald-800"}`}>
                  ⭐ {popularLabel}
                </div>
              )}
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
  isPromoLink,
  onCta,
}: {
  t: CopyEntry;
  activePlan: PlanOption;
  isLoading: boolean;
  isPromoLink: boolean;
  onCta: () => void;
}) {
  const isMonthly = activePlan.id === "premium_monthly";
  return (
    <div className="mt-5">
      {isMonthly && (
        <p className="mb-2 text-sm font-medium text-emerald-800">
          🎁 {isPromoLink ? t.promoNote : t.trialNote}
        </p>
      )}
      <button
        type="button"
        onClick={onCta}
        disabled={isLoading}
        className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60 sm:w-auto"
      >
        {isLoading ? t.ctaLoading : t.cta}
      </button>
      {!(isMonthly && isPromoLink) && (
        <p className="mt-2 text-xs text-gray-600">
          {isMonthly ? t.subCtaMonthly : t.subCta}
        </p>
      )}
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

function TableCell({ value, yes, no }: { value: string; yes: string; no: string }) {
  const isYes = value.startsWith("✅");
  const isNo = value.startsWith("❌");
  const text = value.replace(/^(✅|❌)\s*/, "");
  return (
    <>
      {isYes && <span aria-hidden="true" className="mr-1">✓</span>}
      {isNo && <span aria-hidden="true">✕</span>}
      {(isYes || isNo) && <span className="sr-only">{isYes ? yes : no}{text ? ": " : ""}</span>}
      {text}
    </>
  );
}

function ComparisonTable({ t, s, onCta, isLoading, activePlan, isPromoLink }: { t: CopyEntry; s: StoryEntry; onCta: () => void; isLoading: boolean; activePlan: PlanOption; isPromoLink: boolean }) {
  const isMonthly = activePlan.id === "premium_monthly";
  return (
    <section className="mt-8 overflow-hidden rounded-2xl border border-gray-200" aria-labelledby="premium-compare">
      <h2 id="premium-compare" className="bg-gray-50 px-4 py-4 text-lg font-semibold text-gray-900 sm:px-6">{t.tableTitle}</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th scope="col" className="px-3 py-3 text-left font-medium text-gray-700 sm:px-6">{t.tableFeature}</th>
              <th scope="col" className="px-3 py-3 text-center font-medium text-gray-700 sm:px-6">{t.tableFree}</th>
              <th scope="col" className="bg-emerald-50 px-3 py-3 text-center font-semibold text-black sm:px-6">{t.tablePremium}</th>
            </tr>
          </thead>
          <tbody>
            {t.tableRows.map((row, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <th scope="row" className="px-3 py-3 text-left font-normal text-gray-800 sm:px-6">{row.label}</th>
                <td className="px-3 py-3 text-center text-gray-700 sm:px-6"><TableCell value={row.free} yes={s.tableYes} no={s.tableNo} /></td>
                <td className="bg-emerald-50/60 px-3 py-3 text-center font-medium text-emerald-800 sm:px-6"><TableCell value={row.premium} yes={s.tableYes} no={s.tableNo} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="border-t border-gray-200 px-4 py-4 text-center sm:px-6">
        {isMonthly && (
          <p className="mb-2 text-sm font-medium text-emerald-800">🎁 {isPromoLink ? t.promoNote : t.trialNote}</p>
        )}
        <button
          type="button"
          onClick={onCta}
          disabled={isLoading}
          className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60 sm:w-auto"
        >
          {isLoading ? t.ctaLoading : t.cta}
        </button>
        {isMonthly && !isPromoLink && (
          <p className="mt-2 text-xs text-gray-600">{t.subCtaMonthly}</p>
        )}
      </div>
    </section>
  );
}

function PriceClarity({ t, isPromoLink }: { t: CopyEntry; isPromoLink: boolean }) {
  return (
    <section className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 sm:p-6" aria-labelledby="premium-price-clarity">
      <h2 id="premium-price-clarity" className="text-lg font-bold text-emerald-950">{t.guaranteeTitle}</h2>
      {!isPromoLink && <p className="mt-1 text-sm text-emerald-900">{t.guaranteeDesc}</p>}
    </section>
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

function TrustStrip({ s }: { s: StoryEntry }) {
  return (
    <ul aria-label={s.trustLabel} className="mt-5 grid gap-x-6 gap-y-1.5 text-sm text-gray-700 sm:grid-cols-2">
      {s.trust.map((item) => (
        <li key={item} className="flex items-start gap-2">
          <span aria-hidden="true" className="mt-0.5 text-emerald-700">✓</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function ValueJourney({ s, children }: { s: StoryEntry; children: React.ReactNode }) {
  return (
    <section className="mt-8 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-6 sm:px-7 sm:py-7" aria-labelledby="premium-how-it-works">
      <h2 id="premium-how-it-works" className="text-2xl font-semibold tracking-tight text-gray-900">{s.journeyTitle}</h2>
      <p className="mt-2 max-w-3xl text-sm leading-relaxed text-gray-700">{s.journeyIntro}</p>
      <ol className="mt-6 grid gap-4 md:grid-cols-3">
        {s.steps.map((step, i) => (
          <li key={step.title} className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="flex items-center justify-between gap-2">
              <span aria-hidden="true" className="text-xs font-bold tracking-widest text-emerald-800">{String(i + 1).padStart(2, "0")}</span>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  step.premiumTag ? "bg-emerald-100 text-emerald-900" : "bg-gray-100 text-gray-800"
                }`}
              >
                {step.tag}
              </span>
            </div>
            <h3 className="mt-3 text-base font-semibold text-gray-900">{step.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-700">{step.body}</p>
          </li>
        ))}
      </ol>

      {/* Esempio dimostrativo, dichiarato come tale: nessun dato reale di utenti. */}
      <figure className="mt-6 rounded-xl border border-dashed border-gray-300 bg-white p-4 sm:p-5">
        <figcaption className="text-xs font-semibold uppercase tracking-wide text-gray-600">{s.exampleLabel}</figcaption>
        <p className="mt-2 text-sm font-semibold text-gray-900">{s.exampleQuestion}</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-900">
            <span aria-hidden="true">✕ </span>{s.exampleYourAnswer}
          </p>
          <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
            <span aria-hidden="true">✓ </span>{s.exampleCorrect}
          </p>
        </div>
        <p className="mt-3 rounded-lg bg-gray-50 px-3 py-2 text-sm leading-relaxed text-gray-800">{s.exampleExplanation}</p>
        <p className="mt-3 text-sm font-medium text-emerald-800">{s.exampleNote}</p>
      </figure>

      <div className="mt-6 max-w-xl">{children}</div>
    </section>
  );
}

// Barra CTA per smartphone: compare quando la CTA dell'hero esce dallo schermo e
// sparisce quando si raggiunge (o si supera) la CTA finale. Usa lo stesso checkout.
function StickyCtaBar({
  t,
  s,
  isAnonymous,
  activePlan,
  isPromoLink,
  isLoading,
  onCta,
}: {
  t: CopyEntry;
  s: StoryEntry;
  isAnonymous: boolean;
  activePlan: PlanOption;
  isPromoLink: boolean;
  isLoading: boolean;
  onCta: () => void;
}) {
  const summary = [
    activePlan.id === "premium_monthly" && !isPromoLink ? activePlan.trialBadge : null,
    activePlan.perMonth,
  ].filter(Boolean).join(" · ");
  return (
    <div
      role="region"
      aria-label={s.stickyLabel}
      className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white/95 px-4 pt-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))] shadow-[0_-4px_16px_rgba(0,0,0,0.08)] backdrop-blur md:hidden"
    >
      <div className="mx-auto flex max-w-xl items-center gap-3">
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-semibold text-gray-900">{t.badge} · {activePlan.label}</div>
          <div className="text-xs leading-tight text-gray-700">{summary}</div>
        </div>
        <button
          type="button"
          onClick={onCta}
          disabled={isLoading}
          className="inline-flex min-h-12 max-w-[55%] shrink-0 items-center justify-center rounded-xl bg-black px-4 py-2 text-center text-sm font-semibold leading-tight text-white transition hover:opacity-90 disabled:opacity-60"
        >
          {isLoading ? t.ctaLoading : isAnonymous ? s.stickyCtaAnon : t.cta}
        </button>
      </div>
    </div>
  );
}

// ── Componente principale ───────────────────────────────────────

function PremiumPricingView({ forceLang }: Props) {
  const pathname = usePathname();
  const { status: consentStatus } = useConsent();
  const { user, loading: authLoading, isPremiumUser: authPremium } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  // Abbonamento esistente con pagamento da regolarizzare (past_due/unpaid): niente nuovo checkout, si guida al portale Stripe.
  const [paymentIssue, setPaymentIssue] = useState(false);
  const [portalBusy, setPortalBusy] = useState(false);
  const [portalFailed, setPortalFailed] = useState(false);
  // Guardie sincrone: due click ravvicinati o una ripresa + click non creano due checkout.
  const inFlightRef = useRef(false);
  const resumeHandledRef = useRef(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan>("premium_monthly");
  const [explanationsUsed, setExplanationsUsed] = useState<{ used: number; limit: number } | null>(null);
  // Link di campagna (es. ?promo=thanks1month): parte subito allo sconto, niente trial 7gg
  const [isPromoLink, setIsPromoLink] = useState(false);

  const lang = useMemo<Lang>(() => {
    if (forceLang === "it" || forceLang === "es" || forceLang === "en" || forceLang === "fr") {
      return forceLang;
    }
    return getLangFromPathname(pathname);
  }, [forceLang, pathname]);

  // Visitatore non autenticato: il pulsante dice chiaramente che serve un account.
  const isAnonymous = !authLoading && !user;
  const copy = COPY[lang];
  const story = STORY[lang];
  const t: CopyEntry = isAnonymous
    ? { ...copy, cta: copy.ctaAnon, subCta: `${copy.anonNote} ${copy.subCta}`, subCtaMonthly: `${copy.anonNote} ${copy.subCtaMonthly}` }
    : copy;
  const activePlan = t.plans.find((p) => p.id === selectedPlan) ?? t.plans[t.plans.length - 1];
  const isMonthly = selectedPlan === "premium_monthly";

  // Barra CTA mobile: visibile solo se la CTA dell'hero e' fuori schermo e la CTA finale non e' ancora stata raggiunta.
  const heroCtaRef = useRef<HTMLDivElement | null>(null);
  const finalCtaRef = useRef<HTMLDivElement | null>(null);
  const [heroCtaOut, setHeroCtaOut] = useState(false);
  const [finalCtaReached, setFinalCtaReached] = useState(false);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      const hero = heroCtaRef.current?.getBoundingClientRect();
      const fin = finalCtaRef.current?.getBoundingClientRect();
      setHeroCtaOut(!!hero && (hero.bottom <= 0 || hero.top >= vh));
      setFinalCtaReached(!!fin && fin.top < vh);
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);
  const showStickyCta = heroCtaOut && !finalCtaReached;

  useEffect(() => {
    if (detectTwa() || authLoading) return;
    const params = new URLSearchParams(window.location.search);
    trackEventOnce(`pricing_viewed:${window.location.pathname}:${window.location.search}`, "pricing_viewed", {
      language: lang,
      user_state: analyticsUserStateFrom(user),
      source_page: params.get("source") || document.referrer || "direct",
      certification_slug: params.get("certification_slug"),
    });
    // Stesso evento anche nel funnel V2 (DB), una volta per sessione e pagina:
    // serve al KPI pricing/package viewed per certificazione.
    const origin = resolveCommercialOrigin(window.location.search);
    trackFunnelEventOnce(`pricing_viewed:${window.location.pathname}:${params.get("certification_slug") || ""}`, {
      event: "pricing_viewed",
      cert_slug: origin.originCertSlug,
      lang,
      paywall_type: origin.paywallType,
      metadata: { source_page: params.get("source") || "direct", ...(origin.ctaId ? { cta_id: origin.ctaId } : {}) },
    });
    setIsPromoLink((params.get("promo") || "").toLowerCase() === "thanks1month");
  }, [authLoading, lang, user, consentStatus]);

  function selectPlan(plan: Plan) {
    setSelectedPlan(plan);
    trackEvent("pricing_plan_selected", {
      language: lang,
      user_state: analyticsUserStateFrom(user),
      plan_type: plan,
      source_page: "pricing",
    });
  }

  // Ritorno da login/registrazione (anche Google): riprende il checkout col piano scelto.
  // Parte da solo SOLO se URL (?resume=1&plan=) e intenzione salvata in questa scheda
  // coincidono; altrimenti preseleziona il piano e lascia premere il pulsante.
  // I parametri vengono tolti dall'URL subito: "Indietro" dal pagamento Stripe non rilancia nulla.
  // Subito dopo l'accesso l'utente puo' non essere ancora caricato (token appena salvato, sessione
  // recuperata dal refresh cookie): si aspetta fino a RESUME_WAIT_MS, poi si rinuncia senza avviare nulla.
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (authLoading || resumeHandledRef.current || detectTwa()) return;
    const search = window.location.search;
    if (new URLSearchParams(search).get("resume") !== "1") return;
    const finish = () => window.history.replaceState(null, "", `${window.location.pathname}${stripResumeParams(search)}${window.location.hash}`);
    if (!user) {
      if (!resumeTimerRef.current) {
        resumeTimerRef.current = setTimeout(() => {
          if (resumeHandledRef.current) return;
          resumeHandledRef.current = true;
          consumeCheckoutIntent();
          finish();
        }, RESUME_WAIT_MS);
      }
      return;
    }
    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = null;
    }
    resumeHandledRef.current = true;
    const intent = consumeCheckoutIntent();
    const { decision, plan } = decideResume({ search, authenticated: true, alreadyPremium: !!authPremium, intent });
    finish();
    if (decision === "none" || !plan) return;
    setSelectedPlan(plan);
    if (decision === "auto") void startPremiumCheckout({ plan, auto: true });
    else setNotice(t.resumeManual);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, user, authPremium]);
  useEffect(
    () => () => {
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = null;
    },
    []
  );

  // Tornando indietro da Stripe la pagina puo' riapparire dalla cache con il pulsante bloccato.
  useEffect(() => {
    const onShow = (event: PageTransitionEvent) => {
      if (!event.persisted) return;
      inFlightRef.current = false;
      setIsLoading(false);
    };
    window.addEventListener("pageshow", onShow);
    return () => window.removeEventListener("pageshow", onShow);
  }, []);

  // Leva costo-sommerso: mostra quante spiegazioni gratuite l'utente free ha già usato.
  // Solo dato reale (via /me/explanation-status), niente stime o numeri inventati.
  useEffect(() => {
    if (detectTwa()) return;
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

  // Visitatore anonimo: nessuna chiamata a Stripe e nessun checkout. Si conserva
  // l'intenzione e si va al login (che offre anche registrazione e Google) con
  // ritorno qui: al ritorno la pagina riprende da sola (vedi useEffect di ripresa).
  function goToAuth(plan: Plan, origin: CommercialOrigin) {
    const params = new URLSearchParams(window.location.search);
    trackEvent("checkout_auth_required", {
      language: lang,
      user_state: analyticsUserStateFrom(user),
      plan_type: plan,
      purchase_type: "subscription",
      source_page: "pricing",
    });
    trackFunnelEvent({
      event: "checkout_auth_required",
      cert_slug: origin.originCertSlug,
      lang,
      plan,
      paywall_type: origin.paywallType,
      metadata: {
        plan,
        purchase_type: "subscription",
        source_page: "pricing",
        ...(origin.originCertSlug ? { origin_cert_slug: origin.originCertSlug } : {}),
        ...(origin.ctaId ? { origin_cta_id: origin.ctaId } : {}),
      },
    });
    saveCheckoutIntent({
      plan,
      promo: params.get("promo"),
      originCertSlug: origin.originCertSlug,
      paywallSource: params.get("source"),
      ctaId: origin.ctaId,
    });
    const resumePath = buildResumePath(pathname || "/pricing", window.location.search, plan);
    window.location.assign(buildLoginHref(lang, resumePath));
  }

  async function openPaymentPortal() {
    if (portalBusy) return;
    setPortalBusy(true);
    setPortalFailed(false);
    const result = await requestPortalUrl(() => authFetch("/api/backend/billing/create-portal-session", { method: "POST" }));
    if (result.ok) {
      window.location.href = result.url;
      return;
    }
    setPortalFailed(true);
    setPortalBusy(false);
  }

  async function startPremiumCheckout(opts: { plan?: Plan; auto?: boolean } = {}) {
    if (isLoading || inFlightRef.current) return;
    const plan: Plan = opts.plan ?? selectedPlan;
    // Il link promo si legge dall'URL: in una ripresa automatica lo stato isPromoLink non e' ancora aggiornato.
    const promoActive = isPromoLink || (new URLSearchParams(window.location.search).get("promo") || "").toLowerCase() === "thanks1month";
    setNotice(null);
    setPaymentIssue(false);
    // "Anonimo" solo a stato di autenticazione risolto E senza token: durante il caricamento (o con un
    // token gia' salvato ma utente non ancora letto) si procede come prima e decide il backend (401).
    if (!user && !authLoading && !getToken()) {
      inFlightRef.current = true; // un secondo click mentre si naviga al login non rifa' nulla
      goToAuth(plan, resolveCommercialOrigin(window.location.search));
      return;
    }
    if (!isCheckoutAllowedHost(window.location.hostname)) {
      // Preview/host di prova: il backend e' quello LIVE. Nessuna sessione di pagamento.
      setNotice(CHECKOUT_BLOCKED_NOTICE);
      return;
    }
    inFlightRef.current = true;
    try {
      setIsLoading(true);
      const postGateCohort = user?.id != null ? readPostGateCohort(user.id) : null;
      // Certificazione e paywall da cui e' partito il percorso: restano separati
      // dal prodotto (il piano) lungo checkout_started -> checkout_created -> acquisto.
      const origin = resolveCommercialOrigin(window.location.search);
      trackEvent("checkout_attempted", {
        language: lang,
        user_state: analyticsUserStateFrom(user),
        plan_type: plan,
        certification_slug: origin.originCertSlug,
        purchase_type: "subscription",
        source_page: "pricing",
        gate_instance_id: postGateCohort?.gateInstanceId ?? null,
      });
      trackFunnelEvent({
        event: "checkout_attempted",
        cert_slug: origin.originCertSlug,
        lang,
        plan: plan,
        paywall_type: origin.paywallType,
        gate_instance_id: postGateCohort?.gateInstanceId ?? null,
        metadata: {
          plan: plan,
          product_type: plan,
          purchase_type: "subscription",
          source_page: "pricing",
          ...(origin.originCertSlug ? { origin_cert_slug: origin.originCertSlug } : {}),
          ...(origin.ctaId ? { origin_cta_id: origin.ctaId } : {}),
        },
      });

      trackMetaPixel("InitiateCheckout", {
        value: PREMIUM_PLAN_VALUES[plan],
        currency: "EUR",
      });

      const checkoutContext = await checkoutRequest(`premium:${plan}:${lang}:${promoActive}:${origin.originCertSlug || ""}:${origin.paywallType || ""}:${postGateCohort?.gateInstanceId || ""}`);
      const res = await authFetch("/api/backend/billing/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-lang": lang },
        body: JSON.stringify({
          lang,
          plan: plan,
          skipTrial: promoActive,
          checkout_request_id: checkoutContext.requestId,
          // Identificatori analytics (non usati per autenticazione/entitlement):
          // permettono al webhook Stripe di riportare session_id/visitor_id/
          // gate_instance_id sui funnel_events di conversione. user_id resta
          // risolto server-side da authMiddleware, non da qui.
          analytics: checkoutContext.analytics,
          session_id: getAnonymousSessionId() ?? null,
          visitor_id: getAnonymousVisitorId() ?? null,
          gate_instance_id: postGateCohort?.gateInstanceId ?? null,
          origin_cert_slug: origin.originCertSlug,
          paywall_type: origin.paywallType,
        }),
      });

      if (res.status === 401) {
        // Sessione scaduta mentre la pagina era aperta. Dopo una ripresa automatica
        // NON si rimanda al login (niente giro infinito): si avvisa e basta.
        inFlightRef.current = false;
        setIsLoading(false);
        if (opts.auto) {
          setNotice(t.resumeExpired);
          return;
        }
        goToAuth(plan, origin);
        return;
      }

      const data: { url?: string; sessionId?: string; error?: string; code?: string } = await res.json();
      if (isPaymentIssueCheckoutResponse(res.status, data)) {
        // Rifiuto atteso del backend (esiste gia' un abbonamento): non e' un errore generico, non si crea un secondo abbonamento.
        setPaymentIssue(true);
        inFlightRef.current = false;
        setIsLoading(false);
        return;
      }
      if (!res.ok || !data?.url) throw new Error(data?.error || "Failed");


      trackCheckoutCreated(data.sessionId, {purchase_type:"subscription", plan_type:plan, certification_slug:origin.originCertSlug, language:lang});
      window.location.href = data.url;
    } catch (err) {
      console.error("Premium checkout error:", err);
      alert(t.checkoutError);
      inFlightRef.current = false;
      setIsLoading(false);
    }
  }

  const startCheckout = () => startPremiumCheckout();

  return (
    <main className="mx-auto max-w-6xl px-4 pt-8 pb-28 md:py-10">
      <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">

        {/* Hero */}
        <section className="border-b border-gray-200 bg-gradient-to-b from-gray-50 to-white px-4 py-8 sm:px-6">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-semibold text-gray-700">
              <span className="h-2 w-2 rounded-full bg-emerald-600" />
              {t.badge}
            </div>
          </div>

          <h1 className="mt-4 max-w-3xl text-2xl font-semibold leading-tight tracking-tight text-gray-900 sm:text-4xl">
            {t.title}
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-gray-700 sm:text-base">{t.subtitle}</p>

          <ul className="mt-4 max-w-2xl space-y-1.5">
            {t.lossPoints.map((point, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                <span aria-hidden="true" className="mt-0.5 text-emerald-700">✓</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>

          {/* Selettore piani */}
          <PlanSelector plans={t.plans} selected={selectedPlan} onChange={selectPlan} popularLabel={t.popularLabel} />

          {!isPromoLink && <p className="mt-3 max-w-3xl text-sm text-gray-700">{t.pizzaLine}</p>}

          {notice && (
            <p role="alert" className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-900">
              {notice}
            </p>
          )}

          {paymentIssue && (
            <PaymentRecoveryNotice lang={lang} message="checkoutBlocked" onOpenPortal={openPaymentPortal} busy={portalBusy} failed={portalFailed} />
          )}

          {explanationsUsed && (
            <ExplanationsUsedNote t={t} used={explanationsUsed.used} limit={explanationsUsed.limit} />
          )}

          {selectedPlan === "premium_monthly" && !isPromoLink && (
            <p role="note" className="mt-3 max-w-3xl border-l-2 border-gray-300 pl-3 text-xs leading-relaxed text-gray-700 sm:text-sm">{t.trialPdfNotice}</p>
          )}

          {/* CTA principale */}
          <div ref={heroCtaRef}>
            <CtaBlock t={t} activePlan={activePlan} isLoading={isLoading} isPromoLink={isPromoLink} onCta={startCheckout} />
          </div>

          <TrustStrip s={story} />
        </section>

        <div className="px-4 py-6 sm:px-6">
          {/* Percorso di valore: dallo studio gratuito a cio' che aggiunge Premium. */}
          <ValueJourney s={story}>
            <CtaBlock t={t} activePlan={activePlan} isLoading={isLoading} isPromoLink={isPromoLink} onCta={startCheckout} />
          </ValueJourney>

          {/* Cosa include */}
          <section className="mt-8" aria-labelledby="premium-features">
            <h2 id="premium-features" className="mb-3 text-lg font-semibold text-gray-900">{t.featuresTitle}</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <FeatureCard title={t.features[0].h} desc={t.features[0].p} variant="blue" />
              <FeatureCard title={t.features[1].h} desc={t.features[1].p} variant="purple" />
              <FeatureCard title={t.features[2].h} desc={t.features[2].p} variant="amber" />
              <FeatureCard title={t.features[3].h} desc={t.features[3].p} variant="green" />
            </div>
          </section>

          <ComparisonTable t={t} s={story} onCta={startCheckout} isLoading={isLoading} activePlan={activePlan} isPromoLink={isPromoLink} />

          <PriceClarity t={t} isPromoLink={isPromoLink} />

          <PricingFaq t={t} />

          <PackagesUpsell lang={lang} />

          <BusinessBanner t={t} href={BUSINESS_HREF[lang]} />

          {/* CTA finale */}
          <div ref={finalCtaRef} className="mt-8 rounded-2xl border border-gray-200 bg-gray-50 p-5 text-center sm:p-6">
            <p className="text-base font-semibold text-gray-900">{t.finalLine}</p>
            <PlanSelector plans={t.plans} selected={selectedPlan} onChange={selectPlan} popularLabel={t.popularLabel} />
            <div className="mt-5 flex flex-col items-center">
              {isMonthly && (
                <p className="mb-2 text-sm font-medium text-emerald-800">🎁 {isPromoLink ? t.promoNote : t.trialNote}</p>
              )}
              <button
                type="button"
                onClick={startCheckout}
                disabled={isLoading}
                className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60 sm:w-auto"
              >
                {isLoading ? t.ctaLoading : t.cta}
              </button>
              {!(isMonthly && isPromoLink) && (
                <p className="mt-2 text-xs text-gray-600">
                  {isMonthly ? t.subCtaMonthly : t.subCta}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {showStickyCta && (
        <StickyCtaBar t={t} s={story} isAnonymous={isAnonymous} activePlan={activePlan} isPromoLink={isPromoLink} isLoading={isLoading} onCta={startCheckout} />
      )}
    </main>
  );
}

/**
 * Punto di ingresso della pagina pricing. Nell'app Android (TWA) l'acquisto non e'
 * disponibile (app "consumption-only" per Google Play): al posto del listino e del
 * checkout Stripe si mostra un avviso neutro. Sul web non cambia nulla.
 */
export default function PremiumComingSoonView(props: Props) {
  const isTwa = useTwa();
  const pathname = usePathname();
  if (isTwa) {
    return <TwaNotice lang={props.forceLang ?? localeFromPathname(pathname)} variant="section" />;
  }
  return <PremiumPricingView {...props} />;
}
