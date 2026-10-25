import assert from "node:assert/strict";
import test from "node:test";
import React from "react";
import { act, create, type ReactTestRenderer } from "react-test-renderer";
import { clientComponent } from "./helpers/client-component";
import { packageKind } from "../src/lib/commercial-packages";
import { certPath } from "../src/lib/paths";

(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;
for (const lang of ["it", "en", "fr", "es"] as const) {
  test(`Complete navigation preserves ${lang}, certificate and paywall without checkout`, async () => {
    const calls: string[] = []; const events: unknown[] = [];
    const Component = clientComponent("../../src/components/quiz/MockCompleteLink.tsx", {
      "@/components/auth/AuthProvider": { useAuth: () => ({ loading: false, user: null }) },
      "@/hooks/useTwa": { useTwa: () => false }, "@/lib/twa": { detectTwa: () => false },
      "@/lib/auth": { apiFetch: async (path: string) => { calls.push(path); return new Response(JSON.stringify({ offers: [{ code: "ccna-complete", productCode: "octopus-complete", checkoutAvailable: true }] })); } },
      "@/lib/analytics": { trackEvent: (...p: unknown[]) => events.push(p), trackFunnelEvent: (p: unknown) => events.push(p) },
      "@/lib/commercial-packages": { packageKind }, "@/lib/paths": { certPath },
    });
    let r!: ReactTestRenderer;
    await act(async () => { r = create(<Component lang={lang} certificationSlug="ccna" />); });
    const link = r.root.findByType("a");
    const url = new URL(link.props.href, "https://example.test");
    assert.equal(url.pathname, certPath(lang, "ccna")); assert.equal(url.hash, "#package-offer-ccna-complete");
    assert.equal(url.searchParams.get("package_offer"), "ccna-complete");
    assert.equal(url.searchParams.get("certification_slug"), "ccna");
    assert.equal(url.searchParams.get("source"), "mock_review");
    assert.deepEqual(calls, ["/packages/offers/ccna"]); assert.equal(events.length, 0);
    link.props.onClick(); assert.equal(events.length, 2);
    await act(async () => r.unmount());
  });
}
for (const variant of ["absent", "dark", "blocked", "unavailable", "error", "twa", "auth-loading"]) {
  test(`never advertises an unavailable Complete: ${variant}`, async () => {
    let calls = 0;
    const Component = clientComponent("../../src/components/quiz/MockCompleteLink.tsx", {
      "@/components/auth/AuthProvider": { useAuth: () => ({ loading: variant === "auth-loading", user: null }) },
      "@/hooks/useTwa": { useTwa: () => variant === "twa" }, "@/lib/twa": { detectTwa: () => false },
      "@/lib/auth": { apiFetch: async () => { calls++; if (variant === "error") throw Error("fixture"); return new Response(JSON.stringify({ darkLaunch: variant === "dark", offers: variant === "absent" ? [] : [{ code: "fixture-complete", productCode: "octopus-complete", checkoutAvailable: variant !== "unavailable", blockedReason: variant === "blocked" ? "owned" : null }] })); } },
      "@/lib/analytics": {}, "@/lib/commercial-packages": { packageKind }, "@/lib/paths": { certPath },
    });
    let r!: ReactTestRenderer;
    await act(async () => { r = create(<Component lang="es" certificationSlug="aws-ai-practitioner" />); });
    assert.equal(r.toJSON(), null);
    if (["twa", "auth-loading"].includes(variant)) assert.equal(calls, 0);
    await act(async () => r.unmount());
  });
}
