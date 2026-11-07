import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import React from "react";
import { act, create } from "react-test-renderer";
import { clientModule } from "./helpers/client-component";
import * as standard from "../src/lib/eipass-standard";

(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;

const Link = ({ href, children, ...rest }: { href: string; children: React.ReactNode }) => React.createElement("a", { href, ...rest }, children);
const mod = clientModule("../../src/components/certification/EipassStandardModules.tsx", { "@/lib/eipass-standard": standard, "next/link": { __esModule: true, default: Link } });
const OFFICIAL_TITLES = [
  "I fondamenti dell'ICT",
  "Navigare e cercare informazioni sul Web",
  "Comunicare e collaborare in Rete",
  "Sicurezza informatica",
  "Creare documenti elettronici",
  "Creare e gestire fogli di lavoro",
  "Creare presentazioni multimediali",
];

async function render(props: Record<string, unknown> = {}) {
  let r!: ReturnType<typeof create>;
  await act(async () => { r = create(React.createElement(mod.default, props)); });
  return r;
}
const flat = (r: ReturnType<typeof create>) => JSON.stringify(r.toJSON());

test("modules block: seven official modules in order, each 'Prossimamente' with a disabled button", async () => {
  const r = await render();
  const items = r.root.findAllByType("li");
  assert.equal(items.length, 7);
  assert.deepEqual(items.map((li) => li.props["data-module"]), [1, 2, 3, 4, 5, 6, 7]);
  assert.deepEqual(items.map((li) => li.props["data-status"]), Array(7).fill("coming_soon"));
  const text = flat(r);
  OFFICIAL_TITLES.forEach((t, i) => {
    assert.ok(text.includes(JSON.stringify(t).slice(1, -1)), `title ${i + 1} present`);
  });
  assert.equal((text.match(/Prossimamente/g) ?? []).length, 7);
  const buttons = r.root.findAllByType("button");
  assert.equal(buttons.length, 7);
  for (const b of buttons) {
    assert.equal(b.props.disabled, true);
    assert.equal(b.props["aria-disabled"], "true");
    assert.equal(b.props.type, "button");
    assert.equal(b.props.onClick, undefined, "a disabled button has no handler");
    assert.match(JSON.stringify(b.children), /Esercitazione non ancora disponibile/);
  }
  assert.match(text, /I 7 moduli d'esame/);
});

test("modules block: nothing is a link, nothing can start a session, no date and no availability claim", async () => {
  const r = await render();
  assert.equal(r.root.findAllByType("a").length, 0, "no link: no module page can answer 404");
  assert.equal(r.root.findAllByType("form").length + r.root.findAllByType("input").length, 0);
  const text = flat(r);
  assert.doesNotMatch(text, /href|\/quiz\/|ripass|mock/i);
  assert.doesNotMatch(text, /✅|inizia|avvia|gratis|premium/i);
  assert.doesNotMatch(
    text.replace(/non ancora disponibile/gi, "").replace(/nessun modulo ha esercitazioni\s+disponibili/gi, ""),
    /disponibil/i,
    "'disponibile' only appears in negative forms"
  );
  assert.doesNotMatch(text.replace(/rev\. 02\/2024/g, ""), /20\d\d|entro|a breve|settiman|mese|tra poco|dal \d/i, "no date or timing promise (only the programme revision is cited)");
  assert.doesNotMatch(text, /accredit|partner|CIAD|GPS/i, "no relationship or accreditation claim");
});

test("modules block source: no router, fetch or handler; the only link is the guarded one; server-renderable", () => {
  const src = readFileSync(new URL("../src/components/certification/EipassStandardModules.tsx", import.meta.url), "utf8");
  assert.doesNotMatch(src, /next\/navigation|useRouter|fetch\(|onClick|window\.|location/);
  assert.equal((src.match(/href=/g) ?? []).length, 1, "a single href");
  assert.match(src, /href=\{href\}/, "the href comes only from getEipassStandardModuleHref");
  assert.match(src, /const href = getEipassStandardModuleHref\(m\)/);
  assert.doesNotMatch(src, /"use client"/, "the module cards are in the initial HTML");
});

// ---------------------------------------------------------------- dormant "available" state (module 2 release)
const withModule2Available = standard.EIPASS_STANDARD_MODULES.map((m) =>
  m.number === 2 ? { ...m, status: "available" as const, topicId: 570 } : m,
);

test("dormant: today no module is available and the landing has no link at all", () => {
  assert.equal(standard.hasAvailableEipassStandardModule(), false);
  for (const m of standard.EIPASS_STANDARD_MODULES) {
    assert.equal(m.status, "coming_soon");
    assert.equal(standard.getEipassStandardModuleHref(m), null);
  }
});

test("available module 2: one link to its topic, one 'Disponibile', six disabled buttons, honest copy", async () => {
  const r = await render({ modules: withModule2Available });
  const links = r.root.findAllByType("a");
  assert.equal(links.length, 1);
  assert.equal(links[0].props.href, "/it/quiz/topic/570");
  assert.match(JSON.stringify(links[0].children), /Inizia l'esercitazione breve/);
  const text = flat(r);
  assert.equal((text.match(/Disponibile/g) ?? []).length, 1);
  assert.equal((text.match(/Prossimamente/g) ?? []).length, 6);
  const buttons = r.root.findAllByType("button");
  assert.equal(buttons.length, 6);
  assert.ok(buttons.every((b) => b.props.disabled === true));
  const available = r.root.findAllByType("li").filter((li) => li.props["data-status"] === "available");
  assert.deepEqual(available.map((li) => li.props["data-module"]), [2]);
  assert.match(text, /brevi e indicate modulo per modulo/);
  assert.doesNotMatch(text, /simulazione|garantit|superare l'esame|ufficial[ei] CERTIPASS|partner/i);
});

test("a module is available only with status 'available' AND a valid topic id", () => {
  const base = standard.EIPASS_STANDARD_MODULES[1];
  assert.equal(standard.isEipassStandardModuleAvailable({ ...base, status: "available" }), false, "no topic id");
  assert.equal(standard.isEipassStandardModuleAvailable({ ...base, status: "available", topicId: 0 }), false);
  assert.equal(standard.isEipassStandardModuleAvailable({ ...base, status: "available", topicId: 5.5 }), false);
  assert.equal(standard.isEipassStandardModuleAvailable({ ...base, status: "coming_soon", topicId: 570 }), false, "a topic id alone never opens a module");
  assert.equal(standard.getEipassStandardModuleHref({ ...base, status: "available", topicId: 570 }), "/it/quiz/topic/570");
});

test("tripwire: the visible copy always follows the module availability", async () => {
  const registry = (await import("../src/certifications/data/eipass-standard.ts")).default;
  const copy = standard.eipassStandardCopy();
  assert.equal(copy.partial, standard.hasAvailableEipassStandardModule());
  assert.equal(registry.description.it, copy.description);
  assert.equal(registry.metaTitle?.it, copy.metaTitle);
  assert.equal(registry.metaDescription?.it, copy.metaDescription);
  assert.equal(registry.level?.it, copy.statusLabel);
  const text = JSON.stringify(registry);
  if (copy.partial) assert.doesNotMatch(text, /non sono ancora disponibili quiz|sono in arrivo|Quiz di preparazione in arrivo/, "an available module must not be described as 'in arrivo'");
  else assert.match(text, /in arrivo/);
});
