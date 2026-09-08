# Pre-active observation decisions

A completed group is not a bootstrap source. The observation request owns its digest and has no issue-batch intent. Existing campaign provider accounting remains the only ledger; no authoring rounds or active state are created. Raw transport observation is never revision authority.

The existing integration branch carries accepted historical packages relative to origin/main; allowed_paths inherits the previous accepted branch boundary. This package edits only its named source/test paths and docs. Initial prepare stopped at that scope preflight before executable checks; rerun after correcting scope does not duplicate tests.

The fixed authorized target has finite Issue selection. Direct grant consumption separates readonly revision observation from campaign-start Issue completeness, preserving both the exact remote target and the start guard. The security review stop/admission interleaving reproduced in /tmp/brc14-observation-stop-race-red.log before the mutation-lock fix.

Admission rechecks target/expiry immediately before reservation, not after provider completion. An admitted in-flight call may finish after expiry or a stop; its original result must still be retained and reconciled. It never becomes revision authority. A second deterministic interleaving (competing grant creates the campaign between preflight and request write) failed before the store write checked the same grant/state under its own mutation lock; /tmp/brc14-observation-grant-race-red.log retains the pre-fix result.

A completed raw result is settlement authority for its original reservation, not permission for another call. Replay verifies the anchored grant and immutable request/result binding before current target/state admission checks, so later stop/target movement cannot strand already-returned evidence. /tmp/brc14-observation-replay-red.log captures the failing interrupted-settlement case before this ordering fix.

Canonical baseline run-20260908T125847-13298 passed 13/13 on 4bd3df72. The subsequent bounded delta moves only observation replay ahead of new-call guards and adds its regression. Final focused coverage narrows to observation plus campaign budget prerequisites; the prior authoring/audit/CLI suites remain baseline evidence for their unchanged paths. Typecheck and six integrity checks still run for the final subject. No full suite is required.

The generated contract defaulted to codex-plugin, but this package used the same native Codex independent review path as the preceding accepted package. Acceptance source is corrected to codex-review (protocol 2, reviewer still Codex), preserving the actual review provenance rather than relabeling it as a plugin invocation. No production gate or test requirement is changed.
