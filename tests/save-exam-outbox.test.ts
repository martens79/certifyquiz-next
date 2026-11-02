import assert from 'node:assert/strict';
import { beforeEach, test } from 'node:test';
import {
  AUTO_RETRY_DELAY_MS, COOLDOWN_MS, RATE_COOLDOWN_MS, SaveExamFailure, __resetOutboxForTests, classifySaveError,
  createAttemptId, discardResult, getOutboxItems, hydrateOutbox, outboxKey, retryResult, submitResult,
  clearAwaitingIdentity, completeAwaiting, getAwaitingIdentity, getResolvedIdentity,
} from '../src/lib/save-exam-outbox';
import { recordQuizResult, retryUnresolvedResult } from '../src/lib/quiz-result-save';
import { clearAllProgressForUser } from '../src/lib/quiz-storage';

const store = new Map<string, string>();
let storageBroken = false;
beforeEach(() => {
  store.clear();
  storageBroken = false;
  __resetOutboxForTests();
  Object.assign(globalThis, {
    localStorage: {
      get length() { return store.size; },
      key: (i: number) => [...store.keys()][i] ?? null,
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => { if (storageBroken) throw new Error('QuotaExceededError'); store.set(k, v); },
      removeItem: (k: string) => { store.delete(k); },
    },
  });
});

const UID = 77;
const http = (status: number, error?: string) => Object.assign(new Error(`HTTP ${status}`), { status, detail: error ? { error } : null });
const payload = { certification_id: 7, totalQuestions: 40, correctAnswers: 31, isExam: false, attempts: [{ questionId: 1, chosenAnswerId: 11 }] };
const base = (attemptId = createAttemptId()) => ({ attemptId, userId: UID, scope: 'mixed:x:en', payload });
const noWait = { wait: async () => {} };
const item = (id: string) => getOutboxItems(UID).find((i) => i.entry.attemptId === id)!;

test('classification of every failure class the audit lists', () => {
  const k = (e: unknown) => classifySaveError(e);
  assert.deepEqual(k(Object.assign(new Error('x'), { name: 'TimeoutError' })), { kind: 'timeout', retryable: true, status: null });
  assert.deepEqual(k(Object.assign(new Error('x'), { name: 'AbortError' })), { kind: 'timeout', retryable: true, status: null });
  assert.equal(k(new TypeError('Failed to fetch')).kind, 'network');
  assert.equal(k(http(401)).kind, 'auth');
  assert.equal(k(http(403)).kind, 'auth');
  assert.equal(k(http(429)).kind, 'rate');
  assert.equal(k(http(500)).kind, 'server');
  assert.equal(k(http(502)).kind, 'server');
  assert.equal(k(http(503)).kind, 'server');
  assert.equal(k(http(503, 'SAVE_EXAM_BUSY')).kind, 'busy');
  for (const s of [400, 404, 409, 422]) assert.deepEqual(k(http(s)), { kind: 'rejected', retryable: false, status: s });
});

test('A. success: write-ahead before the request, entry removed on 2xx, attemptId in the payload', async () => {
  const id = createAttemptId();
  let seen: any = null;
  let storedDuringSend = false;
  await submitResult(base(id), { send: async (p) => { seen = p; storedDuringSend = store.has(outboxKey(id, UID)); return { success: true }; } });
  assert.equal(storedDuringSend, true, 'la voce e\' in localStorage PRIMA della richiesta');
  assert.equal(seen.attemptId, id);
  assert.equal(store.has(outboxKey(id, UID)), false, 'rimossa solo a 2xx');
  assert.equal(item(id).status, 'saved');
});

test('B. 500: never silent — one automatic retry, then failed state, entry kept, same attemptId', async () => {
  const id = createAttemptId();
  const sent: string[] = [];
  const waits: number[] = [];
  await assert.rejects(
    submitResult(base(id), { send: async (p) => { sent.push(p.attemptId!); throw http(500); }, wait: async (ms) => { waits.push(ms); } }),
    (e: unknown) => e instanceof SaveExamFailure && e.failure.kind === 'server' && e.persisted === true
  );
  assert.equal(sent.length, 2, 'una richiesta + un solo retry automatico, mai illimitato');
  assert.deepEqual(waits, [AUTO_RETRY_DELAY_MS]);
  assert.deepEqual(new Set(sent), new Set([id]));
  assert.equal(item(id).status, 'failed');
  assert.equal(store.has(outboxKey(id, UID)), true, 'risultato recuperabile');
});

