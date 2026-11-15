import { expect, test, type Browser, type BrowserContext, type Page, type Route } from "@playwright/test";
import {
  CERT_SLUG,
  FakeBackend,
  TOPIC_ID,
  answerCurrent,
  clickNext,
  dismissCookieBanner,
  readHeader,
  simulateBackgroundAndReturn,
} from "./helpers/quiz-session-backend";

// Affidabilita' del completamento quiz: punteggio dopo resume, errore di
// valutazione recuperabile, chiusura del progresso lato server, resume da un
// altro dispositivo, flush alla navigazione, chiavi attempts.
// Backend interamente stubbato nel browser (nessuna rete, nessun DB reale).
// La semantica del tombstone di quiz_progress replicata da ProgressServer e'
// verificata su MySQL reale in quiz_project/test/quizReliability.integration.test.js.

const MIXED_URL = `/en/quiz/${CERT_SLUG}/mixed`;
const MOCK_URL = `/en/quiz/${CERT_SLUG}/mock-exam`;
const TOPIC_URL = `/en/quiz/topic/${TOPIC_ID}`;
const USER = { id: 77, premium: true };
const VIEWPORT = { viewport: { width: 412, height: 915 }, hasTouch: true, isMobile: true, serviceWorkers: "block" as const };

test.use(VIEWPORT);
test.describe.configure({ timeout: 180_000 });

const json = (route: Route, status: number, body: unknown) =>
  route.fulfill({ status, contentType: "application/json", body: JSON.stringify(body) });

/** Stesse regole di POST/PUT/GET /me/quiz-progress del backend (tombstone per seed). */
class ProgressServer {
  rows = new Map<string, any>();
  puts: Array<{ seed: number; answered: number; rev: number }> = [];
  completes: Array<{ seed: number; rev: number }> = [];

  private serialize(r: any) {
    return { seed: r.seed, qidsHash: r.qidsHash, currentIndex: r.currentIndex, currentBlock: r.currentBlock, remainingSec: null, state: r.state, rev: r.rev, completed: !!r.completed };
  }

  async install(page: Page) {
    await page.route("**/api/backend/me/quiz-progress/**", (route) => {
      const url = new URL(route.request().url());
      const m = url.pathname.match(/quiz-progress\/(\d+)(\/complete)?$/)!;
      const key = `${m[1]}:${url.searchParams.get("lang")}:${url.searchParams.get("mode")}`;
      const cur = this.rows.get(key);
      const method = route.request().method();
      const b = JSON.parse(route.request().postData() || "{}");

      if (method === "GET") return json(route, 200, { row: cur ? this.serialize(cur) : null });

      if (method === "POST" && m[2]) {
        this.completes.push({ seed: b.seed, rev: b.rev });
        if (!cur) {
          const row = { seed: b.seed, qidsHash: b.qidsHash ?? 0, currentIndex: 0, currentBlock: 0, state: { marked: {}, reviewLater: [], completed: true }, rev: b.rev + 1, completed: true };
          this.rows.set(key, row);
          return json(route, 200, { closed: true, row: this.serialize(row) });
        }
        if (cur.seed !== b.seed) return json(route, 200, { closed: false, reason: "SEED_MISMATCH", row: this.serialize(cur) });
        if (!cur.completed) Object.assign(cur, { state: { marked: {}, reviewLater: [], completed: true }, currentIndex: 0, completed: true, rev: Math.max(cur.rev, b.rev) + 1 });
        return json(route, 200, { closed: true, row: this.serialize(cur) });
      }

      if (method === "PUT") {
        const answered = Object.keys(b.state?.marked || {}).length;
        this.puts.push({ seed: b.seed, answered, rev: b.rev });
        if (cur?.completed && cur.seed === b.seed) return json(route, 200, { row: this.serialize(cur) });
        const effRev = cur?.completed ? Math.max(b.rev, cur.rev) : b.rev;
        if (!cur || effRev >= cur.rev) {
          this.rows.set(key, { seed: b.seed, qidsHash: b.qidsHash, currentIndex: b.currentIndex, currentBlock: b.currentBlock, state: b.state, rev: Math.max(effRev, cur?.rev ?? 0), completed: false });
        }
        return json(route, 200, { row: this.serialize(this.rows.get(key)) });
      }
      return json(route, 200, {});
    });
  }
}

type Captured = { saveExam: any[]; mockEvaluations: number; mockFailuresLeft: number; batchFailuresLeft: number; batchCalls: number };

/** Valutazione server-authoritative (risposta n.1 = corretta) con guasti iniettabili. */
async function installEvaluation(page: Page, c: Captured) {
  await page.route("**/api/backend/answers/evaluate", (route) => {
    c.batchCalls++;
    if (c.batchFailuresLeft > 0) { c.batchFailuresLeft--; return json(route, 500, { error: "SERVER_ERROR" }); }
    const { answers } = JSON.parse(route.request().postData() || "{}");
    const results = answers.map((a: any) => ({
      question_id: a.question_id, correct: a.answer_id === a.question_id * 10 + 1, correct_answer_id: a.question_id * 10 + 1,
      explanation: null, explanation_access: { granted: false, reason: "not_requested" },
    }));
    return json(route, 200, { results, summary: { total: results.length, correct: results.filter((r: any) => r.correct).length } });
  });
  await page.route("**/api/backend/mock-exam/evaluate/**", (route) => {
    c.mockEvaluations++;
    if (c.mockFailuresLeft > 0) { c.mockFailuresLeft--; return json(route, 500, { error: "SERVER_ERROR" }); }
    const { answers } = JSON.parse(route.request().postData() || "{}");
    const details = answers.map((a: any) => ({ question_id: a.question_id, selected_answer_id: a.answer_id, correct: a.answer_id === a.question_id * 10 + 1, correct_answer_id: a.question_id * 10 + 1 }));
    const correct = details.filter((d: any) => d.correct).length;
    return json(route, 200, {
      summary: { total: answers.length, answered: answers.filter((a: any) => a.answer_id != null).length, correct, wrong: answers.length - correct, percentage: Math.round((correct / answers.length) * 100), passed: false },
      reviewAvailable: true, reviewReason: "stub", details,
    });
  });
  await page.route("**/api/backend/save-exam", (route) => {
    c.saveExam.push(JSON.parse(route.request().postData() || "{}"));
    return json(route, 200, { success: true });
  });
}

const newCaptured = (): Captured => ({ saveExam: [], mockEvaluations: 0, mockFailuresLeft: 0, batchFailuresLeft: 0, batchCalls: 0 });

async function waitForQuiz(page: Page) {
  await expect.poll(async () => (await readHeader(page))?.index ?? 0, { timeout: 60_000 }).toBeGreaterThan(0);
  await dismissCookieBanner(page);
  await page.waitForTimeout(1200);
}
async function setup(page: Page, context: BrowserContext, progress?: ProgressServer) {
  const backend = new FakeBackend({ user: USER });
  await backend.seedBrowserSession(context);
  await backend.install(page);
  const captured = newCaptured();
  await installEvaluation(page, captured);
  if (progress) await progress.install(page);
  return { backend, captured };
}
async function openQuiz(page: Page, url: string) {
  await page.goto(url, { waitUntil: "domcontentloaded" });
  await waitForQuiz(page);
}
const bodyText = (page: Page) => page.evaluate(() => document.body.innerText);
const quizKeys = (page: Page) => page.evaluate(() => Object.keys(localStorage).filter((k) => k.startsWith("cq:quiz:") && !k.includes(":snap:") && !k.includes(":attempt:")));

