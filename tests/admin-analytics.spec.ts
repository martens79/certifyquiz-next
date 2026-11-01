import { expect, test, type Page } from "@playwright/test";
import {
  CERT_DETAIL,
  CERTS,
  DICTIONARY,
  FILTERS,
  OVERVIEW,
  RETENTION,
  REVENUE,
} from "./helpers/admin-analytics-fixture";

// Local fixture only: every external host is aborted and every API call is answered by the stubs below.
test.use({ serviceWorkers: "block" });
const admin = {
  id: 999001,
  username: "Admin fixture",
  email: "admin@example.test",
  role: "admin",
  premium: false,
};
const SHOTS = process.env.ADMIN_ANALYTICS_SHOTS;

type Options = { status?: Record<string, number>; role?: string };
async function install(page: Page, options: Options = {}) {
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
    { user: { ...admin, role: options.role ?? "admin" } },
  );
  await page.route("**/*", async (route) => {
    const url = new URL(route.request().url());
    if (!["127.0.0.1", "localhost"].includes(url.hostname))
      return route.abort();
    if (!url.pathname.startsWith("/api/")) return route.continue();
    if (url.pathname.endsWith("/auth/me"))
      return route.fulfill({
        json: { user: { ...admin, role: options.role ?? "admin" } },
      });
    const m = url.pathname.match(/\/api\/backend\/admin\/analytics\/(.+)$/);
    if (m) {
      calls.push(url);
      const name = m[1].split("/")[0];
      const status = options.status?.[name];
      if (status)
        return route.fulfill({
          status,
          json: { error: "SENSITIVE-INTERNAL-ERROR sk_live_leak" },
        });
      const body = {
        dictionary: DICTIONARY,
        filters: FILTERS,
        overview: OVERVIEW,
        certifications: m[1].includes("/") ? CERT_DETAIL : CERTS,
        retention: RETENTION,
        revenue: REVENUE,
      }[name];
      return route.fulfill({ json: body ?? { ok: false } });
    }
    if (url.pathname === "/api/backend/admin/funnel-events") {
      calls.push(url);
      return route.fulfill({
        json: {
          ok: true,
          events: [],
          pagination: {
            page: 1,
            pages: 1,
            total: 0,
            hasPrevious: false,
            hasNext: false,
          },
        },
      });
    }
    return route.fulfill({ json: { ok: true } });
  });
  return calls;
}
async function openDashboard(page: Page) {
  await page.getByRole("button", { name: "Dashboard", exact: true }).click();
}
const analyticsCalls = (calls: URL[], name: string) =>
  calls.filter((c) => c.pathname.endsWith(`/analytics/${name}`));

for (const viewport of [
  { name: "desktop", width: 1440, height: 1000 },
  { name: "mobile", width: 390, height: 844 },
]) {
  test(`dashboard opens from the visible entry and fits the ${viewport.name} screen`, async ({
    page,
  }) => {
    await page.setViewportSize({
      width: viewport.width,
      height: viewport.height,
    });
    const calls = await install(page);
    await page.goto("/admin");
    await expect(
      page.getByRole("heading", { name: "Funnel Events", exact: true }),
    ).toBeVisible();
    const rawEventCalls = () =>
      calls.filter((c) => c.pathname.endsWith("/funnel-events")).length;
    await expect.poll(rawEventCalls).toBe(1); // only the initial events view
    await openDashboard(page);
    await expect(
      page.getByRole("heading", { name: "Dashboard", exact: true }),
    ).toBeVisible();
    for (const q of [
      "Quante persone studiano davvero?",
      "Quali certificazioni?",
      "Dove smettono di avanzare?",
    ])
      await expect(page.getByText(q)).toBeVisible();
    // Quick answers use the verified numbers and keep the caveats.
    await expect(
      page.getByRole("region", { name: "Quante persone studiano davvero" }),
    ).toContainText("240");
    await expect(
      page.getByRole("region", { name: "Quante persone studiano davvero" }),
    ).toContainText("minimo verificabile");
    await expect(
      page.getByRole("region", { name: "Dove smettono di avanzare" }),
    ).toContainText("non ha un evento successivo");
    await expect(
      page.getByRole("region", { name: "Dove smettono di avanzare" }),
    ).toContainText("Evento mancante ≠ abbandono dimostrato");
    await expect(
      page.getByRole("region", {
        name: "Quali certificazioni generano interesse",
      }),
    ).toContainText("CCNA");
    // KPI cards: an unavailable value is "Non disponibile", never 0.
    const d28 = page.locator('[data-metric="study_return_d28"]');
    await expect(d28).toContainText("Non disponibile");
    await expect(d28).not.toContainText(/^0$/);
    await expect(page.locator('[data-metric="trials_started"]')).toContainText(
      "solo dal 27/10/2026",
    );
    await expect(
      page.locator('[data-metric="verified_revenue"]'),
    ).toContainText("Fonti separate, mai sommate");
    // Funnel with all stages, caveat on missing events and on the unattributable population.
    await page.getByRole("link", { name: "Funnel", exact: true }).click();
    for (const s of [
      "Caricamento quiz",
      "Interazione reale",
      "Risultato",
      "Paywall",
      "Click commerciale",
      "Checkout creato",
      "Pagamento verificato",
    ])
      await expect(
        page.locator("[data-stage]").filter({ hasText: s }).first(),
      ).toBeVisible();
    await expect(page.getByText("Popolazione non attribuibile")).toContainText(
      "Il pagamento è collegato solo allo stesso account",
    );
    await expect(page.getByText("Popolazione non attribuibile")).toContainText(
      "non confrontabile direttamente con la quota",
    );
    await expect(
      page.locator('[data-metric="unattributed_events"]'),
    ).toContainText("esclusi eventi tecnici PWA e anteprime");
    // No horizontal scroll of the page itself.
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    );
    expect(overflow).toBeLessThanOrEqual(1);
    // The bulk of the work is server-side: one call per section, no raw events downloaded.
    expect(analyticsCalls(calls, "overview")).toHaveLength(1);
    expect(rawEventCalls()).toBe(1); // the dashboard downloads no raw events
    // Privacy: nothing that looks like an email or a Stripe identifier is rendered by the dashboard.
    const text = await page.locator("main main").innerText();
    expect(text).not.toMatch(
      /@example\.test|cs_live|cs_test|pi_|sk_live|sk_test/,
    );
    if (SHOTS) {
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.screenshot({
        path: `${SHOTS}/dashboard-${viewport.name}-top.png`,
        fullPage: false,
      });
      await page.screenshot({
        path: `${SHOTS}/dashboard-${viewport.name}-full.png`,
        fullPage: true,
      });
    }
  });
}

