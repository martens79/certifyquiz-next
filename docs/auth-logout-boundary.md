# Explicit logout boundary

Prepared from frontend main `955be68072c1b0ab3e75990eb76b0bfbea5a7a10`, separately from PR #162. No quiz bootstrap fix is included.

## Problem and behavior

Both header variants previously called the local `logout()` helper. This removed access tokens and cached identity but left the HttpOnly refresh cookie intact. The next bootstrap could recover the previous identity. Independently, a refresh or successful `/me` response already in flight could republish credentials or cached user state after logout.

The desktop menu and mobile drawer now use the existing server-aware `authLogout()` flow. It immediately clears the outgoing user's local credentials/cache, records an explicit logout boundary, and calls `/api/backend/auth/logout` with credentials. It waits for server acknowledgement before redirecting. Failure keeps the browser signed out, displays a retry action, and persists that boundary across reload/navigation.

`cq:auth-session` contains only a functional generation, logout state and pending-server flag. It contains no account identifier, token, price or analytics information. Local storage shares the boundary across tabs; session storage is the fallback when local storage is unavailable. If both are unavailable, the in-memory boundary only survives the current document; successful server cookie removal remains essential across reloads.

The two HTTP clients and auth UI consumers compare request generations. Old refresh, retry and decoded identity responses are discarded after a logout or new explicit login. New authenticated mutations are blocked after explicit logout. Public reads and anonymous quiz evaluation remain available without sending credentials; they cannot silently refresh the previous account. Password login, successful direct registration and a server-validated OAuth callback explicitly open a new generation. Ordinary access-token expiry can still recover from a valid refresh cookie when no explicit logout occurred.

## Study progress

The existing outgoing-user cache cleanup remains scoped to that user. Anonymous study state and other account scopes are preserved. No server study progress is deleted. `QuizEngine`, its identity bootstrap and the separate early-answer-loss defect are unchanged.

## Existing backend model, read-only verification

Backend main inspected: `a7e337f035c4ce35d742d50e88a4231d663a1299`. `routes/authRoutes.js` implements `/logout` by clearing only `rt` with the same domain/path/secure/sameSite/httpOnly options used to issue it. `/refresh` verifies a signed JWT and the current user. There is no server-side session revocation store in this flow.

The read-only check can execute the actual cookie-option and logout-handler fragments from a supplied backend source snapshot:

```sh
node scripts/verify-logout-cookie-contract.mjs /path/to/backend-auth-main.js
```

It imports no backend modules or environment files, opens no database and sends no requests. It passed against the main snapshot for development and production options. No backend change or migration is proposed. This does not attest the live runtime environment variables or a live cookie jar.

Already-issued stateless JWTs are not globally revoked by this change and retain the existing expiry semantics. The guarantee is that this browser's explicit logout boundary will not consume a lingering refresh cookie or an old response to restore authentication. Requests already accepted by a server before logout cannot be rolled back by a frontend guard. Other devices are unaffected.

## Validation

- Before: the diagnosis reproduced cookie recovery after local logout, and a late refresh restoring a token even after the old server-aware helper.
- Unit regressions cover both HTTP clients, late response/body decoding, coalesced logout, server errors/retry, ordinary refresh, login, anonymous reads, storage fallback and scoped progress cleanup, plus existing API/quiz/privacy suites.
- Browser regressions run on Chromium desktop 1440×1000 and Pixel 7 emulation 412×839 with no real identities: fresh guest, saved anonymous answer/reload, cookie deletion, navigation/reload, deliberately late cookie, failed logout/retry, failed/successful login, second tab, late refresh and `/me`, registration, OAuth, and quiz completion without authenticated result submission after logout.
- All browser API calls are intercepted. SSR uses the loopback fixture; third-party traffic is blocked, with a synthetic Turnstile script. No real login, registration, payment, production DB or Stripe operation is performed.
- `Auth logout isolation` CI runs unit tests, targeted lint, full build/typecheck and this browser matrix against an isolated production server. Existing hook-dependency warnings remain outside this change; no lint rules are disabled.

## Release boundary

The temporary branch-only Vercel deployment guard was removed for authorized release validation. Main originally had no vercel.json, so deleting that temporary file restores the original Vercel configuration without changing project settings or other branches. The release head must pass all checks before the authorized squash merge and Production smoke test. PR #162 is unchanged.
