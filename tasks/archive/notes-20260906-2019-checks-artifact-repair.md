> **Archived**: 2026-09-06 20:19
> **Related Plan**: plans/archive/plan-20260906-1732-checks-artifact-repair.md
> **Outcome**: Completed
> **Lifecycle**: notes
> **Parent Run ID**: run-20260906-2019
> **Archive Projection V1**: `plans/plan-20260906-1732-checks-artifact-repair.md` => `plans/archive/plan-20260906-1732-checks-artifact-repair.md`
> **Archive Projection V1**: `tasks/notes/20260906-1732-checks-artifact-repair.notes.md` => `tasks/archive/notes-20260906-2019-checks-artifact-repair.md`
> **Archive Projection V1**: `tasks/contracts/20260906-1732-checks-artifact-repair.contract.md` => `tasks/archive/contract-20260906-2019-checks-artifact-repair.md`
> **Archive Projection V1**: `tasks/reviews/20260906-1732-checks-artifact-repair.review.md` => `tasks/archive/review-20260906-2019-checks-artifact-repair.md`

# Release todo integration boundaries

- The user approved one publication unit covering shared downstream gitignore rules, bounded hook telemetry history, and audited invalid-contract repair. Earlier slice plans/contracts are archived as superseded implementation provenance. PR/BRC work and version/tag/npm/global installation remain owned by release coordination.
- Main's Verification Plan and execution ID-binding changes are integrated. The run help grouping fix comes from main; no duplicate CLI implementation was added. Invalid Verification Plan authority now produces missing_artifact while budget/scope precedence and unavailable-Bun failure remain unchanged. The generated shell helper uses the same source.
- Artifact repair receipts are distinct from AcceptanceReceipt and continuation attempts. They bind the exact contract/checks hashes and the resolver's subject_revision, which includes target revision. Only the complete target set equal to the active contract can receive the edit exception; every other readiness requirement and stop/ship blocker remains intact.
- Telemetry storage validates the original leaf before resolving its parent. Canonicalization must not erase an in-repository symlink and authorize append/rotation/pruning of its target. Cooperative maintenance uses the existing owner-fenced lock; hostile same-user directory replacement between filesystem syscalls is outside this cache threat model.

## External finding and correction

- Official codex-plugin review of sha256:3883b53275bba362029a96cbb56c23544dad04896862efde15ab7f4e2d6ab799 returned one P1 (reject), recorded verbatim in /tmp/release-resume-cross-review.json. Parent remediation is not external_pass.
- root_cause: src/effects/hook-event-log.ts resolved the active leaf through realpath before checking its type, so an in-repository symlink became a regular target pathname.
- repro: bun test tests/unit/hook-event-log.test.ts -t 'in-repository log symlinks'.
- regression_guard: tests/unit/hook-event-log.test.ts tests small, rotation-sized and over-retention-budget targets; inode, size and mtime must stay unchanged, the symlink must remain, and neither target nor log archives may appear.
- pre_fix_failure_artifact: /tmp/release-resume-symlink-red.log. Corrected storage and diet reader have 20 passing tests in /tmp/release-resume-symlink-green.log.

## Evidence boundary

- The original integration execution vx-6afb0d60525a443791f0 is a historical baseline, never an exact pass for the fixed subject. The final typed Verification Plan names telemetry-symlink-delta and baseline_with_delta for unchanged consumers.
- The post-fix contract run has 16 passing criteria at /tmp/release-resume-final-prepare.log. Rebind materialized evidence after committing contract authority; a passing raw report alone is not canonical acceptance.
- Receipt commands consume .ai/harness/checks/latest.json, the evidence writer projection. Passing a raw run snapshot incorrectly compares unredacted commands with redacted immutable evidence; direct validation of the materialized report passes. No verifier change or fallback was needed.
- The normal tarball install smoke and typed architecture reconciliation cleared the earlier helper/runtime-proof blockers. Reconciliation records an empty noop and no unresolved evidence.
- One semantic review is allowed per work-package. After remediation and final valid evidence, an explicit owner acceptance is required; no second external review or synthetic external_pass is authorized by the parent.

> **Substantive Change SHA256**: `sha256:f0c749d602bc1d28299e4eb7f5184644b4bb392720b1bdbb36abceda684dcb46`

## Publication diff binding

Canonical finish published 5944cf7e95f87d5cba3e6257e704e4947e0fd85f onto 2cf1dd5b8bdd3c5004f9b8fb8c0c0a23f7ff6f57. CI run 34032789645 stopped at task-sync before the Test suite because the archived artifacts lacked the publication diff identity. The same direct-base check reproduced that refusal locally. This annotation binds the exact substantive diff; it changes no production bytes and does not rebind prior verification or acceptance to a new subject. The separate Windows controller assignment timeout is not resolved by this documentation change.

> **Substantive Change SHA256**: `sha256:5e55520e53dcdc1772da1211b0e0cd9ade91a18524cdd3d38df136cd05b8687e`

## Protected inventory consumer correction

CI run 34033421338 on 55be427a passed all MCP platforms but exposed the BRC0 inventory closure omission: the two new artifact-repair modules were absent from the state-directory inventory. The characterization suite reproduced the failure before the fixture change. Both modules issue or validate contract-only repair admission, so the correction lists them as protected unmapped surfaces, not exemptions. The closure and campaign planning/acquisition consumers verify this bounded correction; no production implementation or dependency changes are involved. The earlier Windows timeout did not recur in that run, which does not establish its root cause.

Validation: the three named characterization/planning/acquisition suites pass with the repository's 60-second per-test timeout (67 pass, 0 fail, 799 assertions). An initial run using Bun's default 5-second timeout exhausted six acquisition tests; the successful run exercised those same tests in 7-18 seconds. All six required repository-integrity checks and diff hygiene pass. No local full suite was repeated; required CI remains the final integration gate.
