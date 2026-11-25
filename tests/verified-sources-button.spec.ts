import { expect, test, type Page } from "@playwright/test";

test.setTimeout(120_000);
test.use({ serviceWorkers: "block" });

// Pilota fonti CCNA: test funzionale del pulsante «Consulta le fonti» (IT) / «View sources» (EN).
// Il server decide: il client mostra il pulsante solo se POST /answers/check consegna fonti utilizzabili e, per le fonti
// di domanda (livello B), solo se explanation_access.granted === true. API intercettata: nessun backend, nessun database.
// Accessi simulati con i `reason` reali del backend: guest, free_quota/correct_answer (FREE), unlimited (Premium),
// free_limit_reached (FREE senza quota).

const QUESTION = "Quale livello OSI gestisce il routing?";
const RIGHT = { id: 11, text: "Network (livello 3)" };
const WRONG = { id: 12, text: "Transport (livello 4)" };
const EXPLANATION = "SPIEGAZIONE-SERVER: il livello 3 instrada i pacchetti.";

const SOURCE = {
  id: 501, level: "B", kind: "explanation", title: "IP Version 6 Addressing Architecture", publisher: "IETF", language: "en",
  url: "https://www.rfc-editor.org/rfc/rfc4291", locator: "§2.2",
};
const BACKGROUND = { ...SOURCE, id: 502, kind: "background", title: "Address Allocation for Private Internets", url: "https://www.rfc-editor.org/rfc/rfc1918", locator: "§3" };

type Access = { granted: boolean; reason: string; unlimited?: boolean };
type Scenario = { access: Access; sources?: unknown; explanation?: string | null };

async function intercept(page: Page, sc: Scenario) {
  await page.route("**/api/backend/me", (r) => r.fulfill({ status: 401, contentType: "application/json", body: "{}" }));
  await page.route("**/api/backend/auth/**", (r) => r.fulfill({ status: 401, contentType: "application/json", body: "{}" }));
  await page.route("**/api/backend/topics/meta/by-topic/**", (r) =>
    r.fulfill({ json: { topic: { id: 85, title_en: "Network fundamentals", certification_id: 10, is_active: 1 } } }));
  await page.route("**/api/backend/question-pool/**", (r) => r.fulfill({ json: { poolTotal: 100 } }));
  await page.route("**/api/backend/questions/**", (r) =>
    r.fulfill({ json: { poolTotal: 100, questions: [{ id: 7001, topic_id: 85, certification_id: 10, question: `${QUESTION} #1`, question_type: "standard", answers: [RIGHT, WRONG] }] } }));
  await page.route("**/api/backend/funnel-event", (r) => r.fulfill({ status: 200, contentType: "application/json", body: "{}" }));
  await page.route("**/api/backend/answers/check", (r) => {
    const body = JSON.parse(r.request().postData() || "{}");
    const granted = sc.access.granted;
    return r.fulfill({
      json: {
        question_id: body.question_id, correct: false, correct_answer_id: RIGHT.id,
        explanation: sc.explanation === undefined ? (granted ? EXPLANATION : null) : sc.explanation,
        explanation_access: { ...sc.access, remaining: granted ? 3 : 0, limit: 10 },
        first_attempt: { correct: false, recorded_now: true },
        ...(sc.sources === undefined ? {} : { sources: sc.sources }),
      },
    });
  });
}

async function answerWrong(page: Page) {
  await page.goto("/it/quiz/topic/85");
  await expect(page.getByText(`${QUESTION} #1`)).toBeVisible({ timeout: 40_000 });
  const reject = page.getByRole("button", { name: /Rifiuta|Reject|Decline/i }).first();
  if (await reject.isVisible().catch(() => false)) await reject.click().catch(() => {});
  // prima di rispondere il pulsante non esiste
  await expect(page.getByRole("button", { name: /Consulta le fonti/i })).toHaveCount(0);
  await page.getByRole("button", { name: WRONG.text }).click();
}
const button = (page: Page) => page.getByRole("button", { name: /Consulta le fonti/i });

