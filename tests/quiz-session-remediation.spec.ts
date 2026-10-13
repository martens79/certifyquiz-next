import { expect, test, type BrowserContext, type Page } from '@playwright/test';
import { createServer, request as httpRequest } from 'node:http';
import { readFileSync } from 'node:fs';
import {
  CERT_SLUG, FakeBackend, advanceTo, answerCurrent, closeAwayAndReopen,
  dismissCookieBanner, readHeader, readQuestionId, readStoredProgress,
  readTimerSec, simulateBackgroundAndReturn,
} from './helpers/quiz-session-backend';

test.use({ serviceWorkers: 'allow', viewport: { width: 412, height: 915 }, isMobile: true, hasTouch: true });
test.describe.configure({ timeout: 120_000 });

const MIXED = `/en/quiz/${CERT_SLUG}/mixed`;
const MOCK = `/en/quiz/${CERT_SLUG}/mock-exam`;
const MIXED_SCOPE = `mixed:${CERT_SLUG}:en:training:user:42`;

async function open(page: Page, url = MIXED) {
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await expect.poll(async () => !!(await readHeader(page)) || await page.getByTestId('exam-attempt-closed').isVisible(), { timeout: 90_000 }).toBe(true);
  await dismissCookieBanner(page);
  await page.waitForTimeout(1200);
}

async function activeWorker(page: Page) {
  await expect.poll(() => page.evaluate(() => navigator.serviceWorker.controller?.scriptURL ?? null), { timeout: 30_000 }).not.toBeNull();
  return page.evaluate(async () => {
    const reg = await navigator.serviceWorker.ready;
    return { script: reg.active?.scriptURL, state: reg.active?.state, controlled: !!navigator.serviceWorker.controller };
  });
}

async function installInContext(be: FakeBackend, context: BrowserContext) {
  // Context routing intercepts SW-owned transport requests, while keeping the
  // actual production sw.js running. No PWA code/config is changed.
  await be.install({ route: context.route.bind(context) } as unknown as Page);
}

test('PWA active: MIXED preserves progress across token expiry, background and reload', async ({ page, context }) => {
  const be = new FakeBackend({ user: { id: 42 } });
  await be.seedBrowserSession(context);
  await installInContext(be, context);
  await open(page);
  const worker = await activeWorker(page);
  await answerCurrent(page, 1);
  await advanceTo(page, 20);
  const before = { header: await readHeader(page), qid: await readQuestionId(page) };
  be.expireAccessToken();
  await simulateBackgroundAndReturn(page);
  await expect.poll(() => be.refreshCalls, { timeout: 15_000 }).toBeGreaterThan(0);
  expect(await readHeader(page)).toEqual(before.header);
  const responsePromise = page.waitForResponse(r => r.url().includes('/questions-mixed/'));
  await open(page);
  const response = await responsePromise;
  expect(response.fromServiceWorker()).toBe(true);
  expect(await readHeader(page)).toEqual(before.header);
  expect(await readQuestionId(page)).toBe(before.qid);
  await test.info().attach('worker-evidence', { body: JSON.stringify({ worker, fromServiceWorker: response.fromServiceWorker(), before, after: await readHeader(page) }, null, 2), contentType: 'application/json' });
});

test('Dolphin explanation capability: non-Premium restore is unlimited; server revocation is respected', async ({ page, context }) => {
  const be = new FakeBackend({ user: { id: 42, premium: false }, freeExplanations: 'unlimited' });
  await be.seedBrowserSession(context);
  await installInContext(be, context);
  await open(page);
  await activeWorker(page);
  await answerCurrent(page, 2);
  await expect(page.getByText(/Explanation for question \d+/)).toBeVisible();
  await page.waitForTimeout(400);
  await open(page);
  await expect(page.getByText(/Explanation for question \d+/)).toBeVisible();
  expect(be.freeRemaining).toBeNull();
  await context.route('**/api/backend/answers/check', r => r.fulfill({ status: 403, contentType: 'application/json', body: JSON.stringify({ error: 'ACCESS_REVOKED' }) }));
  await open(page);
  await expect(page.getByText(/Explanation for question \d+/)).toHaveCount(0);
  const saved = await page.evaluate(scope => localStorage.getItem(`cq:quiz:snap:${scope}`), MIXED_SCOPE);
  expect(saved).not.toMatch(/correct_answer_id|isCorrect|is_correct|explanation/i);
});

