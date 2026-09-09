> **Archived**: 2026-09-09 23:00
> **Related Plan**: plans/archive/plan-20260909-2241-campaign-not-planned-acceptance.md
> **Outcome**: Completed
> **Lifecycle**: contract
> **Parent Run ID**: run-20260909-2300
> **Archive Projection V1**: `plans/plan-20260909-2241-campaign-not-planned-acceptance.md` => `plans/archive/plan-20260909-2241-campaign-not-planned-acceptance.md`
> **Archive Projection V1**: `tasks/notes/20260909-2241-campaign-not-planned-acceptance.notes.md` => `tasks/archive/notes-20260909-2300-campaign-not-planned-acceptance.md`
> **Archive Projection V1**: `tasks/contracts/20260909-2241-campaign-not-planned-acceptance.contract.md` => `tasks/archive/contract-20260909-2300-campaign-not-planned-acceptance.md`
> **Archive Projection V1**: `tasks/reviews/20260909-2241-campaign-not-planned-acceptance.review.md` => `tasks/archive/review-20260909-2300-campaign-not-planned-acceptance.md`

# Task Contract: campaign-not-planned-acceptance

> **Status**: Fulfilled
> **Plan**: plans/archive/plan-20260909-2241-campaign-not-planned-acceptance.md
> **Task Profile**: bugfix
> <!-- legal values: code-change | docs-only | ledger-closeout | migration | eval-only | delegated-run | bugfix (omit for legacy passthrough); see docs/reference-configs/sprint-contracts.md -->
> **Owner**: ancienttwo
> **Capability ID**: root
> **Last Updated**: 2026-09-09 22:41
> **Review File**: `tasks/archive/review-20260909-2300-campaign-not-planned-acceptance.md`
> **Notes File**: `tasks/archive/notes-20260909-2300-campaign-not-planned-acceptance.md`
> **Exemplar**: `docs/reference-configs/contract-brief-example.md`

## Why

The close-not-planned consumer rejects canonical external_pass receipts, preventing the verified Issue178 falsifier from closing.

## Goal

Accept canonical external_pass and user_waiver receipts; reject noncanonical pass and reject before provider activity.

## Scope

- In scope: align the consumer with the existing receipt protocol and model-free regression.
- Out of scope:
  - receipt schema, CLI adaptation, waivers, campaign authority, budget caps, successor recovery, provider implementations and unrelated failures.
- Taste constraints: <!-- advisory only, no run gate; default style/taste lives in AGENTS.md and the minimal-change policy, use this to record a per-task override -->

## Stop Conditions

- Stop and hand back to the parent if the change would require editing a path outside Allowed Paths.
- Stop if an Exit Criteria command cannot be run in this environment.
- Stop if Goal, Scope, or Exit Criteria are internally contradictory.

## Falsifier

What observable evidence would prove this task's direction wrong, and the cheapest proof point to check first. Leave as-is if not applicable.

## Root Cause Evidence

- root_cause: campaign-not-planned.ts accepts pass while the canonical AcceptanceReceipt helper emits external_pass, passed unchanged by the CLI.
- repro: bun test --timeout 60000 tests/effects/campaign-closeout.test.ts --test-name-pattern not_planned
- regression_guard: tests/effects/campaign-closeout.test.ts
- pre_fix_failure_artifact: tasks/evidence/campaign-not-planned-acceptance-pre-fix.log

## Workflow Inventory

- Source plan: `plans/archive/plan-20260909-2241-campaign-not-planned-acceptance.md`
- Deferred-goal ledger: `tasks/todos.md`
- Review file: `tasks/archive/review-20260909-2300-campaign-not-planned-acceptance.md`
- Notes file: `tasks/archive/notes-20260909-2300-campaign-not-planned-acceptance.md`
- Checks file: `.ai/harness/checks/latest.json`
- Run snapshots: `.ai/harness/runs/`
- Scope gate: edit only paths listed under `allowed_paths`; update this contract before widening scope.
- Completion gate: run `verify-sprint --prepare-acceptance`, record one typed AcceptanceReceipt under the frozen policy below, then run `verify-sprint`; review Markdown is projection only.

## Change Assessment

```json
{"protocol": 1, "oracles": [{"id": "canonical-disposition", "kind": "deterministic_test", "paths": ["src/effects/automation/campaign-not-planned.ts", "tests/effects/campaign-closeout.test.ts", "docs/researches/20260909-campaign-not-planned-acceptance.md", "tasks/evidence/campaign-not-planned-acceptance-pre-fix.log", "docs/architecture/.projection-manifest.json"]}]}
```

## Acceptance Policy

```json
{"protocol":2,"reviewer":"Codex","source":"codex-plugin","user_waiver":"allowed"}
```

## Allowed Paths

```yaml
allowed_paths:
  - src/effects/automation/campaign-not-planned.ts
  - tests/effects/campaign-closeout.test.ts
  - docs/researches/20260909-campaign-not-planned-acceptance.md
  - tasks/evidence/campaign-not-planned-acceptance-pre-fix.log
  - docs/architecture/.projection-manifest.json
  - tasks/todos.md
  - plans/archive/plan-20260909-2241-campaign-not-planned-acceptance.md
  - tasks/archive/contract-20260909-2300-campaign-not-planned-acceptance.md
  - tasks/archive/review-20260909-2300-campaign-not-planned-acceptance.md
  - tasks/archive/notes-20260909-2300-campaign-not-planned-acceptance.md
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
    - docs/researches/20260909-campaign-not-planned-acceptance.md
  artifacts_exist:
    - .ai/harness/checks/latest.json
    - tasks/archive/notes-20260909-2300-campaign-not-planned-acceptance.md
```

## Verification Plan

```json
{
  "protocol": 1,
  "checks": [
    {
      "id": "closeout",
      "kind": "package_test",
      "path": "tests/effects/campaign-closeout.test.ts",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Verifies canonical and invalid acceptance dispositions through real closeout effects with model-free provider fixtures.",
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
      "necessity": "Required repository integrity and type boundary.",
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
      "necessity": "Required repository integrity and type boundary.",
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
      "necessity": "Required repository integrity and type boundary.",
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
      "necessity": "Required repository integrity and type boundary.",
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
      "necessity": "Required repository integrity and type boundary.",
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
      "necessity": "Required repository integrity and type boundary.",
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
      "necessity": "Required repository integrity and type boundary.",
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
