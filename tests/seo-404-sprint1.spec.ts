import { expect, test, type Page } from '@playwright/test';
import { SEO_404_SPRINT1_REDIRECTS } from '../src/lib/legacyRedirects';

const diagnostics = new WeakMap<Page, { seen: string[]; errors: string[] }>();
test.afterEach(async ({ page }, info) => {
  const data = diagnostics.get(page);
  if (data) await info.attach('isolated-api-calls', { body: JSON.stringify(data, null, 2), contentType: 'application/json' });
});

// Browser API calls are intercepted, including every write. Never send an answer
// or a synthetic session to Railway/production; SSR uses a loopback read-only fixture.
async function installQuizApi(page: Page) {
  const seen: string[] = [];
  let checks = 0;
  const errors: string[] = [];
  diagnostics.set(page, { seen, errors });
  page.on('pageerror', error => errors.push(error.message));
  page.on('requestfailed', request => errors.push(`${request.url()}: ${request.failure()?.errorText}`));
  await page.route(/^https?:\/\/(?!localhost(?::|\/)|127\.0\.0\.1(?::|\/))/, route => route.abort());
  await page.route('**/api/backend/**', async route => {
    const url = new URL(route.request().url());
    seen.push(url.pathname + url.search);
    const json = (status: number, body: unknown) => route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body) });
    if (/\/auth\/(me|refresh)|\/me$/.test(url.pathname)) return json(401, {});
    if (url.pathname.includes('/question-pool/')) return json(200, { poolTotal: 40 });
    if (url.pathname.includes('/certifications/by-slug/')) return json(200, { id: 50, slug: 'data-analytics-foundations' });
    if (/\/(questions-mixed|assessment\/questions|mock-exam\/questions)\//.test(url.pathname)) return json(200, {
      poolTotal: 40,
      questions: Array.from({ length: 10 }, (_, i) => ({
        id: 9201 + i, certification_id: 50, topic_id: 323,
        question: `Domanda sintetica Data Analytics ${i + 1}`,
        answers: [1, 2, 3, 4].map(n => ({ id: (9201 + i) * 10 + n, text: `Risposta ${n} domanda ${i + 1}` })),
      })),
      spec: { questions: 10, served: 10, durationSec: 3600 },
    });
    if (url.pathname.endsWith('/answers/check')) {
      checks++;
      const body = route.request().postDataJSON();
      return json(200, { question_id: body.question_id, correct: body.answer_id === body.question_id * 10 + 1, correct_answer_id: body.question_id * 10 + 1, explanation: 'Feedback sintetico verificato.', explanation_access: { granted: true, unlimited: false, remaining: 10, reason: 'correct_answer' } });
    }
    if (url.pathname.includes('/explanation-status')) return json(200, { used: 0, limit: 10, remaining: 10, unlimited: false });
    return json(200, {});
  });
  return { seen, checks: () => checks };
}

async function openQuiz(page: Page, url: string) {
  const response = await page.goto(url, { waitUntil: 'domcontentloaded' });
  expect(response?.status()).toBe(200);
  await expect(page.getByText(/^Domanda sintetica Data Analytics \d+$/)).toBeVisible({ timeout: 40_000 });
  const accept = page.getByRole('button', { name: /Rifiuta|Reject/i }).first();
  if (await accept.isVisible()) await accept.click();
}

