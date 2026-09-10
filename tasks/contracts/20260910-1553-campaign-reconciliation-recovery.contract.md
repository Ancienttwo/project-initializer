# Task Contract: campaign-reconciliation-recovery

> **Status**: Active
> **Plan**: plans/plan-20260910-1553-campaign-reconciliation-recovery.md
> **Task Profile**: bugfix
> <!-- legal values: code-change | docs-only | ledger-closeout | migration | eval-only | delegated-run | bugfix (omit for legacy passthrough); see docs/reference-configs/sprint-contracts.md -->
> **Owner**: ancienttwo
> **Capability ID**: runtime-harness-automation-budget
> **Last Updated**: 2026-09-10 15:54
> **Review File**: `tasks/reviews/20260910-1553-campaign-reconciliation-recovery.review.md`
> **Notes File**: `tasks/notes/20260910-1553-campaign-reconciliation-recovery.notes.md`
> **Exemplar**: `docs/reference-configs/contract-brief-example.md`

## Why

Malformed reconciliation input currently leaves an immutable decision that cannot be consumed. An expired campaign cannot acknowledge a formal stop, blocking a quiescent continuation without preserving an operator exit.

## Goal

Reject invalid reconciliation input before publishing authority; recover an existing invalid evidence record once through a hash-bound operator command while retaining all original bytes and charge semantics; permit an explicit expired-to-stopped acknowledgment without reopening execution.

## Scope

- In scope: budget reconciliation preparation, audited evidence repair, terminal projection preservation, expired-to-stopped campaign event, focused regression tests and an operator runbook.
- Out of scope: live canary/grant/reservation writes during development; Oracle/browser changes; provider calls; new grants/Issues; worker/verifier reruns; deploy/release.
- Keep immutable original records, the existing continuation gate, and manual live source activation boundaries.

## Stop Conditions

- Stop and hand back to the parent if the change would require editing a path outside Allowed Paths.
- Stop if an Exit Criteria command cannot be run in this environment.
- Stop if Goal, Scope, or Exit Criteria are internally contradictory.

## Falsifier

If malformed input can already be corrected through an ordinary exact replay without changing immutable authority, or stop after expiry can reopen provider work, this design is wrong. Real-store RED tests and the terminal-transition matrix are the first proof points.

## Root Cause Evidence

- root_cause: budget-store.ts reconcileAutomationReservation publishes the immutable reconciliation before commitUsage seals/validates evidence; commitUsage also clears an existing exhaustion receipt from its next projection. development-campaign.ts excludes authorization_expired from stop without a terminal acknowledgment path.
- repro: bun test tests/unit/issue-282-automation-budget-store.test.ts tests/unit/development-campaign-core.test.ts --test-name-pattern recovery
- regression_guard: tests/unit/issue-282-automation-budget-store.test.ts
- pre_fix_failure_artifact: tasks/evidence/campaign-reconciliation-recovery-pre-fix.log

## Workflow Inventory

- Source plan: `plans/plan-20260910-1553-campaign-reconciliation-recovery.md`
- Deferred-goal ledger: `tasks/todos.md`
- Review file: `tasks/reviews/20260910-1553-campaign-reconciliation-recovery.review.md`
- Notes file: `tasks/notes/20260910-1553-campaign-reconciliation-recovery.notes.md`
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
  - AGENTS.md
  - CLAUDE.md
  - .ai/context/context-map.json
  - docs/architecture/requests/runtime-harness-automation-budget.md
  - .archcontext/model/nodes/capability.runtime-harness.automation-budget.yaml
  - .archcontext/model/flows/flow.automation-budget.reserve-before-act.yaml
  - src/effects/automation/budget-store.ts
  - src/cli/commands/automation.ts
  - src/core/automation/development-campaign.ts
  - tests/unit/issue-282-automation-budget-store.test.ts
  - tests/unit/development-campaign-core.test.ts
  - tests/effects/development-campaign-store.test.ts
  - tests/effects/campaign-authoring-resume.test.ts
  - docs/architecture/changelog.md
  - docs/architecture/decisions/index.md
  - docs/architecture/diagrams/architecture.likec4
  - docs/architecture/diagrams/architecture.mmd
  - docs/architecture/diagrams/architecture.structurizr.json
  - docs/architecture/index.md
  - docs/architecture/.projection-manifest.json
  - docs/architecture/modules/runtime-harness/automation-budget.md
  - docs/researches/20260910-reconciliation-recovery.md
  - tasks/evidence/campaign-reconciliation-recovery-pre-fix.log
  - plans/plan-20260910-1553-campaign-reconciliation-recovery.md
  - tasks/contracts/20260910-1553-campaign-reconciliation-recovery.contract.md
  - tasks/reviews/20260910-1553-campaign-reconciliation-recovery.review.md
  - tasks/notes/20260910-1553-campaign-reconciliation-recovery.notes.md
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
    - docs/researches/20260910-reconciliation-recovery.md
    - tasks/evidence/campaign-reconciliation-recovery-pre-fix.log
  artifacts_exist:
    - .ai/harness/checks/latest.json
