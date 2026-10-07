const { chromium } = require('C:/Users/loren/Documents/CertifyQuiz/.worktrees/notices-drawer-fix/node_modules/playwright');
const path = require('path');
const fs = require('fs');
const BASE = process.env.BASE;
const LABEL = process.env.LABEL || 'run';
const OUT = path.join(__dirname, LABEL);
fs.mkdirSync(OUT, { recursive: true });
const WIDTHS = (process.env.WIDTHS || '375,390').split(',').map(Number);
const CASES = [['en', 'it-IT', '/', /^Reject$/, /^Stay here$/], ['it', 'en-US', '/it', /^Rifiuta$/, /^Rimani qui$/], ['fr', 'es-ES', '/fr', /^Refuser$/, /^Rester ici$/], ['es', 'fr-FR', '/es', /^Rechazar$/, /^Quedarme aquí$/]];
const STAY = { en: /^Stay here$/, it: /^Rimani qui$/, fr: /^Rester ici$/, es: /^Quedarme aquí$/ };
const log = (...a) => console.log(...a);

// is the assistant button actually the topmost element at its centre (= usable)?
const assistant = page => page.evaluate(() => {
  const b = document.querySelector('.cq-chat-btn');
  if (!b) return { present: false };
  const r = b.getBoundingClientRect(); const cs = getComputedStyle(b);
  const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
  const top = document.elementFromPoint(cx, cy);
  return { present: true, visibility: cs.visibility, opacity: cs.opacity, box: [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)], usable: cs.visibility !== 'hidden' && cs.opacity !== '0' && (top === b || b.contains(top)), cover: top && top !== b ? ((top.closest('[data-cq-notice]') ? 'notice' : top.tagName)) : null };
});
const overflowX = page => page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
const navBox = page => page.evaluate(() => { const n = [...document.querySelectorAll('nav')].find(n => getComputedStyle(n).position === 'fixed'); if (!n) return null; const r = n.getBoundingClientRect(); return [Math.round(r.top), Math.round(r.height)]; });

