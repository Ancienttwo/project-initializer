# Task Contract: campaign-verifier-failure

> **Status**: Active
> **Plan**: plans/plan-20260910-0321-campaign-verifier-failure.md
> **Task Profile**: bugfix
> <!-- legal values: code-change | docs-only | ledger-closeout | migration | eval-only | delegated-run | bugfix (omit for legacy passthrough); see docs/reference-configs/sprint-contracts.md -->
> **Owner**: ancienttwo
> **Capability ID**: root
> **Last Updated**: 2026-09-10 03:21
> **Review File**: `tasks/reviews/20260910-0321-campaign-verifier-failure.review.md`
> **Notes File**: `tasks/notes/20260910-0321-campaign-verifier-failure.notes.md`
> **Exemplar**: `docs/reference-configs/contract-brief-example.md`

## Why

An exact supervised verifier rejection is known, but zero process exits make failure settlement skip the attempt and finish then reads an absent worker result.

## Goal

Settle one controller-owned permanent_failure/verifier_rejected from existing exact runtime evidence without creating a worker result; allow a fresh stopped-adopted continuation under all existing quiescence and authority guards.

## Scope

- In scope: campaign-worker.ts failure settlement and matching stopped-failed readback; focused model-free regression tests and workflow/research.
- Completed prerequisite: narrow runner output prompt repair on this branch, already accepted.
- Out of scope: grant expiry changes, refunds, resurrecting old dispatches, inferred worker outcome, verifier schema changes, other recovery or product repairs.

## Stop Conditions

- Stop and hand back to the parent if the change would require editing a path outside Allowed Paths.
- Stop if an Exit Criteria command cannot be run in this environment.
- Stop if Goal, Scope, or Exit Criteria are internally contradictory.

## Falsifier

A supervised typed verifier failure with two exact inactive zero-exit children and no worker result remains unaccounted; or pass/unknown/tampered evidence can produce the new final; or any stopped-resume ownership/publication guard is weakened.

## Root Cause Evidence

- root_cause: src/effects/automation/campaign-worker.ts skips child exit0 in settleObservedCampaignFailureUnderLock before finish reads the missing worker result.
- repro: bun test tests/effects/campaign-verifier-failure.test.ts
- regression_guard: tests/effects/campaign-verifier-failure.test.ts
- pre_fix_failure_artifact: tasks/evidence/campaign-verifier-failure-pre-fix.log

## Workflow Inventory

- Source plan: `plans/plan-20260910-0321-campaign-verifier-failure.md`
- Deferred-goal ledger: `tasks/todos.md`
- Review file: `tasks/reviews/20260910-0321-campaign-verifier-failure.review.md`
- Notes file: `tasks/notes/20260910-0321-campaign-verifier-failure.notes.md`
- Checks file: `.ai/harness/checks/latest.json`
- Run snapshots: `.ai/harness/runs/`
- Scope gate: edit only paths listed under `allowed_paths`; update this contract before widening scope.
- Completion gate: run `verify-sprint --prepare-acceptance`, record one typed AcceptanceReceipt under the frozen policy below, then run `verify-sprint`; review Markdown is projection only.

## Change Assessment

```json
{"protocol":1,"oracles":[{"id":"verifier-failure","kind":"deterministic_test","paths":["*"]}]}
```

## Acceptance Policy

```json
{"protocol":2,"reviewer":"Codex","source":"codex-plugin","user_waiver":"allowed"}
```

## Allowed Paths

```yaml
allowed_paths:
  - src/effects/automation/campaign-worker.ts
  - tests/effects/campaign-verifier-failure.test.ts
  - tests/effects/campaign-settled-resume.test.ts
  - tests/campaign-finish-failure-audit.test.ts
  - tests/fixtures/brc-audit/finish-failure.ts
  - scripts/contract-run.ts
  - assets/templates/helpers/contract-run.ts
  - tests/contract-run.test.ts
  - tasks/
  - plans/
  - docs/researches/
  - docs/architecture/
  - .archcontext/
  - .ai/context/
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
    - docs/researches/20260910-campaign-verifier-failure.md
  artifacts_exist:
    - tasks/evidence/campaign-verifier-failure-pre-fix.log
```

## Verification Plan

```json
{
  "protocol": 1,
  "checks": [
    {
      "id": "target-1",
      "kind": "package_test",
      "path": "tests/effects/campaign-verifier-failure.test.ts",
      "necessity": "Exact verifier rejection settlement, lifecycle ownership, resume refusal or owning runner integration.",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "target-2",
      "kind": "package_test",
      "path": "tests/effects/campaign-settled-resume.test.ts",
      "necessity": "Exact verifier rejection settlement, lifecycle ownership, resume refusal or owning runner integration.",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "target-3",
      "kind": "package_test",
      "path": "tests/effects/brc10-lifecycle.test.ts",
      "necessity": "Exact verifier rejection settlement, lifecycle ownership, resume refusal or owning runner integration.",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "target-4",
      "kind": "package_test",
      "path": "tests/campaign-finish-failure-audit.test.ts",
      "necessity": "Exact verifier rejection settlement, lifecycle ownership, resume refusal or owning runner integration.",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "target-5",
      "kind": "package_test",
      "path": "tests/unit/brc10-lifecycle.test.ts",
      "necessity": "Exact verifier rejection settlement, lifecycle ownership, resume refusal or owning runner integration.",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "target-6",
      "kind": "package_test",
      "path": "tests/contract-run.test.ts",
      "necessity": "Exact verifier rejection settlement, lifecycle ownership, resume refusal or owning runner integration.",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "types",
      "kind": "command",
      "command": "bun run check:type",
      "necessity": "Required type or repository integrity.",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "sql",
      "kind": "command",
      "command": "bash scripts/check-deploy-sql-order.sh",
      "necessity": "Required type or repository integrity.",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "architecture",
      "kind": "command",
      "command": "bash scripts/check-architecture-sync.sh",
      "necessity": "Required type or repository integrity.",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "task-sync",
      "kind": "command",
      "command": "bash scripts/check-task-sync.sh",
      "necessity": "Required type or repository integrity.",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "workflow",
      "kind": "command",
      "command": "bash scripts/check-task-workflow.sh --strict",
      "necessity": "Required type or repository integrity.",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "state",
      "kind": "command",
      "command": "bun scripts/inspect-project-state.ts --repo . --format text",
      "necessity": "Required type or repository integrity.",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "adoption",
      "kind": "command",
      "command": "bun src/cli/index.ts init --repo . --dry-run",
      "necessity": "Required type or repository integrity.",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "inputs": {
        "env": []
      }
    }
  ]
}
```

## Acceptance Notes (Human Review)

A fresh explicitly authorized campaign may retry a known verifier rejection, including code-quality rejection; permanent_failure remains terminal for the old attempt. This does not auto-retry, grant a new acquire, or infer an external block. Current user approval permits one additional acquire with other remaining caps conserved. No provider runs in verification. Use named lifecycle/runner checks; no uncovered integration risk justifies a local full suite.

## Rollback Point

Revert this known-verifier-failure delta. Preserve immutable persisted finals, usage, stopped campaigns and runtime journals.