async function answerQuestions(page: Page, count: number) {
  for (let i = 0; i < count; i++) { await answerCurrent(page, 1); await clickNext(page); await page.waitForTimeout(60); }
}
/** Risponde (n.1 = corretta) fino all'ultima domanda e preme "See result". */
async function answerToEnd(page: Page) {
  for (let guard = 0; guard < 400; guard++) {
    const h = (await readHeader(page))!;
    await answerCurrent(page, 1);
    if (h.index >= h.total) break;
    await clickNext(page);
    await page.waitForTimeout(60);
    const cont = page.getByRole("button", { name: /Continue with the next/i });
    if (await cont.count()) { await cont.first().click(); await page.waitForTimeout(60); }
  }
  await page.getByRole("button", { name: /See result/i }).first().click();
  await page.waitForTimeout(1200);
}

test("training interrupted by a reload: answers given before the reload are scored", async ({ page, context }) => {
  const { captured } = await setup(page, context);
  await openQuiz(page, MIXED_URL);
  const total = (await readHeader(page))!.total;
  await answerQuestions(page, 3);
  await page.reload({ waitUntil: "domcontentloaded" });
  await waitForQuiz(page);
  expect((await readHeader(page))!.answered).toBe(3);
  await answerToEnd(page); // tutte corrette
  await expect.poll(() => captured.saveExam.length).toBe(1);
  expect(captured.saveExam[0].correctAnswers).toBe(total);
  expect(captured.saveExam[0].totalQuestions).toBe(total);
  expect(await bodyText(page)).toContain("100%");
  expect(captured.batchCalls).toBe(1);
});

test("training without a reload does not call the batch evaluation (nothing to recover)", async ({ page, context }) => {
  const { captured } = await setup(page, context);
  await openQuiz(page, MIXED_URL);
  await answerToEnd(page);
  await expect.poll(() => captured.saveExam.length).toBe(1);
  expect(captured.batchCalls).toBe(0);
  expect(await bodyText(page)).toContain("100%");
});

test("training: batch evaluation fails after a reload, answers are kept, retry succeeds", async ({ page, context }) => {
  const { captured } = await setup(page, context);
  captured.batchFailuresLeft = 1;
  await openQuiz(page, MIXED_URL);
  const total = (await readHeader(page))!.total;
  await answerQuestions(page, 3);
  await page.reload({ waitUntil: "domcontentloaded" });
  await waitForQuiz(page);
  await answerToEnd(page);
  await expect(page.getByTestId("finish-error")).toBeVisible();
  expect(captured.saveExam.length).toBe(0);
  expect(await quizKeys(page)).not.toEqual([]);
  expect(await bodyText(page)).not.toMatch(/Score\s*0%/);
  await page.getByRole("button", { name: /Try again/i }).click();
  await expect.poll(() => captured.saveExam.length).toBe(1);
  expect(captured.saveExam[0].correctAnswers).toBe(total);
  await expect(page.getByTestId("finish-error")).toHaveCount(0);
});

test("mock exam completed normally: score from the server, saved once", async ({ page, context }) => {
  const { captured } = await setup(page, context);
  await openQuiz(page, MOCK_URL);
  await answerQuestions(page, 5);
  await page.getByRole("button", { name: /Finish exam/i }).first().click();
  await expect.poll(() => captured.saveExam.length).toBe(1);
  expect(captured.saveExam[0]).toMatchObject({ totalQuestions: 50, correctAnswers: 5, isExam: true });
  expect(await bodyText(page)).toContain("10%");
  await expect(page.getByTestId("finish-error")).toHaveCount(0);
});

