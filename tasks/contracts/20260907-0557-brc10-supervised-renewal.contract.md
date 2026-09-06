# Task Contract: brc10-supervised-renewal

> **Status**: Active
> **Plan**: plans/plan-20260907-0557-brc10-supervised-renewal.md
> **Task Profile**: code-change
> <!-- legal values: code-change | docs-only | ledger-closeout | migration | eval-only | delegated-run | bugfix (omit for legacy passthrough); see docs/reference-configs/sprint-contracts.md -->
> **Owner**: ancienttwo
> **Capability ID**: root
> **Last Updated**: 2026-09-07 05:57
> **Review File**: `tasks/reviews/20260907-0557-brc10-supervised-renewal.review.md`
> **Notes File**: `tasks/notes/20260907-0557-brc10-supervised-renewal.notes.md`
> **Exemplar**: `docs/reference-configs/contract-brief-example.md`

## Why

Campaign children block the controller event loop and currently have no generation-fenced renewal or consumable process-group evidence.

## Goal

Renew the current campaign Lease while its supervised child executes; cancel on lost authority and persist truthful scoped quiescence without asserting provider inactivity.

## Scope

- In scope: explicit policy admission, asynchronous bounded child, fenced renewal, supervisor evidence and regressions.
- Out of scope: automatic reclaim, provider mediation, BRC10 row completion and BRC13–15.
- Taste constraints: <!-- advisory only, no run gate; default style/taste lives in AGENTS.md and the minimal-change policy, use this to record a per-task override -->

## Stop Conditions

- Stop and hand back to the parent if the change would require editing a path outside Allowed Paths.
- Stop if an Exit Criteria command cannot be run in this environment.
- Stop if Goal, Scope, or Exit Criteria are internally contradictory.

## Falsifier

A long-running acquired child has no renewal progression, stale ownership renews, a failed renewal launches the verifier, or process-group evidence falsely claims remote-provider completion.

## Root Cause Evidence

This code-change package includes one directly blocking policy transport correction. Its four-field pre-fix evidence and regression guard are recorded in the owning notes; the focused package test is part of the canonical Verification Plan.

## Workflow Inventory

- Source plan: `plans/plan-20260907-0557-brc10-supervised-renewal.md`
- Deferred-goal ledger: `tasks/todos.md`
- Review file: `tasks/reviews/20260907-0557-brc10-supervised-renewal.review.md`
- Notes file: `tasks/notes/20260907-0557-brc10-supervised-renewal.notes.md`
- Checks file: `.ai/harness/checks/latest.json`
- Run snapshots: `.ai/harness/runs/`
- Scope gate: edit only paths listed under `allowed_paths`; update this contract before widening scope.
- Completion gate: run `verify-sprint --prepare-acceptance`, record one typed AcceptanceReceipt under the frozen policy below, then run `verify-sprint`; review Markdown is projection only.

## Change Assessment

```json
{"protocol": 1, "oracles": [{"id": "campaign-supervised-renewal", "kind": "deterministic_test", "paths": ["src/core/automation/budget.ts", "src/effects/automation/campaign-acquisition.ts", "src/effects/automation/campaign-worker.ts", "scripts/contract-run.ts", "scripts/run-bounded-verifier-command.ts", "assets/templates/helpers/contract-run.ts", "assets/templates/helpers/run-bounded-verifier-command.ts", "src/core/state/lease-liveness.ts"]}]}
```

## Acceptance Policy

```json
{"protocol":2,"reviewer":"Codex","source":"codex-plugin","user_waiver":"allowed"}
```

## Allowed Paths

```yaml
allowed_paths:
  - tests/contract-run.test.ts
  - src/core/state/lease-liveness.ts
  - src/core/automation/budget.ts
  - src/effects/automation/campaign-acquisition.ts
  - src/effects/automation/campaign-worker.ts
  - scripts/contract-run.ts
  - scripts/run-bounded-verifier-command.ts
  - assets/templates/helpers/contract-run.ts
  - assets/templates/helpers/run-bounded-verifier-command.ts
  - tests/helpers/campaign-acquisition-fixture.ts
  - tests/helpers/campaign-adoption-repository.ts
  - tests/effects/campaign-acquisition.test.ts
  - tests/effects/campaign-worker.test.ts
  - tests/unit/brc10-supervised-renewal.test.ts
  - docs/researches/20260907-brc10-supervised-renewal.md
  - docs/architecture/.projection-manifest.json
  - plans/plan-20260907-0554-brc10-lifecycle.md
  - plans/plan-20260907-0557-brc10-supervised-renewal.md
  - tasks/todos.md
  - tasks/contracts/20260907-0557-brc10-supervised-renewal.contract.md
  - tasks/reviews/20260907-0557-brc10-supervised-renewal.review.md
  - tasks/notes/20260907-0557-brc10-supervised-renewal.notes.md
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
    - docs/spec.md
  artifacts_exist:
    - .ai/harness/checks/latest.json
    - tasks/notes/20260907-0557-brc10-supervised-renewal.notes.md
```

## Verification Plan

```json
{
  "protocol": 1,
  "checks": [
    {
      "id": "focused-regression",
      "kind": "package_test",
      "path": "tests/unit/brc10-supervised-renewal.test.ts",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Covers the changed behavior named by this contract.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "typecheck",
      "kind": "command",
      "command": "bun run check:type",
      "cwd": ".",
      "phase": "preflight",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Checks TypeScript contracts before behavioral verification.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "campaign-runner",
      "kind": "command",
      "command": "bun test --timeout 60000 tests/effects/campaign-worker.test.ts tests/effects/campaign-acquisition.test.ts tests/contract-run.test.ts tests/unit/lease-liveness.test.ts tests/unit/lease-liveness-store.test.ts",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Covers affected campaign/runner behavior or required repository integrity.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "sql",
      "kind": "command",
      "command": "bash scripts/check-deploy-sql-order.sh",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Covers affected campaign/runner behavior or required repository integrity.",
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
      "necessity": "Covers affected campaign/runner behavior or required repository integrity.",
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
      "necessity": "Covers affected campaign/runner behavior or required repository integrity.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "workflow",
      "kind": "command",
      "command": "bash scripts/check-task-workflow.sh --strict",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Covers affected campaign/runner behavior or required repository integrity.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "state",
      "kind": "command",
      "command": "bun scripts/inspect-project-state.ts --repo . --format text",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Covers affected campaign/runner behavior or required repository integrity.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "init",
      "kind": "command",
      "command": "bun src/cli/index.ts init --repo . --dry-run",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Covers affected campaign/runner behavior or required repository integrity.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "helper-parity",
      "kind": "command",
      "command": "cmp scripts/contract-run.ts assets/templates/helpers/contract-run.ts && cmp scripts/run-bounded-verifier-command.ts assets/templates/helpers/run-bounded-verifier-command.ts",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Covers affected campaign/runner behavior or required repository integrity.",
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

- Functional behavior: current-owner renewal during a real child; cancellation and unresolved reservation on authority loss.
- Edge cases: historical missing policy, stale owner, reordered policy JSON, descendants and a killed supervisor with reused output directory.
- Regression risks: preserve existing campaign budget/retry settlement and generic contract-run behavior; no remote-provider terminal claim.

## Rollback Point

- Commit / checkpoint: main 188ae352.
- Revert strategy: stop new campaign dispatch and revert source; preserve all grants, journals and existing worktrees.
