// Real component in Chromium; auth and API boundaries are synthetic.
const { test } = require("node:test");
const assert = require("node:assert/strict");
const http = require("node:http");
const path = require("node:path");
const esbuild = require("esbuild");
const { chromium } = require("@playwright/test");

const RETRY = { it: "Riprova", en: "Try again", fr: "Réessayer", es: "Reintentar" };

test("CCNA component: four languages, resume, server result, recovery and guest login", async (t) => {
  const root = path.resolve(__dirname, "..");
  const bundle = await esbuild.build({
    stdin: {
      contents: `import React from 'react';import{createRoot}from'react-dom/client';import Study from './src/components/quiz/CcnaStudyPath';createRoot(document.getElementById('root')).render(<Study lang={new URLSearchParams(location.search).get('lang')||'it'}/>);`,
      resolveDir: root,
      loader: "tsx",
    },
    bundle: true,
    write: false,
    jsx: "automatic",
    platform: "browser",
    plugins: [
      {
        name: "boundaries",
        setup(b) {
          b.onResolve(
            {
              filter:
                /^next\/link$|^@\/components\/auth\/AuthProvider$|^@\/lib\/auth$/,
            },
            (a) => ({ path: a.path, namespace: "mock" }),
          );
          b.onLoad({ filter: /.*/, namespace: "mock" }, (a) => ({
            loader: "jsx",
            resolveDir: root,
            contents:
              a.path === "next/link"
                ? `import React from 'react';export default function Link(p){return <a {...p}/>}`
                : a.path.endsWith("AuthProvider")
                  ? `export const useAuth=()=>({user:location.search.includes('guest')?null:{id:1},loading:false});`
                  : `export const apiFetch=(p,o)=>fetch('/api'+p,o);`,
          }));
          b.onResolve({ filter: /^@\// }, (a) => ({
            path: path.join(root, "src", a.path.slice(2) + ".ts"),
          }));
        },
      },
    ],
  });
  const server = http.createServer((req, res) => {
    res.setHeader(
      "Content-Type",
      req.url.startsWith("/app.js") ? "text/javascript" : "text/html",
    );
    res.end(
      req.url.startsWith("/app.js")
        ? bundle.outputFiles[0].text
        : '<div id="root"></div><script src="/app.js"></script>',
    );
  });
  await new Promise((r) => server.listen(0, "127.0.0.1", r));
  t.after(async () => {
    await new Promise((r) => server.close(r));
  });
  const browser = await chromium.launch({ headless: true });
  t.after(async () => {
    await browser.close();
  });
  const base = `http://127.0.0.1:${server.address().port}`;
  for (const lang of ["it", "en", "fr", "es"])
    await t.test(lang, async () => {
      const page = await browser.newPage({
        viewport: { width: 390, height: 844 },
      });
      let attempt = null,
        unavailable = false,
        failNext = false,
        restarts = 0;
      await page.route("**/api/study-path/**", async (route) => {
        const req = route.request(),
          url = new URL(req.url());
        if (unavailable)
          return route.fulfill({ status: 503, json: { error: "unavailable" } });
        if (url.pathname.endsWith("/restart")) restarts++;
        if (failNext && url.pathname.endsWith("/progress")) {
          failNext = false;
          return route.fulfill({ status: 500, json: { error: "temporary" } });
        }
        if (
          url.pathname.endsWith("/start") ||
          url.pathname.endsWith("/restart")
        )
          attempt = {
            id: "test-attempt",
            version: 1,
            questions: Array.from({ length: 30 }, (_, i) => ({
              id: i + 1,
              topic_id: i % 6,
              topic_title: `Topic ${i % 6}`,
              question: `${lang} Q${i + 1}`,
              answers: [
                { id: i * 10 + 1, text: "Option A" },
                { id: i * 10 + 2, text: "Option B" },
              ],
            })),
            answers: [],
            result: null,
          };
        if (url.pathname.endsWith("/progress"))
          attempt.answers = req.postDataJSON().answers;
        if (url.pathname.endsWith("/finish")) {
          assert.equal(req.postDataJSON().answers.length, 30);
          attempt.result = {
            percentage: 60,
            correct: 18,
            total: 30,
            topics: [
              { topicId: 1, title: "Routing", correct: 1, total: 5, errors: 4, evidence: "weak" },
              { topicId: 2, title: "Switching", correct: 1, total: 2, errors: 1, evidence: "insufficient" },
              { topicId: 3, title: "Services", correct: 2, total: 3, errors: 1, evidence: "consolidate" },
              { topicId: 4, title: "Security", correct: 5, total: 5, errors: 0, evidence: "consolidate" },
            ],
          };
        }
        return route.fulfill({ json: { attempt } });
      });
      await page.goto(`${base}/?lang=${lang}`);
      await page.locator("button").first().click();
      await page.getByRole("radio").first().check();
      await page.locator("section button").last().click();
      await page.waitForFunction(() =>
        document.querySelector("legend")?.textContent?.endsWith("Q2"),
      );
      await page.reload();
      await page.waitForFunction(() =>
        document.querySelector("legend")?.textContent?.endsWith("Q2"),
      );
      for (let i = 2; i <= 30; i++) {
        await page.getByRole("radio").first().check();
        if (i === 2) {
          // Temporary failure: only "retry" is offered, the selection is kept, no restart request.
          failNext = true;
          await page.locator("section button").last().click();
          await page.getByRole("alert").waitFor();
          assert.equal(await page.getByRole("alert").getByRole("button").count(), 1);
          assert.equal(await page.getByRole("radio").first().isChecked(), true);
          assert.equal(restarts, 0);
          assert.equal(await page.getByRole("alert").getByRole("button").innerText(), RETRY[lang]);
          await page.getByRole("alert").getByRole("button").click();
        } else await page.locator("section button").last().click();
        if (i < 30)
          await page.waitForFunction(
            (n) =>
              document.querySelector("legend")?.textContent?.endsWith(`Q${n}`),
            i + 1,
          );
      }
      await page.getByTestId("score-percentage").filter({ hasText: "60%" }).waitFor();
      assert.equal(await page.getByRole("listitem").count(), 4);
      // Phase C1: every recommended topic links to the existing FREE topic training with its real id.
      const TRAIN = { it: "Allenati su questo argomento", en: "Practice this topic", fr: "S’entraîner sur ce sujet", es: "Entrénate en este tema" };
      const href = (id) => `/${lang}/quiz/topic/${id}`;
      const start = page.getByTestId("train-start-here");
      assert.equal(await start.getAttribute("href"), href(1));
      assert.equal((await start.innerText()).trim(), TRAIN[lang]);
      assert.equal(await page.getByTestId("train-weak").getAttribute("href"), href(1));
      // Insufficient evidence stays distinct (own group, secondary style) but is still linked.
      assert.equal(await page.getByTestId("train-insufficient").getAttribute("href"), href(2));
      assert.equal(await page.getByTestId("train-consolidate").getAttribute("href"), href(3));
      // Strengths get no training link; links never trigger a restart or any study-path call.
      assert.equal(await page.getByRole("link", { name: TRAIN[lang] }).count(), 4);
      assert.equal(await page.getByTestId("train-strong").count(), 0);
      assert.equal(restarts, 0);
      await page.reload();
      await page.getByTestId("score-percentage").filter({ hasText: "60%" }).waitFor();
      // Voluntary restart needs confirmation; cancelling keeps the saved result.
      await page.getByRole("button").click();
      const dialog = page.getByRole("alertdialog");
      await dialog.waitFor();
      assert.equal(await dialog.getByRole("button").count(), 2);
      await dialog.getByRole("button").nth(1).click();
      assert.equal(await dialog.count(), 0);
      assert.equal(restarts, 0);
      await page.getByTestId("score-percentage").filter({ hasText: "60%" }).waitFor();
      await page.getByRole("button").click();
      await dialog.getByRole("button").first().click();
      await page.waitForFunction(() =>
        document.querySelector("legend")?.textContent?.endsWith("Q1"),
      );
      assert.equal(restarts, 1);
      unavailable = true;
      await page.reload();
      await page.getByRole("alert").waitFor();
      // Unavailable/temporary load error: retry only, never restart, and no start button.
      assert.equal(await page.getByRole("alert").getByRole("button").count(), 1);
      assert.equal(await page.getByRole("button").count(), 1);
      assert.equal(await page.getByRole("alert").getByRole("button").innerText(), RETRY[lang]);
      unavailable = false;
      await page.getByRole("alert").getByRole("button").click();
      await page.waitForFunction(() =>
        document.querySelector("legend")?.textContent?.endsWith("Q1"),
      );
      assert.equal(restarts, 1);
      unavailable = true;
      await page.reload();
      await page.getByRole("alert").waitFor();
      await page.goto(`${base}/?lang=${lang}&guest=1`);
      assert.match(
        await page.getByRole("link").getAttribute("href"),
        /login\?redirect=/,
      );
      await page.close();
    });
});
