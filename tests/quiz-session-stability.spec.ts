import { expect, test, type Page } from "@playwright/test";
import {
  CERT_SLUG,
  FakeBackend,
  TOPIC_ID,
  advanceTo,
  answerCurrent,
  dismissCookieBanner,
  readHeader,
  readQuestionId,
  readStoredProgress,
  readTimerSec,
  simulateBackgroundAndReturn,
} from "./helpers/quiz-session-backend";

// PR 1 — stabilita' della sessione quiz (nessun refetch/reset non voluto).
//
// RCA 2026-10-13: una sessione MIXED ripartiva da 1/40 senza azione
// dell'utente perche' (1) fetchQuestions era una arrow inline nel parent,
// (2) il pool MIXED e' un campione casuale a ogni fetch, (3) l'autosave
// scriveva lo stato vuoto prima che il ripristino finisse di leggere.
// Qui si verifica che nessun re-render/evento di ciclo di vita rifaccia il
// fetch del pool o azzeri l'indice/le risposte.
//
// Backend completamente stubbato (vedi helpers/quiz-session-backend.ts).

const MIXED_URL = `/en/quiz/${CERT_SLUG}/mixed`;
const MOCK_URL = `/en/quiz/${CERT_SLUG}/mock-exam`;
const MIXED_SCOPE = (who: string) => `mixed:${CERT_SLUG}:en:training:${who}`;

// Al mount il motore fa UN fetch del pool. In `next dev` React StrictMode
// esegue gli effect due volte, quindi il conteggio osservabile e' 2; in
// produzione e' 1. Prima del fix erano 3-4 (re-render per poolTotal/auth).
const INITIAL_FETCHES_MAX = 2;

test.use({ viewport: { width: 412, height: 915 }, hasTouch: true, isMobile: true });
test.describe.configure({ timeout: 120_000 });

async function openQuiz(page: Page, url: string) {
  await page.goto(url, { waitUntil: "domcontentloaded" });
  await expect.poll(async () => (await readHeader(page))?.index ?? 0, { timeout: 60_000 }).toBeGreaterThan(0);
  await dismissCookieBanner(page);
  await page.waitForTimeout(1500); // lascia assestare gli effetti di avvio
}

