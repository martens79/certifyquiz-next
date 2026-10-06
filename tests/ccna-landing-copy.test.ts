import assert from "node:assert/strict";
import test from "node:test";

import CCNA from "../src/certifications/data/CCNA.ts";
import { resolveQuestionCountTokens } from "../src/lib/question-count-tokens.ts";

const LANGS = ["it", "en", "fr", "es"] as const;

test("CCNA has its own current-certification heading in every language (no SQL fallback)", () => {
  for (const lang of LANGS) {
    const heading = CCNA.extraContent.currentCertificationHeading[lang];
    assert.ok(heading && heading.length > 10, `${lang}: heading`);
    assert.doesNotMatch(heading, /SQL/i, `${lang}: heading must not be the SQL default`);
    assert.match(heading, /CCNA/, lang);
  }
});

test("CCNA landing copy does not hardcode the question count", () => {
  const strings: string[] = [
    ...LANGS.map((l) => CCNA.title[l]),
    ...LANGS.map((l) => CCNA.description[l]),
    ...LANGS.flatMap((l) => CCNA.extraContent.currentCertification[l]),
  ];
  for (const s of strings) assert.doesNotMatch(s, /1[,.]?418/, `stale snapshot count in: ${s.slice(0, 60)}`);
  assert.match(CCNA.title.en, /\{questionCount\|/);
  assert.match(CCNA.description.en, /\{questionCount\|/);
});

test("question count tokens resolve to the live count or to a safe floor", () => {
  const t = "CCNA: {questionCount|1,400+} questions";
  assert.equal(resolveQuestionCountTokens(t, 1453, "en"), "CCNA: 1,453 questions");
  assert.equal(resolveQuestionCountTokens(t, 1453, "fr"), "CCNA: 1 453 questions");
  assert.equal(resolveQuestionCountTokens(t, 1453, "it"), "CCNA: 1453 questions"); // CLDR: no grouping below 10,000
  assert.equal(resolveQuestionCountTokens(t, undefined, "en"), "CCNA: 1,400+ questions");
  assert.equal(resolveQuestionCountTokens(t, 0, "en"), "CCNA: 1,400+ questions");
  assert.equal(resolveQuestionCountTokens("{questionCount}", 240, "es"), "240");
  assert.equal(resolveQuestionCountTokens("no tokens here 1,400+", 1453, "en"), "no tokens here 1,400+");
});

test("no registry certification other than CCNA uses count tokens", async () => {
  const { CERTS } = await import("../src/certifications/registry.ts");
  const withTokens = CERTS.filter((c) => /\{questionCount/.test(JSON.stringify(c))).map((c) => c.slug);
  assert.deepEqual(withTokens, ["ccna"]);
});

test("every {questionCount} token in the registry declares a non-empty fallback", async () => {
  const { CERTS } = await import("../src/certifications/registry.ts");
  const tokens: string[] = [];
  const walk = (value: unknown, path: string): void => {
    if (typeof value === "string") {
      for (const m of value.matchAll(/\{questionCount(\|[^}]*)?\}/g)) {
        tokens.push(m[0]);
        assert.ok(m[1] && m[1].length > 1, `token without fallback at ${path}: ${m[0]}`);
      }
    } else if (Array.isArray(value)) {
      value.forEach((v, i) => walk(v, `${path}[${i}]`));
    } else if (value && typeof value === "object") {
      for (const [k, v] of Object.entries(value)) walk(v, `${path}.${k}`);
    }
  };
  for (const cert of CERTS) walk(cert, cert.slug);
  assert.ok(tokens.length > 0, "the scan must find the CCNA tokens");
});
