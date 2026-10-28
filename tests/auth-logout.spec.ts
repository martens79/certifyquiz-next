import { test, expect, type Page } from '@playwright/test';
import { FakeBackend, dismissCookieBanner } from './helpers/quiz-session-backend';

// All identities, cookies,
// requests and accepted writes below exist only inside disposable local fixtures.
const origin = 'http://127.0.0.1:3347';
const path = '/es/quiz/cisco-ccst-cybersecurity/mock-exam';
const user = { id: 990001, username: 'synthetic-diagnosis', email: 'diagnosis@example.test', role: 'user', premium: false, trial: false };
async function fixture(page: Page, cookie: 'valid' | 'invalid' | 'none' = 'none', seedCache = false) {
  const be = new FakeBackend(); await be.install(page);
  await page.route(/^http:\/\/127\.0\.0\.1:3347\/(?!api\/backend)/, r => r.continue());
  const log: { method: string; path: string; status: number }[] = [];
  let refreshCount = 0, acceptedSaves = 0;
  const state = { logoutStatus: 200 };
  await page.context().addCookies(cookie === 'none' ? [] : [{ name: 'rt', value: cookie === 'valid' ? 'synthetic-valid-cookie' : 'synthetic-expired-cookie', url: origin, httpOnly: true, sameSite: 'Lax' }]);
  await page.addInitScript(({ seedCache, user }) => {
    localStorage.setItem('cq_cookie_consent', JSON.stringify({ accepted: false }));
    localStorage.setItem('lang_banner_dismissed', '1');
    if (seedCache && !sessionStorage.getItem('__diagnosis_seeded')) {
      sessionStorage.setItem('__diagnosis_seeded', '1');
      localStorage.setItem('cq_user', JSON.stringify(user));
      // No access token: deliberately isolate cached UI from real authorization.
    }
  }, { seedCache, user });
  await page.route('**/api/backend/auth/**', async r => {
    const p = new URL(r.request().url()).pathname.split('/auth/')[1];
    const rt = (await page.context().cookies(origin)).find(c => c.name === 'rt');
    const bearer = r.request().headers().authorization;
    let status = 200, body: unknown = {};
    if (p === 'refresh') {
      refreshCount++;
      if (rt?.value === 'synthetic-valid-cookie') body = { ok: true, token: `synthetic-access-${refreshCount}`, user };
      else { status = 401; body = { error: 'NO_REFRESH' }; }
    } else if (p === 'me') {
      if (bearer?.startsWith('Bearer synthetic-access-') && rt?.value === 'synthetic-valid-cookie') body = { user };
      else { status = 401; body = { error: 'UNAUTHORIZED' }; }
    } else if (p === 'logout') {
      status = state.logoutStatus;
      if (status === 200) await page.context().clearCookies({ name: 'rt' });
      body = { ok: status === 200 };
    } else if (p === 'login' || p === 'register') {
      const data = r.request().postDataJSON();
      if (data.email === 'invalid@example.test') { status = 401; body = { error: 'INVALID_LOGIN' }; }
      else {
        await page.context().addCookies([{ name: 'rt', value: 'synthetic-valid-cookie', url: origin, httpOnly: true, sameSite: 'Lax' }]);
        body = { ok: true, token: 'synthetic-access-login', user };
      }
    } else { status = 400; body = { error: 'UNEXPECTED_AUTH_PATH' }; }
    log.push({ method: r.request().method(), path: p, status });
    await r.fulfill({ status, json: body });
  });
  await page.route('**/api/backend/save-exam', async r => {
    const ok = !!r.request().headers().authorization?.startsWith('Bearer synthetic-access-');
    if (ok) acceptedSaves++;
    log.push({ method: r.request().method(), path: 'save-exam', status: ok ? 200 : 401 });
    await r.fulfill({ status: ok ? 200 : 401, json: ok ? { success: true } : { error: 'UNAUTHORIZED' } });
  });
  await page.route('**/api/backend/mock-exam/questions/**', r => r.fulfill({ json: {
    poolTotal: 100, purpose: 'mock_exam', spec: { questions: 2, served: 2, durationSec: 3600 },
    questions: [1,2].map(id => ({ id, question: `Synthetic question #${id}`, answers: [1,2,3,4].map(n => ({ id: id*10+n, text: `Answer ${n} of ${id}` })) })),
  } }));
  await page.route('**/api/backend/mock-exam/evaluate/**', r => r.fulfill({ json: { summary: { total: 2, answered: 0, correct: 0, wrong: 0, percentage: 0, passed: false }, reviewAvailable: false, details: [] } }));
  await page.route('**/api/backend/packages/offers/**', r => r.fulfill({ json: { offers: [{ code: 'synthetic-complete', productCode: 'octopus-complete', checkoutAvailable: true, amountMinor: 2490, currency: 'EUR' }] } }));
  return { log, state, get acceptedSaves() { return acceptedSaves; }, get refreshCount() { return refreshCount; } };
}
async function authState(page: Page) {
  return page.evaluate(() => ({ access: !!(localStorage.getItem('cq:access') || sessionStorage.getItem('cq:access')), cached: !!(localStorage.getItem('cq_user') || sessionStorage.getItem('cq_user')) }));
}
async function ready(page: Page) { await expect(page.getByText(/Synthetic question #\d+/, { exact: true })).toBeVisible(); await dismissCookieBanner(page); }
async function logoutUI(page: Page, waitNavigation = true) {
  const mobile = page.getByRole('button', { name: 'Abrir menú', exact: true });
  if (await mobile.isVisible()) await mobile.click();
  else await page.locator('header button[aria-haspopup="menu"]').click();
  await page.getByRole('button', { name: 'Cerrar sesión', exact: true }).click();
  if (waitNavigation) await page.waitForURL(/\/es\/login/);
  await expect.poll(() => authState(page)).toEqual({ access: false, cached: false });
}
test('fresh anonymous: full reload cannot restore an authenticated identity', async ({ page }) => {
  const f = await fixture(page); await page.goto(path); await ready(page);
  await expect.poll(() => authState(page)).toEqual({ access: false, cached: false });
  await page.reload(); await ready(page);
  await expect.poll(() => authState(page)).toEqual({ access: false, cached: false });
  expect(f.log.some(e => e.path === 'me' && e.status === 200)).toBe(false);
  expect(f.acceptedSaves).toBe(0);
});
test('quiz local state survives reload without authenticating or saving a server result early', async ({ page }) => {
  const f = await fixture(page); await page.goto(path); await ready(page);
  await page.getByRole('button', { name: /^Answer 1 of \d+$/ }).click();
  await expect.poll(() => page.evaluate(() => Object.keys(localStorage).filter(k => k.startsWith('cq:quiz:')).some(k => {
    try { return Object.keys(JSON.parse(localStorage.getItem(k) || '{}').marked || {}).length > 0; } catch { return false; }
  }))).toBe(true);
  await page.reload(); await ready(page);
  await expect(page.getByRole('button', { name: /^Answer 1 of \d+$/ })).toHaveClass(/bg-emerald-500/);
  expect(await authState(page)).toEqual({ access: false, cached: false });
  expect(f.log.filter(e => e.path === 'save-exam')).toHaveLength(0);
  await page.getByRole('button', { name: 'Terminar', exact: true }).click();
  await expect.poll(() => f.log.filter(e => e.path === 'save-exam').length).toBeGreaterThan(0);
  expect(f.acceptedSaves).toBe(0);
});
test('server logout clears cookie and stays signed out after reload, navigation and a late cookie', async ({ page }) => {
  const f = await fixture(page, 'valid'); await page.goto(path); await ready(page);
  await expect.poll(() => authState(page)).toEqual({ access: true, cached: true });
  await logoutUI(page);
  expect(f.log.filter(e => e.path === 'logout')).toHaveLength(1);
  expect((await page.context().cookies(origin)).some(c => c.name === 'rt')).toBe(false);
  // Remove all local quiz continuity. Reload is a new document, not history/back.
  await page.evaluate(() => { for (const k of Object.keys(localStorage)) if (k.startsWith('cq:quiz:')) localStorage.removeItem(k); });
  const before = f.refreshCount;
  await page.reload();
  await expect.poll(() => authState(page)).toEqual({ access: false, cached: false });
  expect(f.refreshCount).toBe(before);
  expect(f.log.some(e => e.path === 'me' && e.status === 200)).toBe(true);
  expect(f.acceptedSaves).toBe(0);
  // Even an old cookie arriving from a delayed response cannot reopen logout.
  await page.context().addCookies([{ name: 'rt', value: 'synthetic-valid-cookie', url: origin, httpOnly: true, sameSite: 'Lax' }]);
  await page.goto(path); await ready(page);
  await expect.poll(() => authState(page)).toEqual({ access: false, cached: false });
  expect(f.refreshCount).toBe(before);
  await test.info().attach('sanitized-request-sequence', { body: JSON.stringify(f.log, null, 2), contentType: 'application/json' });
});
test('invalid refresh cookie and cached user do not authorize the previous identity', async ({ page }) => {
  const f = await fixture(page, 'invalid', true); await page.goto(path); await ready(page);
  await expect.poll(() => f.refreshCount).toBeGreaterThan(0);
  await expect.poll(() => authState(page)).toEqual({ access: false, cached: false });
  expect(f.log.some(e => e.path === 'me' && e.status === 200)).toBe(false);
  expect(f.acceptedSaves).toBe(0);
});
test('quiz completion after logout cannot restore identity or submit an authenticated result', async ({ page }) => {
  const f = await fixture(page, 'valid'); await page.goto(path); await ready(page);
  await expect.poll(() => authState(page)).toEqual({ access: true, cached: true });
  expect(f.acceptedSaves).toBe(0);
  await logoutUI(page);
  await page.goto(path);
  // Respect the existing attempt guard; the separate quiz bootstrap issue is unchanged.
  const restart = page.getByRole('button', { name: 'Reiniciar', exact: true });
  await expect(page.getByText(/Synthetic question #\d+/, { exact: true }).or(restart)).toBeVisible();
  if (await restart.isVisible()) await restart.click();
  await ready(page);
  await expect.poll(() => authState(page)).toEqual({ access: false, cached: false });
  expect(f.log.filter(e => e.path === 'save-exam')).toHaveLength(0);
  await page.getByRole('button', { name: 'Terminar', exact: true }).click();
  await expect(page.getByText('Resumen del examen', { exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Elegir Complete para esta certificación', exact: true })).toBeVisible();
  expect(f.acceptedSaves).toBe(0);
  expect(f.log.filter(e => e.path === 'save-exam')).toHaveLength(0);
  await test.info().attach('sanitized-request-sequence', { body: JSON.stringify(f.log, null, 2), contentType: 'application/json' });
});

test('failed server logout persists across reload and can be retried', async ({ page }) => {
  const f = await fixture(page, 'valid'); await page.goto(path); await ready(page);
  await expect.poll(() => authState(page)).toEqual({ access: true, cached: true });
  f.state.logoutStatus = 503; await logoutUI(page, false);
  await page.reload();
  await expect.poll(() => authState(page)).toEqual({ access: false, cached: false });
  expect((await page.context().cookies(origin)).some(c => c.name === 'rt')).toBe(true);
  const menu = page.getByRole('button', { name: 'Abrir menú', exact: true });
  if (await menu.isVisible()) await menu.click();
  await expect(page.getByRole('alert').filter({ hasText: /servidor/ }).filter({ visible: true })).toBeVisible();
  f.state.logoutStatus = 200;
  await page.getByRole('button', { name: 'Reintentar', exact: true }).filter({ visible: true }).click();
  await page.waitForURL(/\/es\/login/);
  expect((await page.context().cookies(origin)).some(c => c.name === 'rt')).toBe(false);
  await page.reload(); expect(await authState(page)).toEqual({ access: false, cached: false });
});

test('explicit login after logout works; failed login leaves the boundary closed', async ({ page }) => {
  await fixture(page, 'valid'); await page.goto(path); await ready(page);
  await expect.poll(() => authState(page)).toEqual({ access: true, cached: true });
  await logoutUI(page);
  const form = page.locator('form').filter({ has: page.locator('input[type="password"]') }).first();
  await form.locator('input[type="email"]').fill('invalid@example.test');
  await form.locator('input[type="password"]').fill('synthetic-only-password-123');
  await form.locator('button[type="submit"]').click();
  await expect(page.getByText(/Email o password|Wrong email|INVALID_LOGIN|contraseña/i).first()).toBeVisible();
  expect(await authState(page)).toEqual({ access: false, cached: false });
  await form.locator('input[type="email"]').fill('diagnosis@example.test');
  await form.locator('button[type="submit"]').click();
  await expect.poll(() => authState(page)).toEqual({ access: true, cached: true });
});

test('another open tab observes logout and cannot recover on reload', async ({ page, context }) => {
  await fixture(page, 'valid'); await page.goto(path); await ready(page);
  await expect.poll(() => authState(page)).toEqual({ access: true, cached: true });
  const other = await context.newPage(); await fixture(other); await other.goto(path); await ready(other);
  await expect.poll(() => authState(other)).toEqual({ access: true, cached: true });
  await logoutUI(page);
  await expect.poll(() => authState(other)).toEqual({ access: false, cached: false });
  await other.reload(); await expect.poll(() => authState(other)).toEqual({ access: false, cached: false });
  await other.close();
});

test('a refresh already in flight cannot restore UI identity, even if it returns a late cookie', async ({ page }) => {
  const f = await fixture(page, 'valid', true);
  let release!: () => void, started!: () => void, finished!: () => void;
  const gate = new Promise<void>(r => { release = r; }), waiting = new Promise<void>(r => { started = r; }), done = new Promise<void>(r => { finished = r; });
  await page.route('**/api/backend/auth/refresh', async r => {
    started(); await gate;
    await r.fulfill({ headers: { 'set-cookie': 'rt=synthetic-valid-cookie; Path=/; HttpOnly; SameSite=Lax' }, json: { token: 'synthetic-access-late' } });
    finished();
  });
  await page.goto(path); await waiting;
  await logoutUI(page); release(); await done;
  await expect.poll(() => authState(page)).toEqual({ access: false, cached: false });
  await page.reload(); await expect.poll(() => authState(page)).toEqual({ access: false, cached: false });
  expect(f.log.filter(e => e.path === 'logout')).toHaveLength(1);
});

test('late successful /me cannot restore cached UI after logout', async ({ page }) => {
  await fixture(page, 'valid'); await page.goto(path); await ready(page);
  await expect.poll(() => authState(page)).toEqual({ access: true, cached: true });
  let release!: () => void, started!: () => void, finished!: () => void;
  const gate = new Promise<void>(r => { release = r; }), waiting = new Promise<void>(r => { started = r; }), done = new Promise<void>(r => { finished = r; });
  await page.route('**/api/backend/auth/me', async r => { started(); await gate; await r.fulfill({ json: { user } }); finished(); });
  await page.reload(); await waiting;
  await logoutUI(page); release(); await done;
  await expect.poll(() => authState(page)).toEqual({ access: false, cached: false });
  await expect(page.locator('header button[aria-haspopup="menu"]')).toHaveCount(0);
});

test('synthetic registration after logout can establish a fresh identity', async ({ page }) => {
  await fixture(page, 'valid'); await page.goto(path); await ready(page);
  await expect.poll(() => authState(page)).toEqual({ access: true, cached: true }); await logoutUI(page);
  await page.route('https://challenges.cloudflare.com/**', r => r.fulfill({ contentType: 'application/javascript', body: "window.turnstile={render:(_e,o)=>{setTimeout(()=>o.callback('synthetic'),20);return 'w'},reset:()=>{},remove:()=>{},getResponse:()=> 'synthetic',isExpired:()=>false};if(window.onloadTurnstileCallback)window.onloadTurnstileCallback();" }));
  await page.goto('/es/register');
  const form = page.locator('form').filter({ has: page.locator('input[name="username"]') }).first();
  await form.locator('[name="username"]').fill('synthetic-diagnosis');
  await form.locator('[name="email"]').fill('diagnosis@example.test');
  await form.locator('[name="password"]').fill('synthetic-only-password-123');
  await form.locator('[name="confirmPassword"]').fill('synthetic-only-password-123');
  await form.locator('button[type="submit"]').click();
  await expect.poll(() => authState(page)).toEqual({ access: true, cached: true });
});

test('OAuth callback validates its token before reopening logout', async ({ page, context }) => {
  await fixture(page, 'valid'); await page.goto(path); await ready(page);
  await expect.poll(() => authState(page)).toEqual({ access: true, cached: true }); await logoutUI(page);
  await context.addCookies([{ name: 'rt', value: 'synthetic-valid-cookie', url: origin, httpOnly: true, sameSite: 'Lax' }]);
  await page.goto('/auth/callback?token=invalid-synthetic&redirect=%2Fes%2Flogin');
  await page.waitForURL(/\/es\/login/);
  expect(await authState(page)).toEqual({ access: false, cached: false });
  await page.goto('/auth/callback?token=synthetic-access-oauth&redirect=%2Fes%2Fquiz%2Fcisco-ccst-cybersecurity%2Fmock-exam');
  await expect.poll(() => authState(page)).toEqual({ access: true, cached: true });
  await page.waitForURL(/\/mock-exam/);
  expect(new URL(page.url()).searchParams.has('token')).toBe(false);
});
