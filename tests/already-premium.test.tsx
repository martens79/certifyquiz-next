import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import AlreadyPremiumNotice from "../src/components/billing/AlreadyPremiumNotice";
import {
  ALREADY_ACTIVE_COPY,
  alreadyActiveCopy,
  isAlreadyActiveCheckoutResponse,
  isPaymentIssueCheckoutResponse,
  profileHref,
} from "../src/lib/billing-recovery";

const LANGS = ["it", "en", "fr", "es"] as const;
const decode = (html: string) => html.replace(/&#x27;/g, "'").replace(/&amp;/g, "&");
const render = (lang: string) => decode(renderToStaticMarkup(createElement(AlreadyPremiumNotice, { lang })));

test("the refusal is recognised only for SUBSCRIPTION_ALREADY_ACTIVE on HTTP 400 (the real backend contract)", () => {
  const real = { error: "Premium subscription already exists", code: "SUBSCRIPTION_ALREADY_ACTIVE" };
  assert.equal(isAlreadyActiveCheckoutResponse(400, real), true);
  assert.equal(isAlreadyActiveCheckoutResponse(200, real), false);
  assert.equal(isAlreadyActiveCheckoutResponse(409, real), false);
  assert.equal(isAlreadyActiveCheckoutResponse(400, { error: "Invalid plan" }), false, "other 400s stay generic errors");
  assert.equal(isAlreadyActiveCheckoutResponse(400, { code: "SUBSCRIPTION_PAYMENT_ISSUE" }), false);
  assert.equal(isAlreadyActiveCheckoutResponse(400, null), false);
  assert.equal(isAlreadyActiveCheckoutResponse(400, "SUBSCRIPTION_ALREADY_ACTIVE"), false);
});

test("the payment-issue refusal keeps its own path and is not swallowed by the new one", () => {
  const issue = { error: "Premium subscription already exists", code: "SUBSCRIPTION_PAYMENT_ISSUE", status: "past_due", portal: true };
  assert.equal(isPaymentIssueCheckoutResponse(400, issue), true);
  assert.equal(isAlreadyActiveCheckoutResponse(400, issue), false);
});

test("copy exists in all four languages and exposes no technical detail", () => {
  for (const lang of LANGS) {
    const c = ALREADY_ACTIVE_COPY[lang];
    assert.ok(c.title.length > 3 && c.body.length > 40 && c.cta.length > 3, `${lang} copy`);
    for (const text of [c.title, c.body, c.cta]) {
      assert.doesNotMatch(text, /SUBSCRIPTION_|stripe|undefined|error|400/i, `${lang} leaks a technical term`);
    }
  }
  assert.equal(alreadyActiveCopy("de").title, ALREADY_ACTIVE_COPY.en.title, "unknown language falls back to English");
  assert.equal(new Set(LANGS.map((l) => ALREADY_ACTIVE_COPY[l].title)).size, 4, "each language has its own text");
});

test("the profile link is localised: EN at the root, other languages prefixed", () => {
  assert.equal(profileHref("en"), "/profile");
  assert.equal(profileHref("it"), "/it/profile");
  assert.equal(profileHref("fr"), "/fr/profile");
  assert.equal(profileHref("es"), "/es/profile");
  assert.equal(profileHref(undefined), "/profile");
});

test("the notice is a status (not an alert), shows the localised text and links to the profile", () => {
  for (const lang of LANGS) {
    const html = render(lang);
    assert.ok(html.includes(ALREADY_ACTIVE_COPY[lang].title), `${lang} title`);
    assert.ok(html.includes(ALREADY_ACTIVE_COPY[lang].body), `${lang} body`);
    assert.ok(html.includes(ALREADY_ACTIVE_COPY[lang].cta), `${lang} cta`);
    assert.ok(html.includes('role="status"') && !html.includes('role="alert"'));
    assert.ok(html.includes(`href="${profileHref(lang)}"`), `${lang} profile link`);
    assert.equal(html.includes("<button"), false, "no checkout or portal button: nothing to buy");
  }
});

const pricing = readFileSync(new URL("../src/app/(marketing)/pricing/PremiumComingSoonView.tsx", import.meta.url), "utf8");

test("pricing: the already-active refusal returns before the generic error path, with no new checkout", () => {
  const handled = pricing.indexOf("isAlreadyActiveCheckoutResponse(res.status, data)");
  const generic = pricing.indexOf('throw new Error(data?.error || "Failed")');
  const alertAt = pricing.indexOf("alert(t.checkoutError)");
  assert.ok(handled > 0 && generic > handled && alertAt > generic, "expected refusal is handled first");
  const branch = pricing.slice(handled, generic).replace(/\/\/.*$/gm, ""); // senza commenti
  assert.match(branch, /setAlreadyActive\(true\)/);
  assert.match(branch, /inFlightRef\.current = false/);
  assert.match(branch, /return;/);
  assert.doesNotMatch(branch, /checkout_failed|alert\(|window\.location/, "expected refusal is not a failure and does not navigate");
  assert.match(pricing, /\{alreadyActive && <AlreadyPremiumNotice lang=\{lang\} \/>\}/);
  assert.match(pricing, /setAlreadyActive\(false\);/, "a new attempt clears the previous notice");
});

test("pricing: PR #179 events and the generic failure path are untouched", () => {
  assert.match(pricing, /event: "pricing_plan_selected"/);
  assert.match(pricing, /event: "checkout_failed"/);
  assert.match(pricing, /failure_stage: "checkout_creation_or_redirect"/);
  assert.match(pricing, /alert\(t\.checkoutError\)/, "other failures still show the generic message");
});
