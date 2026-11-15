import { expect, test, type BrowserContext, type Page, type Route } from "@playwright/test";
import {
  CERT_SLUG,
  FakeBackend,
  TOPIC_ID,
  answerCurrent,
  clickNext,
  dismissCookieBanner,
  readHeader,
} from "./helpers/quiz-session-backend";

// Registrazione in cronologia (/save-exam): il risultato valutato non deve mai
// sembrare "salvato" se il salvataggio e' fallito, ogni retry riusa lo stesso
// attemptId e non crea duplicati. Backend interamente stubbato nel browser; la
// deduplicazione REALE e' verificata su MySQL in
// quiz_project/test/saveExamIdempotency.integration.test.js.

const MIXED_URL = `/en/quiz/${CERT_SLUG}/mixed`;
const MOCK_URL = `/en/quiz/${CERT_SLUG}/mock-exam`;
const TOPIC_URL = `/en/quiz/topic/${TOPIC_ID}`;
const USER = { id: 77, premium: true };
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

test.use({ viewport: { width: 412, height: 915 }, hasTouch: true, isMobile: true, serviceWorkers: "block" });
test.describe.configure({ timeout: 180_000 });

const json = (route: Route, status: number, body: unknown) =>
  route.fulfill({ status, contentType: "application/json", body: JSON.stringify(body) });

type Step = "ok" | "500" | "429" | "401" | "drop-before" | "drop-after";

/** Server finto di /save-exam con la stessa semantica di idempotenza del backend reale. */
class SaveServer {
  requests: any[] = [];
  committed = new Map<string, any>();
  plan: Step[] = [];
  fallback: Step = "ok";

  async install(page: Page) {
    await page.route("**/api/backend/save-exam", async (route) => {
      const body = JSON.parse(route.request().postData() || "{}");
      this.requests.push(body);
      const step = this.plan.length ? this.plan.shift()! : this.fallback;
      if (step === "500") return json(route, 500, { error: "SAVE_EXAM_FAIL" });
      if (step === "429") return json(route, 429, { error: "RATE_LIMITED" });
      if (step === "401") return json(route, 401, { error: "UNAUTHORIZED" });
      if (step === "drop-before") return route.abort("connectionreset");
      const dup = this.committed.has(body.attemptId);
      if (!dup) this.committed.set(body.attemptId, body);
      if (step === "drop-after") return route.abort("connectionreset"); // COMMIT eseguito, risposta persa
      return json(route, dup ? 200 : 201, { success: true, deduped: dup, id: 1 });
    });
  }
}

async function installEvaluation(page: Page, counters: { mock: number; batch: number }) {
  await page.route("**/api/backend/answers/evaluate", (route) => {
    counters.batch++;
    const { answers } = JSON.parse(route.request().postData() || "{}");
    const results = answers.map((a: any) => ({
      question_id: a.question_id, correct: a.answer_id === a.question_id * 10 + 1, correct_answer_id: a.question_id * 10 + 1,
      explanation: null, explanation_access: { granted: false, reason: "not_requested" },
    }));
    return json(route, 200, { results, summary: { total: results.length, correct: results.filter((r: any) => r.correct).length } });
  });
  await page.route("**/api/backend/mock-exam/evaluate/**", (route) => {
    counters.mock++;
    const { answers } = JSON.parse(route.request().postData() || "{}");
    const details = answers.map((a: any) => ({ question_id: a.question_id, selected_answer_id: a.answer_id, correct: a.answer_id === a.question_id * 10 + 1, correct_answer_id: a.question_id * 10 + 1 }));
    const correct = details.filter((d: any) => d.correct).length;
    return json(route, 200, {
      summary: { total: answers.length, answered: answers.filter((a: any) => a.answer_id != null).length, correct, wrong: answers.length - correct, percentage: Math.round((correct / answers.length) * 100), passed: false },
      reviewAvailable: true, reviewReason: "stub", details,
    });
  });
}

