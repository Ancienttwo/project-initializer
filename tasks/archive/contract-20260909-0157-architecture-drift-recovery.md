> **Archived**: 2026-09-09 01:57
> **Related Plan**: plans/archive/plan-20260909-0130-architecture-drift-recovery.md
> **Outcome**: Completed
> **Lifecycle**: contract
> **Parent Run ID**: run-20260909-0157
> **Archive Projection V1**: `plans/plan-20260909-0130-architecture-drift-recovery.md` => `plans/archive/plan-20260909-0130-architecture-drift-recovery.md`
> **Archive Projection V1**: `tasks/notes/20260909-0130-architecture-drift-recovery.notes.md` => `tasks/archive/notes-20260909-0157-architecture-drift-recovery.md`
> **Archive Projection V1**: `tasks/contracts/20260909-0130-architecture-drift-recovery.contract.md` => `tasks/archive/contract-20260909-0157-architecture-drift-recovery.md`
> **Archive Projection V1**: `tasks/reviews/20260909-0130-architecture-drift-recovery.review.md` => `tasks/archive/review-20260909-0157-architecture-drift-recovery.md`

# Task Contract: architecture-drift-recovery

> **Status**: Fulfilled
> **Plan**: plans/archive/plan-20260909-0130-architecture-drift-recovery.md
> **Task Profile**: bugfix
> <!-- legal values: code-change | docs-only | ledger-closeout | migration | eval-only | delegated-run | bugfix (omit for legacy passthrough); see docs/reference-configs/sprint-contracts.md -->
> **Owner**: ancienttwo
> **Capability ID**: root
> **Last Updated**: 2026-09-09 01:30
> **Review File**: `tasks/archive/review-20260909-0157-architecture-drift-recovery.md`
> **Notes File**: `tasks/archive/notes-20260909-0157-architecture-drift-recovery.md`
> **Exemplar**: `docs/reference-configs/contract-brief-example.md`

## Why

Uncoordinated cursor writers can replay confirmed work; filesystem-dependent historical validation and abandoned empty locks prevent recovery. Cursor replacement also discards unproven pending delivery.

## Goal

Preserve bounded at-least-once legacy progress across concurrency and process crashes; upgrade package-local archctx and contracts to 0.5.8 with aligned exact-version contracts.

## Scope

User approved latest-main integration and bounded real downstream validation after source acceptance. The previous installation hold is superseded; the downstream path is pending user selection.

- In scope: all four cursor writer call sites, historical batch validation, existing lock recovery options, version pins and focused tests.
- Out of scope: npm publication, unbounded downstream backlog mutation, new queue/storage design, fsync durability, generic lock changes, unrelated release work.

## Stop Conditions

- Stop and hand back to the parent if the change would require editing a path outside Allowed Paths.
- Stop if an Exit Criteria command cannot be run in this environment.
- Stop if Goal, Scope, or Exit Criteria are internally contradictory.

## Falsifier

A second process can acknowledge publication while the cascade is paused before cursor rename; a completed symlink prefix blocks the suffix; a stale empty lock prevents delivery; or an external acknowledgement deletes unconsumed suffix.

## Root Cause Evidence

- root_cause: src/cli/hook/architecture-drift.ts previously exposed an unlocked cursor writer, validated completed paths using current realpath, replaced old suffix on cursor change, and omitted reclaimStaleEmptyDirectory.
- repro: bun test tests/architecture-drift-recovery.test.ts --timeout 60000
- regression_guard: tests/architecture-drift-recovery.test.ts
- pre_fix_failure_artifact: .ai/harness/runs/architecture-drift-recovery/pre-fix.log

## Workflow Inventory

- Source plan: `plans/archive/plan-20260909-0130-architecture-drift-recovery.md`
- Deferred-goal ledger: `tasks/todos.md`
- Review file: `tasks/archive/review-20260909-0157-architecture-drift-recovery.md`
- Notes file: `tasks/archive/notes-20260909-0157-architecture-drift-recovery.md`
- Checks file: `.ai/harness/checks/latest.json`
- Run snapshots: `.ai/harness/runs/`
- Scope gate: edit only paths listed under `allowed_paths`; update this contract before widening scope.
- Completion gate: run `verify-sprint --prepare-acceptance`, record one typed AcceptanceReceipt under the frozen policy below, then run `verify-sprint`; review Markdown is projection only.

## Change Assessment

```json
{"protocol":1,"oracles":[]}
```

## Acceptance Policy

```json
{"protocol":2,"reviewer":"Codex","source":"codex-plugin","user_waiver":"allowed"}
```

## Allowed Paths

