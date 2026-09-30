import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { CERTS_BY_SLUG, IDS_BY_SLUG } from "../src/certifications/data/index.ts";
import {
  isPlannedCertification,
  isPlannedPreviewEnabled,
  isPubliclyListed,
  PLANNED_PREVIEW_ENV,
} from "../src/certifications/publication.ts";
import {
  isCertificationIndexable,
  isRolloutNoindexCertification,
} from "../src/lib/seo/certification-indexability.ts";
import { isTopicIndexable } from "../src/lib/seo/topic-indexability.ts";

const SLUG = "plc-fundamentals";
const LANGS = ["it", "en", "fr", "es"] as const;
const read = (p: string) => readFileSync(new URL(p, import.meta.url), "utf8");

const richTopic = {
  title: "Ladder Logic Fundamentals",
  description: Array.from({ length: 40 }, () => "practical").join(" "),
  intro: "x".repeat(200),
  content: Array.from({ length: 320 }, (_, i) => `rung${i % 7}`).join(" ") + "a".repeat(2000),
  faq: [{ q: "q1", a: "a1" }, { q: "q2", a: "a2" }],
};

test("registry: plc-fundamentals is planned, has no production id yet, and is the only planned entry", () => {
  const reg = CERTS_BY_SLUG[SLUG];
  assert.ok(reg, "registry entry exists");
  assert.equal(reg.publicationStatus, "planned");
  assert.equal(IDS_BY_SLUG[SLUG], undefined);
  const planned = Object.values(CERTS_BY_SLUG).filter((c) => c && isPlannedCertification(c)).map((c) => c.slug);
  assert.deepEqual([...new Set(planned)], [SLUG], "no live certification is hidden by the planned filter");
});

test("registry: 12 topics with EN/IT slugs matching the backend import catalog; not presented as official", () => {
  const reg = CERTS_BY_SLUG[SLUG];
  const slugs = reg.topics.map((t) => (typeof t === "object" && "slug" in t ? t.slug : undefined));
  assert.equal(slugs.length, 12);
  assert.deepEqual(slugs.map((s) => s?.en), [
    "industrial-automation-safe-working", "plc-architecture-scan-cycle", "control-circuits-relays-contactors",
    "sensors-actuators", "digital-io-field-wiring", "ladder-logic-fundamentals", "timers-counters-sequences",
    "analog-signals-scaling", "motors-starters-vfd", "hmi-scada-basics", "industrial-networks", "plc-troubleshooting-diagnostics",
  ]);
  assert.ok(slugs.every((s) => s?.it && /^[a-z0-9-]+$/.test(s.it)));
  assert.match(reg.description.en, /not an official certification/i);
  assert.match(reg.description.it, /non è una certificazione ufficiale/i);
  assert.equal(reg.examBlueprint, undefined, "no official exam blueprint");
});

test("noindex: the landing is noindex in every language and the slug-only form, whatever the inventory", () => {
  assert.equal(isRolloutNoindexCertification(SLUG), true);
  for (const questionCount of [274, 1, 0, null, undefined]) {
    assert.equal(isCertificationIndexable({ slug: SLUG, questionCount }), false, String(questionCount));
  }
  assert.equal(isCertificationIndexable(SLUG), false);
  assert.equal(isTopicIndexable({ ...richTopic, certificationSlug: SLUG, questionCount: 24 }), false);
});

test("sitemap: plc-fundamentals is excluded in IT/EN/FR/ES while published certifications stay", () => {
  const source = read("../src/app/sitemap.ts");
  assert.match(source, /canonicalCerts\.filter\(\(c\) => isCertificationIndexable\(\{\s*slug: c\.slug,\s*questionCount: c\.questionCountByLang\[lang\] \?\? null,\s*\}\)\)/);
  const certs = [
    { slug: SLUG, questionCountByLang: { it: 274, en: 274, fr: 0, es: 0 } },
    { slug: "ccna", questionCountByLang: { it: 1358, en: 1358, fr: 1358, es: 1358 } },
    { slug: "lfs101", questionCountByLang: { it: 356, en: 356, fr: 356, es: 356 } },
  ];
  for (const lang of LANGS) {
    const kept = certs.filter((c) => isCertificationIndexable({ slug: c.slug, questionCount: c.questionCountByLang[lang] ?? null })).map((c) => c.slug);
    assert.deepEqual(kept, ["ccna", "lfs101"], lang);
  }
});

test("metadata: both landing routes return noindex,follow from the indexability check before any registry logic", () => {
  const root = read("../src/app/certifications/[slug]/page.tsx");
  const localized = read("../src/app/[lang]/certificazioni/[slug]/page.tsx");
  for (const [name, source] of [["root", root], ["localized", localized]] as const) {
    const guard = source.search(/!isCertificationIndexable\(/);
    const planned = source.search(/publicationStatus === "planned"/);
    assert.ok(guard > 0 && planned > guard, `${name}: indexability guard first`);
    assert.match(source.slice(guard, guard + 400), /robots: \{ index: false, follow: true \}/, name);
  }
});

test("discovery: planned certifications are not listed; published ones are", () => {
  assert.equal(isPubliclyListed(SLUG, CERTS_BY_SLUG), false);
  for (const slug of ["ccna", "lfs101", "az-802", "apple-device-support", "unknown-db-only-slug"]) {
    assert.equal(isPubliclyListed(slug, CERTS_BY_SLUG), true, slug);
  }
  const list = read("../src/app/[lang]/certificazioni/CertificationsListView.tsx");
  assert.match(list, /isPubliclyListed\(c\.slug, CERTS_BY_SLUG\)/, "certifications list + its JSON-LD filter planned slugs");
  const category = read("../src/app/[lang]/categorie/[cat]/page.tsx");
  assert.match(category, /publicationStatus !== "planned"/, "category pages filter planned slugs");
});

test("page: planned landing is 404 publicly; a local developer preview may render it", () => {
  const view = read("../src/app/_views/CertificationDetailView.tsx");
  assert.match(view, /if \(isPlannedCertification\(reg\) && !isPlannedPreviewEnabled\(\)\) return notFound\(\);/);
  const on = { [PLANNED_PREVIEW_ENV]: "1" };
  assert.equal(isPlannedPreviewEnabled({ ...on, NODE_ENV: "development" }), true, "local next dev with the flag");
  assert.equal(isPlannedPreviewEnabled({ ...on, NODE_ENV: "production" }), false, "never in a production build");
  assert.equal(isPlannedPreviewEnabled({ ...on, NODE_ENV: "development", VERCEL_ENV: "production" }), false, "never on Vercel production");
  assert.equal(isPlannedPreviewEnabled({ NODE_ENV: "development" }), false, "off without the flag");
  assert.equal(isPlannedPreviewEnabled({ [PLANNED_PREVIEW_ENV]: "true", NODE_ENV: "development" }), false, "only the exact value 1");
});
