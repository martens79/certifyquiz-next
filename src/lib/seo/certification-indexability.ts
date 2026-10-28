import { hasQuizInventory } from "../quiz-availability";
/**
 * Certification landing pages that are useful in navigation but are not yet
 * substantial enough to be search landing pages.
 *
 * Keep this list shared by metadata and sitemap generation: an excluded page
 * must never be indexable through one surface and published by the other.
 */
export const NON_INDEXABLE_CERTIFICATION_SLUGS = new Set([
  "sap-s4hana-financial-accounting",
  "sap-s4hana-sourcing-procurement",
  "sap-s4hana-sales",
  "sap-s4hana-production-planning",
  "sap-abap-cloud-developer",
  "sap-business-technology-platform",
  "sap-successfactors",
  "sap-analytics-cloud",
]);

/**
 * Temporary fail-closed rollout guard. These certifications stay `noindex, follow`
 * (landing in every language, their topic pages, and out of the sitemap) even
 * when their inventory becomes positive, because the content is imported into
 * production step by step. Remove a slug explicitly, in its own change, only
 * after the production DB import, deploy and production smoke test.
 */
export const ROLLOUT_NOINDEX_CERTIFICATION_SLUGS = new Set<string>([]);

export function isRolloutNoindexCertification(slug: string | null | undefined): boolean {
  return typeof slug === "string" && ROLLOUT_NOINDEX_CERTIFICATION_SLUGS.has(slug);
}

export type CertificationIndexabilityInput = {
  slug: string;
  questionCount?: number | null;
  /**
   * true quando l'inventario NON e' noto perche' la lettura dal backend e' fallita
   * (429/timeout/5xx). Un errore temporaneo non e' evidenza di "zero domande":
   * il giudizio resta quello editoriale (deny-list e rollout), mai noindex per
   * inventario. Per i soli metadata; la sitemap non lo usa.
   */
  inventoryUnknown?: boolean;
};

export function isCertificationIndexable(
  input: string | CertificationIndexabilityInput
): boolean {
  const { slug, questionCount, inventoryUnknown } =
    typeof input === "string"
      ? { slug: input, questionCount: undefined, inventoryUnknown: false }
      : { inventoryUnknown: false, ...input };

  if (NON_INDEXABLE_CERTIFICATION_SLUGS.has(slug)) return false;
  if (isRolloutNoindexCertification(slug)) return false;

  // Inventario non noto per un errore backend: nessun noindex "per inventario".
  if (inventoryUnknown) return true;

  // This first teaching release is only ready once its complete translated
  // question package is available. Missing inventory must fail closed.
  if (slug === "apple-device-support") return questionCount != null && questionCount >= 45;

  // String callers apply only the editorial deny-list. Metadata and sitemap
  // callers supply inventory explicitly and must fail closed when unavailable.
  return typeof input === "string" || hasQuizInventory(questionCount);
}
