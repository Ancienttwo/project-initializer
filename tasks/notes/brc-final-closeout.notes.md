# BRC final integration closeout

Integrates the already accepted BRC packages with main cfb26baa and audit PR #358. The authoring conflict retains the frozen-revision capability schema together with the parser-valid example and all exact metadata constraints. The audit test receives the now-required capability argument. Architecture projection provenance remains its original baseline and is not relabeled as new evidence.

> **Substantive Change SHA256**: `sha256:41c4587a65f9c05d513d2e2349be75321fcd4c1b1546b4b5ac3b8573364e4a77`

Validation: 113 focused tests across eight files pass, metadata-specific rerun passes, typecheck passes, SQL/architecture/workflow/state/adoption checks pass. Original package acceptance remains evidence only for its original revision. Remote CI is still required for the integrated candidate.

Owner narrowed this round to integration and bounded failure closeout. BRC6a and BRC15a remain closed; BRC14 and BRC15 have unfulfilled live acceptance and must not be marked passed. No active campaign started. R4 failed before prompt submission; reservation reconciled conservatively with no open reservation, not evidence of a model turn. Oracle 14cfbfc6 fixes the reproduced hydration race; 26 browser tests and a no-send Profile 13 real UI check pass. No new model probe is part of this closeout.

Full PR integration binding against main cfb26baa:

> **Substantive Change SHA256**: `sha256:8834b4d41c05f13294883d24a88e4b4aa8f213aed9a8b089358e0b15d1762334`

## Final CI delta

CI 34199753915 finished with two stale test expectations: campaign command enumeration omitted observe-revision, and the loop characterization retained two digests of the old readiness golden files. Updated only the command list and those two fixture hashes. All 18 affected CLI/state tests pass; repository integrity checks pass. No production behavior changed.

> **Substantive Change SHA256**: `sha256:c925689f594146d003d1cd34eedf36e70e3cc2eb9a5cfb0b331ec080252b862d`

> **Substantive Change SHA256**: `sha256:ca529db4ad9248d04f7616314900ea5591571ddc97f07982b4de458d1c3c64f3`