test("mock exam: server evaluation fails, nothing is saved or cleared, retry succeeds", async ({ page, context }) => {
  const { captured } = await setup(page, context);
  captured.mockFailuresLeft = 2;
  await openQuiz(page, MOCK_URL);
  await answerQuestions(page, 5);
  const keysBefore = await quizKeys(page);
  await page.getByRole("button", { name: /Finish exam/i }).first().click();
  await expect(page.getByTestId("finish-error")).toBeVisible();
  expect(captured.saveExam.length, "no artificial 0% saved").toBe(0);
  expect(await quizKeys(page)).toEqual(keysBefore);
  expect((await readHeader(page))!.answered).toBe(5);
  // nessuna schermata di risultato: il quiz non e' concluso e il pulsante di consegna e' ancora li'
  await expect(page.getByRole("button", { name: /Finish exam/i }).first()).toBeVisible();

  // il primo retry fallisce ancora: l'errore resta, ancora nulla salvato
  await page.getByRole("button", { name: /Try again/i }).click();
  await expect.poll(() => captured.mockEvaluations).toBe(2);
  await expect(page.getByTestId("finish-error")).toBeVisible();
  expect(captured.saveExam.length).toBe(0);

  // reload con valutazione ancora non riuscita: le risposte si ripristinano (attempt non chiuso)
  await page.reload({ waitUntil: "domcontentloaded" });
  await waitForQuiz(page);
  expect((await readHeader(page))!.answered).toBe(5);

  await page.getByRole("button", { name: /Finish exam/i }).first().click();
  await expect.poll(() => captured.saveExam.length).toBe(1);
  expect(captured.saveExam[0]).toMatchObject({ totalQuestions: 50, correctAnswers: 5 });
  expect(await bodyText(page)).toContain("10%");
});

test("assessment mode still completes (no DB sync, no progress row)", async ({ page, context }) => {
  const progress = new ProgressServer();
  const { captured } = await setup(page, context, progress);
  const questions = Array.from({ length: 10 }, (_, i) => ({
    id: 7001 + i, topic_id: TOPIC_ID, certification_id: 12, question: `Synthetic question #${7001 + i}`, question_type: "standard",
    answers: [1, 2, 3, 4].map((n) => ({ id: (7001 + i) * 10 + n, text: `Answer ${n} of ${7001 + i}` })),
  }));
  await page.route("**/api/backend/assessment/topics/**", (route) => json(route, 200, { poolTotal: 10, questions, purpose: "assessment" }));
  await openQuiz(page, `${TOPIC_URL}?mode=assessment`);
  for (let i = 0; i < 9; i++) { await answerCurrent(page, 1); await clickNext(page); await page.waitForTimeout(60); }
  await answerCurrent(page, 1);
  await page.getByRole("button", { name: /See result/i }).first().click();
  await expect.poll(() => captured.batchCalls).toBe(1);
  expect(await bodyText(page)).toContain("100%");
  expect(progress.puts.length + progress.completes.length).toBe(0);
});

test("topic training: a finished quiz is closed on the server and does not come back", async ({ page, context }) => {
  const progress = new ProgressServer();
  await setup(page, context, progress);
  await openQuiz(page, TOPIC_URL);
  await answerToEnd(page);
  await expect.poll(() => progress.completes.length).toBe(1);
  const putsAtCompletion = progress.puts.length;

  // un background/pagehide a quiz concluso non deve piu' scrivere il progresso
  await simulateBackgroundAndReturn(page);
  await page.waitForTimeout(3500);
  expect(progress.puts.length).toBe(putsAtCompletion);
  expect([...progress.rows.values()][0].completed).toBe(true);

  // riapertura senza storage locale (altro dispositivo / dati puliti): quiz nuovo
  await page.evaluate(() => { for (const k of Object.keys(localStorage)) if (k.startsWith("cq:quiz:")) localStorage.removeItem(k); });
  await page.goto(TOPIC_URL, { waitUntil: "domcontentloaded" });
  await waitForQuiz(page);
  expect(await readHeader(page)).toMatchObject({ index: 1, answered: 0 });

  // il nuovo tentativo si sincronizza davvero (non scartato dal tombstone)
  await answerCurrent(page, 1);
  await simulateBackgroundAndReturn(page);
  await expect.poll(() => progress.puts.length).toBeGreaterThan(putsAtCompletion);
  const row = [...progress.rows.values()][0];
  expect(row.completed).toBe(false);
  expect(Object.keys(row.state.marked)).toHaveLength(1);
});

