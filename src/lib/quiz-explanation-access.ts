export function isWrongExplanationLocked({
  isPremiumUser,
  isLoggedIn,
  wrongExpLeft,
  adUnlocked,
}: {
  isPremiumUser: boolean;
  isLoggedIn: boolean;
  wrongExpLeft: number | null;
  adUnlocked: boolean;
}) {
  return (
    !isPremiumUser &&
    isLoggedIn &&
    wrongExpLeft !== null &&
    wrongExpLeft <= 0 &&
    !adUnlocked
  );
}

export function claimWrongExplanationConsumption(
  consumedQuestionIds: Set<string>,
  questionId: string | number
) {
  const key = String(questionId);
  if (consumedQuestionIds.has(key)) return false;
  consumedQuestionIds.add(key);
  return true;
}
