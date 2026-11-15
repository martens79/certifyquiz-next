import assert from "node:assert/strict";
import { beforeEach, describe, it } from "node:test";

import {
  SNAPSHOT_TTL_MS,
  SNAPSHOT_VERSION,
  buildSnapshot,
  examRemainingAfterAway,
  isTransientFetchError,
  restoreSnapshot,
  wasDeliveredToPremium,
  type SnapshotExpectation,
} from "../src/lib/quiz-session";
import {
  clearAllProgressForUser,
  clearProgress,
  loadProgress,
  loadSnapshot,
  pruneStaleSnapshots,
  saveProgress,
  saveSnapshot,
} from "../src/lib/quiz-storage";
import type { Question } from "../src/lib/quiz-types";

const NOW = 1_800_000_000_000;
const SCOPE = "mixed:cisco-ccst-security:en:training:user:42";

function question(id: number, extra: Record<string, unknown> = {}): Question {
  return {
    id,
    question: `Question ${id}`,
    answers: [1, 2, 3, 4].map((n) => ({ id: id * 10 + n, text: `A${n}` })),
    ...extra,
  } as unknown as Question;
}

const QUESTIONS = [question(11), question(12), question(13)];

function snapshot(overrides: Record<string, unknown> = {}) {
  const base = buildSnapshot({
    scope: SCOPE,
    userKey: "user:42",
    mode: "training",
    lang: "en",
    isPremium: false,
    questions: QUESTIONS,
    now: NOW,
  });
  return { ...base!, ...overrides };
}

const expectation = (o: Partial<SnapshotExpectation> = {}): SnapshotExpectation => ({
  scope: SCOPE,
  userKey: "user:42",
  mode: "training",
  lang: "en",
  isPremium: false,
  qIds: [11, 12, 13],
  now: NOW + 60_000,
  ...o,
});

describe("snapshot: cosa viene salvato", () => {
  it("copia solo il payload gia' consegnato e scarta soluzioni e spiegazioni", () => {
    const leaky = [
      question(21, {
        explanation: "SECRET explanation",
        correct_answer_id: 211,
        isCorrect: true,
        answers: [
          { id: 211, text: "right", isCorrect: true, is_correct: 1 },
          { id: 212, text: "wrong", isCorrect: false },
        ],
      }),
    ];
    const snap = buildSnapshot({
      scope: SCOPE, userKey: "user:42", mode: "training", lang: "en", isPremium: false, questions: leaky, now: NOW,
    })!;
    const serialized = JSON.stringify(snap);

    assert.equal(snap.v, SNAPSHOT_VERSION);
    assert.ok(!/SECRET|isCorrect|is_correct|correct_answer_id|explanation/i.test(serialized));
    assert.deepEqual(snap.questions[0].answers, [
      { id: 211, text: "right" },
      { id: 212, text: "wrong" },
    ]);
  });

  it("non produce uno snapshot per una sessione vuota o con una domanda non valida", () => {
    const base = { scope: SCOPE, userKey: "user:42", mode: "training" as const, lang: "en" as const, isPremium: false };
    assert.equal(buildSnapshot({ ...base, questions: [] }), null);
    assert.equal(buildSnapshot({ ...base, questions: [{ id: 1, question: "x", answers: [] } as unknown as Question] }), null);
  });
});

