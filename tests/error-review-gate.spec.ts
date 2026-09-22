import { expect, test, type Page } from "@playwright/test";

// Paywall Phase 2: il Ripasso Errori e' Premium e lo decide il server.
// La pagina deve riflettere 401/403 con un gate (nessun errore generico e
// nessun contenuto) e continuare a funzionare con 200. API intercettata.

async function serve(page: Page, status: number, body: unknown) {
  await page.route("**/api/backend/user/error-review**", (route) =>
    route.fulfill({ status, contentType: "application/json", body: JSON.stringify(body) })
  );
}

test("403 (FREE / package senza Premium): gate Premium con CTA verso pricing", async ({ page }) => {
  await serve(page, 403, { error: "ERROR_REVIEW_PREMIUM_REQUIRED" });
  // URL canonico usato dal profilo (reviewErrorsPath): /it/review/errors vi reindirizza.
  await page.goto("/review/errors");
  await expect(page.getByText("Error review is included in Premium")).toBeVisible({ timeout: 40_000 });
  const cta = page.getByRole("link", { name: "Explore Premium" });
  await expect(cta).toHaveAttribute("href", /\/pricing\?source=error_review_gate$/);
  await expect(page.getByText("No questions.")).toHaveCount(0);
});

test("401 (anonymous): gate con CTA di login", async ({ page }) => {
  await serve(page, 401, { error: "UNAUTHORIZED" });
  await page.goto("/en/review/errors");
  await expect(page.getByText("Error review is included in Premium")).toBeVisible({ timeout: 40_000 });
  await expect(page.getByRole("link", { name: "Log in to continue" })).toHaveAttribute("href", /\/en\/login\?redirect=/);
});

test("200 (Premium): la pagina mostra il ripasso come prima", async ({ page }) => {
  await serve(page, 200, {
    items: [
      {
        id: 1,
        question: "Domanda sintetica di ripasso?",
        explanation: "Spiegazione sintetica",
        answers: [
          { id: 11, answer_text: "Giusta", is_correct: 1 },
          { id: 12, answer_text: "Sbagliata", is_correct: 0 },
        ],
      },
    ],
    meta: { total: 1 },
  });
  await page.goto("/review/errors");
  await expect(page.getByText("Domanda sintetica di ripasso?")).toBeVisible({ timeout: 40_000 });
  await expect(page.getByText("Error review is included in Premium")).toHaveCount(0);
});
