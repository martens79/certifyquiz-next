import test from 'node:test';
import assert from 'node:assert/strict';

class MemoryStorage {
  values = new Map<string, string>();
  get length() { return this.values.size; }
  key(i: number) { return [...this.values.keys()][i] ?? null; }
  getItem(k: string) { return this.values.get(k) ?? null; }
  setItem(k: string, v: string) { this.values.set(k, String(v)); }
  removeItem(k: string) { this.values.delete(k); }
  clear() { this.values.clear(); }
}
const local = new MemoryStorage(), session = new MemoryStorage();
const win = Object.assign(new EventTarget(), { location: { hostname: '127.0.0.1', pathname: '/', search: '', href: 'http://127.0.0.1:3347/' } });
Object.assign(globalThis, { window: win, localStorage: local, sessionStorage: session });
import * as auth from '../src/lib/auth';
import * as api from '../src/lib/apiClient';
import * as boundary from '../src/lib/auth-session';
const fakeUser = { id: 990001, email: 'diagnosis@example.test', username: 'synthetic-diagnosis', role: 'user', premium: false };
const json = (status: number, body: unknown) => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });
function seed() { local.clear(); session.clear(); boundary.acceptExplicitLogin(boundary.authGeneration()); auth.setToken('synthetic-initial'); auth.setUser(fakeUser); }

test('local logout clears all token stores and outgoing quiz cache but does not call server logout', async () => {
  seed(); let calls = 0;
  globalThis.fetch = async () => { calls++; throw new Error('No network in characterization'); };
  local.setItem('cq:quiz:topic:es:training:user:990001', '{}');
  local.setItem('cq:quiz:topic:es:training:anon', '{}');
  session.setItem('cq_token', 'synthetic-legacy');
  auth.logout();
  assert.equal(auth.getToken(), null); assert.equal(auth.getUser(), null);
  assert.equal(local.getItem('cq:quiz:topic:es:training:user:990001'), null);
  assert.notEqual(local.getItem('cq:quiz:topic:es:training:anon'), null);
  assert.equal(calls, 0);
});
test('existing authLogout helper calls cookie endpoint with credentials then clears client state', async () => {
  seed(); const calls: Array<{ url: string; credentials?: string; method?: string }> = [];
  globalThis.fetch = async (input, init) => { calls.push({ url: String(input), credentials: init?.credentials, method: init?.method }); return json(200, { ok: true }); };
  await api.authLogout();
  assert.deepEqual(calls, [{ url: '/api/backend/auth/logout', credentials: 'include', method: 'POST' }]);
  assert.equal(auth.getToken(), null); assert.equal(auth.getUser(), null);
});
test('late refresh cannot republish a token or retry /me after explicit logout', async () => {
  seed(); auth.clearToken(); let release!: () => void, started!: () => void;
  const waiting = new Promise<void>(r => { started = r; });
  const gate = new Promise<void>(r => { release = r; });
  globalThis.fetch = async (input, init) => {
    const p = String(input);
    if (p.endsWith('/auth/refresh')) { started(); await gate; return json(200, { token: 'synthetic-late-refresh' }); }
    if (p.endsWith('/auth/logout')) return json(200, { ok: true });
    if (p.endsWith('/auth/me')) return new Headers(init?.headers).get('authorization') === 'Bearer synthetic-late-refresh' ? json(200, { user: fakeUser }) : json(401, { error: 'UNAUTHORIZED' });
    throw new Error('Unexpected synthetic request');
  };
  const pending = api.authMe(); await waiting;
  await api.authLogout(); assert.equal(auth.getToken(), null);
  release(); await assert.rejects(pending, /session changed/);
  assert.equal(auth.getToken(), null);
});
test('normal refresh-cookie recovery and authenticated quiz retry still work before explicit logout', async () => {
  seed(); auth.logout(); const calls: string[] = [];
  globalThis.fetch = async (input, init) => {
    const p = String(input); const bearer = new Headers(init?.headers).get('authorization');
    if (p.endsWith('/auth/refresh')) { calls.push('refresh:200'); return json(200, { token: 'synthetic-result-refresh' }); }
    if (p.endsWith('/save-exam')) {
      const valid = bearer === 'Bearer synthetic-result-refresh'; calls.push(`save-exam:${valid ? 200 : 401}`);
      return json(valid ? 200 : 401, valid ? { success: true } : { error: 'UNAUTHORIZED' });
    }
    throw new Error('Unexpected synthetic request');
  };
  await api.saveExam({ certification_id: 34, totalQuestions: 2, correctAnswers: 0, isExam: true, attempts: [] });
  assert.deepEqual(calls, ['save-exam:401', 'refresh:200', 'save-exam:200']);
});

