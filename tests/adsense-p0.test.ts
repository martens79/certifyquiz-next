import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { isLocale } from "../src/lib/i18n.ts";
import { isTopicIndexable } from "../src/lib/seo/topic-indexability.ts";
import { containsRawMarkdown } from "../src/lib/seo/markdown-rendering.ts";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const completeTopic = {
  title: "Routing fundamentals",
  intro: "A".repeat(200),
  content: Array.from({ length: 320 }, () => "routing").join(" "),
  faq: [{ q: "What?", a: "Explanation" }, { q: "Why?", a: "Reason" }],
};

test("root language route accepts only supported locales", () => {
  for (const locale of ["en", "it", "fr", "es"]) assert.equal(isLocale(locale), true);
  for (const slug of ["inizia", "foobar", "this-page-does-not-exist", "x7-random"])
    assert.equal(isLocale(slug), false);

  const route = readFileSync(path.join(ROOT, "src/app/[lang]/page.tsx"), "utf8");
  assert.match(route, /if \(!isLocale\(lang\)\) notFound\(\)/);
});

test("topic indexability requires positive real inventory", () => {
  assert.equal(isTopicIndexable({ ...completeTopic, questionCount: 0 }), false);
  assert.equal(isTopicIndexable({ ...completeTopic, questionCount: null }), false);
  assert.equal(isTopicIndexable({ ...completeTopic, questionCount: 25 }), true);
});

test("sitemap applies the same certification inventory policy", () => {
  const sitemap = readFileSync(path.join(ROOT, "src/app/sitemap.ts"), "utf8");
  assert.match(sitemap, /questionCount: c\.questionCountByLang\[lang\] \?\? null/);
  assert.match(sitemap, /"google-tensorflow": "tensorflow"/);
  assert.match(sitemap, /"microsoft-csharp": "csharp"/);
  assert.match(sitemap, /canonicalCerts\.filter/);
  assert.doesNotMatch(sitemap, /\$\{base\}\/\$\{listSegment\}\/\$\{c\.slug\}[\s\S]*filter/);
});

test("raw Markdown detection covers headings, lists, emphasis, links, tables and code", () => {
  for (const markdown of [
    "## Heading",
    "- item",
    "**bold**",
    "[link](https://example.com)",
    "| A | B |\n|---|---|",
    "```js\nconst ok = true\n```",
  ]) assert.equal(containsRawMarkdown(markdown), true, markdown);

  assert.equal(containsRawMarkdown("A normal Portable Text paragraph."), false);
});
