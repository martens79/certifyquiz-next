# Frontend checkout return and analytics consent

This change is based on `integration/frontend-release-20261022` (integration PR #152), not directly on main. Its draft PR should target that branch so unrelated integration commits do not enter this diff.

## Package success

`apiFetch` already attempts refresh before returning a final 401. The success page stops polling on that response and offers a localized login link. Its `redirect` parameter contains the complete current pathname and query, including `order_id` and repeated query keys. The existing login component reads that internal destination and navigates back after successful authentication.

The page opts out of `apiFetch`'s legacy automatic redirect via a new optional argument. Other callers retain the old default. In this mode, refresh 429/5xx/network errors remain retryable and do not clear the token; they must not be mistaken for a definitive 401. Tests exercise the real wrapper with successful refresh, rejected refresh, transient errors and default behavior.

Polling uses one timeout scheduled after a request finishes. Pending orders and temporary errors remain retryable; a paid order, final 401 or unmount stops the loop. Cleanup cancels the timer and aborts the request. A response that arrives after cleanup cannot update state or schedule another request.

Automated component tests use real React hooks with mocked Next boundaries and API responses. They cover final and later 401s, unchanged request count after 401, full return query, successful login return, pending-to-paid progression, temporary-error recovery, no overlapping requests, timer cleanup and late-response cleanup. No Stripe checkout is created.

## Google Analytics

Neither the external tag nor inline initialization is rendered until consent is ready and explicitly granted. Initialization establishes all-denied defaults. An onReady callback checks the current stored preference, updates only analytics storage and then configures GA once. The callback is shared by both scripts so either loading order works. A late callback after withdrawal cannot configure GA or re-grant consent. Advertising storage, advertising user data and personalization remain denied in both the Provider and GA component. Existing sensitive-route exclusions and guarded application analytics remain in place.

On revocation, the effect still sends a denied consent update to an already loaded `gtag`, and React stops rendering the scripts. Tests verify the update, stale-callback denial and the fact that the loaded runtime remains available. They do **not** claim that removing a React Script component unloads Google or guarantees zero subsequent requests. Google Consent Mode may emit cookieless traffic even with denied storage. A script request already in flight cannot be undone by the callback guard.

If the product requires zero Google traffic after a grant is revoked, a separate change needs an explicit policy and browser network tests for SDK loading, automatic measurement, consent updates and a fresh document after revocation. This PR does not silently expand into runtime teardown or production analytics settings. Pending onReady callbacks re-read consent before configuration or flushing.

## Existing local E2E evidence (no new payment)

- Paid sandbox order `1185ab89-a433-4c17-a802-39b91a102aef`, user 876, Dolphin CCNA / CCNA Study.
- Browser profile showed user 876 and the active package; the confirmation showed `Access activated`. Local backend logged HTTP 200 for auth and that order.
- Actual study-page content, browser GA/Meta network traffic under denied consent and network behavior after revocation remain **NOT VERIFIED**. Browser instrumentation previously timed out; static/component tests are not substitutes for those network observations.
- No credential reset, backend/database change, payment, stack restart, deployment or production analytics action belongs to this change.

## Validation results

- 66/66 relevant tests passed together (13 new component/auth checks plus 53 existing regression checks).
- TypeScript passed, including the `npm run build` precheck.
- ESLint on all modified TypeScript/TSX files passed.
- Repository-wide `npm run lint` fails on the existing `prefer-const` error in `src/components/quiz/QuizEngine.tsx:973`; that file is unchanged relative to the integration base.
- The local optimized build did not complete: native Windows SWC reported `not a valid Win32 application`; the WASM fallback was started but interrupted without a completed build result. This is not recorded as a passing local build.
- GitHub privacy/conversions checks passed on the initial revision; recheck them on the final PR head. The Vercel GitHub integration also automatically reported a successful preview check; no manual deployment was initiated.
