import type { Locale } from "@/lib/quiz-types";

export const APPLE_DEVICE_SUPPORT_SLUG = "apple-device-support";
export const APPLE_DEVICE_SUPPORT_MOCK_NOTICE: Record<Locale, string> = {
  it: "Simulazione d'esame non disponibile per questo primo pacchetto. Usa i quiz per topic o l'allenamento misto; le domande non vengono ripetute per riempire una simulazione.",
  en: "Mock exam unavailable for this first package. Use topic quizzes or mixed training; questions are not repeated to fill a simulation.",
  fr: "Examen blanc indisponible pour ce premier package. Utilisez les quiz par sujet ou l'entraînement mixte ; les questions ne sont pas répétées pour remplir une simulation.",
  es: "Simulación de examen no disponible para este primer paquete. Usa quizzes por tema o entrenamiento mixto; no se repiten preguntas para completar una simulación.",
};
