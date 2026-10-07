const { chromium } = require('C:/Users/loren/Documents/CertifyQuiz/.worktrees/home-positioning-129/node_modules/playwright');
const path = require('path');
const BASE = process.env.BASE || 'https://certifyquiz-next-git-feat-hom-99b755-lorenzos-projects-2b528eca.vercel.app';
const OUT = path.join(__dirname, process.env.OUTDIR || 'shots');
const langs = { en: '/', it: '/it', fr: '/fr', es: '/es' };
const widths = [375, 390, 768, 1440];
(async () => {
  const browser = await chromium.launch();
  const results = [];
  for (const [lang, p] of Object.entries(langs)) for (const w of widths) {
    const ctx = await browser.newContext({ viewport: { width: w, height: w >= 768 ? (w === 768 ? 1024 : 900) : 812 }, locale: lang === 'en' ? 'en-US' : lang, hasTouch: w < 768, isMobile: w < 768 });
    const page = await ctx.newPage();
    await page.goto(BASE + p, { waitUntil: 'load', timeout: 60000 }).catch(e => console.log('goto err', e.message));
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(OUT, `home-${lang}-${w}-fold.png`) });
    const m = await page.evaluate(() => {
      const vw = document.documentElement.clientWidth;
      const over = [];
      document.querySelectorAll('body *').forEach(el => {
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) return;
        const cs = getComputedStyle(el);
        if (cs.visibility === 'hidden' || cs.display === 'none') return;
        if (r.right > vw + 1 && !el.closest('[class*="overflow-x"],[class*="snap-x"]') ) over.push(el.tagName + '.' + String(el.className).slice(0, 60) + ' r=' + Math.round(r.right));
      });
      const clipped = [];
      document.querySelectorAll('h1,h2,h3,p,a,button,summary,span').forEach(el => {
        const cs = getComputedStyle(el);
        if ((cs.overflow === 'hidden' || cs.textOverflow === 'ellipsis') && el.scrollWidth > el.clientWidth + 1 && el.clientWidth > 0) clipped.push(el.tagName + ':' + (el.textContent || '').trim().slice(0, 40));
      });
      return { docScroll: document.documentElement.scrollWidth, vw, over: over.slice(0, 8), clipped: clipped.slice(0, 8), h1: document.querySelector('h1')?.getBoundingClientRect().bottom };
    });
    results.push({ lang, w, ...m, hOverflow: m.docScroll > m.vw });
    await page.screenshot({ path: path.join(OUT, `home-${lang}-${w}-full.png`), fullPage: true });
    await ctx.close();
  }
  console.log(JSON.stringify(results, null, 1));
  await browser.close();
})();
