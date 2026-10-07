const { chromium } = require('C:/Users/loren/Documents/CertifyQuiz/.worktrees/home-positioning-129/node_modules/playwright');
const path = require('path');
const BASE = process.env.BASE || 'https://certifyquiz-next-git-feat-hom-99b755-lorenzos-projects-2b528eca.vercel.app';
const OUT = path.join(__dirname, process.env.OUTDIR || 'shots');
const WIDTHS = (process.env.WIDTHS || '375,390').split(',').map(Number);
const CASES = [['it', 'en-US', '/it'], ['fr', 'es-ES', '/fr'], ['es', 'fr-FR', '/es'], ['en', 'it-IT', '/']];
const log = (...a) => console.log(...a);
async function overlays(page) {
  const o = await page.evaluate(() => {
    const out = [];
    document.querySelectorAll('body *').forEach(el => {
      const cs = getComputedStyle(el);
      if (cs.position === 'fixed' && cs.display !== 'none' && cs.visibility !== 'hidden' && cs.opacity !== '0') {
        const r = el.getBoundingClientRect();
        if (r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < innerHeight) out.push({ name: ((el.getAttribute('aria-label') || el.textContent || el.className) + '').trim().slice(0, 28), x: Math.round(r.left), y: Math.round(r.top), w: Math.round(r.width), h: Math.round(r.height), z: cs.zIndex, hidden: el.closest('[aria-hidden=true]') ? 1 : 0 });
      }
    });
    return out;
  });
  const inter = [];
  for (let i = 0; i < o.length; i++) for (let j = i + 1; j < o.length; j++) {
    const a = o[i], b = o[j];
    if (a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h) inter.push(a.name + ' [z' + a.z + '] X ' + b.name + ' [z' + b.z + ']');
  }
  return { o, inter };
}
(async () => {
  const browser = await chromium.launch();
  for (const w of WIDTHS) for (const [lang, locale, p] of CASES) {
    log('\n===== OVERLAYS', lang, 'browser-locale', locale, w);
    const ctx = await browser.newContext({ viewport: { width: w, height: 760 }, locale, hasTouch: true, isMobile: true });
    const page = await ctx.newPage();
    await page.addInitScript(() => { window.__bip = null; });
    await page.goto(BASE + p, { waitUntil: 'load', timeout: 60000 });
    await page.waitForTimeout(2500);
    let r = await overlays(page);
    log('STEP1 (cookie+lang hint):', JSON.stringify(r.o.map(x => `${x.name}@${x.y}+${x.h}`)), 'intersections:', JSON.stringify(r.inter));
    await page.screenshot({ path: path.join(OUT, `overlays1-${lang}-${w}.png`) });
    const reject = page.locator('button', { hasText: /^(Reject|Rifiuta|Refuser|Rechazar)$/ });
    await reject.click(); await page.waitForTimeout(500);
    await page.evaluate(() => window.dispatchEvent(Object.assign(new Event('beforeinstallprompt', { cancelable: true }), { prompt: async () => {}, userChoice: Promise.resolve({ outcome: 'dismissed' }) })));
    await page.waitForTimeout(6000);
    await page.mouse.wheel(0, 900); await page.waitForTimeout(800);
    r = await overlays(page);
    log('STEP2 (after reject, + install prompt, scrolled):', JSON.stringify(r.o.map(x => `${x.name}@${x.y}+${x.h}`)), 'intersections:', JSON.stringify(r.inter));
    await page.screenshot({ path: path.join(OUT, `overlays2-${lang}-${w}.png`) });
    await ctx.close();
  }
  await browser.close();
})();
