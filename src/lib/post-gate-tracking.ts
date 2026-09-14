export type PostGateCohort = {
  gateInstanceId: string;
  gateQuestionId: string;
  reachedAt: string;
};

const COHORT_KEY = "cq_post_gate_cohort:wrong_explanation:";
const CONTINUED_KEY = "cq_post_gate_continued:";
const memoryCohorts = new Map<string, PostGateCohort>();
const memoryContinuedClaims = new Set<string>();

function cohortKey(userId: string | number) {
  return `${COHORT_KEY}${userId}`;
}

export function getOrCreatePostGateCohort(
  userId: string | number,
  questionId: string | number
): PostGateCohort {
  const gateQuestionId = String(questionId);
  const key = cohortKey(userId);
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const existing = JSON.parse(raw) as PostGateCohort;
      if (existing.gateQuestionId === gateQuestionId) {
        memoryCohorts.set(key, existing);
        return existing;
      }
    }
  } catch {}

  const memoryCohort = memoryCohorts.get(key);
  if (memoryCohort?.gateQuestionId === gateQuestionId) return memoryCohort;

  const cohort = {
    gateInstanceId: crypto.randomUUID(),
    gateQuestionId,
    reachedAt: new Date().toISOString(),
  };
  memoryCohorts.set(key, cohort);
  try {
    localStorage.setItem(key, JSON.stringify(cohort));
  } catch {}
  return cohort;
}

export function readPostGateCohort(userId: string | number): PostGateCohort | null {
  const key = cohortKey(userId);
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const cohort = JSON.parse(raw) as PostGateCohort;
      memoryCohorts.set(key, cohort);
      return cohort;
    }
  } catch {
    // Fall through to the in-memory cohort for storage-restricted browsers.
  }
  return memoryCohorts.get(key) ?? null;
}

export function claimContinuedFree(cohort: PostGateCohort): boolean {
  const key = `${CONTINUED_KEY}${cohort.gateInstanceId}`;
  if (memoryContinuedClaims.has(key)) return false;
  try {
    if (localStorage.getItem(key) === "1") return false;
    localStorage.setItem(key, "1");
  } catch {}
  memoryContinuedClaims.add(key);
  return true;
}
