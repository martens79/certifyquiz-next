import assert from "node:assert/strict";
import test from "node:test";
import React from "react";
import { act, create, type ReactTestRenderer } from "react-test-renderer";
import { clientComponent } from "./helpers/client-component";
import * as labels from "../src/lib/commercial-packages";
import * as paths from "../src/lib/paths";
import * as intent from "../src/lib/package-intent";
import { isCheckoutAllowedHost, CHECKOUT_BLOCKED_NOTICE } from "../src/lib/checkout-intent";

(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;
const offer = { code: "ccna-complete", productCode: "octopus-complete", amountMinor: 2490, currency: "EUR", checkoutAvailable: true, blockedReason: null, status: "active" };
function fixture({ authed = false, blocked = false, status = 200, loading = false } = {}) {
  const bodies: Array<Record<string, unknown>> = []; const created: unknown[] = [];
  const win = { location: { search: "?source=mock_review&package_offer=ccna-complete", hostname: "localhost", href: "" } };
  let epoch = 0, discards = 0, failureCode = "CHECKOUT_FAILED";
  let okBody: unknown = { url: "https://checkout.stripe.test/stub", sessionId: "cs_stub" };
  const state = { user: authed ? { id: 123, premium: false } : null, isAdmin: false, loading };
  const posts: string[] = []; const redirects: string[] = []; const events: unknown[] = [];
  let responseStatus = status;
  const Component = clientComponent("../../src/components/certification/CertificationPackageOffers.tsx", {
    "@/lib/checkout-analytics": {
      checkoutRequest: async () => ({ requestId: `request-${epoch}`, analytics: { analytics_consent: false } }),
      discardCheckoutRequest: () => { epoch++; discards++; },
    },
    "next/navigation": { useRouter: () => ({ push: (p: string) => redirects.push(p) }), usePathname: () => "/es/certificaciones/ccna" },
    "@/components/auth/AuthProvider": { useAuth: () => state },
    "@/hooks/useTwa": { useTwa: () => false }, "@/lib/twa": { detectTwa: () => false },
    "@/lib/paths": paths, "@/lib/commercial-packages": labels,
    "@/lib/package-intent": { ...intent, savePackageIntent: () => {}, readPackageIntent: () => null },
    "@/lib/checkout-intent": { isCheckoutAllowedHost, CHECKOUT_BLOCKED_NOTICE },
    "@/lib/post-gate-tracking": { readPostGateCohort: () => null },
    "@/lib/commercial-origin": { resolveCommercialOrigin: () => ({ paywallType: "mock_review" }) },
    "@/lib/analytics": { analyticsUserStateFrom: () => "free", getAnonymousSessionId: () => undefined, getAnonymousVisitorId: () => undefined,
      trackEvent: () => {}, trackEventOnce: () => {}, trackCheckoutCreated: (id: unknown) => { created.push(id); }, trackFunnelEventOnce: () => {}, trackFunnelEvent: (v: unknown) => events.push(v) },
    "@/lib/auth": { apiFetch: async (path: string, init?: RequestInit) => {
      if (!init) return new Response(JSON.stringify({ offers: [{ ...offer, blockedReason: blocked ? "already_owned" : null }] }));
      posts.push(path);
      if (path === "/packages/checkout") { bodies.push(JSON.parse(String(init.body))); return new Response(JSON.stringify(responseStatus === 200 ? okBody : { error: failureCode }), { status: responseStatus }); }
      return new Response("{}");
    } },
  }, { window: win, document: { getElementById: () => ({ closest: () => ({ scrollIntoView: () => {} }), scrollIntoView: () => {} }) } });
  let r!: ReactTestRenderer;
  return { state, posts, redirects, events, bodies, created, href: () => win.location.href, setBody: (b: unknown) => { okBody = b; }, fail: (status: number, code: string) => { responseStatus = status; failureCode = code; }, discards: () => discards, setStatus: (s: number) => { responseStatus = s; },
    root: () => r.root, mount: async () => { await act(async () => { r = create(<Component lang="es" certificationSlug="ccna" resources={null} />); }); },
    unmount: async () => { await act(async () => r.unmount()); } };
}
test("guest choice goes to login with exact offer and mock context, no checkout", async () => {
  const f = fixture(); await f.mount();
  await act(async () => f.root().findByType("button").props.onClick());
  const u = new URL(f.redirects[0], "https://example.test");
  const back = new URL(u.searchParams.get("redirect")!, u);
  assert.equal(back.pathname, "/es/certificaciones/ccna");
  assert.equal(back.searchParams.get("package_offer"), "ccna-complete");
  assert.equal(back.searchParams.get("source"), "mock_review");
  assert.equal(back.hash, "#package-resume"); assert.equal(f.posts.length, 0);
  await f.unmount();
});
test("restored choice is highlighted but never starts checkout automatically", async () => {
  const f = fixture({ authed: true }); await f.mount();
  assert.equal(f.posts.length, 0); assert.equal(f.root().findAllByProps({ role: "status" }).length, 1);
  // A's exact-offer fragment and B's selected-card fragment must coexist.
  const anchor = f.root().findByProps({ id: "package-offer-ccna-complete" });
  const selected = f.root().findByProps({ id: "package-resume" });
  assert.equal(anchor.parent, selected.parent);
  await f.unmount();
});
test("two synchronous clicks produce one checkout and one attempted event", async () => {
  const f = fixture({ authed: true }); await f.mount();
  const click = f.root().findByType("button").props.onClick;
  await act(async () => { await Promise.all([click(), click()]); });
  assert.equal(f.posts.filter(p => p === "/packages/checkout").length, 1);
  assert.equal(f.events.filter((e: any) => e.event === "checkout_attempted").length, 1);
  await f.unmount();
});
test("failed checkout can be retried after the request completes", async () => {
  const f = fixture({ authed: true, status: 500 }); await f.mount();
  await act(async () => f.root().findByType("button").props.onClick());
  assert.equal(f.root().findByType("button").props.disabled, false);
  f.setStatus(200); await act(async () => f.root().findByType("button").props.onClick());
  assert.equal(f.posts.filter(p => p === "/packages/checkout").length, 2);
  await f.unmount();
});
test("expired authentication returns to login preserving the offer, no loop", async () => {
  const f = fixture({ authed: true, status: 401 }); await f.mount();
  await act(async () => f.root().findByType("button").props.onClick());
  assert.equal(f.redirects.length, 1); assert.match(decodeURIComponent(f.redirects[0]), /package_offer=ccna-complete/);
  await f.unmount();
});
test("owned offer cannot initiate checkout", async () => {
  const f = fixture({ authed: true, blocked: true }); await f.mount();
  assert.equal(f.root().findByType("button").props.disabled, true);
  await act(async () => f.root().findByType("button").props.onClick());
  assert.equal(f.posts.length, 0); await f.unmount();
});
test("no offer or purchase action is available during auth bootstrap", async () => {
  const f = fixture({ loading: true }); await f.mount();
  assert.equal(f.root().findAllByType("button").length, 0); assert.equal(f.posts.length, 0); await f.unmount();
});

for (const [label, body] of [["null", { url: null, sessionId: "cs_stub", reused: true }], ["empty", { url: "", sessionId: "cs_stub" }], ["whitespace", { url: "   ", sessionId: "cs_stub" }], ["number", { url: 42, sessionId: "cs_stub" }], ["missing", { sessionId: "cs_stub" }], ["array", { url: ["https://x.test"] }]] as const) {
  test(`200 with ${label} checkout URL: no navigation, no created event, busy reset, same idempotency key on retry`, async () => {
    const f = fixture({ authed: true }); f.setBody(body); await f.mount();
    await act(async () => f.root().findByType("button").props.onClick());
    assert.equal(f.href(), ""); assert.equal(f.created.length, 0);
    assert.equal(f.root().findByType("button").props.disabled, false);
    assert.equal(f.root().findAllByProps({ role: "alert" }).length > 0, true);
    f.setBody({ url: "https://checkout.stripe.test/stub", sessionId: "cs_stub" });
    await act(async () => f.root().findByType("button").props.onClick());
    assert.equal(f.href(), "https://checkout.stripe.test/stub"); assert.equal(f.created.length, 1);
    assert.equal(f.bodies.length, 2); assert.equal(f.bodies[0].idempotencyKey, f.bodies[1].idempotencyKey);
    assert.equal(f.bodies[0].offerCode, "ccna-complete");
    await f.unmount();
  });
}
test("URL with surrounding whitespace is trimmed before navigation", async () => {
  const f = fixture({ authed: true }); f.setBody({ url: "  https://checkout.stripe.test/stub \n", sessionId: "cs_stub" }); await f.mount();
  await act(async () => f.root().findByType("button").props.onClick());
  assert.equal(f.href(), "https://checkout.stripe.test/stub"); await f.unmount();
});

const text = (f: ReturnType<typeof fixture>) => JSON.stringify(f.root().findByProps({ role: "alert" }).children);
test("NOT_REUSABLE: key discarded, no automatic checkout, next explicit click uses a new request id", async () => {
  const f = fixture({ authed: true }); await f.mount();
  f.fail(409, "CHECKOUT_SESSION_NOT_REUSABLE");
  await act(async () => f.root().findByType("button").props.onClick());
  assert.equal(f.discards(), 1);
  assert.equal(f.posts.filter(p => p === "/packages/checkout").length, 1, "no automatic resend");
  assert.equal(f.href(), ""); assert.equal(f.created.length, 0);
  assert.equal(f.root().findByType("button").props.disabled, false);
  assert.match(text(f), /caducado/);
  f.setStatus(200);
  await act(async () => f.root().findByType("button").props.onClick());
  assert.equal(f.bodies.length, 2); assert.notEqual(f.bodies[0].idempotencyKey, f.bodies[1].idempotencyKey);
  assert.equal(f.href(), "https://checkout.stripe.test/stub");
  await f.unmount();
});
test("NOT_REUSABLE with a double click still sends one request before and one after", async () => {
  const f = fixture({ authed: true }); await f.mount();
  f.fail(409, "CHECKOUT_SESSION_NOT_REUSABLE");
  const click = f.root().findByType("button").props.onClick;
  await act(async () => { await Promise.all([click(), click()]); });
  assert.equal(f.posts.filter(p => p === "/packages/checkout").length, 1);
  assert.equal(f.discards(), 1);
  await f.unmount();
});
for (const [status, code, pattern] of [[409, "CHECKOUT_ALREADY_COMPLETED", /ya está completado/], [503, "CHECKOUT_STATE_UNCERTAIN", /verificando/], [409, "CHECKOUT_ALREADY_IN_PROGRESS", /pago en curso/], [500, "CHECKOUT_FAILED", /No se pudo iniciar/]] as const) {
  test(`${code}: key kept, no new checkout, explicit retry reuses the same request id`, async () => {
    const f = fixture({ authed: true }); await f.mount();
    f.fail(status, code);
    await act(async () => f.root().findByType("button").props.onClick());
    assert.equal(f.discards(), 0);
    assert.equal(f.posts.filter(p => p === "/packages/checkout").length, 1, "no automatic resend");
    assert.equal(f.href(), ""); assert.equal(f.root().findByType("button").props.disabled, false);
    assert.match(text(f), pattern);
    await act(async () => f.root().findByType("button").props.onClick());
    assert.equal(f.bodies[0].idempotencyKey, f.bodies[1].idempotencyKey);
    await f.unmount();
  });
}
