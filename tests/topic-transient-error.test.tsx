import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { parseRetryAfterSec } from "../src/lib/apiClient";
import { isTransientFetchError } from "../src/lib/quiz-session";

const read = (p: string) => readFileSync(new URL(p, import.meta.url), "utf8");

test("Retry-After: secondi, data HTTP, valori assenti o illeggibili, limiti", () => {
  const now = Date.parse("2026-11-25T18:00:00Z");
  assert.equal(parseRetryAfterSec("7"), 7);
  assert.equal(parseRetryAfterSec(" 30 "), 30);
  assert.equal(parseRetryAfterSec("0"), 1);
  assert.equal(parseRetryAfterSec("99999"), 300);
  assert.equal(parseRetryAfterSec("Wed, 25 Nov 2026 18:00:20 GMT", now), 20);
  assert.equal(parseRetryAfterSec("Wed, 25 Nov 2026 17:00:00 GMT", now), 1);
  assert.equal(parseRetryAfterSec("boh"), null);
  assert.equal(parseRetryAfterSec(null), null);
  assert.equal(parseRetryAfterSec(""), null);
});

test("classificazione: 408/429/5xx/rete/timeout sono transitori; 401/403/404 no", () => {
  for (const e of [{ status: 429 }, { status: 500 }, { status: 503 }, { status: 408 }, new TypeError("Failed to fetch"), { name: "TimeoutError" }, { name: "AbortError" }])
    assert.equal(isTransientFetchError(e), true, JSON.stringify(e));
  for (const e of [{ status: 401 }, { status: 403 }, { status: 404 }, { status: 400 }, new Error("boom"), null])
    assert.equal(isTransientFetchError(e), false, JSON.stringify(e));
});

test("QuizTopicClient: l'errore transitorio viene rilanciato, mai trasformato in pool vuoto", () => {
  const src = read("../src/app/[lang]/quiz/topic/[topicId]/QuizTopicClient.tsx");
  const catchBlock = src.slice(src.indexOf("} catch (e: any) {", src.indexOf("fetchTopicQuestions")));
  const iTransient = catchBlock.indexOf("if (isTransientFetchError(e)) throw e;");
  const iFailed = catchBlock.indexOf("getQuestionsByTopic FAILED");
  assert.ok(iTransient > 0 && iTransient < iFailed, "rilancio prima del ramo che restituisce []");
  assert.match(src, /AbortSignal\.timeout\(/, "timeout esplicito sul fetch del topic");
});

test("QuizEngine: messaggio localizzato nelle 4 lingue, Riprova con attesa Retry-After, nessun retry automatico", () => {
  const src = read("../src/components/quiz/QuizEngine.tsx");
  const block = src.slice(src.indexOf("const TRANSIENT_LOAD_MESSAGE"), src.indexOf("const TRANSIENT_LOAD_MESSAGE") + 1200);
  for (const l of ["it", "en", "fr", "es"]) assert.match(block, new RegExp(`\\n  ${l}: '`), l);
  assert.match(src, /if \(isTransientFetchError\(err\)\) \{[\s\S]*?retryAfterSec[\s\S]*?setRetryAt\(Date\.now\(\) \+ ra \* 1000\)[\s\S]*?return;/);
  assert.match(src, /disabled=\{waitSec > 0\}/);
  // il percorso transitorio non cancella il progresso salvato: clearProgress solo per 401/403/404/410
  const transient = src.slice(src.indexOf("if (isTransientFetchError(err)) {"), src.indexOf("setRetryAt(null);\n        setErr("));
  assert.doesNotMatch(transient, /clearProgress/);
  assert.doesNotMatch(src, /setTimeout\([^)]*setLoadGeneration/, "nessun retry automatico");
});