describe("snapshot: validazione prima del ripristino", () => {
  it("ripristina domande e ordine quando tutto combacia", () => {
    const restored = restoreSnapshot(snapshot(), expectation());
    assert.deepEqual(restored?.map((q) => q.id), [11, 12, 13]);
  });

  it("e' robusto al round-trip JSON (e' cosi' che arriva da localStorage)", () => {
    const restored = restoreSnapshot(JSON.parse(JSON.stringify(snapshot())), expectation());
    assert.equal(restored?.length, 3);
  });

  it("rifiuta versione, scope, utente, modalita' e lingua diversi", () => {
    assert.equal(restoreSnapshot(snapshot({ v: SNAPSHOT_VERSION + 1 }), expectation()), null);
    assert.equal(restoreSnapshot(snapshot(), expectation({ scope: "mixed:other:en:training:user:42" })), null);
    assert.equal(restoreSnapshot(snapshot(), expectation({ userKey: "user:43" })), null);
    assert.equal(restoreSnapshot(snapshot(), expectation({ userKey: "anon" })), null);
    assert.equal(restoreSnapshot(snapshot(), expectation({ mode: "exam" })), null);
    assert.equal(restoreSnapshot(snapshot(), expectation({ lang: "it" })), null);
  });

  it("rispetta il TTL per modalita' e tollera un piccolo salto indietro dell'orologio", () => {
    const fresh = snapshot();
    assert.ok(restoreSnapshot(fresh, expectation({ now: NOW + SNAPSHOT_TTL_MS.training })));
    assert.equal(restoreSnapshot(fresh, expectation({ now: NOW + SNAPSHOT_TTL_MS.training + 1 })), null);
    assert.ok(restoreSnapshot(fresh, expectation({ now: NOW - 60_000 })));
    assert.equal(restoreSnapshot(fresh, expectation({ now: NOW - 60 * 60_000 })), null);

    const exam = snapshot({ mode: "exam" });
    assert.equal(
      restoreSnapshot(exam, expectation({ mode: "exam", now: NOW + SNAPSHOT_TTL_MS.exam + 1 })),
      null
    );
  });

  it("uno snapshot premium non e' ripristinabile da un account non premium", () => {
    const premium = buildSnapshot({
      scope: SCOPE, userKey: "user:42", mode: "training", lang: "en", isPremium: true, questions: QUESTIONS, now: NOW,
    });
    assert.equal(restoreSnapshot(premium, expectation({ isPremium: false })), null);
    assert.ok(restoreSnapshot(premium, expectation({ isPremium: true })));
    // il contrario e' lecito: chi ha ricevuto le domande da free puo' esserlo ora da premium
    assert.ok(restoreSnapshot(snapshot(), expectation({ isPremium: true })));
  });

  it("deve corrispondere esattamente all'ordine del progresso salvato", () => {
    assert.equal(restoreSnapshot(snapshot(), expectation({ qIds: [12, 11, 13] })), null);
    assert.equal(restoreSnapshot(snapshot(), expectation({ qIds: [11, 12] })), null);
    assert.equal(restoreSnapshot(snapshot(), expectation({ qIds: undefined })), null);
  });

  it("rifiuta snapshot manomessi o malformati", () => {
    assert.equal(restoreSnapshot(null, expectation()), null);
    assert.equal(restoreSnapshot("garbage", expectation()), null);
    assert.equal(restoreSnapshot(snapshot({ questions: [] }), expectation()), null);
    assert.equal(restoreSnapshot(snapshot({ qIds: [11, 12, 99] }), expectation()), null);
    assert.equal(restoreSnapshot(snapshot({ savedAt: "yesterday" }), expectation()), null);
    assert.equal(restoreSnapshot(snapshot({ entitlement: "admin" }), expectation()), null);

    const dup = snapshot();
    dup.questions = [dup.questions[0], dup.questions[0], dup.questions[2]];
    dup.qIds = [11, 11, 13];
    assert.equal(restoreSnapshot(dup, expectation({ qIds: [11, 11, 13] })), null);

    const noAnswers = snapshot();
    noAnswers.questions = [{ ...noAnswers.questions[0], answers: [] }, noAnswers.questions[1], noAnswers.questions[2]];
    assert.equal(restoreSnapshot(noAnswers, expectation()), null);
  });

  it("un campo iniettato (isCorrect, explanation) non passa nel ripristino", () => {
    const tampered = snapshot();
    (tampered.questions[0] as unknown as Record<string, unknown>).explanation = "injected";
    (tampered.questions[0].answers[0] as unknown as Record<string, unknown>).isCorrect = true;
    const restored = restoreSnapshot(tampered, expectation())!;
    assert.ok(!("explanation" in restored[0]));
    assert.ok(!("isCorrect" in restored[0].answers[0]));
  });
});

describe("etichetta premium dello snapshot", () => {
  it("resta premium se le stesse domande erano state consegnate a un premium", () => {
    const premium = buildSnapshot({
      scope: SCOPE, userKey: "user:42", mode: "training", lang: "en", isPremium: true, questions: QUESTIONS, now: NOW,
    });
    assert.equal(wasDeliveredToPremium(premium, [11, 12, 13]), true);
    assert.equal(wasDeliveredToPremium(premium, [11, 12, 14]), false);
    assert.equal(wasDeliveredToPremium(snapshot(), [11, 12, 13]), false);
    assert.equal(wasDeliveredToPremium(null, [11]), false);
  });
});

describe("errori di fetch assorbibili dallo snapshot", () => {
  it("solo guasti di trasporto/disponibilita'", () => {
    assert.equal(isTransientFetchError(new TypeError("Failed to fetch")), true);
    for (const status of [408, 429, 500, 502, 503]) {
      assert.equal(isTransientFetchError(Object.assign(new Error("x"), { status })), true, String(status));
    }
  });

  it("mai un rifiuto di accesso o di gate", () => {
    for (const status of [400, 401, 403, 404, 409]) {
      assert.equal(isTransientFetchError(Object.assign(new Error("x"), { status })), false, String(status));
    }
    // il mock-exam converte i rifiuti in un Error semplice con il messaggio
    assert.equal(isTransientFetchError(new Error("Mock exam not available")), false);
    assert.equal(isTransientFetchError(null), false);
  });
});

