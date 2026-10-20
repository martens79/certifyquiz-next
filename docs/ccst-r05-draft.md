# CCST R05 frontend compatibility — Draft

Accept release-05-v5 questions together with legacy/R02/R03/R04 in versioned training. The backend R05 catalog is inactive unless explicit R05 flags are set; this change sets no flags.

The unknown-version fixture now uses release-06-v6. This preserves strict rejection while preventing INVALID_ATTEMPT_RESPONSE when R05 is later authorized.

Validation: TypeScript typecheck PASS; all 89 unit tests PASS. No deployment or merge performed. R05 editorial final review remains open in the backend Draft; activation NO-GO. R06 is not supported by this change.
