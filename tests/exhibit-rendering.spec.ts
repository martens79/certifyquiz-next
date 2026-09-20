import { expect, test, type Page } from "@playwright/test";

// Il backend normalizza questions.exhibit_json in { title, kind, content }
// (utils/exhibit.js). Questa spec dimostra che il renderer esistente di
// QuizEngine mostra gia' quel contratto piatto, senza modifiche frontend.
// L'API e' intercettata: nessuna dipendenza da backend o database.

const MOCK_EXAM_PATH = "/en/quiz/ccna/mock-exam";

const CLI_OUTPUT = [
  "R1# show vrrp brief",
  "Interface  Grp  Pri  Time  Own  Pre  State   Master addr     Group addr",
  "Gi0/1       10  100  3210  -    Y    Backup  10.10.10.2       10.10.10.1",
  "",
  "R2# show vrrp brief",
  "Gi0/1       10   90  3210  -    Y    Master  10.10.10.2       10.10.10.1",
].join("\n");

const answers = [
  { id: 1, text: "R1 is Backup because its priority is higher", is_correct: false },
  { id: 2, text: "R2 is Master because R1 lost its virtual IP", is_correct: false },
  { id: 3, text: "Both routers are Master", is_correct: false },
  { id: 4, text: "R1 is Backup because R2 has preempt disabled", is_correct: false },
];

function questionPayload(exhibit: unknown) {
  return {
    poolTotal: 1,
    questions: [
      {
        id: 9001,
        topic_id: 1,
        certification_id: 10,
        question: "Based on the output shown, which statement is correct?",
        explanation: null,
        question_type: "cli-output",
        exhibit,
        answers,
      },
    ],
  };
}

async function openMockExamWith(page: Page, payload: unknown) {
  await page.route("**/api/backend/me", (route) =>
    route.fulfill({ status: 401, contentType: "application/json", body: "{}" })
  );
  await page.route("**/api/backend/questions-mixed/**", (route) =>
    route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(payload) })
  );
  await page.goto(MOCK_EXAM_PATH);
  await expect(page.getByText("Based on the output shown, which statement is correct?")).toBeVisible({
    timeout: 20_000,
  });
}

test.describe("question exhibit rendering", () => {
  test("flat { title, kind, content } exhibit is rendered with title and exact content", async ({ page }) => {
    await openMockExamWith(page, questionPayload({ title: "Exhibit", kind: "cli", content: CLI_OUTPUT }));

    const figure = page.locator("figure").filter({ has: page.locator("pre") });
    await expect(figure).toHaveCount(1);
    await expect(figure.locator("figcaption")).toHaveText("Exhibit");

    const pre = figure.locator("pre");
    await expect(pre).toHaveText(CLI_OUTPUT);
    // formattazione preservata: righe vuote e allineamento a spazi
    const text = await pre.evaluate((el) => el.textContent);
    expect(text).toBe(CLI_OUTPUT);
    expect(await pre.evaluate((el) => getComputedStyle(el).whiteSpace)).toBe("pre");
  });

  test("a custom exhibit title is shown instead of the default", async ({ page }) => {
    await openMockExamWith(
      page,
      questionPayload({ title: "Nmap scan output", kind: "cli", content: "PORT   STATE SERVICE\n22/tcp open  ssh" })
    );
    await expect(page.locator("figure figcaption")).toHaveText("Nmap scan output");
    await expect(page.locator("figure pre")).toContainText("22/tcp open  ssh");
  });

  test("exhibit is shown before the question text and answers are still available", async ({ page }) => {
    await openMockExamWith(page, questionPayload({ title: "Exhibit", kind: "cli", content: CLI_OUTPUT }));
    const figureBox = await page.locator("figure").boundingBox();
    const questionBox = await page.getByText("Based on the output shown, which statement is correct?").boundingBox();
    expect(figureBox && questionBox && figureBox.y < questionBox.y).toBeTruthy();
    await expect(page.getByText("Both routers are Master")).toBeVisible();
  });

  test("null exhibit: no figure, question still renders", async ({ page }) => {
    await openMockExamWith(page, questionPayload(null));
    await expect(page.locator("figure")).toHaveCount(0);
    await expect(page.getByText("Both routers are Master")).toBeVisible();
  });

  test("exhibit without usable content: no empty box, question still renders", async ({ page }) => {
    await openMockExamWith(page, questionPayload({ title: "Exhibit", kind: "cli", content: "" }));
    await expect(page.locator("figure")).toHaveCount(0);
    await expect(page.getByText("Both routers are Master")).toBeVisible();
  });

  test("control: the un-normalized multilingual shape is NOT rendered (why the API must normalize)", async ({
    page,
  }) => {
    await openMockExamWith(
      page,
      questionPayload({
        depthSprint: "2026-08-23",
        it: { title: "Exhibit", kind: "cli", content: CLI_OUTPUT },
        en: { title: "Exhibit", kind: "cli", content: CLI_OUTPUT },
      })
    );
    await expect(page.locator("figure")).toHaveCount(0);
  });

  test("mobile viewport: long output scrolls inside the exhibit, the page does not overflow", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    const wide = `${"A".repeat(30)}\n${"0123456789".repeat(20)}`;
    await openMockExamWith(page, questionPayload({ title: "Exhibit", kind: "cli", content: wide }));

    const pre = page.locator("figure pre");
    await expect(pre).toBeVisible();
    const { scrollWidth, clientWidth, overflowX } = await pre.evaluate((el) => ({
      scrollWidth: el.scrollWidth,
      clientWidth: el.clientWidth,
      overflowX: getComputedStyle(el).overflowX,
    }));
    expect(overflowX).toBe("auto");
    expect(scrollWidth).toBeGreaterThan(clientWidth);

    const pageOverflows = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1
    );
    expect(pageOverflows).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Quiz per-topic (QuizTopicClient): training e assessment.
// Stesso contratto piatto, stessa pagina reale, API intercettata.
// ---------------------------------------------------------------------------
const TOPIC_PATH = "/en/quiz/topic/85";
const TOPIC_QUESTION = "Based on the output shown, which statement is correct?";

async function openTopicQuizWith(
  page: Page,
  payload: unknown,
  path: string = TOPIC_PATH,
  seenUrls: string[] = []
) {
  await page.route("**/api/backend/me", (route) =>
    route.fulfill({ status: 401, contentType: "application/json", body: "{}" })
  );
  await page.route("**/api/backend/questions/**", (route) => {
    seenUrls.push(route.request().url());
    return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(payload) });
  });
  await page.goto(path);
  await expect(page.getByText(TOPIC_QUESTION)).toBeVisible({ timeout: 25_000 });
}

