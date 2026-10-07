const { chromium } = require('C:/Users/loren/Documents/CertifyQuiz/.worktrees/home-positioning-129/node_modules/playwright');
const path = require('path');
const BASE = process.env.BASE || 'https://certifyquiz-next-git-feat-hom-99b755-lorenzos-projects-2b528eca.vercel.app';
const OUT = path.join(__dirname, 'final');
const log = (...a) => console.log(...a);
const fire = page => page.evaluate(() => window.dispatchEvent(Object.assign(new Event('beforeinstallprompt', { cancelable: true }), { prompt: async () => {}, userChoice: Promise.resolve({ outcome: 'dismissed' }) })));
const vis = async (page, re) => (await page.locator('button', { hasText: re }).count()) > 0;
(async () => {
  const browser = await chromium.launch();
  for (const [name, locale, p, btnStay, btnInstall, btnReject] of [
    ['mismatch it/en', 'en-US', '/it', /^Stay here$|^Rimani qui$/, /^Installa$/, /^Rifiuta$/],
    ['match en/en', 'en-US', '/', null, /^Install$/, /^Reject$/],
  ]) {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 760 }, locale, hasTouch: true, isMobile: true });
    const page = await ctx.newPage();
    await page.goto(BASE + p, { waitUntil: 'load', timeout: 60000 });
    await page.waitForTimeout(1500);
    await fire(page);
    await page.waitForTimeout(6500);
    log(name, 'T+6.5s with cookie unknown -> install prompt visible?', await vis(page, btnInstall), '| lang banner?', await page.locator('[data-lang-suggestion]').count());
    await page.locator('button', { hasText: btnReject }).click();
    await page.waitForTimeout(2500);
    log(name, 'after reject -> lang banner:', await page.locator('[data-lang-suggestion]').count(), '| install visible?', await vis(page, btnInstall));
    if (btnStay) {
      await page.locator('[data-lang-suggestion] button', { hasText: btnStay }).click();
      await page.waitForTimeout(3500);
      log(name, 'after "stay" -> lang banner:', await page.locator('[data-lang-suggestion]').count(), '| install visible?', await vis(page, btnInstall));
    } else {
      await page.waitForTimeout(3000);
      log(name, 'install visible after waiting?', await vis(page, btnInstall));
    }
    await page.screenshot({ path: path.join(OUT, `sequence-${name.replace(/\W+/g, '-')}-390.png`) });
    await ctx.close();
  }
  await browser.close();
})();
