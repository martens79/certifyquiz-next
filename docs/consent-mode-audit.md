# PR #155: consent audit

## Collected preference

The active `CookieBanner` is mounted through `RootShellClient` and `ConsentProvider`. Before this review it offered one generic Accept/Reject for essential and optional cookies, with no separate advertising, marketing, Google Ads, user-data or personalization opt-in. The legacy `CookieConsent` component has the same undifferentiated model. It is not evidence of purpose-specific advertising consent.

The minimal policy is therefore analytics-only acceptance, not a new CMP or extra category. Banner copy now explicitly says analytics acceptance does not authorize advertising. Historical accepted values remain readable as analytics preferences; they never imply marketing consent. The UI wording and vendor disclosure should receive product/privacy review before release; this code audit is not a legal assessment.

## Storage and restoration

The Provider writes origin-local localStorage entries `cq_cookie_consent` (`accepted`, `ts`), `cq:cookie-consent` (`status`, `ts`) and `cookie-consent` (text). The reader prefers the current boolean, then legacy JSON, then legacy text. A current denial overrides an old acceptance; malformed data fails closed. Unknown means no saved choice. There is no purpose breakdown or enforced expiry in these records; this review does not invent advertising permission from a timestamp or a legacy acceptance.

The Provider restores state on mount. Refusal/revocation writes denial, clears application tracking identifiers and requests revocation of the anonymous conversion consent identifier. The rendered banner only offers a choice while status is unknown: no persistent preferences/revoke control or cross-tab state synchronization was identified. A product decision is still needed on exposing withdrawal; this mapping fix does not introduce a new preferences architecture.

## Confirmed problems and corrections

1. Both GoogleAnalytics and ConsentProvider mapped the same boolean to analytics and all three advertising signals. The former `granted` initialization in #155 repeated this over-grant. Both now use one mapper: analytics may be granted, `ad_storage`, `ad_user_data` and `ad_personalization` are always denied.
2. GA's external script remains blocked until ready/granted. Its inline bootstrap sets all-denied defaults. Only onReady, after reading current stored consent, can update analytics and configure GA. Both loading orders are supported; config is once per mount. Late callbacks after withdrawal cannot re-grant or configure. Google signals and ad-personalization signals are also disabled in GA config.
3. MetaPixel and the event helper treated analytics acceptance as marketing permission. The current UI collects none, so both fail closed. An existing `fbq` receives `consent/revoke`; this change never grants Meta consent.
4. Checkout analytics metadata no longer sends `marketing_consent=true` or `_fbp`. A versioned optional-metadata cache avoids resurrecting pre-policy advertising metadata under the same frontend request ID. Existing paid orders, receipts and Stripe sessions are not rewritten; retrospective server-side handling is outside this frontend-only review.

| State | GA initial load/config | Analytics storage | Advertising signals | Meta |
| --- | --- | --- | --- | --- |
| Unknown/not ready | none | denied defaults when initialized | all denied | blocked |
| Refused | none | denied | all denied | blocked/revoke old runtime |
| Analytics accepted | allowed; current preference checked at callback | granted | all denied | blocked/revoke old runtime |
| Withdrawn after load | no new config/flush; existing runtime receives denied | denied | all denied | blocked/revoke old runtime |

## Google Ads and limits

No AW-prefixed Google Ads tag, Ads conversion call or adsbygoogle loader was identified in the frontend scan. The AdSense account meta tag in RootLayout is verification metadata, not an ad script. This does not attest to remote GA4/Ads account links or configuration; no production account was inspected or changed.

`denied` is not a network kill switch for an already loaded Google SDK. Consent updates, SDK automatic measurement or already issued requests may still produce cookieless traffic. React unmount does not remove the loaded runtime. Zero requests after withdrawal remains unverified and is not claimed. A network-level test and an explicit post-withdrawal document/runtime policy are separate follow-ups.

Parameter meanings and this limitation are documented by Google: [Consent Mode overview](https://developers.google.com/tag-platform/security/concepts/consent-mode), [implementation guide](https://developers.google.com/tag-platform/security/guides/consent).

## Build isolation

The added `Isolated frontend build` workflow uses Ubuntu/Node 22, read-only repository permissions and no repository/environment secrets. API base URLs and the existing disposable rewrite override target loopback port 9; Sanity uses a dummy project/test dataset; analytics IDs and tokens are empty. It runs changed-file lint and the full `npm run build` (including typecheck), then requires a nonempty `.next/BUILD_ID`. Only the build log and BUILD_ID are artifacts. There is no publish/deploy step.

The pre-existing whole-repository lint error in QuizEngine is not changed. Existing Windows SWC limitations are separate from the Linux build result. Results must be read from the checks on the final dedicated commit, not inherited from an earlier PR head.
