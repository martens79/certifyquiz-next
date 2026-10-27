import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { CERTS_BY_SLUG, IDS_BY_SLUG } from "../src/certifications/data/index.ts";
import {
  isCertificationOfferedInLang,
  isPlannedCertification,
  isPlannedPreviewEnabled,
  isPubliclyListed,
  PLANNED_PREVIEW_ENV,
} from "../src/certifications/publication.ts";
import { isCertificationIndexable, isRolloutNoindexCertification } from "../src/lib/seo/certification-indexability.ts";
import { isTopicIndexable } from "../src/lib/seo/topic-indexability.ts";
import {
  EIPASS_STANDARD_MODULES,
  EIPASS_STANDARD_SLUG,
  getEipassStandardDemoTopicLinks,
  getEipassStandardDemoTopicPage,
  isEipassStandardDemoVisible,
} from "../src/lib/eipass-standard.ts";
import { EIPASS_USER_MODULES } from "../src/lib/eipass-user-release.ts";

const SLUG = "eipass-standard";
const read = (p: string) => readFileSync(new URL(p, import.meta.url), "utf8");
const DEV_PREVIEW = { [PLANNED_PREVIEW_ENV]: "1", NODE_ENV: "development" } as const;

const OFFICIAL_TITLES = [
  "I fondamenti dell'ICT",
  "Navigare e cercare informazioni sul Web",
  "Comunicare e collaborare in Rete",
  "Sicurezza informatica",
  "Creare documenti elettronici",
  "Creare e gestire fogli di lavoro",
  "Creare presentazioni multimediali",
];

test("registry: eipass-standard is planned, Italian-only, without a DB id, and the only planned entry", () => {
  const reg = CERTS_BY_SLUG[SLUG];
  assert.ok(reg);
  assert.equal(EIPASS_STANDARD_SLUG, SLUG);
  assert.equal(reg.publicationStatus, "planned");
  assert.equal(IDS_BY_SLUG[SLUG], undefined, "no DB id invented before the certification row exists");
  assert.equal(reg.id, undefined);
  assert.deepEqual([...(reg.launchScope?.languages ?? [])], ["it"]);
  assert.deepEqual([...(reg.launchScope?.countries ?? [])], ["IT"]);
  const planned = Object.values(CERTS_BY_SLUG).filter((c) => c && isPlannedCertification(c)).map((c) => c.slug);
  assert.deepEqual([...new Set(planned)], [SLUG]);
});

test("modules: seven, official names and numeric order, one distinct User topic each (reference only)", () => {
  assert.deepEqual(EIPASS_STANDARD_MODULES.map((m) => m.number), [1, 2, 3, 4, 5, 6, 7]);
  assert.deepEqual(EIPASS_STANDARD_MODULES.map((m) => m.title), OFFICIAL_TITLES);
  assert.equal(new Set(EIPASS_STANDARD_MODULES.map((m) => m.slug)).size, 7);
  assert.ok(EIPASS_STANDARD_MODULES.every((m) => /^[a-z0-9-]+$/.test(m.slug)));
  assert.deepEqual(
    [...EIPASS_STANDARD_MODULES.map((m) => m.userTopicId)].sort((a, b) => a - b),
    [17, 18, 19, 20, 21, 22, 23]
  );
  const reg = CERTS_BY_SLUG[SLUG];
  assert.equal(reg.topics.length, 7);
  const links = getEipassStandardDemoTopicLinks();
  assert.deepEqual(links.map((l) => l.slug), EIPASS_STANDARD_MODULES.map((m) => m.slug));
});

test("EIPASS 7 Moduli User is untouched: id 3, slug eipass, same seven modules, no Standard wording", () => {
  const user = CERTS_BY_SLUG["eipass"];
  assert.equal(user.id, 3);
  assert.equal(user.publicationStatus, undefined);
  assert.equal(user.topics.length, 7);
  assert.deepEqual(EIPASS_USER_MODULES.map((m) => m.id), [17, 20, 19, 18, 23, 22, 21]);
  assert.equal(isPubliclyListed("eipass", CERTS_BY_SLUG), true);
  assert.equal(CERTS_BY_SLUG["eipass"].launchScope, undefined);
  // The Standard adapter must not import or mutate anything from the User release adapter.
  const std = read("../src/lib/eipass-standard.ts") + read("../src/certifications/data/eipass-standard.ts");
  assert.doesNotMatch(std, /eipass-user-release/);
});

test("discovery: a planned Standard is never listed", () => {
  assert.equal(isPubliclyListed(SLUG, CERTS_BY_SLUG), false);
  const sitemap = read("../src/app/sitemap.ts");
  assert.doesNotMatch(sitemap, /eipass-standard/);
  assert.doesNotMatch(sitemap, /certifications\/registry|certifications\/data/, "the sitemap is built from the backend inventory, never from the registry");
  const list = read("../src/app/[lang]/certificazioni/CertificationsListView.tsx");
  assert.match(list, /isPubliclyListed\(c\.slug, CERTS_BY_SLUG\)/);
});

