import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import {
  adoptServerRev,
  chunk,
  clearPendingClose,
  closeServerProgress,
  readPendingClose,
  savePendingClose,
} from '../src/lib/quiz-progress-sync';

test('adoptServerRev never lowers the local counter', () => {
  assert.equal(adoptServerRev(10, 7), 10, 'a slow response must not roll the counter back');
  assert.equal(adoptServerRev(3, 8), 8, 'a client behind the server catches up');
  assert.equal(adoptServerRev(5, 5), 5);
  assert.equal(adoptServerRev(5, undefined), 5);
  assert.equal(adoptServerRev(5, Number.NaN), 5);
  assert.equal(adoptServerRev(5, '9'), 5, 'non-numeric server values are ignored');
});

test('chunk splits into server-sized batches', () => {
  assert.deepEqual(chunk([1, 2, 3, 4, 5], 2), [[1, 2], [3, 4], [5]]);
  assert.deepEqual(chunk([], 200), []);
  const big = Array.from({ length: 450 }, (_, i) => i);
  assert.deepEqual(chunk(big, 200).map((c) => c.length), [200, 200, 50]);
});

const args = { topicId: 85, lang: 'it', mode: 'training', seed: 11, rev: 42, qidsHash: 7 };
const res = (status: number) => ({ ok: status >= 200 && status < 300, status }) as Response;

test('closeServerProgress posts seed/rev/qidsHash with keepalive to the complete endpoint', async () => {
  const calls: Array<{ path: string; init?: RequestInit }> = [];
  const ok = await closeServerProgress(async (path, init) => { calls.push({ path, init }); return res(200); }, args);
  assert.equal(ok, true);
  assert.equal(calls.length, 1);
  assert.equal(calls[0].path, '/me/quiz-progress/85/complete?lang=it&mode=training');
  assert.equal(calls[0].init?.method, 'POST');
  assert.equal(calls[0].init?.keepalive, true);
  assert.deepEqual(JSON.parse(String(calls[0].init?.body)), { seed: 11, rev: 42, qidsHash: 7 });
});

test('closeServerProgress retries network errors and 5xx, then succeeds', async () => {
  let n = 0;
  const ok = await closeServerProgress(async () => {
    n++;
    if (n === 1) throw new TypeError('network');
    if (n === 2) return res(503);
    return res(200);
  }, args, { delayMs: 1 });
  assert.equal(ok, true);
  assert.equal(n, 3);
});

test('closeServerProgress gives up after the attempts and reports failure', async () => {
  let n = 0;
  const ok = await closeServerProgress(async () => { n++; return res(500); }, args, { attempts: 2, delayMs: 1 });
  assert.equal(ok, false);
  assert.equal(n, 2);
});

test('closeServerProgress does not retry definitive 4xx answers', async () => {
  let n = 0;
  const ok = await closeServerProgress(async () => { n++; return res(400); }, args, { delayMs: 1 });
  assert.equal(ok, false);
  assert.equal(n, 1);
  n = 0;
  await closeServerProgress(async () => { n++; return res(429); }, args, { attempts: 2, delayMs: 1 });
  assert.equal(n, 2, '429 is retried');
});

test('pending-close marker round-trips and survives malformed values', () => {
  const store = new Map<string, string>();
  (globalThis as any).localStorage = {
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => { store.set(k, v); },
    removeItem: (k: string) => { store.delete(k); },
  };
  try {
    const scope = 'topic:85:it:training:user:42';
    assert.equal(readPendingClose(scope), null);
    savePendingClose(scope, { seed: 1, rev: 2, qidsHash: 3 });
    assert.deepEqual(readPendingClose(scope), { seed: 1, rev: 2, qidsHash: 3 });
    // the key ends with the scope, so clearAllProgressForUser(user) removes it on logout
    assert.ok([...store.keys()].every((k) => k.startsWith('cq:quiz:') && k.endsWith(':user:42')));
    store.set(`cq:quiz:closing:${scope}`, '{"seed":"x"}');
    assert.equal(readPendingClose(scope), null);
    clearPendingClose(scope);
    assert.equal(store.size, 0);
  } finally {
    delete (globalThis as any).localStorage;
  }
});
