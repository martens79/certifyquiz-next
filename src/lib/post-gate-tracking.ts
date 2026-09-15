export type PostGateCohort = {
  gateInstanceId: string;
  gateQuestionId: string;
  reachedAt: string;
};

const COHORT_KEY = "cq_post_gate_cohort:wrong_explanation:";
const CONTINUED_KEY = "cq_post_gate_continued:";

function cohortKey(userId: string | number) { return `${COHORT_KEY}${userId}`; }

export function getOrCreatePostGateCohort(userId: string | number, questionId: string | number): PostGateCohort {
  try {
    const raw = localStorage.getItem(cohortKey(userId));
    if (raw) return JSON.parse(raw) as PostGateCohort;
  } catch {}
  const cohort = {
    gateInstanceId: crypto.randomUUID(),
    gateQuestionId: String(questionId),
    reachedAt: new Date().toISOString(),
  };
  try { localStorage.setItem(cohortKey(userId), JSON.stringify(cohort)); } catch {}
  return cohort;
}

export function readPostGateCohort(userId: string | number): PostGateCohort | null {
  try {
    const raw = localStorage.getItem(cohortKey(userId));
    return raw ? JSON.parse(raw) as PostGateCohort : null;
  } catch { return null; }
}

export function claimContinuedFree(cohort: PostGateCohort): boolean {
  const key = `${CONTINUED_KEY}${cohort.gateInstanceId}`;
  try {
    if (localStorage.getItem(key) === "1") return false;
    localStorage.setItem(key, "1");
  } catch {}
  return true;
}
