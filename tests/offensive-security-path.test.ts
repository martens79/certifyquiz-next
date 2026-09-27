import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

import { CERT_LABELS, PATH_STAGES, type PathStage } from "../src/features/offensive-path/stages.ts";
import { PATH_COPY } from "../src/features/offensive-path/copy.ts";
import { offensiveSecurityPath, toHreflang } from "../src/lib/paths.ts";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const LANGS = ["it", "en", "fr", "es"] as const;
const read = (rel: string) => readFileSync(path.join(ROOT, rel), "utf8");

const DATA_DIR = "src/certifications/data";
const dataFiles = readdirSync(path.join(ROOT, DATA_DIR)).filter((f) => f.endsWith(".ts") && f !== "index.ts");
const registryIndex = read(`${DATA_DIR}/index.ts`);

/** A slug is in the registry when a data file declares it and index.ts imports that file. */
function inRegistry(slug: string): boolean {
  return dataFiles.some((f) => {
    if (!read(`${DATA_DIR}/${f}`).includes(`slug: "${slug}"`)) return false;
    return registryIndex.includes(`from "./${f.replace(/\.ts$/, "")}"`);
  });
}

function stageSlugs(stage: PathStage): string[] {
  const fromCtas = stage.ctas.flatMap((c) => ("certSlug" in c.target ? [c.target.certSlug] : []));
  return [...stage.certSlugs, ...fromCtas, ...(stage.labsCertSlug ? [stage.labsCertSlug] : [])];
}

const byId = (id: PathStage["id"]) => PATH_STAGES.find((s) => s.id === id)!;
const PRACTICAL_IDS = ["ejpt", "pnpt", "oscp"] as const;

// Wording that would present a practical stage as a replica of the real exam.
const FORBIDDEN_PRACTICAL = [
  /\bmock\b/i,
  /exam simulation|simulated exam|practice exam/i,
  /simulazion[ei] (d'|dell'|di )?esame|esame simulato/i,
  /examen blanc|simulation d'examen|examen simulé/i,
  /simulacro|simulación de(l)? examen|examen simulado/i,
];

test("stage order and statuses match the approved roadmap", () => {
  assert.deepEqual(
    PATH_STAGES.map((s) => [s.id, s.status]),
    [
      ["fundamentals", "available"],
      ["ceh", "available"],
      ["pentest-plus", "next"],
      ["ejpt", "planned"],
      ["pnpt", "planned"],
      ["oscp", "planned"],
    ]
  );
});

test("every stage is complete in IT/EN/FR/ES", () => {
  for (const stage of PATH_STAGES) {
    for (const l of LANGS) {
      const c = stage.copy[l];
      assert.ok(c, `${stage.id}/${l}: copy missing`);
      assert.ok(c.title.length >= 10, `${stage.id}/${l}: title`);
      assert.ok(c.target.length >= 3, `${stage.id}/${l}: target`);
      assert.ok(c.objective.length >= 60, `${stage.id}/${l}: objective`);
      assert.ok(c.skills.length >= 4, `${stage.id}/${l}: skills`);
      assert.equal(new Set(c.skills).size, c.skills.length, `${stage.id}/${l}: duplicate skills`);
      assert.ok(c.body.length >= 2, `${stage.id}/${l}: body`);
      for (const p of c.body) assert.ok(p.length >= 120, `${stage.id}/${l}: body paragraph too short`);
    }
    // same structure across languages
    const shape = (l: (typeof LANGS)[number]) => [stage.copy[l].skills.length, stage.copy[l].body.length, !!stage.copy[l].note];
    for (const l of LANGS) assert.deepEqual(shape(l), shape("en"), `${stage.id}/${l}: structure differs from EN`);
  }
});

