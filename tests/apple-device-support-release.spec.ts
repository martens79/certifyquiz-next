import { test, expect } from "@playwright/test";
import Apple from "../src/certifications/data/apple-device-support";

test.use({ channel: "chrome" });
test.setTimeout(240_000);
const bases = { en: "/certifications", it: "/it/certificazioni", fr: "/fr/certifications", es: "/es/certificaciones" };
const reviewSegments = { en: "review", it: "ripasso", fr: "revision", es: "repaso" };
const api = "http://127.0.0.1:3401/api";

for (const lang of ["en", "it", "fr", "es"] as const) {
  test(`${lang}: complete landing, nine topics, reviews and working training`, async ({ page, request }) => {
    test.skip(!process.env.APPLE_RELEASE_SANDBOX, "Requires the verified Apple release sandbox API and local frontend.");
    const landing = `${bases[lang]}/apple-device-support`;
    await page.addInitScript(() => {
      localStorage.setItem("lang_banner_dismissed", "1");
      localStorage.setItem("cookie-consent", "rejected");
    });
    const response = await page.goto(landing, { waitUntil: "commit" });
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toContainText("Apple Device Support");
    await expect(page.getByRole("heading", { name: Apple.extraContent!.guideSections![lang][0].title })).toBeVisible();
    await expect(page.locator("body")).toContainText("45");
    await expect(page.locator("body")).not.toContainText("9L0-3023");
    await expect(page.getByRole("combobox", { name: "Language" })).toHaveValue(lang);
    const robots = page.locator('meta[name="robots"]');
    expect(await robots.count() ? await robots.getAttribute("content") : "index").not.toContain("noindex");
    for (const l of ["en", "it", "fr", "es"] as const) {
      const href = await page.locator(`link[rel="alternate"][hreflang^="${l}"]`).getAttribute("href", { timeout: 5000 });
      expect(href).toContain(`${bases[l]}/apple-device-support`);
    }
    const topicsResponse = await request.get(`${api}/topics/74`);
    const topics = await topicsResponse.json();
    expect(topics).toHaveLength(9);
    for (const topic of topics) {
      const topicSlug = topic[`slug_${lang}`];
      const topicPage = await request.get(`${bases[lang]}/apple-device-support/${topicSlug}`);
      expect(topicPage.status()).toBe(200);
      const html = await topicPage.text();
      expect(html).toContain(topic[`title_${lang}`].replace(/'/g, "&#x27;").split(" ")[0]);
      const reviewPage = await request.get(`${bases[lang]}/apple-device-support/${topicSlug}/${reviewSegments[lang]}`);
      expect(reviewPage.status()).toBe(200);
      // Reviews remain noindex under the existing unclassified-intent policy.
      expect(await reviewPage.text()).toContain("noindex");
    }
    const questionResponse = page.waitForResponse(r => r.url().includes("/api/backend/questions/499") && r.status() === 200);
    await page.goto(`/${lang}/quiz/topic/499`, { waitUntil: "commit" });
    const body = await (await questionResponse).json();
    expect(body.questions).toHaveLength(5);
    await expect.poll(async () => {
      const visible = await Promise.all(body.questions.map((q: { question: string }) => page.getByText(q.question, { exact: true }).isVisible()));
      return visible.filter(Boolean).length;
    }).toBe(1);
    const visibleQuestions = [];
    for (const q of body.questions) if (await page.getByText(q.question, { exact: true }).isVisible()) visibleQuestions.push(q);
    expect(visibleQuestions).toHaveLength(1);
    const question = visibleQuestions[0];
    // Answer the displayed question and observe
    // the real protected evaluator, rather than inferring correctness in the UI.
    await expect(page.getByText(question.question, { exact: true })).toBeVisible();
    const evaluated = page.waitForResponse(r => r.url().includes("/api/backend/answers/check") && r.status() === 200);
    await page.getByText(question.answers[0].text, { exact: true }).click();
    const feedback = await (await evaluated).json();
    expect(feedback.explanation).toBeTruthy();
    await expect(page.getByText(feedback.explanation, { exact: false })).toBeVisible();
    await page.goto(`/${lang}/quiz/apple-device-support/mock-exam`, { waitUntil: "commit" });
    await expect(page.locator("body")).toContainText({ en:"Mock exam unavailable",it:"Simulazione d'esame non disponibile",fr:"Examen blanc indisponible",es:"Simulación de examen no disponible" }[lang]);
    expect(await page.locator('[data-question-id]').count()).toBe(0);
    if(lang === "it") await page.screenshot({ path: "test-results/apple-device-support-it.png", fullPage: true });
  });
}

test("language selector preserves the Apple certification", async ({ page }) => {
  test.skip(!process.env.APPLE_RELEASE_SANDBOX, "Requires Apple release sandbox.");
  const hydrated = page.waitForResponse(r => r.url().includes("/api/backend/packages/offers/apple-device-support"));
  await page.goto("/certifications/apple-device-support", { waitUntil: "commit" });
  await hydrated;
  for (const lang of ["it", "fr", "es", "en"] as const) {
    await page.getByRole("combobox", { name: "Language" }).selectOption(lang);
    await expect(page).toHaveURL(new RegExp(`${bases[lang]}/apple-device-support$`), { timeout: 30000 });
    await expect(page.getByRole("heading", { name: Apple.extraContent!.guideSections![lang][0].title })).toBeVisible();
  }
});