async function setup(page: Page, context: BrowserContext, user: typeof USER | null = USER) {
  const backend = new FakeBackend({ user });
  await backend.seedBrowserSession(context);
  await backend.install(page);
  const counters = { mock: 0, batch: 0 };
  await installEvaluation(page, counters);
  const server = new SaveServer();
  await server.install(page);
  return { backend, server, counters };
}
async function waitForQuiz(page: Page) {
  await expect.poll(async () => (await readHeader(page))?.index ?? 0, { timeout: 60_000 }).toBeGreaterThan(0);
  await dismissCookieBanner(page);
  await page.waitForTimeout(1200);
}
async function openQuiz(page: Page, url: string) {
  await page.goto(url, { waitUntil: "domcontentloaded" });
  await waitForQuiz(page);
}
const pendingKeys = (page: Page) => page.evaluate(() => Object.keys(localStorage).filter((k) => k.startsWith("cq:quiz:pending-save:")));
const bodyText = (page: Page) => page.evaluate(() => document.body.innerText);

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
  await page.waitForTimeout(800);
}
async function finishMock(page: Page, answered = 5) {
  for (let i = 0; i < answered; i++) { await answerCurrent(page, 1); await clickNext(page); await page.waitForTimeout(60); }
  await page.getByRole("button", { name: /Finish exam/i }).first().click();
}

// ---------------------------------------------------------------- A

test("A. mixed training saved: one request with a stable attemptId, explicit 'saved' state, no leftovers", async ({ page, context }) => {
  const { server } = await setup(page, context);
  await openQuiz(page, MIXED_URL);
  await answerToEnd(page);
  await expect(page.getByTestId("save-status-saved")).toBeVisible();
  await expect(page.getByTestId("save-error")).toHaveCount(0);
  expect(server.requests).toHaveLength(1);
  expect(server.requests[0].attemptId).toMatch(UUID);
  expect(server.committed.size).toBe(1);
  expect(await pendingKeys(page)).toEqual([]);
  expect(await bodyText(page)).toContain("100%");
});

test("A2. mock exam: one evaluation and one save request — the exam timer cannot re-enter after completion", async ({ page, context }) => {
  const { server, counters } = await setup(page, context);
  await openQuiz(page, MOCK_URL);
  await finishMock(page);
  await expect(page.getByTestId("save-status-saved")).toBeVisible({ timeout: 20_000 });
  await page.waitForTimeout(2500); // oltre qualche frame del timer d'esame
  expect(counters.mock).toBe(1);
  expect(server.requests).toHaveLength(1);
  expect(server.committed.size).toBe(1);
});

// ---------------------------------------------------------------- B

test("B. save-exam 500: score shown, history NOT confirmed is stated, one auto retry, manual retry saves once with the same attemptId", async ({ page, context }) => {
  const { server } = await setup(page, context);
  server.plan = ["500", "500"]; // richiesta + unico retry automatico
  await openQuiz(page, MIXED_URL);
  await answerToEnd(page);

  const alert = page.getByTestId("save-error");
  await expect(alert).toBeVisible({ timeout: 20_000 });
  await expect(alert).toContainText(/saving to your history is NOT confirmed/i);
  await expect(page.getByTestId("save-status-saved")).toHaveCount(0);
  expect(await bodyText(page)).toContain("100%"); // la valutazione resta completata e visibile
  expect(server.requests).toHaveLength(2); // nessun retry illimitato
  expect(server.committed.size).toBe(0);
  expect((await pendingKeys(page)).length, "risultato conservato per il retry").toBe(1);

  await page.getByTestId("save-retry").click();
  await expect(page.getByTestId("save-status-saved")).toBeVisible();
  await expect(page.getByTestId("save-error")).toHaveCount(0);
  expect(server.requests).toHaveLength(3);
  expect(new Set(server.requests.map((r) => r.attemptId)).size).toBe(1);
  expect(server.committed.size).toBe(1);
  expect(await pendingKeys(page)).toEqual([]);
});

