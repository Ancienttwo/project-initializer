> **Archived**: 2026-09-07 02:05
> **Related Plan**: plans/archive/plan-20260907-0149-brc15a-shadow-provider-budget.md
> **Outcome**: Completed
> **Lifecycle**: contract
> **Parent Run ID**: run-20260907-0205
> **Archive Projection V1**: `plans/plan-20260907-0149-brc15a-shadow-provider-budget.md` => `plans/archive/plan-20260907-0149-brc15a-shadow-provider-budget.md`
> **Archive Projection V1**: `tasks/notes/20260907-0149-brc15a-shadow-provider-budget.notes.md` => `tasks/archive/notes-20260907-0205-brc15a-shadow-provider-budget.md`
> **Archive Projection V1**: `tasks/contracts/20260907-0149-brc15a-shadow-provider-budget.contract.md` => `tasks/archive/contract-20260907-0205-brc15a-shadow-provider-budget.md`
> **Archive Projection V1**: `tasks/reviews/20260907-0149-brc15a-shadow-provider-budget.review.md` => `tasks/archive/review-20260907-0205-brc15a-shadow-provider-budget.md`

# Task Contract: brc15a-shadow-provider-budget

> **Status**: Fulfilled
> **Plan**: plans/archive/plan-20260907-0149-brc15a-shadow-provider-budget.md
> **Task Profile**: code-change
> <!-- legal values: code-change | docs-only | ledger-closeout | migration | eval-only | delegated-run | bugfix (omit for legacy passthrough); see docs/reference-configs/sprint-contracts.md -->
> **Owner**: ancienttwo
> **Capability ID**: root
> **Last Updated**: 2026-09-07 01:49
> **Review File**: `tasks/archive/review-20260907-0205-brc15a-shadow-provider-budget.md`
> **Notes File**: `tasks/archive/notes-20260907-0205-brc15a-shadow-provider-budget.md`
> **Exemplar**: `docs/reference-configs/contract-brief-example.md`

## Why

Shadow measurement invokes real providers; uncharged reads bypass the owner budget and post-seal charging invalidates exact terminal evidence.

## Goal

Budget every shadow adoption provider read before I/O and recover its exact terminal without repeated effects.

## Scope

- In scope: shadow observation admission, immutable outcomes, authoring epoch projection, atomic completion/seal and focused recovery evidence.
- Out of scope: active publication ordering, acquisition, BRC6a proof, real canary, Sprint completion.
- Taste constraints: <!-- advisory only, no run gate; default style/taste lives in AGENTS.md and the minimal-change policy, use this to record a per-task override -->

## Stop Conditions

- Stop and hand back to the parent if the change would require editing a path outside Allowed Paths.
- Stop if an Exit Criteria command cannot be run in this environment.
- Stop if Goal, Scope, or Exit Criteria are internally contradictory.

## Falsifier

A real observer reaches its fake GitHub runner without an open reservation; a final terminal omits charged reads or completion; replay repeats provider I/O.

## Root Cause Evidence

Required when Task Profile is `bugfix`; leave as-is otherwise.

- root_cause: one sentence naming file:line/condition (testable, not "a state issue").
- repro: the command or UI path that reproduces the symptom.
- regression_guard: path to a test that fails on the unfixed code and passes after the fix (must also appear as a `package_test` check in Verification Plan).
- pre_fix_failure_artifact: path to a captured run of regression_guard on the UNFIXED code. Capture with `bun test <regression_guard> > <artifact> 2>&1; echo "PRE_FIX_EXIT=$?" >> <artifact>` (no pipes — pipes swallow the exit status). The gate requires a non-zero `PRE_FIX_EXIT=` line plus the regression_guard path string in the artifact (see the Root Cause Evidence Gate section in docs/reference-configs/sprint-contracts.md).

## Workflow Inventory

