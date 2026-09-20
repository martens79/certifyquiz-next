import assert from "node:assert/strict";
import test from "node:test";

// Stesso setup minimale di analytics-funnel-event.test.ts: trackFunnelEvent
// esce subito senza `window`, quindi montiamo solo storage e sendBeacon.
const sessionStore = new Map<string, string>();
(globalThis as any).window = { location: { pathname: "/it/quiz/ccna", search: "", hash: "" } };
(globalThis as any).document = { referrer: "" };
(globalThis as any).sessionStorage = {
  getItem: (key: string) => sessionStore.get(key) ?? null,
  setItem: (key: string, value: string) => void sessionStore.set(key, value),
};
let uuidCounter = 0;
Object.defineProperty(globalThis, "crypto", {
  value: { randomUUID: () => `00000000-0000-4000-8000-${String(++uuidCounter).padStart(12, "0")}` },
  configurable: true,
});
const beaconCalls: Array<{ blob: Blob }> = [];
Object.defineProperty(globalThis, "navigator", {
  value: {
    sendBeacon: (_endpoint: string, blob: Blob) => {
      beaconCalls.push({ blob });
      return true;
    },
  },
  configurable: true,
});

const analyticsModule = import("../src/lib/analytics.ts");
const payloadAt = async (index: number) => JSON.parse(await beaconCalls[index].blob.text());

test("i click Premium ricevono paywall_type di default e ricordano l'origine commerciale", async () => {
  const { trackFunnelEvent } = await analyticsModule;
  beaconCalls.length = 0;
  sessionStore.delete("cq_commercial_origin");

  trackFunnelEvent({ event: "premium_clicked_review_gate", cert_slug: "CCNA", topic_slug: "routing", lang: "it" });

  const payload = await payloadAt(0);
  assert.equal(payload.paywall_type, "review");
  assert.equal(payload.cert_slug, "CCNA", "il payload originale non viene alterato");
  const remembered = JSON.parse(sessionStore.get("cq_commercial_origin")!);
  assert.equal(remembered.originCertSlug, "ccna");
  assert.equal(remembered.paywallType, "review");
});

test("un paywall_type esplicito vince sul default e un click generico azzera l'origine precedente", async () => {
  const { trackFunnelEvent } = await analyticsModule;
  beaconCalls.length = 0;

  trackFunnelEvent({
    event: "premium_clicked_post_gate_quiz_limit",
    cert_slug: "ccna",
    paywall_type: "post_explanation_quiz_limit",
  });
  assert.equal((await payloadAt(0)).paywall_type, "post_explanation_quiz_limit");

  trackFunnelEvent({ event: "premium_clicked", cert_slug: null });
  assert.equal("paywall_type" in (await payloadAt(1)), false, "click generico: nessun paywall_type inventato");
  const remembered = JSON.parse(sessionStore.get("cq_commercial_origin")!);
  assert.equal(remembered.originCertSlug, null);
  assert.equal(remembered.paywallType, null);
});

test("gli eventi non-Premium non toccano l'origine commerciale", async () => {
  const { trackFunnelEvent } = await analyticsModule;
  sessionStore.set(
    "cq_commercial_origin",
    JSON.stringify({ originCertSlug: "ccna", paywallType: "guide", recordedAt: Date.now() })
  );
  trackFunnelEvent({ event: "study_started", cert_slug: "aws-cloud-practitioner" });
  assert.equal(JSON.parse(sessionStore.get("cq_commercial_origin")!).originCertSlug, "ccna");
});

test("checkout_started conserva paywall_type e origine passati dalla pricing", async () => {
  const { trackFunnelEvent } = await analyticsModule;
  beaconCalls.length = 0;
  trackFunnelEvent({
    event: "checkout_started",
    cert_slug: "ccna",
    plan: "premium_annual",
    paywall_type: "wrong_explanation",
    metadata: { plan: "premium_annual", product_type: "premium_annual", purchase_type: "subscription", origin_cert_slug: "ccna" },
  });
  const payload = await payloadAt(0);
  assert.equal(payload.cert_slug, "ccna");
  assert.equal(payload.paywall_type, "wrong_explanation");
  assert.deepEqual(payload.metadata, {
    plan: "premium_annual",
    product_type: "premium_annual",
    purchase_type: "subscription",
    origin_cert_slug: "ccna",
  });
});