test("B2. topic exam: same visible failure and recovery", async ({ page, context }) => {
  const { server } = await setup(page, context);
  server.plan = ["500", "500"];
  await openQuiz(page, TOPIC_URL);
  await page.getByRole("button", { name: /^Exam$/ }).first().click();
  await page.waitForTimeout(1500);
  for (let i = 0; i < 3; i++) { await answerCurrent(page, 1); await clickNext(page); await page.waitForTimeout(60); }
  await page.getByRole("button", { name: /Finish exam/i }).first().click();
  await expect(page.getByTestId("save-error")).toBeVisible({ timeout: 20_000 });
  await page.getByTestId("save-retry").click();
  await expect(page.getByTestId("save-status-saved")).toBeVisible();
  expect(server.committed.size).toBe(1);
  expect(server.requests[0].topicId).toBe(TOPIC_ID);
  expect(new Set(server.requests.map((r) => r.attemptId)).size).toBe(1);
});

test("B3. 429: a single request, no automatic retry, retry button on cooldown", async ({ page, context }) => {
  const { server } = await setup(page, context);
  server.plan = ["429"];
  await openQuiz(page, MIXED_URL);
  await answerToEnd(page);
  const alert = page.getByTestId("save-error");
  await expect(alert).toBeVisible({ timeout: 20_000 });
  await expect(alert).toHaveAttribute("data-kind", "rate");
  await page.waitForTimeout(4000); // oltre l'attesa del retry automatico (1,5 s)
  expect(server.requests).toHaveLength(1);
  await expect(page.getByTestId("save-retry")).toBeDisabled();
});

test("B4. 401: explicit sign-in message, result kept on the device", async ({ page, context }) => {
  const { server } = await setup(page, context);
  server.fallback = "401";
  await openQuiz(page, MIXED_URL);
  await answerToEnd(page);
  await expect(page.getByTestId("save-error")).toHaveAttribute("data-kind", "auth", { timeout: 30_000 });
  expect((await pendingKeys(page)).length).toBe(1);
});

test("B5. 401 on /save-exam with a valid refresh cookie: token refreshed, same attemptId re-sent, saved once, no error banner", async ({ page, context }) => {
  const { server, backend } = await setup(page, context);
  server.plan = ["401"]; // access token scaduto; poi il fallback "ok" dopo il refresh
  await openQuiz(page, MIXED_URL);
  await answerToEnd(page);
  await expect(page.getByTestId("save-status-saved")).toBeVisible({ timeout: 30_000 });
  await expect(page.getByTestId("save-error")).toHaveCount(0);
  expect(backend.refreshCalls, "il refresh del token deve essere stato tentato").toBeGreaterThan(0);
  expect(server.requests).toHaveLength(2);
  expect(server.requests[1].attemptId).toBe(server.requests[0].attemptId);
  expect(server.committed.size).toBe(1);
  expect(await pendingKeys(page)).toEqual([]);
});