test("filters change the request, invalid custom ranges never reach the API, unavailable filters stay disabled", async ({
  page,
}) => {
  const calls = await install(page);
  await page.goto("/admin");
  await openDashboard(page);
  await expect(page.locator('[data-metric="new_questions"]')).toBeVisible();
  expect(
    new URL(analyticsCalls(calls, "overview")[0].href).searchParams.get(
      "range",
    ),
  ).toBe("28d");
  await page
    .getByRole("combobox", { name: "Periodo", exact: true })
    .selectOption("7d");
  await expect.poll(() => analyticsCalls(calls, "overview").length).toBe(2);
  expect(analyticsCalls(calls, "overview")[1].searchParams.get("range")).toBe(
    "7d",
  );
  await page
    .getByRole("combobox", { name: "Certificazione", exact: true })
    .selectOption("ccna");
  await expect.poll(() => analyticsCalls(calls, "overview").length).toBe(3);
  expect(analyticsCalls(calls, "overview")[2].searchParams.get("cert")).toBe(
    "ccna",
  );
  await page
    .getByRole("combobox", { name: "Lingua", exact: true })
    .selectOption("it");
  await page
    .getByRole("combobox", { name: "Utente", exact: true })
    .selectOption("authenticated");
  await page
    .getByRole("combobox", { name: "Modalità quiz", exact: true })
    .selectOption("training");
  await expect.poll(() => analyticsCalls(calls, "overview").length).toBe(6);
  const last = analyticsCalls(calls, "overview")[5].searchParams;
  expect([last.get("lang"), last.get("auth"), last.get("mode")]).toEqual([
    "it",
    "authenticated",
    "training",
  ]);
  const before = analyticsCalls(calls, "overview").length;
  await page
    .getByRole("combobox", { name: "Periodo", exact: true })
    .selectOption("custom");
  await page.getByLabel("Dal", { exact: true }).fill("2026-10-20");
  await page.getByLabel("Al", { exact: true }).fill("2026-10-10");
  await expect(
    page.getByRole("alert").filter({ hasText: "successiva" }),
  ).toBeVisible();
  await page.waitForTimeout(400);
  expect(analyticsCalls(calls, "overview").length).toBe(before);
  await page.getByLabel("Al", { exact: true }).fill("2026-10-28");
  await expect
    .poll(() => analyticsCalls(calls, "overview").length)
    .toBe(before + 1);
  const custom = analyticsCalls(calls, "overview")[before].searchParams;
  expect([custom.get("range"), custom.get("from"), custom.get("to")]).toEqual([
    "custom",
    "2026-10-20",
    "2026-10-28",
  ]);
  await expect(
    page.getByRole("combobox", { name: "Paese", exact: true }),
  ).toBeDisabled();
  await expect(
    page.getByRole("combobox", { name: "Dispositivo", exact: true }),
  ).toBeDisabled();
});

