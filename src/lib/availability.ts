// src/lib/availability.ts
export type AvailabilityMap = Record<string, { translated: number; total: number }>;

export type Locale = "it" | "en" | "fr" | "es";

export function smartBadgeLabelFor(
  lang: Locale,
  rec?: { translated: number; total: number }
): string | undefined {
  if (!rec) return undefined;
  const { translated, total } = rec;

  if (total > 0 && translated >= total) {
    const L: Record<Locale, string> = {
      en: "All topics",
      fr: "Tous les sujets",
      es: "Todos los temas",
      it: "Tutti i topic",
    };
    return `✓ ${L[lang]}`;
  }

  const n = translated || 0;
  const fmt =
    lang === "it"
      ? n === 1
        ? "1 topic"
        : `${n} topic`
      : lang === "fr"
      ? n === 1
        ? "1 sujet"
        : `${n} sujets`
      : lang === "es"
      ? n === 1
        ? "1 tema"
        : `${n} temas`
      : n === 1
      ? "1 topic"
      : `${n} topics`;

  return `✔ ${fmt}`;
}
