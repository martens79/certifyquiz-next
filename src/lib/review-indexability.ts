export type ReviewIndexabilityInput = {
  topicTitle: string;
  title: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  intro: string | null;
  content: string | null;
};

export type ReviewIndexabilityResult = {
  indexable: boolean;
  reasons: string[];
  metrics: {
    words: number;
    textCharacters: number;
    h2Count: number;
  };
};

const PLACEHOLDER_PATTERNS = [
  /coming soon/i,
  /available soon/i,
  /in arrivo/i,
  /disponibile prossimamente/i,
  /bient[oô]t disponible/i,
  /pr[oó]ximamente/i,
  /lorem ipsum/i,
  /todo\b/i,
];

function plainText(markdown: string): string {
  return markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/[>*_~|=-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function evaluateReviewIndexability(
  review: ReviewIndexabilityInput
): ReviewIndexabilityResult {
  const content = review.content?.trim() ?? "";
  const text = plainText(content);
  const words = text ? text.split(/\s+/u).filter(Boolean).length : 0;
  const h2Count = (content.match(/^##\s+\S+/gm) ?? []).length;
  const reasons: string[] = [];

  if (text.length < 900) reasons.push("content_below_900_characters");
  if (words < 150) reasons.push("content_below_150_words");
  if (h2Count < 2) reasons.push("fewer_than_two_h2_sections");

  const requiredFields = [
    ["title", review.title],
    ["intro", review.intro],
    ["meta_title", review.metaTitle],
    ["meta_description", review.metaDescription],
  ] as const;

  for (const [name, value] of requiredFields) {
    if (!value?.trim()) reasons.push(`missing_${name}`);
  }

  const combined = [
    review.title,
    review.metaTitle,
    review.metaDescription,
    review.intro,
    content,
  ]
    .filter(Boolean)
    .join("\n");

  if (PLACEHOLDER_PATTERNS.some((pattern) => pattern.test(combined))) {
    reasons.push("placeholder_language_detected");
  }

  return {
    indexable: reasons.length === 0,
    reasons,
    metrics: { words, textCharacters: text.length, h2Count },
  };
}
