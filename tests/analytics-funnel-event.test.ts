import assert from "node:assert/strict";
import test from "node:test";

// trackFunnelEvent/getAnonymousSessionId early-return unless `window` exists,
// e non c'è un DOM nel test runner: montiamo lo stretto indispensabile
// (sessionStorage + navigator.sendBeacon). `crypto` e `navigator` sono
// globali nativi non riassegnabili con un semplice `=` su Node 22, quindi
// vanno ridefiniti con Object.defineProperty.
const sessionStore = new Map<string, string>();

(globalThis as any).window = {};
(globalThis as any).sessionStorage = {
  getItem: (key: string) => sessionStore.get(key) ?? null,
  setItem: (key: string, value: string) => {
    sessionStore.set(key, value);
  },
};

const FIXED_UUID = "11111111-2222-4333-8444-555555555555";
Object.defineProperty(globalThis, "crypto", {
  value: { randomUUID: () => FIXED_UUID },
  configurable: true,
});

const beaconCalls: Array<{ endpoint: string; blob: Blob }> = [];
Object.defineProperty(globalThis, "navigator", {
  value: {
    sendBeacon: (endpoint: string, blob: Blob) => {
      beaconCalls.push({ endpoint, blob });
      return true;
    },
  },
  configurable: true,
});

const analyticsModule = import("../src/lib/analytics.ts");

test("getAnonymousSessionId: generates and persists a UUID in sessionStorage", async () => {
  const { getAnonymousSessionId } = await analyticsModule;
  const id = getAnonymousSessionId();
  assert.equal(id, FIXED_UUID);
  assert.equal(sessionStore.get("cq_analytics_session"), id);
});

test("trackFunnelEvent: includes the anonymous session id in the payload sent to the backend", async () => {
  const { trackFunnelEvent } = await analyticsModule;
  beaconCalls.length = 0;

  trackFunnelEvent({ event: "paywall_viewed", cert_slug: "ccna", topic_slug: null, lang: "it" });

  assert.equal(beaconCalls.length, 1);
  const payload = JSON.parse(await beaconCalls[0].blob.text());
  assert.equal(payload.session_id, FIXED_UUID);
  assert.equal(payload.event, "paywall_viewed");
  assert.equal(payload.cert_slug, "ccna");
});

test("trackFunnelEvent: an explicit event field is never shadowed by the injected session_id", async () => {
  const { trackFunnelEvent } = await analyticsModule;
  beaconCalls.length = 0;

  trackFunnelEvent({ event: "assessment_completed", cert_slug: "cissp", topic_slug: null, lang: "fr", score: 80 });

  const payload = JSON.parse(await beaconCalls[0].blob.text());
  assert.equal(payload.event, "assessment_completed");
  assert.equal(payload.score, 80);
  assert.ok(payload.session_id);
});
