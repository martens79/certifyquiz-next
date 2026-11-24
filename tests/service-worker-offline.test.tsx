import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import vm from 'node:vm';
import { JSDOM } from 'jsdom';

// Regression tests for the offline fallback (public/sw.js + public/offline.html).
// They exercise the real files with an in-memory Cache Storage and no network.
// They do NOT prove why a given user could not reach the site: they pin what the
// fallback does once a navigation has failed.

const SW_SOURCE = readFileSync('public/sw.js', 'utf8');
const OFFLINE_HTML = readFileSync('public/offline.html', 'utf8');
const SW_V4_SOURCE = readFileSync('tests/fixtures/quiz-sw-v4.js', 'utf8');
const ORIGIN = 'https://www.certifyquiz.com';

type Listener = (event: any) => void;

class MemoryCache {
  entries = new Map<string, Response>();
  async addAll(urls: string[]) { for (const u of urls) this.entries.set(new URL(u, ORIGIN).pathname, new Response(OFFLINE_HTML, { headers: { 'content-type': 'text/html' } })); }
  async put(url: string, res: Response) { this.entries.set(new URL(url, ORIGIN).pathname, res); }
}

class MemoryCacheStorage {
  stores = new Map<string, MemoryCache>();
  async open(name: string) { if (!this.stores.has(name)) this.stores.set(name, new MemoryCache()); return this.stores.get(name)!; }
  async keys() { return [...this.stores.keys()]; }
  async delete(name: string) { return this.stores.delete(name); }
  async match(request: string | { url: string }) {
    const path = new URL(typeof request === 'string' ? request : request.url, ORIGIN).pathname;
    for (const s of this.stores.values()) { const hit = s.entries.get(path); if (hit) return hit.clone(); }
    return undefined;
  }
}

function createWorker(source: string, opts: { caches?: MemoryCacheStorage; online?: boolean } = {}) {
  const listeners = new Map<string, Listener>();
  const cacheStorage = opts.caches ?? new MemoryCacheStorage();
  const state = {
    now: 1_000_000,
    online: opts.online ?? true,
    fetchCalls: [] as string[],
    timerDelays: [] as number[],
    skipWaiting: 0,
    claimed: 0,
    // Each fetch outcome is consumed in order; an exhausted list repeats the last one.
    outcomes: [] as Array<{ fail: true; takes?: number } | { fail?: false; body?: string; status?: number }>,
  };
  const self: any = {
    location: { origin: ORIGIN },
    get navigator() { return { onLine: state.online }; },
    addEventListener: (type: string, fn: Listener) => listeners.set(type, fn),
    skipWaiting: () => { state.skipWaiting++; },
    clients: { claim: async () => { state.claimed++; }, matchAll: async () => [] },
    registration: { showNotification: async () => undefined },
  };
  const sandbox: any = {
    self, caches: cacheStorage, Response, URL, Promise, JSON, Number, Object, Array, String, Error, TypeError, console,
    Date: { now: () => state.now },
    setTimeout: (fn: () => void, ms: number) => { state.timerDelays.push(ms); state.now += ms; Promise.resolve().then(fn); return 0; },
    fetch: async (request: { url: string }) => {
      state.fetchCalls.push(request.url);
      const outcome = state.outcomes.length > 1 ? state.outcomes.shift()! : state.outcomes[0];
      if (!outcome) throw new Error('no fetch outcome configured');
      if (outcome.fail) { state.now += (outcome as any).takes ?? 5; throw new TypeError('Failed to fetch'); }
      return new Response(outcome.body ?? 'NETWORK_OK', { status: outcome.status ?? 200 });
    },
  };
  sandbox.globalThis = sandbox;
  vm.runInNewContext(source, sandbox);
  // Run lifecycle events; waitUntil/respondWith collect the promises.
  const dispatch = async (type: string, event: any) => {
    const pending: Promise<unknown>[] = [];
    let responded: Promise<Response> | undefined;
    const full = { ...event, waitUntil: (p: Promise<unknown>) => pending.push(p), respondWith: (p: Promise<Response>) => { responded = p; } };
    listeners.get(type)!(full);
    await Promise.all(pending);
    return responded;
  };
  return {
    state, cacheStorage,
    install: () => dispatch('install', {}),
    activate: () => dispatch('activate', {}),
    fetchEvent: (url: string, init: { mode?: string; method?: string } = {}) =>
      dispatch('fetch', { request: { url: new URL(url, ORIGIN).href, method: init.method ?? 'GET', mode: init.mode ?? 'navigate' } }),
  };
}

const text = async (r: Response | undefined) => (await r!).text();

// ---------------------------------------------------------------- service worker

test('the worker uses the v5 cache and precaches only the offline page', async () => {
  assert.match(SW_SOURCE, /CACHE_NAME = "certifyquiz-v5"/);
  const w = createWorker(SW_SOURCE);
  await w.install();
  assert.deepEqual(await w.cacheStorage.keys(), ['certifyquiz-v5']);
  assert.deepEqual([...(await w.cacheStorage.open('certifyquiz-v5')).entries.keys()], ['/offline.html']);
  assert.equal(w.state.skipWaiting, 1);
});

test('online navigation is passed to the network once, without delay or fallback', async () => {
  const w = createWorker(SW_SOURCE); await w.install();
  w.state.outcomes = [{ body: 'PAGE' }];
  const res = await w.fetchEvent('/es/login?redirect=%2Fes%2Fquiz');
  assert.equal(await text(res), 'PAGE');
  assert.equal(w.state.fetchCalls.length, 1);
  assert.deepEqual(w.state.timerDelays, []);
});

test('a fast navigation failure is retried once and a recovered page is served', async () => {
  const w = createWorker(SW_SOURCE); await w.install();
  w.state.outcomes = [{ fail: true, takes: 20 }, { body: 'RECOVERED' }];
  const res = await w.fetchEvent('/es/certificaciones/ccna');
  assert.equal(await text(res), 'RECOVERED');
  assert.equal(w.state.fetchCalls.length, 2);
  assert.deepEqual(w.state.fetchCalls, [`${ORIGIN}/es/certificaciones/ccna`, `${ORIGIN}/es/certificaciones/ccna`]);
  assert.deepEqual(w.state.timerDelays, [350]);
});

test('two failures serve the offline page after exactly two attempts', async () => {
  const w = createWorker(SW_SOURCE); await w.install();
  w.state.outcomes = [{ fail: true, takes: 20 }];
  const res = await w.fetchEvent('/es/login');
  assert.match(await text(res), /cq-retry/);
  assert.equal(w.state.fetchCalls.length, 2);
});

test('a slow failure is not retried, so a hanging request never waits twice', async () => {
  const w = createWorker(SW_SOURCE); await w.install();
  w.state.outcomes = [{ fail: true, takes: 30_000 }];
  const res = await w.fetchEvent('/es/login');
  assert.match(await text(res), /cq-retry/);
  assert.equal(w.state.fetchCalls.length, 1);
  assert.deepEqual(w.state.timerDelays, []);
});

test('a device that reports offline gets the offline page immediately, without retry', async () => {
  const w = createWorker(SW_SOURCE, { online: false }); await w.install();
  w.state.outcomes = [{ fail: true }];
  const res = await w.fetchEvent('/es/login');
  assert.match(await text(res), /cq-retry/);
  assert.equal(w.state.fetchCalls.length, 1);
  assert.deepEqual(w.state.timerDelays, []);
});

test('after the connection returns, the same navigation reaches the network again', async () => {
  const w = createWorker(SW_SOURCE, { online: false }); await w.install();
  w.state.outcomes = [{ fail: true }];
  assert.match(await text(await w.fetchEvent('/es/login?x=1')), /cq-retry/);
  w.state.online = true; w.state.outcomes = [{ body: 'BACK_ONLINE' }];
  assert.equal(await text(await w.fetchEvent('/es/login?x=1')), 'BACK_ONLINE');
});

test('HTTP errors are real responses: no fallback and no retry', async () => {
  const w = createWorker(SW_SOURCE); await w.install();
  w.state.outcomes = [{ body: 'bad gateway', status: 502 }];
  const res = await (await w.fetchEvent('/es/login'))!;
  assert.equal(res.status, 502);
  assert.equal(w.state.fetchCalls.length, 1);
});

test('API and asset requests are never retried and never receive HTML', async () => {
  for (const url of ['/api/backend/ccst-versioned-training/attempts?x=1', '/api/backend/questions?topic=1', '/_next/static/chunks/app.js', '/icons/icon-192.png']) {
    const w = createWorker(SW_SOURCE); await w.install();
    w.state.outcomes = [{ fail: true, takes: 20 }];
    const res = await (await w.fetchEvent(url, { mode: 'cors' }))!;
    assert.equal(res.status, 503, url);
    assert.equal(res.headers.get('cache-control'), 'no-store', url);
    assert.equal(await res.text(), 'Service unavailable', url);
    assert.equal(w.state.fetchCalls.length, 1, url);
    assert.deepEqual(w.state.timerDelays, [], url);
  }
});

test('non-GET requests are left to the browser', async () => {
  const w = createWorker(SW_SOURCE); await w.install();
  w.state.outcomes = [{ body: 'x' }];
  assert.equal(await w.fetchEvent('/api/backend/auth/login', { method: 'POST', mode: 'cors' }), undefined);
  assert.equal(w.state.fetchCalls.length, 0);
});

test('upgrade v4 to v5: install keeps serving, activation removes every old cache and claims clients', async () => {
  const caches = new MemoryCacheStorage();
  const v4 = createWorker(SW_V4_SOURCE, { caches });
  await v4.install(); await v4.activate();
  await (await caches.open('certifyquiz-v3')).put('/__stale.js', new Response('OBSOLETE'));
  assert.deepEqual((await caches.keys()).sort(), ['certifyquiz-v3', 'certifyquiz-v4']);

  const v5 = createWorker(SW_SOURCE, { caches });
  await v5.install();
  assert.ok((await caches.keys()).includes('certifyquiz-v4'), 'v4 cache survives until v5 activates');
  await v5.activate();
  assert.deepEqual(await caches.keys(), ['certifyquiz-v5']);
  assert.equal(v5.state.skipWaiting, 1);
  assert.equal(v5.state.claimed, 1);
  assert.match((await (await caches.match('/offline.html'))!.text()), /cq-retry/, 'offline page comes from the new cache');
});