test('PWA active: a bank transport outage must preserve the valid snapshot, then recover', async ({ page, context }) => {
  const be = new FakeBackend({ user: { id: 42 } });
  await be.seedBrowserSession(context);
  await installInContext(be, context);
  await open(page);
  const worker = await activeWorker(page);
  await answerCurrent(page, 1);
  await advanceTo(page, 20);
  await page.waitForTimeout(400);
  const before = { header: await readHeader(page), qid: await readQuestionId(page), progress: await readStoredProgress(page, MIXED_SCOPE) };
  const failBank = async (route: any) => { await route.abort('internetdisconnected'); };
  await context.route('**/api/backend/questions-mixed/**', failBank);
  const responsePromise = page.waitForResponse(r => r.url().includes('/questions-mixed/'));
  await page.reload({ waitUntil: 'domcontentloaded' });
  const response = await responsePromise;
  await page.waitForTimeout(1800);
  const outage = { status: response.status(), contentType: response.headers()['content-type'], fromServiceWorker: response.fromServiceWorker(), bodyStart: (await response.text()).slice(0, 180), header: await readHeader(page), qid: await readQuestionId(page), progress: await readStoredProgress(page, MIXED_SCOPE) };
  await context.unroute('**/api/backend/questions-mixed/**', failBank);
  await open(page);
  const recovered = { header: await readHeader(page), qid: await readQuestionId(page) };
  await test.info().attach('outage-evidence', { body: JSON.stringify({ worker, before, outage, recovered }, null, 2), contentType: 'application/json' });
  expect(recovered.header).toEqual(before.header);
  expect(outage.fromServiceWorker).toBe(true);
  expect(outage.header, 'SW must not turn a transport error into an empty successful question pool').toEqual(before.header);
});

for (const status of [500, 502, 503, 504]) {
  test(`PWA active: HTTP ${status} preserves Q20 and recovers`, async ({ page, context }) => {
    const be = new FakeBackend({ user: { id: 42 } });
    await be.seedBrowserSession(context); await installInContext(be, context);
    await open(page); await activeWorker(page); await answerCurrent(page, 1); await advanceTo(page, 20);
    const before = { header: await readHeader(page), qid: await readQuestionId(page) };
    const unavailable = (r: any) => r.fulfill({ status, contentType: 'application/json', body: '{"error":"UNAVAILABLE"}' });
    await context.route('**/api/backend/questions-mixed/**', unavailable);
    await simulateBackgroundAndReturn(page);
    await open(page);
    expect(await readHeader(page)).toEqual(before.header);
    expect(await readQuestionId(page)).toBe(before.qid);
    await context.unroute('**/api/backend/questions-mixed/**', unavailable);
    await open(page); expect(await readHeader(page)).toEqual(before.header);
  });
}

for (const refresh of ['success', 'temporary', 'revoked'] as const) {
  test(`PWA active: bank 401 then refresh ${refresh}`, async ({ page, context }) => {
    const be = new FakeBackend({ user: { id: 42 } });
    await be.seedBrowserSession(context); await installInContext(be, context);
    await open(page); await activeWorker(page); await advanceTo(page, 20);
    const before = await readHeader(page);
    be.expireAccessToken();
    if (refresh === 'success') {
      // Concurrent refreshes must not immediately revoke each other's issued
      // access token; use one valid token for this successful refresh window.
      await context.route('**/api/backend/auth/refresh', r => {
        be.refreshCalls++;
        return r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ token: be.currentToken }) });
      });
    }
    await context.route('**/api/backend/questions-mixed/**', async r => {
      if (r.request().headers().authorization !== `Bearer ${be.currentToken}`) {
        await r.fulfill({ status: 401, contentType: 'application/json', body: '{"error":"TOKEN_EXPIRED"}' });
      } else await r.fallback();
    });
    if (refresh !== 'success') {
      await context.route('**/api/backend/auth/refresh', r => r.fulfill({ status: refresh === 'temporary' ? 503 : 401, contentType: 'application/json', body: '{"error":"REFRESH_FAILED"}' }));
      await context.route('**/api/backend/answers/check', r => r.fulfill({ status: 401, contentType: 'application/json', body: '{"error":"UNAUTHORIZED"}' }));
    }
    await page.reload();
    await page.waitForTimeout(2500);
    if (refresh !== 'revoked') {
      await expect.poll(() => readHeader(page), { timeout: 30_000 }).toEqual(before);
      expect(await readStoredProgress(page, MIXED_SCOPE)).not.toBeNull();
      if (refresh === 'success') expect(be.refreshCalls).toBeGreaterThan(0);
    } else {
      const old = await readStoredProgress(page, MIXED_SCOPE);
      expect(old).toBeNull();
    }
    await expect(page.getByText(/Explanation for question \d+/)).toHaveCount(0);
  });
}

