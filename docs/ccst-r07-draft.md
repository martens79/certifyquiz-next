# R07 — mixed-version training response compatibility

Accepts `release-07-v7` alongside legacy/R02/R03/R04/R05/R06. Unknown R08 still fails closed. This prevents `INVALID_ATTEMPT_RESPONSE` when the separately gated R07 backend is enabled after owner authorization.

Based on the R06 frontend branch. This PR is stacked on R06; review and merge R06 first. Typecheck PASS and unit tests 89/89 PASS on this R07 branch. No default UI, entitlement or quota changes, and no CCST Networking changes.

Backend catalog: 32 items, manifest `75d811a178f6a8c8386cd108658872d66bb7089d8da017224f312956cac1bafb`.

GO merge after R06 and the matching R07 backend. NO-GO LIVE without specific owner authorization. No merge, deploy, flag or secret change performed.
