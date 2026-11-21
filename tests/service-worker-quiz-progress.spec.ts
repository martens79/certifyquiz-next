import { expect, test, type Page } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { createServer, request as httpRequest } from 'node:http';
import type { AddressInfo } from 'node:net';
import {
  CERT_SLUG, FakeBackend, advanceTo, answerCurrent, dismissCookieBanner,
  readHeader, readQuestionId, readStoredProgress,
} from './helpers/quiz-session-backend';

// A quiz in progress must survive a Service Worker v4 -> v5 update and a failed navigation
// followed by the offline-page retry. Runs against `next start` (E2E_BASE_URL, default :3138)
// with the simulated backend; nothing reaches production.
// It pins session behaviour only: it says nothing about why any specific user could not connect.

test.use({ serviceWorkers: 'allow', viewport: { width: 412, height: 915 }, isMobile: true, hasTouch: true });
test.describe.configure({ timeout: 120_000 });

const UPSTREAM_PORT = Number(process.env.E2E_UPSTREAM_PORT || 3138);
const MIXED = `/en/quiz/${CERT_SLUG}/mixed`;
const MIXED_SCOPE = `mixed:${CERT_SLUG}:en:training:user:42`;
const OLD_SW = readFileSync('tests/fixtures/quiz-sw-v4.js', 'utf8');
const NEW_SW = readFileSync('public/sw.js', 'utf8');
const NEW_CACHE = /CACHE_NAME = "([^"]+)"/.exec(NEW_SW)![1];

async function open(page: Page, url = MIXED) {
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await expect.poll(async () => !!(await readHeader(page)), { timeout: 90_000 }).toBe(true);
  await dismissCookieBanner(page);
  await page.waitForTimeout(1200);
}

async function activeWorker(page: Page) {
  await expect.poll(() => page.evaluate(() => navigator.serviceWorker.controller?.scriptURL ?? null), { timeout: 30_000 }).not.toBeNull();
}

async function startProxy(initial: 'old' | 'new') {
  let which = initial;
  const server = createServer((req, res) => {
    if (req.url === '/sw.js') {
      res.writeHead(200, { 'content-type': 'application/javascript', 'cache-control': 'no-store' });
      res.end(which === 'old' ? OLD_SW : NEW_SW); return;
    }
    const upstream = httpRequest({ hostname: '127.0.0.1', port: UPSTREAM_PORT, method: req.method, path: req.url, headers: { ...req.headers, host: `localhost:${UPSTREAM_PORT}` } }, incoming => {
      res.writeHead(incoming.statusCode ?? 502, incoming.headers); incoming.pipe(res);
    });
    upstream.on('error', () => { res.writeHead(503); res.end(); });
    req.pipe(upstream);
  });
  await new Promise<void>(r => server.listen(0, '127.0.0.1', r));
  const port = (server.address() as AddressInfo).port;
  return {
    port,
    useNewWorker: () => { which = 'new'; },
    close: () => new Promise<void>((r, j) => { server.closeAllConnections(); server.close(e => (e ? j(e) : r())); }),
  };
}

async function newSession(browser: import('@playwright/test').Browser, proxyPort: number) {
  const context = await browser.newContext({ baseURL: `http://localhost:${proxyPort}`, serviceWorkers: 'allow', viewport: { width: 412, height: 915 }, isMobile: true, hasTouch: true });
  const be = new FakeBackend({ user: { id: 42 } });
  await be.seedBrowserSession(context);
  await be.install({ route: context.route.bind(context) } as unknown as Page);
  return { context, be };
}

// `rev` and `savedAt` are bumped by the quiz's own autosave after a restore (monotonic revision guard):
// everything else (index, answers, seed, question order) must be identical.
const stable = (p: Record<string, unknown>) => Object.fromEntries(Object.entries(p).filter(([k]) => k !== 'rev' && k !== 'savedAt'));

const isQuizDocument = (url: URL) => url.pathname === MIXED && !url.searchParams.has('_rsc');

async function progressUntilQuestion20(page: Page) {
  await answerCurrent(page, 1);
  await advanceTo(page, 20);
  await answerCurrent(page, 2);
  await page.waitForTimeout(500);
  return { header: await readHeader(page), qid: await readQuestionId(page), progress: await readStoredProgress(page, MIXED_SCOPE) };
}

