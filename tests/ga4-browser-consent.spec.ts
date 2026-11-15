import { test, expect } from "@playwright/test";

const gaId = "G-TESTCONSENT";
const denied = { analytics_storage: "denied", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" };

test.describe("GA4 browser consent (isolated, no Google network)", () => {
  for (const scenario of [
    { name: "no stored choice", stored: null, expected: "denied" },
    { name: "stored rejection", stored: false, expected: "denied" },
    { name: "stored acceptance", stored: true, expected: "granted" },
  ] as const) {
    test(scenario.name, async ({ page }) => {
      const googleRequests: string[] = [];
      await page.route(/(googletagmanager\.com|google-analytics\.com)/, async route => {
        googleRequests.push(route.request().url());
        if (route.request().url().includes("/gtag/js")) {
          await route.fulfill({ status: 200, contentType: "application/javascript", body: "/* isolated Google stub */" });
        } else {
          await route.fulfill({ status: 204, body: "" });
        }
      });
      await page.addInitScript(({ stored }) => {
        localStorage.clear();
        sessionStorage.clear();
        if (stored !== null) {
          localStorage.setItem("cq_cookie_consent", JSON.stringify({ accepted: stored, ts: Date.now() }));
        }
      }, { stored: scenario.stored });
      await page.goto("/", { waitUntil: "domcontentloaded" });
      await expect.poll(async () => page.evaluate(() => Array.isArray((window as any).dataLayer))).toBe(true);
      await expect.poll(async () => page.evaluate(() => ((window as any).dataLayer as IArguments[]).some(a => a[0] === "consent" && a[1] === "default"))).toBe(true);
      const calls = await page.evaluate(() => Array.from((window as any).dataLayer as IArguments[], a => Array.from(a)));
      const defaults = calls.find(a => a[0] === "consent" && a[1] === "default")?.[2] as Record<string, string>;
      for (const [key, value] of Object.entries(denied)) expect(defaults[key]).toBe(value);
      await expect.poll(async () => page.evaluate(() => {
        const updates = Array.from((window as any).dataLayer as IArguments[], a => Array.from(a)).filter(a => a[0] === "consent" && a[1] === "update");
        return (updates.at(-1)?.[2] as any)?.analytics_storage;
      })).toBe(scenario.expected);
      const latest = await page.evaluate(() => {
        const updates = Array.from((window as any).dataLayer as IArguments[], a => Array.from(a)).filter(a => a[0] === "consent" && a[1] === "update");
        return updates.at(-1)?.[2] as Record<string, string>;
      });
      for (const key of ["ad_storage", "ad_user_data", "ad_personalization"]) expect(latest[key]).toBe("denied");
      expect(googleRequests.some(url => url.includes("/gtag/js"))).toBe(true);
      expect(googleRequests.every(url => !url.includes("facebook") && !url.includes("doubleclick"))).toBe(true);
      const cookies = await page.context().cookies();
      expect(cookies.filter(c => /^_ga|^_gcl/.test(c.name))).toHaveLength(0);
    });
  }
});
