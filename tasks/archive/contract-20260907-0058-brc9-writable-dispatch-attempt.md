> **Archived**: 2026-09-07 00:58
> **Related Plan**: plans/archive/plan-20260907-0010-brc9-writable-dispatch-attempt.md
> **Outcome**: Completed
> **Lifecycle**: contract
> **Parent Run ID**: run-20260907-0058
> **Archive Projection V1**: `plans/plan-20260907-0010-brc9-writable-dispatch-attempt.md` => `plans/archive/plan-20260907-0010-brc9-writable-dispatch-attempt.md`
> **Archive Projection V1**: `tasks/notes/20260907-0010-brc9-writable-dispatch-attempt.notes.md` => `tasks/archive/notes-20260907-0058-brc9-writable-dispatch-attempt.md`
> **Archive Projection V1**: `tasks/contracts/20260907-0010-brc9-writable-dispatch-attempt.contract.md` => `tasks/archive/contract-20260907-0058-brc9-writable-dispatch-attempt.md`
> **Archive Projection V1**: `tasks/reviews/20260907-0010-brc9-writable-dispatch-attempt.review.md` => `tasks/archive/review-20260907-0058-brc9-writable-dispatch-attempt.md`

# Task Contract: brc9-writable-dispatch-attempt

> **Status**: Fulfilled
> **Plan**: plans/archive/plan-20260907-0010-brc9-writable-dispatch-attempt.md
> **Task Profile**: code-change
> <!-- legal values: code-change | docs-only | ledger-closeout | migration | eval-only | delegated-run | bugfix (omit for legacy passthrough); see docs/reference-configs/sprint-contracts.md -->
> **Owner**: ancienttwo
> **Capability ID**: root
> **Last Updated**: 2026-09-07 00:10
> **Review File**: `tasks/archive/review-20260907-0058-brc9-writable-dispatch-attempt.md`
> **Notes File**: `tasks/archive/notes-20260907-0058-brc9-writable-dispatch-attempt.md`
> **Exemplar**: `docs/reference-configs/contract-brief-example.md`

## Why

Acquisition currently hands ownership to prose without a writable host/attempt consumer; retries can neither prove a launch nor join its result to the owned Task.

## Goal

Bind a real campaign acquisition to one host-initiated contract worker, exact live ownership, persist-first launch evidence, existing invocation budget and TaskAutomationAttemptV1 completion.

## Scope

- In scope: immutable acquisition handoff; existing contract-run optional campaign selector; exact launch/finish authority; per-invocation budget; explicit closed worker outcome; immutable process evidence; replay/crash controls and producer documentation.
- Out of scope:
  - adoption terminal sequencing, acquisition charging, new retry or repair policy, Lease renewal/reclaim, automatic merge/cleanup, GPT audits/canaries, new daemon, root lifecycle command, native hook protocol, read-only delegation changes, marking BRC9 complete.
- Taste constraints: one budget/attempt authority; no new dependency or daemon; no claim of OS path confinement or semantic acceptance from process success.

## Stop Conditions

- Stop and hand back to the parent if the change would require editing a path outside Allowed Paths.
- Stop if an Exit Criteria command cannot be run in this environment.
- Stop if Goal, Scope, or Exit Criteria are internally contradictory.

## Falsifier

A stale Lease can launch a real child, or same-key replay launches twice. First prove real acquisition plus a counted child command in a disposable repository, then exercise stale/replay controls.

## Workflow Inventory

- Source plan: `plans/archive/plan-20260907-0010-brc9-writable-dispatch-attempt.md`
- Deferred-goal ledger: `tasks/todos.md`
- Review file: `tasks/archive/review-20260907-0058-brc9-writable-dispatch-attempt.md`
- Notes file: `tasks/archive/notes-20260907-0058-brc9-writable-dispatch-attempt.md`
- Checks file: `.ai/harness/checks/latest.json`
- Run snapshots: `.ai/harness/runs/`
- Scope gate: edit only paths listed under `allowed_paths`; update this contract before widening scope.
- Completion gate: run `verify-sprint --prepare-acceptance`, record one typed AcceptanceReceipt under the frozen policy below, then run `verify-sprint`; review Markdown is projection only.

## Change Assessment

```json
{"protocol":1,"oracles":[{"id":"worker-1-real-acquisition-host-and-attempt-controls","kind":"deterministic_test","paths":["src/effects/automation/campaign-worker.ts","src/effects/automation/campaign-acquisition.ts","scripts/contract-run.ts","assets/templates/helpers/contract-run.ts"]}]}
```

## Acceptance Policy

```json
{"protocol":2,"reviewer":"Codex","source":"codex-plugin","user_waiver":"allowed"}
```

## Allowed Paths

```yaml
allowed_paths:
  - src/effects/automation/campaign-worker.ts
  - src/effects/automation/campaign-acquisition.ts
  - scripts/contract-run.ts
  - assets/templates/helpers/contract-run.ts
  - tests/effects/campaign-worker.test.ts
  - tests/effects/campaign-acquisition.test.ts
  - tests/helpers/campaign-acquisition-fixture.ts
  - tests/contract-run.test.ts
  - docs/researches/20260907-brc9-writable-dispatch-attempt.md
  - docs/architecture/
  - plans/archive/plan-20260907-0010-brc9-writable-dispatch-attempt.md
  - tasks/archive/contract-20260907-0058-brc9-writable-dispatch-attempt.md
  - tasks/archive/review-20260907-0058-brc9-writable-dispatch-attempt.md
  - tasks/archive/notes-20260907-0058-brc9-writable-dispatch-attempt.md
  - tasks/todos.md
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
    - src/effects/automation/campaign-worker.ts
    - tests/effects/campaign-worker.test.ts
  artifacts_exist:
    - .ai/harness/checks/latest.json
    - tasks/archive/notes-20260907-0058-brc9-writable-dispatch-attempt.md
```

## Verification Plan

```json
{
  "protocol": 1,
  "checks": [
    {
      "id": "worker-1",
      "kind": "package_test",
      "path": "tests/effects/campaign-worker.test.ts",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Proves real acquired host execution and its existing acquisition/runner/attempt boundary.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "worker-2",
      "kind": "package_test",
      "path": "tests/effects/campaign-acquisition.test.ts",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Proves real acquired host execution and its existing acquisition/runner/attempt boundary.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "worker-3",
      "kind": "package_test",
      "path": "tests/contract-run.test.ts",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Proves real acquired host execution and its existing acquisition/runner/attempt boundary.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "worker-4",
      "kind": "package_test",
      "path": "tests/unit/issue-287-automation-attempt.test.ts",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Proves real acquired host execution and its existing acquisition/runner/attempt boundary.",
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
      "necessity": "Required repository integrity for the changed host execution surface.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "integrity-2",
      "kind": "command",
      "command": "bash scripts/check-deploy-sql-order.sh",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Required repository integrity for the changed host execution surface.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "integrity-3",
      "kind": "command",
      "command": "bash scripts/check-architecture-sync.sh",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Required repository integrity for the changed host execution surface.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "integrity-4",
      "kind": "command",
      "command": "bun scripts/check-context-map.ts --repo .",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Required repository integrity for the changed host execution surface.",
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
      "necessity": "Required repository integrity for the changed host execution surface.",
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
      "necessity": "Required repository integrity for the changed host execution surface.",
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
      "necessity": "Required repository integrity for the changed host execution surface.",
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
      "necessity": "Required repository integrity for the changed host execution surface.",
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

- Functional behavior: host explicitly starts one acquired task; process and attempt outcomes never constitute AcceptanceReceipt.
- Edge cases: missing/stale authority, replay, changed commands, launch/result crashes, unknown process result, budget refusal.
- Regression risks: generic contract-run and read-only delegation retain their existing path; maximum campaign capacity does not bypass unresolved invocation policy.

## Rollback Point

- Commit / checkpoint: 0155acb01a6a79c0bf34376c974d6214e27fae38.
- Revert strategy: source revert only; retain immutable evidence and reconcile unknown launches before any retry.