test("B6. token present but user id unavailable: visible identity failure, nothing on disk, retry without re-answering saves once", async ({ page, context }) => {
  const { server } = await setup(page, context);
  // token valido, nessuna cache utente e /auth/me in errore: user?.id non determinabile
  await context.addInitScript(() => { try { localStorage.removeItem("cq_user"); } catch { /* */ } });
  let meOk = false;
  await page.route("**/api/backend/auth/me", (route) =>
    meOk ? json(route, 200, { user: { id: USER.id, username: "tester", email: "t@example.test", role: "user", premium: true } }) : json(route, 500, { error: "ME_DOWN" }));
  await openQuiz(page, MIXED_URL);
  await answerToEnd(page);

  const alert = page.getByTestId("save-error");
  await expect(alert).toBeVisible({ timeout: 30_000 });
  await expect(alert).toHaveAttribute("data-kind", "identity");
  await expect(page.getByTestId("save-status-saved")).toHaveCount(0);
  expect(await bodyText(page)).toContain("100%"); // la valutazione resta visibile
  expect(server.requests, "nessuna richiesta a /save-exam finche' l'identita' e' ignota").toHaveLength(0);
  expect(await pendingKeys(page), "nessuna voce su disco per un utente ignoto").toEqual([]);

  // identita' ancora non disponibile: il retry resta fallito, nessun /save-exam, nessun loop
  await expect(page.getByTestId("save-retry")).toBeEnabled({ timeout: 10_000 });
  await page.getByTestId("save-retry").click();
  await expect(alert).toHaveAttribute("data-kind", "identity");
  expect(server.requests).toHaveLength(0);

  // identita' recuperata: retry senza rispondere di nuovo, un solo risultato
  meOk = true;
  await expect(page.getByTestId("save-retry")).toBeEnabled({ timeout: 10_000 });
  await page.getByTestId("save-retry").click();
  await expect(page.getByTestId("save-status-saved")).toBeVisible({ timeout: 30_000 });
  await expect(alert).toHaveCount(0);
  expect(server.requests).toHaveLength(1);
  expect(server.requests[0].attemptId).toMatch(UUID);
  expect(server.committed.size).toBe(1);
  expect(await pendingKeys(page)).toEqual([]);
});

// ---------------------------------------------------------------- C

test("C. connection lost before the server sees the request: nothing is lost, recovered by the retry", async ({ page, context }) => {
  const { server } = await setup(page, context);
  server.plan = ["drop-before", "drop-before"];
  await openQuiz(page, MIXED_URL);
  await answerToEnd(page);
  await expect(page.getByTestId("save-error")).toBeVisible({ timeout: 20_000 });
  expect(server.committed.size).toBe(0);
  await page.getByTestId("save-retry").click();
  await expect(page.getByTestId("save-status-saved")).toBeVisible();
  expect(server.committed.size).toBe(1);
});

// ---------------------------------------------------------------- D

test("D. response lost AFTER commit: the automatic retry is deduplicated, one result, user sees 'saved'", async ({ page, context }) => {
  const { server } = await setup(page, context);
  server.plan = ["drop-after"]; // il server registra, il browser non riceve la risposta
  await openQuiz(page, MIXED_URL);
  await answerToEnd(page);
  await expect(page.getByTestId("save-status-saved")).toBeVisible({ timeout: 20_000 });
  await expect(page.getByTestId("save-error")).toHaveCount(0);
  expect(server.requests).toHaveLength(2);
  expect(new Set(server.requests.map((r) => r.attemptId)).size).toBe(1);
  expect(server.committed.size, "una sola riga di cronologia").toBe(1);
});

test("D2. manual double click on retry sends one request (no duplicate submissions)", async ({ page, context }) => {
  const { server } = await setup(page, context);
  server.plan = ["500", "500"];
  await openQuiz(page, MIXED_URL);
  await answerToEnd(page);
  await expect(page.getByTestId("save-error")).toBeVisible({ timeout: 20_000 });
  const retry = page.getByTestId("save-retry");
  await retry.dblclick({ delay: 10 }).catch(() => {});
  await expect(page.getByTestId("save-status-saved")).toBeVisible();
  expect(server.requests.length).toBe(3);
  expect(server.committed.size).toBe(1);
});

// ---------------------------------------------------------------- E

test("E. training: reload after a failed save: result recovered without answering again, saved once", async ({ page, context }) => {
  const { server } = await setup(page, context);
  server.fallback = "500";
  await openQuiz(page, MIXED_URL);
  await answerToEnd(page);
  await expect(page.getByTestId("save-error")).toBeVisible({ timeout: 20_000 });
  const attemptId = server.requests[0].attemptId;

  await page.reload({ waitUntil: "domcontentloaded" });
  await waitForQuiz(page);
  expect((await readHeader(page))!.answered, "il quiz non e' riaperto: nessuna domanda da rifare").toBe(0);
  const leftover = page.getByTestId("save-leftover");
  await expect(leftover.getByTestId("save-error")).toBeVisible();
  await expect(leftover).toContainText(/completed earlier/i);

  server.fallback = "ok";
  await leftover.getByTestId("save-retry").click();
  await expect(leftover.getByTestId("save-status-saved")).toBeVisible();
  expect(server.committed.size).toBe(1);
  expect([...server.committed.keys()]).toEqual([attemptId]);
  expect(await pendingKeys(page)).toEqual([]);
});

