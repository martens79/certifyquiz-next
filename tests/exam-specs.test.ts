import assert from "node:assert/strict";
import test from "node:test";

import { EXAM_SPECS_BY_CERT_ID, getExamSpecForCert } from "../src/lib/exam-specs.ts";

// certification_id di produzione: 33 = Cisco CCST Networking, 34 = Cisco CCST Cybersecurity.
// La spec di CCST Cybersecurity era registrata sull'id 12 (inesistente): la mock-exam
// ricadeva sul fallback generico (fino a 60 domande) invece di 50 domande in 60 minuti.

test("CCST Cybersecurity (id 34) has its own spec: 50 questions in 60 minutes", () => {
  assert.deepEqual(getExamSpecForCert(34, 300), { questions: 50, durationSec: 3600 });
});

test("the spec is no longer registered under the non-existent id 12", () => {
  assert.equal(EXAM_SPECS_BY_CERT_ID[12], undefined);
});

test("CCST Networking (id 33) keeps its spec", () => {
  assert.deepEqual(getExamSpecForCert(33, 300), { questions: 50, durationSec: 3600 });
});

test("an unknown certification still falls back to at most 60 questions, 60 seconds each", () => {
  assert.deepEqual(getExamSpecForCert(999999, 300), { questions: 60, durationSec: 3600 });
  assert.deepEqual(getExamSpecForCert(999999, 20), { questions: 20, durationSec: 1200 });
  assert.deepEqual(getExamSpecForCert(null, 10), { questions: 10, durationSec: 600 });
});
