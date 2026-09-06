> **Archived**: 2026-09-07 05:46
> **Related Plan**: plans/archive/plan-20260907-0507-brc10-reclaim-time-boundary.md
> **Outcome**: Completed
> **Lifecycle**: contract
> **Parent Run ID**: run-20260907-0546
> **Archive Projection V1**: `plans/plan-20260907-0507-brc10-reclaim-time-boundary.md` => `plans/archive/plan-20260907-0507-brc10-reclaim-time-boundary.md`
> **Archive Projection V1**: `tasks/notes/20260907-0507-brc10-reclaim-time-boundary.notes.md` => `tasks/archive/notes-20260907-0546-brc10-reclaim-time-boundary.md`
> **Archive Projection V1**: `tasks/contracts/20260907-0507-brc10-reclaim-time-boundary.contract.md` => `tasks/archive/contract-20260907-0546-brc10-reclaim-time-boundary.md`
> **Archive Projection V1**: `tasks/reviews/20260907-0507-brc10-reclaim-time-boundary.review.md` => `tasks/archive/review-20260907-0546-brc10-reclaim-time-boundary.md`

# Task Contract: brc10-reclaim-time-boundary

> **Status**: Fulfilled
> **Plan**: plans/archive/plan-20260907-0507-brc10-reclaim-time-boundary.md
> **Task Profile**: bugfix
> <!-- legal values: code-change | docs-only | ledger-closeout | migration | eval-only | delegated-run | bugfix (omit for legacy passthrough); see docs/reference-configs/sprint-contracts.md -->
> **Owner**: ancienttwo
> **Capability ID**: root
> **Last Updated**: 2026-09-07 05:07
> **Review File**: `tasks/archive/review-20260907-0546-brc10-reclaim-time-boundary.md`
> **Notes File**: `tasks/archive/notes-20260907-0546-brc10-reclaim-time-boundary.md`
> **Exemplar**: `docs/reference-configs/contract-brief-example.md`

## Why

The existing reclaim consumer compares observation timestamps as receipt identity, preventing valid asynchronous BRC10 recovery.

## Goal

Accept an unchanged authenticated reclaim receipt after elapsed time while revalidating current eligibility, identity and evidence under the existing Task lock; retain tamper, ownership and publication fences.

## Scope

- In scope: reclaim effect, focused time/race/crash regressions, prerequisite research and workflow evidence.
- Out of scope: campaign integration, new Lease authority, schema migration, policy defaults, live reclaim.
- Taste constraints: <!-- advisory only, no run gate; default style/taste lives in AGENTS.md and the minimal-change policy, use this to record a per-task override -->

## Stop Conditions

- Stop and hand back to the parent if the change would require editing a path outside Allowed Paths.
- Stop if an Exit Criteria command cannot be run in this environment.
- Stop if Goal, Scope, or Exit Criteria are internally contradictory.

## Falsifier

A later valid consumption still refuses, or evidence/time/identity drift permits takeover. The focused regression must fail on the original effect.

## Root Cause Evidence

- root_cause: src/effects/state/coordination-lease-reclaim.ts compares a fresh receipt digest containing classified_at to the historical receipt, so elapsed time alone changes identity despite unchanged ownership and evidence.
- repro: bun test --timeout 60000 tests/unit/brc10-reclaim-time-boundary.test.ts
- regression_guard: tests/unit/brc10-reclaim-time-boundary.test.ts
- pre_fix_failure_artifact: .ai/harness/runs/brc10-reclaim-time-boundary.pre-fix.log

## Workflow Inventory

- Source plan: `plans/archive/plan-20260907-0507-brc10-reclaim-time-boundary.md`
- Deferred-goal ledger: `tasks/todos.md`
- Review file: `tasks/archive/review-20260907-0546-brc10-reclaim-time-boundary.md`
- Notes file: `tasks/archive/notes-20260907-0546-brc10-reclaim-time-boundary.md`
- Checks file: `.ai/harness/checks/latest.json`
- Run snapshots: `.ai/harness/runs/`
- Scope gate: edit only paths listed under `allowed_paths`; update this contract before widening scope.
- Completion gate: run `verify-sprint --prepare-acceptance`, record one typed AcceptanceReceipt under the frozen policy below, then run `verify-sprint`; review Markdown is projection only.

## Change Assessment

```json
{"protocol":1,"oracles":[{"id":"reclaim-time-and-generation","kind":"deterministic_test","paths":["src/effects/state/coordination-lease-reclaim.ts"]}]}
```

## Acceptance Policy

```json
{"protocol":2,"reviewer":"Codex","source":"codex-plugin","user_waiver":"allowed"}
```

## Allowed Paths

```yaml
allowed_paths:
  - src/effects/state/coordination-lease-reclaim.ts
  - tests/unit/brc10-reclaim-time-boundary.test.ts
  - docs/researches/20260907-brc10-readiness.md
  - docs/architecture/.projection-manifest.json
  - plans/archive/plan-20260907-0507-brc10-reclaim-time-boundary.md
  - tasks/todos.md
  - tasks/archive/contract-20260907-0546-brc10-reclaim-time-boundary.md
  - tasks/archive/review-20260907-0546-brc10-reclaim-time-boundary.md
  - tasks/archive/notes-20260907-0546-brc10-reclaim-time-boundary.md
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
    - tasks/archive/notes-20260907-0546-brc10-reclaim-time-boundary.md
```

## Verification Plan

```json
{
  "protocol": 1,
  "checks": [
    {
      "id": "focused-regression",
      "kind": "package_test",
      "path": "tests/unit/brc10-reclaim-time-boundary.test.ts",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Covers the changed behavior named by this contract.",
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
      "necessity": "Checks TypeScript contracts before behavioral verification.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "lease-substrate",
      "kind": "command",
      "command": "bun test --timeout 60000 tests/unit/lease-liveness.test.ts tests/unit/lease-liveness-store.test.ts tests/unit/lease-reclaim.test.ts",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Protect existing renewal, expiry and generation consumers.",
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
      "necessity": "Required integrity.",
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
      "necessity": "Required integrity.",
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
      "necessity": "Required integrity.",
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
      "necessity": "Required integrity.",
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
      "necessity": "Required integrity.",
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
      "necessity": "Required integrity.",
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

- This prerequisite retains #286 public types and on-disk record bytes. It does not close Sprint BRC10.
- No local full suite: named lease/store/concurrency tests cover the only production consumer change; required PR CI remains enforced.
- User delegated acceptance and PR merge explicitly; no live Lease will be mutated.

## Rollback Point

- Commit / checkpoint: main 2b611fc9.
- Revert strategy: revert this package; no data migration.
