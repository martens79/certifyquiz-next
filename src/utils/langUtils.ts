// src/utils/langUtils.ts
import React, { isValidElement } from "react";
import { locales as ALL_LOCALES, type Locale } from "@/lib/i18n";

/** Per compatibilità con il resto del codice */
export const SUPPORTED_LANGS = ALL_LOCALES;

/** Rileva la lingua dal path (prima segment) */
export function getCurrentLangFromPath(path = "/"): Locale {
  try {
    const seg = path.split("?")[0].split("#")[0].split("/").filter(Boolean)[0]?.toLowerCase() || "";
    return (ALL_LOCALES as readonly string[]).includes(seg) ? (seg as Locale) : "it";
  } catch {
    return "it";
  }
}

/** Rileva la lingua in runtime (client); fallback IT lato server */
export function getCurrentLang(): Locale {
  if (typeof window === "undefined") return "it";
  return getCurrentLangFromPath(window.location?.pathname || "/");
}

/** Parse sicuro di un oggetto JSON (solo object “puro”) */
function tryParseJSONObject(s: unknown): Record<string, unknown> | null {
  if (typeof s !== "string") return null;
  const t = s.trim();
  if (!(t.startsWith("{") && t.endsWith("}"))) return null;
  try {
    const o = JSON.parse(t) as unknown;
    return o && typeof o === "object" && !Array.isArray(o) ? (o as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

/** Type guard: è un ReactElement? */
function isReactEl(x: unknown): x is React.ReactElement {
  return !!x && isValidElement(x);
}

/** ReactElement con props.children opzionale (evita l’errore su props: {}) */
type ReactElementWithChildren = React.ReactElement & {
  props?: { children?: unknown };
};

/** Strategia di pick: lang → it → resto → primo non null */
function pickI18nValue(obj: Record<string, unknown>, lang: Locale) {
  const order: string[] = [lang, "it", ...ALL_LOCALES.filter((l) => l !== lang && l !== "it")];
  for (const k of order) {
    if (obj[k] != null) return obj[k];
  }
  for (const v of Object.values(obj)) {
    if (v != null) return v;
  }
  return "";
}

/** Estrae testo “umano” da valori eterogenei */
function extractText(node: unknown): string {
  if (node == null) return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join(" ");
  if (isReactEl(node)) {
    const el = node as ReactElementWithChildren;
    return extractText(el.props?.children);
  }
  if (typeof node === "object") return "";
  return String(node ?? "");
}

/**
 * getLabel:
 * - input: string | number | JSX | object i18n | stringa JSON i18n
 * - output: string | JSX (se l’input è JSX)
 */
export function getLabel(
  input: unknown,
  lang?: Locale
): string | number | React.ReactElement | React.ReactNode {
  const _lang = lang || getCurrentLang();
  if (input == null) return "";

  // Se è già JSX lo restituiamo così com’è (il caller potrà renderizzarlo)
  if (isReactEl(input)) return input;

  // Oggetto i18n (non array)
  if (typeof input === "object" && !Array.isArray(input)) {
    const picked = pickI18nValue(input as Record<string, unknown>, _lang);
    if (isReactEl(picked)) return picked;
    if (typeof picked === "string" || typeof picked === "number") return picked;
    return "";
  }

  // Stringa potenzialmente JSON-i18n
  if (typeof input === "string") {
    const parsed = tryParseJSONObject(input);
    if (parsed) return getLabel(parsed, _lang);
    return input;
  }

  // Numeri / altre primitive
  return String(input);
}

/** come getLabel ma garantisce una stringa */
export function safeLabel(input: unknown, lang?: Locale): string {
  const v = getLabel(input, lang);
  if (isReactEl(v)) return extractText(v);
  if (Array.isArray(v)) return v.map(extractText).join(" ");
  if (typeof v === "string" || typeof v === "number") return String(v);
  return extractText(v);
}

// ==================== STATIC LABELS ====================
export const STATIC_LABELS = {
  quiz: { it: "Quiz", en: "Quiz", fr: "Quiz", es: "Quiz" },
  certificationLabel: { it: "Certificazione:", en: "Certification:", fr: "Certification :", es: "Certificación:" },
  topicLabel: { it: "Topic:", en: "Topic:", fr: "Sujet :", es: "Tema:" },

  trainingMode: { it: "Allenamento", en: "Training", fr: "Entraînement", es: "Entrenamiento" },
  examMode: { it: "Esame", en: "Exam", fr: "Examen", es: "Examen" },
  trainingModeTitle: { it: "Modalità Allenamento", en: "Training mode", fr: "Mode entraînement", es: "Modo entrenamiento" },
  examModeTitle: { it: "Modalità Esame", en: "Exam mode", fr: "Mode examen", es: "Modo examen" },

  loadingQuestions: { it: "⏳ Caricamento domande…", en: "⏳ Loading questions…", fr: "⏳ Chargement des questions…", es: "⏳ Cargando preguntas…" },
  quizLoadError: { it: "Errore nel caricamento del quiz", en: "Error loading the quiz", fr: "Erreur lors du chargement du quiz", es: "Error al cargar el cuestionario" },

  answerCorrect: { it: "✅ Risposta corretta!", en: "✅ Correct answer!", fr: "✅ Bonne réponse !", es: "✅ ¡Respuesta correcta!" },
  wrongAnswerCorrect: {
    it: "❌ Risposta errata. Corretta: “{answer}”",
    en: "❌ Wrong answer. Correct: “{answer}”",
    fr: "❌ Mauvaise réponse. Correcte : « {answer} »",
    es: "❌ Respuesta incorrecta. Correcta: «{answer}»",
  },

  explanationLabel: { it: "💡 Spiegazione:", en: "💡 Explanation:", fr: "💡 Explication :", es: "💡 Explicación:" },
  premiumExplanation: {
    it: "🔒 Spiegazione disponibile solo per utenti Premium",
    en: "🔒 Explanation available only for Premium users",
    fr: "🔒 Explication disponible uniquement pour les utilisateurs Premium",
    es: "🔒 Explicación disponible solo para usuarios Premium",
  },
  noExplanation: {
    it: "ℹ️ Nessuna spiegazione disponibile per questa domanda.",
    en: "ℹ️ No explanation available for this question.",
    fr: "ℹ️ Aucune explication disponible pour cette question.",
    es: "ℹ️ No hay explicación disponible para esta pregunta.",
  },
  explanationComingSoon: {
    it: "ℹ️ Spiegazione in arrivo.",
    en: "ℹ️ Explanation coming soon.",
    fr: "ℹ️ Explication à venir.",
    es: "ℹ️ Explicación próximamente.",
  },

  wasQuestionHelpful: { it: "Questa domanda era chiara e utile?", en: "Was this question clear and useful?", fr: "Cette question était-elle claire et utile ?", es: "¿Esta pregunta fue clara y útil?" },
  yes: { it: "Sì", en: "Yes", fr: "Oui", es: "Sí" },
  no: { it: "No", en: "No", fr: "Non", es: "No" },
  thanksForFeedback: { it: "✅ Grazie per il tuo feedback!", en: "✅ Thanks for your feedback!", fr: "✅ Merci pour votre retour !", es: "✅ ¡Gracias por tu comentario!" },

  reviewLater: { it: "📌 Rivedi dopo", en: "📌 Review later", fr: "📌 Revoir plus tard", es: "📌 Revisar más tarde" },
  removedFromReview: { it: "✅ Rimosso da rivedere", en: "✅ Removed from review", fr: "✅ Retiré de la relecture", es: "✅ Quitado de revisión" },

  newQuiz: { it: "🔄 Nuovo quiz", en: "🔄 New quiz", fr: "🔄 Nouveau quiz", es: "🔄 Nuevo cuestionario" },
  submitQuiz: { it: "✅ Invia quiz", en: "✅ Submit quiz", fr: "✅ Envoyer le quiz", es: "✅ Enviar cuestionario" },

  examResultTitle: { it: "🎉 Risultato dell'Esame", en: "🎉 Exam Result", fr: "🎉 Résultat de l’examen", es: "🎉 Resultado del examen" },
  youScoredOf: {
    it: "Hai totalizzato {score} su {total} domande.",
    en: "You scored {score} out of {total} questions.",
    fr: "Vous avez obtenu {score} sur {total} questions.",
    es: "Has obtenido {score} de {total} preguntas.",
  },
  examPassed: { it: "✅ Esame superato!", en: "✅ Exam passed!", fr: "✅ Examen réussi !", es: "✅ ¡Examen aprobado!" },
  examFailed: { it: "❌ Esame non superato", en: "❌ Exam not passed", fr: "❌ Examen non réussi", es: "❌ Examen no aprobado" },
  badgeEarned: {
    it: "🏅 Congratulazioni! Hai ottenuto un badge per questa certificazione!",
    en: "🏅 Congratulations! You earned a badge for this certification!",
    fr: "🏅 Félicitations ! Vous avez obtenu un badge pour cette certification !",
    es: "🏅 ¡Felicidades! ¡Has obtenido una insignia para esta certificación!",
  },
  wrongQuestionsCount: {
    it: "Domande sbagliate: {n} su {total}",
    en: "Wrong answers: {n} out of {total}",
    fr: "Mauvaises réponses : {n} sur {total}",
    es: "Respuestas incorrectas: {n} de {total}",
  },
  goToProfile: { it: "Vai al Profilo", en: "Go to Profile", fr: "Aller au profil", es: "Ir al perfil" },
  quizHome: { it: "Quiz Home", en: "Quiz Home", fr: "Accueil Quiz", es: "Inicio Quiz" },
  explanationsTitle: { it: "🔍 Spiegazioni delle Domande", en: "🔍 Question Explanations", fr: "🔍 Explications des questions", es: "🔍 Explicaciones de las preguntas" },

  navHome: { it: "Home", en: "Home", fr: "Accueil", es: "Inicio" },
  navQuiz: { it: "Quiz", en: "Quiz", fr: "Quiz", es: "Quiz" },
  navProfile: { it: "Profilo", en: "Profile", fr: "Profil", es: "Perfil" },

  topicsLoadError: {
    it: "Errore nel caricamento degli argomenti.",
    en: "Error loading topics.",
    fr: "Erreur lors du chargement des sujets.",
    es: "Error al cargar los temas.",
  },
  topicsOnlyItalian: {
    it: "I quiz sono disponibili solo in italiano per questa certificazione.",
    en: "🚧 Quizzes are only available in Italian for this certification.",
    fr: "🚧 Les quiz ne sont disponibles qu'en italien pour cette certification.",
    es: "🚧 Los cuestionarios solo están disponibles en italiano para esta certificación.",
  },
  topicsAvailable: {
    it: "✅ Disponibili alcuni argomenti in questa lingua:",
    en: "✅ Available topics in this language:",
    fr: "✅ Sujets disponibles dans cette langue :",
    es: "✅ Temas disponibles en este idioma:",
  },
  topicsNone: {
    it: "Nessun argomento disponibile per questa certificazione.",
    en: "No topics available for this certification.",
    fr: "Aucun sujet disponible pour cette certification.",
    es: "No hay temas disponibles para esta certificación.",
  },
  mixedQuiz: {
    it: "Quiz Misti",
    en: "Mixed Quiz",
    fr: "Quiz mixtes",
    es: "Cuestionarios mixtos",
  },
  mixedQuizDesc: {
    it: "Domande casuali da più argomenti della certificazione.",
    en: "Random questions across multiple topics.",
    fr: "Questions aléatoires sur plusieurs sujets.",
    es: "Preguntas aleatorias de varios temas.",
  },
} as const;

function interpolate(template: string, vars: Record<string, string | number> = {}) {
  return template.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? `{${k}}`));
}

/** t(): sempre string — se la label è JSX, estraiamo testo leggibile */
export function t(
  key: keyof typeof STATIC_LABELS,
  lang?: Locale,
  vars?: Record<string, string | number>
): string {
  const _lang = lang || getCurrentLang();
  const labelObj = STATIC_LABELS[key];
  const raw = getLabel(labelObj, _lang);
  const s = typeof raw === "string" || typeof raw === "number" ? String(raw) : extractText(raw);
  return interpolate(s, vars || {});
}
