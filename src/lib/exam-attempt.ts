/** Local continuity only: neither localStorage nor Date.now is an authority. */
export type ExamAttempt = {
  v: 1;
  attemptId: string;
  scope: string;
  startedAt: number;
  deadlineAt: number;
  checkpointAt: number;
  remainingSec: number;
  qIds: Array<string | number>;
  seed: number;
  status: 'active' | 'expired' | 'completed' | 'unavailable';
};

const key = (scope: string) => `cq:quiz:attempt:${scope}`;
const finite = (n: unknown): n is number => typeof n === 'number' && Number.isFinite(n);

export function readExamAttempt(scope: string): { exists: boolean; attempt: ExamAttempt | null } {
  try {
    const text = localStorage.getItem(key(scope));
    if (!text) return { exists: false, attempt: null };
    let a: Partial<ExamAttempt>;
    try { a = JSON.parse(text); } catch { return { exists: true, attempt: null }; }
    const valid = a && a.v === 1 && a.scope === scope && typeof a.attemptId === 'string' &&
      a.attemptId.length > 0 && finite(a.startedAt) && finite(a.deadlineAt) &&
      a.deadlineAt >= a.startedAt && finite(a.checkpointAt) && finite(a.remainingSec) &&
      a.remainingSec >= 0 && finite(a.seed) && Array.isArray(a.qIds) && a.qIds.length <= 500 &&
      a.qIds.every(id => (typeof id === 'string' && id.length > 0 && id.length < 64) || finite(id)) &&
      ['active', 'expired', 'completed', 'unavailable'].includes(a.status as string);
    return { exists: true, attempt: valid ? a as ExamAttempt : null };
  } catch {
    return { exists: false, attempt: null };
  }
}

export function saveExamAttempt(attempt: ExamAttempt) {
  try { localStorage.setItem(key(attempt.scope), JSON.stringify(attempt)); return true; } catch { return false; }
}

export function clearExamAttempt(scope: string) {
  try { localStorage.removeItem(key(scope)); } catch { /* best effort */ }
}

export function createExamAttempt(input: {
  scope: string; totalSec: number; remainingSec?: number;
  qIds: Array<string | number>; seed: number; now?: number;
}): ExamAttempt {
  const now = input.now ?? Date.now();
  if (!Number.isFinite(input.totalSec) || input.totalSec <= 0) throw new Error('Invalid exam duration');
  const left = Math.max(0, Math.min(input.totalSec, input.remainingSec ?? input.totalSec));
  return {
    v: 1, attemptId: crypto.randomUUID(), scope: input.scope,
    startedAt: now - (input.totalSec - left) * 1000,
    deadlineAt: now + left * 1000, checkpointAt: now, remainingSec: left,
    qIds: [...input.qIds], seed: input.seed, status: left === 0 ? 'expired' : 'active',
  };
}

export function attemptRemaining(attempt: ExamAttempt, now = Date.now()): number {
  if (attempt.status !== 'active') return 0;
  // A backwards clock can never raise the last persisted remainder. While
  // mounted, QuizEngine additionally subtracts monotonic performance time.
  return Math.max(0, Math.min(
    attempt.remainingSec,
    Math.floor((attempt.deadlineAt - now) / 1000),
    attempt.remainingSec - Math.max(0, Math.floor((now - attempt.checkpointAt) / 1000)),
  ));
}

export function checkpointAttempt(attempt: ExamAttempt, remainingSec: number, now = Date.now()): ExamAttempt {
  const left = Math.max(0, Math.min(attemptRemaining(attempt, now), remainingSec));
  return {
    ...attempt, remainingSec: left, checkpointAt: Math.max(attempt.checkpointAt, now),
    status: attempt.status === 'active' && left === 0 ? 'expired' : attempt.status,
  };
}

export function closeAttempt(attempt: ExamAttempt, status: 'expired' | 'completed' | 'unavailable'): ExamAttempt {
  return { ...attempt, remainingSec: 0, status };
}

export function sameAttemptQuestions(attempt: ExamAttempt, ids: Array<string | number>): boolean {
  return attempt.qIds.length === ids.length && attempt.qIds.every((id, i) => String(id) === String(ids[i]));
}
