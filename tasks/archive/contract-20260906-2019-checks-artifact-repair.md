> **Archived**: 2026-09-06 20:19
> **Related Plan**: plans/archive/plan-20260906-1732-checks-artifact-repair.md
> **Outcome**: Completed
> **Lifecycle**: contract
> **Parent Run ID**: run-20260906-2019
> **Archive Projection V1**: `plans/plan-20260906-1732-checks-artifact-repair.md` => `plans/archive/plan-20260906-1732-checks-artifact-repair.md`
> **Archive Projection V1**: `tasks/notes/20260906-1732-checks-artifact-repair.notes.md` => `tasks/archive/notes-20260906-2019-checks-artifact-repair.md`
> **Archive Projection V1**: `tasks/contracts/20260906-1732-checks-artifact-repair.contract.md` => `tasks/archive/contract-20260906-2019-checks-artifact-repair.md`
> **Archive Projection V1**: `tasks/reviews/20260906-1732-checks-artifact-repair.review.md` => `tasks/archive/review-20260906-2019-checks-artifact-repair.md`

# Task Contract: release todo integration

> **Status**: Fulfilled
> **Plan**: plans/archive/plan-20260906-1732-checks-artifact-repair.md
> **Task Profile**: code-change
> <!-- legal values: code-change | docs-only | ledger-closeout | migration | eval-only | delegated-run | bugfix (omit for legacy passthrough); see docs/reference-configs/sprint-contracts.md -->
> **Owner**: ancienttwo
> **Capability ID**: root
> **Last Updated**: 2026-09-06 17:32
> **Review File**: `tasks/archive/review-20260906-2019-checks-artifact-repair.md`
> **Notes File**: `tasks/archive/notes-20260906-2019-checks-artifact-repair.md`
> **Exemplar**: `docs/reference-configs/contract-brief-example.md`

## Why
The verifier already distinguishes missing_artifact from real verification failures, but effective state collapses both into checks_failed and gives no audited artifact-specific continuation.

## Goal
Integrate and accept the three user-approved release-preparation todos together: a single packaged downstream gitignore authority, bounded retained hook telemetry, and audited invalid-contract repair. Preserve the existing verifier's failure classification and all unrelated edit/stop/ship requirements.

## Scope
- In scope: the three implemented todos, migration to main's Verification Plan, their package/consumer checks, canonical acceptance and publication into main.
- The two earlier slice plans are archived as superseded by this one publication boundary. They remain implementation provenance, not independent acceptance claims.
- Out of scope: PR #329, BRC, the concurrent verification ID-binding worktree, version selection, npm/tag publication and global installation owned by release coordination.

## Stop Conditions

- Stop and hand back to the parent if the change would require editing a path outside Allowed Paths.
- Stop if an Exit Criteria command cannot be run in this environment.
- Stop if Goal, Scope, or Exit Criteria are internally contradictory.

## Falsifier
A stale receipt, unknown failure class, non-contract target, mixed target edit, or repair receipt permitting stop/ship falsifies the authorization boundary.

## Root Cause Evidence

Required when Task Profile is `bugfix`; leave as-is otherwise.

- root_cause: one sentence naming file:line/condition (testable, not "a state issue").
- repro: the command or UI path that reproduces the symptom.
- regression_guard: path to a test that fails on the unfixed code and passes after the fix (must also appear under exit_criteria.tests_pass).
- pre_fix_failure_artifact: path to a captured run of regression_guard on the UNFIXED code. Capture with `bun test <regression_guard> > <artifact> 2>&1; echo "PRE_FIX_EXIT=$?" >> <artifact>` (no pipes — pipes swallow the exit status). The gate requires a non-zero `PRE_FIX_EXIT=` line plus the regression_guard path string in the artifact (see the Root Cause Evidence Gate section in docs/reference-configs/sprint-contracts.md).

## Workflow Inventory

- Source plan: `plans/archive/plan-20260906-1732-checks-artifact-repair.md`
- Deferred-goal ledger: `tasks/todos.md`
- Review file: `tasks/archive/review-20260906-2019-checks-artifact-repair.md`
- Notes file: `tasks/archive/notes-20260906-2019-checks-artifact-repair.md`
- Checks file: `.ai/harness/checks/latest.json`
- Run snapshots: `.ai/harness/runs/`
- Scope gate: edit only paths listed under `allowed_paths`; update this contract before widening scope.
- Completion gate: run `verify-sprint --prepare-acceptance`, record one typed AcceptanceReceipt under the frozen policy below, then run `verify-sprint`; review Markdown is projection only.

## Change Assessment

```json
{"protocol":1,"oracles":[{"id":"release-todo-regressions","kind":"deterministic_test","paths":["*"]},{"id":"package-readback","kind":"runtime_readback","paths":["*"]}]}
```

## Acceptance Policy

```json
{"protocol":2,"reviewer":"Codex","source":"codex-plugin","user_waiver":"allowed"}
```

