import assert from "node:assert/strict";
import test from "node:test";

import {
  EIPASS_STANDARD_MODULES,
  EIPASS_STANDARD_PARTIAL_LABEL,
  eipassStandardCopy,
  hasAvailableEipassStandardModule,
} from "../src/lib/eipass-standard.ts";

const dormant = EIPASS_STANDARD_MODULES.map((m) => ({ ...m, status: "coming_soon" as const, topicId: undefined }));
const withModule2 = dormant.map((m) => (m.number === 2 ? { ...m, status: "available" as const, topicId: 570 } : m));
const withoutTopicId = EIPASS_STANDARD_MODULES.map((m) => (m.number === 2 ? { ...m, status: "available" as const, topicId: undefined } : m));

test("copy, dormant: exactly the original 'in arrivo' wording", () => {
  const c = eipassStandardCopy(dormant);
  assert.equal(c.partial, false);
  assert.equal(c.statusLabel, "Quiz di preparazione in arrivo");
  assert.equal(c.metaTitle, "EIPASS Standard: 7 moduli e quiz in arrivo | CertifyQuiz");
  assert.match(c.panelText, /non sono\s+ancora disponibili quiz|non sono ancora disponibili quiz/);
  assert.equal(c.pointerLabel, "In preparazione");
  assert.equal(c.cardPill, undefined);
});

test("copy, module 2 available: nothing says 'no quiz yet', nothing promises an exam simulation or a result", () => {
  const c = eipassStandardCopy(withModule2);
  assert.equal(c.partial, true);
  assert.equal(c.statusLabel, EIPASS_STANDARD_PARTIAL_LABEL);
  assert.equal(c.cardPill, EIPASS_STANDARD_PARTIAL_LABEL);
  const all = Object.values(c).filter((v): v is string => typeof v === "string").join("\n");
  assert.doesNotMatch(all, /non sono ancora disponibili quiz|sono in arrivo|quiz in arrivo|solo informativa|solo la pagina informativa/i);
  assert.match(all, /Modulo 2/);
  assert.match(all, /esercitazione breve/i);
  // "simulazione" may appear only negated ("non è una simulazione")
  for (const m of all.matchAll(/simulazion\w*/gi)) {
    const before = all.slice(Math.max(0, m.index - 12), m.index).toLowerCase();
    assert.match(before, /non (è )?una $/, `unnegated: ${before}${m[0]}`);
  }
  assert.doesNotMatch(all, /garantit\w+ (il )?superamento(?!\.)|supera(re)? l'esame|partner|ufficiale CERTIPASS|certificat[oi] da CERTIPASS/i);
  assert.match(all, /non rilascia la certificazione/);
  assert.match(all, /gli altri moduli sono in preparazione|Gli altri moduli sono in preparazione/);
});

test("copy: SEO lengths stay within the usual limits in both states", () => {
  for (const mods of [dormant, withModule2]) {
    const c = eipassStandardCopy(mods);
    assert.ok(c.metaTitle.length <= 65, `title ${c.metaTitle.length}`);
    assert.ok(c.metaDescription.length <= 170, `description ${c.metaDescription.length}`);
  }
});

test("a module 'available' without a valid topic id changes nothing", () => {
  assert.equal(hasAvailableEipassStandardModule(withoutTopicId), false);
  assert.deepEqual(eipassStandardCopy(withoutTopicId), eipassStandardCopy(dormant));
});
