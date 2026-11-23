// Mobile layout: the site's fixed bottom nav (64px) and chat button (56px, 80px from the bottom,
// 16px from the right) must never hide the Study Path actions. Real component + real Tailwind CSS in
// Chromium; auth and API boundaries are synthetic and the fixed site chrome reproduces the real geometry.
const { test } = require("node:test");
const assert = require("node:assert/strict");
const http = require("node:http");
const path = require("node:path");
const esbuild = require("esbuild");
const postcss = require("postcss");
const tailwind = require("@tailwindcss/postcss");
const { chromium } = require("@playwright/test");

const root = path.resolve(__dirname, "..");
const attempt = (n) => ({
  id: "mobile-attempt", version: 1, result: null,
  questions: Array.from({ length: 30 }, (_, i) => ({
    id: i + 1, topic_id: i % 6, topic_title: `Topic ${i % 6}`,
    question: `Question ${i + 1}: which statement about OSPF neighbor adjacency is correct?`,
    answers: ["The routers must use the same hello and dead timers on the shared segment", "Both routers must have the same router ID", "The process ID must match on both routers", "The interfaces must belong to different areas"].map((text, k) => ({ id: i * 10 + k + 1, text })),
  })),
  answers: Array.from({ length: n }, (_, i) => ({ question_id: i + 1, answer_id: i * 10 + 1 })),
});
const RESULT = { total: 30, correct: 20, percentage: 67, topics: [
  { topicId: 2, title: "IP Connectivity", total: 5, correct: 1, errors: 4, evidence: "weak" },
  { topicId: 4, title: "IP Services", total: 2, correct: 1, errors: 1, evidence: "insufficient" },
  { topicId: 3, title: "Network Access", total: 5, correct: 4, errors: 1, evidence: "consolidate" },
] };

