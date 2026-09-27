// src/lib/commercial-packages.ts
// Copy commerciale dei pacchetti per singola certificazione, indipendente dal
// product_code interno. I codici DB (dolphin-study / octopus-complete) restano
// stabili lato backend; l'utente vede solo "<Cert> Complete" / "<Cert> Study".
// Nessun nome interno (Dolphin/Octopus) deve comparire in UI.

import type { Locale } from "@/lib/paths";

export type PackageKind = "complete" | "study" | "unknown";

export function packageKind(productCode: string | null | undefined): PackageKind {
  if (productCode === "octopus-complete") return "complete";
  if (productCode === "dolphin-study") return "study";
  return "unknown";
}

const NAME_SUFFIX: Record<PackageKind, Record<Locale, string>> = {
  complete: { it: "Complete", en: "Complete", fr: "Complete", es: "Complete" },
  study: { it: "Study", en: "Study", fr: "Study", es: "Study" },
  unknown: { it: "Pack", en: "Pack", fr: "Pack", es: "Pack" },
};

/** "CCNA Complete", "CCNA Study". Senza nome certificazione: "Complete Pass". */
export function packageDisplayName(
  productCode: string | null | undefined,
  certificationName: string | null | undefined,
  lang: Locale
): string {
  const suffix = NAME_SUFFIX[packageKind(productCode)][lang];
  const cert = String(certificationName || "").trim();
  return cert ? `${cert} ${suffix}` : `${suffix} Pass`;
}

const TAGLINE: Record<PackageKind, Record<Locale, string>> = {
  complete: {
    it: "Tutto per superare l'esame: teoria, pratica e simulazioni con correzione",
    en: "Everything to pass the exam: theory, practice and reviewed simulations",
    fr: "Tout pour réussir l'examen : théorie, pratique et simulations corrigées",
    es: "Todo para aprobar el examen: teoría, práctica y simulaciones corregidas",
  },
  study: {
    it: "Banca domande e materiale di studio",
    en: "Question bank and study material",
    fr: "Banque de questions et supports d'étude",
    es: "Banco de preguntas y material de estudio",
  },
  unknown: { it: "", en: "", fr: "", es: "" },
};

export function packageTagline(productCode: string | null | undefined, lang: Locale): string {
  return TAGLINE[packageKind(productCode)][lang];
}

const VALIDITY: Record<Locale, { days: (n: number) => string; lifetime: string; oneTime: string }> = {
  it: {
    days: (n) => `Accesso valido ${n} giorni`,
    lifetime: "Accesso senza scadenza ai contenuti inclusi",
    oneTime: "pagamento unico, nessun abbonamento",
  },
  en: {
    days: (n) => `Access valid for ${n} days`,
    lifetime: "No-expiry access to included content",
    oneTime: "one-time payment, no subscription",
  },
  fr: {
    days: (n) => `Accès valable ${n} jours`,
    lifetime: "Accès sans expiration aux contenus inclus",
    oneTime: "paiement unique, sans abonnement",
  },
  es: {
    days: (n) => `Acceso válido durante ${n} días`,
    lifetime: "Acceso sin caducidad al contenido incluido",
    oneTime: "pago único, sin suscripción",
  },
};

/** La durata arriva dal backend (offerta): mai hardcoded qui. */
export function accessValidityLabel(days: number | null | undefined, lang: Locale): string {
  const n = Number(days);
  return Number.isInteger(n) && n > 0 ? VALIDITY[lang].days(n) : VALIDITY[lang].lifetime;
}

export function oneTimePaymentLabel(lang: Locale): string {
  return VALIDITY[lang].oneTime;
}

const LOCALE_TAG: Record<Locale, string> = { it: "it-IT", en: "en-IE", fr: "fr-FR", es: "es-ES" };

export function formatAccessDate(value: string | null | undefined, lang: Locale): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat(LOCALE_TAG[lang], { day: "numeric", month: "long", year: "numeric" }).format(date);
}

const ACTIVE_UNTIL: Record<Locale, (d: string) => string> = {
  it: (d) => `Attivo fino al ${d}`,
  en: (d) => `Active until ${d}`,
  fr: (d) => `Actif jusqu'au ${d}`,
  es: (d) => `Activo hasta el ${d}`,
};

export function activeUntilLabel(value: string | null | undefined, lang: Locale): string | null {
  const formatted = formatAccessDate(value, lang);
  return formatted ? ACTIVE_UNTIL[lang](formatted) : null;
}

