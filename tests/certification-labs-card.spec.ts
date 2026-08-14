import { expect, test } from "@playwright/test";

const certificationSlug = "cisco-ccst-networking";

const locales = [
  {
    lang: "en",
    certificationPath: `/certifications/${certificationSlug}`,
    labsPath: "/interactive-labs",
    title: "Interactive Labs",
    countLabel: (count: number) => `${count} labs`,
  },
  {
    lang: "it",
    certificationPath: `/it/certificazioni/${certificationSlug}`,
    labsPath: "/it/interactive-labs",
    title: "Interactive Labs",
    countLabel: (count: number) => `${count} lab`,
  },
  {
    lang: "fr",
    certificationPath: `/fr/certifications/${certificationSlug}`,
    labsPath: "/fr/interactive-labs",
    title: "Labs interactifs",
    countLabel: (count: number) => `${count} labs`,
  },
  {
    lang: "es",
    certificationPath: `/es/certificaciones/${certificationSlug}`,
    labsPath: "/es/interactive-labs",
    title: "Labs interactivos",
    countLabel: (count: number) => `${count} labs`,
  },
] as const;

test.beforeEach(async ({ page }) => {
  await page.route("**/api/backend/me", (route) =>
    route.fulfill({ status: 401, contentType: "application/json", body: "{}" })
  );
});

for (const locale of locales) {
  test(`${locale.lang}: Study material shows the real Labs count and localized filtered link`, async ({
    page,
    request,
  }) => {
    const response = await request.get(
      `https://api.certifyquiz.com/api/certifications/${certificationSlug}/resources?lang=${locale.lang}`
    );
    expect(response.ok()).toBe(true);
    const payload = await response.json();
    const labCount = Number(payload?.resources?.labs?.count ?? 0);
    expect(labCount).toBeGreaterThan(0);

    await page.goto(locale.certificationPath);
    const studyMaterial = page.getByRole("heading", { name: /Study material|Materiale di studio|Matériel d'étude|Material de estudio/i }).locator("..");
    const labsCard = studyMaterial.getByRole("link", { name: new RegExp(locale.title, "i") });

    await expect(labsCard).toBeVisible();
    await expect(labsCard).toContainText(locale.countLabel(labCount));
    await expect(labsCard).toHaveAttribute(
      "href",
      `${locale.labsPath}?certification=${certificationSlug}`
    );

    await labsCard.click();
    await expect(page).toHaveURL(
      new RegExp(`${locale.labsPath.replaceAll("/", "\\/")}\\?certification=${certificationSlug}$`)
    );
    await expect(page.getByRole("heading", { name: /Cisco CCST.*Networking/i })).toBeVisible();
    await expect(page.locator("article")).toHaveCount(labCount);
  });
}

test("the card remains visible when client auth state exists", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("cq:access", "test-auth-token"));
  await page.route("**/api/backend/me", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ id: 1, email: "test@example.com" }),
    })
  );

  await page.goto(`/certifications/${certificationSlug}`);
  await expect(page.getByRole("link", { name: /Interactive Labs/i })).toBeVisible();
});