test("E2. timed mock exam: reload after a failed save does not reopen the exam, result is recovered and saved once", async ({ page, context }) => {
  const { server, counters } = await setup(page, context);
  server.fallback = "500";
  await openQuiz(page, MOCK_URL);
  await finishMock(page);
  await expect(page.getByTestId("save-error")).toBeVisible({ timeout: 20_000 });
  const evaluations = counters.mock;
  expect(evaluations).toBe(1);

  await page.reload({ waitUntil: "domcontentloaded" });
  const leftover = page.getByTestId("save-leftover");
  await expect(leftover.getByTestId("save-error")).toBeVisible({ timeout: 60_000 });
  // l'esame concluso NON viene riaperto: il motore mostra "tentativo terminato", nessuna domanda da rifare
  await expect(page.getByRole("heading", { name: /Exam attempt ended/i })).toBeVisible();
  expect(counters.mock, "nessuna nuova valutazione").toBe(evaluations);
  expect(await readHeader(page)).toBeNull();
  server.fallback = "ok";
  await leftover.getByTestId("save-retry").click();
  await expect(leftover.getByTestId("save-status-saved")).toBeVisible();
  expect(server.committed.size).toBe(1);
  expect(server.requests.every((r) => r.attemptId === server.requests[0].attemptId)).toBe(true);
  expect(server.requests[0]).toMatchObject({ isExam: true, totalQuestions: 50, correctAnswers: 5 });
});

test("E3. a different account on the same browser never sees or sends the previous user's pending result", async ({ page, context }) => {
  const { server, backend } = await setup(page, context);
  server.fallback = "500";
  await openQuiz(page, MIXED_URL);
  await answerToEnd(page);
  await expect(page.getByTestId("save-error")).toBeVisible({ timeout: 20_000 });
  const before = server.requests.length;

  // un altro utente accede sullo stesso browser (stessa origine)
  const token = backend.loginAs({ id: 78, premium: true });
  await page.evaluate(({ token }) => {
    localStorage.setItem("cq:access", token);
    localStorage.setItem("cq_user", JSON.stringify({ id: 78, username: "other", email: "o@example.test", role: "user", premium: true, trial: false }));
  }, { token });
  server.fallback = "ok";
  await page.reload({ waitUntil: "domcontentloaded" });
  await waitForQuiz(page);
  await expect(page.getByTestId("save-leftover")).toHaveCount(0);
  expect(server.requests.length).toBe(before);
});

// ---------------------------------------------------------------- compat

test("anonymous users: finishing at the registration gate makes no /save-exam call and shows no history banner", async ({ page, context }) => {
  const { server } = await setup(page, context, null);
  await openQuiz(page, MIXED_URL);
  // 5 domande: poi compare il gate di registrazione (nessun Next dopo l'ultima)
  for (let i = 0; i < 5; i++) { await answerCurrent(page, 1); if (i < 4) await clickNext(page); await page.waitForTimeout(60); }
  await expect(page.getByRole("heading", { name: /Create a free account/i })).toBeVisible({ timeout: 30_000 });
  await page.waitForTimeout(2500);
  expect(server.requests).toHaveLength(0);
  await expect(page.getByTestId("save-error")).toHaveCount(0);
  await expect(page.getByTestId("save-status-saving")).toHaveCount(0);
  await expect(page.getByTestId("save-leftover")).toHaveCount(0);
});