export type PackageResourceCounts = {
  questionCount?: number | null;
  labCount?: number | null;
  scenarioCount?: number | null;
  guidePages?: number | null;
  mapPages?: number | null;
};

const FEATURE: Record<Locale, {
  questions: (n: string) => string; questionBank: string; explanations: string; mockReview: string;
  mistakes: string; examMode: string; reviews: string; labs: (n: number) => string;
  scenarios: (n: number) => string; guide: (n: number) => string; maps: (n: number) => string;
}> = {
  it: {
    questions: (n) => `Banca domande completa: ${n} domande`, questionBank: "Banca domande completa",
    explanations: "Spiegazioni complete senza limiti", mockReview: "Mock Review: correzione domanda per domanda",
    mistakes: "Ripasso degli errori", examMode: "Simulazioni d'esame", reviews: "Ripassi per argomento",
    labs: (n) => `${n} Interactive Labs`, scenarios: (n) => `${n} scenari pratici`,
    guide: (n) => `Guida PDF · ${n} pagine`, maps: (n) => `Mappe concettuali · ${n} pagine`,
  },
  en: {
    questions: (n) => `Complete question bank: ${n} questions`, questionBank: "Complete question bank",
    explanations: "Unlimited full explanations", mockReview: "Mock Review: question-by-question feedback",
    mistakes: "Mistake review", examMode: "Exam simulations", reviews: "Topic reviews",
    labs: (n) => `${n} Interactive Labs`, scenarios: (n) => `${n} practice scenarios`,
    guide: (n) => `PDF guide · ${n} pages`, maps: (n) => `Concept maps · ${n} pages`,
  },
  fr: {
    questions: (n) => `Banque de questions complète : ${n} questions`, questionBank: "Banque de questions complète",
    explanations: "Explications complètes illimitées", mockReview: "Mock Review : correction question par question",
    mistakes: "Révision des erreurs", examMode: "Simulations d'examen", reviews: "Révisions par thème",
    labs: (n) => `${n} labs interactifs`, scenarios: (n) => `${n} scénarios pratiques`,
    guide: (n) => `Guide PDF · ${n} pages`, maps: (n) => `Cartes conceptuelles · ${n} pages`,
  },
  es: {
    questions: (n) => `Banco de preguntas completo: ${n} preguntas`, questionBank: "Banco de preguntas completo",
    explanations: "Explicaciones completas ilimitadas", mockReview: "Mock Review: corrección pregunta por pregunta",
    mistakes: "Repaso de errores", examMode: "Simulaciones de examen", reviews: "Repasos por tema",
    labs: (n) => `${n} labs interactivos`, scenarios: (n) => `${n} escenarios prácticos`,
    guide: (n) => `Guía PDF · ${n} páginas`, maps: (n) => `Mapas conceptuales · ${n} páginas`,
  },
};

const positive = (v: number | null | undefined) => (Number.isFinite(Number(v)) && Number(v) > 0 ? Number(v) : 0);

/**
 * Elenco vantaggi mostrato sulla card. Mostra solo risorse che esistono per la
 * certificazione (conteggi reali da /certifications/:slug/resources) e solo le
 * capability che il pacchetto include davvero lato backend:
 *   Complete: quiz, explanation, exam_mode, review, mistake_review, mock_review,
 *             scenario, lab, guide, map
 *   Study:    quiz, review, guide, map (niente spiegazioni/lab/mock review)
 */
export function packageFeatures(productCode: string | null | undefined, counts: PackageResourceCounts, lang: Locale): string[] {
  const t = FEATURE[lang];
  const kind = packageKind(productCode);
  const questions = positive(counts.questionCount);
  const out: string[] = [questions ? t.questions(questions.toLocaleString(LOCALE_TAG[lang])) : t.questionBank];
  if (kind === "complete") {
    out.push(t.explanations, t.mockReview, t.mistakes, t.examMode);
    const labs = positive(counts.labCount);
    const scenarios = positive(counts.scenarioCount);
    if (labs) out.push(t.labs(labs));
    if (scenarios) out.push(t.scenarios(scenarios));
  } else {
    out.push(t.reviews);
  }
  const guidePages = positive(counts.guidePages);
  const mapPages = positive(counts.mapPages);
  if (guidePages) out.push(t.guide(guidePages));
  if (mapPages) out.push(t.maps(mapPages));
  return out;
}
