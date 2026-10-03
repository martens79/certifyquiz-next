import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import TopicPremiumRequired from "../src/components/topics/TopicPremiumRequired";
import {
  isTopicNotAvailableError,
  isTopicPremiumRequiredError,
  premiumHref,
} from "../src/lib/topic-access";
import { isPostGateLimitError } from "../src/lib/quiz-explanation-access";

const read = (p: string) => readFileSync(new URL(p, import.meta.url), "utf8");
const LANGS = ["it", "en", "fr", "es"] as const;

test("error classifiers: only the exact backend codes match, and never the post-gate limit", () => {
  const locked = { status: 403, detail: { error: "TOPIC_PREMIUM_REQUIRED", access: { status: "locked" }, questions: [] } };
  assert.equal(isTopicPremiumRequiredError(locked), true);
  assert.equal(isTopicNotAvailableError(locked), false);
  assert.equal(isPostGateLimitError(locked), false);

  const hidden = { status: 404, detail: { error: "TOPIC_NOT_AVAILABLE" } };
  assert.equal(isTopicNotAvailableError(hidden), true);
  assert.equal(isTopicPremiumRequiredError(hidden), false);

  const postGate = { status: 403, detail: { error: "POST_GATE_QUIZ_LIMIT_REACHED" } };
  assert.equal(isTopicPremiumRequiredError(postGate), false);
  assert.equal(isPostGateLimitError(postGate), true);

  for (const other of [
    { status: 403, detail: { error: "Admin only" } },
    { status: 401, detail: { error: "TOPIC_PREMIUM_REQUIRED" } },
    { status: 500, detail: { error: "TOPIC_PREMIUM_REQUIRED" } },
    { status: 403 },
    new Error("boom"),
    null,
    undefined,
  ]) {
    assert.equal(isTopicPremiumRequiredError(other), false);
    assert.equal(isTopicNotAvailableError(other), false);
  }
});

test("Premium panel: localized, links to Premium and back, shows no question content", () => {
  const expectedHref = { it: "/it/premium", en: "/premium", fr: "/fr/premium", es: "/es/premium" } as const;
  for (const lang of LANGS) {
    assert.equal(premiumHref(lang), expectedHref[lang]);
    const html = renderToStaticMarkup(createElement(TopicPremiumRequired, { lang, backHref: `/${lang}/quiz/x` }));
    assert.match(html, /data-topic-access-panel="premium"/, lang);
    assert.ok(html.includes(`href="${expectedHref[lang]}"`), `${lang}: Premium link`);
    assert.ok(html.includes(`href="/${lang}/quiz/x"`), `${lang}: back link`);
    assert.doesNotMatch(html, /<ul|<ol|<form|<input|<button/, `${lang}: no quiz controls`);
  }
  assert.match(renderToStaticMarkup(createElement(TopicPremiumRequired, { lang: "it", backHref: "/it" })), /Questo argomento è Premium/);
  assert.match(renderToStaticMarkup(createElement(TopicPremiumRequired, { lang: "en", backHref: "/" })), /This topic is Premium/);
});

test("'not available' panel: no Premium call to action", () => {
  for (const lang of LANGS) {
    const html = renderToStaticMarkup(createElement(TopicPremiumRequired, { lang, backHref: "/x", kind: "unavailable" }));
    assert.match(html, /data-topic-access-panel="unavailable"/);
    assert.ok(!html.includes(premiumHref(lang)), `${lang}: no Premium link on an unlaunched topic`);
  }
});

test("topic quiz client: 403/404 gate errors render the panel and never reach the engine", () => {
  const src = read("../src/app/[lang]/quiz/topic/[topicId]/QuizTopicClient.tsx");
  const catchAt = src.indexOf("} catch (e: any) {");
  const premium = src.indexOf("isTopicPremiumRequiredError(e)", catchAt);
  const unavailable = src.indexOf("isTopicNotAvailableError(e)", catchAt);
  const postGate = src.indexOf("isPostGateLimitError(e)", catchAt);
  assert.ok(premium > 0 && unavailable > 0 && postGate > 0);
  assert.ok(premium < postGate && unavailable < postGate, "gate errors are handled before the post-gate rethrow");
  assert.match(src.slice(premium, postGate), /setTopicGate\("premium"\);\s*return \[\];/);
  assert.match(src.slice(premium, postGate), /setTopicGate\("unavailable"\);\s*return \[\];/);
  const panel = src.indexOf("<TopicPremiumRequired lang={L} backHref={backToHref} kind={topicGate} />");
  const engine = src.indexOf("<QuizEngine", panel);
  assert.ok(panel > 0 && engine > panel, "the panel returns before the QuizEngine render");
});

test("free-pool notice: localized with the free count, hidden until the user is known not to be entitled", async () => {
  const { default: FreePoolNotice, freePoolMessage } = await import("../src/components/topics/FreePoolNotice");
  const { PLC_FREE_QUESTION_COUNT, INDUSTRIAL_AUTOMATION_CERT_SLUG } = await import("../src/lib/industrial-automation");
  const { CERTS_BY_SLUG } = await import("../src/certifications/data/index");
  assert.equal(PLC_FREE_QUESTION_COUNT, 68);
  for (const lang of LANGS) {
    const m = freePoolMessage(lang, PLC_FREE_QUESTION_COUNT);
    assert.match(m.body, /68/, lang);
    assert.ok(m.cta.length > 3);
  }
  // first paint (and any entitled / unknown user): nothing is rendered
  assert.equal(renderToStaticMarkup(createElement(FreePoolNotice, { certId: 1, lang: "en", freeQuestions: 68 })), "");
  // the count agrees with the landing FAQ
  const faq = CERTS_BY_SLUG[INDUSTRIAL_AUTOMATION_CERT_SLUG].extraContent?.faq;
  assert.match(faq!.en[1].a, new RegExp(`${PLC_FREE_QUESTION_COUNT} questions`));
  assert.match(faq!.it[1].a, new RegExp(`${PLC_FREE_QUESTION_COUNT} domande`));
});

test("topics page: the notice is under the mixed quiz and the practice test, for the gated certification only", () => {
  const page = read("../src/app/[lang]/quiz/[slug]/page.tsx");
  assert.match(page, /const gatedPool = resolvedSlug === INDUSTRIAL_AUTOMATION_CERT_SLUG && topics\.some\(\(t\) => t\.access_tier === "premium"\)/);
  const mixed = page.indexOf("{mixedDesc}");
  const mock = page.indexOf("{mockDesc}");
  const notice = "{gatedPool ? <FreePoolNotice certId={certId} lang={L} freeQuestions={PLC_FREE_QUESTION_COUNT} /> : null}";
  assert.ok(page.indexOf(notice, mixed) > mixed && page.indexOf(notice, mixed) < mock, "under the mixed quiz");
  assert.ok(page.indexOf(notice, mock) > mock, "under the practice test");
});