test("page copy is complete in IT/EN/FR/ES", () => {
  const keys = Object.keys(PATH_COPY.en).sort();
  for (const l of LANGS) {
    const t = PATH_COPY[l];
    assert.deepEqual(Object.keys(t).sort(), keys, `${l}: keys`);
    assert.ok(t.meta.title.length >= 30 && t.meta.title.length <= 70, `${l}: meta title length ${t.meta.title.length}`);
    assert.ok(t.meta.description.length >= 110 && t.meta.description.length <= 160, `${l}: meta description length ${t.meta.description.length}`);
    assert.equal(t.intro.length, 2, `${l}: intro`);
    assert.equal(t.examTypes.length, 3, `${l}: exam types`);
    for (const p of [...t.intro, ...t.examTypes]) assert.ok(p.length >= 150, `${l}: paragraph too short`);
    assert.ok(t.faq.length >= 5, `${l}: faq count`);
    assert.equal(new Set(t.faq.map((f) => f.q)).size, t.faq.length, `${l}: duplicate faq`);
    for (const f of t.faq) assert.ok(f.a.length >= 120, `${l}: faq answer too short: ${f.q}`);
    for (const k of ["available", "next", "planned"] as const) assert.ok(t.status[k] && t.statusHelp[k], `${l}: status ${k}`);
    assert.ok(t.disclaimer.length >= 200, `${l}: disclaimer`);
  }
  assert.equal(PATH_COPY.en.status.next, "Next on the roadmap");
});

test("next/planned stages have no certification slug, no CTA and no link target", () => {
  for (const stage of PATH_STAGES.filter((s) => s.status !== "available")) {
    assert.deepEqual(stage.certSlugs, [], `${stage.id}: certSlugs`);
    assert.deepEqual(stage.ctas, [], `${stage.id}: ctas`);
    assert.equal(stage.labsCertSlug, undefined, `${stage.id}: labsCertSlug`);
  }
});

test("every slug actually referenced exists in the certification registry", () => {
  for (const stage of PATH_STAGES) {
    for (const slug of stageSlugs(stage)) {
      assert.ok(inRegistry(slug), `${stage.id}: "${slug}" is not in the registry`);
      assert.ok(CERT_LABELS[slug], `${stage.id}: "${slug}" has no display label`);
    }
  }
  // Available stages must actually point to real certifications.
  for (const stage of PATH_STAGES.filter((s) => s.status === "available")) {
    assert.ok(stage.certSlugs.length > 0, `${stage.id}: available without certifications`);
  }
});

test("practical stages never offer a blueprint mock nor mock-exam wording", () => {
  for (const id of PRACTICAL_IDS) {
    const stage = byId(id);
    assert.equal(stage.assessmentNature, "practical", `${id}: nature`);
    assert.ok(!stage.resources.includes("blueprint-mock"), `${id}: blueprint-mock`);
    assert.ok(stage.resources.includes("practical-prep"), `${id}: practical-prep`);
    for (const l of LANGS) {
      const c = stage.copy[l];
      const text = [c.title, c.target, c.objective, ...c.skills, ...c.body, c.note ?? ""].join(" ");
      for (const re of FORBIDDEN_PRACTICAL) assert.doesNotMatch(text, re, `${id}/${l}: ${re}`);
      assert.match(c.title, /Practice$/, `${id}/${l}: title must use "Practice"`);
    }
  }
  // blueprint-mock only where a real blueprint mock exists
  for (const stage of PATH_STAGES) {
    if (stage.resources.includes("blueprint-mock")) assert.equal(stage.id, "ceh");
  }
});

test("CEH stage exposes quiz, scenario/exhibit practice, blueprint mock, 4 labs and the free lab", () => {
  const ceh = byId("ceh");
  assert.deepEqual([...ceh.resources].sort(), ["blueprint-mock", "labs", "quiz", "scenario-practice"]);
  assert.deepEqual(ceh.certSlugs, ["ceh"]);
  assert.equal(ceh.labsCertSlug, "ceh");
  assert.deepEqual(
    ceh.ctas.map((c) => c.target),
    [
      { to: "quiz", certSlug: "ceh" },
      { to: "mock", certSlug: "ceh" },
      { to: "lab", labSlug: "ceh-recon-service-enumeration" },
      { to: "cert", certSlug: "ceh" },
    ]
  );
  assert.equal(ceh.ctas.filter((c) => c.primary).length, 1);
  const four = { en: /\bfour\b/, it: /\bquattro\b/, fr: /\bquatre\b/, es: /\bcuatro\b/ };
  const free = { en: /first lab is free/, it: /primo lab è gratuito/, fr: /premier lab est gratuit/, es: /primer lab es gratuito/ };
  const mock = { en: /125 questions in 240 minutes/, it: /125 domande in 240 minuti/, fr: /125 questions en 240 minutes/, es: /125 preguntas en 240 minutos/ };
  for (const l of LANGS) {
    const body = ceh.copy[l].body.join(" ");
    assert.match(body, four[l], `${l}: four labs`);
    assert.match(body, free[l], `${l}: free lab`);
    assert.match(body, mock[l], `${l}: blueprint mock`);
    assert.match(body, /Nmap/, `${l}: exhibit example`);
  }
});