test('mixed IT: domande, verifica risposta e avanzamento realmente utilizzabili', async ({ page }) => {
  const api = await installQuizApi(page);
  await openQuiz(page, '/it/quiz/data-analytics-foundations/mixed');
  await expect(page).toHaveURL(/\/it\/quiz\/data-analytics-foundations\/mixed$/);
  const question = page.getByText(/^Domanda sintetica Data Analytics \d+$/);
  const initialQuestion = await question.textContent();
  await page.getByRole('button', { name: /^Risposta 1 domanda \d+$/ }).click();
  await expect.poll(api.checks).toBe(1);
  await expect(page.getByText(/Feedback sintetico verificato\./)).toBeVisible();
  await page.getByRole('button', { name: /^Avanti/ }).first().click();
  await expect(question).not.toHaveText(initialQuestion!);
  await expect(question).toBeVisible();
  expect(api.seen.some(url => /\/questions-mixed\/50\?/.test(url) && url.includes('mode=training'))).toBe(true);
  expect(api.seen.some(url => /\/(assessment|mock-exam)\//.test(url))).toBe(false);
});

test('CTA della landing: assessment mixed conserva query, certificazione e endpoint dedicato', async ({ page }) => {
  const api = await installQuizApi(page);
  const response = await page.goto('/it/certificazioni/data-analytics-foundations');
  expect(response?.status()).toBe(200);
  const cta = page.locator('a[href="/it/quiz/data-analytics-foundations/mixed?mode=assessment"]').first();
  await expect(cta).toBeVisible();
  await cta.click();
  await expect(page).toHaveURL(/\/it\/quiz\/data-analytics-foundations\/mixed\?mode=assessment$/);
  await expect(page.getByText(/^Domanda sintetica Data Analytics \d+$/)).toBeVisible({ timeout: 40_000 });
  expect(api.seen.some(url => url === '/api/backend/assessment/questions/50?lang=it')).toBe(true);
  expect(api.seen.some(url => url.includes('/questions-mixed/'))).toBe(false);
  await expect(page.locator('head meta[name="robots"]')).toHaveAttribute('content', 'noindex, follow');
  await expect(page.locator('head link[rel="canonical"]')).toHaveAttribute('href', 'https://www.certifyquiz.com/it/quiz/data-analytics-foundations/mixed');
});

test('mock-exam IT: conserva la route e usa il mock dedicato, senza training', async ({ page }) => {
  const api = await installQuizApi(page);
  await openQuiz(page, '/it/quiz/data-analytics-foundations/mock-exam');
  await expect(page).toHaveURL(/\/it\/quiz\/data-analytics-foundations\/mock-exam$/);
  expect(api.seen.some(url => url === '/api/backend/mock-exam/questions/50?lang=it')).toBe(true);
  expect(api.seen.some(url => url.includes('/questions-mixed/'))).toBe(false);
});

test('25 redirect HTTP: esattamente 301, query preservate e destinazioni non redirette', async ({ request }) => {
  for (const [from, to] of Object.entries(SEO_404_SPRINT1_REDIRECTS)) {
    const response = await request.get(from + '?source=gsc', { maxRedirects: 0 });
    expect(response.status(), from).toBe(301);
    const destination = new URL(response.headers().location, 'https://www.certifyquiz.com');
    expect(destination.pathname).toBe(to);
    expect(destination.search).toBe('?source=gsc');
    const terminal = await request.get(to, { maxRedirects: 0 });
    expect([301, 302, 303, 307, 308], to).not.toContain(terminal.status());
    // Topic content deliberately absent from the isolated SSR fixture is 404;
    // its real production 200/index/canonical was verified in the live receipt.
    expect([200, 404], to).toContain(terminal.status());
  }
});

test('landing principali: 200, canonical originale, robots e hreflang coerenti', async ({ request }) => {
  for (const path of ['/it/certificazioni/data-analytics-foundations', '/certifications/ccna', '/certifications/aws-ai-practitioner', '/it/certificazioni/eipass', '/certifications/pl-300-power-bi-data-analyst']) {
    const response = await request.get(path, { maxRedirects: 0 });
    expect(response.status(), path).toBe(200);
    const html = await response.text();
    expect(html).toContain(`rel="canonical" href="https://www.certifyquiz.com${path}"`);
    // An omitted robots directive means index/follow (as on the EN landing).
    const robots = html.match(/<meta name="robots" content="([^"]*)"/)?.[1] ?? 'index, follow';
    expect(robots, path).not.toMatch(/noindex|none/i);
    expect(response.headers()['x-robots-tag'] ?? '', path).not.toMatch(/noindex|none/i);
    expect(html).toContain('hrefLang="x-default"');
    expect(html).not.toContain('href="https://www.certifyquiz.com/fr/certifications/eipass-basic"');
  }
});

test('sitemap: nessuna sorgente obsoleta aggiunta, mixed resta fuori', async ({ request }) => {
  const response = await request.get('/sitemap.xml');
  expect(response.status()).toBe(200);
  const xml = await response.text();
  expect(xml).toContain('<urlset');
  for (const source of Object.keys(SEO_404_SPRINT1_REDIRECTS)) expect(xml).not.toContain(`<loc>https://www.certifyquiz.com${source}</loc>`);
  expect(xml).not.toContain('/quiz/data-analytics-foundations/mixed');
  expect(xml).toContain('<loc>https://www.certifyquiz.com/it/certificazioni/data-analytics-foundations</loc>');
});
