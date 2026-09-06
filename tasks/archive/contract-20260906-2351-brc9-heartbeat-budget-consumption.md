> **Archived**: 2026-09-06 23:51
> **Related Plan**: plans/archive/plan-20260906-2257-brc9-heartbeat-budget-consumption.md
> **Outcome**: Completed
> **Lifecycle**: contract
> **Parent Run ID**: run-20260906-2351
> **Archive Projection V1**: `plans/plan-20260906-2257-brc9-heartbeat-budget-consumption.md` => `plans/archive/plan-20260906-2257-brc9-heartbeat-budget-consumption.md`
> **Archive Projection V1**: `tasks/notes/20260906-2257-brc9-heartbeat-budget-consumption.notes.md` => `tasks/archive/notes-20260906-2351-brc9-heartbeat-budget-consumption.md`
> **Archive Projection V1**: `tasks/contracts/20260906-2257-brc9-heartbeat-budget-consumption.contract.md` => `tasks/archive/contract-20260906-2351-brc9-heartbeat-budget-consumption.md`
> **Archive Projection V1**: `tasks/reviews/20260906-2257-brc9-heartbeat-budget-consumption.review.md` => `tasks/archive/review-20260906-2351-brc9-heartbeat-budget-consumption.md`

# Task Contract: brc9-heartbeat-budget-consumption

> **Status**: Fulfilled
> **Plan**: plans/archive/plan-20260906-2257-brc9-heartbeat-budget-consumption.md
> **Task Profile**: code-change
> <!-- legal values: code-change | docs-only | ledger-closeout | migration | eval-only | delegated-run | bugfix (omit for legacy passthrough); see docs/reference-configs/sprint-contracts.md -->
> **Owner**: ancienttwo
> **Capability ID**: root
> **Last Updated**: 2026-09-06 22:57
> **Review File**: `tasks/archive/review-20260906-2351-brc9-heartbeat-budget-consumption.md`
> **Notes File**: `tasks/archive/notes-20260906-2351-brc9-heartbeat-budget-consumption.md`
> **Exemplar**: `docs/reference-configs/contract-brief-example.md`

## Why

The published campaign budget primitives are not consumed by heartbeat observations and GitHub mutations. Counting snapshots instead of actual adapter invocations would permit provider spending beyond the Owner grant.

## Goal

Bind every admitted pre-adoption heartbeat to one durable step admission and completion; reserve each actual GitHub invocation before it starts, preserve unknown-result reconciliation, and forward the same step identity to GPT continuations.

## Scope

- In scope: heartbeat admission/completion and crash replay; per-invocation GitHub budget execution and immutable provider evidence; GPT continuation step binding; named regression coverage and architecture/research updates.
- Out of scope: BRC6 terminal redesign, post-adoption planning/acquisition/dispatch integration, new attempt protocol, per-task repair or transient retry policy, live providers, release, and marking BRC9 complete.
- Taste constraints: one ledger owns counts; no compatibility path, counter file, new CLI command or dependency.

## Stop Conditions

- Stop and hand back to the parent if the change would require editing a path outside Allowed Paths.
- Stop if an Exit Criteria command cannot be run in this environment.
- Stop if Goal, Scope, or Exit Criteria are internally contradictory.

## Falsifier

The direction is false if one snapshot can invoke more GitHub calls than its budget admits, or replay can repeat a mutation. Fake-runner call counts, exact persisted reservation evidence and existing heartbeat crash controls are the cheapest proof.

## Workflow Inventory

- Source plan: `plans/archive/plan-20260906-2257-brc9-heartbeat-budget-consumption.md`
- Deferred-goal ledger: `tasks/todos.md`
- Review file: `tasks/archive/review-20260906-2351-brc9-heartbeat-budget-consumption.md`
- Notes file: `tasks/archive/notes-20260906-2351-brc9-heartbeat-budget-consumption.md`
- Checks file: `.ai/harness/checks/latest.json`
- Run snapshots: `.ai/harness/runs/`
- Scope gate: edit only paths listed under `allowed_paths`; update this contract before widening scope.
- Completion gate: run `verify-sprint --prepare-acceptance`, record one typed AcceptanceReceipt under the frozen policy below, then run `verify-sprint`; review Markdown is projection only.

## Change Assessment

