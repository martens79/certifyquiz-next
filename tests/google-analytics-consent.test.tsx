import assert from "node:assert/strict";
import test from "node:test";
import React from "react";
import { act, create, type ReactTestRenderer } from "react-test-renderer";
import { runInNewContext } from "node:vm";
import { clientComponent } from "./helpers/client-component";

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

test("GA scripts and config require ready, explicitly granted consent; revocation updates the existing runtime", async () => {
  let consent = { ready: false, status: "unknown" };
  let pathname = "/packages/success";
  let flushed = 0;
  const calls: unknown[][] = [];
  const browser: any = { location: { href: "https://example.test/packages/success?order_id=existing-order" } };
  const GA = clientComponent("../../src/components/analytics/GoogleAnalytics.tsx", {
    "next/script": { __esModule: true, default: (props: any) => React.createElement("script", props) },
    "next/navigation": { usePathname: () => pathname },
    "@/components/analytics/ConsentProvider": { useConsent: () => consent },
    "@/lib/analytics": { flushPendingAnalyticsEvents: () => { flushed++; } },
    "@/lib/analytics-privacy": { isSensitiveAnalyticsPath: (p: string) => p === "/auth/callback", SENSITIVE_QUERY_KEYS: ["token"] },
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
  assert.ok(browser.dataLayer.some((args: any) => args[0] === "config"));
  assert.equal(browser.dataLayer.find((args: any) => args[0] === "consent")[2].analytics_storage, "granted");
  scripts[1].props.onReady(); assert.equal(flushed, 1);
  browser.gtag = (...args: unknown[]) => calls.push(args);
  await update(true, "denied");
  assert.equal(renderer.toJSON(), null, "no tag is rendered after revocation");
  assert.equal(calls.at(-1)?.[0], "consent");
  assert.equal((calls.at(-1)?.[2] as any).analytics_storage, "denied");
  assert.equal(typeof browser.gtag, "function", "React unmount does NOT remove Google's loaded runtime");
  assert.equal(calls.filter(args => args[0] === "config").length, 0, "revocation does not configure a new tag");
  await update(true, "granted"); assert.equal(renderer.root.findAllByType("script").length, 2);
  pathname = "/auth/callback";
  await update(true, "granted"); assert.equal(renderer.toJSON(), null, "sensitive routes remain excluded");
  await act(async () => renderer.unmount());
});
