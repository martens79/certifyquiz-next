import { expect, test, type Page, type Route } from "@playwright/test";

// Paywall Phase 2 — protocollo domanda -> risposta -> spiegazione.
// Il payload della domanda non contiene ne' `is_correct` ne' `explanation`:
// la UI deve prendere correttezza e spiegazione da POST /answers/check
// (training) e da POST /answers/evaluate (fine mock/assessment).
// API intercettata: nessun backend, nessun database.

const QUESTION = "Quale livello OSI gestisce il routing?";
const QUESTION_RE = /Quale livello OSI gestisce il routing\?/;
const EXPLANATION_TEXT = "SPIEGAZIONE-SERVER: il livello 3 instrada i pacchetti.";

const RIGHT = { id: 11, text: "Network (livello 3)" };
const WRONG = { id: 12, text: "Transport (livello 4)" };

// Payload "pulito": esattamente cio' che il backend consegna dopo Phase 2.
function questionsPayload(count = 1) {
  return {
    poolTotal: 100,
    questions: Array.from({ length: count }, (_, i) => ({
      id: 7001 + i,
      topic_id: 85,
      certification_id: 10,
      question: `${QUESTION} #${i + 1}`,
      question_type: "standard",
      answers: [RIGHT, WRONG].map((a) => ({ id: a.id + i * 10, text: a.text })),
    })),
  };
}

type CheckBody = { correct: boolean; explanation: string | null; granted: boolean; reason?: string };

async function intercept(
  page: Page,
  opts: { count?: number; check?: CheckBody; onCheck?: (body: any) => void; evaluateCorrect?: boolean } = {}
) {
  const seen: { checks: any[]; evaluates: any[] } = { checks: [], evaluates: [] };
  await page.route("**/api/backend/me", (r) => r.fulfill({ status: 401, contentType: "application/json", body: "{}" }));
  await page.route("**/api/backend/auth/**", (r) => r.fulfill({ status: 401, contentType: "application/json", body: "{}" }));
  await page.route("**/api/backend/question-pool/**", (r) =>
    r.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ poolTotal: 100 }) })
  );
  const serveQuestions = (r: Route) =>
    r.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(questionsPayload(opts.count ?? 1)) });
  await page.route("**/api/backend/questions/**", serveQuestions);
  await page.route("**/api/backend/questions-mixed/**", serveQuestions);
  await page.route("**/api/backend/assessment/**", serveQuestions);
  await page.route("**/api/backend/mock-exam/**", serveQuestions);

  await page.route("**/api/backend/answers/check", (r) => {
    const body = JSON.parse(r.request().postData() || "{}");
    seen.checks.push(body);
    opts.onCheck?.(body);
    const c = opts.check ?? { correct: true, explanation: EXPLANATION_TEXT, granted: true };
    return r.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        question_id: body.question_id,
        correct: c.correct,
        correct_answer_id: RIGHT.id,
        explanation: c.explanation,
        explanation_access: { granted: c.granted, reason: c.reason ?? "free_quota", remaining: c.granted ? 3 : 0, limit: 10 },
        first_attempt: { correct: c.correct, recorded_now: true },
      }),
    });
  });

  await page.route("**/api/backend/answers/evaluate", (r) => {
    const body = JSON.parse(r.request().postData() || "{}");
    seen.evaluates.push(body);
    const results = (body.answers || []).map((a: any) => ({
      question_id: a.question_id,
      correct: opts.evaluateCorrect ?? true,
      correct_answer_id: a.answer_id,
      explanation: null,
      explanation_access: { granted: false, reason: "exam" },
    }));
    return r.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ results, summary: { total: results.length, correct: results.filter((x: any) => x.correct).length } }),
    });
  });

  await page.route("**/api/backend/save-exam", (r) =>
    r.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ success: true }) })
  );
  await page.route("**/api/backend/funnel-event", (r) => r.fulfill({ status: 200, contentType: "application/json", body: "{}" }));
  return seen;
}

