import { expect, test, type Page } from "@playwright/test";
import {
  CERT_SLUG,
  FakeBackend,
  MOCK_QUESTIONS,
  TOPIC_ID,
  advanceTo,
  answerCurrent,
  clickNext,
  closeAwayAndReopen,
  dismissCookieBanner,
  readHeader,
  readQuestionId,
  readQuizKeys,
  readStoredProgress,
  readTimerSec,
  simulateBackgroundAndReturn,
} from "./helpers/quiz-session-backend";

// PR 2 — persistenza robusta: la sessione sopravvive a reload, tab scartata,
// ritorno dal background, login/logout, senza dipendere da una nuova
// estrazione casuale e senza aggirare gate, paywall o timer.
//
// Backend completamente stubbato (vedi helpers/quiz-session-backend.ts).

const MIXED_URL = `/en/quiz/${CERT_SLUG}/mixed`;
const MOCK_URL = `/en/quiz/${CERT_SLUG}/mock-exam`;
const TOPIC_URL = `/en/quiz/topic/${TOPIC_ID}`;

const MIXED_SCOPE = (who: string) => `mixed:${CERT_SLUG}:en:training:${who}`;
const MOCK_SCOPE = (who: string) => `mock-exam:${CERT_SLUG}:en:exam:${who}`;

test.use({ viewport: { width: 412, height: 915 }, hasTouch: true, isMobile: true, serviceWorkers: "block" });
test.describe.configure({ timeout: 120_000 });

async function waitForQuiz(page: Page) {
  await expect.poll(async () => (await readHeader(page))?.index ?? 0, { timeout: 60_000 }).toBeGreaterThan(0);
  await dismissCookieBanner(page);
  await page.waitForTimeout(1200);
}

async function openQuiz(page: Page, url: string) {
  await page.goto(url, { waitUntil: "domcontentloaded" });
  await waitForQuiz(page);
}

async function reloadQuiz(page: Page) {
  await page.reload({ waitUntil: "domcontentloaded" });
  await waitForQuiz(page);
}

/** Risponde alle prime `n` domande (risposta 1 = corretta nello stub) e avanza. */
async function answerFirst(page: Page, n: number, choice = 1) {
  for (let i = 0; i < n; i++) {
    await answerCurrent(page, choice);
    await clickNext(page);
    await page.waitForTimeout(60);
  }
}

async function goBackTo(page: Page, target: number) {
  for (let guard = 0; guard < 80; guard++) {
    const h = await readHeader(page);
    if (h && h.index <= target) return;
    await page.getByRole("button", { name: /Back/ }).first().click();
    await page.waitForTimeout(60);
  }
  throw new Error(`goBackTo(${target}) non raggiunta`);
}