test('explicit logout blocks quiz POSTs and both clients even if a cookie remains valid', async () => {
  seed();
  globalThis.fetch = async () => json(200, { ok: true });
  await api.authLogout(); let requests = 0;
  globalThis.fetch = async () => { requests++; throw new Error('Must not send'); };
  await assert.rejects(api.saveExam({ certification_id: 34, totalQuestions: 2, correctAnswers: 0, isExam: true }), /session changed/);
  assert.equal((await auth.apiFetch('/me/quiz-progress/85', { method: 'PUT' })).status, 401);
  assert.equal(requests, 0);
});
test('legacy quiz refresh in flight cannot set a token or retry its PUT after logout', async () => {
  seed(); let started!: () => void, release!: () => void;
  const waiting = new Promise<void>(r => { started = r; }), gate = new Promise<void>(r => { release = r; });
  let puts = 0;
  globalThis.fetch = async input => {
    if (String(input).endsWith('/auth/logout')) return json(200, {});
    if (String(input).endsWith('/auth/refresh')) { started(); await gate; return json(200, { token: 'synthetic-late' }); }
    puts++; return json(401, {});
  };
  const pending = auth.apiFetch('/me/quiz-progress/85', { method: 'PUT' }); await waiting;
  await api.authLogout(); release(); await assert.rejects(pending, /session changed/);
  assert.equal(puts, 1); assert.equal(auth.getToken(), null);
});
test('failed server logout stays blocked across storage reread; retry confirms cookie cleanup', async () => {
  seed(); globalThis.fetch = async () => json(503, {});
  await assert.rejects(api.authLogout(), /Server logout failed/);
  assert.equal(boundary.isExplicitlyLoggedOut(), true); assert.equal(boundary.isLogoutPending(), true);
  assert.equal(JSON.parse(local.getItem(boundary.AUTH_SESSION_KEY)!).loggedOut, true);
  auth.setToken('synthetic-stale'); auth.setUser(fakeUser);
  assert.equal(auth.getToken(), null); assert.equal(auth.getUser(), null);
  globalThis.fetch = async () => json(200, {}); await api.authLogout();
  assert.equal(boundary.isLogoutPending(), false); assert.equal(boundary.isExplicitlyLoggedOut(), true);
});
test('failed explicit login does not reopen logout; successful login reopens it', async () => {
  seed(); globalThis.fetch = async () => json(200, {}); await api.authLogout();
  globalThis.fetch = async () => json(401, { error: 'INVALID_LOGIN' });
  await assert.rejects(api.authLogin('synthetic@example.test', 'synthetic'));
  assert.equal(boundary.isExplicitlyLoggedOut(), true);
  globalThis.fetch = async () => json(200, { token: 'synthetic-new-login', user: fakeUser });
  await api.authLogin('synthetic@example.test', 'synthetic', false);
  assert.equal(boundary.isExplicitlyLoggedOut(), false);
  assert.equal(auth.getToken(), 'synthetic-new-login'); assert.equal(auth.getUser()?.id, fakeUser.id);
});
test('late old-generation 200 quiz response is discarded after logout and a new login', async () => {
  seed(); let release!: () => void, started!: () => void;
  const gate = new Promise<void>(r => { release = r; }), waiting = new Promise<void>(r => { started = r; });
  globalThis.fetch = async input => {
    if (String(input).endsWith('/auth/logout')) return json(200, {});
    started(); await gate; return json(200, { user: fakeUser });
  };
  const pending = api.authMe(); await waiting; await api.authLogout();
  auth.acceptLoginToken('synthetic-other-login'); release();
  await assert.rejects(pending, /session changed/);
  assert.equal(auth.getToken(), 'synthetic-other-login');
});
test('logout preserves anonymous and other-account study progress', async () => {
  seed(); local.setItem('cq:quiz:topic:es:training:anon', 'anonymous-progress');
  local.setItem('cq:quiz:topic:es:training:user:123', 'other-progress');
  local.setItem('cq:quiz:topic:es:training:user:990001', 'outgoing-cache');
  globalThis.fetch = async () => json(200, {}); await api.authLogout();
  assert.equal(local.getItem('cq:quiz:topic:es:training:anon'), 'anonymous-progress');
  assert.equal(local.getItem('cq:quiz:topic:es:training:user:123'), 'other-progress');
  assert.equal(local.getItem('cq:quiz:topic:es:training:user:990001'), null);
});

