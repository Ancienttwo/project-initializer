> **Archived**: 2026-09-08 19:21
> **Related Plan**: plans/archive/plan-20260908-1905-brc354-cleanup-integration.md
> **Outcome**: Completed
> **Lifecycle**: contract
> **Parent Run ID**: run-20260908-1921
> **Archive Projection V1**: `plans/plan-20260908-1905-brc354-cleanup-integration.md` => `plans/archive/plan-20260908-1905-brc354-cleanup-integration.md`
> **Archive Projection V1**: `tasks/notes/20260908-1905-brc354-cleanup-integration.notes.md` => `tasks/archive/notes-20260908-1921-brc354-cleanup-integration.md`
> **Archive Projection V1**: `tasks/contracts/20260908-1905-brc354-cleanup-integration.contract.md` => `tasks/archive/contract-20260908-1921-brc354-cleanup-integration.md`
> **Archive Projection V1**: `tasks/reviews/20260908-1905-brc354-cleanup-integration.review.md` => `tasks/archive/review-20260908-1921-brc354-cleanup-integration.md`

# Task Contract: brc354-cleanup-integration

> **Status**: Fulfilled
> **Plan**: plans/archive/plan-20260908-1905-brc354-cleanup-integration.md
> **Task Profile**: code-change
> <!-- legal values: code-change | docs-only | ledger-closeout | migration | eval-only | delegated-run | bugfix (omit for legacy passthrough); see docs/reference-configs/sprint-contracts.md -->
> **Owner**: ancienttwo
> **Capability ID**: root
> **Last Updated**: 2026-09-08 19:05
> **Review File**: `tasks/archive/review-20260908-1921-brc354-cleanup-integration.md`
> **Notes File**: `tasks/archive/notes-20260908-1921-brc354-cleanup-integration.md`
> **Exemplar**: `docs/reference-configs/contract-brief-example.md`

## Why

Issue #354 requires cleanup that preserves independent supervision and preparation recovery evidence.

## Goal

Remove only expired inactive exact containers while retaining protected recovery readback on the complete PR #361 preparation implementation.

## Scope

- In scope: exact-container cleanup, operator script, recovery/cleanup composition tests and durable documentation.
- Out of scope: preparation redesign, model calls, active enablement, package release and unrelated cleanup.
- Taste constraints: <!-- advisory only, no run gate; default style/taste lives in AGENTS.md and the minimal-change policy, use this to record a per-task override -->

## Stop Conditions

- Stop and hand back to the parent if the change would require editing a path outside Allowed Paths.
- Stop if an Exit Criteria command cannot be run in this environment.
- Stop if Goal, Scope, or Exit Criteria are internally contradictory.

## Falsifier

Cleanup destroys a recovery proof, admits unknown/live/configuration-drifted state, or changes terminal consumer output; real Docker regressions falsify these cases.

## Root Cause Evidence

Not applicable: this slice adds the explicit cleanup contract atop accepted preparation recovery.

## Workflow Inventory

- Source plan: `plans/archive/plan-20260908-1905-brc354-cleanup-integration.md`
- Deferred-goal ledger: `tasks/todos.md`
- Review file: `tasks/archive/review-20260908-1921-brc354-cleanup-integration.md`
- Notes file: `tasks/archive/notes-20260908-1921-brc354-cleanup-integration.md`
- Checks file: `.ai/harness/checks/latest.json`
- Run snapshots: `.ai/harness/runs/`
- Scope gate: edit only paths listed under `allowed_paths`; update this contract before widening scope.
- Completion gate: run `verify-sprint --prepare-acceptance`, record one typed AcceptanceReceipt under the frozen policy below, then run `verify-sprint`; review Markdown is projection only.

## Change Assessment

```json
{"protocol": 1, "oracles": [{"id": "runtime-docker", "kind": "runtime_readback", "paths": ["*"]}]}
```

## Acceptance Policy

```json
{"protocol":2,"reviewer":"Codex","source":"codex-plugin","user_waiver":"allowed"}
```

## Allowed Paths

```yaml
allowed_paths:
  - docs/researches/2026-09-08-brc354-independent-supervision.md
  - docs/architecture/
  - scripts/cleanup-campaign-container.ts
  - plans/
  - tasks/todos.md
  - tasks/archive/contract-20260908-1921-brc354-cleanup-integration.md
  - tasks/archive/review-20260908-1921-brc354-cleanup-integration.md
  - tasks/archive/notes-20260908-1921-brc354-cleanup-integration.md
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
    - scripts/cleanup-campaign-container.ts
  artifacts_exist:
    - .ai/harness/checks/latest.json
    - tasks/archive/notes-20260908-1921-brc354-cleanup-integration.md
```

## Verification Plan

```json
{
  "protocol": 1,
  "checks": [
    {
      "id": "runtime-docker",
      "kind": "command",
      "command": "BRC_TEST_CONTAINER_IMAGE=sha256:72270cb098680b4e5e9e34f3ed7da6d861551bf946813a485069554055e08523 bun test tests/effects/campaign-runtime-container.test.ts tests/effects/campaign-container-live.test.ts",
      "cwd": ".",
      "phase": "verification",
      "cost": "expensive",
      "evidence_policy": "current_exact",
      "necessity": "Real Docker exact identity, protected receipts, cleanup, controller loss and actual terminal consumer; no provider inference.",
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
      "necessity": "TypeScript contract consistency.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "helper-parity",
      "kind": "command",
      "command": "bun run check:helpers",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Source and packaged consumers remain identical.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "deploy-sql",
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
      "id": "architecture",
      "kind": "command",
      "command": "bash scripts/check-architecture-sync.sh",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Required architecture alignment.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "task-sync",
      "kind": "command",
      "command": "bash scripts/check-task-sync.sh",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Required diff-bound workflow evidence.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "task-workflow",
      "kind": "command",
      "command": "bash scripts/check-task-workflow.sh --strict",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Required strict workflow integrity.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "inspect",
      "kind": "command",
      "command": "bun scripts/inspect-project-state.ts --repo . --format text",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Required installed state consistency.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "init-dry-run",
      "kind": "command",
      "command": "bun src/cli/index.ts init --repo . --dry-run",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Required adoption dry-run.",
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

Baseline: #361 at 491ff094 owns preparation/lifecycle acceptance. This delta reruns changed Docker files including SIGKILL recovery-to-cleanup composition, typecheck, helper parity and required integrity. Earlier #362 evidence remains historical only.
