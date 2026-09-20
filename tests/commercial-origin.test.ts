import assert from "node:assert/strict";
import test from "node:test";
import {
  PAYWALL_TYPE_BY_EVENT,
  normalizeSlug,
  paywallTypeForEvent,
  rememberCommercialOrigin,
  resolveCommercialOrigin,
} from "../src/lib/commercial-origin.ts";

function memoryStorage(initial: Record<string, string> = {}) {
  const map = new Map(Object.entries(initial));
  return {
    map,
    getItem: (key: string) => map.get(key) ?? null,
    setItem: (key: string, value: string) => void map.set(key, value),
  };
}

test("normalizeSlug accetta solo slug brevi e scarta testo libero o ostile", () => {
  assert.equal(normalizeSlug("CCNA"), "ccna");
  assert.equal(normalizeSlug(" aws-cloud-practitioner "), "aws-cloud-practitioner");
  for (const bad of ["", "x'; DROP TABLE users;--", "<script>", "a b", "-lead", null, undefined, 42, "x".repeat(101)]) {
    assert.equal(normalizeSlug(bad), null, String(bad));
  }
});

test("paywallTypeForEvent copre le varianti premium_clicked_* e ignora il click generico", () => {
  assert.equal(paywallTypeForEvent("premium_clicked_locked_explanation"), "wrong_explanation");
  assert.equal(paywallTypeForEvent("premium_clicked_guide_gate"), "guide");
  assert.equal(paywallTypeForEvent("premium_clicked"), null);
  assert.equal(paywallTypeForEvent("study_started"), null);
  assert.deepEqual(
    new Set(Object.values(PAYWALL_TYPE_BY_EVENT)),
    new Set(["wrong_explanation", "post_explanation_quiz_limit", "review", "guide", "map"])
  );
});

test("i parametri della pricing hanno la precedenza sull'origine ricordata", () => {
  const storage = memoryStorage();
  const now = 1_000_000;
  rememberCommercialOrigin({ certSlug: "old-cert", paywallType: "review" }, { storage, now });
  const origin = resolveCommercialOrigin("?source=explanation_paywall&certification_slug=CCNA", {
    storage,
    now: now + 1000,
  });
  assert.deepEqual(origin, { originCertSlug: "ccna", paywallType: "wrong_explanation" });
});

test("senza parametri (header, card certificazione, teaser) si usa l'ultimo click ricordato", () => {
  const storage = memoryStorage();
  rememberCommercialOrigin({ certSlug: "ccna", paywallType: "review" }, { storage, now: 1000 });
  assert.deepEqual(resolveCommercialOrigin("", { storage, now: 2000 }), {
    originCertSlug: "ccna",
    paywallType: "review",
  });
});

test("l'origine ricordata scade dopo il TTL e non compare piu'", () => {
  const storage = memoryStorage();
  rememberCommercialOrigin({ certSlug: "ccna", paywallType: "review" }, { storage, now: 0 });
  assert.deepEqual(resolveCommercialOrigin("", { storage, now: 2 * 60 * 60 * 1000 + 1 }), {
    originCertSlug: null,
    paywallType: null,
  });
});

test("guide_slug vale come origine solo in assenza di certification_slug", () => {
  const storage = memoryStorage();
  assert.equal(resolveCommercialOrigin("?source=guide_preview&guide_slug=ccna", { storage }).originCertSlug, "ccna");
  assert.equal(resolveCommercialOrigin("?guide_slug=ccna&certification_slug=itil", { storage }).originCertSlug, "itil");
});

test("valori ostili in query string o nello storage vengono scartati", () => {
  const storage = memoryStorage({ cq_commercial_origin: "{not json" });
  assert.deepEqual(resolveCommercialOrigin("?certification_slug=x'; DROP--&source=unknown", { storage }), {
    originCertSlug: null,
    paywallType: null,
  });
  const tampered = memoryStorage({
    cq_commercial_origin: JSON.stringify({ originCertSlug: "<b>", paywallType: "review", recordedAt: Date.now() }),
  });
  assert.deepEqual(resolveCommercialOrigin("", { storage: tampered }), {
    originCertSlug: null,
    paywallType: "review",
  });
});

test("storage assente o che lancia eccezioni non rompe mai il checkout", () => {
  const throwing = {
    getItem: () => {
      throw new Error("blocked");
    },
    setItem: () => {
      throw new Error("blocked");
    },
  };
  assert.doesNotThrow(() => rememberCommercialOrigin({ certSlug: "ccna" }, { storage: throwing }));
  assert.deepEqual(resolveCommercialOrigin("?certification_slug=ccna", { storage: throwing }), {
    originCertSlug: "ccna",
    paywallType: null,
  });
  assert.deepEqual(resolveCommercialOrigin("", { storage: null }), { originCertSlug: null, paywallType: null });
});
