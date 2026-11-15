// Click nell'istante esatto in cui il pulsante dell'annuale entra nel DOM (MutationObserver), poi attende l'idratazione.
// Uso: node scripts/early-click-probe.cjs <baseUrl> <path> <label> <cpuRate> <net> <mobile> <trials> [jsDelayMs]
const { chromium, devices } = require("@playwright/test");
const [baseUrl, pagePath, label, cpuRateArg, net, mobileArg, trialsArg, jsDelayArg] = process.argv.slice(2);
const cpuRate = Number(cpuRateArg || 1), trials = Number(trialsArg || 3), jsDelay = Number(jsDelayArg || 0);
const NET = {
  none: null,
  slow4g: { offline: false, latency: 150, downloadThroughput: (1.6 * 1024 * 1024) / 8, uploadThroughput: (750 * 1024) / 8 },
  fast3g: { offline: false, latency: 300, downloadThroughput: (1.4 * 1024 * 1024) / 16, uploadThroughput: (750 * 1024) / 16 },
};
(async () => {
  const browser = await chromium.launch();
  const out = [];
  for (let i = 0; i < trials; i++) {
    const ctx = await browser.newContext(mobileArg === "1" ? { ...devices["Pixel 7"] } : { viewport: { width: 1280, height: 720 } });
    const page = await ctx.newPage();
    await page.addInitScript(() => {
      try { localStorage.setItem("cq_cookie_consent", JSON.stringify({ accepted: true })); } catch {}
      const find = () => [...document.querySelectorAll("button[aria-pressed]")].find((b) => /59[.,]90/.test(b.innerText));
      const hyd = (b) => Object.keys(b).some((k) => k.startsWith("__reactProps"));
      new MutationObserver(() => {
        const b = find();
        if (b && window.__early === undefined) {
          window.__early = { t: Math.round(performance.now()), hydratedAtClick: hyd(b) };
          b.click();
        }
      }).observe(document, { childList: true, subtree: true });
      const poll = setInterval(() => {
        const b = find();
        if (b && hyd(b) && window.__hydratedAt === undefined) { window.__hydratedAt = Math.round(performance.now()); clearInterval(poll); }
      }, 20);
    });
    await page.route("**/api/backend/**", (r) => {
      const p = new URL(r.request().url()).pathname;
      return r.fulfill({ status: p.endsWith("/auth/me") || p.endsWith("/auth/refresh") ? 401 : 200, contentType: "application/json", body: "{}" });
    });
    await page.route(/https:\/\/(www\.googletagmanager|connect\.facebook|www\.google-analytics|challenges\.cloudflare)/, (r) => r.abort());
    if (jsDelay > 0) {
      await page.route("**/_next/static/chunks/**", async (r) => { await new Promise((res) => setTimeout(res, jsDelay)); await r.continue(); });
    }
    const cdp = await ctx.newCDPSession(page);
    if (cpuRate > 1) await cdp.send("Emulation.setCPUThrottlingRate", { rate: cpuRate });
    if (NET[net]) { await cdp.send("Network.enable"); await cdp.send("Network.emulateNetworkConditions", NET[net]); }
    await page.goto(baseUrl + pagePath, { waitUntil: "commit", timeout: 120000 });
    await page.waitForFunction(() => window.__hydratedAt !== undefined, null, { timeout: 120000, polling: 100 }).catch(() => {});
    await page.waitForTimeout(2500);
    const r = await page.evaluate(() => ({
      early: window.__early, hydratedAt: window.__hydratedAt,
      pressed: [...document.querySelectorAll("button[aria-pressed]")].find((b) => /59[.,]90/.test(b.innerText))?.getAttribute("aria-pressed"),
    }));
    out.push({ label, trial: i + 1, clickAtMs: r.early && r.early.t, clickWasBeforeHydration: r.early && !r.early.hydratedAtClick, hydratedAtMs: r.hydratedAt, effectApplied: r.pressed === "true" });
    await ctx.close();
  }
  console.log(JSON.stringify(out));
  await browser.close();
})().catch((e) => { console.error("ERR", e.message); process.exit(1); });
