import assert from "node:assert/strict";
import test from "node:test";
import React from "react";
import { act, create, type ReactTestRenderer } from "react-test-renderer";
import { clientComponent, clientModule } from "./helpers/client-component";
import { readConversionContext } from "../src/lib/conversion-context";

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

function fixture(fetchOrder: (init?: RequestInit) => Promise<Response>) {
  const timers = new Map<number, () => Promise<void>>();
  let sequence = 0;
  let calls = 0;
  const query = new URLSearchParams("order_id=paid-order-876&source=receipt&tag=a&tag=b");
  const Component = clientComponent("../../src/components/packages/PackageSuccess.tsx", {
    "next/link": { __esModule: true, default: ({ children, ...props }: any) => React.createElement("a", props, children) },
    "next/navigation": { useSearchParams: () => query, usePathname: () => "/it/packages/success" },
    "@/lib/auth": { apiFetch: (_: string, init: RequestInit, options: any) => { assert.equal(options.redirectOnUnauthorized, false); calls++; return fetchOrder(init); } },
    "@/lib/analytics": { trackEventOnce: () => {} },
    "@/lib/commercial-packages": { activeUntilLabel: () => null, packageDisplayName: () => "CCNA Study" },
  }, {
    setTimeout: (callback: () => Promise<void>) => { timers.set(++sequence, callback); return sequence; },
    clearTimeout: (id: number) => timers.delete(id),
  });
  let renderer: ReactTestRenderer;
  return {
    Component, timers, query,
    calls: () => calls,
    renderer: () => renderer,
    mount: async (strict = false) => { await act(async () => { renderer = create(strict ? <React.StrictMode><Component lang="it" /></React.StrictMode> : <Component lang="it" />); }); },
    unmount: async () => { await act(async () => renderer.unmount()); },
    tick: async () => { const next = timers.entries().next().value; if (next) { timers.delete(next[0]); await act(async () => next[1]()); } },
  };
}
const response = (status: number, state = "pending") => Promise.resolve(new Response(JSON.stringify({ order: { status: state } }), { status }));

test("definitive 401 stops all polling and preserves the entire return query", async () => {
  const f = fixture(() => response(401));
  await f.mount();
  assert.match(JSON.stringify(f.renderer().toJSON()), /Accedi per verificare il tuo ordine/);
  assert.equal(f.timers.size, 0);
  await f.tick(); await f.tick();
  assert.equal(f.calls(), 1);
  const href = f.renderer().root.findByType("a").props.href;
  const login = new URL(href, "https://example.test");
  assert.equal(login.pathname, "/it/login");
  const returnTo = readConversionContext(login.searchParams).redirect;
  assert.equal(returnTo, `/it/packages/success?${f.query}`);
  assert.equal(new URL(returnTo!, login).searchParams.get("order_id"), "paid-order-876");
  await f.unmount();
});

test("pending payments poll serially and stop when paid", async () => {
  const f = fixture(() => response(200, f.calls() < 3 ? "pending" : "paid"));
  await f.mount();
  assert.equal(f.timers.size, 1);
  await f.tick(); assert.equal(f.calls(), 2); assert.equal(f.timers.size, 1);
  await f.tick(); assert.equal(f.calls(), 3); assert.equal(f.timers.size, 0);
  assert.match(JSON.stringify(f.renderer().toJSON()), /Accesso attivato/);
  await f.unmount();
});

test("a later 401 stops polling after a pending response", async () => {
  const f = fixture(() => response(f.calls() === 1 ? 200 : 401));
  await f.mount(); await f.tick(); await f.tick();
  assert.equal(f.calls(), 2); assert.equal(f.timers.size, 0);
  await f.unmount();
});

test("temporary API errors remain retryable and recover", async () => {
  const f = fixture(() => response(f.calls() === 1 ? 503 : 200, "paid"));
  await f.mount(); assert.equal(f.timers.size, 1);
  await f.tick(); assert.match(JSON.stringify(f.renderer().toJSON()), /Accesso attivato/);
  assert.equal(f.timers.size, 0); await f.unmount();
});

test("unmount clears scheduled polling", async () => {
  const f = fixture(() => response(200));
  await f.mount(); assert.equal(f.timers.size, 1);
  await f.unmount(); assert.equal(f.timers.size, 0);
  await f.tick(); assert.equal(f.calls(), 1);
});

test("Strict Mode effect replay leaves only one polling timer", async () => {
  const f = fixture(() => response(200));
  await f.mount(true);
  assert.equal(f.timers.size, 1);
  const before = f.calls();
  await f.tick();
  assert.equal(f.calls(), before + 1);
  assert.equal(f.timers.size, 1);
  await f.unmount(); assert.equal(f.timers.size, 0);
});

test("slow requests never overlap; unmount aborts and prevents late timers", async () => {
  let resolve!: (value: Response) => void;
  let signal: AbortSignal | undefined;
  const f = fixture((init) => { signal = init?.signal as AbortSignal; return new Promise(r => { resolve = r; }); });
  await f.mount(); await f.tick(); assert.equal(f.calls(), 1); assert.equal(f.timers.size, 0);
  await f.unmount(); assert.equal(signal?.aborted, true);
  await act(async () => resolve(await response(200)));
  assert.equal(f.timers.size, 0);
});

