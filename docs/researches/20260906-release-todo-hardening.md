# Release todo hardening

## Single downstream gitignore authority

`assets/templates/runtime.gitignore` owns the shared runtime ignore rules. The TypeScript adoption planner and shell bootstrap load the packaged text asset. Both retain their existing managed markers and preserve user-authored content. The shell loads the asset lazily so sourcing its policy-merge helpers does not require cat or dirname on a restricted PATH. Missing assets fail rather than generating an empty managed block.

## Bounded retained hook telemetry

The active JSONL file rotates by rename at 8 MiB before append. Retention keeps at most 32 owned archive segments and 256 MiB of archived bytes. Only exact segment filenames inside the dedicated archive directory are eligible for removal; unrelated files are preserved. Concurrent appends may temporarily exceed the active threshold, and retained time coverage shrinks as event volume grows.

Rotation never truncates an inode. Already-open append descriptors finish in the archive; readers open retained archive and active descriptors under the same maintenance lock, then stream unlocked. Pruning cannot invalidate an opened snapshot. Both diet and benchmark readers include retained history and keep their existing protocol validation. An explicitly supplied custom diet log remains a single-file input. These are retained-history metrics, not lifetime counters.

The caller's original log leaf is checked with lstat before canonicalizing its parent. Resolving the leaf first would erase an in-repository symlink and permit destructive retention of its target. Regression coverage includes small, rotation-sized and over-budget targets, asserting unchanged inode/size/mtime and no archives. O_NOFOLLOW and archive identity checks remain meaningful after this ordering. This protects cooperative cache processes and existing symlink boundaries; it is not an openat sandbox against hostile same-user directory replacement between syscalls. Telemetry storage failure retains the hook's existing fail-open behavior.

## Audited invalid-contract repair

The verifier owns failure_class. Missing or invalid verification authority is missing_artifact and projects as checks_artifact_invalid. Ordinary contract failures, budget exhaustion, missing/unknown classes and unavailable runtime remain ordinary failures; consumers never infer the class from error text.

`repo-harness state next --json` uses the existing continue_active_plan route to name the active contract and `repo-harness state repair-artifact --reason '<actual reason>' --json`. Issuance requires exactly one fresh invalid-artifact blocker and an executable active plan/contract. The immutable ignored receipt under `.ai/harness/state/artifact-repairs/` records class, reason, contract path/hash, checks hash and subject_revision, which already binds review subject and target revision.

A matching receipt permits only an edit whose entire target set equals the current contract. It does not waive other edit requirements, allow source edits, clear the blocker or authorize stop/ship. Changing contract/checks/subject invalidates permission. Complete a bounded repair and rerun normal verification. Missing, malformed, conflicting and stale receipts fail closed. Ordinary failing tests retain their existing contract-scoped repair behavior. Repair permission is never an AcceptanceReceipt or an attempt receipt.

## Verification and publication authority

The consolidated release-todo integration contract owns final verification and publication. Its typed Verification Plan records current checks and an explicit historical baseline with named delta coverage. Neither an old broad pass nor parent remediation of an external finding becomes an exact external acceptance for new source.

AcceptanceReceipt consumes the materialized `.ai/harness/checks/latest.json` boundary. Raw run snapshots retain unredacted command text and do not substitute for the evidence writer projection expected by immutable validation. Package verification uses the normal tarball install path, real CLI startup and packaged Operator serving. Architecture proof-only drift closes through a typed reconciliation receipt with a current empty noop, not an invented architecture waiver.

No dependency was added. The shared text asset serves both gitignore producers, the retained log store serves the writer and two readers, and the repair schema is shared by issuer and state projector. Active/archived contracts and their canonical review projections own acceptance status; this document explains behavior and boundaries rather than asserting a release version or deployment state.
