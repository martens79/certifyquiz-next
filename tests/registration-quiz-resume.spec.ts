import { expect, test } from "@playwright/test";

const quizPath = "/en/quiz/ccna/mixed";
const user = { id: 71, username: "sandbox", email: "sandbox@example.test", role: "user", premium: false };
const password = "sandbox123";
const token = "sandbox-token";
const questions = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  question: `Sandbox question ${i + 1}`,
  answers: [1, 2, 3, 4].map(n => ({ id: (i + 1) * 10 + n, text: `Sandbox option ${n}` })),
}));

test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, serviceWorkers: "block" });

test("registration success requires login and restores the guest CCNA quiz", async ({ page, baseURL }) => {
  const target = new URL(baseURL ?? "");
  expect(["127.0.0.1", "localhost"]).toContain(target.hostname);
  const origin = target.origin;
  let registrationBody: unknown;
  let loginCount = 0;
  await page.route("**/*", async route => {
    const request = route.request();
    const url = new URL(request.url());
    const json = (status: number, body: unknown) =>
      route.fulfill({ status, contentType: "application/json", body: JSON.stringify(body) });
    if (url.hostname === "challenges.cloudflare.com") {
      return route.fulfill({ contentType: "application/javascript", body: `
        window.turnstile = { render: (_, opts) => {
          setTimeout(() => opts.callback("sandbox-turnstile"), 0);
          return "sandbox-widget";
        }, remove() {}, reset() {} };
        window.onloadTurnstileCallback?.();
      ` });
    }
    if (url.origin !== origin) return route.abort();
    if (!url.pathname.startsWith("/api/backend/")) return route.continue();
    const path = url.pathname.slice("/api/backend".length);
    if (path === "/auth/register") {
      registrationBody = request.postDataJSON();
      return json(200, { success: true });
    }
    if (path === "/auth/login") {
      if (!registrationBody) return json(401, {});
      loginCount++;
      return json(200, { token });
    }
    if (path === "/auth/me") return request.headers().authorization === `Bearer ${token}`
      ? json(200, { user }) : json(401, {});
    if (path === "/auth/refresh") return json(401, {});
    if (path.startsWith("/certifications/by-slug")) return json(200, { id: 1, slug: "ccna" });
    if (path.startsWith("/questions-mixed/")) return json(200, { poolTotal: questions.length, questions });
    if (path.startsWith("/question-pool/certifications/")) return json(200, { poolTotal: questions.length });
    if (path === "/answers/check") {
      const { question_id, answer_id } = request.postDataJSON();
      return json(200, { question_id, answer_id, correct_answer_id: answer_id, correct: true, explanation: "Sandbox explanation", explanation_access: { granted: true, remaining: 10, limit: 10 } });
    }
    if (path.startsWith("/me/quiz-progress/")) return json(200, { row: null });
    return json(200, {});
  });

  await page.goto(quizPath);
  await page.getByRole("button", { name: /^Reject$/i }).click();
  for (let n = 1; n <= 5; n++) {
    await expect(page.getByText(new RegExp(`Question ${n}/8`))).toBeVisible();
    await page.getByRole("button", { name: /^Sandbox option 1/ }).click();
    if (n < 5) await page.getByRole("button", { name: /^Next/ }).click();
  }
  const registerLink = page.getByRole("link", { name: "Sign up with email" });
  await expect(registerLink).toBeVisible();
  const scope = "mixed:ccna:en:training";
  const snapshot = (owner: string) => page.evaluate(key => JSON.parse(localStorage.getItem(key) || "null"), `cq:quiz:${scope}:${owner}`);
  await expect.poll(async () => Object.keys((await snapshot("anon"))?.marked ?? {}).length).toBe(5);
  const before = await snapshot("anon");

  await registerLink.click();
  await expect(page).toHaveURL(/\/register\?/);
  const submit = page.getByRole("button", { name: /Register$/ });
  await expect(submit).toBeEnabled();
  await page.locator("#username").fill(user.username);
  await page.locator("#email").fill(user.email);
  await page.locator("#password").fill(password);
  await page.locator("#confirmPassword").fill(password);
  await submit.click();
  await expect(page.getByText(/Registration successful/)).toBeVisible({ timeout: 12_000 });
  expect(registrationBody).toMatchObject({ email: user.email, password, turnstileToken: "sandbox-turnstile" });
  await expect(page).toHaveURL(/\/login\?/, { timeout: 25_000 });
  expect(loginCount).toBe(0);
  expect(new URL(page.url()).searchParams.get("redirect")).toContain(quizPath);

  // Reload the confirmed login destination to exercise the full-document entry.
  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(page.locator("#password")).toBeVisible({ timeout: 15_000 });
  await page.locator("#email").fill(user.email);
  await page.locator("#password").fill(password);
  await page.locator("form").filter({ has: page.locator("#password") }).locator('button[type="submit"]').click();
  await expect(page).toHaveURL(/\/quiz\/ccna\/mixed/, { timeout: 25_000 });
  await expect(page.getByText(/Answered 5/)).toBeVisible();
  await expect(page.getByText(`Sandbox question ${before.qIds[before.idx ?? 0]}`, { exact: true })).toBeVisible();
  expect(loginCount).toBe(1);
});
