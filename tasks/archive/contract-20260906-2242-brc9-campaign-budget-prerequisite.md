> **Archived**: 2026-09-06 22:42
> **Related Plan**: plans/archive/plan-20260906-2017-brc9-campaign-budget-prerequisite.md
> **Outcome**: Completed
> **Lifecycle**: contract
> **Parent Run ID**: run-20260906-2242
> **Archive Projection V1**: `plans/plan-20260906-2017-brc9-campaign-budget-prerequisite.md` => `plans/archive/plan-20260906-2017-brc9-campaign-budget-prerequisite.md`
> **Archive Projection V1**: `tasks/notes/20260906-2017-brc9-campaign-budget-prerequisite.notes.md` => `tasks/archive/notes-20260906-2242-brc9-campaign-budget-prerequisite.md`
> **Archive Projection V1**: `tasks/contracts/20260906-2017-brc9-campaign-budget-prerequisite.contract.md` => `tasks/archive/contract-20260906-2242-brc9-campaign-budget-prerequisite.md`
> **Archive Projection V1**: `tasks/reviews/20260906-2017-brc9-campaign-budget-prerequisite.review.md` => `tasks/archive/review-20260906-2242-brc9-campaign-budget-prerequisite.md`

# Task Contract: brc9-campaign-budget-prerequisite

> **Status**: Fulfilled
> **Plan**: plans/archive/plan-20260906-2017-brc9-campaign-budget-prerequisite.md
> **Task Profile**: code-change
> <!-- legal values: code-change | docs-only | ledger-closeout | migration | eval-only | delegated-run | bugfix (omit for legacy passthrough); see docs/reference-configs/sprint-contracts.md -->
> **Owner**: ancienttwo
> **Capability ID**: root
> **Last Updated**: 2026-09-06 20:17
> **Review File**: `tasks/archive/review-20260906-2242-brc9-campaign-budget-prerequisite.md`
> **Notes File**: `tasks/archive/notes-20260906-2242-brc9-campaign-budget-prerequisite.md`
> **Exemplar**: `docs/reference-configs/contract-brief-example.md`

## Why

BRC9 cannot safely compose a controller step with BRC6 authoring while the outer step holds the only unresolved reservation. The #282 authority must expose independently enforceable step/provider limits before BRC9 consumes them.

## Goal

Provide locked, idempotent campaign step admission/completion and provider-call reservation in the existing automation ledger, preserving one unresolved external call and generic automation record bytes. The approved plan defines exact identity, outcome, limit and crash semantics.

## Scope

- In scope: campaign grant limits; typed step ledger events; existing-store provider admission; same-ledger fold, drift, stop and read projection; explicit authoring step binding; focused evidence and documentation.
- Out of scope: BRC9 controller wiring, dispatch, per-task repair accounting, transient streak, pre-adoption attempt protocol, retry redesign, new lifecycle commands, new Task/Lease identity and a second budget authority.

## Stop Conditions

- Stop and hand back to the parent if the change would require editing a path outside Allowed Paths.
- Stop if an Exit Criteria command cannot be run in this environment.
- Stop if Goal, Scope, or Exit Criteria are internally contradictory.

## Falsifier

A real-store step -> provider -> authoring -> completion test must succeed without holding two unresolved reservations. A second step or unknown leaf must fail before another adapter invocation. If that requires a second mutable counter or fabricated Task identity, stop and return to the parent design.

## Workflow Inventory

- Source plan: `plans/archive/plan-20260906-2017-brc9-campaign-budget-prerequisite.md`
- Deferred-goal ledger: `tasks/todos.md`
- Review file: `tasks/archive/review-20260906-2242-brc9-campaign-budget-prerequisite.md`
- Notes file: `tasks/archive/notes-20260906-2242-brc9-campaign-budget-prerequisite.md`
- Checks file: `.ai/harness/checks/latest.json`
- Run snapshots: `.ai/harness/runs/`
- Scope gate: edit only paths listed under `allowed_paths`; update this contract before widening scope.
- Completion gate: run `verify-sprint --prepare-acceptance`, record one typed AcceptanceReceipt under the frozen policy below, then run `verify-sprint`; review Markdown is projection only.

