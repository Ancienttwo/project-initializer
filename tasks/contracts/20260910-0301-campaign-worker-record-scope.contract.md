# Task Contract: campaign-worker-record-scope

> **Status**: Active
> **Plan**: plans/plan-20260910-0301-campaign-worker-record-scope.md
> **Task Profile**: bugfix
> <!-- legal values: code-change | docs-only | ledger-closeout | migration | eval-only | delegated-run | bugfix (omit for legacy passthrough); see docs/reference-configs/sprint-contracts.md -->
> **Owner**: ancienttwo
> **Capability ID**: root
> **Last Updated**: 2026-09-10 03:01
> **Review File**: `tasks/reviews/20260910-0301-campaign-worker-record-scope.review.md`
> **Notes File**: `tasks/notes/20260910-0301-campaign-worker-record-scope.notes.md`
> **Exemplar**: `docs/reference-configs/contract-brief-example.md`

## Why

The generated worker prompt requires writes outside the narrow business allowlist, causing the actual worker to refuse implementation and omit its result record.

## Goal

Keep repository edit scope unchanged while making the exact runner result output obligation explicit and routing out-of-scope Notes observations to the parent.

## Scope

- In scope: generated worker prompt, shipped script mirror, focused model-free tests and workflow evidence.
- Out of scope: grant/cap changes, new provider calls, recovery semantics, context-file repair, verifier authority changes.

## Stop Conditions

- Stop and hand back to the parent if the change would require editing a path outside Allowed Paths.
- Stop if an Exit Criteria command cannot be run in this environment.
- Stop if Goal, Scope, or Exit Criteria are internally contradictory.

## Falsifier

A narrow-scope dry-run still mandates a Notes write outside its writable paths, or campaign output wording grants broader file authority than its exact result path.

## Root Cause Evidence

- root_cause: scripts/contract-run.ts worker prompt requires Notes and result writes while stopping on every path outside business Allowed Paths.
- repro: bun test tests/contract-run.test.ts --test-name-pattern "dry-run writes prompts and manifest"
- regression_guard: tests/contract-run.test.ts
- pre_fix_failure_artifact: tasks/evidence/campaign-worker-record-scope-pre-fix.log

## Workflow Inventory

- Source plan: `plans/plan-20260910-0301-campaign-worker-record-scope.md`
- Deferred-goal ledger: `tasks/todos.md`
- Review file: `tasks/reviews/20260910-0301-campaign-worker-record-scope.review.md`
- Notes file: `tasks/notes/20260910-0301-campaign-worker-record-scope.notes.md`
- Checks file: `.ai/harness/checks/latest.json`
- Run snapshots: `.ai/harness/runs/`
- Scope gate: edit only paths listed under `allowed_paths`; update this contract before widening scope.
- Completion gate: run `verify-sprint --prepare-acceptance`, record one typed AcceptanceReceipt under the frozen policy below, then run `verify-sprint`; review Markdown is projection only.

## Change Assessment

```json
{"protocol":1,"oracles":[{"id":"worker-record-scope","kind":"deterministic_test","paths":["*"]}]}
```

## Acceptance Policy

```json
{"protocol":2,"reviewer":"Codex","source":"codex-plugin","user_waiver":"allowed"}
```

## Allowed Paths

```yaml
allowed_paths:
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
    - docs/researches/20260910-campaign-worker-record-scope.md
  artifacts_exist:
    - tasks/evidence/campaign-worker-record-scope-pre-fix.log
```

## Verification Plan

```json
{
  "protocol": 1,
  "checks": [
    {
      "id": "contract-run",
      "kind": "package_test",
      "path": "tests/contract-run.test.ts",
      "necessity": "Generated task packets, runner failure and typed execution boundaries.",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "mirror",
      "kind": "command",
      "command": "cmp scripts/contract-run.ts assets/templates/helpers/contract-run.ts",
      "necessity": "Required mirror, type or repository integrity.",
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
      "necessity": "Required mirror, type or repository integrity.",
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
      "necessity": "Required mirror, type or repository integrity.",
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
      "necessity": "Required mirror, type or repository integrity.",
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
      "necessity": "Required mirror, type or repository integrity.",
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
      "necessity": "Required mirror, type or repository integrity.",
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
      "necessity": "Required mirror, type or repository integrity.",
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
      "necessity": "Required mirror, type or repository integrity.",
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

This is the single directly blocking extra after the approved campaign acquisition-cap repair. Actual worker and verifier both exited inactive; no semantic result was invented. Live BRC requires separate reconciliation and new acquisition authority. Verification stays model-free and uses named runner coverage, not a full suite.

## Rollback Point

Revert prompt and matching mirror; do not replay or alter any persisted campaign dispatch.
