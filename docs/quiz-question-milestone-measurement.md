# Quiz question milestone measurement

| Boundary | Measurement change |
|---|---|
| 6 November 2026 | The GA4 tag resumed loading with denied defaults. Coverage for aggregate GA4 traffic changed. Product events still use the existing consent check. See commit 0433d9c3fae4c54188241ded6859e70d31b86ff3. |
| Deployment of the quiz milestone fix, pending | The quiz emits `quiz_question_reached` once per tracked position and quiz scope when the question text intersects the viewport in a visible document. The old series could count the initial index while the quiz was still loading. |

Record the deployment timestamp in Europe/Rome and the deployed SHA before comparing the series. Split comparisons at both boundaries, using only complete days with the same measurement contract and segmenting by device and quiz mode. Keep the legacy series for historical reporting. Check counts by milestone, especially position 1, after release.