test('PWA active: definitive lock invalidates only the denied scope', async ({ page, context }) => {
  const be = new FakeBackend({ user: { id: 42 } });
  await be.seedBrowserSession(context); await installInContext(be, context);
  await open(page); await activeWorker(page); await advanceTo(page, 20);
  await page.evaluate(() => localStorage.setItem('cq:quiz:other:training:user:43', '{"untouched":true}'));
  be.options.hardLocked = true;
  await page.reload();
  await expect(page.locator('a[href*="source=post_gate_quiz_limit"]')).toBeVisible();
  expect(await readStoredProgress(page, MIXED_SCOPE)).toBeNull();
  expect(await page.evaluate(() => localStorage.getItem('cq:quiz:other:training:user:43'))).toBe('{"untouched":true}');
});

for (const invalid of ['expired', 'malformed', 'incompatible']) {
  test(`PWA active: ${invalid} snapshot is not restored`, async ({ page, context }) => {
    const be = new FakeBackend({ user: { id: 42 } });
    await be.seedBrowserSession(context); await installInContext(be, context);
    await open(page); await activeWorker(page); await advanceTo(page, 20);
    await page.evaluate(({ scope, invalid }) => {
      const key = `cq:quiz:snap:${scope}`; const snap = JSON.parse(localStorage.getItem(key)!);
      if (invalid === 'expired') snap.savedAt -= 25 * 3600_000;
      else if (invalid === 'incompatible') snap.v += 1;
      else snap.questions[0].answers = [];
      localStorage.setItem(key, JSON.stringify(snap));
    }, { scope: MIXED_SCOPE, invalid });
    await open(page); expect(await readHeader(page)).toMatchObject({ index: 1, answered: 0 });
  });
}

test('PWA active: logout removes prior user and another account starts independently', async ({ page, context }) => {
  const be = new FakeBackend({ user: { id: 42 } });
  await be.seedBrowserSession(context); await installInContext(be, context);
  await open(page); await activeWorker(page); await advanceTo(page, 20);
  await page.getByRole('button', { name: /open menu/i }).first().click();
  await page.getByRole('button', { name: /log ?out|sign ?out/i }).first().click();
  await page.waitForURL(/\/login/);
  const token = be.loginAs({ id: 43 });
  await page.evaluate(token => {
    localStorage.setItem('cq:access', token);
    localStorage.setItem('cq_user', JSON.stringify({ id: 43, username: 'other', role: 'user', premium: false }));
  }, token);
  await open(page);
  expect(await readHeader(page)).toMatchObject({ index: 1, answered: 0 });
  expect(await page.evaluate(() => Object.keys(localStorage).filter(k => k.startsWith('cq:quiz:') && k.endsWith(':user:42')))).toEqual([]);
});

