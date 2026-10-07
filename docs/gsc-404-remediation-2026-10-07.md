# GSC 404 remediation — 2026-10-07

The audit identified 51 P0 URLs and 40 additional exact legacy redirects across 287 GSC URLs. This change repairs the shared causes rather than redirecting unknown topics to landing pages.

- Resolve TensorFlow and C# public slugs using the existing database certification keys; normalize generated certification links to their public canonical roots.
- Stop redirecting every Google Cloud topic into the different Digital Leader certification. All 15 affected Google Cloud topic endpoints returned 200 in a read-only production API check.
- Add 92 exact same-page mappings, including the 40 newly proposed redirects, verified aliases, and existing exact mappings that must survive removal of the Google Cloud wildcard. Preserve query strings.
- Normalize audited stale blog links during PortableText and markdown rendering, including the CEH unauthorized-access link.
- Hydrate footer email links locally so Cloudflare cannot introduce crawlable email-protection routes into server HTML. Email links become available after hydration.

No database, CMS, sitemap, or Cloudflare configuration writes. The 65 KEEP_404 URLs and unresolved audit cases remain unchanged. Existing unrelated generic redirects are outside this change.

## Validation

- Configured tests/ suite: 403 passed, zero failed.
- TypeScript typecheck, changed-file ESLint, and git diff whitespace check passed.
- Regression coverage includes exact redirect targets, query preservation, invented-topic guards, Google Cloud passthrough, all four languages, database slug resolution, blog output and footer server HTML.
- The unconfigured legacy src/__tests__/seo.test.ts has a pre-existing unresolved ./seo import; it is unchanged.
- Production build and hydrated browser behavior must be confirmed by the preview environment. Local production environment variables are unavailable.

## Release verification

After deployment, recheck all 51 P0 URLs, all 40 new exact redirects, and representative legitimate 404s. Inspect the five recent TensorFlow failures, SAP and Python exact targets, all C# aliases and Google Cloud topics. Confirm canonical/robots output and generated internal links. Confirm the sitemap stays clean. A GSC crawl date alone does not prove the current site still generates an old URL.
