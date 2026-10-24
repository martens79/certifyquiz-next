import assert from "node:assert/strict";
import test from "node:test";
import React from "react";
import { act, create, type ReactTestRenderer } from "react-test-renderer";
import { runInNewContext } from "node:vm";
import { clientComponent } from "./helpers/client-component";
import { clientModule } from "./helpers/client-component";
import { googleConsentState, marketingConsentGranted } from "../src/lib/consent-mode";
import { sanitizeAnalyticsUrl } from "../src/lib/analytics-privacy";

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

test("GA scripts and config require ready, explicitly granted consent; revocation updates the existing runtime", async () => {
  let consent = { ready: false, status: "unknown" };
  let pathname = "/packages/success";
  let flushed = 0;
  const calls: unknown[][] = [];
  const browser: any = { location: { href: "https://example.test/packages/success?order_id=existing-order&token=fixture-token" } };
  const GA = clientComponent("../../src/components/analytics/GoogleAnalytics.tsx", {
    "next/script": { __esModule: true, default: (props: any) => React.createElement("script", props) },
    "next/navigation": { usePathname: () => pathname },
    "@/components/analytics/ConsentProvider": { useConsent: () => consent },
    "@/lib/analytics": { flushPendingAnalyticsEvents: () => { flushed++; } },
    "@/lib/analytics-privacy": { isSensitiveAnalyticsPath: (p: string) => p === "/auth/callback", sanitizeAnalyticsUrl },
    "@/lib/consent-mode": { googleConsentState },
    "@/lib/checkout-analytics": { readStoredAnalyticsConsent: () => consent.status },
  }, { process: { env: { NEXT_PUBLIC_GA_ID: "G-TESTONLY" } }, window: browser });
  let renderer!: ReactTestRenderer;
  const update = async (ready: boolean, status: string) => { consent = { ready, status }; await act(async () => renderer.update(<GA />)); };
  await act(async () => { renderer = create(<GA />); });
  assert.equal(renderer.toJSON(), null, "uninitialized consent loads no tag or inline config");
  await update(true, "unknown"); assert.equal(renderer.toJSON(), null);
  await update(true, "denied"); assert.equal(renderer.toJSON(), null);
  await update(false, "granted"); assert.equal(renderer.toJSON(), null);
  await update(true, "granted");
  const scripts = renderer.root.findAllByType("script");
  assert.equal(scripts.length, 2);
  assert.match(scripts[1].props.src, /^https:\/\/www.googletagmanager.com\/gtag\/js/);
  runInNewContext(scripts[0].props.children, { window: browser, URL });
  assert.equal(browser.dataLayer.some((args: any) => args[0] === "config"), false);
  const initial = browser.dataLayer.find((args: any) => args[0] === "consent")[2];
  for (const key of ["analytics_storage", "ad_storage", "ad_user_data", "ad_personalization"]) assert.equal(initial[key], "denied");
  const readyCallback = scripts[1].props.onReady;
  readyCallback(); assert.equal(flushed, 1);
  const config = browser.dataLayer.find((args: any) => args[0] === "config");
  assert.equal(config[2].allow_google_signals, false);
  assert.equal(config[2].allow_ad_personalization_signals, false);
  assert.equal(config[2].page_location, "https://example.test/packages/success?order_id=existing-order");
  const granted = browser.dataLayer.filter((args: any) => args[0] === "consent").at(-1)[2];
  assert.equal(granted.analytics_storage, "granted");
  for (const key of ["ad_storage", "ad_user_data", "ad_personalization"]) assert.equal(granted[key], "denied");
  browser.gtag = (...args: unknown[]) => calls.push(args);
  await update(true, "denied");
  assert.equal(renderer.toJSON(), null, "no tag is rendered after revocation");
  assert.equal(calls.at(-1)?.[0], "consent");
  assert.equal((calls.at(-1)?.[2] as any).analytics_storage, "denied");
  readyCallback(); // stale callback from before revocation
  assert.equal(flushed, 1);
  assert.equal(typeof browser.gtag, "function", "React unmount does NOT remove Google's loaded runtime");
  assert.equal(calls.filter(args => args[0] === "config").length, 0, "revocation does not configure a new tag");
  await update(true, "granted"); assert.equal(renderer.root.findAllByType("script").length, 2);
  pathname = "/auth/callback";
  await update(true, "granted"); assert.equal(renderer.toJSON(), null, "sensitive routes remain excluded");
  await act(async () => renderer.unmount());
});

