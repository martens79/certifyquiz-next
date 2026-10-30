import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  RECOVERY_COPY,
  isPaymentIssueCheckoutResponse,
  isStripePortalUrl,
  needsPaymentRecovery,
  recoveryCopy,
  requestPortalUrl,
} from "../src/lib/billing-recovery.ts";

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

test("only past_due and unpaid need payment recovery; no other state opens the recovery path", () => {
  assert.equal(needsPaymentRecovery("past_due"), true);
  assert.equal(needsPaymentRecovery("unpaid"), true);
  for (const s of ["active", "trialing", "canceled", "incomplete", "incomplete_expired", "paused", "", null, undefined]) {
    assert.equal(needsPaymentRecovery(s as string | null | undefined), false, String(s));
  }
});

test("the checkout refusal is recognised only for the payment-issue code on HTTP 400", () => {
  assert.equal(isPaymentIssueCheckoutResponse(400, { error: "Premium subscription already exists", code: "SUBSCRIPTION_PAYMENT_ISSUE", portal: true }), true);
  assert.equal(isPaymentIssueCheckoutResponse(400, { code: "SUBSCRIPTION_ALREADY_ACTIVE" }), false);
  assert.equal(isPaymentIssueCheckoutResponse(400, { error: "Premium subscription already exists" }), false, "older backend without the code");
  assert.equal(isPaymentIssueCheckoutResponse(500, { code: "SUBSCRIPTION_PAYMENT_ISSUE" }), false);
  assert.equal(isPaymentIssueCheckoutResponse(400, null), false);
  assert.equal(isPaymentIssueCheckoutResponse(400, "SUBSCRIPTION_PAYMENT_ISSUE"), false);
});

test("only the Stripe billing portal over https is an acceptable redirect target", () => {
  assert.equal(isStripePortalUrl("https://billing.stripe.com/p/session/test_abc"), true);
  for (const bad of [
    "http://billing.stripe.com/p/session/x",
    "https://billing.stripe.com.evil.example/p/session/x",
    "https://evil.example/?u=https://billing.stripe.com/",
    "https://user:pw@billing.stripe.com/p/session/x",
    "https://checkout.stripe.com/c/pay/x",
    "javascript:alert(1)",
    "//billing.stripe.com/x",
    "",
    null,
    undefined,
    42,
  ]) {
    assert.equal(isStripePortalUrl(bad), false, String(bad));
  }
});

test("a custom portal domain is accepted only when explicitly configured", () => {
  const custom = "https://billing.example.test/p/session/x";
  assert.equal(isStripePortalUrl(custom), false, "not allowed by default");
  assert.equal(isStripePortalUrl(custom, ["billing.stripe.com", "billing.example.test"]), true);
  assert.equal(isStripePortalUrl("https://billing.example.test.evil.example/x", ["billing.example.test"]), false);
});

test("requestPortalUrl returns the portal URL and never invents or follows another one", async () => {
  assert.deepEqual(await requestPortalUrl(async () => json(200, { url: "https://billing.stripe.com/p/session/ok" })), { ok: true, url: "https://billing.stripe.com/p/session/ok" });
  assert.deepEqual(await requestPortalUrl(async () => json(200, { url: "https://evil.example/phish" })), { ok: false, reason: "untrusted_url" });
  assert.deepEqual(await requestPortalUrl(async () => json(200, {})), { ok: false, reason: "untrusted_url" });
  assert.deepEqual(await requestPortalUrl(async () => json(400, { code: "NO_STRIPE_CUSTOMER" })), { ok: false, reason: "no_customer" });
  assert.deepEqual(await requestPortalUrl(async () => json(500, { code: "PORTAL_UNAVAILABLE" })), { ok: false, reason: "unavailable" });
  assert.deepEqual(await requestPortalUrl(async () => new Response("<html>", { status: 502 })), { ok: false, reason: "unavailable" });
  assert.deepEqual(await requestPortalUrl(async () => { throw new Error("network"); }), { ok: false, reason: "unavailable" });
});

test("copy exists in all four languages, with no trial or PDF wording (those rules are untouched)", () => {
  assert.deepEqual(Object.keys(RECOVERY_COPY).sort(), ["en", "es", "fr", "it"]);
  for (const [lang, copy] of Object.entries(RECOVERY_COPY)) {
    for (const [key, value] of Object.entries(copy)) {
      assert.ok(value.length > 10, `${lang}.${key} is empty`);
      assert.doesNotMatch(value, /\b(?:7|pdf|trial|prova|essai|prueba)\b/i, `${lang}.${key} must not touch trial/PDF wording`);
    }
  }
  assert.equal(recoveryCopy("xx"), RECOVERY_COPY.en);
  assert.equal(recoveryCopy(undefined), RECOVERY_COPY.en);
  assert.equal(recoveryCopy("fr"), RECOVERY_COPY.fr);
});

// ---- wiring: the pages use the helper, and the Premium rules were not edited -----------------------------------------
const profile = readFileSync(new URL("../src/app/[lang]/profile/profile-client.tsx", import.meta.url), "utf8");
const pricing = readFileSync(new URL("../src/app/(marketing)/pricing/PremiumComingSoonView.tsx", import.meta.url), "utf8");

test("profile: the subscription card also renders for a payment problem, not only for active Premium", () => {
  assert.match(profile, /\(user\?\.premium \|\| paymentRecovery\)/);
  assert.match(profile, /needsPaymentRecovery\(subStatus\?\.status\)/);
  assert.match(profile, /requestPortalUrl\(/);
  assert.doesNotMatch(profile, /\{user\?\.premium && \(\s*<div className="rounded-2xl bg-white shadow ring-1 ring-black\/5 p-4">/);
});

test("pricing: a payment-issue refusal shows the recovery banner instead of a generic alert, and does not retry the checkout", () => {
  assert.match(pricing, /isPaymentIssueCheckoutResponse\(res\.status, data\)/);
  assert.match(pricing, /setPaymentIssue\(true\)/);
  assert.match(pricing, /requestPortalUrl\(\(\) => authFetch\("\/api\/backend\/billing\/create-portal-session"/);
});

test("trial length, PDF rules and promotions are not part of this change", () => {
  for (const source of [profile, pricing]) {
    assert.match(source, /skipTrial|premium_monthly|trial/i); // files still carry their original content
  }
  assert.match(pricing, /7gg gratis/);
  assert.match(pricing, /7 days free/);
  assert.match(pricing, /trialPdfNotice/);
});
