import assert from "node:assert/strict";
import test from "node:test";
import { readPackageIntent, savePackageIntent, packageReturnPath, PACKAGE_INTENT_TTL } from "../src/lib/package-intent";
const memory = () => { const m = new Map<string, string>(); return { getItem: (k: string) => m.get(k) ?? null, setItem: (k: string, v: string) => { m.set(k,v); } }; };
test("choice survives reload, stays certificate/language scoped and expires", () => {
  const s = memory();
  savePackageIntent({ offerCode: "ccna-complete", certificationSlug: "ccna", lang: "es" }, s, 1000);
  assert.equal(readPackageIntent("ccna", "es", s, 1100), "ccna-complete");
  assert.equal(readPackageIntent("ccna", "es", s, 1200), "ccna-complete");
  assert.equal(readPackageIntent("ccna", "it", s, 1100), null);
  assert.equal(readPackageIntent("cissp", "es", s, 1100), null);
  assert.equal(readPackageIntent("ccna", "es", s, 1001 + PACKAGE_INTENT_TTL), null);
  assert.equal(readPackageIntent("ccna", "es", s, 999), null);
});
test("return URL preserves functional choice even with storage denied; no external redirect", () => {
  const denied = { getItem: () => { throw Error(); }, setItem: () => { throw Error(); } };
  savePackageIntent({ offerCode: "ccna-complete", certificationSlug: "ccna", lang: "es" }, denied);
  assert.equal(readPackageIntent("ccna", "es", denied), null);
  const path = packageReturnPath("/es/certificaciones/ccna", "?source=mock_review&cta=mock_review&email=private&certification_slug=ccna", "ccna-complete");
  assert.equal(path, "/es/certificaciones/ccna?source=mock_review&cta=mock_review&certification_slug=ccna&package_offer=ccna-complete#package-resume");
  assert.equal(packageReturnPath("//evil.test", "", "ccna-complete"), null);
  assert.equal(packageReturnPath("/certifications/ccna", "", "../evil"), null);
});
