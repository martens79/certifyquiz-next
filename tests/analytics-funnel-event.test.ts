import assert from "node:assert/strict";
import test from "node:test";

// trackFunnelEvent/getAnonymousSessionId early-return unless `window` exists,
// e non c'è un DOM nel test runner: montiamo lo stretto indispensabile
// (sessionStorage + navigator.sendBeacon). `crypto` e `navigator` sono
// globali nativi non riassegnabili con un semplice `=` su Node 22, quindi
// vanno ridefiniti con Object.defineProperty.
const sessionStore = new Map<string, string>();

(globalThis as any).window = {
  location: { pathname: "/it/quiz/ccna", search: "", hash: "" },
};
(globalThis as any).document = { referrer: "https://example.com/source?secret=1#fragment" };
(globalThis as any).sessionStorage = {
  getItem: (key: string) => sessionStore.get(key) ?? null,
  setItem: (key: string, value: string) => {
    sessionStore.set(key, value);
  },
};

const FIXED_UUID = "11111111-2222-4333-8444-555555555555";
let uuidCounter = 0;
const nextUuid = () => {
  uuidCounter += 1;
  return `00000000-0000-4000-8000-${String(uuidCounter).padStart(12, "0")}`;
};
Object.defineProperty(globalThis, "crypto", {
  value: { randomUUID: () => (uuidCounter === 0 ? (uuidCounter += 1, FIXED_UUID) : nextUuid()) },
  configurable: true,
});

const beaconCalls: Array<{ endpoint: string; blob: Blob }> = [];
const fetchCalls: Array<{ endpoint: string; init?: RequestInit }> = [];
let beaconResult = true;
Object.defineProperty(globalThis, "navigator", {
  value: {
    sendBeacon: (endpoint: string, blob: Blob) => {
      beaconCalls.push({ endpoint, blob });
      return beaconResult;
    },
  },
  configurable: true,
});
Object.defineProperty(globalThis, "fetch", {
  value: (endpoint: string, init?: RequestInit) => {
    fetchCalls.push({ endpoint, init });
    return Promise.resolve(new Response(null, { status: 202 }));
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
  assert.equal(payload.schema_version, 2);
  assert.equal(payload.source_type, "web_client");
  assert.equal(payload.pathname, "/it/quiz/ccna");
  assert.match(payload.event_id, /^[0-9a-f-]{36}$/i);
  assert.match(payload.page_view_id, /^[0-9a-f-]{36}$/i);
  assert.equal(payload.referrer_origin, "https://example.com");
  assert.equal(payload.referrer_path, "/source");
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

test("page_view_id changes when pathname changes", async () => {
  const { trackFunnelEvent } = await analyticsModule;
  beaconCalls.length = 0;
  (globalThis as any).window.location = { pathname: "/it/quiz/ccna", search: "", hash: "" };
  trackFunnelEvent({ event: "page_a" });
  const first = JSON.parse(await beaconCalls.at(-1)!.blob.text());

  (globalThis as any).window.location = { pathname: "/it/quiz/ceh", search: "", hash: "" };
  trackFunnelEvent({ event: "page_b" });
  const second = JSON.parse(await beaconCalls.at(-1)!.blob.text());

  assert.notEqual(first.page_view_id, second.page_view_id);
});

test("query string and hash changes do not create a new page_view_id", async () => {
  const { trackFunnelEvent } = await analyticsModule;
  beaconCalls.length = 0;
  (globalThis as any).window.location = { pathname: "/en/quiz/icdl", search: "?a=1", hash: "#one" };
  trackFunnelEvent({ event: "query_a" });
  const first = JSON.parse(await beaconCalls.at(-1)!.blob.text());

  (globalThis as any).window.location = { pathname: "/en/quiz/icdl", search: "?a=2", hash: "#two" };
  trackFunnelEvent({ event: "query_b" });
  const second = JSON.parse(await beaconCalls.at(-1)!.blob.text());

  assert.equal(first.page_view_id, second.page_view_id);
  assert.equal(first.pathname, "/en/quiz/icdl");
  assert.equal(second.pathname, "/en/quiz/icdl");
});

test("client_sequence increases monotonically in the browser session", async () => {
  const { trackFunnelEvent } = await analyticsModule;
  beaconCalls.length = 0;
  trackFunnelEvent({ event: "sequence_a" });
  trackFunnelEvent({ event: "sequence_b" });

  const first = JSON.parse(await beaconCalls[0].blob.text());
  const second = JSON.parse(await beaconCalls[1].blob.text());
  assert.equal(second.client_sequence, first.client_sequence + 1);
  assert.equal(sessionStore.get("cq_analytics_sequence"), String(second.client_sequence));
});

test("beacon rejection falls back to fetch with the identical logical event payload", async () => {
  const { trackFunnelEvent } = await analyticsModule;
  beaconCalls.length = 0;
  fetchCalls.length = 0;
  beaconResult = false;

  trackFunnelEvent({ event: "fallback_event", metadata: { reason: "test" } });

  beaconResult = true;
  assert.equal(beaconCalls.length, 1);
  assert.equal(fetchCalls.length, 1);
  const beaconPayload = await beaconCalls[0].blob.text();
  assert.equal(fetchCalls[0].init?.body, beaconPayload);
  const payload = JSON.parse(beaconPayload);
  assert.match(payload.event_id, /^[0-9a-f-]{36}$/i);
  assert.deepEqual(payload.metadata, { reason: "test" });
});

test("storage failures preserve best-effort V2 delivery with a monotonic fallback sequence", async () => {
  const { trackFunnelEvent } = await analyticsModule;
  const workingStorage = globalThis.sessionStorage;
  Object.defineProperty(globalThis, "sessionStorage", {
    value: {
      getItem: () => { throw new Error("storage unavailable"); },
      setItem: () => { throw new Error("storage unavailable"); },
    },
    configurable: true,
  });
  beaconCalls.length = 0;

  trackFunnelEvent({ event: "storage_failure_a" });
  trackFunnelEvent({ event: "storage_failure_b" });

  Object.defineProperty(globalThis, "sessionStorage", {
    value: workingStorage,
    configurable: true,
  });
  const first = JSON.parse(await beaconCalls[0].blob.text());
  const second = JSON.parse(await beaconCalls[1].blob.text());
  assert.equal(first.session_id, null);
  assert.equal(second.client_sequence, first.client_sequence + 1);
});
