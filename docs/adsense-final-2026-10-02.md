# Final AdSense inventory audit — 2026-10-02

Source: production MySQL `quiz_db`, SELECT-only transaction. Local DB was excluded because it is out of date.

- Audited: 65 certifications, 428 topics, EN/IT/FR/ES.
- Zero inventory: 14 certification IDs in at least one language (6 in all four), 41 certification/language combinations.
- Published zero-inventory topics: 86 IDs, 185 topic/language combinations.
- Low inventory (1–9 usable questions): 61 published topic/language combinations; inventory alone does not imply editorial quality.
- Live sitemap: 384 URLs; no zero-inventory certification or topic URLs.
- Zero-inventory URL states: 205 direct HTTP 200 pages with noindex, 20 existing Microsoft AI legacy HTTP 301 redirects, 1 HTTP 404.
- Direct zero-inventory pages eligible for indexing: 0.
- Live pages with quiz CTA targeting their empty inventory: 175.

## Implemented fixes

Certification details and resource cards count only published topics and active questions with usable localized question/answer text, using the same rules as topic inventory. Empty topic links are removed from certification and related-topic lists; direct existing topic URLs remain accessible. Frontend suppresses primary, mobile, content and free-test quiz CTAs when inventory is zero or unknown. Certification metadata/sitemap require known positive counts, hreflang excludes empty languages, and topic inventory is fetched fresh for robots and actions.

No educational content or database rows were changed. Existing 404 guards and legacy redirects remain in place. Topic URLs were already intentionally omitted from the sitemap pending an editorial-quality feed; this audit does not expand that policy.

## Validation

- Frontend: typecheck and final production build PASS; 10 focused tests PASS.
- Backend: 25 relevant tests PASS; 32 HTTP requests against production data in a read-only transaction PASS, including zero/valid counts and lists.
- Final built frontend: 16 inventory pages and 8 nonexistent URLs PASS across EN/IT/FR/ES. Mixed PEKIT inventory hreflang PASS (IT only). Global generated sitemap validation: all 207 eligible certification/language URLs present, all 41 zero-inventory certification/language URLs absent, no unexpected URLs.
- Live public routes: homepages, labs, blog, guide catalogs, reviews, About, Contact, Privacy, Terms and cookie policy checked. `/guide` and `/cookies` are the actual EN navigation destinations; invented `/guides` and `/cookie` probes were not treated as blockers.
- Full backend suite: 560 PASS, 4 FAIL, 2 SKIP (566 reported tests). Failures: exhibit normalization coverage guard, legacy question-route expectation (404 vs 200, plus its file aggregate), and a Node test-runner deserialization error in postGateHardLockEnforcement.e2e. These are outside the inventory changes. The exhibit normalization guard also fails with test and validator files identical to origin/main (after line-ending normalization).
- The repeatable exporter was run against production and matched the original inventory exactly.
- Changes are not deployed. Production still has the 175 empty-inventory CTA pages; post-deploy verification is pending.

Exact ID/slug/language/status/robots/canonical/hreflang/sitemap/CTA inventory: `zero-inventory.csv`. Low inventory: `low-inventory.csv`. The complete inventory exports and read-only audit script are in the companion backend PR.

ADSENSE REVIEW: NOT READY
