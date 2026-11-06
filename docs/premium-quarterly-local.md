# Quarterly frontend

Based on frontend PR #194. Set NEXT_PUBLIC_PREMIUM_QUARTERLY_ENABLED=1 at build time only after the matching backend is configured. Default off. Four-language price EUR 23.90 every three calendar months, automatic renewal and the existing conditional single 3-day trial disclosure.

Active monthly/quarterly accounts can schedule the other plan at period end without prorations. The panel shows the scheduled date and explains release of a Stripe Schedule before cancellation in the existing profile portal. No new trial on a plan change. Existing discounted, flexible billing or externally managed subscriptions are intentionally rejected by the backend.

Tests: quarterly-pricing.test.tsx, existing weekly-pricing.test.tsx, TypeScript, and local protected browser on all four pricing routes. Locked dependencies unchanged.
