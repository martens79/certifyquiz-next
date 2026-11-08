import { expect, test, type Page } from "@playwright/test";

// Local fixture only; no authenticated requests reach CertifyQuiz or Railway.
test.use({ serviceWorkers: "block" });
const user = {
  id: 999001,
  username: "Admin fixture",
  email: "admin@example.test",
  role: "admin",
  premium: false,
};
const sample = [
  {
    id: 3,
    email: "student.with.a.very.long.synthetic.address@example.test",
    event: "assessment_started",
    cert_slug: "ccna",
    topic_slug: "routing",
    score: 85,
    lang: "it",
    created_at: "2026-10-25T11:30:00.000Z",
    payload: { token: "NEVER-DISPLAY" },
  },
  {
    id: 2,
    email: null,
    event: "premium_cta_clicked",
    cert_slug: "aws-ai-practitioner",
    topic_slug: null,
    score: null,
    lang: "es",
    created_at: "2026-10-25T10:00:00.000Z",
  },
  {
    id: 1,
    email: "other@example.test",
    event: "custom_fixture_event",
    cert_slug: null,
    topic_slug: null,
    score: null,
    lang: null,
    created_at: "2026-10-24T22:00:00.000Z",
  },
];
const previews = [
  {
    id: 11,
    email: null,
    event: "map_preview_viewed",
    cert_slug: "ccna",
    topic_slug: null,
    score: null,
    lang: "it",
    created_at: "2026-10-25T11:40:00.000Z",
  },
  {
    id: 10,
    email: null,
    event: "guide_preview_viewed",
    cert_slug: "isc2-cc",
    topic_slug: null,
    score: null,
    lang: "en",
    created_at: "2026-10-25T11:35:00.000Z",
  },
];
async function install(
  page: Page,
  options: { status?: number; empty?: boolean; role?: string } = {},
) {
  const calls: URL[] = [];
  await page.addInitScript(
    ({ user }) => {
      localStorage.setItem("cq:access", "synthetic-admin-token");
      localStorage.setItem("cq_user", JSON.stringify(user));
      localStorage.setItem("lang_banner_dismissed", "1");
      localStorage.setItem(
        "cq_cookie_consent",
        JSON.stringify({ accepted: false, ts: Date.now() }),
      );
    },
    { user: { ...user, role: options.role ?? "admin" } },
  );
  await page.route("**/*", async (route) => {
    const url = new URL(route.request().url());
    if (!["127.0.0.1", "localhost"].includes(url.hostname))
      return route.abort();
    if (!url.pathname.startsWith("/api/")) return route.continue();
    if (url.pathname.endsWith("/auth/me"))
      return route.fulfill({
        json: { user: { ...user, role: options.role ?? "admin" } },
      });
    if (url.pathname.startsWith("/api/backend/admin/")) {
      // The default dashboard has its own spec: these tests track the raw events view only.
      if (!url.pathname.startsWith("/api/backend/admin/analytics/"))
        calls.push(url);
      if (url.pathname === "/api/backend/admin/funnel-events") {
        if (options.status)
          return route.fulfill({
            status: options.status,
            json: { error: "SENSITIVE-ERROR" },
          });
        const n = Number(url.searchParams.get("page") ?? 1);
        const diagnostic = url.searchParams.get("view") === "diagnostic";
        return route.fulfill({
          json: {
            ok: true,
            events: options.empty ? [] : diagnostic ? previews : sample,
            pagination: {
              page: n,
              pages: options.empty ? 1 : 3,
              total: options.empty ? 0 : 125,
              hasPrevious: n > 1,
              hasNext: !options.empty && n < 3,
            },
          },
        });
      }
      return route.fulfill({
        status: 500,
        json: { error: "Accessory fixture failure" },
      });
    }
    return route.fulfill({ json: { ok: true } });
  });
  return calls;
}