```yaml
allowed_paths:
  - .ai/harness/policy.json
  - assets/templates/helpers/ensure-task-workflow.sh
  - bun.lock
  - docs/architecture/.projection-manifest.json
  - docs/architecture/modules/runtime-harness/hook-adapters.md
  - package.json
  - plans/archive/plan-20260909-0130-architecture-drift-recovery.md
  - scripts/axr5-archctx-clean-room.ts
  - scripts/axr6-stop-host-cycle.ts
  - scripts/axr7-consumer-e2e.ts
  - scripts/ensure-task-workflow.sh
  - scripts/lib/project-init-lib.sh
  - src/cli/commands/architecture-projection.ts
  - src/cli/hook/architecture-drift.ts
  - src/cli/hook/stop-handler.ts
  - src/core/architecture/projection.ts
  - src/core/refactor/policy.ts
  - tasks/archive/contract-20260909-0157-architecture-drift-recovery.md
  - tasks/archive/notes-20260909-0157-architecture-drift-recovery.md
  - tasks/archive/review-20260909-0157-architecture-drift-recovery.md
  - tasks/todos.md
  - tests/architecture-drift-recovery.test.ts
  - tests/architecture-drift.test.ts
  - tests/architecture-projection-orchestration.test.ts
  - tests/architecture-projection-provider.test.ts
  - tests/cli/global-runtime-init.test.ts
  - tests/refactor-archctx-provider.test.ts
  - tests/state/operation-readiness.test.ts
  - tests/stop-handler-restamp-publication.test.ts
  - tests/stop-handler.test.ts
  - tests/unit/refactor-discovery-proposal-authoring.test.ts
  - tests/unit/refactor-policy.test.ts
  - tests/unit/refactor-provider-contract.test.ts
  - tests/unit/refactor-shadow-entry.test.ts
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

```yaml
exit_criteria:
  files_exist:
    - tests/architecture-drift-recovery.test.ts
    - docs/architecture/modules/runtime-harness/hook-adapters.md
  artifacts_exist:
    - .ai/harness/runs/architecture-drift-recovery/pre-fix.log
```

## Verification Plan

```json
{
  "protocol": 1,
  "checks": [
    {
      "id": "focused-1",
      "kind": "package_test",
      "path": "tests/architecture-drift-recovery.test.ts",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Covers changed cursor callers, recovery, version-pin consumer or scaffold projection.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "focused-2",
      "kind": "package_test",
      "path": "tests/architecture-drift.test.ts",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Covers changed cursor callers, recovery, version-pin consumer or scaffold projection.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "focused-5",
      "kind": "package_test",
      "path": "tests/architecture-projection-provider.test.ts",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Covers changed cursor callers, recovery, version-pin consumer or scaffold projection.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "integrity-1",
      "kind": "command",
      "command": "bun run check:type",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Required integrity check or contract/generator validation for this bounded change.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "integrity-2",
      "kind": "command",
      "command": "bun scripts/sync-helper-sources.ts --check",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Required integrity check or contract/generator validation for this bounded change.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "integrity-3",
      "kind": "command",
      "command": "bash scripts/check-deploy-sql-order.sh",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Required integrity check or contract/generator validation for this bounded change.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "integrity-4",
      "kind": "command",
      "command": "bash scripts/check-architecture-sync.sh",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Required integrity check or contract/generator validation for this bounded change.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "integrity-5",
      "kind": "command",
      "command": "bash scripts/check-task-sync.sh",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Required integrity check or contract/generator validation for this bounded change.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "integrity-6",
      "kind": "command",
      "command": "bash scripts/check-task-workflow.sh --strict",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Required integrity check or contract/generator validation for this bounded change.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "integrity-7",
      "kind": "command",
      "command": "bun scripts/inspect-project-state.ts --repo . --format text",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Required integrity check or contract/generator validation for this bounded change.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "integrity-8",
      "kind": "command",
      "command": "bun src/cli/index.ts init --repo . --dry-run",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Required integrity check or contract/generator validation for this bounded change.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "integrated-stop-window",
      "kind": "command",
      "command": "bun test tests/stop-handler.test.ts --test-name-pattern 'resumes completed cascade paths' --timeout 60000",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Verify Stop entrypoint wiring on the merged candidate; unchanged remaining Stop behavior has prior source evidence.",
      "inputs": {
        "env": []
      }
    }
  ]
}
```

## Acceptance Notes (Human Review)

- Integration base is origin/main 4893cf82021a7b8eabfde2ed9995b7cc6532bd9c, merged at 3c3d6c41. Source merge had no conflicts; only generated manifest and deferred-ledger timestamp conflicted, both resolved to current upstream before canonical regeneration.
- Baseline: run-20260909T014558-43392-20260909-0130-architecture-drift-recovery.json passed 35 checks for the prior source subject. That is not a merged-tree pass. Changed runtime files and version pins are byte-identical to 65009b35; added upstream changes are campaign-owned. Current delta criteria cover drift, provider selection and one multi-window Stop integration, plus typecheck and all required integrity checks. Do not rerun unchanged refactor/scaffold suites or the full suite.

- Pre-fix run: 8 failures and 6 safety controls passed. New deterministic barrier covers the final cursor rename, not just the earlier check.
- Focused tests cover every cursor writer; no full-suite requirement or uncovered full-suite integration risk.
- Historical 0.5.7 packed proof remains evidence for its original source; current installed capabilities independently report 0.5.8.
- Generic locking protocol unchanged; one existing lock is shared by four cursor consumers. New test file separates deterministic recovery fault injection from existing changed-set tests. No new package or storage abstraction.

## Rollback Point

- Base: 1f1dad978a5583928956e844f66cb14c965b4766.
- Revert only this work-package diff; retain downstream cursor and batch state untouched.
