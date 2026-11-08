# Quarterly frontend

Based on frontend PR #194. Set NEXT_PUBLIC_PREMIUM_QUARTERLY_ENABLED=1 at build time only after the matching backend is configured. Default off. Four-language price EUR 19.90 every three calendar months, automatic renewal. Quarterly is charged immediately (EUR 19.90 today): no trial badge or trial wording; the 3-day trial is advertised on the monthly plan only.

Active monthly/quarterly accounts can schedule the other plan at period end without prorations. The panel shows the scheduled date and explains release of a Stripe Schedule before cancellation in the existing profile portal. No new trial on a plan change. Existing discounted, flexible billing or externally managed subscriptions are intentionally rejected by the backend.

Tests: quarterly-pricing.test.tsx, existing weekly-pricing.test.tsx, TypeScript, and local protected browser on all four pricing routes. Locked dependencies unchanged.

Definitive quarterly price is EUR 19.90 (1990 cents), including all four translations, renewal and scheduled-change text, and the Meta plan-value mapping. Reuse the existing validated live quarterly Price through backend configuration; no live resource creation or subscription migration. Rollback hides new acquisition only after preserving a route to release existing schedules; never reintroduce the superseded proposed price. Other plans, Black Friday and the single 3-day trial policy are unchanged.