async function expectWorkingButton(page: Page) {
  await expect(button(page)).toBeVisible({ timeout: 15_000 });
  expect((await button(page).boundingBox())!.height).toBeGreaterThanOrEqual(40);
  await expect(page.getByTestId("quiz-sources")).toHaveCount(0); // pannello chiuso: nessun URL nel DOM
  await button(page).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  const link = dialog.getByRole("link", { name: /IP Version 6 Addressing Architecture/ });
  await expect(link).toHaveAttribute("href", SOURCE.url);
  await expect(link).toHaveAttribute("target", "_blank");
  await expect(link).toHaveAttribute("rel", /noopener/);
  await expect(dialog).toContainText("§2.2");
  expect((await link.boundingBox())!.height).toBeGreaterThanOrEqual(40);
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(button(page)).toBeFocused();
}

test.describe("pulsante «Consulta le fonti»: accessi FREE / Premium / guest", () => {
  test("guest: spiegazione concessa -> pulsante, pannello, link sicuro, Escape", async ({ page }) => {
    await intercept(page, { access: { granted: true, reason: "guest" }, sources: [SOURCE] });
    await answerWrong(page);
    await expectWorkingButton(page);
  });

  test("FREE con quota (free_quota): pulsante e fonti", async ({ page }) => {
    await intercept(page, { access: { granted: true, reason: "free_quota" }, sources: [SOURCE, BACKGROUND] });
    await answerWrong(page);
    await expectWorkingButton(page);
  });

  test("Premium (unlimited): pulsante e fonti", async ({ page }) => {
    await intercept(page, { access: { granted: true, reason: "unlimited", unlimited: true }, sources: [SOURCE] });
    await answerWrong(page);
    await expectWorkingButton(page);
  });

  test("FREE senza quota (free_limit_reached): nessuna spiegazione, nessun pulsante, gate Premium", async ({ page }) => {
    await intercept(page, { access: { granted: false, reason: "free_limit_reached" } });
    await answerWrong(page);
    await expect(page.getByRole("link", { name: /Go Premium|Passa a Premium|Premium/i }).first()).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText("SPIEGAZIONE-SERVER")).toHaveCount(0);
    await expect(button(page)).toHaveCount(0);
    expect(await page.content()).not.toContain(SOURCE.url);
  });

  test("difesa: anche se il server consegnasse fonti di domanda con spiegazione negata, il client non le mostra", async ({ page }) => {
    await intercept(page, { access: { granted: false, reason: "free_limit_reached" }, sources: [SOURCE] });
    await answerWrong(page);
    await page.waitForTimeout(800);
    await expect(button(page)).toHaveCount(0);
    expect(await page.content()).not.toContain(SOURCE.url);
  });

  for (const [label, sources] of [["campo sources assente (flag spento)", undefined], ["elenco vuoto (nessuna fonte approvata)", []]] as const) {
    test(`nessun pulsante con ${label}`, async ({ page }) => {
      await intercept(page, { access: { granted: true, reason: "correct_answer" }, sources });
      await answerWrong(page);
      await expect(page.getByText(EXPLANATION)).toBeVisible({ timeout: 15_000 });
      await page.waitForTimeout(500);
      await expect(button(page)).toHaveCount(0);
    });
  }

  test("URL non HTTPS o fonte malformata dal server: scartata, nessun pulsante", async ({ page }) => {
    await intercept(page, { access: { granted: true, reason: "free_quota" }, sources: [{ ...SOURCE, url: "http://example.com/x" }, { ...SOURCE, id: 9, url: "javascript:alert(1)" }, { id: "x" }] });
    await answerWrong(page);
    await expect(page.getByText(EXPLANATION)).toBeVisible({ timeout: 15_000 });
    await page.waitForTimeout(500);
    await expect(button(page)).toHaveCount(0);
  });
});