test('real PWA update v3 to v4 removes old assets and preserves the current snapshot', async ({ browser }) => {
  const oldScript = readFileSync('tests/fixtures/quiz-sw-v3.js', 'utf8');
  const newScript = readFileSync('public/sw.js', 'utf8');
  let version = 3;
  const server = createServer((req, res) => {
    if (req.url === '/sw.js') {
      res.writeHead(200, { 'content-type': 'application/javascript', 'cache-control': 'no-store' });
      res.end(version === 3 ? oldScript : newScript); return;
    }
    if (req.url === '/__qa-stale.js') {
      res.writeHead(200, { 'content-type': 'application/javascript' }); res.end('CURRENT_ASSET'); return;
    }
    const upstream = httpRequest({ hostname: '127.0.0.1', port: 3138, method: req.method, path: req.url, headers: { ...req.headers, host: 'localhost:3138' } }, incoming => {
      res.writeHead(incoming.statusCode ?? 502, incoming.headers); incoming.pipe(res);
    });
    upstream.on('error', () => { res.writeHead(503); res.end(); }); req.pipe(upstream);
  });
  await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve));
  const port = (server.address() as { port: number }).port;
  const context = await browser.newContext({ baseURL: `http://localhost:${port}`, serviceWorkers: 'allow', viewport: { width: 412, height: 915 }, isMobile: true, hasTouch: true });
  try {
    const be = new FakeBackend({ user: { id: 42 } }); await be.seedBrowserSession(context); await installInContext(be, context);
    const page = await context.newPage(); await open(page); await activeWorker(page); await advanceTo(page, 20);
    const before = await readHeader(page);
    await page.evaluate(async () => { const c = await caches.open('certifyquiz-v3'); await c.put('/__qa-stale.js', new Response('OBSOLETE_ASSET')); });
    version = 4;
    await page.evaluate(async () => { const reg = await navigator.serviceWorker.ready; await reg.update(); });
    await expect.poll(() => page.evaluate(() => caches.keys()), { timeout: 20_000 }).toEqual(['certifyquiz-v4']);
    await open(page); expect(await readHeader(page)).toEqual(before);
    expect(await page.evaluate(async () => (await fetch('/__qa-stale.js')).text())).toBe('CURRENT_ASSET');
    await context.route('**/__qa-stale.js', r => r.abort('internetdisconnected'));
    const asset = await page.evaluate(async () => { const r = await fetch('/__qa-stale.js'); return { status: r.status, body: await r.text() }; });
    expect(asset.status).toBe(503); expect(asset.body).not.toContain('OBSOLETE_ASSET');
  } finally {
    await context.close(); await new Promise<void>((resolve, reject) => server.close(e => e ? reject(e) : resolve()));
  }
});

test('PWA active: expired exam remains closed on reopening and account change is isolated', async ({ page, context }) => {
  const be = new FakeBackend({ user: { id: 42 } }); await be.seedBrowserSession(context); await installInContext(be, context);
  await open(page, MOCK); await activeWorker(page);
  const scope = `mock-exam:${CERT_SLUG}:en:exam:user:42`;
  await page.goto('/robots.txt'); // End pagehide autosave before altering persisted evidence.
  await page.evaluate(scope => { const key = `cq:quiz:attempt:${scope}`; const a = JSON.parse(localStorage.getItem(key)!); a.deadlineAt = Date.now() - 1; a.status = 'expired'; a.remainingSec = 0; localStorage.setItem(key, JSON.stringify(a)); }, scope);
  await open(page, MOCK); await expect(page.getByTestId('exam-attempt-closed')).toBeVisible();
  const token = be.loginAs({ id: 43 });
  await page.evaluate(token => { localStorage.setItem('cq:access', token); localStorage.setItem('cq_user', JSON.stringify({ id: 43, username: 'other', role: 'user', premium: false })); }, token);
  await open(page, MOCK); await expect.poll(() => readTimerSec(page)).toBeGreaterThan(3500);
  const attempts = await page.evaluate(() => Object.keys(localStorage).filter(k => k.startsWith('cq:quiz:attempt:')));
  expect(attempts).toContain(`cq:quiz:attempt:${scope}`);
  expect(attempts).toContain(`cq:quiz:attempt:mock-exam:${CERT_SLUG}:en:exam:user:43`);
});

test('MIXED exam mode preserves the same attempt and deadline across reload', async ({ page, context }) => {
  const be = new FakeBackend({ user: { id: 42 } }); await be.seedBrowserSession(context); await installInContext(be, context);
  await open(page); await activeWorker(page);
  await page.getByRole('button', { name: /^Exam$/ }).click();
  await expect.poll(() => readTimerSec(page)).not.toBeNull();
  const scope = `mixed:${CERT_SLUG}:en:exam:user:42`;
  await expect.poll(() => page.evaluate(scope => localStorage.getItem(`cq:quiz:attempt:${scope}`), scope)).not.toBeNull();
  const before = await page.evaluate(scope => JSON.parse(localStorage.getItem(`cq:quiz:attempt:${scope}`)!), scope);
  // Remember the selected mode explicitly, as the page defaults to Training.
  await page.reload(); await open(page);
  await page.getByRole('button', { name: /^Exam$/ }).click();
  await expect.poll(() => readTimerSec(page)).not.toBeNull();
  const after = await page.evaluate(scope => JSON.parse(localStorage.getItem(`cq:quiz:attempt:${scope}`)!), scope);
  expect(after.attemptId).toBe(before.attemptId); expect(after.deadlineAt).toBe(before.deadlineAt);
  expect(after.remainingSec).toBeLessThanOrEqual(before.remainingSec);
});

