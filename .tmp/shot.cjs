const { chromium, devices } = require('@playwright/test');
(async () => {
  const b = await chromium.launch({ channel: 'chrome' });
  for (const [name, ctxOpts] of [['desktop', { viewport: { width: 1280, height: 900 } }], ['mobile', { ...devices['Pixel 7'] }]]) {
    const ctx = await b.newContext({ ...ctxOpts, serviceWorkers: 'block' });
    const page = await ctx.newPage();
    await page.addInitScript(() => { localStorage.setItem('cq_cookie_consent', JSON.stringify({ accepted: false })); localStorage.setItem('lang_banner_dismissed', '1'); });
    await page.route('**/*', async (r) => { const u = new URL(r.request().url()); if (u.hostname !== '127.0.0.1' && u.hostname !== 'localhost') return r.abort(); if (u.pathname.startsWith('/api/backend/')) return r.fulfill({ status: 404, json: {} }); return r.continue(); });
    await page.goto('http://127.0.0.1:3460/it/certificazioni/eipass-standard'); await page.waitForLoadState('networkidle');
    const sec = page.locator('#eipass-standard-modules').locator('..');
    await sec.scrollIntoViewIfNeeded();
    await sec.screenshot({ path: `.tmp/shots/${name}-moduli.png` });
    await page.screenshot({ path: `.tmp/shots/${name}-landing-top.png` });
    await page.goto('http://127.0.0.1:3460/it/certificazioni'); await page.waitForLoadState('networkidle');
    const card = page.locator('a[href="/it/certificazioni/eipass-standard"]').first();
    await card.scrollIntoViewIfNeeded();
    await card.screenshot({ path: `.tmp/shots/${name}-catalogo-card.png` });
    await ctx.close();
  }
  await b.close();
})().catch((e) => { console.error(e); process.exit(1); });