test("certifications table: all catalog rows, sortable, unavailable vs zero, detail with timeline", async ({
  page,
}) => {
  const calls = await install(page);
  await page.goto("/admin");
  await openDashboard(page);
  const table = page.getByRole("table").first();
  const names = () => table.locator("tbody th button").allInnerTexts();
  await expect.poll(async () => (await names()).length).toBe(6);
  expect((await names())[0]).toBe("CCNA"); // default: nuove domande desc
  await table.getByRole("button", { name: "Click commerciali" }).click();
  await expect(table.locator("th[aria-sort='descending']")).toHaveCount(1);
  await table
    .getByRole("button", { name: "Certificazione", exact: true })
    .click();
  expect((await names())[0]).toBe("CCNA");
  await table
    .getByRole("button", { name: "Certificazione", exact: true })
    .click();
  expect((await names())[0]).toBe("SAP Analytics Cloud");
  await expect(
    table.locator("tbody tr").filter({ hasText: "Microsoft C#" }),
  ).toContainText("—");
  await expect(
    table.locator("tbody tr").filter({ hasText: "SAP Analytics Cloud" }),
  ).toContainText("nessun segnale");
  await expect(
    table
      .locator("tbody tr")
      .filter({ hasText: "CCNA" })
      .first()
      .locator("td")
      .nth(7),
  ).toHaveText("4");
  await page.getByLabel("Cerca certificazione").fill("isc2");
  await expect.poll(async () => (await names()).length).toBe(1);
  await page.getByLabel("Cerca certificazione").fill("");
  await table.getByRole("button", { name: "CCNA", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: /Dettaglio · CCNA/ }),
  ).toBeVisible();
  await expect
    .poll(
      () =>
        calls.filter((c) =>
          c.pathname.endsWith("/analytics/certifications/ccna"),
        ).length,
    )
    .toBe(1);
});

test("a failing section shows its own error with retry and leaves the others working; 404 explains the backend dependency", async ({
  page,
}) => {
  const calls = await install(page, {
    status: { retention: 500, revenue: 404 },
  });
  await page.goto("/admin");
  await openDashboard(page);
  await expect(page.locator('[data-metric="new_questions"]')).toBeVisible();
  const ritorno = page.locator("#ritorno");
  await expect(ritorno.getByRole("alert")).toContainText(
    "Impossibile caricare questa sezione",
  );
  await expect(page.locator("#ricavi").getByRole("alert")).toContainText(
    "backend con le API analytics non è ancora rilasciato",
  );
  await expect(page.locator("main main")).not.toContainText(
    /SENSITIVE|sk_live_leak/,
  );
  await ritorno.getByRole("button", { name: "Riprova" }).click();
  await expect.poll(() => analyticsCalls(calls, "retention").length).toBe(2);
});

test("Funnel Events stays the initial view; the dashboard entry is visible and loads nothing until opened", async ({
  page,
}) => {
  const calls = await install(page);
  await page.goto("/admin");
  await expect(
    page.getByRole("heading", { name: "Funnel Events", exact: true }),
  ).toBeVisible();
  const entry = page.getByRole("button", { name: "Dashboard", exact: true });
  await expect(entry).toBeVisible();
  expect(
    await entry.evaluate((el) => el.getBoundingClientRect().top),
  ).toBeLessThan(500);
  expect(calls.filter((c) => c.pathname.includes("/analytics/"))).toHaveLength(
    0,
  );
  await entry.click();
  await expect(
    page.getByRole("heading", { name: "Dashboard", exact: true }),
  ).toBeVisible();
  await expect
    .poll(
      () =>
        calls.filter((c) => c.pathname.endsWith("/analytics/overview")).length,
    )
    .toBe(1);
});

test("non-admin never reaches the analytics API; events stay one click away", async ({
  page,
}) => {
  const denied = await install(page, { role: "user" });
  await page.goto("/admin");
  await expect(
    page.getByRole("heading", { name: "Accesso negato" }),
  ).toBeVisible();
  expect(denied).toHaveLength(0);
});

test("raw events view remains reachable from the dashboard and back", async ({
  page,
}) => {
  await install(page);
  await page.goto("/admin");
  await openDashboard(page);
  await page
    .getByRole("button", { name: "Apri Funnel Events (dettaglio grezzo)" })
    .click();
  await expect(
    page.getByRole("heading", { name: "Funnel Events", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Dashboard", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Dashboard", exact: true }),
  ).toBeVisible();
});

test("every metric exposes its definition, source, denominator and limits", async ({
  page,
}) => {
  await install(page);
  await page.goto("/admin");
  await openDashboard(page);
  const card = page.locator('[data-metric="click_after_paywall"]');
  await card.getByText("Definizione e limiti").click();
  await expect(card).toContainText("Fonte");
  await expect(card).toContainText("Limiti di affidabilità");
  await expect(card).toContainText("su 129 identità con paywall");
  await expect(card).toContainText("Tracciato da 15/05/2026");
});