test('push and click handlers are unchanged by the fallback fix', () => {
  const v4 = SW_V4_SOURCE.slice(SW_V4_SOURCE.indexOf('function safeNotificationUrl'));
  const v5 = SW_SOURCE.slice(SW_SOURCE.indexOf('function safeNotificationUrl'));
  assert.equal(v5, v4);
});

// ---------------------------------------------------------------- offline page

function openOffline(url: string, languages: string[] = ['en-US']) {
  const dom = new JSDOM(OFFLINE_HTML, {
    url, runScripts: 'dangerously',
    beforeParse(window) {
      Object.defineProperty(window.navigator, 'languages', { value: languages, configurable: true });
      Object.defineProperty(window.navigator, 'language', { value: languages[0], configurable: true });
    },
  });
  const w: any = dom.window;
  const calls: Array<[string, string?]> = [];
  w.cqOffline.nav.reload = () => calls.push(['reload']);
  w.cqOffline.nav.assign = (u: string) => calls.push(['assign', u]);
  return { dom, w, calls, doc: w.document as Document };
}

test('the offline page follows the locale of the failed URL in IT/EN/FR/ES', () => {
  const expected: Array<[string, string, RegExp, RegExp]> = [
    ['/it/login', 'it', /Impossibile caricare/, /^Riprova$/],
    ['/fr/connexion', 'fr', /Impossible de charger/, /^Réessayer$/],
    ['/es/login', 'es', /No se pudo cargar/, /^Reintentar$/],
    ['/certifications/ccna', 'en', /couldn't load/, /^Try again$/],
  ];
  for (const [path, lang, title, button] of expected) {
    const { doc } = openOffline(`${ORIGIN}${path}`, ['en-US']);
    assert.equal(doc.documentElement.lang, lang, path);
    assert.match(doc.getElementById('cq-title')!.textContent!, title, path);
    assert.match(doc.getElementById('cq-retry')!.textContent!, button, path);
  }
});

test('an EN root URL follows the browser language when it is IT/FR/ES, else English', () => {
  assert.equal(openOffline(`${ORIGIN}/certifications/ccna`, ['es-ES', 'en']).doc.documentElement.lang, 'es');
  assert.equal(openOffline(`${ORIGIN}/`, ['fr-CA']).doc.documentElement.lang, 'fr');
  assert.equal(openOffline(`${ORIGIN}/`, ['de-DE']).doc.documentElement.lang, 'en');
});

test('the copy is neutral: it does not blame the user connection or promise cached pages', () => {
  for (const lang of ['en', 'it', 'fr', 'es']) {
    const { doc } = openOffline(`${ORIGIN}/${lang}/x`);
    const all = doc.body.textContent!.toLowerCase();
    assert.doesNotMatch(all, /check your internet|previously visited|controlla la tua connessione|vérifiez votre connexion|comprueba tu conexión/, lang);
  }
});

test('retry reloads the ORIGINAL URL instead of sending the user to the homepage', () => {
  const { doc, calls } = openOffline(`${ORIGIN}/es/certificaciones/ccna?tab=2#top`);
  (doc.getElementById('cq-retry') as HTMLButtonElement).click();
  assert.deepEqual(calls, [['reload']]);
});

test('only host and path are shown: the query string and hash (possible tokens) are never rendered', () => {
  const { doc, dom } = openOffline(`${ORIGIN}/auth/callback?token=SECRET123&redirect=%2Fes#frag`);
  const where = doc.getElementById('cq-where')!.textContent!;
  assert.match(where, /www\.certifyquiz\.com\/auth\/callback/);
  assert.doesNotMatch(dom.serialize(), /SECRET123/);
});

test('opening /offline.html directly retries to the site root of the page language', () => {
  const a = openOffline(`${ORIGIN}/offline.html`, ['es-ES']); (a.doc.getElementById('cq-retry') as HTMLButtonElement).click();
  assert.deepEqual(a.calls, [['assign', '/es']]);
  const b = openOffline(`${ORIGIN}/offline.html`, ['en-GB']); (b.doc.getElementById('cq-retry') as HTMLButtonElement).click();
  assert.deepEqual(b.calls, [['assign', '/']]);
  assert.equal(b.doc.getElementById('cq-where')!.textContent, '');
});

test('when the connection returns the page retries once automatically, never in a loop', () => {
  const { w, calls } = openOffline(`${ORIGIN}/es/login`);
  w.dispatchEvent(new w.Event('online'));
  w.dispatchEvent(new w.Event('online'));
  assert.deepEqual(calls, [['reload']]);
});

test('the page works without relying on any network resource', () => {
  assert.doesNotMatch(OFFLINE_HTML, /<link[^>]+href=|<script[^>]+src=|<img[^>]+src=|@import|url\(\s*['"]?https?:/i);
});
