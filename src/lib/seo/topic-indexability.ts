type TopicForIndexability = {
  title?: string | null;
  description?: string | null;
  intro?: string | null;
  content?: string | null;
  faq?: Array<{ q?: string | null; a?: string | null }> | null;
};

/**
 * A topic URL is a search landing page only when it contains substantial,
 * localized publisher content. Quiz inventory and template chrome do not count.
 */
export function isTopicIndexable(topic: TopicForIndexability): boolean {
  const prose = [
    topic.description,
    topic.intro,
    topic.content,
    ...(topic.faq ?? []).flatMap((item) => [item.q, item.a]),
  ]
    .filter((value): value is string => typeof value === "string")
    .join(" ")
    .replace(/[#*_>`~\[\]()|-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const wordCount = prose ? prose.split(" ").length : 0;
  const hasCoreGuide = (topic.content?.trim().length ?? 0) >= 1_500;
  const hasSupportingMaterial =
    (topic.intro?.trim().length ?? 0) >= 180 || (topic.faq?.length ?? 0) >= 2;

  return Boolean(topic.title?.trim()) && wordCount >= 300 && hasCoreGuide && hasSupportingMaterial;
}