- Source plan: `plans/archive/plan-20260907-0149-brc15a-shadow-provider-budget.md`
- Deferred-goal ledger: `tasks/todos.md`
- Review file: `tasks/archive/review-20260907-0205-brc15a-shadow-provider-budget.md`
- Notes file: `tasks/archive/notes-20260907-0205-brc15a-shadow-provider-budget.md`
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
  - src/effects/automation/budget-store.ts
  - src/effects/automation/issue-batch-store.ts
  - src/effects/automation/issue-batch-adoption.ts
  - src/effects/automation/issue-batch-shadow-adoption.ts
  - src/effects/automation/campaign-provider-execution.ts
  - tests/effects/issue-batch-shadow-budget.test.ts
  - tests/effects/issue-batch-adoption.test.ts
  - tests/helpers/campaign-adoption-repository.ts
  - tests/unit/campaign-authoring-budget-prerequisite.test.ts
  - docs/researches/20260907-brc15a-shadow-provider-budget.md
  - docs/architecture/
  - plans/archive/plan-20260907-0149-brc15a-shadow-provider-budget.md
  - tasks/todos.md
  - tasks/archive/contract-20260907-0205-brc15a-shadow-provider-budget.md
  - tasks/archive/review-20260907-0205-brc15a-shadow-provider-budget.md
  - tasks/archive/notes-20260907-0205-brc15a-shadow-provider-budget.md
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
    - tasks/archive/notes-20260907-0205-brc15a-shadow-provider-budget.md
```

## Verification Plan

```json
{
  "protocol": 1,
  "checks": [
    {
      "id": "shadow",
      "kind": "package_test",
      "path": "tests/effects/issue-batch-shadow-budget.test.ts",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Covers the changed shadow, budget, or existing active adoption boundary.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "adoption",
      "kind": "package_test",
      "path": "tests/effects/issue-batch-adoption.test.ts",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Covers the changed shadow, budget, or existing active adoption boundary.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "authoring-budget",
      "kind": "package_test",
      "path": "tests/unit/campaign-authoring-budget-prerequisite.test.ts",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Covers the changed shadow, budget, or existing active adoption boundary.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "step-budget",
      "kind": "package_test",
      "path": "tests/unit/campaign-step-budget-prerequisite.test.ts",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Covers the changed shadow, budget, or existing active adoption boundary.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "provider",
      "kind": "package_test",
      "path": "tests/effects/campaign-provider-execution.test.ts",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Covers the changed shadow, budget, or existing active adoption boundary.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "integrity-0",
      "kind": "command",
      "command": "bunx tsc --noEmit",
      "cwd": ".",
      "phase": "preflight",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Required repository integrity and changed TypeScript boundary validation.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "integrity-1",
      "kind": "command",
      "command": "bash scripts/check-deploy-sql-order.sh",
      "cwd": ".",
      "phase": "preflight",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Required repository integrity and changed TypeScript boundary validation.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "integrity-2",
      "kind": "command",
      "command": "bash scripts/check-architecture-sync.sh",
      "cwd": ".",
      "phase": "preflight",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Required repository integrity and changed TypeScript boundary validation.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "integrity-3",
      "kind": "command",
      "command": "bash scripts/check-task-sync.sh",
      "cwd": ".",
      "phase": "preflight",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Required repository integrity and changed TypeScript boundary validation.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "integrity-4",
      "kind": "command",
      "command": "bash scripts/check-task-workflow.sh --strict",
      "cwd": ".",
      "phase": "preflight",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Required repository integrity and changed TypeScript boundary validation.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "integrity-5",
      "kind": "command",
      "command": "bun scripts/inspect-project-state.ts --repo . --format text",
      "cwd": ".",
      "phase": "preflight",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Required repository integrity and changed TypeScript boundary validation.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "integrity-6",
      "kind": "command",
      "command": "bun src/cli/index.ts init --repo . --dry-run",
      "cwd": ".",
      "phase": "preflight",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Required repository integrity and changed TypeScript boundary validation.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "heartbeat",
      "kind": "package_test",
      "path": "tests/effects/campaign-step.test.ts",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Confirms existing heartbeat and GPT consumers retain their budget behavior.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "gpt-authoring",
      "kind": "package_test",
      "path": "tests/effects/gpt-pro-issue-authoring.test.ts",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Confirms existing heartbeat and GPT consumers retain their budget behavior.",
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

- Functional behavior: shadow provider calls reserve and settle in the existing ledger; terminal includes final completion.
- Edge cases: cap, unknown result, source drift, partial/fill and crash recovery covered by named tests.
- Regression risks: active publication remains unchanged and unaccepted under BRC9; no real canary or connector exact-SHA proof is claimed.

## Rollback Point

- Commit / checkpoint:
- Revert strategy:
