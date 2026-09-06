> **Archived**: 2026-09-06 19:15
> **Related Plan**: plans/archive/plan-20260906-1743-brc9-attempt-prerequisite.md
> **Outcome**: Completed
> **Lifecycle**: contract
> **Parent Run ID**: run-20260906-1915
> **Archive Projection V1**: `plans/plan-20260906-1743-brc9-attempt-prerequisite.md` => `plans/archive/plan-20260906-1743-brc9-attempt-prerequisite.md`
> **Archive Projection V1**: `tasks/notes/20260906-1743-brc9-attempt-prerequisite.notes.md` => `tasks/archive/notes-20260906-1915-brc9-attempt-prerequisite.md`
> **Archive Projection V1**: `tasks/contracts/20260906-1743-brc9-attempt-prerequisite.contract.md` => `tasks/archive/contract-20260906-1915-brc9-attempt-prerequisite.md`
> **Archive Projection V1**: `tasks/reviews/20260906-1743-brc9-attempt-prerequisite.review.md` => `tasks/archive/review-20260906-1915-brc9-attempt-prerequisite.md`

# Task Contract: brc9-attempt-prerequisite

> **Status**: Fulfilled
> **Plan**: plans/archive/plan-20260906-1743-brc9-attempt-prerequisite.md
> **Task Profile**: bugfix
> <!-- legal values: code-change | docs-only | ledger-closeout | migration | eval-only | delegated-run | bugfix (omit for legacy passthrough); see docs/reference-configs/sprint-contracts.md -->
> **Owner**: ancienttwo
> **Capability ID**: root
> **Last Updated**: 2026-09-06 17:43
> **Review File**: `tasks/archive/review-20260906-1915-brc9-attempt-prerequisite.md`
> **Notes File**: `tasks/archive/notes-20260906-1915-brc9-attempt-prerequisite.md`
> **Exemplar**: `docs/reference-configs/contract-brief-example.md`

## Why

BRC9 must consume a closed attempt contract and cannot rely on a read-side retry refusal that the durable writer bypasses. The existing Task attempt authority must enforce its own policy before campaign consumption.

## Goal

Close the Task attempt outcome vocabulary, add non-retryable not_reproducible, and reject new attempt identities when the existing authoritative eligibility evaluator refuses them. Preserve exact-identity replay and valid stored bytes.

## Scope

- In scope: one core outcome tuple consumed by TypeScript, runtime validation and Engineer offer validation; retry-policy validation before start/completion writes and eligibility enforcement under the existing store lock; durable-store regressions.
- Out of scope: campaign budget counters, provider calls, pre-adoption identities, Task/Lease changes, new lifecycle commands and the consume-only BRC9 sprint row.
- Preserve the existing retry policy, storage format, digest calculation and revision-scoped reset behavior.

## Stop Conditions

- Stop and hand back to the parent if the change would require editing a path outside Allowed Paths.
- Stop if an Exit Criteria command cannot be run in this environment.
- Stop if Goal, Scope, or Exit Criteria are internally contradictory.

## Falsifier

If a genuine new identity after terminal/backoff state is already rejected without writes, the proposed writer fix is unnecessary. The disposable preflight demonstrated that both are currently accepted; regression guards will capture that failure before production edits.

## Root Cause Evidence

- root_cause: src/effects/engineers/automation-attempt-store.ts:27-28 checks only unfinished/max-count states before writing a new identity, bypassing observeRetryEligibility; src/core/engineers/automation-attempt.ts:30 and :76 omit closed outcome membership validation.
- repro: bun test tests/unit/issue-287-automation-attempt.test.ts
- regression_guard: tests/unit/issue-287-automation-attempt.test.ts
- pre_fix_failure_artifact: /tmp/brc9-attempt-before.txt

## Workflow Inventory

