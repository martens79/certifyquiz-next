import type { Locale } from "@/lib/quiz-types";

const BLUEPRINT_UNAVAILABLE: Record<Locale, string> = {
  it: "La simulazione d’esame non è temporaneamente disponibile per questa lingua. Riprova più tardi.",
  en: "The mock exam is temporarily unavailable for this language. Please try again later.",
  fr: "L’examen blanc est temporairement indisponible dans cette langue. Veuillez réessayer plus tard.",
  es: "La simulación de examen no está disponible temporalmente en este idioma. Inténtalo de nuevo más tarde.",
};

export function getMockExamLoadError(error: unknown, lang: Locale): string | null {
  const detail = (error as { detail?: { code?: unknown } } | null)?.detail;
  return detail?.code === "CEH_BLUEPRINT_POOL_TOO_SMALL"
    ? BLUEPRINT_UNAVAILABLE[lang] ?? BLUEPRINT_UNAVAILABLE.en
    : null;
}
