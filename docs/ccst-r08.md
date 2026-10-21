# CCST Cybersecurity R08 compatibility — Draft

Accept `release-08-v8` alongside legacy and R02–R07 question versions in the existing training validator. Keep unknown versions rejected (`release-09-v9` fixture). This prevents `INVALID_ATTEMPT_RESPONSE` when the future backend R08 overlay is enabled.

No training UI, quota policy, content key, persistence format or LIVE flag changes. The backend owns the 15-item four-language catalog and exact manifest hash. R08 activation is not authorized by this PR; old attempts remain supported.

Validation: mixed-version transport regression plus the existing unit suite, typecheck and production build. End-to-end LIVE R08 activation and Premium access are NOT_TESTED.
