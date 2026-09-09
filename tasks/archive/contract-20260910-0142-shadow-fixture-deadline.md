> **Archived**: 2026-09-10 01:42
> **Related Plan**: plans/archive/plan-20260910-0138-shadow-fixture-deadline.md
> **Outcome**: Completed
> **Lifecycle**: contract
> **Parent Run ID**: run-20260910-0142
> **Archive Projection V1**: `plans/plan-20260910-0138-shadow-fixture-deadline.md` => `plans/archive/plan-20260910-0138-shadow-fixture-deadline.md`
> **Archive Projection V1**: `tasks/notes/20260910-0138-shadow-fixture-deadline.notes.md` => `tasks/archive/notes-20260910-0142-shadow-fixture-deadline.md`
> **Archive Projection V1**: `tasks/contracts/20260910-0138-shadow-fixture-deadline.contract.md` => `tasks/archive/contract-20260910-0142-shadow-fixture-deadline.md`
> **Archive Projection V1**: `tasks/reviews/20260910-0138-shadow-fixture-deadline.review.md` => `tasks/archive/review-20260910-0142-shadow-fixture-deadline.md`

# Task Contract: shadow-fixture-deadline

> **Status**: Fulfilled
> **Plan**: plans/archive/plan-20260910-0138-shadow-fixture-deadline.md
> **Task Profile**: bugfix
> <!-- legal values: code-change | docs-only | ledger-closeout | migration | eval-only | delegated-run | bugfix (omit for legacy passthrough); see docs/reference-configs/sprint-contracts.md -->
> **Owner**: ancienttwo
> **Capability ID**: root
> **Last Updated**: 2026-09-10 01:38
> **Review File**: `tasks/archive/review-20260910-0142-shadow-fixture-deadline.md`
> **Notes File**: `tasks/archive/notes-20260910-0142-shadow-fixture-deadline.md`
> **Exemplar**: `docs/reference-configs/contract-brief-example.md`

## Why

A 1000ms shared fixture deadline lets real ledger fsync latency abort shadow tests before their ledger assertions.

## Goal

Prove stale shadow terminals are refused under a deliberately slow modeled read while preserving runtime deadline enforcement.

## Scope

- In scope: optional fixture deadline, bounded shadow test policy, deterministic slow-read evidence and workflow documentation.
- Out of scope: product sources, real grant limits, C7 behavior, retry bypasses.

## Stop Conditions

- Stop and hand back to the parent if the change would require editing a path outside Allowed Paths.
- Stop if an Exit Criteria command cannot be run in this environment.
- Stop if Goal, Scope, or Exit Criteria are internally contradictory.

## Falsifier

The stale-terminal regression fails before reaching its assertions under a 1100ms modeled read, or a real GitHub deadline rejection stops working.

## Root Cause Evidence

- root_cause: tests/helpers/campaign-adoption-repository.ts:28 hardcodes deadline_ms1000 for real observer and fsync-backed shadow-budget tests.
- repro: bun test --timeout 60000 tests/effects/issue-batch-shadow-budget.test.ts --test-name-pattern "shadow rejects its old terminal"
- regression_guard: tests/effects/issue-batch-shadow-budget.test.ts
- pre_fix_failure_artifact: tasks/evidence/shadow-fixture-deadline-pre-fix.log

## Workflow Inventory

- Source plan: `plans/archive/plan-20260910-0138-shadow-fixture-deadline.md`
- Deferred-goal ledger: `tasks/todos.md`
- Review file: `tasks/archive/review-20260910-0142-shadow-fixture-deadline.md`
- Notes file: `tasks/archive/notes-20260910-0142-shadow-fixture-deadline.md`
- Checks file: `.ai/harness/checks/latest.json`
- Run snapshots: `.ai/harness/runs/`
- Scope gate: edit only paths listed under `allowed_paths`; update this contract before widening scope.
- Completion gate: run `verify-sprint --prepare-acceptance`, record one typed AcceptanceReceipt under the frozen policy below, then run `verify-sprint`; review Markdown is projection only.

## Change Assessment

```json
{"protocol":1,"oracles":[{"id":"shadow-ledger-deadline","kind":"deterministic_test","paths":["*"]}]}
```

## Acceptance Policy

```json
{"protocol":2,"reviewer":"Codex","source":"codex-plugin","user_waiver":"allowed"}
```

## Allowed Paths

```yaml
allowed_paths:
  - tests/helpers/campaign-adoption-repository.ts
  - tests/effects/issue-batch-shadow-budget.test.ts
  - tests/cli/collaboration.test.ts
  - tests/effects/campaign-settled-resume.test.ts
  - src/cli/commands/campaign.ts
  - src/effects/automation/campaign-authoring-resume.ts
  - src/effects/automation/campaign-planning-store.ts
  - src/effects/automation/campaign-worker.ts
  - src/effects/automation/gpt-pro-issue-authoring.ts
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
    - docs/researches/20260910-shadow-fixture-deadline.md
  artifacts_exist:
    - tasks/evidence/shadow-fixture-deadline-pre-fix.log
```

## Verification Plan

```json
{
  "protocol": 1,
  "checks": [
    {
      "id": "shadow-budget",
      "kind": "package_test",
      "path": "tests/effects/issue-batch-shadow-budget.test.ts",
      "necessity": "Ledger behavior under slow modeled I/O and retained actual deadline refusal.",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "github-deadline",
      "kind": "package_test",
      "path": "tests/effects/external-source-github.test.ts",
      "necessity": "Ledger behavior under slow modeled I/O and retained actual deadline refusal.",
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

CI34381786394 on5da9f883 failed only the shadow-budget fixture timeout; C7 and settled-resume passed. The default fixture deadline stays1000ms for all other consumers. Only this shadow ledger suite opts into20000ms. Previous PR implementation remains an unchanged accepted baseline; prior allowed source paths cover that composite PR only. No local full suite or real provider call.

## Rollback Point

Revert the fixture-only correction; product timeout code and real campaign budgets remain unchanged.

