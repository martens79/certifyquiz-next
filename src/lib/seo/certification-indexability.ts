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
  // LFS101: editorial build-out in progress (see editorial/lfs101 in the backend repo).
  // Keep noindex even once the first questions exist; remove only when every
  // syllabus chapter has topic content, questions and reviews in all four languages.
  "lfs101",
]);

export type CertificationIndexabilityInput = {
  slug: string;
  questionCount?: number | null;
};

export function isCertificationIndexable(
  input: string | CertificationIndexabilityInput
): boolean {
  const { slug, questionCount } =
    typeof input === "string" ? { slug: input, questionCount: undefined } : input;

  if (NON_INDEXABLE_CERTIFICATION_SLUGS.has(slug)) return false;

  // Missing inventory data is kept backwards-compatible for callers that only
  // apply the editorial deny-list. When a reliable count is supplied, however,
  // zero inventory must fail closed.
  return questionCount == null || questionCount > 0;
}
