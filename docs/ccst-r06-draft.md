# CCST R06 response compatibility

Accepts `release-06-v6` together with legacy/R02/R03/R04/R05 in mixed training responses. Unknown `release-07-v7` remains rejected with `INVALID_ATTEMPT_RESPONSE`. Backend uses the independently gated R06 overlay and retains old attempts.

Backend R06 catalog: 51 reviewed items, four languages, manifest `2113f0d2d0a985e7c14b2362a24799e73e687fcf94a17322fe11bf2a2bafc963`.

This branch: typecheck PASS, unit tests 89/89 PASS, including mixed-version recognition. The backend integration tests separately cover persistence/history/quota carryover. No UI defaults, quota policy, or CCST Networking behavior changes.

GO merge with backend R06; NO-GO activation without the owner's explicit release approval. No deployment or environment changes executed.
