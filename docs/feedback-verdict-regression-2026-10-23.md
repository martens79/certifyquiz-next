# Server verdict regression checks

Training marks a choice before the answer-check response arrives. The existing
`serverResult` guard must keep correctness symbols and error styling hidden until
the server has returned the answer key. This check applies to the shared quiz
engine on desktop and on a 390×844 mobile viewport.

The two new tests hold `/answers/check` behind a promise barrier. They assert no
cross, no red error class and no correctness checkmark while pending, then the
correct checkmark after releasing the response. Question and answer data are
synthetic. No production database or user account is used.

The existing mock-exam test now intercepts `/mock-exam/evaluate/:certificationId`
and verifies exactly one evaluation at completion, with no training check or
assessment evaluation request. Topic metadata is mocked as well, avoiding an
uncontrolled backend request during protocol tests.

Validation on 23 October 2026:

```powershell
$env:E2E_BASE_URL='http://127.0.0.1:3024'
node node_modules/@playwright/test/cli.js test tests/answer-check-protocol.spec.ts --workers=1 --retries=0 --reporter=list
```

Result: **6 passed**, including both pending-verdict viewports, the existing
training explanation/access checks and the updated mock-exam protocol check.

No application verdict logic is changed: main already includes the server-result
guard. Earlier attempts encountered local server/compilation issues and a test
locator issue; only the final complete run is reported as passing. A separate
negative-control attempt failed before reaching the answer and is inconclusive.
Persistence races, rapid changes of choice, real-device resume and deployed build
identity have not been certified by these tests.