test.describe("question exhibit rendering — topic quiz", () => {
  test("topic training: flat exhibit is visible with exact content", async ({ page }) => {
    await openTopicQuizWith(page, questionPayload({ title: "Exhibit", kind: "cli", content: CLI_OUTPUT }));

    const figure = page.locator("figure").filter({ has: page.locator("pre") });
    await expect(figure).toHaveCount(1);
    await expect(figure.locator("figcaption")).toHaveText("Exhibit");
    expect(await figure.locator("pre").evaluate((el) => el.textContent)).toBe(CLI_OUTPUT);
  });

  test("topic assessment: flat exhibit is visible", async ({ page }) => {
    const seen: string[] = [];
    await openTopicQuizWith(
      page,
      questionPayload({ title: "Exhibit", kind: "cli", content: CLI_OUTPUT }),
      `${TOPIC_PATH}?mode=assessment`,
      seen
    );
    // la pagina e' davvero in assessment: la richiesta domande lo dichiara
    expect(seen.some((u) => new URL(u).searchParams.get("mode") === "assessment")).toBe(true);

    await expect(page.locator("figure pre")).toHaveCount(1);
    expect(await page.locator("figure pre").evaluate((el) => el.textContent)).toBe(CLI_OUTPUT);
  });

  test("exhibit is shown regardless of question_type", async ({ page }) => {
    const payload = questionPayload({ title: "Exhibit", kind: "cli", content: CLI_OUTPUT });
    payload.questions[0].question_type = "standard";
    await openTopicQuizWith(page, payload);
    await expect(page.locator("figure pre")).toHaveCount(1);
  });

  test("topic quiz with null exhibit: no figure, question and answers render (no regression)", async ({ page }) => {
    await openTopicQuizWith(page, questionPayload(null));
    await expect(page.locator("figure")).toHaveCount(0);
    await expect(page.getByText("Both routers are Master")).toBeVisible();
  });

  test("topic quiz mobile: long output scrolls inside the exhibit, no page overflow", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    const wide = `${"A".repeat(30)}\n${"0123456789".repeat(20)}`;
    await openTopicQuizWith(page, questionPayload({ title: "Exhibit", kind: "cli", content: wide }));

    const pre = page.locator("figure pre");
    await expect(pre).toBeVisible();
    const { scrollWidth, clientWidth } = await pre.evaluate((el) => ({
      scrollWidth: el.scrollWidth,
      clientWidth: el.clientWidth,
    }));
    expect(scrollWidth).toBeGreaterThan(clientWidth);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1)
    ).toBe(false);
  });
});
