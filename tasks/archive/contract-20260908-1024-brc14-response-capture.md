> **Archived**: 2026-09-08 10:24
> **Related Plan**: plans/archive/plan-20260908-1006-brc14-response-capture.md
> **Outcome**: Completed
> **Lifecycle**: contract
> **Parent Run ID**: run-20260908-1024
> **Archive Projection V1**: `plans/plan-20260908-1006-brc14-response-capture.md` => `plans/archive/plan-20260908-1006-brc14-response-capture.md`
> **Archive Projection V1**: `tasks/notes/20260908-1006-brc14-response-capture.notes.md` => `tasks/archive/notes-20260908-1024-brc14-response-capture.md`
> **Archive Projection V1**: `tasks/contracts/20260908-1006-brc14-response-capture.contract.md` => `tasks/archive/contract-20260908-1024-brc14-response-capture.md`
> **Archive Projection V1**: `tasks/reviews/20260908-1006-brc14-response-capture.review.md` => `tasks/archive/review-20260908-1024-brc14-response-capture.md`

# Task Contract: brc14-response-capture

> **Status**: Fulfilled
> **Plan**: plans/archive/plan-20260908-1006-brc14-response-capture.md
> **Task Profile**: code-change
> <!-- legal values: code-change | docs-only | ledger-closeout | migration | eval-only | delegated-run | bugfix (omit for legacy passthrough); see docs/reference-configs/sprint-contracts.md -->
> **Owner**: ancienttwo
> **Capability ID**: root
> **Last Updated**: 2026-09-08 10:06
> **Review File**: `tasks/archive/review-20260908-1024-brc14-response-capture.md`
> **Notes File**: `tasks/archive/notes-20260908-1024-brc14-response-capture.md`
> **Exemplar**: `docs/reference-configs/contract-brief-example.md`

## Why

Fresh audit currently discards the transport evidence needed for future version validation.

Why this task matters and what breaks downstream if it ships wrong or is skipped.

## Goal

Retain invocation-bound private Oracle response streams without upgrading them to revision authority.

Describe the exact outcome this task must deliver.

## Scope

- In scope: Oracle capture argument, bounded observation, browser metadata and fresh audit record, focused tests.
- Out of scope: live calls, tool-semantic parser, active admission, main WIP, release.

- In scope:
- Out of scope:
- Taste constraints: <!-- advisory only, no run gate; default style/taste lives in AGENTS.md and the minimal-change policy, use this to record a per-task override -->

## Stop Conditions

- Stop and hand back to the parent if the change would require editing a path outside Allowed Paths.
- Stop if an Exit Criteria command cannot be run in this environment.
- Stop if Goal, Scope, or Exit Criteria are internally contradictory.

## Falsifier

Wrong-session capture admitted, raw bytes lost during cleanup, or captured streams treated as trusted revision falsify this package.

What observable evidence would prove this task's direction wrong, and the cheapest proof point to check first. Leave as-is if not applicable.

## Root Cause Evidence

Required when Task Profile is `bugfix`; leave as-is otherwise.

- root_cause: one sentence naming file:line/condition (testable, not "a state issue").
- repro: the command or UI path that reproduces the symptom.
- regression_guard: path to a test that fails on the unfixed code and passes after the fix (must also appear as a `package_test` check in Verification Plan).
- pre_fix_failure_artifact: path to a captured run of regression_guard on the UNFIXED code. Capture with `bun test <regression_guard> > <artifact> 2>&1; echo "PRE_FIX_EXIT=$?" >> <artifact>` (no pipes — pipes swallow the exit status). The gate requires a non-zero `PRE_FIX_EXIT=` line plus the regression_guard path string in the artifact (see the Root Cause Evidence Gate section in docs/reference-configs/sprint-contracts.md).

## Workflow Inventory

- Source plan: `plans/archive/plan-20260908-1006-brc14-response-capture.md`
- Deferred-goal ledger: `tasks/todos.md`
- Review file: `tasks/archive/review-20260908-1024-brc14-response-capture.md`
- Notes file: `tasks/archive/notes-20260908-1024-brc14-response-capture.md`
- Checks file: `.ai/harness/checks/latest.json`
- Run snapshots: `.ai/harness/runs/`
- Scope gate: edit only paths listed under `allowed_paths`; update this contract before widening scope.
- Completion gate: run `verify-sprint --prepare-acceptance`, record one typed AcceptanceReceipt under the frozen policy below, then run `verify-sprint`; review Markdown is projection only.

## Change Assessment

```json
{"protocol": 1, "oracles": [{"id": "response-capture", "kind": "deterministic_test", "paths": ["*"]}]}
```

## Acceptance Policy

```json
{"protocol":2,"reviewer":"Codex","source":"codex-review","user_waiver":"allowed"}
```

## Allowed Paths

```yaml
allowed_paths:
  - src/cli/chatgpt-browser/
  - src/cli/commands/campaign.ts
  - src/core/automation/
  - src/effects/automation/
  - tests/
  - docs/
  - .archcontext/
  - AGENTS.md
  - CLAUDE.md
  - plans/
  - tasks/
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
    - tasks/archive/notes-20260908-1024-brc14-response-capture.md
```

## Verification Plan

```json
{
  "protocol": 1,
  "checks": [
    {
      "id": "focused",
      "kind": "command",
      "command": "bun test --timeout 60000 tests/unit/oracle-session-evidence.test.ts tests/cli/chatgpt-browser.test.ts tests/effects/campaign-fresh-audit.test.ts",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Verify capture boundary and affected consumers or required repository integrity.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "type",
      "kind": "command",
      "command": "bun run check:type",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Verify capture boundary and affected consumers or required repository integrity.",
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
      "necessity": "Verify capture boundary and affected consumers or required repository integrity.",
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
      "necessity": "Verify capture boundary and affected consumers or required repository integrity.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "sync",
      "kind": "command",
      "command": "bash scripts/check-task-sync.sh",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Verify capture boundary and affected consumers or required repository integrity.",
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
      "necessity": "Verify capture boundary and affected consumers or required repository integrity.",
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
      "necessity": "Verify capture boundary and affected consumers or required repository integrity.",
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
      "necessity": "Verify capture boundary and affected consumers or required repository integrity.",
      "inputs": {
        "env": []
      }
    }
  ]
}
```

## Acceptance Notes (Human Review)

- Functional behavior:
- Edge cases:
- Regression risks:

## Rollback Point

- Commit / checkpoint:
- Revert strategy:
