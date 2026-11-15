import { expect, test } from "@playwright/test";

// Richiede un server avviato su E2E_BASE_URL e l'API live (topic ISC2 CC letti da /api/topics/8).
const isc2 = [
  { path: "/certifications/isc2-cc", missing: ["Network Security", "Security Operations", "Cloud Security Concepts"] },
  { path: "/it/certificazioni/isc2-cc", missing: ["Sicurezza di rete", "Operazioni di sicurezza", "Sicurezza cloud"] },
  { path: "/fr/certifications/isc2-cc", missing: ["Sécurité réseau", "Opérations de sécurité", "Concepts de sécurité cloud"] },
  { path: "/es/certificaciones/isc2-cc", missing: ["Seguridad de red", "Operaciones de seguridad", "Conceptos de seguridad en la nube"] },
] as const;

for (const { path, missing } of isc2) {
  test(`ISC2 CC ${path}: la copertura topic mostra i topic che mancavano`, async ({ page }) => {
    await page.goto(path, { waitUntil: "domcontentloaded" });
    const box = page.locator('section[aria-label="Practice questions"]');
    await expect(box).toBeVisible();
    for (const title of missing) await expect(box.getByText(title, { exact: true })).toBeVisible();
    expect(await box.locator("ul li").count()).toBeGreaterThanOrEqual(10);
  });
}

test("CCNA: il box di copertura resta limitato a 6 topic", async ({ page }) => {
  await page.goto("/certifications/ccna", { waitUntil: "domcontentloaded" });
  const box = page.locator('section[aria-label="Practice questions"]');
  await expect(box).toBeVisible();
  expect(await box.locator("ul li").count()).toBe(6);
});

test("Microsoft AI EN: title, description e og:title dicono AI-901 e non AI-900", async ({ page }) => {
  await page.goto("/certifications/microsoft-ai", { waitUntil: "domcontentloaded" });
  const title = await page.title();
  const description = await page.locator('meta[name="description"]').getAttribute("content");
  const og = await page.locator('meta[property="og:title"]').getAttribute("content");
  for (const text of [title, description ?? "", og ?? ""]) {
    expect(text).toContain("AI-901");
    expect(text.replace("(formerly AI-900)", "")).not.toContain("AI-900");
  }
});
