import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

// Fase 2: anteprima admin di una domanda per ID. QuizEngine in modalita' `previewCheckAnswer` deve essere in SOLA LETTURA.
const fetchCalls: string[] = [];
Object.defineProperty(globalThis, "fetch", {
  value: (input: string) => { fetchCalls.push(String(input)); return Promise.resolve(new Response("{}", { status: 200 })); },
  configurable: true,
});

const engine = import("../src/components/quiz/QuizEngine.tsx");

const SIDE_EFFECTS = [
  "saveProgress", "clearProgress", "saveSnapshot", "pruneStaleSnapshots", "saveExamAttempt", "clearExamAttempt", "savePendingClose",
  "clearPendingClose", "trackEventOnce", "trackFunnelEvent", "trackFunnelEventOnce", "trackAnalyticsEvent", "trackMetaPixel",
] as const;

test("preview: ogni funzione con effetti collaterali e' un no-op e la rete non viene toccata", async () => {
  const { previewMode } = await engine;
  const g: any = previewMode(async () => ({ question_id: 1, correct: true } as any));
  fetchCalls.length = 0;
  for (const name of SIDE_EFFECTS) assert.equal(g[name]("k", { a: 1 }), undefined, name);
  const r = await g.apiFetch("/me/quiz-progress/5?lang=it&mode=training", { method: "PUT" });
  assert.equal(r.status, 404);
  assert.equal(await g.closeServerProgress(), true, "la chiusura progressi non fallisce ne' mette marker locali");
  assert.deepEqual(fetchCalls, [], "nessuna richiesta di rete dai guard");
});

test("preview: checkAnswer passa dall'endpoint di anteprima con id numerici e lingua", async () => {
  const { previewMode } = await engine;
  const seen: unknown[] = [];
  const g: any = previewMode(async (q, a, l) => { seen.push([q, a, l]); return { question_id: q, correct: false } as any; });
  const res = await g.checkAnswer("21715", "9", "fr");
  assert.deepEqual(seen, [[21715, 9, "fr"]]);
  assert.equal(res.correct, false);
});

test("senza anteprima i guard sono le funzioni reali (nessuna regressione per quiz normali)", async () => {
  const { previewMode } = await engine;
  const normal: any = previewMode(undefined);
  const again: any = previewMode(undefined);
  for (const k of [...SIDE_EFFECTS, "apiFetch", "checkAnswer", "closeServerProgress"]) {
    assert.equal(normal[k], again[k], k);
    assert.ok(!/NOOP|PREVIEW_API/.test(String(normal[k])), `${k} non deve essere il no-op`);
  }
  const preview: any = previewMode(async () => ({} as any));
  for (const k of SIDE_EFFECTS) assert.notEqual(normal[k], preview[k], k);
});

test("guard statici: la pagina usa solo l'endpoint admin e non importa storage/analytics", () => {
  const page = readFileSync("src/app/admin/question-preview/QuestionPreviewClient.tsx", "utf8");
  assert.match(page, /previewCheckAnswer=\{previewCheckAnswer\}/);
  assert.match(page, /\/admin\/question-preview\//);
  assert.ok(!/\/answers\/check|checkAnswer\b(?!:)|quiz-storage|@\/lib\/analytics|quiz-progress|\/me\//.test(page.replace(/previewCheckAnswer/g, "")));
  const layout = readFileSync("src/app/admin/layout.tsx", "utf8");
  assert.match(layout, /index: false/, "noindex ereditato");
  const src = readFileSync("src/components/quiz/QuizEngine.tsx", "utf8");
  // nel componente nessun uso diretto delle funzioni reali: passano tutte da previewMode()
  const body = src.slice(src.indexOf("export default function QuizEngine"), src.indexOf("function GateShownTracker"));
  assert.ok(!/\b(saveProgressReal|saveSnapshotReal|apiFetchReal|checkAnswerReal|trackFunnelEventReal|trackAnalyticsEventReal|trackMetaPixelReal)\b/.test(body));
});