## Change Assessment

```json
{"protocol":1,"oracles":[{"id":"campaign-budget-named-regressions-and-integrity","kind":"deterministic_test","paths":["*"]},{"id":"architecture-projection-current","kind":"runtime_readback","paths":["docs/architecture/.projection-manifest.json"]},{"id":"codex-final-diff-acceptance","kind":"manual_acceptance","paths":["*"]}]}
```

## Acceptance Policy

```json
{"protocol":2,"reviewer":"Codex","source":"codex-plugin","user_waiver":"allowed"}
```

## Allowed Paths

```yaml
allowed_paths:
  - src/core/automation/budget.ts
  - src/core/automation/projection.ts
  - src/core/automation/campaign-authoring-budget.ts
  - src/effects/automation/budget-store.ts
  - src/effects/automation/gpt-pro-issue-authoring.ts
  - tests/unit/issue-282-automation-budget-core.test.ts
  - tests/unit/issue-282-automation-budget-store.test.ts
  - tests/unit/issue-282-automation-budget-prd-drift.test.ts
  - tests/unit/campaign-authoring-budget-prerequisite.test.ts
  - tests/unit/campaign-step-budget-prerequisite.test.ts
  - tests/cli/development-campaign.test.ts
  - tests/effects/campaign-step.test.ts
  - tests/effects/development-campaign-store.test.ts
  - tests/effects/gpt-pro-issue-authoring.test.ts
  - tests/effects/issue-batch-observer.test.ts
  - tests/helpers/campaign-adoption-repository.ts
  - plans/prds/20260828-2321-guarded-merge-unattended-automation.prd.md
  - plans/prds/20260902-2238-gpt-pro-seeded-repair-campaign.prd.md
  - docs/researches/20260905-repair-campaign-sprint-execution-boundaries.md
  - docs/architecture/
  - plans/archive/plan-20260906-2017-brc9-campaign-budget-prerequisite.md
  - tasks/todos.md
  - tasks/archive/contract-20260906-2242-brc9-campaign-budget-prerequisite.md
  - tasks/archive/review-20260906-2242-brc9-campaign-budget-prerequisite.md
  - tasks/archive/notes-20260906-2242-brc9-campaign-budget-prerequisite.md
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
    - tests/unit/campaign-step-budget-prerequisite.test.ts
    - docs/researches/20260905-repair-campaign-sprint-execution-boundaries.md
  artifacts_exist:
    - .ai/harness/checks/latest.json
    - tasks/archive/notes-20260906-2242-brc9-campaign-budget-prerequisite.md
```

## Verification Plan

