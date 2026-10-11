// PMP's localized database topics are already filtered to usable question banks.
// Preserve the registry fallback when the API inventory is unknown, and keep
// other certification landing pages outside this narrowly scoped correction.
export function practiceTopicCoverage<T>(
  certificationSlug: string,
  availableTopicTitles: readonly string[],
  registryTopics: readonly T[]
): readonly (T | string)[] {
  const titles = availableTopicTitles.filter((title) => title.trim());
  return certificationSlug === "pmp" && titles.length > 0 ? titles : registryTopics;
}