test("CCNA mobile layout: actions stay clear of the fixed bottom nav and chat button", async (t) => {
  const bundle = await esbuild.build({
    stdin: {
      contents: `import React from 'react';import{createRoot}from'react-dom/client';import Study from './src/components/quiz/CcnaStudyPath';createRoot(document.getElementById('root')).render(<Study lang={new URLSearchParams(location.search).get('lang')||'it'}/>);`,
      resolveDir: root, loader: "tsx",
    },
    bundle: true, write: false, jsx: "automatic", platform: "browser",
    plugins: [{
      name: "boundaries",
      setup(b) {
        b.onResolve({ filter: /^next\/link$|^@\/components\/auth\/AuthProvider$|^@\/lib\/auth$/ }, (a) => ({ path: a.path, namespace: "mock" }));
        b.onLoad({ filter: /.*/, namespace: "mock" }, (a) => ({
          loader: "jsx", resolveDir: root,
          contents: a.path === "next/link"
            ? `import React from 'react';export default function Link(p){return <a {...p}/>}`
            : a.path.endsWith("AuthProvider")
              ? `export const useAuth=()=>({user:{id:1},loading:false});`
              : `export const apiFetch=(p,o)=>fetch('/api'+p,o);`,
        }));
        b.onResolve({ filter: /^@\// }, (a) => ({ path: path.join(root, "src", a.path.slice(2) + ".ts") }));
      },
    }],
  });
  const css = (await postcss([tailwind()]).process(
    '@import "tailwindcss"; @source "../src/components/quiz/CcnaStudyPath.tsx";',
    { from: path.join(root, "tests", "mobile-layout.css") },
  )).css;
  const html = `<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="/app.css">
<style>.site-nav{position:fixed;left:0;right:0;bottom:0;height:64px;background:#fff;border-top:1px solid #ccc;z-index:50}
.site-chat{position:fixed;right:16px;bottom:80px;width:56px;height:56px;border-radius:9999px;background:#6366f1;z-index:9999}
.site-main{padding-bottom:4rem}.site-footer{height:420px;background:#f1f5f9}</style>
<main class="site-main"><div id="root"></div></main><footer class="site-footer"></footer>
<div class="site-nav"></div><div class="site-chat"></div><script src="/app.js"></script>`;
  const server = http.createServer((req, res) => {
    const type = req.url.startsWith("/app.js") ? "text/javascript" : req.url.startsWith("/app.css") ? "text/css" : "text/html";
    res.setHeader("Content-Type", type);
    res.end(type === "text/javascript" ? bundle.outputFiles[0].text : type === "text/css" ? css : html);
  });
  await new Promise((r) => server.listen(0, "127.0.0.1", r));
  t.after(async () => { await new Promise((r) => server.close(r)); });
  const browser = await chromium.launch({ headless: true });
  t.after(async () => { await browser.close(); });
  const base = `http://127.0.0.1:${server.address().port}`;

  for (const [width, height] of [[390, 844], [320, 568]])
    for (const lang of ["it", "en", "fr", "es"])
      for (const [state, expected] of [["question", "/progress"], ["last", "/finish"], ["result", "dialog"]])
        await t.test(`${width}px ${lang} ${state}`, async () => {
          const page = await browser.newPage({ viewport: { width, height } });
          const calls = [];
          await page.route("**/api/study-path/**", (route) => {
            const req = route.request();
            calls.push(new URL(req.url()).pathname.replace(/.*ccna/, ""));
            const body = state === "question" ? attempt(0) : state === "last" ? attempt(29) : { ...attempt(30), questions: [], result: RESULT };
            return route.fulfill({ json: { attempt: req.method() === "PUT" ? attempt(1) : body } });
          });
          await page.goto(`${base}/?lang=${lang}`);
          if (state !== "result") await page.locator("label").first().click();
          const action = state === "result" ? page.getByRole("button") : page.locator("section button").last();
          await action.waitFor();
          // Same scroll a user or keyboard focus produces: honours the button's scroll-margin.
          await action.evaluate((el) => el.scrollIntoView({ block: "nearest" }));
          const geo = await action.evaluate((el) => {
            const r = el.getBoundingClientRect();
            const chat = document.querySelector(".site-chat").getBoundingClientRect();
            const nav = document.querySelector(".site-nav").getBoundingClientRect();
            const probes = [[r.left + 18, r.top + r.height / 2], [r.right - 18, r.top + r.height / 2], [r.left + r.width / 2, r.top + 6], [r.left + r.width / 2, r.bottom - 6], [r.left + r.width / 2, r.top + r.height / 2]];
            const hit = probes.map(([x, y]) => { const e = document.elementFromPoint(x, y); return e === el || el.contains(e); });
            const overlaps = (b) => r.left < b.right && r.right > b.left && r.top < b.bottom && r.bottom > b.top;
            return { r: [r.left, r.top, r.right, r.bottom], hit, chat: overlaps(chat), nav: overlaps(nav), inside: r.left >= 0 && r.right <= innerWidth && r.top >= 0 && r.bottom <= innerHeight, noHScroll: document.documentElement.scrollWidth <= innerWidth };
          });
          assert.ok(geo.inside, `fully inside the viewport ${JSON.stringify(geo.r)}`);
          assert.ok(geo.noHScroll, "no horizontal scroll");
          assert.equal(geo.chat, false, "does not overlap the chat button");
          assert.equal(geo.nav, false, "does not overlap the bottom nav");
          assert.deepEqual(geo.hit, [true, true, true, true, true], "every probe point reaches the button");
          // A real pointer click at the centre, not Playwright's own re-scrolling click.
          const [x, y] = [(geo.r[0] + geo.r[2]) / 2, (geo.r[1] + geo.r[3]) / 2];
          await page.mouse.click(x, y);
          if (expected === "dialog") await page.getByRole("alertdialog").waitFor();
          else {
            for (let i = 0; i < 30 && !calls.includes(expected); i++) await page.waitForTimeout(100);
            assert.ok(calls.includes(expected), `${expected} called, got ${calls.join(",")}`);
          }
          await page.close();
        });
});
