const { chromium } = require('C:/Users/loren/Documents/CertifyQuiz/.worktrees/home-positioning-129/node_modules/playwright');
const path = require('path');
const BASE = process.env.BASE || 'https://certifyquiz-next-git-feat-hom-99b755-lorenzos-projects-2b528eca.vercel.app';
const OUT = path.join(__dirname, process.env.OUTDIR || 'shots');
const LANGS = (process.env.LANGS || 'en,it,fr,es').split(',');
const WIDTH = Number(process.env.WIDTH || 390);
const P = { en: '/', it: '/it', fr: '/fr', es: '/es' };
const Q = { en: ['ccna', 'az-900', 'zzzqqq'], it: ['ccna', '200-301', 'zzzqqq'], fr: ['aws', 'sc-900', 'zzzqqq'], es: ['security', 'saa-c03', 'zzzqqq'] };
const log = (...a) => console.log(...a);
(async () => {
  const browser = await chromium.launch();
  for (const lang of LANGS) {
    log('\n===== MOBILE', lang, WIDTH);
    const ctx = await browser.newContext({ viewport: { width: WIDTH, height: 812 }, locale: lang === 'en' ? 'en-US' : lang, hasTouch: true, isMobile: true });
    const page = await ctx.newPage();
    await page.goto(BASE + P[lang], { waitUntil: 'load', timeout: 60000 });
    await page.waitForTimeout(1200);
    const overlays = await page.evaluate(() => {
      const out = [];
      document.querySelectorAll('body *').forEach(el => {
        const cs = getComputedStyle(el);
        if (cs.position === 'fixed' && cs.display !== 'none' && cs.visibility !== 'hidden') {
          const r = el.getBoundingClientRect();
          if (r.width > 0 && r.height > 0) out.push({ tag: el.tagName, cls: String(el.className).slice(0, 50), txt: (el.textContent || '').trim().slice(0, 30), x: Math.round(r.left), y: Math.round(r.top), w: Math.round(r.width), h: Math.round(r.height), z: cs.zIndex });
        }
      });
      return out;
    });
    log('fixed overlays:', JSON.stringify(overlays));
    const inter = [];
    for (let i = 0; i < overlays.length; i++) for (let j = i + 1; j < overlays.length; j++) {
      const a = overlays[i], b = overlays[j];
      if (a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h) inter.push((a.txt || a.cls) + ' X ' + (b.txt || b.cls));
    }
    log('overlay intersections:', JSON.stringify(inter));
    const input = page.locator('input[role=combobox]').first();
    log('finder visible:', await input.isVisible());
    for (const q of Q[lang]) {
      await input.fill('');
      await input.fill(q);
      await page.waitForTimeout(250);
      const opts = await page.locator('[role=option]').allTextContents();
      const status = await page.locator('[role=status]').first().textContent();
      log('finder "' + q + '": options=' + opts.length + ' first=' + JSON.stringify(opts.slice(0, 3)) + ' status=' + JSON.stringify(status));
      if (q === Q[lang][0]) await page.screenshot({ path: path.join(OUT, `finder-results-${lang}-${WIDTH}.png`) });
      if (q === 'zzzqqq') await page.screenshot({ path: path.join(OUT, `finder-noresult-${lang}-${WIDTH}.png`) });
    }
    await input.fill(Q[lang][0]); await page.waitForTimeout(200);
    await input.press('ArrowDown'); await input.press('ArrowDown');
    const act = await input.getAttribute('aria-activedescendant');
    log('activedescendant after 2xDown:', !!act, 'selected:', JSON.stringify(await page.locator('[role=option][aria-selected=true]').allTextContents()));
    await input.press('Escape'); log('after Escape value=', JSON.stringify(await input.inputValue()));
    await input.fill(Q[lang][0]); await page.waitForTimeout(200);
    const startPath = new URL(BASE + P[lang]).pathname;
    await Promise.all([page.waitForURL(u => u.pathname !== startPath, { timeout: 20000 }).catch(() => log('NO NAV after Enter')), input.press('Enter')]);
    log('Enter navigated to:', page.url());
    await page.goto(BASE + P[lang], { waitUntil: 'load' });
    await page.waitForTimeout(800);
    const reject = page.locator('button', { hasText: /^(Reject|Rifiuta|Refuser|Rechazar)$/ });
    const accept = page.locator('button', { hasText: /^(Accept|Accetta|Accepter|Aceptar)$/ });
    log('cookie buttons visible:', await reject.isVisible(), await accept.isVisible());
    for (const [n, loc] of [['reject', reject], ['accept', accept]]) {
      const b = await loc.boundingBox();
      const hit = b ? await page.evaluate(([x, y]) => { const e = document.elementFromPoint(x, y); return e ? e.tagName + ':' + (e.textContent || '').trim().slice(0, 15) : null; }, [b.x + b.width / 2, b.y + b.height / 2]) : null;
      log('cookie', n, 'box', b && [Math.round(b.x), Math.round(b.y), Math.round(b.width), Math.round(b.height)], 'hit:', hit);
    }
    const menuBtn = page.locator('button[aria-controls=mobile-drawer]');
    await menuBtn.click(); await page.waitForTimeout(400);
    log('menu open: expanded=', await menuBtn.getAttribute('aria-expanded'));
    await page.screenshot({ path: path.join(OUT, `menu-open-${lang}-${WIDTH}.png`) });
    const links = await page.locator('#mobile-drawer a').evaluateAll(as => as.map(a => a.textContent.trim() + ' -> ' + a.getAttribute('href')));
    log('drawer links:', JSON.stringify(links));
    const heads = await page.locator('#mobile-drawer p').allTextContents(); log('drawer groups:', JSON.stringify(heads));
    const lastLink = page.locator('#mobile-drawer a').last();
    await lastLink.scrollIntoViewIfNeeded(); await page.waitForTimeout(300);
    const lb = await lastLink.boundingBox();
    const hit = await page.evaluate(([x, y]) => { const e = document.elementFromPoint(x, y); return e ? e.tagName + ':' + (e.textContent || '').trim().slice(0, 20) : null; }, [lb.x + lb.width / 2, lb.y + lb.height / 2]);
    log('last drawer link y=', Math.round(lb.y), 'h=', Math.round(lb.height), 'hit:', hit, 'vh=812');
    await page.screenshot({ path: path.join(OUT, `menu-scrolled-${lang}-${WIDTH}.png`) });
    await page.keyboard.press('Escape'); await page.waitForTimeout(300);
    log('after Escape expanded=', await menuBtn.getAttribute('aria-expanded'), 'activeElement=', await page.evaluate(() => document.activeElement?.getAttribute('aria-controls') || document.activeElement?.tagName));
    log('drawer inert when closed:', await page.locator('#mobile-drawer').evaluate(e => e.inert));
    await menuBtn.click(); await page.waitForTimeout(300);
    const target = page.locator('#mobile-drawer a').nth(3);
    const th = await target.getAttribute('href');
    await Promise.all([page.waitForURL(u => u.pathname !== startPath, { timeout: 20000 }).catch(() => log('NO NAV drawer link')), target.click()]);
    log('drawer link', th, '->', page.url(), 'drawer expanded after nav:', await menuBtn.getAttribute('aria-expanded'));
    await ctx.close();
  }
  await browser.close();
})();
