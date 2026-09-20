import assert from "node:assert/strict";
import test from "node:test";
import {
  isCertificationIndexable,
  NON_INDEXABLE_CERTIFICATION_SLUGS,
} from "../src/lib/seo/certification-indexability.ts";

test("incomplete and thin landing pages (SAP, LFS101 build-out) stay out of the index", () => {
    assert.deepEqual([...NON_INDEXABLE_CERTIFICATION_SLUGS], [
      "sap-s4hana-financial-accounting",
      "sap-s4hana-sourcing-procurement",
      "sap-s4hana-sales",
      "sap-s4hana-production-planning",
      "sap-abap-cloud-developer",
      "sap-business-technology-platform",
      "sap-successfactors",
      "sap-analytics-cloud",
      "lfs101",
    ]);

    for (const slug of NON_INDEXABLE_CERTIFICATION_SLUGS) {
      assert.equal(isCertificationIndexable(slug), false);
    }
});

test("completed certification landing pages remain indexable", () => {
    assert.equal(isCertificationIndexable("ccna"), true);
    assert.equal(isCertificationIndexable("itil-4-foundation"), true);
    assert.equal(isCertificationIndexable("networking-foundations"), true);
});

test("certification inventory fails closed when a reliable count is zero", () => {
  assert.equal(isCertificationIndexable({ slug: "lfs101", questionCount: 0 }), false);
  assert.equal(isCertificationIndexable({ slug: "az-802", questionCount: 0 }), false);
  assert.equal(isCertificationIndexable({ slug: "apple-device-support", questionCount: 0 }), false);
  assert.equal(isCertificationIndexable({ slug: "ccna", questionCount: 1 }), true);
});

test("LFS101 stays noindex while partially populated, even with a positive inventory", () => {
  assert.equal(isCertificationIndexable({ slug: "lfs101", questionCount: 88 }), false);
  assert.equal(isCertificationIndexable("lfs101"), false);
});