## Allowed Paths

```yaml
allowed_paths:
  - scripts/verify-contract.sh
  - assets/templates/helpers/verify-contract.sh
  - tests/unit/verifier-evidence-lifecycle-cutover.test.ts
  - assets/templates/runtime.gitignore
  - docs/architecture/
  - docs/architecture/global-hook-runtime.md
  - docs/researches/20260906-release-todo-hardening.md
  - plans/archive/
  - plans/archive/plan-20260906-1711-downstream-gitignore-authority.md
  - plans/archive/plan-20260906-1721-hook-telemetry-retention.md
  - plans/archive/plan-20260906-1732-checks-artifact-repair.md
  - scripts/hook-dispatch-diet-report.ts
  - scripts/lib/project-init-lib.sh
  - scripts/run-harness-profile-benchmark.ts
  - src/cli/commands/state.ts
  - src/cli/hook/event-telemetry.ts
  - src/core/adoption/gitignore-plan.ts
  - src/core/state/artifact-repair.ts
  - src/core/state/project-continuation-envelope.ts
  - src/core/state/project-effective-state.ts
  - src/core/state/types.ts
  - src/core/workflow/operation-readiness.ts
  - src/effects/hook-event-log.ts
  - src/effects/state/artifact-repair-store.ts
  - src/effects/state/resolve-effective-state.ts
  - tasks/archive/
  - tasks/archive/contract-20260906-1711-downstream-gitignore-authority.md
  - tasks/archive/contract-20260906-1721-hook-telemetry-retention.md
  - tasks/archive/notes-20260906-1711-downstream-gitignore-authority.md
  - tasks/archive/notes-20260906-1721-hook-telemetry-retention.md
  - tasks/archive/review-20260906-1711-downstream-gitignore-authority.md
  - tasks/archive/review-20260906-1721-hook-telemetry-retention.md
  - tasks/archive/contract-20260906-2019-checks-artifact-repair.md
  - tasks/archive/notes-20260906-2019-checks-artifact-repair.md
  - tasks/archive/review-20260906-2019-checks-artifact-repair.md
  - tasks/todos.md
  - tests/artifact-repair.test.ts
  - tests/state/project-effective-state.test.ts
  - tests/unit/gitignore-plan.test.ts
  - tests/unit/hook-event-log.test.ts
```

## Evidence Requirements

```yaml
evidence_requirements:
  # Set benchmark to required when this contract consumes the harness profile benchmark matrix.
  benchmark: not_applicable
```

## Delegation Contract

```yaml
delegation:
  budget:
    tokens: null
    runner_invocations: null
    wall_time_minutes: null
  permission_scope:
    mode: inherit_allowed_paths
    writable_paths: []
    network: inherited
  roles:
    parent:
      mode: narrate_and_gatekeep
      purpose: approval_checkpoint_owner
    explorer:
      mode: read_only
      purpose: codebase_research
    worker:
      mode: edit_within_allowed_paths
      purpose: implementation
    verifier:
      mode: read_only
      purpose: exit_criteria_review
  runner:
    preferred:
      - subagent
    fallback: null
    brief_is_authoritative: true
```

## Exit Criteria (Machine Verifiable)

Choose the smallest checks that cover the changed behavior. Add a full suite
only for an explicit release requirement or an observed cross-module coverage
gap; state that reason and expected cost in Acceptance Notes. Do not duplicate
coverage between `tests_pass` and `commands_succeed`. Before the first run,
list eligible deterministic criteria in `criterion_reuse`; eligibility requires
all inputs to be bound by the frozen subject/toolchain context. Leave external
or mutable-state criteria ineligible. The canonical acceptance runner owns the
expensive execution; workers and reviewers consume its evidence.

If a full suite already passed before a bounded follow-up edit, preserve its
run identity as baseline evidence and choose focused checks for the actual delta.
The parent revises these criteria and records the baseline plus coverage rationale
in Acceptance Notes, unless an explicit user/release requirement still requires
a full run on the new subject. A cache miss alone does not justify another full
suite; never label the old subject's pass as a full pass for the new subject.

```yaml
exit_criteria:
  files_exist:
    - docs/spec.md
  artifacts_exist:
    - .ai/harness/checks/latest.json
    - tasks/archive/notes-20260906-2019-checks-artifact-repair.md
```

## Verification Plan

```json
{
  "protocol": 1,
  "checks": [
    {
      "cwd": ".",
      "phase": "preflight",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "inputs": {
        "env": []
      },
      "id": "typecheck",
      "kind": "command",
      "command": "bun run check:type",
      "necessity": "Covers type transformations across the merged verifier and all three changed consumers."
    },
    {
      "cwd": ".",
      "phase": "preflight",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "inputs": {
        "env": []
      },
      "id": "state-boundaries",
      "kind": "command",
      "command": "bun run check:state-boundaries",
      "necessity": "Covers core/effect/CLI layering after receipt integration."
    },
    {
      "id": "telemetry-symlink-delta",
      "kind": "command",
      "command": "bun test tests/unit/hook-event-log.test.ts tests/hook-dispatch-diet-report.test.ts tests/unit/hrd-08-event-telemetry-and-benchmark.test.ts tests/hook-runtime.test.ts tests/hook-runtime-characterization.test.ts",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Covers the external P1 in-repository symlink fix through original-leaf storage validation, retained readers, real telemetry writer and concurrent runtime paths.",
      "inputs": {
        "env": []
      }
    },
    {
      "cwd": ".",
      "phase": "verification",
      "cost": "expensive",
      "evidence_policy": "baseline_with_delta",
      "inputs": {
        "env": []
      },
      "id": "release-todo-regressions",
      "kind": "command",
      "command": "bun test tests/unit/gitignore-plan.test.ts tests/artifact-repair.test.ts tests/state/project-effective-state.test.ts tests/state/operation-readiness.test.ts tests/continuation-envelope.test.ts tests/mutation-guard.test.ts tests/effective-state.test.ts tests/unit/hook-event-log.test.ts tests/unit/hrd-08-event-telemetry-and-benchmark.test.ts tests/hook-dispatch-diet-report.test.ts tests/harness-benchmark-matrix.test.ts tests/hook-runtime.test.ts tests/hook-runtime-characterization.test.ts tests/unit/verifier-evidence-lifecycle-cutover.test.ts",
      "necessity": "The frozen pre-fix integration group passed. The only subsequent runtime change preserves the original telemetry leaf before canonicalizing its parent; the named delta covers storage, both readers, runtime and concurrent writers. No other source change justifies repeating the complete group.",
      "baseline": {
        "run_file": ".ai/harness/runs/verification-vx-6afb0d60525a443791f0.json",
        "execution_id": "vx-6afb0d60525a443791f0"
      },
      "delta_checks": [
        "telemetry-symlink-delta"
      ]
    },
    {
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "inputs": {
        "env": []
      },
      "id": "deploy-sql",
      "kind": "command",
      "command": "bash scripts/check-deploy-sql-order.sh",
      "necessity": "Preserves deployment ledger ordering."
    },
    {
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "inputs": {
        "env": []
      },
      "id": "architecture-sync",
      "kind": "command",
      "command": "bash scripts/check-architecture-sync.sh",
      "necessity": "Confirms architecture projections match current source."
    },
    {
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "inputs": {
        "env": []
      },
      "id": "task-sync",
      "kind": "command",
      "command": "bash scripts/check-task-sync.sh",
      "necessity": "Binds substantive changes to this integration evidence."
    },
    {
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "inputs": {
        "env": []
      },
      "id": "task-workflow",
      "kind": "command",
      "command": "bash scripts/check-task-workflow.sh --strict",
      "necessity": "Validates active and archived workflow artifacts."
    },
    {
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "inputs": {
        "env": []
      },
      "id": "project-state",
      "kind": "command",
      "command": "bun scripts/inspect-project-state.ts --repo . --format text",
      "necessity": "Confirms repository migration and workflow state."
    },
    {
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "inputs": {
        "env": []
      },
      "id": "init-dry-run",
      "kind": "command",
      "command": "bun src/cli/index.ts init --repo . --dry-run",
      "necessity": "Checks TS adoption planning after the merged shell changes."
    },
    {
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "inputs": {
        "env": []
      },
      "id": "hook-bundle",
      "kind": "command",
      "command": "bun run build:hook-bundle",
      "necessity": "Builds the installed hook runtime from the merged source."
    }
  ]
}
```

## Acceptance Notes (Human Review)

- Named tests cover exact-context issuance, stale/tampered receipts, actual mutation guard decisions, ordinary failing-test controls, and unchanged state/continuation consumers.
- No full suite: no event protocol, verifier producer, release behavior, or unrelated runtime source changes. Typecheck, state boundaries, hook bundle and six integrity checks cover the affected packaging and repository surfaces.
- subject_revision is the existing resolver hash of review_subject and target_rev; storing it binds both without creating a second fingerprint authority.
- Native focused review is evidence, not an external AcceptanceReceipt. Canonical acceptance and integration remain separate release-owner actions.

## Rollback Point
- Revert receipt issuance, projection and CLI together; retained ignored receipts cannot authorize anything when the feature is absent.

The user approved integration after reviewing both implementation commits. This contract is the single final publication/acceptance boundary for the three todos. Named final checks cost approximately 2-4 minutes; full-suite execution is not required because all affected consumers are named. Package extraction and clean-HOME smoke remain explicit operator evidence, not a nested install command in Verification Plan.

Final delta coverage preserves the original exact integration execution as a baseline, never as an exact pass for the fixed subject. The official review returned P1; remediation is verified by the named delta, and final disposition requires explicit owner acceptance because the work-package permits one semantic review.