test('manual retry sends no automatic retry, honours the cooldown, and succeeds with the same attemptId', async () => {
  const id = createAttemptId();
  let t = 1_000_000;
  const deps = (send: (p: any) => Promise<unknown>) => ({ send, now: () => t, ...noWait });
  await assert.rejects(submitResult(base(id), deps(async () => { throw http(500); })));
  // dentro il cooldown: nessuna richiesta
  let calls = 0;
  await assert.rejects(retryResult(id, deps(async () => { calls++; return {}; })));
  assert.equal(calls, 0);
  t += COOLDOWN_MS + 1;
  const ids: string[] = [];
  await retryResult(id, deps(async (p) => { ids.push(p.attemptId); return { success: true }; }));
  assert.deepEqual(ids, [id]);
  assert.equal(item(id).status, 'saved');
  assert.equal(store.has(outboxKey(id, UID)), false);
});

test('429: no automatic retry, 30 s cooldown (no aggressive requests)', async () => {
  const id = createAttemptId();
  let n = 0;
  let t = 5_000;
  await assert.rejects(submitResult(base(id), { send: async () => { n++; throw http(429); }, now: () => t, ...noWait }),
    (e: unknown) => e instanceof SaveExamFailure && e.failure.kind === 'rate');
  assert.equal(n, 1);
  assert.equal(item(id).retryAt, t + RATE_COOLDOWN_MS);
  t += RATE_COOLDOWN_MS - 1;
  await assert.rejects(retryResult(id, { send: async () => { n++; return {}; }, now: () => t }));
  assert.equal(n, 1);
});

test('401/403: not retried automatically, entry kept for after a new sign-in', async () => {
  const id = createAttemptId();
  let n = 0;
  await assert.rejects(submitResult(base(id), { send: async () => { n++; throw http(401); }, ...noWait }));
  assert.equal(n, 1);
  assert.equal(item(id).failure?.kind, 'auth');
  assert.equal(store.has(outboxKey(id, UID)), true);
});

test('4xx rejection (invalid payload): not retryable and not kept for later sessions', async () => {
  const id = createAttemptId();
  await assert.rejects(submitResult(base(id), { send: async () => { throw http(400, 'INVALID_RESULT'); }, ...noWait }));
  assert.equal(item(id).failure?.retryable, false);
  assert.equal(store.has(outboxKey(id, UID)), false);
  let resent = 0;
  await assert.rejects(retryResult(id, { send: async () => { resent++; return {}; }, now: () => Date.now() + 10 * COOLDOWN_MS }),
    (e: unknown) => e instanceof SaveExamFailure && e.failure.retryable === false);
  assert.equal(resent, 0, 'un payload rifiutato non viene reinviato');
});

test('C. timeout: a server that never answers is aborted and classified, nothing is lost', async () => {
  const id = createAttemptId();
  let aborted = false;
  await assert.rejects(
    submitResult(base(id), {
      timeoutMs: 20,
      send: (_p, signal) => new Promise((_res, rej) => { signal.addEventListener('abort', () => { aborted = true; rej(Object.assign(new Error('aborted'), { name: 'AbortError' })); }); }),
      ...noWait,
    }),
    (e: unknown) => e instanceof SaveExamFailure && e.failure.kind === 'timeout'
  );
  assert.equal(aborted, true);
  assert.equal(store.has(outboxKey(id, UID)), true);
});

test('D. lost response after COMMIT: the retry carries the SAME attemptId so the server dedupes', async () => {
  const id = createAttemptId();
  const received: string[] = [];
  // 1a richiesta: il server registra ma la risposta non arriva; retry automatico: il server risponde 200 deduped
  let first = true;
  await submitResult(base(id), {
    send: async (p) => {
      received.push(p.attemptId!);
      if (first) { first = false; throw new TypeError('Failed to fetch'); }
      return { success: true, deduped: true };
    },
    ...noWait,
  });
  assert.deepEqual(received, [id, id]);
  assert.equal(item(id).status, 'saved');
});

test('concurrent submissions of the same attempt are coalesced into one request', async () => {
  const id = createAttemptId();
  let n = 0;
  let release!: () => void;
  const gate = new Promise<void>((r) => { release = r; });
  const send = async () => { n++; await gate; return {}; };
  const a = submitResult(base(id), { send });
  const b = submitResult(base(id), { send });
  release();
  await Promise.all([a, b]);
  assert.equal(n, 1);
});

test('E. reload: unsent results are recovered for the same user only; corrupt or expired entries are dropped', () => {
  const ok = createAttemptId();
  const other = createAttemptId();
  const old = createAttemptId();
  const mk = (id: string, uid: number, createdAt: number) => JSON.stringify({ v: 1, attemptId: id, userId: String(uid), scope: 's', createdAt, payload: { ...payload, attemptId: id } });
  const now = 1_800_000_000_000;
  store.set(outboxKey(ok, UID), mk(ok, UID, now - 1000));
  store.set(outboxKey(other, 99), mk(other, 99, now - 1000));
  store.set(outboxKey(old, UID), mk(old, UID, now - 31 * 24 * 3_600_000));
  store.set(`cq:quiz:pending-save:${createAttemptId()}:user:${UID}`, '{not json');
  hydrateOutbox(UID, now);
  const list = getOutboxItems(UID);
  assert.deepEqual(list.map((i) => i.entry.attemptId), [ok]);
  assert.equal(list[0].fresh, false);
  assert.equal(list[0].status, 'failed');
  assert.equal(store.has(outboxKey(old, UID)), false);
  assert.equal(store.has(outboxKey(other, 99)), true, 'le voci di un altro utente non si toccano');
  assert.equal(getOutboxItems(99).length, 0, 'non caricate per un altro account');
});

test('a recovered result is sent with its stored payload, no new answers needed, then removed', async () => {
  const id = createAttemptId();
  store.set(outboxKey(id, UID), JSON.stringify({ v: 1, attemptId: id, userId: String(UID), scope: 's', createdAt: Date.now() - 5000, payload: { ...payload, attemptId: id } }));
  hydrateOutbox(UID);
  let body: any;
  await retryResult(id, { send: async (p) => { body = p; return {}; } });
  assert.equal(body.attemptId, id);
  assert.equal(body.correctAnswers, 31);
  assert.equal(store.has(outboxKey(id, UID)), false);
});

test('logout removes pending results of the outgoing user (shared PC) and nothing of others', () => {
  const mine = createAttemptId();
  const theirs = createAttemptId();
  store.set(outboxKey(mine, UID), '{}');
  store.set(outboxKey(theirs, 99), '{}');
  clearAllProgressForUser(UID);
  assert.equal(store.has(outboxKey(mine, UID)), false);
  assert.equal(store.has(outboxKey(theirs, 99)), true);
});

test('storage unavailable: the result is kept in memory and flagged as not persisted', async () => {
  storageBroken = true;
  const id = createAttemptId();
  await assert.rejects(submitResult(base(id), { send: async () => { throw http(500); }, ...noWait }), (e: unknown) => e instanceof SaveExamFailure && e.persisted === false);
  assert.equal(item(id).persisted, false);
  await retryResult(id, { send: async () => ({}), now: () => Date.now() + 10 * COOLDOWN_MS });
  assert.equal(item(id).status, 'saved');
});

test('discarding a failed result removes it from memory and storage', async () => {
  const id = createAttemptId();
  await assert.rejects(submitResult(base(id), { send: async () => { throw http(500); }, ...noWait }));
  discardResult(id);
  assert.equal(getOutboxItems(UID).length, 0);
  assert.equal(store.has(outboxKey(id, UID)), false);
});

test('recordQuizResult: anonymous users have nothing to record; payload drops unanswered attempts', async () => {
  let n = 0;
  assert.deepEqual(await recordQuizResult({ userId: null, scope: 's', summary: { total: 5, correct: 1 }, certificationId: 7, isExam: true }, { send: async () => { n++; return {}; } }), { recorded: false });
  assert.equal(n, 0);

  let body: any;
  const id = createAttemptId();
  const res = await recordQuizResult({
    userId: UID, scope: 's', certificationId: 7, topicId: 85, isExam: true,
    summary: { attemptId: id, total: 3, correct: 1, attempts: [{ questionId: 1, chosenAnswerId: 11, isCorrect: false }, { questionId: 2, chosenAnswerId: null }, { questionId: 3, chosenAnswerId: 31, isCorrect: true }] },
  }, { send: async (p) => { body = p; return {}; } });
  assert.deepEqual(res, { recorded: true });
  assert.equal(body.attemptId, id);
  assert.equal(body.topicId, 85);
  assert.equal(body.isExam, true);
  assert.deepEqual(body.attempts.map((a: any) => a.questionId), [1, 3]);
  for (const a of body.attempts) assert.deepEqual(Object.keys(a).sort(), ['chosenAnswerId', 'questionId']);
});

