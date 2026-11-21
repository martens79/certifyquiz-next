import { expect, test, type Page } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
import type { AddressInfo } from 'node:net';

// Real Chrome, real Service Worker, local static server: no production, no network.
// Pins what the fallback does AFTER a navigation failed. It does not establish why any
// specific user could not reach the site.

const V4 = readFileSync('tests/fixtures/quiz-sw-v4.js', 'utf8');
const V5 = readFileSync('public/sw.js', 'utf8');
const OFFLINE = readFileSync('public/offline.html', 'utf8');

const PAGE = `<!doctype html><html><head><meta charset="utf-8"><title>STUB</title></head><body><h1 id="stub">STUB_PAGE</h1>
<script>navigator.serviceWorker.register('/sw.js');</script></body></html>`;

type Fixture = { url: string; log: Array<{ path: string; t: number }>; setDown(v: boolean): void; setSw(v: 4 | 5): void; close(): Promise<void> };

async function startServer(): Promise<Fixture> {
  const log: Array<{ path: string; t: number }> = [];
  let down = false;
  let sw: 4 | 5 = 4;
  const server = createServer((req: IncomingMessage, res: ServerResponse) => {
    const path = req.url ?? '/';
    log.push({ path, t: Date.now() });
    if (down && path !== '/sw.js') { req.socket.destroy(); return; } // fast transport failure, like a reset
    if (path === '/sw.js') { res.writeHead(200, { 'content-type': 'application/javascript', 'cache-control': 'no-store', connection: 'close' }); res.end(sw === 4 ? V4 : V5); return; }
    if (path === '/offline.html') { res.writeHead(200, { 'content-type': 'text/html', connection: 'close' }); res.end(OFFLINE); return; }
    if (path.startsWith('/api/backend/')) { res.writeHead(200, { 'content-type': 'application/json', connection: 'close' }); res.end('{"ok":true}'); return; }
    res.writeHead(200, { 'content-type': 'text/html', connection: 'close' }); res.end(PAGE);
  });
  await new Promise<void>(r => server.listen(0, '127.0.0.1', r));
  const port = (server.address() as AddressInfo).port;
  return {
    url: `http://localhost:${port}`, log,
    setDown: v => { down = v; }, setSw: v => { sw = v; },
    close: () => new Promise<void>((r, j) => { server.closeAllConnections(); server.close(e => (e ? j(e) : r())); }),
  };
}

async function controlled(page: Page) {
  await page.evaluate(() => navigator.serviceWorker.ready);
  await expect.poll(() => page.evaluate(() => !!navigator.serviceWorker.controller), { timeout: 15_000 }).toBe(true);
}

const hits = (f: Fixture, path: string) => f.log.filter(e => e.path === path).length;
// Chrome itself sends two near-simultaneous requests for a Service-Worker-controlled navigation
// (measured with the previous v4 worker, so not caused by the fix). Count separate attempts instead:
// requests more than 150 ms apart belong to different attempts.
const attempts = (f: Fixture, path: string) =>
  f.log.filter(e => e.path === path).reduce((n, e, i, all) => (i === 0 || e.t - all[i - 1].t > 150 ? n + 1 : n), 0);

test.describe('offline fallback in a real browser', () => {
  let f: Fixture;
  test.beforeEach(async () => { f = await startServer(); f.setSw(5); });
  test.afterEach(async () => { await f.close(); });

  test('failed navigation shows the localized offline page on the ORIGINAL URL and retry recovers it', async ({ page }) => {
    await page.goto(`${f.url}/es/login?x=1`);
    await controlled(page);

    f.setDown(true);
    f.log.length = 0;
    await page.goto(`${f.url}/es/login?x=1`);
    await expect(page.locator('#cq-retry')).toHaveText('Reintentar');
    expect(page.url()).toBe(`${f.url}/es/login?x=1`);                       // not redirected to the homepage
    expect(await page.locator('#cq-where').textContent()).toContain('/es/login');
    expect(await page.content()).not.toContain('x=1');                        // query never rendered
    expect(attempts(f, '/es/login?x=1')).toBe(2);                             // first attempt + exactly one bounded retry

    // Still failing: retry keeps the user on the same URL with the fallback.
    f.log.length = 0;
    await page.locator('#cq-retry').click();
    await expect(page.locator('#cq-retry')).toHaveText('Reintentar');
    expect(page.url()).toBe(`${f.url}/es/login?x=1`);
    expect(attempts(f, '/es/login?x=1')).toBe(2);

    // Back up: the same button re-requests the original URL and the real page appears.
    f.setDown(false);
    f.log.length = 0;
    await page.locator('#cq-retry').click();
    await expect(page.locator('#stub')).toHaveText('STUB_PAGE');
    expect(page.url()).toBe(`${f.url}/es/login?x=1`);
    expect(hits(f, '/es/login?x=1')).toBe(1);
  });

  test('returning online reloads the original URL automatically', async ({ page, context }) => {
    await page.goto(`${f.url}/fr/connexion`);
    await controlled(page);
    f.setDown(true);
    await page.goto(`${f.url}/fr/connexion`);
    await expect(page.locator('#cq-retry')).toHaveText('Réessayer');
    f.setDown(false);
    await context.setOffline(true);
    await context.setOffline(false);                                          // fires the page "online" event
    await expect(page.locator('#stub')).toHaveText('STUB_PAGE', { timeout: 15_000 });
    expect(page.url()).toBe(`${f.url}/fr/connexion`);
  });

  test('API requests are not retried and never receive the offline page', async ({ page }) => {
    await page.goto(`${f.url}/es/login`);
    await controlled(page);
    f.setDown(true);
    f.log.length = 0;
    const res = await page.evaluate(async () => { const r = await fetch('/api/backend/questions?topic=1'); return { status: r.status, body: await r.text(), type: r.headers.get('content-type') }; });
    expect(res).toEqual({ status: 503, body: 'Service unavailable', type: 'text/plain' });
    expect(hits(f, '/api/backend/questions?topic=1')).toBe(1);
  });

  test('real upgrade v4 to v5 replaces the old cache and the new offline page is served', async ({ page }) => {
    f.setSw(4);
    await page.goto(`${f.url}/`);
    await controlled(page);
    expect(await page.evaluate(() => caches.keys())).toEqual(['certifyquiz-v4']);
    await page.evaluate(async () => { await (await caches.open('certifyquiz-v3')).put('/__stale.js', new Response('OBSOLETE')); });

    f.setSw(5);
    await page.evaluate(async () => { const reg = await navigator.serviceWorker.ready; await reg.update(); });
    await expect.poll(() => page.evaluate(() => caches.keys()), { timeout: 20_000 }).toEqual(['certifyquiz-v5']);

    f.setDown(true);
    await page.goto(`${f.url}/it/login`);
    await expect(page.locator('#cq-retry')).toHaveText('Riprova');             // v5 page, not the old English one
  });
});