test("CTA hrefs are resolved from declarative targets, never hardcoded", () => {
  const page = read("src/features/offensive-path/OffensiveSecurityPathPage.tsx");
  assert.match(page, /isAvailable && stage\.ctas\.length > 0/);
  assert.match(page, /\/\$\{lang\}\/quiz\/\$\{target\.certSlug\}\/mock-exam/);
  for (const banned of ["pentest", "ejpt", "pnpt", "oscp"]) {
    assert.doesNotMatch(page.toLowerCase(), new RegExp(`href=["'{][^>]*${banned}`), `page links to ${banned}`);
  }
});

test("canonical and hreflang use the same segment in every locale", () => {
  assert.equal(offensiveSecurityPath("en"), "/offensive-security");
  assert.equal(offensiveSecurityPath("it"), "/it/offensive-security");
  assert.equal(offensiveSecurityPath("fr"), "/fr/offensive-security");
  assert.equal(offensiveSecurityPath("es"), "/es/offensive-security");
  assert.deepEqual(LANGS.map(toHreflang), ["it-IT", "en-US", "fr-FR", "es-ES"]);

  const meta = read("src/features/offensive-path/metadata.ts");
  assert.match(meta, /canonical = `\$\{SITE\}\$\{offensiveSecurityPath\(lang\)\}`/);
  assert.match(meta, /languages\[toHreflang\(locale\)\] = `\$\{SITE\}\$\{offensiveSecurityPath\(locale\)\}`/);
  assert.match(meta, /languages\["x-default"\] = `\$\{SITE\}\$\{offensiveSecurityPath\("en"\)\}`/);
  assert.match(meta, /robots: \{ index: true, follow: true \}/);

  assert.match(read("src/app/offensive-security/page.tsx"), /buildOffensivePathMetadata\("en"\)/);
  const localized = read("src/app/[lang]/offensive-security/page.tsx");
  assert.match(localized, /buildOffensivePathMetadata\(lang as Lang\)/);
  assert.match(localized, /\["it", "es", "fr"\]/);
  assert.match(localized, /notFound\(\)/);
});

test("the Path is in the sitemap for every locale", () => {
  const sitemap = read("src/app/sitemap.ts");
  assert.match(sitemap, /lang === "en" \? `\$\{SITE\}\/offensive-security` : `\$\{SITE\}\/\$\{lang\}\/offensive-security`/);
});

test("no route exists for PenTest+, eJPT, PNPT or OSCP", () => {
  const dirs: string[] = [];
  const walk = (rel: string) => {
    for (const e of readdirSync(path.join(ROOT, rel), { withFileTypes: true })) {
      if (e.isDirectory()) {
        dirs.push(`${rel}/${e.name}`);
        walk(`${rel}/${e.name}`);
      }
    }
  };
  walk("src/app");
  const offending = dirs.filter((d) => /pentest|ejpt|pnpt|oscp/i.test(path.basename(d)));
  assert.deepEqual(offending, []);
});

test("entry points link to the Path", () => {
  assert.match(read("src/app/paths/page.tsx"), /href: "\/offensive-security"/);
  assert.match(read("src/app/it/percorsi/page.tsx"), /href: "\/it\/offensive-security"/);
  assert.match(read("src/app/fr/parcours/page.tsx"), /href: "\/fr\/offensive-security"/);
  assert.match(read("src/app/es/rutas/page.tsx"), /href: "\/es\/offensive-security"/);
  assert.match(read("src/components/roadmaps/CybersecurityRoadmapPage.tsx"), /href=\{offensiveSecurityPath\(lang\)\}/);
  assert.match(read("src/components/CertificationPage.tsx"), /data\.slug === "ceh"[\s\S]*offensiveSecurityPath\(lang\)/);
});