- Source plan: `plans/archive/plan-20260906-1743-brc9-attempt-prerequisite.md`
- Deferred-goal ledger: `tasks/todos.md`
- Review file: `tasks/archive/review-20260906-1915-brc9-attempt-prerequisite.md`
- Notes file: `tasks/archive/notes-20260906-1915-brc9-attempt-prerequisite.md`
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
  - src/core/engineers/automation-attempt.ts
  - src/core/engineers/scheduling.ts
  - src/effects/engineers/automation-attempt-store.ts
  - tests/unit/issue-287-automation-attempt.test.ts
  - docs/researches/20260905-repair-campaign-sprint-execution-boundaries.md
  - docs/architecture/
  - plans/archive/plan-20260906-1743-brc9-attempt-prerequisite.md
  - tasks/archive/contract-20260906-1915-brc9-attempt-prerequisite.md
  - tasks/archive/review-20260906-1915-brc9-attempt-prerequisite.md
  - tasks/archive/notes-20260906-1915-brc9-attempt-prerequisite.md
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
    - tests/unit/issue-287-automation-attempt.test.ts
  artifacts_exist:
    - .ai/harness/checks/latest.json
    - tasks/archive/notes-20260906-1915-brc9-attempt-prerequisite.md
```

## Verification Plan

```json
{
  "protocol": 1,
  "checks": [
    {
      "id": "typecheck",
      "kind": "command",
      "command": "bun run check:type",
      "cwd": ".",
      "phase": "preflight",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Checks shared outcome types and import cycles.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "state-boundaries",
      "kind": "command",
      "command": "bun run check:state-boundaries",
      "cwd": ".",
      "phase": "preflight",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Preserves core/effect ownership.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "deploy-sql",
      "kind": "command",
      "command": "bash scripts/check-deploy-sql-order.sh",
      "cwd": ".",
      "phase": "preflight",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Required repository SQL integrity.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "architecture",
      "kind": "command",
      "command": "bash scripts/check-architecture-sync.sh",
      "cwd": ".",
      "phase": "preflight",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Ensures architecture projection matches the frozen source.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "task-sync",
      "kind": "command",
      "command": "bash scripts/check-task-sync.sh",
      "cwd": ".",
      "phase": "preflight",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Checks workflow artifact consistency.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "strict-workflow",
      "kind": "command",
      "command": "bash scripts/check-task-workflow.sh --strict",
      "cwd": ".",
      "phase": "preflight",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Checks strict workflow constraints.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "project-state",
      "kind": "command",
      "command": "bun scripts/inspect-project-state.ts --repo . --format text",
      "cwd": ".",
      "phase": "preflight",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Checks canonical project state.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "init-dry-run",
      "kind": "command",
      "command": "bun src/cli/index.ts init --repo . --dry-run",
      "cwd": ".",
      "phase": "preflight",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Checks adoption dry-run remains valid.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "attempt-regression",
      "kind": "package_test",
      "path": "tests/unit/issue-287-automation-attempt.test.ts",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Covers closed vocabulary, write-time refusal without durable changes, exact replay, backoff boundaries and cross-process identity.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "controller-caller",
      "kind": "package_test",
      "path": "tests/unit/issue-279-automation-controller-run.test.ts",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Exercises the actual controller consumer and existing budget/dispatch ordering.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "scheduler-consumer",
      "kind": "package_test",
      "path": "tests/unit/issue-280-acquire-next.test.ts",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Exercises canonical Engineer acquisition and retry offer consumption.",
      "inputs": {
        "env": []
      }
    }
  ]
}
```

## Acceptance Notes (Human Review)

- Functional behavior: new attempts obey the same eligibility result as scheduling; exact replay remains read-only.
- Edge cases: terminal blockers, unknown outcomes, invalid policies, unresolved attempts, exact backoff timestamp and exhausted limits.
- Regression risks: the controller reserves its budget before starting an attempt; a writer refusal prevents dispatch and leaves existing reconciliation semantics intact.
- Coverage: these three focused suites cover all named production consumers; no local full-suite criterion is warranted. Remote required CI remains a publication gate.
- Status: pending implementation and verification; no acceptance is claimed.

## Rollback Point

- Commit / checkpoint: 879c9bfdfee66af602ac462b0a759efbf3e60bd0
- Revert strategy: revert before new not_reproducible records are issued. After issuance preserve evidence and require an explicit migration/release decision before vocabulary rollback.
