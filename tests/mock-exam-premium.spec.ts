import { expect, test, type Page } from "@playwright/test";

// Mock exam: lo stato Premium arriva dall'AuthProvider, non e' fisso a `false`.
// Account SINTETICI (FREE / Premium), API del browser interamente intercettate: nessun backend, nessun dato reale.
//
// Regressione: con `isPremiumUser: false` fisso, un utente Premium vedeva nel risultato gli inviti ad acquistare
// Premium ("See Premium", "Unlock Premium explanations") quando /me/explanation-status falliva o non era ancora
// arrivato. Il backend resta l'unica autorita' su revisione e dettagli (reviewAvailable).

// Il service worker dell'app fa passare le fetch fuori da page.route(): va bloccato per avere un test deterministico.
test.use({ serviceWorkers: "block" });
test.setTimeout(120_000);

const RIGHT = { id: 11, text: "Network (livello 3)" };
const WRONG = { id: 12, text: "Transport (livello 4)" };
const QUESTION_RE = /Quale livello OSI gestisce il routing\?/;

const questionsPayload = () => ({
  poolTotal: 100,
  questions: [0, 1].map((i) => ({
    id: 7001 + i,
    topic_id: 85,
    certification_id: 10,
    question: `Quale livello OSI gestisce il routing? #${i + 1}`,
    question_type: "standard",
    answers: [RIGHT, WRONG].map((a) => ({ id: a.id + i * 10, text: a.text })),
  })),
});

type Account = "free" | "premium";

const REFRESHED_TOKEN = "synthetic-refreshed-token-not-a-real-jwt";

// viaRefreshCookie: nessun access token in localStorage (browser che riapre il sito con il solo refresh cookie
// HttpOnly). Come il backend reale: /auth/me senza bearer -> 401; /auth/refresh -> nuovo token; /auth/me col
// token -> utente. Il cookie in se' non e' emulabile: si verifica il percorso del client che lo consuma.
async function setup(page: Page, account: Account, opts: { statusFails?: boolean; viaRefreshCookie?: boolean } = {}) {
  const calls: string[] = [];
  page.on("request", (r) => {
    const u = r.url();
    if (/\/api\/backend\//.test(u)) calls.push(`${r.method()} ${u.replace(/^https?:\/\/[^/]+\/api\/backend/, "")}`);
  });
  const user = {
    id: account === "premium" ? 9002 : 9001,
    username: `synthetic-${account}`,
    email: `${account}@example.test`,
    role: "user",
    premium: account === "premium",
    trial: false,
  };
  await page.addInitScript((withToken) => {
    try {
      if (withToken) localStorage.setItem("cq:access", "synthetic-token-not-a-real-jwt");
      localStorage.setItem("cq_cookie_consent", JSON.stringify({ accepted: false }));
    } catch { /* storage opzionale */ }
  }, !opts.viaRefreshCookie);
  if (opts.viaRefreshCookie) {
    await page.route("**/api/backend/auth/refresh", (r) => r.fulfill({ json: { ok: true, token: REFRESHED_TOKEN } }));
    await page.route("**/api/backend/auth/me", (r) =>
      r.request().headers()["authorization"] === `Bearer ${REFRESHED_TOKEN}`
        ? r.fulfill({ json: { user } })
        : r.fulfill({ status: 401, contentType: "application/json", body: "{}" })
    );
  } else {
    await page.route("**/api/backend/auth/refresh", (r) => r.fulfill({ status: 401, contentType: "application/json", body: "{}" }));
    await page.route("**/api/backend/auth/me", (r) => r.fulfill({ json: { user } }));
  }
  await page.route("**/api/backend/me", (r) => r.fulfill({ json: { user } }));
  await page.route("**/api/backend/me/explanation-status**", (r) =>
    opts.statusFails
      ? r.fulfill({ status: 500, contentType: "application/json", body: "{}" })
      : r.fulfill({
          json: account === "premium"
            ? { unlimited: true, remaining: null, limit: null }
            : { unlimited: false, remaining: 3, limit: 10, postGate: { hardLocked: false, used: 0, limit: 5 } },
        })
  );
  await page.route("**/api/backend/topics/meta/by-topic/**", (r) =>
    r.fulfill({ json: { topic: { id: 85, title_en: "Network fundamentals", certification_id: 10, is_active: 1 } } })
  );
  await page.route("**/api/backend/question-pool/**", (r) => r.fulfill({ json: { poolTotal: 100 } }));
  await page.route("**/api/backend/mock-exam/questions/**", (r) => r.fulfill({ json: questionsPayload() }));
  await page.route("**/api/backend/mock-exam/evaluate/*", (r) => {
    const body = r.request().postDataJSON();
    const total = body.answers.length;
    const answered = body.answers.filter((a: { answer_id: number | null }) => a.answer_id != null).length;
    const summary = { total, answered, correct: answered, wrong: total - answered, percentage: 100, passed: true };
    // Il backend decide la revisione: Premium -> disponibile, FREE -> premium_required.
    return r.fulfill({
      json: account === "premium"
        ? { summary, reviewAvailable: true, reviewReason: "premium", details: body.answers.map((a: { question_id: number; answer_id: number }) => ({ question_id: a.question_id, selected_answer_id: a.answer_id, correct_answer_id: a.answer_id, correct: true, question: "Q", explanation: null })) }
        : { summary, reviewAvailable: false, reviewReason: "premium_required", details: [] },
    });
  });
  await page.route("**/api/backend/save-exam", (r) => r.fulfill({ json: { success: true } }));
  await page.route("**/api/backend/funnel-event", (r) => r.fulfill({ json: {} }));
  return calls;
}

async function takeMockAndFinish(page: Page) {
  await page.goto("/en/quiz/ccna/mock-exam");
  const reject = page.getByRole("button", { name: /Rifiuta|Reject|Decline/i }).first();
  if (await reject.isVisible().catch(() => false)) await reject.click().catch(() => {});
  await expect(page.getByText(QUESTION_RE).first()).toBeVisible({ timeout: 40_000 });
  if (await reject.isVisible().catch(() => false)) await reject.click().catch(() => {});
  const answer = page.getByRole("button").filter({ hasText: RIGHT.text }).first();
  await answer.scrollIntoViewIfNeeded();
  await answer.click();
  await page.getByRole("button", { name: /Finish exam|Termina|Finisci/i }).first().click();
  await expect(page.getByText(/Punteggio|Score|Risultato|Result/i).first()).toBeVisible({ timeout: 20_000 });
  // Lascia concludere le richieste di stato in corso: il verdetto non deve dipendere dai tempi.
  await page.waitForLoadState("networkidle").catch(() => {});
}

const upsell = (page: Page) => page.locator("main");

test("FREE: il gate Mock Review e l'invito Premium restano visibili (comportamento invariato)", async ({ page }) => {
  const calls = await setup(page, "free");
  await takeMockAndFinish(page);
  await expect(upsell(page)).toContainText("Unlock Mock Review");
  await expect(upsell(page)).toContainText("See Premium");
  expect(calls.filter((c) => c.startsWith("GET /mock-exam/questions")), "domande richieste una sola volta").toHaveLength(1);
});

test("Premium: nessun invito all'acquisto, nessuna richiesta di stato spiegazioni, domande richieste una sola volta", async ({ page }) => {
  const calls = await setup(page, "premium");
  await takeMockAndFinish(page);
  await expect(upsell(page)).not.toContainText("See Premium");
  await expect(upsell(page)).not.toContainText("Unlock Premium explanations");
  await expect(upsell(page)).not.toContainText("Unlock Mock Review");
  expect(calls.filter((c) => c.includes("/me/explanation-status")), "un Premium non interroga il limite delle spiegazioni").toHaveLength(0);
  expect(calls.filter((c) => c.startsWith("GET /mock-exam/questions")), "un solo esame casuale").toHaveLength(1);
});

test("Premium con /me/explanation-status in errore: nessun invito all'acquisto (regressione)", async ({ page }) => {
  await setup(page, "premium", { statusFails: true });
  await takeMockAndFinish(page);
  await expect(upsell(page)).not.toContainText("See Premium");
  await expect(upsell(page)).not.toContainText("Unlock Premium explanations");
  await expect(upsell(page)).not.toContainText("Full preparation with Premium");
});

test("Premium autenticato dal solo refresh cookie: stato Premium corretto, nessun invito, domande richieste una sola volta", async ({ page }) => {
  const calls = await setup(page, "premium", { viaRefreshCookie: true });
  await takeMockAndFinish(page);
  expect(calls.filter((c) => c === "POST /auth/refresh"), "la sessione viene recuperata dal refresh cookie").not.toHaveLength(0);
  // Senza "ricordami" il token recuperato vive in sessionStorage.
  expect(await page.evaluate(() => sessionStorage.getItem("cq:access")), "il token recuperato e' salvato").toBe(REFRESHED_TOKEN);
  await expect(upsell(page)).not.toContainText("See Premium");
  await expect(upsell(page)).not.toContainText("Unlock Premium explanations");
  await expect(upsell(page)).not.toContainText("Unlock Mock Review");
  expect(calls.filter((c) => c.includes("/me/explanation-status")), "un Premium non interroga il limite delle spiegazioni").toHaveLength(0);
  expect(calls.filter((c) => c.startsWith("GET /mock-exam/questions")), "un solo esame casuale, anche con bootstrap da refresh").toHaveLength(1);
});

test("Premium dal solo refresh cookie con /me/explanation-status in errore: nessun invito all'acquisto", async ({ page }) => {
  const calls = await setup(page, "premium", { viaRefreshCookie: true, statusFails: true });
  await takeMockAndFinish(page);
  await expect(upsell(page)).not.toContainText("See Premium");
  await expect(upsell(page)).not.toContainText("Unlock Premium explanations");
  await expect(upsell(page)).not.toContainText("Full preparation with Premium");
  await expect(upsell(page)).not.toContainText("Unlock Mock Review");
  expect(calls.filter((c) => c.startsWith("GET /mock-exam/questions")), "un solo esame casuale").toHaveLength(1);
});