test("the actual login component returns to the existing order after login", async () => {
  const returnTo = "/it/packages/success?order_id=paid-order-876&source=receipt";
  const query = new URLSearchParams({ redirect: returnTo });
  const redirects: string[] = [];
  const router = { replace: (path: string) => redirects.push(path) };
  const Login = clientComponent("../../src/app/[lang]/login/login-client.tsx", {
    "next/link": { __esModule: true, default: "a" },
    "next/navigation": { usePathname: () => "/it/login", useRouter: () => router, useSearchParams: () => query },
    "lucide-react": { Eye: () => null, EyeOff: () => null },
    "@/lib/i18n": { langFromPathname: () => "it", getLabel: (labels: any) => labels.it, withLang: (_: string, p: string) => "/it" + p },
    "@/lib/auth": { getToken: () => null, backendUrl: (p: string) => "/api/backend" + p, acceptLoginToken: () => {}, setUser: () => {}, authHeader: () => ({}) },
    "@/lib/apiClient": { authMe: async () => ({ user: { id: 876 } }) },
    "@/lib/conversion-context": { readConversionContext, withConversionContext: (p: string) => p },
    "@/lib/checkout-intent": { CHECKOUT_SOURCE: "premium_checkout", checkoutAuthBanner: () => "" },
  }, { fetch: async () => new Response(JSON.stringify({ token: "synthetic-token", id: 876 })) });
  let renderer!: ReactTestRenderer;
  await act(async () => { renderer = create(<Login initialLang="it" />); });
  await act(async () => renderer.root.findByType("form").props.onSubmit({ preventDefault() {} }));
  assert.deepEqual(redirects, [returnTo]);
  await act(async () => renderer.unmount());
});

function authFixture(responses: Array<Response | Error>) {
  const store = new Map([["cq:access", "expired-test-token"]]);
  const storage = (values: Map<string, string>) => ({ getItem: (k: string) => values.get(k) ?? null, setItem: (k: string, v: string) => values.set(k, v), removeItem: (k: string) => values.delete(k) });
  const location = { pathname: "/it/packages/success", search: "?order_id=paid-order-876", href: "unchanged" };
  let calls = 0;
  const auth = clientModule("../../src/lib/auth.ts", { "./quiz-storage": { clearAllProgressForUser: () => {} } }, {
    window: { location, dispatchEvent: () => {} }, location, localStorage: storage(store), sessionStorage: storage(new Map()),
    FormData, CustomEvent,
    fetch: async () => { calls++; const r = responses.shift(); if (r instanceof Error) throw r; if (!r) throw new Error("unexpected request"); return r; },
  });
  return { auth, location, store, calls: () => calls };
}

test("expired-token refresh ends in a definitive 401 without an automatic redirect for PackageSuccess", async () => {
  const f = authFixture([new Response(null, { status: 401 }), new Response(null, { status: 401 })]);
  const result = await f.auth.apiFetch("/packages/orders/existing", {}, { redirectOnUnauthorized: false });
  assert.equal(result.status, 401); assert.equal(f.calls(), 2);
  assert.equal(f.location.href, "unchanged"); assert.equal(f.store.has("cq:access"), false);
});

test("successful refresh retries the order before returning to PackageSuccess", async () => {
  const f = authFixture([new Response(null, { status: 401 }), new Response(JSON.stringify({ token: "new-test-token" })), new Response(JSON.stringify({ order: { status: "paid" } }))]);
  const result = await f.auth.apiFetch("/packages/orders/existing", {}, { redirectOnUnauthorized: false });
  assert.equal(result.status, 200); assert.equal(f.calls(), 3);
  assert.equal(f.store.get("cq:access"), "new-test-token"); assert.equal(f.location.href, "unchanged");
});

test("temporary refresh failures preserve the token and remain retryable", async () => {
  for (const status of [429, 503]) {
    const f = authFixture([new Response(null, { status: 401 }), new Response(null, { status })]);
    const result = await f.auth.apiFetch("/packages/orders/existing", {}, { redirectOnUnauthorized: false });
    assert.equal(result.status, status); assert.equal(f.store.get("cq:access"), "expired-test-token");
    assert.equal(f.location.href, "unchanged");
  }
  const f = authFixture([new Response(null, { status: 401 }), new Error("offline")]);
  await assert.rejects(f.auth.apiFetch("/packages/orders/existing", {}, { redirectOnUnauthorized: false }), /offline/);
  assert.equal(f.store.get("cq:access"), "expired-test-token");
});

test("other apiFetch callers keep their existing unauthorized redirect behavior", async () => {
  const f = authFixture([new Response(null, { status: 401 }), new Response(null, { status: 401 })]);
  await f.auth.apiFetch("/protected");
  assert.match(f.location.href, /^\/it\/login\?redirect=/);
});
