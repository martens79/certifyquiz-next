// Localized database topics of these certifications are the authoritative list of
// usable question banks (PMP: already filtered; ISC2 CC: the registry listed only
// the 5 original topics while the API serves 10 after the 2026 outline update).
// Preserve the registry fallback when the API inventory is unknown, and keep
// other certification landing pages outside this narrowly scoped correction.
const API_ALIGNED_COVERAGE = new Set(["pmp", "isc2-cc"]);

// The practice box shows at most 6 topics; ISC2 CC needs all 10 so the Network
// Security, Security Operations, Cloud and GRC banks are not hidden.
const DEFAULT_COVERAGE_LIMIT = 6;
const COVERAGE_LIMITS: Readonly<Record<string, number>> = { "isc2-cc": 10 };

export function practiceTopicLimit(certificationSlug: string): number {
  return COVERAGE_LIMITS[certificationSlug] ?? DEFAULT_COVERAGE_LIMIT;
}

export function practiceTopicCoverage<T>(
  certificationSlug: string,
  availableTopicTitles: readonly string[],
  registryTopics: readonly T[]
): readonly (T | string)[] {
  const titles = availableTopicTitles.filter((title) => title.trim());
  return API_ALIGNED_COVERAGE.has(certificationSlug) && titles.length > 0 ? titles : registryTopics;
}