```

## Verification Plan

```json
{
  "protocol": 1,
  "checks": [
    {
      "id": "budget-store",
      "kind": "package_test",
      "path": "tests/unit/issue-282-automation-budget-store.test.ts",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Covers the changed reconciliation, replay, locking, terminal or continuation contract.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "budget-core",
      "kind": "package_test",
      "path": "tests/unit/issue-282-automation-budget-core.test.ts",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Covers the changed reconciliation, replay, locking, terminal or continuation contract.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "budget-contention",
      "kind": "package_test",
      "path": "tests/unit/issue-282-automation-budget-contention.test.ts",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Covers the changed reconciliation, replay, locking, terminal or continuation contract.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "budget-driver-e2e",
      "kind": "package_test",
      "path": "tests/unit/issue-282-automation-budget-e2e.test.ts",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Capability-declared reserve-act-append driver proves late settlement cannot reopen the next acquisition and the operator projects the same stop receipt.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "campaign-core",
      "kind": "package_test",
      "path": "tests/unit/development-campaign-core.test.ts",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Covers the changed reconciliation, replay, locking, terminal or continuation contract.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "campaign-store",
      "kind": "package_test",
      "path": "tests/effects/development-campaign-store.test.ts",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Covers the changed reconciliation, replay, locking, terminal or continuation contract.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "campaign-resume",
      "kind": "package_test",
      "path": "tests/effects/campaign-authoring-resume.test.ts",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Covers the changed reconciliation, replay, locking, terminal or continuation contract.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "campaign-cli",
      "kind": "package_test",
      "path": "tests/cli/development-campaign.test.ts",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Covers the changed reconciliation, replay, locking, terminal or continuation contract.",
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
      "necessity": "Required repository integrity or TypeScript contract check.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "sql-order",
      "kind": "command",
      "command": "bash scripts/check-deploy-sql-order.sh",
      "cwd": ".",
      "phase": "preflight",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Required repository integrity or TypeScript contract check.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "architecture-sync",
      "kind": "command",
      "command": "bash scripts/check-architecture-sync.sh",
      "cwd": ".",
      "phase": "preflight",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Required repository integrity or TypeScript contract check.",
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
      "necessity": "Required repository integrity or TypeScript contract check.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "task-workflow",
      "kind": "command",
      "command": "bash scripts/check-task-workflow.sh --strict",
      "cwd": ".",
      "phase": "preflight",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Required repository integrity or TypeScript contract check.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "inspect-state",
      "kind": "command",
      "command": "bun scripts/inspect-project-state.ts --repo . --format text",
      "cwd": ".",
      "phase": "preflight",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Required repository integrity or TypeScript contract check.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "adoption-dry-run",
      "kind": "command",
      "command": "bun src/cli/index.ts init --repo . --dry-run",
      "cwd": ".",
      "phase": "preflight",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Required repository integrity or TypeScript contract check.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "projection-hooks",
      "kind": "command",
      "command": "bun run check:hooks",
      "cwd": ".",
      "phase": "preflight",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Required source and generated projection parity from current AGENTS.md.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "projection-helpers",
      "kind": "command",
      "command": "bun run check:helpers",
      "cwd": ".",
      "phase": "preflight",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Required source and generated projection parity from current AGENTS.md.",
      "inputs": {
        "env": []
      }
    }
  ]
}
```

## Acceptance Notes (Human Review)

- Source baseline: 3c570360. Existing live stores remain untouched during implementation.
- Isolated research already reproduced the malformed-record deadlock; canonical RED evidence was captured on this worktree before production edits.
- Named accounting, campaign and CLI fixtures cover the changed boundaries; no local full-suite requirement. CI remains a separate source activation boundary.
- No dependencies are added. The repair receipt is an exceptional audit record, not a parallel charge authority; usage events remain the single accounting authority.

## Rollback Point

- Baseline: 3c570360.
- Revert source changes before activation. After an operator repair, original records and the new charge/repair receipt are retained; rollback never refunds or deletes ledger history.
