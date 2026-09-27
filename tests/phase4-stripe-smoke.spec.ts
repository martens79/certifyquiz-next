import { expect, test, type Page } from "@playwright/test";

const baseUrl = process.env.PHASE4_FRONTEND_URL || "http://localhost:3000";
const email = process.env.PHASE4_TEST_EMAIL;
const password = process.env.PHASE4_TEST_PASSWORD;

if (!email || !password) {
  throw new Error("PHASE4_TEST_EMAIL and PHASE4_TEST_PASSWORD are required");
}

test.setTimeout(240_000);

async function completeStripeCheckout(page: Page) {
  await page.waitForURL(/checkout\.stripe\.com/, { timeout: 60_000 });

  const agentDisclosure = page.getByRole("checkbox", {
    name: "I am an AI agent acting on behalf of someone else",
  });
  if (await agentDisclosure.count()) {
    await agentDisclosure.evaluate((element: HTMLInputElement) => element.click());
    await expect(agentDisclosure).toBeChecked();
  }

  const cardRadio = page.locator("#payment-method-accordion-item-title-card");
  await cardRadio.click({ force: true });
  await expect(cardRadio).toBeChecked();

  await expect(page.locator('input[name="cardNumber"]')).toBeVisible({ timeout: 60_000 });

  await page.locator('input[name="cardNumber"]').fill("4242424242424242");
  await page.locator('input[name="cardExpiry"]').fill("1234");
  await page.locator('input[name="cardCvc"]').fill("123");

  const billingName = page.locator('input[name="billingName"]');
  if (await billingName.count()) await billingName.fill("Phase 4 Smoke Test");

  const postalCode = page.locator('input[name="billingPostalCode"]');
  if (await postalCode.count()) await postalCode.fill("00100");

  await page.locator('button[type="submit"]').click();
  await page.waitForURL(new RegExp(`${baseUrl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}/it/packages/success`), {
    timeout: 90_000,
  });

  const orderId = new URL(page.url()).searchParams.get("order_id");
  expect(orderId).toBeTruthy();
  return orderId!;
}

async function waitForPaidOrder(page: Page, token: string, orderId: string) {
  await expect
    .poll(
      async () => {
        const response = await page.request.get(
          `${baseUrl}/api/backend/packages/orders/${encodeURIComponent(orderId)}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        if (!response.ok()) return `http:${response.status()}`;
        const body = await response.json();
        return body.order?.status;
      },
      { timeout: 60_000, intervals: [500, 1_000, 2_000] },
    )
    .toBe("paid");

  const response = await page.request.get(
    `${baseUrl}/api/backend/packages/orders/${encodeURIComponent(orderId)}`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return (await response.json()).order;
}

test("Phase 4 CCNA TEST purchase and renewal", async ({ page }) => {
  const login = await page.request.post(`${baseUrl}/api/backend/auth/login`, {
    data: { email, password, remember: false },
  });
  expect(login.ok()).toBeTruthy();
  const auth = await login.json();
  expect(auth.token).toBeTruthy();

  await page.addInitScript(
    ({ token, user }) => {
      localStorage.setItem("cq:access", token);
      localStorage.setItem("cq_user", JSON.stringify(user));
      localStorage.setItem("cq:cookie-consent", JSON.stringify({ accepted: false, ts: Date.now() }));
      localStorage.setItem("cookie-consent", "rejected");
    },
    { token: auth.token, user: auth.user },
  );

  await page.goto(`${baseUrl}/it/certificazioni/ccna`, { waitUntil: "networkidle" });
  const packages = page.locator("#packages");
  await expect(packages).toContainText("CCNA Complete");
  await expect(packages).toContainText("24,90");
  await expect(packages).toContainText("90 giorni");
  await packages.getByRole("button").click();

  const firstOrderId = await completeStripeCheckout(page);
  const firstOrder = await waitForPaidOrder(page, auth.token, firstOrderId);
  expect(firstOrder.total_minor).toBe(2490);
  expect(firstOrder.order_type).toBe("purchase");
  expect(firstOrder.certification_slug).toBe("ccna");
  expect(firstOrder.expires_at).toBeTruthy();

  await page.goto(`${baseUrl}/it/certificazioni/ccna`, { waitUntil: "networkidle" });
  await expect(packages).toContainText("Estendi l'accesso");
  await packages.getByRole("button").click();

  const secondOrderId = await completeStripeCheckout(page);
  const secondOrder = await waitForPaidOrder(page, auth.token, secondOrderId);
  expect(secondOrder.total_minor).toBe(2490);
  expect(secondOrder.certification_slug).toBe("ccna");
  expect(secondOrder.expires_at).toBeTruthy();
  expect(new Date(secondOrder.expires_at).getTime()).toBeGreaterThan(
    new Date(firstOrder.expires_at).getTime(),
  );

  console.log(
    `PHASE4_SMOKE_ORDERS=${JSON.stringify({ firstOrderId, secondOrderId, firstOrder, secondOrder })}`,
  );
});
