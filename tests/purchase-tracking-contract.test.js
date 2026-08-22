const test = require("node:test");
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");

const root = process.cwd();
const source = (path) => readFileSync(join(root, path), "utf8");

test("assessment, email capture and checkout keep distinct GA4 event names", () => {
  const quiz = source("src/components/quiz/QuizEngine.tsx");
  const pricing = source("src/app/(marketing)/pricing/PremiumComingSoonView.tsx");
  assert.match(quiz, /assessment_completed/);
  assert.match(quiz, /assessment_email_submitted/);
  assert.match(pricing, /checkout_started/);
  assert.doesNotMatch(`${quiz}\n${pricing}`, /track(?:Quiz)?Event\(\s*["']purchase["']/);
});

test("success pages do not emit or stage a purchase on load or reload", () => {
  const successPages = [
    source("src/app/premium/success/page.tsx"),
    source("src/app/[lang]/premium/success/page.tsx"),
  ].join("\n");
  assert.doesNotMatch(successPages, /Purchase|cq_pending_purchase|gtag|trackEvent/);
});