test("a delayed first GA onReady after rejection cannot initialize or grant any purpose", async () => {
  let consent = { ready: true, status: "granted" };
  const calls: unknown[][] = [];
  const GA = clientComponent("../../src/components/analytics/GoogleAnalytics.tsx", {
    "next/script": { __esModule: true, default: (p: any) => React.createElement("script", p) },
    "next/navigation": { usePathname: () => "/" },
    "@/components/analytics/ConsentProvider": { useConsent: () => consent },
    "@/lib/analytics": { flushPendingAnalyticsEvents: () => { throw Error("must not flush"); } },
    "@/lib/analytics-privacy": { isSensitiveAnalyticsPath: () => false, sanitizeAnalyticsUrl: (s: string) => s },
    "@/lib/consent-mode": { googleConsentState },
    "@/lib/checkout-analytics": { readStoredAnalyticsConsent: () => consent.status },
  }, { process: { env: { NEXT_PUBLIC_GA_ID: "G-TESTONLY" } }, window: { gtag: (...a: unknown[]) => calls.push(a) } });
  let renderer!: ReactTestRenderer;
  await act(async () => { renderer = create(<GA />); });
  const ready = renderer.root.findAllByType("script")[1].props.onReady;
  consent = { ready: true, status: "denied" };
  ready();
  assert.equal(calls.some(a => a[0] === "config"), false);
  assert.deepEqual(calls.at(-1)?.[2], googleConsentState("denied"));
  await act(async () => renderer.unmount());
});

test("ConsentProvider stores/restores the analytics preference but never grants advertising", async () => {
  const values = new Map<string, string>([["cq_cookie_consent", '{"accepted":true}']]);
  const calls: unknown[][] = [];
  let revoked = 0;
  let context: any;
  const storage = { getItem: (k: string) => values.get(k) ?? null, setItem: (k: string, v: string) => values.set(k, v), removeItem: (k: string) => values.delete(k) };
  const mod = clientModule("../../src/components/analytics/ConsentProvider.tsx", {
    "@/lib/consent-mode": { googleConsentState },
    "@/lib/checkout-analytics": { readStoredAnalyticsConsent: () => JSON.parse(values.get("cq_cookie_consent") || "{}").accepted === true ? "granted" : "denied", revokeConversionConsent: () => { revoked++; } },
  }, { window: { gtag: (...a: unknown[]) => calls.push(a) }, localStorage: storage, sessionStorage: storage });
  const Provider = mod.ConsentProvider;
  const Consumer = () => { context = mod.useConsent(); return null; };
  let renderer!: ReactTestRenderer;
  await act(async () => { renderer = create(<Provider><Consumer /></Provider>); });
  assert.equal(context.ready, true); assert.equal(context.status, "granted");
  await act(async () => context.setConsent(false));
  assert.equal(context.status, "denied"); assert.ok(revoked > 0);
  assert.equal(JSON.parse(values.get("cq_cookie_consent")!).accepted, false);
  assert.equal(JSON.parse(values.get("cq:cookie-consent")!).status, "rejected");
  assert.equal(values.get("cookie-consent"), "rejected");
  assert.deepEqual(calls.at(-1)?.[2], googleConsentState("denied"));
  await act(async () => context.setConsent(true));
  assert.deepEqual(calls.at(-1)?.[2], googleConsentState("granted"));
  assert.equal(marketingConsentGranted(), false);
  await act(async () => renderer.unmount());
});

test("analytics acceptance neither loads Meta nor reactivates an existing pixel", async () => {
  let status = "granted";
  const calls: unknown[][] = [];
  const Pixel = clientComponent("../../src/components/analytics/MetaPixel.tsx", {
    "next/script": { __esModule: true, default: "script" },
    "next/navigation": { usePathname: () => "/" },
    "@/components/analytics/ConsentProvider": { useConsent: () => ({ ready: true, status }) },
    "@/lib/analytics-privacy": { isSensitiveAnalyticsPath: () => false },
    "@/lib/consent-mode": { marketingConsentGranted },
  }, { process: { env: { NEXT_PUBLIC_META_PIXEL_ID: "123456" } }, window: { fbq: (...a: unknown[]) => calls.push(a) } });
  let renderer!: ReactTestRenderer;
  await act(async () => { renderer = create(<Pixel />); });
  assert.equal(renderer.toJSON(), null);
  status = "denied";
  await act(async () => renderer.update(<Pixel />));
  status = "granted";
  await act(async () => renderer.update(<Pixel />));
  assert.equal(renderer.toJSON(), null);
  assert.ok(calls.length > 0);
  assert.ok(calls.every(a => a[0] === "consent" && a[1] === "revoke"));
  await act(async () => renderer.unmount());
});