for (const viewport of [
  { width: 1440, height: 1000 },
  { width: 390, height: 844 },
]) {
  test(`events initial view at ${viewport.width}px is independent and fits the screen`, async ({
    page,
  }, testInfo) => {
    await page.setViewportSize(viewport);
    const calls = await install(page);
    await page.goto("/admin");
    await expect(
      page.getByRole("heading", { name: "Funnel Events", exact: true }),
    ).toBeVisible();
    await expect(
      page.getByText(
        "student.with.a.very.long.synthetic.address@example.test",
        { exact: true },
      ),
    ).toBeVisible();
    await expect(
      page.getByText("Anonimo / non identificato", { exact: true }),
    ).toBeVisible();
    expect(calls.length).toBeGreaterThan(0);
    expect(
      calls.every((c) => c.pathname === "/api/backend/admin/funnel-events"),
    ).toBe(true);
    await expect(page.getByText("NEVER-DISPLAY")).toHaveCount(0);
    await page.getByText("Mostra dettagli", { exact: true }).click();
    await expect(page.getByText("routing", { exact: true })).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({
      path: testInfo.outputPath(`admin-${viewport.width}.png`),
      fullPage: true,
    });
    await testInfo.attach(`admin-${viewport.width}`, {
      path: testInfo.outputPath(`admin-${viewport.width}.png`),
      contentType: "image/png",
    });
    await page
      .getByRole("navigation", { name: "Paginazione eventi" })
      .evaluate((el) => el.scrollIntoView({ block: "center" }));
    await page.getByRole("button", { name: "Successiva" }).click();
    await expect(
      page.getByRole("navigation", { name: "Paginazione eventi" }),
    ).toContainText("Pagina 2 di 3");
    await page
      .getByRole("searchbox", { name: "Ricerca" })
      .fill("alice@example.test");
    await expect
      .poll(() => calls.at(-1)?.searchParams.get("q"))
      .toBe("alice@example.test");
    await expect(
      page.getByRole("navigation", { name: "Paginazione eventi" }),
    ).toContainText("Pagina 1 di 3");
    await page.getByRole("combobox", { name: /^Lingua/ }).selectOption("es");
    await expect.poll(() => calls.at(-1)?.searchParams.get("lang")).toBe("es");
    await page.getByRole("button", { name: "Aggiorna", exact: true }).click();
    await expect(
      page.getByText(
        "student.with.a.very.long.synthetic.address@example.test",
        { exact: true },
      ),
    ).toBeVisible();
    expect(
      calls.every((c) => c.pathname === "/api/backend/admin/funnel-events"),
    ).toBe(true);
  });
}

test("empty results then unfiltered empty dataset", async ({ page }) => {
  await install(page, { empty: true });
  await page.goto("/admin");
  await expect(
    page.getByText("Nessun risultato con i filtri attivi."),
  ).toBeVisible();
  await page.getByRole("button", { name: "Azzera filtri" }).click();
  await expect(page.getByText("Nessun evento registrato.")).toBeVisible();
});
for (const status of [401, 403, 500]) {
  test(`HTTP ${status} exposes state and retry without raw error data`, async ({
    page,
  }) => {
    const options = { status };
    await install(page, options);
    await page.goto("/admin");
    await expect(
      page.getByRole("region", { name: "Eventi funnel" }).getByRole("alert"),
    ).toContainText(
      status === 401
        ? "Sessione scaduta"
        : status === 403
          ? "Accesso negato"
          : "Impossibile caricare",
    );
    await expect(page.getByText("SENSITIVE-ERROR")).toHaveCount(0);
    options.status = 0;
    await page.getByRole("button", { name: "Riprova" }).click();
    await expect(
      page.getByText(
        "student.with.a.very.long.synthetic.address@example.test",
        { exact: true },
      ),
    ).toBeVisible();
  });
}

test("non-admin cannot mount events or call admin endpoints", async ({
  page,
}) => {
  const calls = await install(page, { role: "user" });
  await page.goto("/admin");
  await expect(
    page.getByRole("heading", { name: "Accesso negato" }),
  ).toBeVisible();
  expect(calls).toHaveLength(0);
});

test("legacy overview errors do not follow the user back to events", async ({
  page,
}) => {
  const calls = await install(page);
  await page.goto("/admin");
  await expect(
    page.getByText("student.with.a.very.long.synthetic.address@example.test", {
      exact: true,
    }),
  ).toBeVisible();
  await page
    .getByRole("combobox", { name: "Altre funzioni amministrative" })
    .selectOption("overview");
  await expect(page.getByText("Overview HTTP 500")).toBeVisible();
  expect(calls.some((c) => c.pathname.endsWith("/hot-leads"))).toBe(true);
  const before = calls.length;
  await page
    .getByRole("button", { name: "Funnel Events", exact: true })
    .click();
  await expect(
    page.getByText("student.with.a.very.long.synthetic.address@example.test", {
      exact: true,
    }),
  ).toBeVisible();
  expect(
    calls
      .slice(before)
      .every((c) => c.pathname === "/api/backend/admin/funnel-events"),
  ).toBe(true);
});

test("preview events live in the diagnostic view, not in the main one", async ({
  page,
}) => {
  const calls = await install(page);
  await page.goto("/admin");
  const region = page.getByRole("region", { name: "Eventi funnel" });
  await expect(region.getByText("assessment_started", { exact: true })).toBeVisible();
  await expect(region.getByText("map_preview_viewed")).toHaveCount(0);
  expect(calls.every((c) => c.searchParams.get("view") === "main")).toBe(true);

  await page.getByRole("combobox", { name: /^Vista/ }).selectOption("diagnostic");
  await expect.poll(() => calls.at(-1)?.searchParams.get("view")).toBe("diagnostic");
  await expect(region.getByText("map_preview_viewed", { exact: true })).toBeVisible();
  await expect(region.getByText("guide_preview_viewed", { exact: true })).toBeVisible();
  await expect(region.getByText("assessment_started", { exact: true })).toHaveCount(0);

  await page.getByRole("combobox", { name: /^Vista/ }).selectOption("main");
  await expect(region.getByText("map_preview_viewed")).toHaveCount(0);
  await expect(region.getByText("assessment_started", { exact: true })).toBeVisible();
});
