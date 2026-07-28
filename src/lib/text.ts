// src/lib/text.ts

/**
 * Toglie i prefissi standard ("Ripasso rapido: ...", "Quick review: ...", ecc.)
 * e l'eventuale suffisso " - {certTitle}" dal titolo di un ripasso.
 */
export function cleanReviewTitle(title: string, certTitle: string) {
  const cleaned = title
    .replace(/^Ripasso rapido:\s*/i, "")
    .replace(/^Quick review:\s*/i, "")
    .replace(/^Révision rapide\s*:\s*/i, "")
    .replace(/^Repaso rápido:\s*/i, "")
    .replace(/^(?:Ripasso|Review|Révision|Repaso)\s+[^:]+\s*:\s*/i, "")
    .replace(new RegExp(`\\s*[–-]\\s*${certTitle}$`, "i"), "")
    .trim();
  if (!cleaned) return title;
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}
