# Premium offers: future release checklist

These Drafts are stacked on backend #169 / frontend #194, which remain unchanged and unmerged. Do not merge or deploy without separate approval. The production main branches currently auto-deploy: a future merge is also an operational deployment trigger. The branch-specific Vercel exclusions prevent preview deployments of these Draft heads; Railway PR environments were verified disabled.

## Order

1. Review/authorize the base PRs #169/#194. After their eventual merge, retarget only the new PRs to main; recheck the final diff and CI. Squash merges may require transplanting only the new commits, without changing the original PRs. Backend trial schema and an approved UTC eligibility cutoff must exist before trial processing is enabled; never copy a synthetic-test cutoff blindly. Deploy compatible backend before frontend trial wording.
2. Quarterly is independent of the offer ledger. Reuse the existing active live EUR 1990 month/3 Price price_1TYqbYQpM621ojl3oEVZcbcj (Product prod_UXwUv8BWkwhpXs, Abbonamento Trimestrale), verified by GET on 6 November 2026. No new live Price or Price edit is needed. Keep existing subscriptions on their original Price. Deploy with quarterly/plan-change flags off, verify correct Price, enable backend, then build/enable the frontend.
2. Quarterly is independent of the offer ledger: authorize a new live EUR 2390 month/3 Price first. The currently configured live quarterly Price is EUR 1990 and must not be edited in place. Keep existing subscriptions on their original Price. Deploy with quarterly/plan-change flags off, verify correct Price, enable backend, then build/enable the frontend.
3. The separate offer-ledger schema PR must be reviewed and its SQL explicitly authorized/applied before BF ledger processing. Its merge does not apply SQL. MySQL production is 9.7.2; the new DDL is verified on disposable MySQL 8 and 9 CI. No existing table is altered.
4. BF backend then frontend, initially acquisition flags off. Verify the standard EUR 5990 annual Price and separately authorize/configure a 50% duration=once coupon restricted to that Product, redeem_by 2026-12-01 00:30 Europe/Rome. Enable ledger processing before offer acquisitions. Server time opens/closes the 27–30 November campaign; no live activation performed here.
5. The two feature PRs touch shared billing/pricing files. Before releasing both, reconcile only the new branches and rerun full CI on the combined result; no combined merge/deploy is authorized now.

## Existing subscriptions and rollback

Never move existing subscriptions to new Prices, extend their trials, reapply first-year discounts or reset consumption. New plan changes support only active classic billing, one standard monthly/quarterly item, quantity 1 and no discount/pending update/external schedule. Historical different Prices fail closed. Past-due subscriptions use recovery, not another acquisition.

Quarterly rollback: stop new acquisition/changes with their flags; keep a compatible backend. Cancellation of an already owned schedule remains allowed when feature flags are off. The frontend panel is hidden if its build flag is off, so keep a release path through the compatible backend or release owned schedules before removing that UI. Stripe Portal cannot cancel while a schedule is attached; release does not cancel the paid subscription. Do not delete schedules blindly or roll back to a backend that cannot explain/manage them.

BF rollback: disable acquisition and frontend offer flags; retain table, consumed rows, PREMIUM_OFFERS_LEDGER_ENABLED and compatible webhooks. Honor valid sessions for their approved Stripe lifetime, maximum 30 minutes. Do not DROP tables, reset consumed_at or roll back to pre-offer code while reservations/payments still need processing.

## Post-deploy, only after future authorization

Check actual deployed SHA, flags and API routing; exact schema/indexes and restricted runtime DML grants; Price currency/amount/interval/count; trial 3 days only for eligible accounts with permanent history; authenticated status and pending schedule; real webhook signature verification and event coverage; invoice paid/failed and authoritative access; cancellation and end-of-period expiration; BF hidden before/after its window and no new promotional session at/after close. Observe errors, unprocessed/duplicate events and reconciliation backlog. Test Clocks remain test-only: do not replay synthetic events to live or advance real subscriptions. A live purchase/charge is not authorized by a read-only preflight.

Production frontend environment settings could not be inspected because the local Vercel CLI has no authenticated session; verify them before release. The previous production preflight found neither trial nor offer ledger and no new feature flags/coupon. The definitive EUR 1990 quarterly live Price is present and compatible, so Price creation is no longer a release blocker. These are release blockers, not authorization to change them.
Production frontend environment settings could not be inspected because the local Vercel CLI has no authenticated session; verify them before release. Current production has neither trial nor offer ledger, no new feature flags/coupon, and no EUR 2390 live Price. These are release blockers, not authorization to change them.
