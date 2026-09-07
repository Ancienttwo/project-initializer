# Task Contract: brc14-fresh-audit-runtime

> **Status**: Active
> **Plan**: plans/plan-20260908-0418-brc14-fresh-audit-runtime.md
> **Task Profile**: code-change
> <!-- legal values: code-change | docs-only | ledger-closeout | migration | eval-only | delegated-run | bugfix (omit for legacy passthrough); see docs/reference-configs/sprint-contracts.md -->
> **Owner**: ancienttwo
> **Capability ID**: root
> **Last Updated**: 2026-09-08 04:18
> **Review File**: `tasks/reviews/20260908-0418-brc14-fresh-audit-runtime.review.md`
> **Notes File**: `tasks/notes/20260908-0418-brc14-fresh-audit-runtime.notes.md`
> **Exemplar**: `docs/reference-configs/contract-brief-example.md`

## Why

Fresh audit and group sequencing are missing after accepted BRC integration; generic transitions and repeated initial baselines cannot satisfy the Sprint.

## Goal

Implement complete group snapshot, budgeted fresh audit observation, shared-store acceptance gates and ordered group baseline consumption; preserve current unavailable exact-version boundary.

## Scope

- In scope: core/effect audit and group projection, audit budget operation, campaign CLI/store/authoring callers, focused tests and integration-base artifacts; user-authorized observer selection-policy and campaign-step capability-registry fixture alignment.
- Out of scope: GPT calls, BRC6a probes, main WIP, global install/release and fake trusted revision authority.

## Stop Conditions

- Stop and hand back to the parent if the change would require editing a path outside Allowed Paths.
- Stop if an Exit Criteria command cannot be run in this environment.
- Stop if Goal, Scope, or Exit Criteria are internally contradictory.

## Falsifier

Missing revision authority, stale or reused sessions, incomplete slot coverage, wrong SHA, skipping groups or a naked accept_group must never advance the campaign.

## Root Cause Evidence

Required when Task Profile is `bugfix`; leave as-is otherwise.

- root_cause: one sentence naming file:line/condition (testable, not "a state issue").
- repro: the command or UI path that reproduces the symptom.
- regression_guard: path to a test that fails on the unfixed code and passes after the fix (must also appear as a `package_test` check in Verification Plan).
- pre_fix_failure_artifact: path to a captured run of regression_guard on the UNFIXED code. Capture with `bun test <regression_guard> > <artifact> 2>&1; echo "PRE_FIX_EXIT=$?" >> <artifact>` (no pipes — pipes swallow the exit status). The gate requires a non-zero `PRE_FIX_EXIT=` line plus the regression_guard path string in the artifact (see the Root Cause Evidence Gate section in docs/reference-configs/sprint-contracts.md).

## Workflow Inventory

- Source plan: `plans/plan-20260908-0418-brc14-fresh-audit-runtime.md`
- Deferred-goal ledger: `tasks/todos.md`
- Review file: `tasks/reviews/20260908-0418-brc14-fresh-audit-runtime.review.md`
- Notes file: `tasks/notes/20260908-0418-brc14-fresh-audit-runtime.notes.md`
- Checks file: `.ai/harness/checks/latest.json`
- Run snapshots: `.ai/harness/runs/`
- Scope gate: edit only paths listed under `allowed_paths`; update this contract before widening scope.
- Completion gate: run `verify-sprint --prepare-acceptance`, record one typed AcceptanceReceipt under the frozen policy below, then run `verify-sprint`; review Markdown is projection only.

## Change Assessment

```json
{"protocol":1,"oracles":[{"id":"audit-regressions","kind":"deterministic_test","paths":["*"]}]}
```

## Acceptance Policy

```json
{"protocol":2,"reviewer":"Codex","source":"codex-review","user_waiver":"allowed"}
```

## Allowed Paths

```yaml
allowed_paths:
  - src/core/automation/
  - src/effects/automation/
  - src/cli/commands/campaign.ts
  - src/cli/chatgpt-browser/
  - tests/
  - docs/researches/
  - docs/repo-harness-chatgpt-browser-engine.md
  - docs/architecture/
  - .archcontext/
  - plans/
  - tasks/
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
    - docs/researches/20260908-brc14-fresh-audit-runtime.md
  artifacts_exist:
    - .ai/harness/checks/latest.json
    - tasks/notes/20260908-0418-brc14-fresh-audit-runtime.notes.md
```

## Verification Plan

```json
{
  "protocol": 1,
  "checks": [
    {
      "id": "audit-regressions",
      "kind": "command",
      "command": "bun test --timeout 60000 tests/unit/campaign-fresh-audit.test.ts tests/effects/campaign-fresh-audit.test.ts tests/effects/development-campaign-store.test.ts tests/effects/gpt-pro-issue-authoring.test.ts tests/cli/development-campaign.test.ts tests/cli/campaign-planning.test.ts tests/effects/issue-batch-shadow-budget.test.ts tests/effects/issue-batch-observer.test.ts tests/effects/campaign-planning.test.ts tests/effects/campaign-step.test.ts",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Covers audit/group consumer, authoring and provider-budget behavior or mandatory repository integrity.",
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
      "necessity": "Covers audit/group consumer, authoring and provider-budget behavior or mandatory repository integrity.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "integrity-0",
      "kind": "command",
      "command": "bash scripts/check-deploy-sql-order.sh",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Covers audit/group consumer, authoring and provider-budget behavior or mandatory repository integrity.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "integrity-1",
      "kind": "command",
      "command": "bash scripts/check-architecture-sync.sh",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Covers audit/group consumer, authoring and provider-budget behavior or mandatory repository integrity.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "integrity-2",
      "kind": "command",
      "command": "bash scripts/check-task-sync.sh",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Covers audit/group consumer, authoring and provider-budget behavior or mandatory repository integrity.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "integrity-3",
      "kind": "command",
      "command": "bash scripts/check-task-workflow.sh --strict",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Covers audit/group consumer, authoring and provider-budget behavior or mandatory repository integrity.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "integrity-4",
      "kind": "command",
      "command": "bun scripts/inspect-project-state.ts --repo . --format text",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Covers audit/group consumer, authoring and provider-budget behavior or mandatory repository integrity.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "integrity-5",
      "kind": "command",
      "command": "bun src/cli/index.ts init --repo . --dry-run",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Covers audit/group consumer, authoring and provider-budget behavior or mandatory repository integrity.",
      "inputs": {
        "env": []
      }
    }
  ]
}
```

## Acceptance Notes (Human Review)

- Functional behavior:
- Edge cases:
- Regression risks:

## Rollback Point

- Commit / checkpoint:
- Revert strategy:
