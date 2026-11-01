import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import {
  createVersionedTrainingClient,
  versionedTrainingRequest,
  VersionedTrainingError,
  type TrainingState,
  type VersionedTrainingClient,
} from '../src/lib/ccst-versioned-training';

// In-memory model of the production backend (services/ccstVersionedAttempts.js):
//  - PUT /progress requires expectedRev === rev, otherwise 409 STALE_REVISION;
//  - POST /answers records the evaluation, writes marked[q] and bumps rev;
//  - POST /complete bumps rev and derives the summary from recorded evaluations only.
// Every request is asynchronous so that concurrent client requests really interleave.
const TOPIC = 365;
const USER = 246;
const STORAGE_KEY = `cq:ccst34:versioned:${USER}:${TOPIC}:it`;

type Json = Record<string, any>;
type Gate = { match: (method: string, path: string) => boolean; wait: Promise<void> };

function prng(seed: number) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function makeServer(o: { n?: number; versions?: string[]; seed?: number } = {}) {
  const n = o.n ?? 12;
  const versions = o.versions ?? ['release-04-v4'];
  const rnd = o.seed ? prng(o.seed) : null;
  const ids = Array.from({ length: n }, (_, i) => 19000 + i);
  const questions = ids.map((id, i) => ({
    id, topic_id: TOPIC, question: `Synthetic question ${id}`,
    contentVersion: versions[i % versions.length], contentHash: 'a'.repeat(64),
    answers: [1, 2, 3, 4].map(k => ({ id: id * 10 + k, text: `Synthetic answer ${k}` })),
  }));
  const err = (code: string, status: number) => new VersionedTrainingError(code, status);
  const srv = {
    ids, questions, seq: 0, id: '', rev: 0, state: { marked: {}, reviewLater: [], currentIndex: 0 } as Json,
    log: [] as string[], writing: 0, maxWriting: 0,
    before: null as null | ((method: string, path: string) => void | Promise<void>),
    gates: [] as Gate[], failNext: null as null | string,
    request: null as any, foreignAnswer: null as any, foreignNav: null as any,
    count: (prefix: string) => srv.log.filter(l => l.startsWith(prefix)).length,
  };
  const fresh = () => { srv.seq++; srv.id = `fixture-attempt-${srv.seq}`; srv.rev = 0; srv.state = { marked: {}, reviewLater: [], currentIndex: 0 }; };
  const out = () => ({
    id: srv.id, lang: 'it', certificationId: 34, contentVersion: versions[0], seed: 1, startedAt: 1729300000000,
    expiresAt: null, rev: srv.rev, expired: false, state: structuredClone(srv.state), questions: structuredClone(questions),
  });
  const evaluate = (questionId: number, answerId: number) => {
    const q = questions.find(x => x.id === questionId);
    if (!q || !q.answers.some(a => a.id === answerId)) throw err('QUESTION_SCOPE', 400);
    const old = srv.state.evaluations?.[questionId];
    if (old && old.answerId !== answerId) throw err('ANSWER_ALREADY_RECORDED', 409);
    if (srv.state.completed && !old) throw err('ATTEMPT_COMPLETED', 409);
    const saved = { correct: answerId === questionId * 10 + 1, correct_answer_id: questionId * 10 + 1, contentVersion: q.contentVersion, contentHash: q.contentHash, answerId };
    srv.state = { ...srv.state, evaluations: { ...(srv.state.evaluations || {}), [questionId]: saved }, marked: { ...srv.state.marked, [questionId]: answerId } };
    srv.rev++;
    return saved;
  };
  srv.foreignAnswer = (questionId: number, answerId: number) => evaluate(questionId, answerId);
  srv.foreignNav = (idx: number) => { srv.state = { ...srv.state, currentIndex: idx }; srv.rev++; };
  srv.request = async (path: string, init?: { method?: string; body?: string }) => {
    const method = init?.method ?? 'GET';
    const body = init?.body ? JSON.parse(init.body) : undefined;
    const write = method !== 'GET';
    srv.log.push(`${method} ${path.replace(/\?.*/, '').replace(/\/attempts\/[^/]+/, '/attempts/:id')}`);
    if (write) { srv.writing++; srv.maxWriting = Math.max(srv.maxWriting, srv.writing); }
    try {
      for (const g of srv.gates) if (g.match(method, path)) await g.wait;
      await new Promise(r => setTimeout(r, rnd ? Math.floor(rnd() * 4) : 0));
      if (srv.failNext === method) { srv.failNext = null; throw new TypeError('network'); }
      await srv.before?.(method, path);
      if (path.startsWith('/latest')) return { attempt: srv.id ? out() : null };
      if (method === 'POST' && path === '/attempts') { fresh(); return out(); }
      const m = path.match(/^\/attempts\/([^/]+)(?:\/(progress|answers|complete))?$/);
      if (!m || m[1] !== srv.id) throw err('ATTEMPT_NOT_FOUND', 404);
      if (method === 'GET' && !m[2]) return out();
      if (method === 'PUT' && m[2] === 'progress') {
        if (srv.state.completed) throw err('ATTEMPT_COMPLETED', 409);
        if (body.expectedRev !== srv.rev) throw err('STALE_REVISION', 409);
        const ev = srv.state.evaluations || {};
        for (const [q, e] of Object.entries<any>(ev)) if (body.state.marked[q] != null && body.state.marked[q] !== e.answerId) throw err('ANSWER_ALREADY_RECORDED', 409);
        srv.state = { ...structuredClone(body.state), ...(Object.keys(ev).length ? { evaluations: ev } : {}) };
        for (const [q, e] of Object.entries<any>(ev)) srv.state.marked[q] = e.answerId;
        srv.rev++;
        return out();
      }
      if (method === 'POST' && m[2] === 'answers') return evaluate(body.questionId, body.answerId);
      if (method === 'POST' && m[2] === 'complete') {
        if (!srv.state.completed) {
          const es = Object.values<any>(srv.state.evaluations || {});
          srv.state = { ...srv.state, completed: true, summary: { total: n, answered: es.length, correct: es.filter(e => e.correct).length, scorePct: 0 } };
          srv.rev++;
        }
        return out();
      }
      throw err('NOT_FOUND', 404);
    } finally { if (write) srv.writing--; }
  };
  return srv;
}
type Server = ReturnType<typeof makeServer>;

function makeStorage() {
  const map = new Map<string, string>();
  return { map, getItem: (k: string) => map.get(k) ?? null, setItem: (k: string, v: string) => { map.set(k, v); } };
}
type Storage = ReturnType<typeof makeStorage>;
const pendingOf = (s: Storage) => JSON.parse(s.map.get(STORAGE_KEY) || '{}').pending;

function makeClient(srv: Server, storage: Storage = makeStorage()): VersionedTrainingClient {
  return createVersionedTrainingClient({
    userId: USER, topicId: TOPIC, lang: 'it', storage, request: srv.request, randomKey: () => 'fixture-start-key-123456789',
  });
}

// What QuizEngine does on a click: the checkAnswer call and the autosave effect start together, without awaiting each other.
async function clickAnswer(c: VersionedTrainingClient, srv: Server, marked: Record<string, number | null>, i: number) {
  const q = srv.ids[i], a = q * 10 + 1;
  marked[q] = a;
  const state: TrainingState = { marked: { ...marked }, reviewLater: [], currentIndex: i };
  return Promise.allSettled([c.checkAnswer(q, a), c.save(state)]);
}
const assertAllFulfilled = (results: PromiseSettledResult<unknown>[]) => {
  for (const r of results) assert.equal(r.status, 'fulfilled', r.status === 'rejected' ? String((r as PromiseRejectedResult).reason?.message) : '');
};

test('answer click: PUT /progress and POST /answers never overlap and the attempt is never left stuck', async () => {
  const srv = makeServer();
  const storage = makeStorage();
  const c = makeClient(srv, storage);
  await c.open();
  const marked: Record<string, number | null> = {};
  for (let i = 0; i < 6; i++) assertAllFulfilled(await clickAnswer(c, srv, marked, i));
  assert.equal(srv.maxWriting, 1, 'rev-changing requests must be serialized');
  assert.equal(srv.count('POST /attempts/:id/answers'), 6);
  assert.equal(Object.keys(srv.state.evaluations).length, 6);
  assert.equal(pendingOf(storage), undefined);
});

test('rapid answers with random latencies lose and duplicate nothing, then complete', async () => {
  for (const seed of [1, 2, 3, 4, 5]) {
    const srv = makeServer({ n: 30, seed });
    const storage = makeStorage();
    const c = makeClient(srv, storage);
    await c.open();
    const marked: Record<string, number | null> = {};
    for (let i = 0; i < 30; i++) {
      assertAllFulfilled(await clickAnswer(c, srv, marked, i));
      void c.save({ marked: { ...marked }, reviewLater: [], currentIndex: Math.min(i + 1, 29) }).catch(() => {});
    }
    const done = await c.complete();
    assert.equal(done.state.summary?.answered, 30, `seed ${seed}`);
    assert.equal(done.state.summary?.correct, 30);
    assert.equal(srv.count('POST /attempts/:id/answers'), 30, 'one evaluation POST per answer');
    assert.equal(srv.count('POST /attempts/:id/complete'), 1);
    assert.equal(srv.maxWriting, 1);
    assert.equal(pendingOf(storage), undefined, 'no unsent progress left behind');
    for (const q of srv.ids) assert.equal(srv.state.marked[q], q * 10 + 1);
  }
});

test('works on R03, R04 and W1 content versions, including mixed fallback items', async () => {
  for (const versions of [['release-03-v3'], ['release-04-v4', 'legacy-v1'], ['release-11-v11', 'release-04-v4', 'legacy-v1', 'release-02-v2']]) {
    const srv = makeServer({ n: 9, versions, seed: 7 });
    const c = makeClient(srv);
    await c.open();
    const marked: Record<string, number | null> = {};
    for (let i = 0; i < 9; i++) assertAllFulfilled(await clickAnswer(c, srv, marked, i));
    const done = await c.complete();
    assert.equal(done.state.summary?.answered, 9, versions.join());
    assert.equal(srv.maxWriting, 1);
  }
});

test('complete() waits for the saves issued before it', async () => {
  const srv = makeServer();
  const c = makeClient(srv);
  await c.open();
  let release!: () => void;
  srv.gates.push({ match: (m, p) => m === 'PUT' && p.endsWith('/progress'), wait: new Promise<void>(r => { release = r; }) });
  const saving = c.save({ marked: {}, reviewLater: [], currentIndex: 3 });
  const completing = c.complete();
  await new Promise(r => setTimeout(r, 15));
  assert.equal(srv.count('POST /attempts/:id/complete'), 0, 'complete must not start while a save is in flight');
  release();
  await saving;
  const done = await completing;
  assert.equal(done.state.completed, true);
  const order = srv.log.filter(l => l.startsWith('PUT') || l.endsWith('/complete'));
  assert.deepEqual(order, ['PUT /attempts/:id/progress', 'POST /attempts/:id/complete']);
});

test('STALE_REVISION caused by a compatible foreign evaluation is recovered with exactly one retry', async () => {
  const srv = makeServer();
  const storage = makeStorage();
  const c = makeClient(srv, storage);
  await c.open();
  let fired = false;
  srv.before = async (method, path) => {
    if (method === 'PUT' && path.endsWith('/progress') && !fired) { fired = true; srv.foreignAnswer(srv.ids[3], srv.ids[3] * 10 + 1); }
  };
  const first = srv.ids[0];
  const saved = await c.save({ marked: { [first]: first * 10 + 1 }, reviewLater: [], currentIndex: 0 });
  const puts = srv.log.filter(l => l.startsWith('PUT')).length;
  assert.equal(puts, 2, 'the stale PUT plus exactly one retry');
  assert.equal(srv.state.marked[first], first * 10 + 1, 'local answer kept');
  assert.equal(srv.state.marked[srv.ids[3]], srv.ids[3] * 10 + 1, 'remote evaluation kept');
  assert.equal(saved.rev, srv.rev);
  assert.equal(pendingOf(storage), undefined);
});

test('an incompatible remote change is not overwritten: explicit conflict, no retry, then recoverable', async () => {
  const srv = makeServer();
  const storage = makeStorage();
  const c = makeClient(srv, storage);
  await c.open();
  const before = srv.log.filter(l => l.startsWith('PUT')).length;
  let fired = false;
  srv.before = async (method, path) => {
    if (method === 'PUT' && path.endsWith('/progress') && !fired) { fired = true; srv.foreignNav(7); }
  };
  await assert.rejects(c.save({ marked: {}, reviewLater: [], currentIndex: 1 }), (e: unknown) =>
    e instanceof VersionedTrainingError && e.message === 'PROGRESS_CONFLICT' && e.status === 409 && !!e.server && !!e.pending);
  assert.equal(srv.log.filter(l => l.startsWith('PUT')).length - before, 1, 'no blind retry');
  assert.equal(srv.state.currentIndex, 7, 'remote navigation untouched');
  assert.ok(pendingOf(storage), 'unsent local copy retained for the explicit recovery');
  await c.useServerProgress();
  assert.equal(pendingOf(storage), undefined);
  assert.ok([...storage.map.keys()].some(k => k.includes(':conflict:')), 'backup of the unsent copy');
  const ok = await c.save({ marked: {}, reviewLater: [], currentIndex: 8 });
  assert.equal(ok.state.currentIndex, 8, 'attempt is usable again');
});

test('only one retry: a second STALE_REVISION fails, and the next save still goes through', async () => {
  const srv = makeServer();
  const c = makeClient(srv);
  await c.open();
  let k = 0, active = true;
  srv.before = async (method, path) => {
    if (active && method === 'PUT' && path.endsWith('/progress')) { k++; srv.foreignAnswer(srv.ids[k], srv.ids[k] * 10 + 1); }
  };
  const before = srv.log.filter(l => l.startsWith('PUT')).length;
  await assert.rejects(c.save({ marked: {}, reviewLater: [], currentIndex: 0 }), (e: unknown) => e instanceof VersionedTrainingError && e.message === 'STALE_REVISION');
  assert.equal(srv.log.filter(l => l.startsWith('PUT')).length - before, 2, 'exactly one retry');
  active = false;
  const ok = await c.save({ marked: {}, reviewLater: [], currentIndex: 2 });
  assert.equal(ok.state.currentIndex, 2, 'not permanently blocked after a failed save');
});

test('reload after an interrupted save heals automatically when the server only gained compatible evaluations', async () => {
  const srv = makeServer();
  const storage = makeStorage();
  const a = makeClient(srv, storage);
  await a.open();
  srv.failNext = 'PUT';
  const q = srv.ids[0];
  await assert.rejects(a.save({ marked: { [q]: q * 10 + 1 }, reviewLater: [], currentIndex: 4 }));
  assert.ok(pendingOf(storage), 'interrupted write is retained');
  srv.foreignAnswer(srv.ids[5], srv.ids[5] * 10 + 1);
  const b = makeClient(srv, storage);
  const reopened = await b.open();
  assert.equal(reopened.state.currentIndex, 4);
  assert.equal(reopened.state.marked[q], q * 10 + 1);
  assert.equal(reopened.state.marked[srv.ids[5]], srv.ids[5] * 10 + 1);
  assert.equal(pendingOf(storage), undefined);
});

test('resume after a clean save returns the saved progress without creating another attempt', async () => {
  const srv = makeServer();
  const storage = makeStorage();
  const a = makeClient(srv, storage);
  await a.open();
  const marked: Record<string, number | null> = {};
  for (let i = 0; i < 4; i++) assertAllFulfilled(await clickAnswer(a, srv, marked, i));
  const b = makeClient(srv, storage);
  const again = await b.open();
  assert.equal(srv.log.filter(l => l === 'POST /attempts').length, 1, 'attempt created once');
  assert.equal(again.id, srv.id);
  assert.equal(again.state.currentIndex, 3);
  assert.equal(Object.keys(again.state.marked).length, 4);
});

test('the same answer submitted twice (double click) is recorded once', async () => {
  const srv = makeServer();
  const c = makeClient(srv);
  await c.open();
  const q = srv.ids[0], a = q * 10 + 1;
  const [r1, r2] = await Promise.all([c.checkAnswer(q, a), c.checkAnswer(q, a)]);
  assert.deepEqual(r1, r2);
  assert.equal(Object.keys(srv.state.evaluations).length, 1);
  await assert.rejects(c.checkAnswer(q, q * 10 + 2), (e: unknown) => e instanceof VersionedTrainingError && e.message === 'ANSWER_ALREADY_RECORDED');
  assert.equal(srv.state.marked[q], a, 'recorded answer is not overwritten');
});

test('restart() is never blocked by an unresolved conflict and keeps a backup of the unsent copy', async () => {
  const srv = makeServer();
  const storage = makeStorage();
  const c = makeClient(srv, storage);
  await c.open();
  let fired = false;
  srv.before = async (method, path) => {
    if (method === 'PUT' && path.endsWith('/progress') && !fired) { fired = true; srv.foreignNav(9); }
  };
  await assert.rejects(c.save({ marked: {}, reviewLater: [], currentIndex: 2 }));
  const oldId = srv.id;
  const next = await c.restart();
  assert.notEqual(next.id, oldId);
  assert.equal(pendingOf(storage), undefined);
  assert.ok([...storage.map.keys()].some(k => k.includes(':conflict:')));
});

test('a pending write stored by the previous client version (no base copy) keeps its conservative behaviour', async () => {
  const srv = makeServer();
  const storage = makeStorage();
  const c = makeClient(srv, storage);
  await c.open();
  const handle = JSON.parse(storage.map.get(STORAGE_KEY)!);
  handle.pending = { baseRev: 0, state: { marked: {}, reviewLater: [], currentIndex: 5 } };
  storage.map.set(STORAGE_KEY, JSON.stringify(handle));
  const same = await makeClient(srv, storage).open();
  assert.equal(same.state.currentIndex, 5, 'old-format pending replays when the revision matches');
  handle.pending = { baseRev: 0, state: { marked: {}, reviewLater: [], currentIndex: 6 } };
  storage.map.set(STORAGE_KEY, JSON.stringify(handle));
  srv.foreignAnswer(srv.ids[1], srv.ids[1] * 10 + 1);
  await assert.rejects(makeClient(srv, storage).open(), (e: unknown) => e instanceof VersionedTrainingError && e.message === 'PROGRESS_CONFLICT' && e.status === 409 && !!e.server && !!e.pending);
});

test('transport: GET is retried once on a network error, PUT and POST are not', async () => {
  let calls = 0;
  const ok = { ok: true, status: 200, json: async () => ({ fine: true }) } as unknown as Response;
  const flaky = versionedTrainingRequest(async () => { calls++; if (calls === 1) throw new TypeError('network'); return ok; });
  assert.deepEqual(await flaky('/latest'), { fine: true });
  assert.equal(calls, 2);
  calls = 0;
  const writer = versionedTrainingRequest(async () => { calls++; throw new TypeError('network'); });
  await assert.rejects(writer('/attempts/x/progress', { method: 'PUT', body: '{}' }));
  assert.equal(calls, 1);
});