```json
{
  "protocol": 1,
  "checks": [
    {
      "id": "budget-boundary-1",
      "kind": "package_test",
      "path": "tests/unit/campaign-step-budget-prerequisite.test.ts",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Proves the named producer, ledger, drift, contention, projection or existing consumer boundary; no duplicated full-suite coverage.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "budget-boundary-2",
      "kind": "package_test",
      "path": "tests/unit/issue-282-automation-budget-core.test.ts",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Proves the named producer, ledger, drift, contention, projection or existing consumer boundary; no duplicated full-suite coverage.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "budget-boundary-3",
      "kind": "package_test",
      "path": "tests/unit/issue-282-automation-budget-store.test.ts",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Proves the named producer, ledger, drift, contention, projection or existing consumer boundary; no duplicated full-suite coverage.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "budget-boundary-4",
      "kind": "package_test",
      "path": "tests/unit/issue-282-automation-budget-contention.test.ts",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Proves the named producer, ledger, drift, contention, projection or existing consumer boundary; no duplicated full-suite coverage.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "budget-boundary-5",
      "kind": "package_test",
      "path": "tests/unit/issue-282-automation-budget-e2e.test.ts",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Proves the named producer, ledger, drift, contention, projection or existing consumer boundary; no duplicated full-suite coverage.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "budget-boundary-6",
      "kind": "package_test",
      "path": "tests/unit/issue-282-automation-budget-prd-drift.test.ts",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Proves the named producer, ledger, drift, contention, projection or existing consumer boundary; no duplicated full-suite coverage.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "budget-boundary-7",
      "kind": "package_test",
      "path": "tests/unit/campaign-authoring-budget-prerequisite.test.ts",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Proves the named producer, ledger, drift, contention, projection or existing consumer boundary; no duplicated full-suite coverage.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "budget-boundary-8",
      "kind": "package_test",
      "path": "tests/effects/gpt-pro-issue-authoring.test.ts",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Proves the named producer, ledger, drift, contention, projection or existing consumer boundary; no duplicated full-suite coverage.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "budget-boundary-9",
      "kind": "package_test",
      "path": "tests/effects/campaign-step.test.ts",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Proves the named producer, ledger, drift, contention, projection or existing consumer boundary; no duplicated full-suite coverage.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "budget-boundary-10",
      "kind": "package_test",
      "path": "tests/effects/issue-batch-adoption.test.ts",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Proves the named producer, ledger, drift, contention, projection or existing consumer boundary; no duplicated full-suite coverage.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "budget-boundary-11",
      "kind": "package_test",
      "path": "tests/unit/issue-279-automation-controller-run.test.ts",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Proves the named producer, ledger, drift, contention, projection or existing consumer boundary; no duplicated full-suite coverage.",
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
      "necessity": "Required repository integrity and shared TypeScript/state-boundary validation.",
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
      "necessity": "Required repository integrity and shared TypeScript/state-boundary validation.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "sql",
      "kind": "command",
      "command": "bash scripts/check-deploy-sql-order.sh",
      "cwd": ".",
      "phase": "preflight",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Required repository integrity and shared TypeScript/state-boundary validation.",
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
      "necessity": "Required repository integrity and shared TypeScript/state-boundary validation.",
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
      "necessity": "Required repository integrity and shared TypeScript/state-boundary validation.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "workflow",
      "kind": "command",
      "command": "bash scripts/check-task-workflow.sh --strict",
      "cwd": ".",
      "phase": "preflight",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Required repository integrity and shared TypeScript/state-boundary validation.",
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
      "necessity": "Required repository integrity and shared TypeScript/state-boundary validation.",
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
      "necessity": "Required repository integrity and shared TypeScript/state-boundary validation.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "campaign-grant-consumer-1",
      "kind": "package_test",
      "path": "tests/cli/development-campaign.test.ts",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Covers the changed exact campaign grant fixtures and the protected authority inventory on the integration target.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "campaign-grant-consumer-2",
      "kind": "package_test",
      "path": "tests/effects/development-campaign-store.test.ts",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Covers the changed exact campaign grant fixtures and the protected authority inventory on the integration target.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "campaign-grant-consumer-3",
      "kind": "package_test",
      "path": "tests/effects/issue-batch-observer.test.ts",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Covers the changed exact campaign grant fixtures and the protected authority inventory on the integration target.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "campaign-grant-consumer-4",
      "kind": "package_test",
      "path": "tests/characterization/repair-campaign-authority-freeze.test.ts",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Covers the changed exact campaign grant fixtures and the protected authority inventory on the integration target.",
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

- Functional behavior: exact step/provider admission and accounting, independently consumable by BRC9.
- Edge cases: replay, concurrent entry, unresolved external calls, post-deadline completion, missing durable records and full provider capacity.
- Regression risks: same-ledger folding and grant cutover. Generic behavior is covered by existing #282/#279 checks. Required remote CI remains a release gate; no local full-suite criterion applies.

## Rollback Point

- Commit / checkpoint: 2cf1dd5b8bdd3c5004f9b8fb8c0c0a23f7ff6f57.
- Revert strategy: revert before issuing the new campaign grant/event kinds. After issuance stop the affected campaign and require an explicit operator migration/release decision; never rewrite immutable history. Non-campaign records need no migration.
