# Task Contract: campaign-acquisition-cap

> **Status**: Active
> **Plan**: plans/plan-20260910-0159-campaign-acquisition-cap.md
> **Task Profile**: bugfix
> <!-- legal values: code-change | docs-only | ledger-closeout | migration | eval-only | delegated-run | bugfix (omit for legacy passthrough); see docs/reference-configs/sprint-contracts.md -->
> **Owner**: ancienttwo
> **Capability ID**: root
> **Last Updated**: 2026-09-10 01:59
> **Review File**: `tasks/reviews/20260910-0159-campaign-acquisition-cap.review.md`
> **Notes File**: `tasks/notes/20260910-0159-campaign-acquisition-cap.notes.md`
> **Exemplar**: `docs/reference-configs/contract-brief-example.md`

## Why

Campaign acquisition equality currently seals a global stop before the acquired work can dispatch.

## Goal

Enforce the original acquisition cap while allowing acquired campaign work to complete under remaining limits.

## Scope

- In scope: campaign-only acquisition exhaustion and refusal semantics; model-free budget regressions.
- Out of scope: higher caps, historical receipt migration, non-campaign semantics, provider execution during repair.

## Stop Conditions

- Stop and hand back to the parent if the change would require editing a path outside Allowed Paths.
- Stop if an Exit Criteria command cannot be run in this environment.
- Stop if Goal, Scope, or Exit Criteria are internally contradictory.

## Falsifier

A cap1 campaign either admits a second acquisition or refuses its subsequent dispatch solely because acquisitions equal1.

## Root Cause Evidence

- root_cause: budget-store.ts exhaustionRefusal globally stops campaigns on acquisition equality; reserveAutomationBudgetAdmission also seals acquisition-only refusals.
- repro: bun test tests/effects/campaign-acquisition-cap.test.ts
- regression_guard: tests/effects/campaign-acquisition-cap.test.ts
- pre_fix_failure_artifact: tasks/evidence/campaign-acquisition-cap-pre-fix.log

## Workflow Inventory

- Source plan: `plans/plan-20260910-0159-campaign-acquisition-cap.md`
- Deferred-goal ledger: `tasks/todos.md`
- Review file: `tasks/reviews/20260910-0159-campaign-acquisition-cap.review.md`
- Notes file: `tasks/notes/20260910-0159-campaign-acquisition-cap.notes.md`
- Checks file: `.ai/harness/checks/latest.json`
- Run snapshots: `.ai/harness/runs/`
- Scope gate: edit only paths listed under `allowed_paths`; update this contract before widening scope.
- Completion gate: run `verify-sprint --prepare-acceptance`, record one typed AcceptanceReceipt under the frozen policy below, then run `verify-sprint`; review Markdown is projection only.

## Change Assessment

```json
{"protocol": 1, "oracles": [{"id": "campaign-acquisition-budget", "kind": "deterministic_test", "paths": ["*"]}]}
```

## Acceptance Policy

```json
{"protocol":2,"reviewer":"Codex","source":"codex-plugin","user_waiver":"allowed"}
```

## Allowed Paths

```yaml
allowed_paths:
  - src/effects/automation/budget-store.ts
  - tests/effects/campaign-acquisition-cap.test.ts
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
    - docs/researches/20260910-campaign-acquisition-cap.md
  artifacts_exist:
    - tasks/evidence/campaign-acquisition-cap-pre-fix.log
```

## Verification Plan

```json
{
  "protocol": 1,
  "checks": [
    {
      "id": "acquisition",
      "kind": "package_test",
      "path": "tests/effects/campaign-acquisition-cap.test.ts",
      "necessity": "Campaign cap completion and preserved historical/non-campaign/serialized budget enforcement.",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "budget-core",
      "kind": "package_test",
      "path": "tests/unit/issue-282-automation-budget-core.test.ts",
      "necessity": "Campaign cap completion and preserved historical/non-campaign/serialized budget enforcement.",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "budget-store",
      "kind": "package_test",
      "path": "tests/unit/issue-282-automation-budget-store.test.ts",
      "necessity": "Campaign cap completion and preserved historical/non-campaign/serialized budget enforcement.",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "budget-contention",
      "kind": "package_test",
      "path": "tests/unit/issue-282-automation-budget-contention.test.ts",
      "necessity": "Campaign cap completion and preserved historical/non-campaign/serialized budget enforcement.",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "settled-resume",
      "kind": "package_test",
      "path": "tests/effects/campaign-settled-resume.test.ts",
      "necessity": "Campaign cap completion and preserved historical/non-campaign/serialized budget enforcement.",
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

PR385 recovery, C7 and shadow fixture deltas are accepted baselines. This slice verifies only the new campaign acquisition behavior plus named affected regression suites. No local full suite; no historical stop receipt reopened.

## Rollback Point

Revert the acquisition-cap delta; retain all persisted historical stop receipts.
