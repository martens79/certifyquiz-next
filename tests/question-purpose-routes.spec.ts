import { expect, test, type Page, type Route } from "@playwright/test";

// Paywall Phase 1 / Opzione A, step B: lo SCOPO del fetch lo decide la ROUTE.
// Le pagine reali (API intercettata, nessun backend) devono usare:
//   training    -> /questions/:id, /questions-mixed/:id   (mode=training, mai exam/assessment)
//   assessment  -> /assessment/...                        (nessun parametro oltre lang)
//   mock exam   -> /mock-exam/questions/:id               (nessun parametro oltre lang)
//   conteggi    -> /question-pool/...                     (nessuna sonda limit=1 sul question bank)

const QUESTION = "Which layer of the OSI model handles routing?";

const payload = {
  poolTotal: 100,
  questions: [
    {
      id: 7001,
      topic_id: 85,
      certification_id: 10,
      question: QUESTION,
      explanation: null,
      question_type: "standard",
      answers: [
        { id: 1, text: "Network", is_correct: 1 },
        { id: 2, text: "Transport", is_correct: 0 },
        { id: 3, text: "Session", is_correct: 0 },
        { id: 4, text: "Physical", is_correct: 0 },
      ],
    },
  ],
};

async function record(page: Page) {
  const seen: URL[] = [];
  const serve = (route: Route) => {
    seen.push(new URL(route.request().url()));
    return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(payload) });
  };
  await page.route("**/api/backend/me", (route) =>
    route.fulfill({ status: 401, contentType: "application/json", body: "{}" })
  );
  await page.route("**/api/backend/questions/**", serve);
  await page.route("**/api/backend/questions-mixed/**", serve);
  await page.route("**/api/backend/assessment/**", serve);
  await page.route("**/api/backend/mock-exam/**", serve);
  await page.route("**/api/backend/question-pool/**", serve);
  return seen;
}

const paths = (seen: URL[]) => seen.map((u) => u.pathname.replace("/api/backend", ""));
const bankRoutes = (seen: URL[]) =>
  seen.filter((u) => /\/api\/backend\/questions(-mixed)?\//.test(u.pathname));

test.describe("question purpose routes (paywall phase 1)", () => {
  test("mock exam page: dedicated route, only lang, count via question-pool, no bank probe", async ({ page }) => {
    const seen = await record(page);
    await page.goto("/en/quiz/ccna/mock-exam");
    await expect(page.getByText(QUESTION)).toBeVisible({ timeout: 40_000 });

    const mock = seen.filter((u) => u.pathname.includes("/mock-exam/questions/"));
    expect(mock.length).toBeGreaterThan(0);
    for (const u of mock) expect([...u.searchParams.keys()]).toEqual(["lang"]);
    expect(paths(seen).some((p) => p.startsWith("/question-pool/certifications/"))).toBe(true);
    expect(bankRoutes(seen)).toHaveLength(0);
  });

  test("mixed page in assessment: dedicated assessment route, no client limit/mode/shuffle/strict", async ({ page }) => {
    const seen = await record(page);
    await page.goto("/en/quiz/ccna/mixed?mode=assessment");
    await expect(page.getByText(QUESTION)).toBeVisible({ timeout: 40_000 });

    const assessment = seen.filter((u) => u.pathname.includes("/assessment/questions/"));
    expect(assessment.length).toBeGreaterThan(0);
    for (const u of assessment) expect([...u.searchParams.keys()]).toEqual(["lang"]);
    expect(bankRoutes(seen)).toHaveLength(0);
  });

  test("mixed page in training: training route with mode=training, never exam/assessment/exam flag", async ({ page }) => {
    const seen = await record(page);
    await page.goto("/en/quiz/ccna/mixed");
    await expect(page.getByText(QUESTION)).toBeVisible({ timeout: 40_000 });

    const training = bankRoutes(seen);
    expect(training.length).toBeGreaterThan(0);
    for (const u of training) {
      expect(u.pathname).toMatch(/\/questions-mixed\/10$/);
      expect(u.searchParams.get("mode")).toBe("training");
      expect(u.searchParams.has("exam")).toBe(false);
      expect(u.searchParams.get("limit")).not.toBe("1"); // nessuna sonda
    }
    expect(seen.some((u) => u.pathname.includes("/mock-exam/") || u.pathname.includes("/assessment/"))).toBe(false);
  });

  test("topic page in assessment: dedicated topic assessment route, no training fetch", async ({ page }) => {
    const seen = await record(page);
    await page.goto("/en/quiz/topic/85?mode=assessment");
    await expect(page.getByText(QUESTION)).toBeVisible({ timeout: 40_000 });

    const assessment = seen.filter((u) => u.pathname.endsWith("/assessment/topics/85/questions"));
    expect(assessment.length).toBeGreaterThan(0);
    for (const u of assessment) expect([...u.searchParams.keys()]).toEqual(["lang"]);
    expect(paths(seen).some((p) => p.startsWith("/question-pool/topics/"))).toBe(true);
    expect(bankRoutes(seen)).toHaveLength(0);
  });

  test("topic page in training: training route with mode=training and no probe", async ({ page }) => {
    const seen = await record(page);
    await page.goto("/en/quiz/topic/85");
    await expect(page.getByText(QUESTION)).toBeVisible({ timeout: 40_000 });

    const training = bankRoutes(seen);
    expect(training.length).toBeGreaterThan(0);
    for (const u of training) {
      expect(u.pathname).toMatch(/\/questions\/85$/);
      expect(u.searchParams.get("mode")).toBe("training");
      expect(u.searchParams.get("limit")).not.toBe("1");
    }
    expect(seen.some((u) => u.pathname.includes("/assessment/") || u.pathname.includes("/mock-exam/"))).toBe(false);
  });
});
