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
export const ROLLOUT_NOINDEX_CERTIFICATION_SLUGS = new Set([
  "az-802",
  // Planned Technical Skills path (EN/IT only at launch; FR/ES never indexable until
  // translated). Also publicationStatus "planned" in the registry.
  "plc-fundamentals",
]);

export function isRolloutNoindexCertification(slug: string | null | undefined): boolean {
  return typeof slug === "string" && ROLLOUT_NOINDEX_CERTIFICATION_SLUGS.has(slug);
}

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
  if (isRolloutNoindexCertification(slug)) return false;

  // Missing inventory data is kept backwards-compatible for callers that only
  // apply the editorial deny-list. When a reliable count is supplied, however,
  // zero inventory must fail closed.
  return questionCount == null || questionCount > 0;
}