(async () => {
  const browser = await chromium.launch();
  for (const w of WIDTHS) for (const [lang, locale, p, reject, _s] of CASES) {
    const tag = `${lang}-${w}`;
    log(`\n=== ${LABEL} ${tag}`);
    // ---------- A: notices + assistant ----------
    let ctx = await browser.newContext({ viewport: { width: w, height: 760 }, locale, hasTouch: true, isMobile: true });
    let page = await ctx.newPage();
    await page.goto(BASE + p, { waitUntil: 'load', timeout: 60000 });
    await page.waitForTimeout(2000);
    await page.mouse.wheel(0, 900); await page.waitForTimeout(900);
    log('A1 cookie banner shown      assistant:', JSON.stringify(await assistant(page)));
    await page.screenshot({ path: path.join(OUT, `notice-cookie-${tag}.png`) });
    await page.locator('button', { hasText: reject }).click(); await page.waitForTimeout(800);
    log('A2 language hint shown      assistant:', JSON.stringify(await assistant(page)), 'hint:', await page.locator('[data-lang-suggestion]').count());
    await page.screenshot({ path: path.join(OUT, `notice-lang-${tag}.png`) });
    await page.locator('[data-lang-suggestion] button', { hasText: /^(Stay here|Rimani qui|Rester ici|Quedarme aquí)$/ }).click(); await page.waitForTimeout(800);
    const a3 = await assistant(page);
    log('A3 notices closed           assistant:', JSON.stringify(a3));
    await page.locator('.cq-chat-btn').click({ timeout: 5000 }).catch(e => log('  CLICK FAILED', e.message.split('\n')[0]));
    await page.waitForTimeout(600);
    const win = await page.evaluate(() => { const e = document.querySelector('.cq-chat-window'); if (!e) return null; const r = e.getBoundingClientRect(); return { vis: getComputedStyle(e).visibility, box: [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)] }; });
    log('A4 assistant opened         window:', JSON.stringify(win), 'overflowX:', await overflowX(page), 'nav:', JSON.stringify(await navBox(page)));
    await page.screenshot({ path: path.join(OUT, `assistant-open-${tag}.png`) });
    await page.locator('.cq-chat-btn').click(); await page.waitForTimeout(400);
    log('A5 assistant closed again   window present:', await page.locator('.cq-chat-window').count(), 'assistant:', JSON.stringify(await assistant(page)));
    await ctx.close();

    // ---------- B: drawer, cookie banner present ----------
    ctx = await browser.newContext({ viewport: { width: w, height: 760 }, locale, hasTouch: true, isMobile: true });
    page = await ctx.newPage();
    await page.goto(BASE + p, { waitUntil: 'load', timeout: 60000 });
    await page.waitForTimeout(2000);
    await page.mouse.wheel(0, 500); await page.waitForTimeout(500);
    const scrollBefore = await page.evaluate(() => window.scrollY);
    const btn = page.locator('button[aria-controls=mobile-drawer]');
    await btn.click(); await page.waitForTimeout(500);
    const hdr = await page.evaluate(() => { const h = document.querySelector('header'); const cs = getComputedStyle(h); return { bg: cs.backgroundColor, backdrop: cs.backdropFilter || cs.webkitBackdropFilter, pos: cs.position }; });
    log('B1 drawer open              header:', JSON.stringify(hdr), 'bodyOverflow:', await page.evaluate(() => getComputedStyle(document.body).overflow));
    await page.screenshot({ path: path.join(OUT, `drawer-open-${tag}.png`) });
    const last = page.locator('#mobile-drawer a').last();
    await last.scrollIntoViewIfNeeded(); await page.waitForTimeout(400);
    const lb = await last.boundingBox();
    const hit = await page.evaluate(([x, y]) => { const e = document.elementFromPoint(x, y); return e ? e.tagName + ':' + (e.textContent || '').trim().slice(0, 18) : null; }, [lb.x + lb.width / 2, lb.y + lb.height / 2]);
    log('B2 last link               y:', Math.round(lb.y), 'hit:', hit);
    await page.screenshot({ path: path.join(OUT, `drawer-scrolled-${tag}.png`) });
    await page.mouse.wheel(0, 600); await page.waitForTimeout(300);
    log('B3 page behind locked      scrollY before/after open+wheel:', scrollBefore, await page.evaluate(() => window.scrollY), 'nav:', JSON.stringify(await navBox(page)), 'overflowX:', await overflowX(page));
    await page.keyboard.press('Escape'); await page.waitForTimeout(400);
    log('B4 Escape                  expanded:', await btn.getAttribute('aria-expanded'), 'focus on trigger:', await page.evaluate(() => document.activeElement?.getAttribute('aria-controls')), 'inert:', await page.locator('#mobile-drawer').evaluate(e => e.inert), 'bodyOverflow:', await page.evaluate(() => getComputedStyle(document.body).overflow), 'header:', JSON.stringify(await page.evaluate(() => { const cs = getComputedStyle(document.querySelector('header')); return { bg: cs.backgroundColor, backdrop: cs.backdropFilter, pos: cs.position }; })));
    // a link click
    await btn.click(); await page.waitForTimeout(300);
    const t = page.locator('#mobile-drawer a').nth(3);
    const startPath = new URL(BASE + p).pathname;
    await Promise.all([page.waitForURL(u => u.pathname !== startPath, { timeout: 20000 }).catch(() => log('  NO NAV')), t.click()]);
    log('B5 link click              ->', new URL(page.url()).pathname, 'drawer expanded:', await btn.getAttribute('aria-expanded'));
    await ctx.close();
  }
  // ---------- C: desktop unchanged ----------
  for (const [lang, locale, p, reject] of CASES.slice(0, 2)) {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale });
    const page = await ctx.newPage();
    await page.goto(BASE + p, { waitUntil: 'load', timeout: 60000 }); await page.waitForTimeout(2000);
    const hdr = await page.evaluate(() => { const cs = getComputedStyle(document.querySelector('header')); return { bg: cs.backgroundColor, backdrop: cs.backdropFilter, pos: cs.position }; });
    log(`\nC desktop ${lang} 1440 header:`, JSON.stringify(hdr), 'assistant:', JSON.stringify(await assistant(page)), 'overflowX:', await overflowX(page));
    await page.screenshot({ path: path.join(OUT, `desktop-${lang}-1440.png`), clip: { x: 0, y: 0, width: 1440, height: 900 } });
    await page.locator('button', { hasText: reject }).click(); await page.waitForTimeout(800);
    log('  after cookie choice: hint:', await page.locator('[data-lang-suggestion]').count(), 'assistant:', JSON.stringify(await assistant(page)));
    await page.screenshot({ path: path.join(OUT, `desktop-${lang}-1440-hint.png`) });
    await ctx.close();
  }
  await browser.close();
})();
