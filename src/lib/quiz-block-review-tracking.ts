export function explanationPaywallParams({
  language,
  quizMode,
  questionId,
  certificationSlug,
  source,
}: {
  language: string;
  quizMode: string;
  questionId: number;
  certificationSlug: string | null;
  source?: 'block-review';
}) {
  return {
    language,
    quiz_mode: quizMode,
    question_id: questionId,
    certification_slug: certificationSlug,
    content_type: 'explanation',
    source_page: 'quiz',
    ...(source ? { source } : {}),
  };
}

export function claimBlockReviewGateOpening(tracked: Set<number>, openingId: number) {
  if (tracked.has(openingId)) return false;
  tracked.add(openingId);
  return true;
}