test('createAttemptId yields RFC 4122 v4 UUIDs, all distinct', () => {
  const ids = new Set(Array.from({ length: 200 }, createAttemptId));
  assert.equal(ids.size, 200);
  for (const id of ids) assert.match(id, /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
});

// ---- user id non ancora disponibile durante il bootstrap dell'auth ----
const rArgs = { userId: undefined, scope: 'mixed:x:en', summary: { total: 5, correct: 3 }, certificationId: 7, isExam: false };

test('recordQuizResult: token present but user.id not yet hydrated resolves the id from cache and saves (no silent skip)', async () => {
  const sent: unknown[] = [];
  const res = await recordQuizResult(rArgs, { send: async (p) => { sent.push(p); return {}; }, ...noWait },
    { hasToken: () => true, cachedId: () => UID, fetchId: async () => { throw new Error('must not call /auth/me'); } });
  assert.deepEqual(res, { recorded: true });
  assert.equal(sent.length, 1);
});

test('recordQuizResult: no cached id falls back to /auth/me', async () => {
  let sent = 0;
  const res = await recordQuizResult(rArgs, { send: async () => { sent++; return {}; }, ...noWait },
    { hasToken: () => true, cachedId: () => null, fetchId: async () => UID });
  assert.deepEqual(res, { recorded: true });
  assert.equal(sent, 1);
});

test('recordQuizResult: real anonymous (no token) makes no request even with a stale cached user', async () => {
  let calls = 0;
  const res = await recordQuizResult(rArgs, { send: async () => { calls++; return {}; } },
    { hasToken: () => false, cachedId: () => { calls++; return UID; }, fetchId: async () => { calls++; return UID; } });
  assert.deepEqual(res, { recorded: false });
  assert.equal(calls, 0);
});

// ---- token presente ma identita' non determinabile: visibile, ritentabile, mai su disco ----
const AID = '11111111-1111-4111-8111-111111111111';
const idArgs = { userId: undefined, scope: 'mock:x:en', summary: { attemptId: AID, total: 5, correct: 3, attempts: [{ questionId: 1, chosenAnswerId: 11 }] }, certificationId: 7, isExam: true };
const quizKeys = () => [...store.keys()].filter((k) => k.startsWith('cq:quiz:'));
const unknownId = (counter: { fetch: number }): import('../src/lib/quiz-result-save').UserIdResolver =>
  ({ hasToken: () => true, cachedId: () => null, fetchId: async () => { counter.fetch++; throw http(500); } });

test('identity unresolvable: visible failure, result held in memory only — no outbox entry and nothing on disk', async () => {
  const c = { fetch: 0 }; let sent = 0; const t0 = 1_000_000;
  await assert.rejects(
    recordQuizResult(idArgs, { send: async () => { sent++; return {}; }, now: () => t0 }, unknownId(c)),
    (e: unknown) => e instanceof SaveExamFailure && e.failure.kind === 'identity' && e.failure.retryable && e.persisted === false,
  );
  const w = getAwaitingIdentity(AID)!;
  assert.equal(w.status, 'waiting');
  assert.equal(w.payload.attemptId, AID);
  assert.equal(w.retryAt, t0 + COOLDOWN_MS);
  assert.deepEqual(quizKeys(), [], 'nessuna voce su localStorage per un utente ignoto');
  assert.equal(getOutboxItems('undefined').length + getOutboxItems('null').length + getOutboxItems('').length, 0);
  assert.equal(sent, 0, 'nessuna chiamata a /save-exam');
  assert.equal(c.fetch, 1, 'una sola richiesta /auth/me, nessun retry aggressivo');
});

test('identity recovered later: manual retry respects the cooldown, then saves ONCE with the same attemptId under the real user', async () => {
  let now = 5_000_000; const sent: any[] = []; let fetches = 0; let ok = false;
  const resolver = { hasToken: () => true, cachedId: () => null, fetchId: async () => { fetches++; if (!ok) throw http(500); return UID; } };
  const deps = { send: async (p: any) => { sent.push(p); return {}; }, now: () => now };
  await assert.rejects(recordQuizResult(idArgs, deps, resolver));
  // dentro il cooldown: nessuna nuova richiesta
  now += COOLDOWN_MS - 1;
  await assert.rejects(retryUnresolvedResult(AID, deps, resolver), (e: unknown) => e instanceof SaveExamFailure && e.failure.kind === 'identity');
  assert.equal(fetches, 1);
  // ancora senza identita' dopo il cooldown: resta in attesa, nuovo cooldown, nulla inviato
  now += 2;
  await assert.rejects(retryUnresolvedResult(AID, deps, resolver));
  assert.equal(fetches, 2);
  assert.equal(getAwaitingIdentity(AID)!.retryAt, now + COOLDOWN_MS);
  assert.equal(sent.length, 0);
  assert.deepEqual(quizKeys(), []);
  // identita' recuperata
  ok = true; now += COOLDOWN_MS + 1;
  assert.equal(await retryUnresolvedResult(AID, deps, resolver), String(UID));
  assert.equal(fetches, 3);
  assert.equal(sent.length, 1);
  assert.equal(sent[0].attemptId, AID, 'stesso attemptId: nessun duplicato');
  assert.equal(sent[0].isExam, true);
  assert.deepEqual(sent[0].attempts, [{ questionId: 1, chosenAnswerId: 11 }]);
  assert.equal(getAwaitingIdentity(AID), null);
  assert.equal(getResolvedIdentity(AID), String(UID));
  assert.equal(item(AID).status, 'saved');
  assert.deepEqual(quizKeys(), [], 'a 2xx la voce write-ahead e rimossa');
});

test('identity recovered but the save then fails: the result moves into the normal per-user outbox (persisted, retry-able, same attemptId)', async () => {
  const now = 7_000_000; const resolver = { hasToken: () => true, cachedId: () => null, fetchId: async () => UID };
  let sent = 0;
  const deps = { send: async () => { sent++; throw http(500); }, now: () => now, ...noWait };
  await assert.rejects(recordQuizResult(idArgs, deps, resolver), (e: unknown) => e instanceof SaveExamFailure && e.failure.kind === 'server');
  assert.equal(getAwaitingIdentity(AID), null);
  assert.equal(sent, 2, 'una richiesta + un solo retry automatico');
  assert.equal(item(AID).status, 'failed');
  assert.equal(item(AID).persisted, true);
  assert.deepEqual(quizKeys(), [outboxKey(AID, UID)]);
  let ok = 0;
  await retryResult(AID, { send: async (p: any) => { ok++; assert.equal(p.attemptId, AID); return {}; }, now: () => now + COOLDOWN_MS + 1 });
  assert.equal(ok, 1);
});

test('identity arrives from the auth provider while waiting (user.id hydrated): completes once, no cooldown wait needed', async () => {
  const c = { fetch: 0 }; const sent: any[] = [];
  const deps = { send: async (p: any) => { sent.push(p); return {}; }, now: () => 9_000_000 };
  await assert.rejects(recordQuizResult(idArgs, deps, unknownId(c)));
  assert.equal(await completeAwaiting(AID, async () => UID, deps, false), String(UID));
  assert.equal(sent.length, 1);
  assert.equal(sent[0].attemptId, AID);
  await assert.rejects(completeAwaiting(AID, async () => UID, deps, false), (e: unknown) => e instanceof SaveExamFailure && e.failure.kind === 'rejected');
  assert.equal(sent.length, 1, 'una seconda chiamata non puo duplicare');
});

test('two concurrent identity retries share one resolution and one save', async () => {
  const c = { fetch: 0 }; let sent = 0; let resolves = 0; let release!: () => void;
  const gate = new Promise<void>((r) => { release = r; });
  const deps = { send: async () => { sent++; return {}; }, now: () => 11_000_000 };
  await assert.rejects(recordQuizResult(idArgs, deps, unknownId(c)));
  const resolve = async () => { resolves++; await gate; return UID; };
  const a = completeAwaiting(AID, resolve, deps, false);
  const b = completeAwaiting(AID, resolve, deps, false);
  release();
  await Promise.all([a, b]);
  assert.equal(resolves, 1);
  assert.equal(sent, 1);
});

test('logout / token cleared drops the in-memory result: it can never be sent under another identity', async () => {
  const c = { fetch: 0 }; let sent = 0;
  const deps = { send: async () => { sent++; return {}; }, now: () => 13_000_000 };
  await assert.rejects(recordQuizResult(idArgs, deps, unknownId(c)));
  clearAwaitingIdentity();
  assert.equal(getAwaitingIdentity(AID), null);
  await assert.rejects(retryUnresolvedResult(AID, deps, { hasToken: () => true, cachedId: () => 99, fetchId: async () => 99 }),
    (e: unknown) => e instanceof SaveExamFailure && e.failure.kind === 'rejected');
  assert.equal(sent, 0);
  assert.deepEqual(quizKeys(), []);
});

test('identity lookup that hangs is bounded and reported as unresolved (no stuck "saving")', async () => {
  const hang = { hasToken: () => true, cachedId: () => null, fetchId: () => new Promise<never>(() => {}) };
  const { resolveUserId } = await import('../src/lib/quiz-result-save');
  const orig = global.setTimeout;
  (global as any).setTimeout = (fn: () => void, ms?: number) => orig(fn, ms && ms >= 10_000 ? 5 : ms);
  try { assert.equal(await resolveUserId(hang), null); } finally { (global as any).setTimeout = orig; }
});
