export type ReviewIndexabilityInput = {
  certificationSlug: string;
  topicId: number;
  access: "free" | "premium" | "unlocked";
  topicTitle: string;
  title: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  intro: string | null;
  content: string | null;
};

export type ReviewSeoIntent = "distinct" | "certification" | "borderline";

// Editorial policy keyed by stable database identity, shared by every locale.
// New reviews fail closed until their search intent is explicitly audited.
const REVIEW_SEO_INTENT: Readonly<Record<string, ReviewSeoIntent>> = {
  "ccna:81": "distinct", "ccna:82": "distinct", "ccna:83": "certification",
  "ccna:84": "borderline", "ccna:85": "borderline", "ccna:334": "borderline",
  "ccna:335": "borderline", "ccna:336": "borderline", "ccna:337": "borderline", "ccna:338": "borderline",
  "isc2-cc:209": "distinct", "isc2-cc:210": "borderline", "isc2-cc:211": "borderline",
  "isc2-cc:212": "borderline", "isc2-cc:213": "borderline", "isc2-cc:344": "borderline",
  "isc2-cc:345": "distinct", "isc2-cc:346": "borderline",
  "itil-4-foundation:253": "certification", "itil-4-foundation:254": "borderline",
  "itil-4-foundation:255": "borderline", "itil-4-foundation:256": "borderline",
  "itil-4-foundation:257": "borderline", "itil-4-foundation:258": "certification",
  "itil-4-foundation:259": "distinct", "itil-4-foundation:260": "borderline",
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
  /^\s*(?:[-*]\s*)?todo\s*[:.!-]?\s*$/im,
];

export function getReviewSeoIntent(review: Pick<ReviewIndexabilityInput, "certificationSlug" | "topicId">): ReviewSeoIntent | "unclassified" {
  return REVIEW_SEO_INTENT[`${review.certificationSlug}:${review.topicId}`] ?? "unclassified";
}

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
  const intent = getReviewSeoIntent(review);

  if (intent !== "distinct") reasons.push(`seo_intent_${intent}`);

  if (text.length < 900) reasons.push("content_below_900_characters");
  if (words < 150) reasons.push("content_below_150_words");
  if (h2Count < 2) reasons.push("fewer_than_two_h2_sections");
  if (review.access === "premium" && text.length < 1800) reasons.push("premium_preview_below_1800_characters");
  if (review.access === "premium" && words < 300) reasons.push("premium_preview_below_300_words");

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

export function evaluateReviewClusterIndexability(reviews: ReviewIndexabilityInput[]): ReviewIndexabilityResult {
  if (reviews.length !== 4) {
    return { indexable:false, reasons:["incomplete_locale_cluster"], metrics:{words:0,textCharacters:0,h2Count:0} };
  }
  const results=reviews.map(evaluateReviewIndexability);
  const failed=results.flatMap((result,index)=>result.reasons.map(reason=>`locale_${index}_${reason}`));
  return {
    indexable:failed.length===0,
    reasons:failed,
    metrics:{words:Math.min(...results.map(x=>x.metrics.words)),textCharacters:Math.min(...results.map(x=>x.metrics.textCharacters)),h2Count:Math.min(...results.map(x=>x.metrics.h2Count))},
  };
}

export function selectIndexableReviewClusterItems<T extends {review:ReviewIndexabilityInput}>(clusters:Iterable<T[]>):T[] {
  const selected:T[]=[];
  for(const cluster of clusters)if(evaluateReviewClusterIndexability(cluster.map(item=>item.review)).indexable)selected.push(...cluster);
  return selected;
}
