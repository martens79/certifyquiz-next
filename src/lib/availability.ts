// ================================================================
// NEW FILE: src/lib/availability.ts
// Purpose: Server-side helper to format translation badges consistently
// ----------------------------------------------------------------


export type AvailabilityMap = Record<string, { translated: number; total: number }>;


export function smartBadgeLabelFor(lang: string, rec?: { translated: number; total: number }) {
if (!rec) return undefined;
const { translated, total } = rec;
if (total > 0 && translated >= total) {
const L: any = { en: "All topics", fr: "Tous les sujets", es: "Todos los temas", it: "Tutti i topic" };
return `✓ ${L[lang] || L.en}`;
}
const n = translated || 0;
const fmt =
lang === "it" ? (n === 1 ? "1 topic" : `${n} topic`) :
lang === "fr" ? (n === 1 ? "1 sujet" : `${n} sujets`) :
lang === "es" ? (n === 1 ? "1 tema" : `${n} temas`) :
(n === 1 ? "1 topic" : `${n} topics`);
return `✔ ${fmt}`;
}