test('a delayed decoded /me body cannot escape the logout generation check', async () => {
  seed(); let release!: () => void, started!: () => void;
  const gate = new Promise<void>(r => { release = r; }), waiting = new Promise<void>(r => { started = r; });
  globalThis.fetch = async input => {
    if (String(input).endsWith('/auth/logout')) return json(200, {});
    const response = json(200, {});
    response.text = async () => { started(); await gate; return JSON.stringify({ user: fakeUser }); };
    return response;
  };
  const pending = api.authMe(); await waiting; await api.authLogout(); release();
  await assert.rejects(pending, /session changed/); assert.equal(auth.getUser(), null);
});
test('concurrent logout clicks share one server request', async () => {
  seed(); let release!: () => void; const gate = new Promise<void>(r => { release = r; }); let requests = 0;
  globalThis.fetch = async () => { requests++; await gate; return json(200, {}); };
  const first = api.authLogout(), second = api.authLogout();
  assert.equal(first, second); assert.equal(requests, 1); release(); await first;
});
test('sessionStorage fallback preserves explicit logout when localStorage is unavailable', () => {
  seed();
  const unavailable = { getItem: () => { throw new Error('storage denied'); }, setItem: () => { throw new Error('storage denied'); } };
  Object.assign(globalThis, { localStorage: unavailable });
  try {
    boundary.beginExplicitLogout();
    assert.equal(boundary.isExplicitlyLoggedOut(), true);
    assert.equal(JSON.parse(session.getItem(boundary.AUTH_SESSION_KEY)!).loggedOut, true);
  } finally { Object.assign(globalThis, { localStorage: local }); session.clear(); }
});

test('public offer reads remain available after logout without sending credentials or refreshing', async () => {
  seed(); globalThis.fetch = async () => json(200, {}); await api.authLogout();
  const calls: Array<{ url: string; credentials?: string }> = [];
  globalThis.fetch = async (input, init) => { calls.push({ url: String(input), credentials: init?.credentials }); return json(200, { offers: [] }); };
  assert.equal((await auth.apiFetch('/packages/offers/ccna')).status, 200);
  await api.getCertificationBySlug('ccna');
  assert.deepEqual(calls, [{ url: '/api/backend/packages/offers/ccna', credentials: 'omit' }, { url: '/api/backend/certifications/by-slug/ccna', credentials: 'omit' }]);
});

test('quota-full localStorage cannot hide a newer logout stored in sessionStorage', () => {
  seed();
  Object.assign(globalThis, { localStorage: { getItem: (key: string) => local.getItem(key), setItem: () => { throw new Error('quota full'); } } });
  try {
    boundary.beginExplicitLogout();
    assert.equal(boundary.isExplicitlyLoggedOut(), true);
    assert.equal(JSON.parse(session.getItem(boundary.AUTH_SESSION_KEY)!).loggedOut, true);
  } finally { Object.assign(globalThis, { localStorage: local }); session.clear(); }
});
