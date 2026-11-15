# GA4 traffic regression — release gate (2026-11-06)

Status: INVESTIGATION / NO PRODUCTION CHANGE. Do not merge until the checks below pass.

## Confirmed from source
- July 19 commit `9e716536`: GoogleAnalytics loaded independently of consent.
- Current `src/components/analytics/GoogleAnalytics.tsx`: returns null unless `ready && status === "granted"`. Thus no GA tag on rejected/unknown consent.
- This is a plausible cause of the reported drop from ~25–30 daily users to ~1; not proven to be the entire cause. Deployment and GA4 reports have not been verified.

## Proposed minimal implementation (requires review before coding)
- Evaluate Google Consent Mode Advanced, with denied-by-default analytics/ad consent before any Google tag, no analytics cookies until explicit opt-in, sanitized URLs and excluded sensitive routes.
- Check applicable Italian/EU requirements before enabling cookieless measurement without consent. Do not assume cookieless pings are automatically exempt.
- Preserve existing consent revocation, no advertising opt-in, and event queue behavior. Avoid duplicate page_view/config.
- Do not modify Meta Pixel or unrelated features.

## Required verification
1. Identify Vercel production deployment SHA, compare with main and a known-good deployment.
2. Inspect actual network requests and cookies in a fresh browser for no decision, reject, accept, and revoke. Verify no personal tokens in URLs.
3. Run GA4 DebugView / realtime test and inspect GSC clicks for the same dates; don't infer traffic recovery from code tests alone.
4. Run existing `tests/google-analytics-consent.test.tsx` and add explicit regression coverage for all consent states, SPA navigation and duplicate pageviews.
5. Record pre/post numbers and obtain explicit owner approval before merge/deploy.

## Change-control rule
Treat `GoogleAnalytics.tsx`, `ConsentProvider.tsx`, `consent-mode.ts`, and related tracking initialization as protected. Any future changes require owner approval and GA4 regression tests. Do not silently alter tracking while implementing unrelated features.
