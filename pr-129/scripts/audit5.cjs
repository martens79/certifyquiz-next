const { chromium } = require('C:/Users/loren/Documents/CertifyQuiz/.worktrees/home-positioning-129/node_modules/playwright');
const BASE = process.env.BASE || 'https://certifyquiz-next-git-feat-hom-99b755-lorenzos-projects-2b528eca.vercel.app';
const P = { en: '/', it: '/it', fr: '/fr', es: '/es' };
const log = (...a) => console.log(...a);
(async () => {
  const browser = await chromium.launch();
  for (const lang of ['en', 'it', 'fr', 'es']) {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: lang === 'en' ? 'en-US' : lang });
    const page = await ctx.newPage();
    await page.goto(BASE + P[lang], { waitUntil: 'load', timeout: 60000 });
    await page.waitForTimeout(1500);
    const cards = await page.locator('section[aria-label] > div > ul').first().locator('a').evaluateAll(as => as.map(a => a.querySelector('span:not([aria-hidden]) > span')?.textContent + ' -> ' + a.getAttribute('href')));
    log('==', lang, 'primary cards:', JSON.stringify(cards));
    for (const c of cards) {
      const h = c.split(' -> ')[1];
      const r = await page.request.get(new URL(h, BASE).toString());
      log('   ', h, r.status(), r.url().replace(BASE, ''));
    }
    const det = page.locator('details').first();
    log('   details closed initially:', !(await det.evaluate(d => d.open)));
    await ctx.close();
  }
  await browser.close();
})();
