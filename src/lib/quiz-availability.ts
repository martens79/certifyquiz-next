export function hasQuizInventory(count: number | null | undefined): boolean {
  return typeof count === "number" && Number.isFinite(count) && count > 0;
}
export const unavailableQuizLabels = {
  en: "Questions not available yet",
  it: "Domande non ancora disponibili",
  fr: "Questions pas encore disponibles",
  es: "Preguntas aún no disponibles",
} as const;
