export type PersistPayload = {
  qIds: Array<string | number>;
  marked: Record<string | number, string | number | null>;
  reviewLater: Array<string | number>;
  mode: 'training' | 'exam';
  remainingSec: number | null;
  startedAt: number | null;
};

const KEY = (scope: string) => `cq:quiz:${scope}`;

export function saveProgress(scope: string, data: PersistPayload) {
  try {
    localStorage.setItem(KEY(scope), JSON.stringify(data));
  } catch {}
}
export function loadProgress(scope: string): PersistPayload | null {
  try {
    const raw = localStorage.getItem(KEY(scope));
    if (!raw) return null;
    return JSON.parse(raw) as PersistPayload;
  } catch {
    return null;
  }
}
export function clearProgress(scope: string) {
  try {
    localStorage.removeItem(KEY(scope));
  } catch {}
}
