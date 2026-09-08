# Pre-active observation decisions

A completed group is not a bootstrap source. The observation request owns its digest and has no issue-batch intent. Existing campaign provider accounting remains the only ledger; no authoring rounds or active state are created. Raw transport observation is never revision authority.

The existing integration branch carries accepted historical packages relative to origin/main; allowed_paths inherits the previous accepted branch boundary. This package edits only its named source/test paths and docs. Initial prepare stopped at that scope preflight before executable checks; rerun after correcting scope does not duplicate tests.

The fixed authorized target has finite Issue selection. Direct grant consumption separates readonly revision observation from campaign-start Issue completeness, preserving both the exact remote target and the start guard. The security review stop/admission interleaving reproduced in /tmp/brc14-observation-stop-race-red.log before the mutation-lock fix.

Admission rechecks target/expiry immediately before reservation, not after provider completion. An admitted in-flight call may finish after expiry or a stop; its original result must still be retained and reconciled. It never becomes revision authority. A second deterministic interleaving (competing grant creates the campaign between preflight and request write) failed before the store write checked the same grant/state under its own mutation lock; /tmp/brc14-observation-grant-race-red.log retains the pre-fix result.