```json
{"protocol":1,"oracles":[{"id":"heartbeat-provider-ledger-boundaries","kind":"deterministic_test","paths":["*"]}]}
```

## Acceptance Policy

```json
{"protocol":2,"reviewer":"Codex","source":"codex-plugin","user_waiver":"allowed"}
```

## Allowed Paths

```yaml
allowed_paths:
  - src/effects/automation/campaign-step.ts
  - src/effects/automation/campaign-provider-execution.ts
  - src/effects/automation/budget-store.ts
  - src/effects/external-sources/github.ts
  - tests/effects/campaign-step.test.ts
  - tests/effects/campaign-provider-execution.test.ts
  - tests/unit/campaign-step-budget-prerequisite.test.ts
  - docs/researches/20260905-repair-campaign-sprint-execution-boundaries.md
  - docs/architecture/
  - plans/archive/plan-20260906-2257-brc9-heartbeat-budget-consumption.md
  - tasks/todos.md
  - tasks/archive/contract-20260906-2351-brc9-heartbeat-budget-consumption.md
  - tasks/archive/review-20260906-2351-brc9-heartbeat-budget-consumption.md
  - tasks/archive/notes-20260906-2351-brc9-heartbeat-budget-consumption.md
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
    - src/effects/automation/campaign-provider-execution.ts
    - tests/effects/campaign-provider-execution.test.ts
  artifacts_exist:
    - .ai/harness/checks/latest.json
    - tasks/archive/notes-20260906-2351-brc9-heartbeat-budget-consumption.md
```

## Verification Plan

```json
{
  "protocol": 1,
  "checks": [
    {
      "id": "heartbeat-1",
      "kind": "package_test",
      "path": "tests/effects/campaign-provider-execution.test.ts",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "baseline_with_delta",
      "necessity": "Retain the immutable pre-correction pass for this unchanged provider, ledger, authoring or CLI boundary; current heartbeat recovery and TypeScript checks cover the only production delta after that baseline.",
      "inputs": {
        "env": []
      },
      "baseline": {
        "run_file": ".ai/harness/runs/verification-vx-4b11f4794c2942f7bb83.json",
        "execution_id": "vx-4b11f4794c2942f7bb83"
      },
      "delta_checks": [
        "heartbeat-2",
        "integrity-1"
      ]
    },
    {
      "id": "heartbeat-2",
      "kind": "package_test",
      "path": "tests/effects/campaign-step.test.ts",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Verifies heartbeat decisions, the provider invocation boundary or its named ledger and authoring consumers.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "heartbeat-3",
      "kind": "package_test",
      "path": "tests/unit/campaign-step-budget-prerequisite.test.ts",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "baseline_with_delta",
      "necessity": "Retain the immutable pre-correction pass for this unchanged provider, ledger, authoring or CLI boundary; current heartbeat recovery and TypeScript checks cover the only production delta after that baseline.",
      "inputs": {
        "env": []
      },
      "baseline": {
        "run_file": ".ai/harness/runs/verification-vx-5f1f637996774a1fb482.json",
        "execution_id": "vx-5f1f637996774a1fb482"
      },
      "delta_checks": [
        "heartbeat-2",
        "integrity-1"
      ]
    },
    {
      "id": "heartbeat-4",
      "kind": "package_test",
      "path": "tests/effects/issue-batch-observer.test.ts",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "baseline_with_delta",
      "necessity": "Retain the immutable pre-correction pass for this unchanged provider, ledger, authoring or CLI boundary; current heartbeat recovery and TypeScript checks cover the only production delta after that baseline.",
      "inputs": {
        "env": []
      },
      "baseline": {
        "run_file": ".ai/harness/runs/verification-vx-48d76450b9cc4885afc8.json",
        "execution_id": "vx-48d76450b9cc4885afc8"
      },
      "delta_checks": [
        "heartbeat-2",
        "integrity-1"
      ]
    },
    {
      "id": "heartbeat-5",
      "kind": "package_test",
      "path": "tests/effects/gpt-pro-issue-authoring.test.ts",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "baseline_with_delta",
      "necessity": "Retain the immutable pre-correction pass for this unchanged provider, ledger, authoring or CLI boundary; current heartbeat recovery and TypeScript checks cover the only production delta after that baseline.",
      "inputs": {
        "env": []
      },
      "baseline": {
        "run_file": ".ai/harness/runs/verification-vx-2f8580d2cc3c44d49ec9.json",
        "execution_id": "vx-2f8580d2cc3c44d49ec9"
      },
      "delta_checks": [
        "heartbeat-2",
        "integrity-1"
      ]
    },
    {
      "id": "heartbeat-6",
      "kind": "package_test",
      "path": "tests/unit/campaign-authoring-budget-prerequisite.test.ts",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "baseline_with_delta",
      "necessity": "Retain the immutable pre-correction pass for this unchanged provider, ledger, authoring or CLI boundary; current heartbeat recovery and TypeScript checks cover the only production delta after that baseline.",
      "inputs": {
        "env": []
      },
      "baseline": {
        "run_file": ".ai/harness/runs/verification-vx-1a4246ed4d814efdbf8b.json",
        "execution_id": "vx-1a4246ed4d814efdbf8b"
      },
      "delta_checks": [
        "heartbeat-2",
        "integrity-1"
      ]
    },
    {
      "id": "heartbeat-7",
      "kind": "package_test",
      "path": "tests/cli/development-campaign.test.ts",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "baseline_with_delta",
      "necessity": "Retain the immutable pre-correction pass for this unchanged provider, ledger, authoring or CLI boundary; current heartbeat recovery and TypeScript checks cover the only production delta after that baseline.",
      "inputs": {
        "env": []
      },
      "baseline": {
        "run_file": ".ai/harness/runs/verification-vx-500310252e9945f2b476.json",
        "execution_id": "vx-500310252e9945f2b476"
      },
      "delta_checks": [
        "heartbeat-2",
        "integrity-1"
      ]
    },
    {
      "id": "integrity-1",
      "kind": "command",
      "command": "bun run check:type",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Required repository integrity or TypeScript contract validation for the frozen implementation.",
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
      "necessity": "Required repository integrity or TypeScript contract validation for the frozen implementation.",
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
      "necessity": "Required repository integrity or TypeScript contract validation for the frozen implementation.",
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
      "necessity": "Required repository integrity or TypeScript contract validation for the frozen implementation.",
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
      "necessity": "Required repository integrity or TypeScript contract validation for the frozen implementation.",
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
      "necessity": "Required repository integrity or TypeScript contract validation for the frozen implementation.",
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
      "necessity": "Required repository integrity or TypeScript contract validation for the frozen implementation.",
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
      "necessity": "Required repository integrity or TypeScript contract validation for the frozen implementation.",
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

- Formal-review delta: the single codex-plugin review found a settled-read-failure controller dead end on subject sha256:eb7a0695c2c13662c2ca1329cf4ce460cdc2689d2251d7fabba23e6b7dae52b9. The correction changes only campaign-step observation failure completion, its real-observer positive/unknown-outcome controls, and durable documentation. The same current-exact heartbeat file and integrity checks cover this delta; the six unchanged baseline boundaries remain historical evidence. Owner acceptance is required after correction; the old external failure is not relabeled.

- Final delta binding: prepare run-20260906T233231-11604 / subject sha256:6067a76c78864e9030f353e0a5bf1d0b9ed8ef66ca7b2a4e08772fdba61314c5 is historical baseline evidence. The only subsequent production change makes completed mutation-result recovery require its prior admission; its negative control failed before the fix. Six unchanged named boundaries retain their immutable executions with current heartbeat and TypeScript delta checks. The full heartbeat file and eight integrity/type checks remain current-exact. This does not relabel the original prepare as a pass for the final subject.

- Functional behavior: no provider invocation before admission; exact heartbeat completion updates no-progress once.
- Edge cases: crash before/after reservation, usage and receipt writes; same-key replay; partial pagination; budget exhaustion; unresolved authoring and mutation outcomes.
- Regression risks: heartbeat journal CAS must not be changed by provider evidence writes; completed baseline prerequisite is not acceptance for this new subject.
- Coverage: named effect and ledger checks cover the changed call paths; no local full suite is required. CI retains its full required gate. BRC9 remains pending after this slice.

## Rollback Point

- Commit / checkpoint: cda7da08583d31c2760cf945a3cde3881dea81e1.
- Revert strategy: revert the source publication without rewriting immutable reservations or refunding incurred provider calls.
