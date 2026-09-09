> **Archived**: 2026-09-09 22:33
> **Related Plan**: plans/archive/plan-20260909-2217-campaign-worker-contract-authority.md
> **Outcome**: Completed
> **Lifecycle**: contract
> **Parent Run ID**: run-20260909-2233
> **Archive Projection V1**: `plans/plan-20260909-2217-campaign-worker-contract-authority.md` => `plans/archive/plan-20260909-2217-campaign-worker-contract-authority.md`
> **Archive Projection V1**: `tasks/notes/20260909-2217-campaign-worker-contract-authority.notes.md` => `tasks/archive/notes-20260909-2233-campaign-worker-contract-authority.md`
> **Archive Projection V1**: `tasks/contracts/20260909-2217-campaign-worker-contract-authority.contract.md` => `tasks/archive/contract-20260909-2233-campaign-worker-contract-authority.md`
> **Archive Projection V1**: `tasks/reviews/20260909-2217-campaign-worker-contract-authority.review.md` => `tasks/archive/review-20260909-2233-campaign-worker-contract-authority.md`

# Task Contract: campaign-worker-contract-authority

> **Status**: Fulfilled
> **Plan**: plans/archive/plan-20260909-2217-campaign-worker-contract-authority.md
> **Task Profile**: bugfix
> <!-- legal values: code-change | docs-only | ledger-closeout | migration | eval-only | delegated-run | bugfix (omit for legacy passthrough); see docs/reference-configs/sprint-contracts.md -->
> **Owner**: ancienttwo
> **Capability ID**: root
> **Last Updated**: 2026-09-09 22:17
> **Review File**: `tasks/archive/review-20260909-2233-campaign-worker-contract-authority.md`
> **Notes File**: `tasks/archive/notes-20260909-2233-campaign-worker-contract-authority.md`
> **Exemplar**: `docs/reference-configs/contract-brief-example.md`

## Why

Acquire replaces admitted contract bytes with a template, blocking campaign dispatch and producing a second digest authority.

## Goal

Preserve authored contract bytes through packaged projection and consume the admitted proof digest in newly created campaign handoffs.

## Scope

- In scope: contract preservation in packaged projection, proof-bound worker handoffs, focused model-free regressions and required integrity checks.
- Out of scope:
  - successor eligibility, budget caps, runtime Docker infrastructure, Oracle, identity bypass, immutable store rewriting, unrelated worktrees, automatic merge, package release.
- Taste constraints: <!-- advisory only, no run gate; default style/taste lives in AGENTS.md and the minimal-change policy, use this to record a per-task override -->

## Stop Conditions

- Stop and hand back to the parent if the change would require editing a path outside Allowed Paths.
- Stop if an Exit Criteria command cannot be run in this environment.
- Stop if Goal, Scope, or Exit Criteria are internally contradictory.

## Falsifier

A package-only acquisition changes authored contract bytes or a new worker handoff binds bytes different from the plan proof.

## Root Cause Evidence

- root_cause: campaign-worker.ts derives a digest after plan-to-todo render_contract_file unconditionally overwrites the proof-bound contract.
- repro: bun test --timeout 60000 tests/cli/fleet-offer-acquire.test.ts
- regression_guard: tests/cli/fleet-offer-acquire.test.ts
- pre_fix_failure_artifact: tasks/evidence/campaign-worker-contract-authority-pre-fix.log

## Workflow Inventory

- Source plan: `plans/archive/plan-20260909-2217-campaign-worker-contract-authority.md`
- Deferred-goal ledger: `tasks/todos.md`
- Review file: `tasks/archive/review-20260909-2233-campaign-worker-contract-authority.md`
- Notes file: `tasks/archive/notes-20260909-2233-campaign-worker-contract-authority.md`
- Checks file: `.ai/harness/checks/latest.json`
- Run snapshots: `.ai/harness/runs/`
- Scope gate: edit only paths listed under `allowed_paths`; update this contract before widening scope.
- Completion gate: run `verify-sprint --prepare-acceptance`, record one typed AcceptanceReceipt under the frozen policy below, then run `verify-sprint`; review Markdown is projection only.

## Change Assessment

```json
{"protocol": 1, "oracles": [{"id": "contract-authority", "kind": "deterministic_test", "paths": ["src/effects/automation/campaign-worker.ts", "scripts/plan-to-todo.sh", "assets/templates/helpers/plan-to-todo.sh", "tests/cli/fleet-offer-acquire.test.ts", "tests/effects/campaign-worker.test.ts", "docs/researches/20260909-campaign-worker-contract-authority.md", "tasks/evidence/campaign-worker-contract-authority-pre-fix.log", "tests/helpers/historical-campaign-lifecycle.ts", "docs/architecture/.projection-manifest.json"]}]}
```

## Acceptance Policy

```json
{"protocol":2,"reviewer":"Codex","source":"codex-plugin","user_waiver":"allowed"}
```

## Allowed Paths

```yaml
allowed_paths:
  - src/effects/automation/campaign-worker.ts
  - scripts/plan-to-todo.sh
  - assets/templates/helpers/plan-to-todo.sh
  - tests/cli/fleet-offer-acquire.test.ts
  - tests/effects/campaign-worker.test.ts
  - tests/helpers/historical-campaign-lifecycle.ts
  - docs/architecture/.projection-manifest.json
  - docs/researches/20260909-campaign-worker-contract-authority.md
  - tasks/evidence/campaign-worker-contract-authority-pre-fix.log
  - tasks/todos.md
  - plans/archive/plan-20260909-2217-campaign-worker-contract-authority.md
  - tasks/archive/contract-20260909-2233-campaign-worker-contract-authority.md
  - tasks/archive/review-20260909-2233-campaign-worker-contract-authority.md
  - tasks/archive/notes-20260909-2233-campaign-worker-contract-authority.md
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
    - docs/researches/20260909-campaign-worker-contract-authority.md
  artifacts_exist:
    - .ai/harness/checks/latest.json
    - tasks/archive/notes-20260909-2233-campaign-worker-contract-authority.md
```

## Verification Plan

```json
{
  "protocol": 1,
  "checks": [
    {
      "id": "fleet",
      "kind": "package_test",
      "path": "tests/cli/fleet-offer-acquire.test.ts",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Protect acquisition, worker binding and runner refusal boundaries.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "worker",
      "kind": "package_test",
      "path": "tests/effects/campaign-worker.test.ts",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Protect acquisition, worker binding and runner refusal boundaries.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "guardrails",
      "kind": "package_test",
      "path": "tests/unit/closeout-runner-guardrails.test.ts",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Protect acquisition, worker binding and runner refusal boundaries.",
      "inputs": {
        "env": []
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
      "necessity": "Required repository integrity or affected helper/type invariant.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "helpers",
      "kind": "command",
      "command": "bun run check:helpers",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Required repository integrity or affected helper/type invariant.",
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
      "necessity": "Required repository integrity or affected helper/type invariant.",
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
      "necessity": "Required repository integrity or affected helper/type invariant.",
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
      "necessity": "Required repository integrity or affected helper/type invariant.",
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
      "necessity": "Required repository integrity or affected helper/type invariant.",
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
      "necessity": "Required repository integrity or affected helper/type invariant.",
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
      "necessity": "Required repository integrity or affected helper/type invariant.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "projection-callers",
      "kind": "command",
      "command": "bun test --timeout 60000 tests/helper-scripts.test.ts --test-name-pattern 'plan-to-todo|contract projection'",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Covers existing projection initialization and scope-carrying callers.",
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
