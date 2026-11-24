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
        restarts = 0,
        progressData = null;
      await page.route("**/api/study-path/**", async (route) => {
        const req = route.request(),
          url = new URL(req.url());
        if (unavailable)
          return route.fulfill({ status: 503, json: { error: "unavailable" } });
        // Phase C2: GET /progress is the read-only progress endpoint (PUT /progress saves answers).
        if (req.method() === "GET" && url.pathname.endsWith("/progress"))
          return progressData
            ? route.fulfill({ json: progressData })
            : route.fulfill({ status: 404, json: { error: "not found" } });
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
      // Without the progress endpoint (404) the C1 view above is kept and nothing is invented.
      assert.equal(await page.getByTestId("recent-training").count(), 0);
      // Phase C2: with the read-only progress endpoint the suggestions are updated from training.
      const CONTINUE = { it: "Continua dal prossimo argomento consigliato", en: "Continue with the next recommended topic", fr: "Continuer avec le prochain sujet conseillé", es: "Continuar con el siguiente tema recomendado" };
      const NONE = { it: "Non ancora disponibile", en: "Not available yet", fr: "Pas encore disponible", es: "Aún no disponible" };
      const row = (topicId, status, strong, ic, it, answered, correct, accuracy, covered, available) => ({
        topicId, title: `T${topicId}`, status, strong,
        initial: { correct: ic, total: it, evidence: "weak" },
        training: { answered, correct, accuracy },
        recent: { answered, correct, accuracy },
        coverage: { answered: covered, available, remaining: available - covered, ratio: covered / available },
        lastActivityAt: null,
      });
      progressData = {
        diagnostic: { attemptId: "test-attempt", percentage: 60, correct: 18, total: 30 },
        history: [],
        next: { topicId: 2 },
        topics: [
          row(2, "weak", false, 1, 2, 3, 1, 33, 5, 20),
          row(3, "insufficient", false, 2, 3, 2, 2, null, 5, 20),
          row(1, "consolidate", false, 1, 5, 10, 8, 80, 14, 20),
          row(4, "consolidate", true, 5, 5, 10, 9, 90, 15, 20),
        ],
      };
      await page.reload();
      await page.getByTestId("score-percentage").filter({ hasText: "60%" }).waitFor();
      await page.getByTestId("recent-training").first().waitFor();
      assert.equal(await page.getByTestId("score-percentage").innerText(), "60%"); // original result kept
      assert.equal(await page.getByTestId("recent-training").count(), 4);
      const startC2 = page.getByTestId("train-start-here");
      assert.equal(await startC2.getAttribute("href"), href(2));
      assert.equal((await startC2.innerText()).trim(), CONTINUE[lang]);
      assert.equal(await page.getByTestId("train-weak").getAttribute("href"), href(2));
      assert.equal(await page.getByTestId("train-insufficient").getAttribute("href"), href(3));
      assert.equal(await page.getByTestId("train-consolidate").getAttribute("href"), href(1));
      const recent = await page.getByTestId("recent-training").allInnerTexts();
      assert.ok(recent.some((x) => x.includes("33") && x.includes("3")));
      assert.ok(recent.some((x) => x.includes("80") && x.includes("10")));
      assert.equal(recent.filter((x) => x.startsWith(NONE[lang])).length, 1); // < 3 answers: no percentage
      assert.ok((await page.getByTestId("coverage").allInnerTexts()).some((x) => x.includes("14") && x.includes("20")));
      assert.equal(await page.getByRole("listitem").count(), 4);
      assert.equal(restarts, 0);
      // After more training the user returns to the tab: suggestions refresh without retaking the test.
      progressData = { ...progressData, next: { topicId: 3 }, topics: [progressData.topics[1], progressData.topics[0], ...progressData.topics.slice(2)] };
      await page.evaluate(() => window.dispatchEvent(new Event("focus")));
      await page.waitForFunction(
        (h) => document.querySelector('[data-testid="train-start-here"]')?.getAttribute("href") === h,
        href(3),
      );
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