test("indexability: fail closed even when an inventory becomes positive", () => {
  assert.equal(isRolloutNoindexCertification(SLUG), true);
  for (const questionCount of [500, 1, 0, null, undefined]) {
    assert.equal(isCertificationIndexable({ slug: SLUG, questionCount }), false, String(questionCount));
  }
  assert.equal(isCertificationIndexable(SLUG), false);
  const rich = {
    certificationSlug: SLUG,
    title: "Modulo 4",
    description: Array.from({ length: 40 }, () => "w").join(" "),
    intro: "x".repeat(200),
    content: Array.from({ length: 320 }, (_, i) => `t${i % 9}`).join(" ") + "a".repeat(2000),
    faq: [{ q: "q1", a: "a1" }, { q: "q2", a: "a2" }],
    questionCount: 100,
  };
  assert.equal(isTopicIndexable(rich), false);
  assert.equal(isTopicIndexable({ ...rich, certificationSlug: "eipass" }), true, "the rollout guard is specific to Standard");
});

test("language scope: only Italian exists; country never drives routing", () => {
  const reg = CERTS_BY_SLUG[SLUG];
  assert.equal(isCertificationOfferedInLang(reg, "it"), true);
  for (const lang of ["en", "fr", "es"]) assert.equal(isCertificationOfferedInLang(reg, lang), false, lang);
  assert.equal(isCertificationOfferedInLang(CERTS_BY_SLUG["eipass"], "fr"), true, "unrestricted certifications keep every language");
  assert.equal(isCertificationOfferedInLang(undefined, "en"), true);
});

test("preview gate: demo data only in a local developer preview, Italian, never in production", () => {
  assert.equal(isPlannedPreviewEnabled(DEV_PREVIEW), true);
  assert.equal(isEipassStandardDemoVisible("it", DEV_PREVIEW), true);
  assert.equal(isEipassStandardDemoVisible("en", DEV_PREVIEW), false);
  assert.equal(isEipassStandardDemoVisible("it", { ...DEV_PREVIEW, NODE_ENV: "production" }), false);
  assert.equal(isEipassStandardDemoVisible("it", { ...DEV_PREVIEW, VERCEL_ENV: "production" }), false);
  assert.equal(isEipassStandardDemoVisible("it", { NODE_ENV: "development" }), false);
  assert.equal(isEipassStandardDemoVisible("it", { ...DEV_PREVIEW, [PLANNED_PREVIEW_ENV]: "true" }), false);
});

test("demo topic pages: labelled demo, negative ids, zero questions, no review, unknown slug is null", () => {
  assert.equal(getEipassStandardDemoTopicPage("modulo-99"), null);
  assert.equal(getEipassStandardDemoTopicPage("fondamenti-del-computer"), null, "User topic slugs are not Standard topics");
  for (const m of EIPASS_STANDARD_MODULES) {
    const page = getEipassStandardDemoTopicPage(m.slug);
    assert.ok(page, m.slug);
    assert.equal(page.questionCount, 0);
    assert.equal(page.reviewAvailable, false);
    assert.ok(page.topic.id < 0 && page.certification.id < 0, "demo ids can never collide with DB ids");
    assert.match(page.topic.description, /^\[DEMO\]/);
    assert.equal(page.relatedTopics.length, 6);
    assert.ok(page.relatedTopics.every((t) => t.id < 0));
  }
});

test("wiring: every public surface fails closed for Standard", () => {
  const view = read("../src/app/_views/CertificationDetailView.tsx");
  assert.match(view, /isPlannedCertification\(reg\) && !isPlannedPreviewEnabled\(\)\) return notFound\(\)/);
  assert.match(view, /reg && !isCertificationOfferedInLang\(reg, lang\)\) return notFound\(\)/);
  const planned = view.search(/isPlannedCertification\(reg\)/);
  const demo = view.search(/isEipassStandardSlug\(reg\.slug\)/);
  const backendFetch = view.search(/getTopicsByCertSlug\(dbSlug, lang\)/);
  assert.ok(planned >= 0 && demo > planned && backendFetch > demo, "guards and the no-backend demo branch precede every backend fetch");

  const topic = read("../src/lib/server/topic-page.ts");
  const guard = topic.search(/isEipassStandardSlug\(normalizedCertSlug\)/);
  const fetchAt = topic.search(/await fetch\(/);
  assert.ok(guard >= 0 && guard < fetchAt, "the topic loader returns before any backend call");
  assert.match(topic, /isEipassStandardDemoVisible\(lang\) \? getEipassStandardDemoTopicPage\(topicSlug\) : null/);

  const page = read("../src/components/CertificationPage.tsx");
  assert.match(page, /!isEipassStandardSlug\(data\.slug\) && <StudyMaterialGrid/, "no generic study-material grid (reviews index) for Standard");

  const layout = read("../src/app/[lang]/quiz/[slug]/layout.tsx");
  assert.match(layout, /if \(isEipassStandardSlug\(slug\)\) notFound\(\)/);
  assert.match(layout, /isPlannedCertification\(getCertBySlug\(slug\)\) && !isPlannedPreviewEnabled\(\)/);
});

test("copy: no availability, equivalence, coverage or ranking claim in the registry text", () => {
  const reg = CERTS_BY_SLUG[SLUG];
  const text = JSON.stringify([reg.description.it, reg.metaTitle?.it, reg.metaDescription?.it, reg.extraContent?.learn?.it, reg.extraContent?.faq?.it]);
  assert.match(text, /preparazione indipendente/i);
  assert.match(text, /non rilascia|non rilasciamo/i);
  assert.doesNotMatch(text, /copertura completa|garantit|valido per i concorsi|simulazione ufficiale|replica/i);
  assert.doesNotMatch(text, /\bCIAD\b/, "no CIAD/GPS claim until it is verified for launch");
});
