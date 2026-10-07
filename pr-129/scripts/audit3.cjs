const { chromium } = require('C:/Users/loren/Documents/CertifyQuiz/.worktrees/home-positioning-129/node_modules/playwright');
const path = require('path');
const BASE = process.env.BASE || 'https://certifyquiz-next-git-feat-hom-99b755-lorenzos-projects-2b528eca.vercel.app';
const OUT = path.join(__dirname, process.env.OUTDIR || 'shots');
const LANGS = (process.env.LANGS || 'en,it,fr,es').split(',');
const P = { en: '/', it: '/it', fr: '/fr', es: '/es' };
const CATALOG = { en: '/en/certifications', it: '/it/certifications', fr: '/fr/certifications', es: '/es/certifications' };
const log = (...a) => console.log(...a);
const hasOverflow = p => p.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
(async () => {
  const browser = await chromium.launch();
  for (const lang of LANGS) {
    log('\n===== DESKTOP', lang);
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: lang === 'en' ? 'en-US' : lang });
    const page = await ctx.newPage();
    await page.goto(BASE + P[lang], { waitUntil: 'load', timeout: 60000 }); await page.waitForTimeout(1500);
    await page.waitForTimeout(1000);
    const nav = page.locator('nav[aria-label]').filter({ has: page.locator('button[data-group]') });
    const gbtns = page.locator('button[data-group]');
    log('group buttons:', await gbtns.allTextContents());
    // open practice
    const practice = page.locator('button[data-group=practice]');
    await practice.click();
    log('practice expanded:', await practice.getAttribute('aria-expanded'));
    const panel = page.locator('#desktop-practice');
    log('panel links:', JSON.stringify(await panel.locator('a').evaluateAll(as => as.map(a => a.textContent.trim() + ' -> ' + a.getAttribute('href')))));
    await page.screenshot({ path: path.join(OUT, `desktop-menu-practice-${lang}-1440.png`), clip: { x: 0, y: 0, width: 1440, height: 420 } });
    // Tab into panel
    await page.keyboard.press('Tab');
    log('after Tab focus:', await page.evaluate(() => document.activeElement.tagName + ':' + document.activeElement.textContent.trim().slice(0, 25)), 'panel still open:', await practice.getAttribute('aria-expanded'));
    // Escape -> focus back to button
    await page.keyboard.press('Escape');
    log('after Escape expanded:', await practice.getAttribute('aria-expanded'), 'focus on button:', await page.evaluate(() => document.activeElement.getAttribute('data-group')));
    // reopen, click outside
    await practice.click(); await page.mouse.click(700, 600);
    log('after outside click expanded:', await practice.getAttribute('aria-expanded'));
    // reopen, Tab out of the nav entirely
    await practice.click();
    for (let i = 0; i < 12; i++) await page.keyboard.press('Tab');
    log('after 12 tabs expanded:', await practice.getAttribute('aria-expanded'), 'active:', await page.evaluate(() => document.activeElement.tagName + ':' + document.activeElement.textContent.trim().slice(0, 20)));
    // Opening another group closes first
    await page.locator('button[data-group=learn]').click(); await page.locator('button[data-group=explore]').click();
    log('learn/explore:', await page.locator('button[data-group=learn]').getAttribute('aria-expanded'), await page.locator('button[data-group=explore]').getAttribute('aria-expanded'));
    await page.keyboard.press('Escape');
    // Link in group navigates
    await practice.click();
    const first = panel.locator('a').first(); const fh = await first.getAttribute('href');
    await Promise.all([page.waitForURL(u => u.pathname !== new URL(BASE + P[lang]).pathname, { timeout: 20000 }).catch(() => log('NO NAV')), first.click()]);
    log('first practice link', fh, '->', page.url());
    log('menu present on dest:', await page.locator('button[data-group]').count(), 'overflow:', await hasOverflow(page));
    // Tools section on home
    await page.goto(BASE + P[lang], { waitUntil: 'load' }); await page.waitForTimeout(1500);
    const cards = page.locator('section ul').first().locator('a');
    log('4 cards:', JSON.stringify(await cards.evaluateAll(as => as.map(a => a.textContent.trim().slice(0, 60) + ' -> ' + a.getAttribute('href')))));
    const det = page.locator('details').first();
    await det.locator('summary').click();
    log('details open:', await det.evaluate(d => d.open), 'extra links:', await det.locator('a').count());
    await det.scrollIntoViewIfNeeded();
    await page.screenshot({ path: path.join(OUT, `tools-expanded-${lang}-1440.png`) });
    // click each card's destination status
    const hrefs = await cards.evaluateAll(as => as.map(a => a.getAttribute('href')));
    for (const h of hrefs) {
      const r = await page.request.get(new URL(h, BASE).toString(), { maxRedirects: 5 });
      log('  card', h, r.status());
    }
    // catalog & cert landing
    await page.goto(BASE + CATALOG[lang], { waitUntil: 'load' }); await page.waitForTimeout(1500);
    log('catalog url', page.url(), 'groups:', await page.locator('button[data-group]').count(), 'overflow:', await hasOverflow(page));
    await page.screenshot({ path: path.join(OUT, `catalog-${lang}-1440.png`), clip: { x: 0, y: 0, width: 1440, height: 400 } });
    await page.goto(BASE + `/${lang}/certifications/ccna`, { waitUntil: 'load' }); await page.waitForTimeout(1500);
    log('cert landing url', page.url(), 'groups:', await page.locator('button[data-group]').count(), 'overflow:', await hasOverflow(page));
    await page.screenshot({ path: path.join(OUT, `cert-landing-${lang}-1440.png`), clip: { x: 0, y: 0, width: 1440, height: 500 } });
    await ctx.close();
  }
  await browser.close();
})();
