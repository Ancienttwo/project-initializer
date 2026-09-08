# Task Contract: brc354-preparation-recovery

> **Status**: Active
> **Plan**: plans/plan-20260908-1826-brc354-preparation-recovery.md
> **Task Profile**: bugfix
> <!-- legal values: code-change | docs-only | ledger-closeout | migration | eval-only | delegated-run | bugfix (omit for legacy passthrough); see docs/reference-configs/sprint-contracts.md -->
> **Owner**: ancienttwo
> **Capability ID**: root
> **Last Updated**: 2026-09-08 18:26
> **Review File**: `tasks/reviews/20260908-1826-brc354-preparation-recovery.review.md`
> **Notes File**: `tasks/notes/20260908-1826-brc354-preparation-recovery.notes.md`
> **Exemplar**: `docs/reference-configs/contract-brief-example.md`

## Why

A lost preparation can leave an independent probe without a durable invocation, while no-start recovery incorrectly declares inactivity.

## Goal

Find the original pre-create journal from exact Claim identity, reconcile after its deadline without recreating work, and refuse reclaim absent protected preparation inactivity.

## Scope

- In scope: container/runtime/worker/recovery preparation, actual consumers, regression tests and evidence.
- Out of scope: active enablement, model calls, grants, retention cleanup, merge and package release.
- Taste constraints: <!-- advisory only, no run gate; default style/taste lives in AGENTS.md and the minimal-change policy, use this to record a per-task override -->

## Stop Conditions

- Stop and hand back to the parent if the change would require editing a path outside Allowed Paths.
- Stop if an Exit Criteria command cannot be run in this environment.
- Stop if Goal, Scope, or Exit Criteria are internally contradictory.

## Falsifier

A pending preparation classified reclaimable, a repeated create/start during recovery, or a changed Claim consuming another journal falsifies this change.

## Root Cause Evidence

Required when Task Profile is `bugfix`; leave as-is otherwise.

- root_cause: campaign-recovery.ts observe treats !started as inactive after retire without checking pending preparation.
- repro: bun test tests/effects/brc10-lifecycle.test.ts -t 'preparation without protected'
- regression_guard: tests/effects/brc10-lifecycle.test.ts
- pre_fix_failure_artifact: tasks/evidence/20260908-brc354-preparation-before.log

## Workflow Inventory

- Source plan: `plans/plan-20260908-1826-brc354-preparation-recovery.md`
- Deferred-goal ledger: `tasks/todos.md`
- Review file: `tasks/reviews/20260908-1826-brc354-preparation-recovery.review.md`
- Notes file: `tasks/notes/20260908-1826-brc354-preparation-recovery.notes.md`
- Checks file: `.ai/harness/checks/latest.json`
- Run snapshots: `.ai/harness/runs/`
- Scope gate: edit only paths listed under `allowed_paths`; update this contract before widening scope.
- Completion gate: run `verify-sprint --prepare-acceptance`, record one typed AcceptanceReceipt under the frozen policy below, then run `verify-sprint`; review Markdown is projection only.

## Change Assessment

```json
{"protocol":1,"oracles":[{"id":"preparation-recovery","kind":"runtime_readback","paths":["*"]}]}
```

## Acceptance Policy

```json
{"protocol":2,"reviewer":"Codex","source":"codex-plugin","user_waiver":"allowed"}
```

## Allowed Paths

```yaml
allowed_paths:
  - docs/spec.md
  - docs/researches/2026-09-08-brc354-independent-supervision.md
  - docs/architecture/
  - tasks/evidence/20260908-brc354-preparation-before.log
  - plans/
  - tasks/todos.md
  - tasks/contracts/20260908-1826-brc354-preparation-recovery.contract.md
  - tasks/reviews/20260908-1826-brc354-preparation-recovery.review.md
  - tasks/notes/20260908-1826-brc354-preparation-recovery.notes.md
  - .ai/context/capabilities.json
  - .claude/templates/
  - src/
  - tests/
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

This block contains only non-executable artifact requirements. Define every
executable check once in the canonical Verification Plan below. Each check must
state its phase, cost, evidence policy, necessity, and input environment; a
missing or malformed plan fails closed.

```yaml
exit_criteria:
  files_exist:
    - src/effects/automation/campaign-container.ts
    - tasks/evidence/20260908-brc354-preparation-before.log
  artifacts_exist:
    - .ai/harness/checks/latest.json
    - tasks/notes/20260908-1826-brc354-preparation-recovery.notes.md
