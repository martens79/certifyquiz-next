import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { CERTS_BY_SLUG, IDS_BY_SLUG } from "../src/certifications/data/index.ts";
import {
  isCertificationOfferedInLang,
  isComingSoonCertification,
  isPlannedCertification,
  isPubliclyListed,
} from "../src/certifications/publication.ts";
import { isCertificationIndexable, isRolloutNoindexCertification } from "../src/lib/seo/certification-indexability.ts";
import { isTopicIndexable } from "../src/lib/seo/topic-indexability.ts";
import { eipassStandardMetadata } from "../src/lib/seo/eipass-standard-metadata.ts";
import {
  EIPASS_STANDARD_COMING_SOON_LABEL,
  EIPASS_STANDARD_LANDING_PATH,
  EIPASS_STANDARD_MODULES,
  EIPASS_STANDARD_OFFICIAL_URL,
  EIPASS_STANDARD_SLUG,
} from "../src/lib/eipass-standard.ts";
import { EIPASS_USER_MODULES } from "../src/lib/eipass-user-release.ts";

const SLUG = "eipass-standard";
const SITE = "https://www.certifyquiz.com";
const read = (p: string) => readFileSync(new URL(p, import.meta.url), "utf8");
const OFFICIAL_TITLES = [
  "I fondamenti dell'ICT",
  "Navigare e cercare informazioni sul Web",
  "Comunicare e collaborare in Rete",
  "Sicurezza informatica",
  "Creare documenti elettronici",
  "Creare e gestire fogli di lavoro",
  "Creare presentazioni multimediali",
];

test("registry: coming_soon (not planned), Italian-only, no DB id, not in the catalogue", () => {
  const reg = CERTS_BY_SLUG[SLUG];
  assert.ok(reg);
  assert.equal(EIPASS_STANDARD_SLUG, SLUG);
  assert.equal(reg.publicationStatus, "coming_soon");
  assert.equal(isComingSoonCertification(reg), true);
  assert.equal(isPlannedCertification(reg), false, "a distinct status: not the 404 'planned' one");
  assert.equal(IDS_BY_SLUG[SLUG], undefined);
  assert.equal(reg.id, undefined);
  assert.deepEqual([...(reg.launchScope?.languages ?? [])], ["it"]);
  assert.deepEqual([...(reg.launchScope?.countries ?? [])], ["IT"]);
  assert.equal(isPubliclyListed(SLUG, CERTS_BY_SLUG), false, "not listed in catalogue, home or categories");
  const planned = Object.values(CERTS_BY_SLUG).filter((c) => c && isPlannedCertification(c)).map((c) => c.slug);
  assert.deepEqual(planned, [], "no certification is 'planned'");
  const comingSoon = Object.values(CERTS_BY_SLUG).filter((c) => c && isComingSoonCertification(c)).map((c) => c.slug);
  assert.deepEqual([...new Set(comingSoon)], [SLUG], "only Standard is coming_soon");
});

test("seven modules in official order; informational only: no module carries a slug or link", () => {
  assert.deepEqual(EIPASS_STANDARD_MODULES.map((m) => m.number), [1, 2, 3, 4, 5, 6, 7]);
  assert.deepEqual(EIPASS_STANDARD_MODULES.map((m) => m.title), OFFICIAL_TITLES);
  const reg = CERTS_BY_SLUG[SLUG];
  assert.equal(reg.topics.length, 7);
  for (const t of reg.topics) {
    assert.equal(typeof t === "object" && t !== null && "slug" in t, false, "no slug => the landing cannot link to a module page");
  }
  assert.deepEqual(
    reg.topics.map((t) => (t as { title: { it: string } }).title.it),
    OFFICIAL_TITLES.map((title, i) => `Modulo ${i + 1} — ${title}`)
  );
});

test("EIPASS 7 Moduli User is untouched: id 3, slug eipass, same modules, still published", () => {
  const user = CERTS_BY_SLUG["eipass"];
  assert.equal(user.id, 3);
  assert.equal(user.publicationStatus, undefined);
  assert.equal(user.launchScope, undefined);
  assert.deepEqual(EIPASS_USER_MODULES.map((m) => m.id), [17, 20, 19, 18, 23, 22, 21]);
  assert.equal(isPubliclyListed("eipass", CERTS_BY_SLUG), true);
  const std = read("../src/lib/eipass-standard.ts") + read("../src/certifications/data/eipass-standard.ts");
  assert.doesNotMatch(std, /eipass-user-release/, "the Standard adapter shares nothing with the User release adapter");
});

