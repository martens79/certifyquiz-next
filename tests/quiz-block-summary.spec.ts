import { expect, test } from '@playwright/test';

// Local UI regression only. No LIVE API, database, account or entitlement changes.
for (const versioned of [false, true]) {
  test(`${versioned ? 'versioned resume' : 'legacy training'}: block uses evaluated answers and reviews only confirmed errors`, async ({ page, context }) => {
    const origin = new URL(test.info().project.use.baseURL as string);
    if (!['localhost', '127.0.0.1'].includes(origin.hostname)) throw Error('LOCAL_ONLY');
    const topic = 9001;
    const questions = Array.from({ length: 12 }, (_, i) => ({
      id: 5001 + i, topic_id: topic, certification_id: versioned ? 34 : 33,
      question: `Synthetic block question ${i + 1}`,
      contentVersion: 'release-02-v2', contentHash: 'a'.repeat(64),
      answers: [1, 2, 3, 4].map(n => ({ id: (5001 + i) * 10 + n, text: `Choice ${n} for ${i + 1}` })),
    }));
    const result = (id: number, answerId: number) => ({
      question_id: id, answerId, correct: answerId === id * 10 + 1, correct_answer_id: id * 10 + 1,
      explanation: 'Synthetic explanation', explanation_access: { granted: true, reason: 'free_quota', remaining: 9, limit: 10 },
    });
    const state = {
      marked: { '5001': 50011, '5002': 50022 }, reviewLater: [], currentIndex: 9,
      evaluations: { '5001': result(5001, 50011), '5002': result(5002, 50022) },
    };
    const attempt = { id: 'local-block-attempt', lang: 'en', certificationId: 34, contentVersion: 'release-02-v2', seed: 123,
      startedAt: Date.now(), expiresAt: null, expired: false, rev: 0, questions, state };
    const calls: string[] = [];
    await context.addInitScript(() => localStorage.setItem('cq:access', 'local-fixture-token'));
    await context.route('**/*', route => {
      const url = new URL(route.request().url());
      return url.origin === origin.origin ? route.continue() : route.abort();
    });
    await context.route('**/api/backend/**', async route => {
      const req = route.request(), p = new URL(req.url()).pathname;
      calls.push(`${req.method()} ${p}`);
      if (p.endsWith('/auth/me')) return route.fulfill({ json: { user: { id: 42, role: 'user', premium: false, username: 'fixture', email: 'fixture@example.test' } } });
      if (p.includes('/topics/meta/by-topic/')) return route.fulfill({ json: { topic: { id: topic, certification_id: versioned ? 34 : 33, title_en: 'Synthetic topic' } } });
      if (p.includes('/question-pool/')) return route.fulfill({ json: { poolTotal: 12 } });
      if (p.includes('/me/quiz-progress/')) return route.fulfill({ json: { row: null } });
      if (p.includes('/questions/')) return route.fulfill({ json: { questions, poolTotal: 12 } });
      if (p.endsWith('/explanation-status')) return route.fulfill({ json: { remaining: 10, limit: 10, unlimited: false } });
      if (p.endsWith('/answers/check')) {
        const body = req.postDataJSON();
        return route.fulfill({ json: result(body.question_id, body.answer_id) });
      }
      if (p.includes('/ccst-versioned-training')) {
        if (p.endsWith('/latest')) return route.fulfill({ json: { attempt } });
        if (p.endsWith('/progress')) {
          const body = req.postDataJSON();
          Object.assign(state, body.state); attempt.rev++;
        }
        return route.fulfill({ json: attempt });
      }
      return route.fulfill({ json: {} });
    });
    await page.goto(`/en/quiz/topic/${topic}`);
    await expect(page.getByText(/^Synthetic block question \d+$/)).toBeVisible();
    let wrongQuestion = 'Synthetic block question 2';
    const reject = page.getByRole('button', { name: /^(Reject|Rifiuta)$/i });
    if (await reject.isVisible()) await reject.click();
    if (!versioned) {
      await page.getByRole('button', { name: /^Choice 1 for \d+$/ }).click();
      await expect(page.getByText('Synthetic explanation', { exact: false })).toBeVisible();
      await page.getByRole('button', { name: /^Next/ }).click();
      wrongQuestion = await page.getByText(/^Synthetic block question \d+$/).innerText();
      await page.getByRole('button', { name: /^Choice 2 for \d+$/ }).click();
      await expect(page.getByText('Synthetic explanation', { exact: false })).toBeVisible();
      for (let i = 2; i < 10; i++) await page.getByRole('button', { name: /^Next/ }).click();
    }
    await page.getByRole('button', { name: /^Next/ }).click();
    await expect(page.getByText('1 / 10', { exact: true })).toBeVisible();
    await expect(page.getByText('10%', { exact: true })).toBeVisible();
    await page.getByRole('button', { name: /Review.*(errors|mistakes|wrong)/i }).click();
    await expect(page.getByText(wrongQuestion, { exact: true })).toBeVisible();
    expect(calls.some(c => c.includes('/complete') || c.includes('/save-exam'))).toBe(false);
    if (versioned) expect(calls.some(c => c.includes('/answers/check'))).toBe(false);
  });
}
