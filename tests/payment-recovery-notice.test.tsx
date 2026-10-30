import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import PaymentRecoveryNotice from "../src/components/billing/PaymentRecoveryNotice";
import { RECOVERY_COPY } from "../src/lib/billing-recovery";

const LANGS = ["it", "en", "fr", "es"] as const;
const render = (props: Parameters<typeof PaymentRecoveryNotice>[0]) => renderToStaticMarkup(createElement(PaymentRecoveryNotice, props));
const decode = (html: string) => html.replace(/&#x27;/g, "'").replace(/&amp;/g, "&");

test("profile variant: explains that Premium is on hold, in every language, with no button of its own", () => {
  for (const lang of LANGS) {
    const html = decode(render({ lang, message: "body" }));
    assert.ok(html.includes(RECOVERY_COPY[lang].title), `${lang} title`);
    assert.ok(html.includes(RECOVERY_COPY[lang].body), `${lang} body`);
    assert.ok(html.includes('role="alert"'));
    assert.equal(html.includes("<button"), false, "the profile card already has its own manage button");
  }
});

test("checkout variant: shows the blocked-checkout message and a portal button that is wired to the handler", () => {
  for (const lang of LANGS) {
    const html = decode(render({ lang, message: "checkoutBlocked", onOpenPortal: () => {} }));
    assert.ok(html.includes(RECOVERY_COPY[lang].checkoutBlocked), `${lang} message`);
    assert.ok(html.includes(RECOVERY_COPY[lang].cta), `${lang} button label`);
    assert.match(html, /<button type="button"/);
    assert.doesNotMatch(html, /disabled=""/);
  }
});

test("busy portal request disables the button and shows the loading label; a failed one shows the error", () => {
  const busy = decode(render({ lang: "it", message: "checkoutBlocked", onOpenPortal: () => {}, busy: true }));
  assert.match(busy, /disabled=""/);
  assert.ok(busy.includes(RECOVERY_COPY.it.loading));
  const failed = decode(render({ lang: "en", message: "checkoutBlocked", onOpenPortal: () => {}, failed: true }));
  assert.ok(failed.includes(RECOVERY_COPY.en.error));
  const ok = decode(render({ lang: "en", message: "checkoutBlocked", onOpenPortal: () => {} }));
  assert.equal(ok.includes(RECOVERY_COPY.en.error), false);
});

test("Android app (TWA): no portal button, only the note to use the website", () => {
  const html = decode(render({ lang: "es", message: "body", onOpenPortal: () => {}, twa: true }));
  assert.ok(html.includes(RECOVERY_COPY.es.twaNote));
  assert.equal(html.includes("<button"), false);
});

test("unknown language falls back to English", () => {
  const html = decode(render({ lang: "xx", message: "body" }));
  assert.ok(html.includes(RECOVERY_COPY.en.title));
});