```

## Verification Plan

```json
{
  "protocol": 1,
  "checks": [
    {
      "id": "image-required",
      "kind": "command",
      "command": "test \"$BRC_TEST_CONTAINER_IMAGE\" = sha256:72270cb098680b4e5e9e34f3ed7da6d861551bf946813a485069554055e08523",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Final Docker criteria must not silently skip.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "lifecycle",
      "kind": "package_test",
      "path": "tests/effects/brc10-lifecycle.test.ts",
      "cwd": ".",
      "phase": "verification",
      "cost": "expensive",
      "evidence_policy": "current_exact",
      "necessity": "Actual reclaim, preparation recovery and settlement regression, including the pre-fix guard.",
      "inputs": {
        "env": [
          "BRC_TEST_CONTAINER_IMAGE"
        ]
      }
    },
    {
      "id": "docker",
      "kind": "command",
      "command": "bun test tests/effects/campaign-container-live.test.ts tests/effects/campaign-runtime-container.test.ts",
      "cwd": ".",
      "phase": "verification",
      "cost": "expensive",
      "evidence_policy": "current_exact",
      "necessity": "Producer address and lost-create recovery changed; real Docker phase death, tamper, and actual runtime checks are required.",
      "inputs": {
        "env": [
          "BRC_TEST_CONTAINER_IMAGE"
        ]
      }
    },
    {
      "id": "closeout",
      "kind": "command",
      "command": "bun test tests/effects/campaign-closeout.test.ts tests/unit/brc10-lifecycle.test.ts tests/campaign-finish-failure-audit.test.ts tests/bounded-supervisor-audit.test.ts tests/effects/campaign-containment.test.ts",
      "cwd": ".",
      "phase": "verification",
      "cost": "expensive",
      "evidence_policy": "current_exact",
      "necessity": "Changed recovery/settlement consumer requires historical finals, failure settlement, closeout and containment checks.",
      "inputs": {
        "env": [
          "BRC_TEST_CONTAINER_IMAGE"
        ]
      }
    },
    {
      "id": "typecheck",
      "kind": "command",
      "command": "bun run check:type",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Shared runtime and recovery types.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "helpers",
      "kind": "command",
      "command": "cmp scripts/contract-run.ts assets/templates/helpers/contract-run.ts",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Both managed helper surfaces remain identical.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "integrity-0",
      "kind": "command",
      "command": "bash scripts/check-deploy-sql-order.sh",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Required repository integrity.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "integrity-1",
      "kind": "command",
      "command": "bash scripts/check-architecture-sync.sh",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Required repository integrity.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "integrity-2",
      "kind": "command",
      "command": "bash scripts/check-task-sync.sh",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Required repository integrity.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "integrity-3",
      "kind": "command",
      "command": "bash scripts/check-task-workflow.sh --strict",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Required repository integrity.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "integrity-4",
      "kind": "command",
      "command": "bun scripts/inspect-project-state.ts --repo . --format text",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Required repository integrity.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "integrity-5",
      "kind": "command",
      "command": "bun src/cli/index.ts init --repo . --dry-run",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Required repository integrity.",
      "inputs": {
        "env": []
      }
    }
  ]
}
```

This is the sole executable verification authority. Use `baseline_with_delta`
only when a referenced immutable baseline plus named current delta checks prove
the intended coverage; do not infer that choice from paths or command text.

## Acceptance Notes (Human Review)

- Functional behavior:
- Edge cases:
- Regression risks:

## Rollback Point

- Commit / checkpoint:
- Revert strategy:
