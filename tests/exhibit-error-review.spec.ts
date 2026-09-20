import { expect, test, type Page } from "@playwright/test";

// Error review (ripasso errori): il client invia `lang`, conserva l'`exhibit`
// normalizzato dal backend e QuizEngine lo mostra.
//
// Il middleware serve l'error review SOLO in EN-root: /review/errors e' la copia
// src/app/review/errors (lang "en" fisso), mentre /{it,en,fr,es}/review/* risponde
// 301 verso /review/*. La copia src/app/[lang]/review/errors e' quindi
// irraggiungibile via URL: e' coperta dal guard tests/review-errors-clients.test.ts
// (identica alla copia root), non da questa spec.
// L'API e' intercettata: nessuna dipendenza da backend o database.

const CLI_OUTPUT = [
  "R1# show vrrp brief",
  "Interface  Grp  Pri  Time  Own  Pre  State   Master addr     Group addr",
  "Gi0/1       10  100  3210  -    Y    Backup  10.10.10.2       10.10.10.1",
  "",
  "R2# show vrrp brief",
  "Gi0/1       10   90  3210  -    Y    Master  10.10.10.2       10.10.10.1",
].join("\n");

const LOCALES = [{ lang: "en", path: "/review/errors", copy: "src/app/review/errors" }] as const;

const QUESTION_TEXT = {
  it: "Domanda IT: in base all'output, quale affermazione è corretta?",
  en: "Question EN: based on the output, which statement is correct?",
  fr: "Question FR : d'après la sortie, quelle affirmation est correcte ?",
  es: "Pregunta ES: según la salida, ¿qué afirmación es correcta?",
} as const;

function errorReviewPayload(exhibit: unknown | undefined) {
  const item: Record<string, unknown> = {
    id: 9001,
    topic_id: 85,
    quiz_id: null,
    is_premium: false,
    correct_answer: "B",
    question: QUESTION_TEXT.it,
    question_en: QUESTION_TEXT.en,
    question_fr: QUESTION_TEXT.fr,
    question_es: QUESTION_TEXT.es,
    explanation: "Spiegazione IT",
    explanation_en: "Explanation EN",
    explanation_fr: "Explication FR",
    explanation_es: "Explicación ES",
    answers: [
      { id: 1, answer_text: "Risposta A IT", answer_text_en: "Answer A EN", answer_text_fr: "Réponse A FR", answer_text_es: "Respuesta A ES", is_correct: false },
      { id: 2, answer_text: "Risposta B IT", answer_text_en: "Answer B EN", answer_text_fr: "Réponse B FR", answer_text_es: "Respuesta B ES", is_correct: true },
    ],
  };
  // `undefined` => il campo manca del tutto (backend vecchio)
  if (exhibit !== undefined) item.exhibit = exhibit;
  return { items: [item], meta: { total: 1, limit: 20, certificationId: null, topicId: null } };
}

async function openErrorReview(
  page: Page,
  route: (typeof LOCALES)[number],
  payload: unknown,
  { search = "", seen = [] as string[] } = {}
) {
  await page.route("**/api/backend/me", (r) =>
    r.fulfill({ status: 401, contentType: "application/json", body: "{}" })
  );
  await page.route("**/api/backend/user/error-review**", (r) => {
    seen.push(r.request().url());
    return r.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(payload) });
  });
  await page.goto(`${route.path}${search}`);
  await expect(page.getByText(QUESTION_TEXT[route.lang])).toBeVisible({ timeout: 25_000 });
}

for (const route of LOCALES) {
  test.describe(`error review [${route.lang}] (${route.copy})`, () => {
    test("sends lang to the API and keeps the legacy query params", async ({ page }) => {
      const seen: string[] = [];
      await openErrorReview(page, route, errorReviewPayload(null), {
        search: "?certificationId=10&topicId=85&limit=5",
        seen,
      });

      expect(seen.length).toBeGreaterThan(0);
      const url = new URL(seen[0]);
      expect(url.pathname).toMatch(/\/api\/backend\/user\/error-review$/);
      expect(url.searchParams.get("lang")).toBe(route.lang);
      expect(url.searchParams.get("certificationId")).toBe("10");
      expect(url.searchParams.get("topicId")).toBe("85");
      expect(url.searchParams.get("limit")).toBe("5");
    });

    test("preserves the exhibit and QuizEngine displays it (exact title and content)", async ({ page }) => {
      await openErrorReview(
        page,
        route,
        errorReviewPayload({ title: "Exhibit", kind: "cli", content: CLI_OUTPUT })
      );

      const figure = page.locator("figure").filter({ has: page.locator("pre") });
      await expect(figure).toHaveCount(1);
      await expect(figure.locator("figcaption")).toHaveText("Exhibit");
      expect(await figure.locator("pre").evaluate((el) => el.textContent)).toBe(CLI_OUTPUT);
    });

    test("legacy fields: question and answers are still picked in the page language", async ({ page }) => {
      await openErrorReview(page, route, errorReviewPayload({ title: "Exhibit", kind: "cli", content: CLI_OUTPUT }));

      const answerB = { it: "Risposta B IT", en: "Answer B EN", fr: "Réponse B FR", es: "Respuesta B ES" }[route.lang];
      await expect(page.getByText(answerB)).toBeVisible();
    });

    test("exhibit null or missing (older backend): no figure, question renders, no regression", async ({ page }) => {
      await openErrorReview(page, route, errorReviewPayload(null));
      await expect(page.locator("figure")).toHaveCount(0);
      await page.unroute("**/api/backend/user/error-review**");

      await openErrorReview(page, route, errorReviewPayload(undefined));
      await expect(page.locator("figure")).toHaveCount(0);
    });
  });
}

test("error review mobile: long output scrolls inside the exhibit, no page overflow", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  const wide = `${"A".repeat(30)}\n${"0123456789".repeat(20)}`;
  await openErrorReview(page, LOCALES[0], errorReviewPayload({ title: "Exhibit", kind: "cli", content: wide }));

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

test("error review shows the exhibit whatever the question_type is (independent of the type)", async ({ page }) => {
  // il payload dell'endpoint non porta question_type: l'exhibit deve bastare da solo
  const payload = errorReviewPayload({ title: "Exhibit", kind: "cli", content: CLI_OUTPUT });
  expect(Object.keys((payload.items[0] as Record<string, unknown>))).not.toContain("question_type");
  await openErrorReview(page, LOCALES[0], payload);
  await expect(page.locator("figure pre")).toHaveCount(1);
});

test("localized error-review URLs are redirected to the EN-root page (why only /review/errors is exercised here)", async ({
  request,
}) => {
  for (const lang of ["it", "en", "fr", "es"]) {
    const res = await request.get(`/${lang}/review/errors`, { maxRedirects: 0 });
    expect(res.status(), lang).toBe(301);
    expect(new URL(res.headers()["location"], "http://localhost").pathname, lang).toBe("/review/errors");
  }
});