test.describe("PR1 · sessione stabile (nessun refetch non voluto)", () => {
  test("avvio MIXED: un solo fetch del pool (nessun double-fetch legato a poolTotal)", async ({ page, context }) => {
    const be = new FakeBackend();
    await be.install(page);
    await openQuiz(page, MIXED_URL);
    await page.waitForTimeout(1500);
    expect(be.mixedFetches).toBeLessThanOrEqual(INITIAL_FETCHES_MAX);
  });

  test("avvio MIXED loggato: un solo fetch anche dopo il bootstrap di /auth/me", async ({ page, context }) => {
    const be = new FakeBackend({ user: { id: 42 } });
    await be.seedBrowserSession(context);
    await be.install(page);
    await openQuiz(page, MIXED_URL);
    await page.waitForTimeout(1500);
    expect(be.mixedFetches).toBeLessThanOrEqual(INITIAL_FETCHES_MAX);
  });

  test("1 · MIXED a 20/40 con access token scaduto: stessa sessione, nessun refetch", async ({ page, context }) => {
    const be = new FakeBackend({ user: { id: 42 } });
    await be.seedBrowserSession(context);
    await be.install(page);
    await openQuiz(page, MIXED_URL);
    await advanceTo(page, 20);

    const before = {
      header: await readHeader(page),
      qid: await readQuestionId(page),
      stored: await readStoredProgress(page, MIXED_SCOPE("user:42")),
      fetches: be.mixedFetches,
    };
    expect(before.header?.index).toBe(20);

    // il telefono resta fermo: l'access token (15 min) scade lato server e al
    // ritorno la bell notifiche ricarica l'inbox -> 401 -> refresh -> cq:token
    be.expireAccessToken();
    await simulateBackgroundAndReturn(page);
    await expect.poll(() => be.refreshCalls, { timeout: 15_000 }).toBeGreaterThan(0);
    await page.waitForTimeout(3000);

    expect(be.inbox401).toBeGreaterThan(0);
    const after = {
      header: await readHeader(page),
      qid: await readQuestionId(page),
      stored: await readStoredProgress(page, MIXED_SCOPE("user:42")),
      fetches: be.mixedFetches,
    };
    expect(after.header).toEqual(before.header);
    expect(after.qid).toBe(before.qid);
    expect(after.stored?.seed).toBe(before.stored?.seed);
    expect(after.stored?.qIds).toEqual(before.stored?.qIds);
    expect(after.fetches).toBe(before.fetches);
  });

  test("1b · MIXED a 20/40 con risposte date: token scaduto non azzera le risposte", async ({ page, context }) => {
    const be = new FakeBackend({ user: { id: 42 } });
    await be.seedBrowserSession(context);
    await be.install(page);
    await openQuiz(page, MIXED_URL);

    for (let i = 0; i < 6; i++) {
      await answerCurrent(page, 1);
      await page.getByRole("button", { name: /^Next/ }).first().click();
      await page.waitForTimeout(80);
    }
    await advanceTo(page, 12);
    const before = await readHeader(page);
    expect(before?.answered).toBe(6);

    be.expireAccessToken();
    await simulateBackgroundAndReturn(page);
    await expect.poll(() => be.refreshCalls, { timeout: 15_000 }).toBeGreaterThan(0);
    await page.waitForTimeout(3000);

    expect(await readHeader(page)).toEqual(before);
  });

  test("2 · MIXED dopo inattivita' (poll della bell dopo la scadenza, nessun evento): sessione intatta", async ({ page, context }) => {
    const be = new FakeBackend({ user: { id: 42 } });
    await be.seedBrowserSession(context);
    await be.install(page);
    await openQuiz(page, MIXED_URL);
    await advanceTo(page, 20);
    const before = { header: await readHeader(page), qid: await readQuestionId(page), fetches: be.mixedFetches };

    be.expireAccessToken();
    await page.waitForTimeout(34_000); // setInterval(load, 30s) della NotificationBell
    expect(be.refreshCalls).toBeGreaterThan(0);

    expect(await readHeader(page)).toEqual(before.header);
    expect(await readQuestionId(page)).toBe(before.qid);
    expect(be.mixedFetches).toBe(before.fetches);
  });

  test("2b · MIXED anonimo: background/ritorno/bfcache (pageshow persisted) non resetta", async ({ page }) => {
    const be = new FakeBackend();
    await be.install(page);
    await openQuiz(page, MIXED_URL);
    await advanceTo(page, 20);
    const before = { header: await readHeader(page), qid: await readQuestionId(page), fetches: be.mixedFetches };

    await simulateBackgroundAndReturn(page, { bfcache: true });
    await page.waitForTimeout(3000);

    expect(await readHeader(page)).toEqual(before.header);
    expect(await readQuestionId(page)).toBe(before.qid);
    expect(be.mixedFetches).toBe(before.fetches);
  });

  test("4 · Topic anonimo dopo reload: indice e risposte ripristinati", async ({ page }) => {
    const be = new FakeBackend();
    await be.install(page);
    await openQuiz(page, `/en/quiz/topic/${TOPIC_ID}`);
    expect(be.topicFetches).toBeLessThanOrEqual(INITIAL_FETCHES_MAX);

    await answerCurrent(page, 1);
    await page.getByRole("button", { name: /^Next/ }).first().click();
    await answerCurrent(page, 2);
    await advanceTo(page, 15);
    const before = { header: await readHeader(page), qid: await readQuestionId(page) };
    expect(before.header?.index).toBe(15);
    expect(before.header?.answered).toBe(2);

    await page.reload({ waitUntil: "domcontentloaded" });
    await expect.poll(async () => (await readHeader(page))?.index ?? 0, { timeout: 60_000 }).toBeGreaterThan(0);
    await page.waitForTimeout(1500);

    expect(await readHeader(page)).toEqual(before.header);
    expect(await readQuestionId(page)).toBe(before.qid);
  });

  test("mock-exam loggato: token scaduto + ritorno dal background non rigenera l'esame ne' il timer", async ({ page, context }) => {
    const be = new FakeBackend({ user: { id: 42 } });
    await be.seedBrowserSession(context);
    await be.install(page);
    await openQuiz(page, MOCK_URL);
    expect(be.mockFetches).toBeLessThanOrEqual(INITIAL_FETCHES_MAX);

    await advanceTo(page, 12);
    const before = { header: await readHeader(page), qid: await readQuestionId(page), timer: await readTimerSec(page), fetches: be.mockFetches };
    expect(before.timer).not.toBeNull();

    be.expireAccessToken();
    await simulateBackgroundAndReturn(page, { bfcache: true });
    await expect.poll(() => be.refreshCalls, { timeout: 15_000 }).toBeGreaterThan(0);
    await page.waitForTimeout(3000);

    expect(await readHeader(page)).toEqual(before.header);
    expect(await readQuestionId(page)).toBe(before.qid);
    expect(be.mockFetches).toBe(before.fetches);
    const timerAfter = await readTimerSec(page);
    expect(timerAfter).not.toBeNull();
    expect(timerAfter!).toBeLessThanOrEqual(before.timer!); // il countdown non riparte da capo
  });

  test("autosave: nessuna scrittura dello stato vuoto prima del ripristino", async ({ page }) => {
    const be = new FakeBackend();
    await be.install(page);
    await openQuiz(page, `/en/quiz/topic/${TOPIC_ID}`);
    await advanceTo(page, 8);

    // registra ogni scrittura della chiave quiz dal prossimo caricamento
    await page.addInitScript(() => {
      const writes: string[] = [];
      (window as unknown as { __quizWrites: string[] }).__quizWrites = writes;
      const set = Storage.prototype.setItem;
      Storage.prototype.setItem = function (k: string, v: string) {
        if (String(k).startsWith("cq:quiz:")) {
          try {
            const o = JSON.parse(v);
            writes.push(`qIds=${o.qIds?.length} idx=${o.idx}`);
          } catch {
            writes.push("?");
          }
        }
        return set.call(this, k, v);
      } as typeof Storage.prototype.setItem;
    });
    await page.reload({ waitUntil: "domcontentloaded" });
    await expect.poll(async () => (await readHeader(page))?.index ?? 0, { timeout: 60_000 }).toBe(8);
    await page.waitForTimeout(1000);

    const writes = await page.evaluate(() => (window as unknown as { __quizWrites: string[] }).__quizWrites);
    expect(writes.length).toBeGreaterThan(0);
    expect(writes.some((w) => w.startsWith("qIds=0"))).toBe(false);
  });

  // Il MIXED e il mock-exam pescano un campione CASUALE a ogni fetch: dopo un
  // reload completo il pool non coincide piu' con quello salvato. Il
  // ripristino richiede lo snapshot delle domande consegnate (PR 2).
  test.fixme("3 · MIXED dopo reload: sessione ripristinata (richiede snapshot, PR 2)", async () => {});
  test.fixme("5 · Mock-exam dopo reload con timer conservato (richiede snapshot, PR 2)", async () => {});
});