test.describe("PR2 · sessione persistente", () => {
  test("3 · MIXED dopo reload: stesse domande, stesso ordine, stesso indice, risposte conservate", async ({ page }) => {
    const be = new FakeBackend();
    await be.install(page);
    await openQuiz(page, MIXED_URL);

    // 4 risposte: da anonimo la quinta apre il RegistrationGate (limite guest)
    await answerFirst(page, 4);
    await advanceTo(page, 20);
    await page.getByRole("button", { name: /Review later/ }).click();
    await expect(page.getByRole("button", { name: /Review later.*★/ })).toBeVisible();
    await page.waitForTimeout(400); // local autosave debounce
    const stored = await readStoredProgress(page, MIXED_SCOPE("anon"));
    const delivered = await page.evaluate((scope) => JSON.parse(localStorage.getItem(`cq:quiz:snap:${scope}`)!), MIXED_SCOPE("anon"));
    const before = { header: await readHeader(page), qid: await readQuestionId(page) };
    expect(before.header).toMatchObject({ index: 20, answered: 4 });

    await reloadQuiz(page);

    expect(await readHeader(page)).toEqual(before.header);
    expect(await readQuestionId(page)).toBe(before.qid);
    const after = await readStoredProgress(page, MIXED_SCOPE("anon"));
    expect(after?.qIds).toEqual(stored?.qIds); // stesse domande, stesso ordine
    expect(after?.seed).toBe(stored?.seed);
    expect(Object.keys(after?.marked ?? {}).length).toBe(4);
    expect(after?.marked).toEqual(stored?.marked);
    expect(after?.reviewLater).toEqual(stored?.reviewLater);
    expect(after?.reviewLater).toHaveLength(1);
    const restored = await page.evaluate((scope) => JSON.parse(localStorage.getItem(`cq:quiz:snap:${scope}`)!), MIXED_SCOPE("anon"));
    expect(restored.questions).toEqual(delivered.questions); // includes exact answer order
  });

  for (const invalid of ["expired", "malformed"] as const) {
    test(`snapshot ${invalid}: starts a fresh MIXED session without restoring old answers`, async ({ page }) => {
      const be = new FakeBackend();
      await be.install(page);
      await openQuiz(page, MIXED_URL);
      await answerFirst(page, 2);
      await advanceTo(page, 20);
      await page.evaluate(({ scope, invalid }) => {
        const key = `cq:quiz:snap:${scope}`;
        const snap = JSON.parse(localStorage.getItem(key)!);
        if (invalid === "expired") snap.savedAt = Date.now() - 25 * 60 * 60 * 1000;
        else snap.questions[0].answers = [];
        localStorage.setItem(key, JSON.stringify(snap));
      }, { scope: MIXED_SCOPE("anon"), invalid });
      await reloadQuiz(page);
      expect(await readHeader(page)).toMatchObject({ index: 1, answered: 0 });
    });
  }

  test("3b · MIXED dopo reload: la risposta data torna con il verdetto del server", async ({ page }) => {
    const be = new FakeBackend();
    await be.install(page);
    await openQuiz(page, MIXED_URL);
    await answerFirst(page, 3);
    await advanceTo(page, 6);

    await reloadQuiz(page);
    await goBackTo(page, 3);

    // il verdetto (corretta + spiegazione) viene richiesto di nuovo al server
    await expect(page.getByRole("button", { name: /^Answer 1 of \d+\s*✓/ })).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText(/Explanation for question \d+/)).toBeVisible();
  });

  test("3c · il payload salvato non contiene soluzioni ne' spiegazioni", async ({ page }) => {
    const be = new FakeBackend();
    await be.install(page);
    await openQuiz(page, MIXED_URL);
    await answerFirst(page, 4);

    const dump = await page.evaluate(() => {
      const out: Record<string, string> = {};
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i)!;
        if (k.startsWith("cq:quiz:")) out[k] = localStorage.getItem(k)!;
      }
      return out;
    });
    const keys = Object.keys(dump);
    expect(keys.some((k) => k.startsWith("cq:quiz:snap:"))).toBe(true);
    const all = Object.values(dump).join("\n");
    expect(all).not.toMatch(/Explanation for question/);
    expect(all).not.toMatch(/correct_answer_id|isCorrect|is_correct|"explanation"/);
  });

  test("2c · MIXED con rete assente al ritorno: ripristino dallo snapshot, senza fetch riuscito", async ({ page }) => {
    const be = new FakeBackend();
    await be.install(page);
    await openQuiz(page, MIXED_URL);
    await answerFirst(page, 2);
    await advanceTo(page, 12);
    const before = { header: await readHeader(page), qid: await readQuestionId(page) };

    // il telefono torna senza connessione verso il backend
    await page.route("**/api/backend/questions-mixed/**", (r) => r.abort("connectionfailed"));
    await reloadQuiz(page);

    expect(await readHeader(page)).toEqual(before.header);
    expect(await readQuestionId(page)).toBe(before.qid);
  });

  test("4 · Topic dopo reload: sessione ripristinata anche da loggato", async ({ page, context }) => {
    const be = new FakeBackend({ user: { id: 42 } });
    await be.seedBrowserSession(context);
    await be.install(page);
    await openQuiz(page, TOPIC_URL);
    await answerFirst(page, 2);
    await advanceTo(page, 14);
    const before = { header: await readHeader(page), qid: await readQuestionId(page) };

    await reloadQuiz(page);

    expect(await readHeader(page)).toEqual(before.header);
    expect(await readQuestionId(page)).toBe(before.qid);
  });

  test("5 · Mock-exam dopo reload: stesso esame e timer conservato (non riparte dal totale)", async ({ page, context }) => {
    const be = new FakeBackend();
    await be.install(page);
    await openQuiz(page, MOCK_URL);
    await answerFirst(page, 4);
    await advanceTo(page, 10);

    const stored = await readStoredProgress(page, MOCK_SCOPE("anon"));
    const before = { header: await readHeader(page), qid: await readQuestionId(page), timer: await readTimerSec(page) };
    expect(before.header?.total).toBe(MOCK_QUESTIONS);
    expect(before.timer).not.toBeNull();
    await page.waitForTimeout(3000); // il countdown scorre davvero

    await reloadQuiz(page);

    expect(await readHeader(page)).toEqual(before.header);
    expect(await readQuestionId(page)).toBe(before.qid);
    expect((await readStoredProgress(page, MOCK_SCOPE("anon")))?.qIds).toEqual(stored?.qIds);

    const timer = await readTimerSec(page);
    expect(timer).not.toBeNull();
    expect(timer!).toBeLessThan(before.timer!); // il tempo trascorso e' stato scalato
    expect(timer!).toBeGreaterThan(before.timer! - 30);
    expect(timer!).toBeLessThan(3600 - 5); // e non e' tornato al totale
  });

  test("5b · Mock-exam: il tempo passato lontano dalla pagina conta", async ({ page, context }) => {
    const be = new FakeBackend();
    await be.install(page);
    await openQuiz(page, MOCK_URL);
    await advanceTo(page, 6);
    const before = { header: await readHeader(page), timer: await readTimerSec(page) };

    // il telefono resta fermo 10 minuti con la pagina chiusa/scartata
    const fresh = await closeAwayAndReopen(context, page, be, MOCK_SCOPE("anon"), 600);
    await openQuiz(fresh, MOCK_URL);

    expect(await readHeader(fresh)).toEqual(before.header);
    const timer = await readTimerSec(fresh);
    expect(timer!).toBeLessThanOrEqual(before.timer! - 590);
    expect(timer!).toBeGreaterThan(before.timer! - 650);
  });

  test("5c · Mock-exam scaduto durante l'assenza: non viene riesumato ne' inviato", async ({ page, context }) => {
    const be = new FakeBackend();
    await be.install(page);
    await openQuiz(page, MOCK_URL);
    await answerFirst(page, 3);
    const oldQid = await readQuestionId(page);

    const fresh = await closeAwayAndReopen(context, page, be, MOCK_SCOPE("anon"), 7200);
    await fresh.goto(MOCK_URL, { waitUntil: 'domcontentloaded' });
    await expect(fresh.getByTestId('exam-attempt-closed')).toBeVisible();

    // The expired attempt remains closed; no full timer without intent.
    expect(await readHeader(fresh)).toBeNull();
    expect(be.mockEvaluations).toBe(0);
    expect(be.saveExamCalls).toBe(0);
    const timer = await readTimerSec(fresh);
    expect(timer ?? 0).toBe(0);
    await fresh.reload();
    await expect(fresh.getByTestId('exam-attempt-closed')).toBeVisible();
    await dismissCookieBanner(fresh);
    await fresh.getByRole('button', { name: /^Restart$/ }).click();
    await expect.poll(() => readTimerSec(fresh)).toBeGreaterThan(3500);
    void oldQid;
  });

  test("5d · Mock-exam rifiutato dal server dopo il reload: lo snapshot non lo aggira", async ({ page }) => {
    const be = new FakeBackend();
    await be.install(page);
    await openQuiz(page, MOCK_URL);
    await advanceTo(page, 5);

    be.options.mockDenied = true; // es. accesso revocato/gate attivato nel frattempo
    await page.reload({ waitUntil: "domcontentloaded" });
    await page.waitForTimeout(4000);

    expect(await readQuestionId(page)).toBeNull();
    expect(await readHeader(page)).toBeNull();
  });

  test("6a · FREE: le spiegazioni gia' consumate non si consumano di nuovo dopo il reload", async ({ page, context }) => {
    const be = new FakeBackend({ user: { id: 42 }, freeExplanations: 3 });
    await be.seedBrowserSession(context);
    await be.install(page);
    await openQuiz(page, MIXED_URL);

    await answerCurrent(page, 2); // sbagliata: consuma 1 spiegazione gratuita
    await expect(page.getByText(/Explanation for question \d+/)).toBeVisible();
    expect(be.freeRemaining).toBe(2);
    await clickNext(page);
    await advanceTo(page, 4);

    await reloadQuiz(page);
    await goBackTo(page, 1);

    await expect(page.getByText(/Explanation for question \d+/)).toBeVisible({ timeout: 10_000 });
    expect(be.freeRemaining).toBe(2); // il ripristino non ha consumato nulla
  });

  test("6b · FREE con quota esaurita: dopo il reload il gate torna, la spiegazione non viene regalata", async ({ page, context }) => {
    const be = new FakeBackend({ user: { id: 42 }, freeExplanations: 0 });
    await be.seedBrowserSession(context);
    await be.install(page);
    await openQuiz(page, MIXED_URL);

    await answerCurrent(page, 3); // sbagliata, quota finita
    await expect(page.getByText(/used all \d+ free explanations/i)).toBeVisible();
    await clickNext(page);
    await advanceTo(page, 3);

    await reloadQuiz(page);
    await goBackTo(page, 1);

    await expect(page.getByText(/used all \d+ free explanations/i)).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText(/Explanation for question \d+/)).toHaveCount(0);
  });

  test("6c · FREE con lock post-gate (10+5): il ripristino non aggira il paywall server-side", async ({ page, context }) => {
    const be = new FakeBackend({ user: { id: 42 }, freeExplanations: 0 });
    await be.seedBrowserSession(context);
    await be.install(page);
    await openQuiz(page, MIXED_URL);
    await advanceTo(page, 7);
    expect(await readStoredProgress(page, MIXED_SCOPE("user:42"))).not.toBeNull();

    // nel frattempo (altra scheda/dispositivo) l'utente ha esaurito le 5 domande post-gate
    be.options.hardLocked = true;
    await page.reload({ waitUntil: "domcontentloaded" });
    await expect(page.locator('a[href*="source=post_gate_quiz_limit"]')).toBeVisible({ timeout: 30_000 });
    expect(await readQuestionId(page)).toBeNull(); // nessuna domanda dallo snapshot
  });

  test("7 · Premium: spiegazioni illimitate anche dopo il reload, senza consumare quota", async ({ page, context }) => {
    const be = new FakeBackend({ user: { id: 42, premium: true } });
    await be.seedBrowserSession(context);
    await be.install(page);
    await openQuiz(page, MIXED_URL);

    await answerCurrent(page, 4); // sbagliata
    await expect(page.getByText(/Explanation for question \d+/)).toBeVisible();
    await clickNext(page);
    await answerCurrent(page, 2); // sbagliata
    await clickNext(page);
    await advanceTo(page, 5);

    await reloadQuiz(page);
    await goBackTo(page, 1);

    await expect(page.getByText(/Explanation for question \d+/)).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText(/used all \d+ free explanations/i)).toHaveCount(0);
    expect(be.freeRemaining).toBeNull();
  });

  test("8 · Anonimo che fa login a meta' quiz: la sessione passa all'account", async ({ page, context }) => {
    const be = new FakeBackend();
    await be.install(page);
    await openQuiz(page, MIXED_URL);
    await answerFirst(page, 3);
    await advanceTo(page, 10);
    const before = { header: await readHeader(page), qid: await readQuestionId(page) };
    const anonStored = await readStoredProgress(page, MIXED_SCOPE("anon"));
    expect(before.header).toMatchObject({ index: 10, answered: 3 });

    // login (dal browser: token + utente), poi ritorno alla pagina del quiz
    const token = be.loginAs({ id: 7 });
    await page.evaluate(
      ({ token }) => {
        localStorage.setItem("cq:access", token);
        localStorage.setItem(
          "cq_user",
          JSON.stringify({ id: 7, username: "tester", email: "t@example.test", role: "user", premium: false, trial: false })
        );
      },
      { token }
    );
    await reloadQuiz(page);

    expect(await readHeader(page)).toEqual(before.header);
    expect(await readQuestionId(page)).toBe(before.qid);
    const keys = await readQuizKeys(page);
    expect(keys).toContain(`cq:quiz:${MIXED_SCOPE("user:7")}`);
    expect(keys).toContain(`cq:quiz:snap:${MIXED_SCOPE("user:7")}`);
    expect(keys.filter((k) => k.endsWith(":anon"))).toEqual([]); // l'anonimo e' stato adottato
    expect((await readStoredProgress(page, MIXED_SCOPE("user:7")))?.qIds).toEqual(anonStored?.qIds);
  });

  test("restoring another account's own session rechecks feedback instead of reusing premium explanations", async ({ page, context }) => {
    const be = new FakeBackend({ user: { id: 42, premium: true }, freeExplanations: 0 });
    await be.seedBrowserSession(context);
    await be.install(page);
    await openQuiz(page, MIXED_URL);
    await answerCurrent(page, 2);
    await expect(page.getByText(/Explanation for question \d+/)).toBeVisible();
    await page.waitForTimeout(400);

    // Fixture: account 43 has independently answered the same delivered
    // question before. Its own scoped snapshot has no premium entitlement.
    await page.evaluate(({ from, to }) => {
      localStorage.setItem(`cq:quiz:${to}`, localStorage.getItem(`cq:quiz:${from}`)!);
      const snap = JSON.parse(localStorage.getItem(`cq:quiz:snap:${from}`)!);
      localStorage.setItem(`cq:quiz:snap:${to}`, JSON.stringify({ ...snap, scope: to, userKey: "user:43", entitlement: "standard" }));
    }, { from: MIXED_SCOPE("user:42"), to: MIXED_SCOPE("user:43") });

    const beforeChecks = be.checkCalls.length;
    const token = be.loginAs({ id: 43 });
    await page.evaluate(({ token }) => {
      const user = { id: 43, username: "other", email: "o@example.test", role: "user", premium: false, trial: false };
      localStorage.setItem("cq:access", token);
      localStorage.setItem("cq_user", JSON.stringify(user));
      window.dispatchEvent(new CustomEvent("cq:token", { detail: token }));
      window.dispatchEvent(new CustomEvent("cq:user", { detail: user }));
    }, { token });
    await expect.poll(() => be.checkCalls.length, { timeout: 15_000 }).toBeGreaterThan(beforeChecks);
    await expect(page.getByText(/used all \d+ free explanations/i)).toBeVisible();
    await expect(page.getByText(/Explanation for question \d+/)).toHaveCount(0);
  });

  test("9 · Logout e cambio utente: nessun residuo dell'utente uscente, nessuna sessione ereditata", async ({ page, context }) => {
    const be = new FakeBackend({ user: { id: 42 } });
    await be.seedBrowserSession(context);
    await be.install(page);
    await openQuiz(page, MIXED_URL);
    await answerFirst(page, 2);
    await advanceTo(page, 8);
    expect(await readQuizKeys(page)).toEqual(
      expect.arrayContaining([`cq:quiz:${MIXED_SCOPE("user:42")}`, `cq:quiz:snap:${MIXED_SCOPE("user:42")}`])
    );

    // logout dall'interfaccia (drawer mobile)
    await page.getByRole("button", { name: /open menu|ouvrir|abrir|apri/i }).first().click();
    await page.getByRole("button", { name: /log ?out|esci|sign ?out|déconnexion|cerrar sesión/i }).first().click();
    await page.waitForURL(/\/login/, { timeout: 15_000 });

    const afterLogout = await readQuizKeys(page);
    expect(afterLogout.filter((k) => k.endsWith(":user:42"))).toEqual([]);

    // un altro utente accede dallo stesso browser e apre lo stesso quiz
    const token = be.loginAs({ id: 43 });
    await page.evaluate(
      ({ token }) => {
        localStorage.setItem("cq:access", token);
        localStorage.setItem(
          "cq_user",
          JSON.stringify({ id: 43, username: "other", email: "o@example.test", role: "user", premium: false, trial: false })
        );
      },
      { token }
    );
    await openQuiz(page, MIXED_URL);

    expect(await readHeader(page)).toMatchObject({ index: 1, answered: 0 });
    expect((await readQuizKeys(page)).filter((k) => k.endsWith(":user:42"))).toEqual([]);
  });

  test("10 · Restart volontario: ricomincia davvero e non viene ripristinata la vecchia sessione", async ({ page }) => {
    const be = new FakeBackend();
    await be.install(page);
    await openQuiz(page, MIXED_URL);
    await answerFirst(page, 4);
    await advanceTo(page, 15);
    const old = await readStoredProgress(page, MIXED_SCOPE("anon"));
    expect(old?.idx).toBe(14);

    await page.getByRole("button", { name: /^Restart$/ }).first().click();
    await expect.poll(async () => (await readHeader(page))?.index, { timeout: 10_000 }).toBe(1);
    expect(await readHeader(page)).toMatchObject({ index: 1, answered: 0 });
    await page.waitForTimeout(800);

    const restarted = await readStoredProgress(page, MIXED_SCOPE("anon"));
    expect(restarted?.idx).toBe(0);
    expect(Object.keys(restarted?.marked ?? {}).length).toBe(0);
    expect(restarted?.seed).not.toBe(old?.seed);

    // un reload dopo il Restart resta alla sessione nuova
    await reloadQuiz(page);
    expect(await readHeader(page)).toMatchObject({ index: 1, answered: 0 });
  });

  test("11 · checkpoint di blocco: dopo il reload si riapre il riepilogo, non la domanda 11", async ({ page }) => {
    const be = new FakeBackend();
    await be.install(page);
    await openQuiz(page, MIXED_URL);
    await answerFirst(page, 2);
    await advanceTo(page, 10);
    await page.getByRole("button", { name: /^Next/ }).first().click(); // oltre il confine del blocco da 10
    await expect(page.getByRole("button", { name: /Continue with the next/i })).toBeVisible();

    await page.reload({ waitUntil: "domcontentloaded" });
    await expect(page.getByRole("button", { name: /Continue with the next/i })).toBeVisible({ timeout: 60_000 });

    await page.getByRole("button", { name: /Continue with the next/i }).click();
    expect(await readHeader(page)).toMatchObject({ index: 11, answered: 2 });
  });

  test("background + ritorno + reload nello stesso giro (scenario telefono fermo)", async ({ page, context }) => {
    const be = new FakeBackend({ user: { id: 42 } });
    await be.seedBrowserSession(context);
    await be.install(page);
    await openQuiz(page, MIXED_URL);
    await answerFirst(page, 3);
    await advanceTo(page, 20);
    const before = { header: await readHeader(page), qid: await readQuestionId(page) };

    be.expireAccessToken();
    await simulateBackgroundAndReturn(page);
    await expect.poll(() => be.refreshCalls, { timeout: 15_000 }).toBeGreaterThan(0);
    await reloadQuiz(page); // il browser mobile scarta la tab e al ritorno la ricarica

    expect(await readHeader(page)).toEqual(before.header);
    expect(await readQuestionId(page)).toBe(before.qid);
  });
});