/** Il banner consenso copre i bottoni in basso: si rifiuta (scelta minima). */
async function dismissConsent(page: Page) {
  const reject = page.getByRole("button", { name: /Rifiuta|Reject|Decline/i }).first();
  if (await reject.isVisible().catch(() => false)) await reject.click().catch(() => {});
}

test.describe("protocollo risposta -> spiegazione", () => {
  test("training: la spiegazione arriva dal server DOPO la risposta, non col payload", async ({ page }) => {
    const seen = await intercept(page);
    await page.goto("/en/quiz/topic/85");
    await expect(page.getByText(`${QUESTION} #1`)).toBeVisible({ timeout: 40_000 });

    // prima di rispondere: nessuna spiegazione in pagina
    await expect(page.getByText("SPIEGAZIONE-SERVER")).toHaveCount(0);
    expect(seen.checks).toHaveLength(0);

    await page.getByRole("button", { name: RIGHT.text }).click();
    await expect(page.getByText(EXPLANATION_TEXT)).toBeVisible({ timeout: 15_000 });
    expect(seen.checks).toHaveLength(1);
    expect(seen.checks[0]).toMatchObject({ question_id: 7001, answer_id: RIGHT.id });
  });

  test("training: quota esaurita -> nessuna spiegazione e gate Premium", async ({ page }) => {
    await intercept(page, {
      check: { correct: false, explanation: null, granted: false, reason: "free_limit_reached" },
    });
    await page.goto("/en/quiz/topic/85");
    await expect(page.getByText(`${QUESTION} #1`)).toBeVisible({ timeout: 40_000 });
    await page.getByRole("button", { name: WRONG.text }).click();

    await expect(page.getByRole("link", { name: /Go Premium/i })).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText("SPIEGAZIONE-SERVER")).toHaveCount(0);
    const html = await page.content();
    expect(html.includes("SPIEGAZIONE-SERVER")).toBe(false);
  });

  test("training: il feedback visivo usa la risposta corretta dichiarata dal server", async ({ page }) => {
    await intercept(page, { check: { correct: false, explanation: EXPLANATION_TEXT, granted: true } });
    await page.goto("/en/quiz/topic/85");
    await expect(page.getByText(`${QUESTION} #1`)).toBeVisible({ timeout: 40_000 });
    await page.getByRole("button", { name: WRONG.text }).click();
    // la risposta giusta indicata dal server viene evidenziata
    await expect(
      page.getByRole("button").filter({ hasText: RIGHT.text }).filter({ hasText: "✓" })
    ).toBeVisible({ timeout: 15_000 });
  });

  test("mock exam: nessuna valutazione durante il tentativo, una sola chiamata alla fine", async ({ page }) => {
    const seen = await intercept(page, { count: 2, evaluateCorrect: true });
    await page.goto("/en/quiz/ccna/mock-exam");
    await dismissConsent(page);
    // QuizEngine mescola le domande: si verifica il testo comune, non l'indice.
    await expect(page.getByText(QUESTION_RE).first()).toBeVisible({ timeout: 40_000 });
    await dismissConsent(page);

    const answer = page.getByRole("button").filter({ hasText: RIGHT.text }).first();
    await answer.scrollIntoViewIfNeeded();
    await answer.click({ timeout: 15_000 });
    await page.waitForTimeout(500);
    expect(seen.checks, "durante l'esame non si chiede mai la correttezza").toHaveLength(0);

    await page.getByRole("button", { name: /Finish exam|Termina|Finisci/i }).first().click();
    await expect(page.getByText(/Punteggio|Score|Risultato|Result/i).first()).toBeVisible({ timeout: 20_000 });
    expect(seen.evaluates.length, "una valutazione in blocco a fine esame").toBeGreaterThan(0);
    expect(seen.checks, "il mock non usa il canale con le spiegazioni").toHaveLength(0);
  });
});