describe("timer exam dopo l'assenza", () => {
  const total = 3600;

  it("il tempo trascorso lontano dalla pagina viene scalato", () => {
    assert.equal(
      examRemainingAfterAway({ remainingSec: 3000, savedAt: NOW, totalSec: total, now: NOW + 120_000 }),
      2880
    );
  });

  it("senza assenza il valore salvato e' conservato (non si riparte dal totale)", () => {
    assert.equal(examRemainingAfterAway({ remainingSec: 1234, savedAt: NOW, totalSec: total, now: NOW }), 1234);
  });

  it("non va mai sotto zero e non supera il totale", () => {
    assert.equal(examRemainingAfterAway({ remainingSec: 100, savedAt: NOW, totalSec: total, now: NOW + 3_600_000 }), 0);
    assert.equal(examRemainingAfterAway({ remainingSec: 99_999, savedAt: NOW, totalSec: total, now: NOW }), total);
  });

  it("un orologio che torna indietro non regala tempo", () => {
    assert.equal(examRemainingAfterAway({ remainingSec: 900, savedAt: NOW, totalSec: total, now: NOW - 60_000 }), 900);
  });

  it("salvataggi senza savedAt/remaining: nessuna deduzione arbitraria", () => {
    assert.equal(examRemainingAfterAway({ remainingSec: 900, savedAt: undefined, totalSec: total, now: NOW }), 900);
    assert.equal(examRemainingAfterAway({ remainingSec: undefined, savedAt: undefined, totalSec: total, now: NOW }), total);
  });
});

describe("storage: progresso e snapshot", () => {
  const store = new Map<string, string>();
  beforeEach(() => {
    store.clear();
    const fake = {
      get length() { return store.size; },
      key: (i: number) => Array.from(store.keys())[i] ?? null,
      getItem: (k: string) => (store.has(k) ? store.get(k)! : null),
      setItem: (k: string, v: string) => void store.set(k, String(v)),
      removeItem: (k: string) => void store.delete(k),
    };
    (globalThis as unknown as { localStorage: unknown }).localStorage = fake;
  });

  it("clearProgress cancella progresso e snapshot insieme (Restart / fine quiz)", () => {
    saveProgress(SCOPE, { qIds: [1], marked: {}, reviewLater: [], mode: "training", remainingSec: null, startedAt: null });
    saveSnapshot(SCOPE, snapshot());
    assert.ok(loadProgress(SCOPE));
    assert.ok(loadSnapshot(SCOPE));

    clearProgress(SCOPE);
    assert.equal(loadProgress(SCOPE), null);
    assert.equal(loadSnapshot(SCOPE), null);
  });

  it("al logout spariscono progresso E snapshot dell'utente uscente, non quelli di altri", () => {
    const mine = "mixed:x:en:training:user:42";
    const other = "mixed:x:en:training:user:43";
    const anon = "mixed:x:en:training:anon";
    for (const scope of [mine, other, anon]) {
      saveProgress(scope, { qIds: [1], marked: {}, reviewLater: [], mode: "training", remainingSec: null, startedAt: null });
      saveSnapshot(scope, { scope });
    }

    clearAllProgressForUser(42);

    assert.equal(loadProgress(mine), null);
    assert.equal(loadSnapshot(mine), null);
    assert.ok(loadProgress(other));
    assert.ok(loadSnapshot(other));
    assert.ok(loadProgress(anon));
    assert.ok(loadSnapshot(anon));
  });

  it("l'id 4 non cancella i dati dell'utente 42 (suffisso esatto)", () => {
    saveSnapshot("mixed:x:en:training:user:42", { a: 1 });
    clearAllProgressForUser(4);
    assert.ok(loadSnapshot("mixed:x:en:training:user:42"));
  });

  it("pruneStaleSnapshots elimina solo gli snapshot scaduti o illeggibili", () => {
    saveSnapshot("a:anon", { savedAt: NOW });
    saveSnapshot("b:anon", { savedAt: NOW - 25 * 60 * 60 * 1000 });
    store.set("cq:quiz:snap:c:anon", "not json");
    saveProgress("d:anon", { qIds: [1], marked: {}, reviewLater: [], mode: "training", remainingSec: null, startedAt: null });

    pruneStaleSnapshots(24 * 60 * 60 * 1000, NOW);

    assert.ok(loadSnapshot("a:anon"));
    assert.equal(loadSnapshot("b:anon"), null);
    assert.equal(store.has("cq:quiz:snap:c:anon"), false);
    assert.ok(loadProgress("d:anon")); // il progresso non si tocca
  });

  it("storage non disponibile: nessuna eccezione", () => {
    (globalThis as unknown as { localStorage: unknown }).localStorage = {
      getItem() { throw new Error("denied"); },
      setItem() { throw new Error("denied"); },
      removeItem() { throw new Error("denied"); },
    };
    assert.doesNotThrow(() => saveSnapshot(SCOPE, snapshot()));
    assert.equal(loadSnapshot(SCOPE), null);
    assert.doesNotThrow(() => clearProgress(SCOPE));
  });
});
