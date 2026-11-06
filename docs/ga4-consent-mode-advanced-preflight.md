# GA4 Consent Mode Advanced — preflight for CertifyQuiz

Status: **EXPERIMENT ONLY / NO DEPLOY** (2026-11-06)

## Verified on main
- `src/components/analytics/GoogleAnalytics.tsx` renders the gtag init and remote script only when `ready && status === "granted"`.
- `src/lib/consent-mode.ts` already defaults `analytics_storage`, `ad_storage`, `ad_user_data`, `ad_personalization` to denied unless explicit analytics consent; marketing always denied.
- `ConsentProvider.tsx` updates consent and revokes analytics identifiers on refusal.

## Smallest possible change, subject to legal/privacy approval
1. Keep default consent **denied** and ad consent **always denied**.
2. Initialize Google Consent Mode **before** loading gtag. Avoid a transient granted state or duplicate initialization.
3. Under a deployment-controlled feature flag (off by default), load gtag on nonsensitive pages even with denied analytics consent, allowing consent-mode cookieless pings. Preserve the consent-update and revocation behavior.
4. Verify with browser network and cookie inspections for unknown, rejected, accepted and revoked consent; test sensitive URL exclusion, SPA navigations, no accidental duplicate pageviews, and browser blockers.
5. Obtain privacy review for Italian/EU visitors before enabling cookieless transmissions. A denied cookie state does **not** itself establish that Google requests are exempt from consent requirements.
6. Compare GA4 observed vs modeled metrics only after enough traffic/time; modeling is not guaranteed at low volume. No claim of accurate live visitors.

## Go/no-go
- GO only if privacy review explicitly approves the chosen data flows, tests pass, and the change can be rolled back.
- NO-GO if approval is unavailable or pre-consent requests contain personal data or violate the site's consent policy.
- Never merge or deploy this branch automatically.

## Alternative
Keep basic consent mode and use registration, quiz completion and payment events as verified activity measures while traffic measurement remains incomplete.