test.describe('original exam deadline gate', () => {
  test.use({ serviceWorkers: 'block' });
  test('a reload after the original deadline must not automatically grant a fresh full timer', async ({ page, context }) => {
    const be = new FakeBackend();
    await be.install(page);
    await open(page, MOCK);
    await advanceTo(page, 6);
    const before = { header: await readHeader(page), timer: await readTimerSec(page) };
    const fresh = await closeAwayAndReopen(context, page, be, `mock-exam:${CERT_SLUG}:en:exam:anon`, 7200);
    await open(fresh, MOCK);
    const after = { header: await readHeader(fresh), timer: await readTimerSec(fresh), evaluations: be.mockEvaluations, examWrites: be.saveExamCalls };
    await test.info().attach('deadline-evidence', { body: JSON.stringify({ before, awaySeconds: 7200, after }, null, 2), contentType: 'application/json' });
    expect(after.timer ?? 0, 'Only an explicit Restart may grant a new exam timer').toBeLessThanOrEqual(0);
    await expect(fresh.getByTestId('exam-attempt-closed')).toBeVisible();
    const oldId = await fresh.evaluate(scope => JSON.parse(localStorage.getItem(`cq:quiz:attempt:${scope}`)!).attemptId, `mock-exam:${CERT_SLUG}:en:exam:anon`);
    await fresh.reload(); await expect(fresh.getByTestId('exam-attempt-closed')).toBeVisible();
    await fresh.getByRole('button', { name: /^Restart$/ }).click();
    await expect.poll(() => readTimerSec(fresh)).toBeGreaterThan(3500);
    expect(await fresh.evaluate(scope => JSON.parse(localStorage.getItem(`cq:quiz:attempt:${scope}`)!).attemptId, `mock-exam:${CERT_SLUG}:en:exam:anon`)).not.toBe(oldId);
  });

  for (const invalid of ['malformed', 'expired', 'absent', 'progress-absent', 'attempt-malformed']) {
    test(`exam attempt cannot get a new full timer when ${invalid}`, async ({ page }) => {
      const be = new FakeBackend(); await be.install(page); await open(page, MOCK); await advanceTo(page, 6);
      await page.goto('/robots.txt'); // Simulate corruption while the quiz is closed.
      await page.evaluate(({ scope, invalid }) => {
        const key = `cq:quiz:snap:${scope}`;
        if (invalid === 'absent') localStorage.removeItem(key);
        else if (invalid === 'progress-absent') localStorage.removeItem(`cq:quiz:${scope}`);
        else if (invalid === 'attempt-malformed') localStorage.setItem(`cq:quiz:attempt:${scope}`, '{broken');
        else {
          const snap = JSON.parse(localStorage.getItem(key)!);
          if (invalid === 'expired') snap.savedAt -= 7 * 3600_000; else snap.questions[0].answers = [];
          localStorage.setItem(key, JSON.stringify(snap));
        }
      }, { scope: `mock-exam:${CERT_SLUG}:en:exam:anon`, invalid });
      await open(page, MOCK); await expect(page.getByTestId('exam-attempt-closed')).toBeVisible();
      expect(await readTimerSec(page) ?? 0).toBe(0);
      await page.reload(); await expect(page.getByTestId('exam-attempt-closed')).toBeVisible();
    });
  }

  test('repeated reload and a backwards client clock cannot increase the saved remainder', async ({ page }) => {
    const be = new FakeBackend(); await be.install(page); await open(page, MOCK);
    const scope = `mock-exam:${CERT_SLUG}:en:exam:anon`;
    const initial = await page.evaluate(scope => JSON.parse(localStorage.getItem(`cq:quiz:attempt:${scope}`)!), scope);
    const before = await readTimerSec(page);
    await page.evaluate(() => { const at = Date.now() - 60_000; Date.now = () => at; });
    await page.waitForTimeout(1200);
    expect(await readTimerSec(page)).toBeLessThanOrEqual(before!);
    for (let i = 0; i < 2; i++) {
      const left = await readTimerSec(page); await open(page, MOCK);
      expect(await readTimerSec(page)).toBeLessThanOrEqual(left!);
      const current = await page.evaluate(scope => JSON.parse(localStorage.getItem(`cq:quiz:attempt:${scope}`)!), scope);
      expect(current.attemptId).toBe(initial.attemptId); expect(current.deadlineAt).toBe(initial.deadlineAt);
    }
  });
});