test("topic training: a late PUT of the finished attempt cannot resurrect it", async ({ page, context }) => {
  const progress = new ProgressServer();
  await setup(page, context, progress);
  await openQuiz(page, TOPIC_URL);
  await answerToEnd(page);
  await expect.poll(() => progress.completes.length).toBe(1);
  const seed = progress.completes[0].seed;
  // PUT tardiva (stessa semantica di una richiesta in volo che arriva dopo la chiusura)
  const late = await page.evaluate(async ({ seed }) => {
    const r = await fetch(`/api/backend/me/quiz-progress/85?lang=en&mode=training`, { method: "PUT", headers: { "content-type": "application/json" },
      body: JSON.stringify({ seed, qidsHash: 1, currentIndex: 39, currentBlock: 3, state: { marked: { 1: 1 }, reviewLater: [] }, rev: 9999 }) });
    return (await r.json()).row.completed;
  }, { seed });
  expect(late).toBe(true);
});

async function newDevice(browser: Browser, progress: ProgressServer) {
  const context = await browser.newContext({ ...VIEWPORT, baseURL: test.info().project.use.baseURL });
  const page = await context.newPage();
  const { captured } = await setup(page, context, progress);
  return { context, page, captured };
}

test("cross-device: device B resumes device A's progress; once B finishes, A restarts clean", async ({ browser }) => {
  const progress = new ProgressServer();
  const A = await newDevice(browser, progress);
  const B = await newDevice(browser, progress);
  try {
    await openQuiz(A.page, TOPIC_URL);
    await answerQuestions(A.page, 4);
    await simulateBackgroundAndReturn(A.page); // flush verso il server
    await expect.poll(() => progress.puts.some((p) => p.answered === 4)).toBe(true);

    await openQuiz(B.page, TOPIC_URL);
    expect(await readHeader(B.page)).toMatchObject({ index: 5, answered: 4 });

    await answerToEnd(B.page);
    await expect.poll(() => progress.completes.length).toBe(1);

    // A riapre con il proprio salvataggio locale (stesso tentativo, ormai chiuso): niente quiz risorto
    await A.page.reload({ waitUntil: "domcontentloaded" });
    await waitForQuiz(A.page);
    expect(await readHeader(A.page)).toMatchObject({ index: 1, answered: 0 });
  } finally {
    await A.context.close();
    await B.context.close();
  }
});

test("navigating away within the debounce still sends the pending progress", async ({ page, context }) => {
  const progress = new ProgressServer();
  await setup(page, context, progress);
  await openQuiz(page, TOPIC_URL);
  const href = await page.getByRole("link", { name: /Back to|certification|←/i }).first().getAttribute("href");
  await page.goto(href!, { waitUntil: "domcontentloaded" }); // pre-compila la destinazione
  await page.waitForTimeout(1500);
  await openQuiz(page, TOPIC_URL);
  progress.puts.length = 0;
  await answerCurrent(page, 1);
  await clickNext(page);
  await answerCurrent(page, 1);
  await page.getByRole("link", { name: /Back to|certification|←/i }).first().click(); // SPA navigation, < 2,5 s
  await expect.poll(() => progress.puts.some((p) => p.answered === 2), { timeout: 8000 }).toBe(true);
});

test("topic exam: attempts sent to /save-exam use the keys the backend reads", async ({ page, context }) => {
  const { captured } = await setup(page, context);
  await openQuiz(page, TOPIC_URL);
  await page.getByRole("button", { name: /^Exam$/ }).first().click();
  await page.waitForTimeout(1500);
  await answerQuestions(page, 3);
  await page.getByRole("button", { name: /Finish exam/i }).first().click();
  await expect.poll(() => captured.saveExam.length).toBe(1);
  const attempts = captured.saveExam[0].attempts;
  expect(attempts).toHaveLength(3);
  for (const a of attempts) {
    expect(Object.keys(a).sort()).toEqual(["chosenAnswerId", "questionId"]);
    expect(Number.isInteger(a.questionId) && Number.isInteger(a.chosenAnswerId)).toBe(true);
  }
});
