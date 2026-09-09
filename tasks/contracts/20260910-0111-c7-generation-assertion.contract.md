# Task Contract: c7-generation-assertion

> **Status**: Active
> **Plan**: plans/plan-20260910-0111-c7-generation-assertion.md
> **Task Profile**: bugfix
> <!-- legal values: code-change | docs-only | ledger-closeout | migration | eval-only | delegated-run | bugfix (omit for legacy passthrough); see docs/reference-configs/sprint-contracts.md -->
> **Owner**: ancienttwo
> **Capability ID**: root
> **Last Updated**: 2026-09-10 01:11
> **Review File**: `tasks/reviews/20260910-0111-c7-generation-assertion.review.md`
> **Notes File**: `tasks/notes/20260910-0111-c7-generation-assertion.notes.md`
> **Exemplar**: `docs/reference-configs/contract-brief-example.md`

## Why

C7 treats decimal lease generation as a substring of serialized JSON, falsely matching an unrelated legitimate SHA256.

## Goal

Retain public-surface execution-authority exclusion while allowing legitimate digests containing the digits 4242.

## Scope

- In scope: test-only structured generation assertion, deterministic collision/sensitivity regression, workflow evidence.
- Out of scope: runtime collaboration or campaign behavior, new grants or provider calls during this repair.

## Stop Conditions

- Stop and hand back to the parent if the change would require editing a path outside Allowed Paths.
- Stop if an Exit Criteria command cannot be run in this environment.
- Stop if Goal, Scope, or Exit Criteria are internally contradictory.

## Falsifier

A legitimate digest containing 4242 fails, or an actual nested numeric/string forged lease generation passes.

## Root Cause Evidence

- root_cause: tests/cli/collaboration.test.ts:307 searches String(FORGED_LEASE_GENERATION) inside the entire JSON payload; a legitimate signal SHA contains 4242.
- repro: bun test --timeout 60000 tests/cli/collaboration.test.ts --test-name-pattern "generation assertion"
- regression_guard: tests/cli/collaboration.test.ts
- pre_fix_failure_artifact: tasks/evidence/c7-generation-assertion-pre-fix.log

## Workflow Inventory

- Source plan: `plans/plan-20260910-0111-c7-generation-assertion.md`
- Deferred-goal ledger: `tasks/todos.md`
- Review file: `tasks/reviews/20260910-0111-c7-generation-assertion.review.md`
- Notes file: `tasks/notes/20260910-0111-c7-generation-assertion.notes.md`
- Checks file: `.ai/harness/checks/latest.json`
- Run snapshots: `.ai/harness/runs/`
- Scope gate: edit only paths listed under `allowed_paths`; update this contract before widening scope.
- Completion gate: run `verify-sprint --prepare-acceptance`, record one typed AcceptanceReceipt under the frozen policy below, then run `verify-sprint`; review Markdown is projection only.

## Change Assessment

```json
{"protocol": 1, "oracles": [{"id": "c7-structured-generation", "kind": "deterministic_test", "paths": ["*"]}]}
```

## Acceptance Policy

```json
{"protocol":2,"reviewer":"Codex","source":"codex-plugin","user_waiver":"allowed"}
```

## Allowed Paths

```yaml
allowed_paths:
  - tests/cli/collaboration.test.ts
  - src/cli/commands/campaign.ts
  - src/effects/automation/campaign-authoring-resume.ts
  - src/effects/automation/campaign-planning-store.ts
  - src/effects/automation/campaign-worker.ts
  - src/effects/automation/gpt-pro-issue-authoring.ts
  - tests/effects/campaign-settled-resume.test.ts
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
    - docs/researches/20260910-c7-generation-assertion.md
  artifacts_exist:
    - tasks/evidence/c7-generation-assertion-pre-fix.log
```

## Verification Plan

```json
{
  "protocol": 1,
  "checks": [
    {
      "id": "c7-cli",
      "kind": "package_test",
      "path": "tests/cli/collaboration.test.ts",
      "necessity": "Exact false-positive regression and retained C7 CLI security behavior.",
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

- PR385 baseline b75ba6fd contains the accepted settled-resume implementation. CI34376981934 failed only the C7 substring assertion; recovery regressions passed. This correction changes only test semantics and workflow evidence, with focused C7 coverage plus mandatory integrity checks. Do not relabel the old CI run as a full pass for the new subject.
- Earlier PR source paths remain allowed solely as the accepted composite PR baseline; no source edits are planned.

## Rollback Point

- Revert the test-only correction; the accepted campaign recovery source is unchanged.

