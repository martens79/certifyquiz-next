import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { looksLikeHtml } from "../src/lib/looks-like-html.ts";

test("markdown with angle-bracket placeholders in code is not HTML", () => {
  const md = "## Scope\n\n- Unlock: `Unlock-BitLocker -RecoveryPassword <password>`\n- Repair: `repair-bde E: F: -RecoveryPassword <password>`\n";
  assert.equal(looksLikeHtml(md), false);
  assert.equal(looksLikeHtml("```\nrun <server> --x\n```\n## T"), false);
});

test("legacy HTML topic content is still detected", () => {
  assert.equal(looksLikeHtml("<h2>Titolo</h2><p>Testo</p>"), true);
  assert.equal(looksLikeHtml("<ul><li>a</li></ul>"), true);
  assert.equal(looksLikeHtml("Testo <strong>bold</strong>"), true);
});

test("plain text and arrows are not HTML", () => {
  assert.equal(looksLikeHtml("a < b and c > d"), false);
  assert.equal(looksLikeHtml("## Heading\n\ntext"), false);
});

test("TopicContent uses the shared detector", () => {
  const src = readFileSync(new URL("../src/components/TopicContent.tsx", import.meta.url), "utf8");
  assert.match(src, /from "@\/lib\/looks-like-html"/);
});