test("SEO: the Italian landing is index/follow with a self canonical and no hreflang; other languages are noindex", () => {
  const md = eipassStandardMetadata("it", SITE);
  assert.deepEqual(md.robots, { index: true, follow: true });
  assert.equal(md.alternates?.canonical, `${SITE}${EIPASS_STANDARD_LANDING_PATH}`);
  assert.equal(EIPASS_STANDARD_LANDING_PATH, "/it/certificazioni/eipass-standard");
  assert.equal(md.alternates?.languages, undefined, "no hreflang: no other language page exists");
  assert.match(String(md.title), /EIPASS Standard/);
  assert.match(String(md.description), /DigComp 2\.2/);
  assert.equal((md.openGraph as { url?: string }).url, `${SITE}${EIPASS_STANDARD_LANDING_PATH}`);
  for (const lang of ["en", "fr", "es"]) assert.deepEqual(eipassStandardMetadata(lang, SITE).robots, { index: false, follow: true }, lang);
  assert.equal(eipassStandardMetadata("it", `${SITE}/`).alternates?.canonical, `${SITE}${EIPASS_STANDARD_LANDING_PATH}`, "trailing slash safe");
  const reg = CERTS_BY_SLUG[SLUG];
  assert.equal(md.title, reg.metaTitle?.it);
  assert.ok((reg.metaTitle?.it.length ?? 0) <= 60 && (reg.metaDescription?.it.length ?? 0) <= 170, "SERP-safe lengths");
});

test("SEO: other certifications' indexing rules are unchanged; Standard topics/quiz can never be indexable", () => {
  assert.equal(isRolloutNoindexCertification(SLUG), false);
  // the inventory rule is untouched: Standard has no inventory, so only the dedicated metadata makes the landing indexable
  assert.equal(isCertificationIndexable({ slug: SLUG, questionCount: 0 }), false);
  assert.equal(isCertificationIndexable({ slug: "ccna", questionCount: 12 }), true);
  assert.equal(isCertificationIndexable({ slug: "ccna", questionCount: 0 }), false);
  const topic = { certificationSlug: SLUG, title: "Modulo 4", description: "x ".repeat(80), intro: "x".repeat(200), content: "word ".repeat(400) + "a".repeat(2000), faq: [{ q: "q", a: "a" }, { q: "q2", a: "a2" }] };
  assert.equal(isTopicIndexable({ ...topic, questionCount: 0 }), false);
  assert.equal(isTopicIndexable({ ...topic, questionCount: null }), false);
});

test("language scope: only Italian exists", () => {
  const reg = CERTS_BY_SLUG[SLUG];
  assert.equal(isCertificationOfferedInLang(reg, "it"), true);
  for (const lang of ["en", "fr", "es"]) assert.equal(isCertificationOfferedInLang(reg, lang), false, lang);
});

test("wiring: landing renders from the registry only; quiz, topics and other languages stay 404", () => {
  const view = read("../src/app/_views/CertificationDetailView.tsx");
  const planned = view.search(/isPlannedCertification\(reg\) && !isPlannedPreviewEnabled\(\)\) return notFound\(\)/);
  const lang = view.search(/reg && !isCertificationOfferedInLang\(reg, lang\)\) return notFound\(\)/);
  const std = view.search(/isEipassStandardSlug\(reg\.slug\)/);
  const backend = view.search(/getTopicsByCertSlug\(dbSlug, lang\)/);
  assert.ok(planned >= 0 && lang > planned && std > lang && backend > std, "all guards and the no-backend branch precede every backend fetch");
  assert.match(view, /if \(!isComingSoonCertification\(reg\)\) return notFound\(\)/);
  assert.match(view, /dbTopics=\{\[\]\}/, "no module link is ever passed to the page");

  const topic = read("../src/lib/server/topic-page.ts");
  const guard = topic.search(/if \(isEipassStandardSlug\(normalizedCertSlug\)\) return null/);
  assert.ok(guard >= 0 && guard < topic.search(/await fetch\(/), "topic loader returns null before any backend call");

  assert.match(read("../src/app/[lang]/quiz/[slug]/layout.tsx"), /if \(isEipassStandardSlug\(slug\)\) notFound\(\)/);
  assert.match(read("../src/components/CertificationPage.tsx"), /!isEipassStandardSlug\(data\.slug\) && <StudyMaterialGrid/);
  const cp = read("../src/components/CertificationPage.tsx");
  const gate = cp.search(/\{!isEipassStandardSlug\(data\.slug\) && \(\s*<>\s*<CertificationPackageOffers/);
  assert.ok(gate >= 0 && gate < cp.search(/<PremiumResourcesCta/), "no package offer and no Premium CTA for Standard (client-rendered, invisible to an SSR smoke)");
  assert.match(read("../src/app/[lang]/categorie/[cat]/page.tsx"), /isPubliclyListed\(s, CERTS_BY_SLUG\)/);
  assert.match(read("../src/app/[lang]/certificazioni/CertificationsListView.tsx"), /isPubliclyListed\(c\.slug, CERTS_BY_SLUG\)/);
  for (const f of [
    "../src/app/certifications/[slug]/scenarios/page.tsx", "../src/app/es/certificaciones/[slug]/escenarios/page.tsx",
    "../src/app/fr/certifications/[slug]/scenarios/page.tsx", "../src/app/it/certificazioni/[slug]/scenari/page.tsx",
  ]) assert.match(read(f), /if \(isEipassStandardSlug\(slug\)\) notFound\(\);/, `${f}: Standard has no scenarios`);
  assert.match(read("../src/components/TopicReviewPageShell.tsx"), /if \(isEipassStandardSlug\(slug\)\) notFound\(\);/, "no topic review for Standard");
  assert.match(read("../src/components/ReviewsCertificationIndexPage.tsx"), /if \(isEipassStandardSlug\(certSlug\)\) notFound\(\);/, "no reviews index for Standard");
  const page = read("../src/app/[lang]/certificazioni/[slug]/page.tsx");
  const meta = page.search(/isEipassStandardSlug\(slug\)\) return eipassStandardMetadata\(L, SITE_URL\)/);
  assert.ok(meta >= 0 && meta < page.search(/await getCertBySlug\(registryKey, L\)/), "metadata decided before any backend lookup");
});

test("Free/Premium: this release introduces no tiering and touches no limit", () => {
  for (const f of [
    "../src/lib/eipass-standard.ts", "../src/certifications/data/eipass-standard.ts",
    "../src/components/certification/EipassStandardComingSoon.tsx", "../src/lib/seo/eipass-standard-metadata.ts",
  ]) {
    assert.doesNotMatch(read(f), /premium|is_premium|access_tier|free_wrong|FREE_WRONG|paywall/i, f);
  }
});

test("copy: states 'in arrivo', original, DigComp 2.2 and the User difference; no availability/coverage/ranking claim", () => {
  const reg = CERTS_BY_SLUG[SLUG];
  const guide = JSON.stringify(reg.extraContent?.guideSections?.it);
  const faq = JSON.stringify(reg.extraContent?.faq?.it);
  const all = [reg.description.it, reg.metaTitle?.it, reg.metaDescription?.it, guide, faq].join(" ");
  assert.equal(EIPASS_STANDARD_COMING_SOON_LABEL, "Quiz di preparazione in arrivo");
  assert.equal(reg.level?.it, EIPASS_STANDARD_COMING_SOON_LABEL);
  assert.match(all, /DigComp 2\.2/);
  assert.match(guide, /Differenze rispetto a EIPASS 7 Moduli User/);
  assert.match(all, /non rilascia/i);
  assert.match(all, /in arrivo/i);
  assert.doesNotMatch(all, /inizia il quiz|quiz gratuit|simulazione d'esame|copertura completa|garantit|replica|punti in graduatoria|\bCIAD\b|\bGPS\b|Accredia|accreditat/i);
  assert.equal(reg.imageUrl, "/images/certifications/eipass-standard.svg", "original illustration, not the EIPASS logo");
  assert.notEqual(reg.imageUrl, CERTS_BY_SLUG["eipass"].imageUrl);
  assert.equal(reg.officialUrl, EIPASS_STANDARD_OFFICIAL_URL);
});

test("component source: two real links, GA4 through trackEvent, no form and no email capture", () => {
  const c = read("../src/components/certification/EipassStandardComingSoon.tsx");
  assert.match(c, /EIPASS_STANDARD_OFFICIAL_URL/);
  assert.match(c, /EIPASS_USER_LANDING_PATH/);
  assert.match(c, /trackEvent\(EIPASS_STANDARD_LINK_EVENT/);
  assert.match(c, /rel="noopener noreferrer"/);
  assert.doesNotMatch(c, /<form|<input|type="email"|newsletter|subscribe/i);
  assert.doesNotMatch(c, /href="\/it\/quiz|href="\/it\/ripassi|mock-exam/);
});
