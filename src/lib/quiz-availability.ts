export function hasQuizInventory(count: number | null | undefined): boolean {
  return typeof count === "number" && Number.isFinite(count) && count > 0;
}
export const unavailableQuizLabels = {
  en: "Questions not available yet",
  it: "Domande non ancora disponibili",
  fr: "Questions pas encore disponibles",
  es: "Preguntas aún no disponibles",
} as const;

/**
 * Stato dell'inventario domande di una certificazione.
 * - "available": almeno una domanda;
 * - "zero": il backend ha risposto e dice 0;
 * - "unknown": non lo sappiamo (fetch fallita, 429, timeout): NON e' "zero".
 */
export type QuizInventory =
  | { state: "available"; count: number }
  | { state: "zero" }
  | { state: "unknown" };

const isCount = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value) && value >= 0;

/** Prende la prima fonte con un conteggio numerico, in ordine di priorita'. */
export function resolveQuizInventory(...sources: Array<number | null | undefined>): QuizInventory {
  for (const source of sources) {
    if (!isCount(source)) continue;
    return source > 0 ? { state: "available", count: source } : { state: "zero" };
  }
  return { state: "unknown" };
}