test('SW v4 to v5 while the quiz is open: same document, same answers, progress keeps being saved', async ({ browser }) => {
  const proxy = await startProxy('old');
  const { context, be } = await newSession(browser, proxy.port);
  try {
    const page = await context.newPage();
    await open(page); await activeWorker(page);
    expect(await page.evaluate(() => caches.keys())).toEqual(['certifyquiz-v4']);
    const before = await progressUntilQuestion20(page);
    expect(before.header).toMatchObject({ index: 20 });
    const checksBefore = be.checkCalls.length;
    await page.evaluate(() => { (window as any).__sameDocument = 'yes'; });

    proxy.useNewWorker();
    await page.evaluate(async () => { const reg = await navigator.serviceWorker.ready; await reg.update(); });
    await expect.poll(() => page.evaluate(() => caches.keys()), { timeout: 20_000 }).toEqual([NEW_CACHE]);
    await page.waitForTimeout(800);

    // No reload, nothing lost: header, question and persisted progress are untouched by the update.
    expect(await page.evaluate(() => (window as any).__sameDocument)).toBe('yes');
    expect(await readHeader(page)).toEqual(before.header);
    expect(await readQuestionId(page)).toBe(before.qid);
    expect(await readStoredProgress(page, MIXED_SCOPE)).toEqual(before.progress);

    // The quiz keeps working under the new worker: answers/check goes through it and progress advances.
    await advanceTo(page, 21);
    await answerCurrent(page, 3);
    await page.waitForTimeout(500);
    expect(be.checkCalls.length).toBeGreaterThan(checksBefore);
    const after = { header: await readHeader(page), qid: await readQuestionId(page) };
    expect(after.header).toMatchObject({ index: 21 });
    expect(after.header!.answered).toBeGreaterThan(before.header!.answered);

    // A reload under v5 restores exactly where the user was.
    await open(page);
    expect(await readHeader(page)).toEqual(after.header);
    expect(await readQuestionId(page)).toBe(after.qid);
  } finally {
    await context.close(); await proxy.close();
  }
});

test('failed navigation mid-quiz: offline page on the same URL, then retry restores the exact position', async ({ browser }) => {
  const proxy = await startProxy('new');
  const { context } = await newSession(browser, proxy.port);
  try {
    const page = await context.newPage();
    await open(page); await activeWorker(page);
    const before = await progressUntilQuestion20(page);

    let blocked = 0;
    const block = async (route: any) => { blocked++; await route.abort('internetdisconnected'); };
    await context.route(isQuizDocument, block);
    await page.goto(MIXED, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('#cq-retry')).toBeVisible();
    expect(new URL(page.url()).pathname).toBe(MIXED);               // original URL, not the homepage
    expect(blocked).toBeGreaterThanOrEqual(2);                      // first attempt + the bounded retry

    await page.locator('#cq-retry').click();                        // still down: stays on the fallback
    await expect(page.locator('#cq-retry')).toBeVisible();
    expect(new URL(page.url()).pathname).toBe(MIXED);

    await context.unroute(isQuizDocument, block);
    await page.locator('#cq-retry').click();                        // back up: the real quiz returns
    // readHeader() throws while the document is being replaced, so tolerate that in the poll.
    await expect.poll(async () => { try { return !!(await readHeader(page)); } catch { return false; } }, { timeout: 90_000 }).toBe(true);
    await dismissCookieBanner(page);
    expect(await readHeader(page)).toEqual(before.header);
    expect(await readQuestionId(page)).toBe(before.qid);
    const restored = await readStoredProgress(page, MIXED_SCOPE);
    expect(stable(restored)).toEqual(stable(before.progress));
    expect(restored.rev).toBeGreaterThanOrEqual(before.progress.rev);
  } finally {
    await context.close(); await proxy.close();
  }
});

test('a brief navigation glitch is absorbed by the single retry: the quiz opens with no offline page', async ({ browser }) => {
  const proxy = await startProxy('new');
  const { context } = await newSession(browser, proxy.port);
  try {
    const page = await context.newPage();
    await open(page); await activeWorker(page);
    const before = await progressUntilQuestion20(page);

    // Fail only the first burst of requests (<150 ms); the retry runs ~350 ms later and succeeds.
    let firstSeen = 0; let aborted = 0;
    const glitch = async (route: any) => {
      firstSeen ||= Date.now();
      if (Date.now() - firstSeen < 150) { aborted++; await route.abort('connectionreset'); return; }
      await route.continue();
    };
    await context.route(isQuizDocument, glitch);
    await page.goto(MIXED, { waitUntil: 'domcontentloaded' });
    await expect.poll(async () => !!(await readHeader(page)), { timeout: 90_000 }).toBe(true);
    await context.unroute(isQuizDocument, glitch);
    expect(aborted).toBeGreaterThanOrEqual(1);
    expect(await page.locator('#cq-retry').count()).toBe(0);
    await dismissCookieBanner(page);
    expect(await readHeader(page)).toEqual(before.header);
    expect(await readQuestionId(page)).toBe(before.qid);
  } finally {
    await context.close(); await proxy.close();
  }
});
