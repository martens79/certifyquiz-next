# Black Friday frontend

Based on frontend PR #194, independently of quarterly. NEXT_PUBLIC_BLACK_FRIDAY_2026_ENABLED=1 is a build-time flag, default off. Server availability controls the card; the client also hides it at the exact exclusive end. No artificial countdown.

Four languages disclose EUR 29.95 first year, EUR 59.90/year automatic renewal, cancellation, immediate payment without an extra trial, one use per account and Rome opening/closing dates. Existing valid sessions retain the price for their Stripe expiry, maximum 30 minutes; no new session after the campaign closes.

The promotional CTA uses a dedicated authenticated endpoint, never a client coupon or price and never a fallback full-price Checkout. Unauthenticated users return through localized login and explicitly click the offer again. Error responses do not silently open another plan. Tests verify translations/boundaries and actual local rendering; the future window was simulated only at UI/service boundaries, never exposed as a public time override.
