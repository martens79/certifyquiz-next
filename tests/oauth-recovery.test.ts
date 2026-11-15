import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import ts from "typescript";
import { buildPostAuthRecoveryHref, readConversionContext, withConversionContext, safePostAuthRedirect } from "../src/lib/conversion-context";

const complete = "/es/certificaciones/ccna?source=mock_review&package_offer=ccna-complete#package-resume";
const premium = "/it/prezzi?certification_slug=ccna&plan=premium_annual&resume=1&cta=mock_review";
for (const destination of [complete, premium, "/fr/certifications/ccna#package-offer-complete", "/pricing?plan=premium_monthly&resume=1"]) {
  test(`recovery preserves the whole destination and register round-trip: ${destination}`, () => {
    const login = new URL(buildPostAuthRecoveryHref(destination), "https://isolated.test");
    assert.equal(login.searchParams.get("redirect"), destination);
    const context = readConversionContext(login.searchParams);
    const register = new URL(withConversionContext("/es/register", context), login);
    assert.equal(readConversionContext(register.searchParams).redirect, destination);
  });
}
for (const value of ["//evil.test", "/%2f%2fevil.test", "/\\evil.test", "/a\npath", "https://evil.test", null]) {
  test(`recovery rejects unsafe redirect ${JSON.stringify(value)}`, () => {
    const url = new URL(buildPostAuthRecoveryHref(value), "https://isolated.test");
    assert.equal(url.pathname, "/login");
    assert.equal(url.searchParams.get("redirect"), "/");
  });
}
test("localized profile aliases remain normalized", () => {
  const url = new URL(buildPostAuthRecoveryHref("/it/profilo"), "https://isolated.test");
  assert.equal(url.pathname, "/it/login");
  assert.equal(url.searchParams.get("redirect"), "/it/profile");
});

// Executes the current callback component/effect with explicit boundaries only.
async function callback({ token = "synthetic", status = 200, networkError = false, changedGeneration = false }: { token?: string; status?: number; networkError?: boolean; changedGeneration?: boolean } = {}) {
  const redirects: string[] = [], accepted: string[] = [], effects: Array<() => void> = [];
  let generation = 0, requests = 0;
  const params = new URLSearchParams({ redirect: complete });
  if (token) params.set("token", token);
  const mocks: Record<string, unknown> = {
    react: { useEffect: (fn: () => void) => effects.push(fn), useRef: () => ({ current: false }) },
    "react/jsx-runtime": { jsx: () => null },
    "next/navigation": { useRouter: () => ({ replace: (url: string) => redirects.push(url) }), useSearchParams: () => params },
    "@/lib/conversion-context": { buildPostAuthRecoveryHref, safePostAuthRedirect },
    "@/lib/auth-session": { authGeneration: () => generation, assertAuthGeneration: (expected: number) => { if (generation !== expected) throw Error("stale auth"); } },
    "@/lib/auth": { backendUrl: (p: string) => p, acceptLoginToken: (v: string) => accepted.push(v), setUser: () => {} },
  };
  const module = { exports: {} as { default: () => unknown } };
  const source = readFileSync(new URL("../src/app/auth/callback/CallbackClient.tsx", import.meta.url), "utf8");
  const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX } }).outputText;
  runInNewContext(code, {
    module, exports: module.exports,
    require: (name: string) => { if (!(name in mocks)) throw Error(`Unmocked import ${name}`); return mocks[name]; },
    window: { history: { replaceState: () => {} } },
    fetch: async () => { requests++; if (changedGeneration) generation++; if (networkError) throw Error("synthetic network failure"); return { ok: status === 200, json: async () => ({ user: { id: "synthetic" } }) }; },
  });
  module.exports.default();
  effects.forEach(fn => fn());
  await new Promise(resolve => setImmediate(resolve));
  return { redirects, accepted, requests };
}
test("missing OAuth token returns to localized login with Complete choice", async () => {
  const r = await callback({ token: "" });
  assert.deepEqual(r.redirects, [buildPostAuthRecoveryHref(complete)]);
  assert.equal(r.requests, 0);
});
for (const status of [401, 500]) test(`auth/me ${status} preserves Complete return`, async () => {
  const r = await callback({ status });
  assert.deepEqual(r.redirects, [buildPostAuthRecoveryHref(complete)]);
  assert.equal(r.accepted.length, 0);
});
test("network failure preserves return", async () => {
  const r = await callback({ networkError: true });
  assert.deepEqual(r.redirects, [buildPostAuthRecoveryHref(complete)]);
});
test("successful OAuth still accepts token and returns directly", async () => {
  const r = await callback();
  assert.deepEqual(r.redirects, [complete]);
  assert.deepEqual(r.accepted, ["synthetic"]);
});
test("logout/session-generation change does not revive auth or redirect", async () => {
  const r = await callback({ changedGeneration: true });
  assert.deepEqual(r.redirects, []);
  assert.deepEqual(r.accepted, []);
});
