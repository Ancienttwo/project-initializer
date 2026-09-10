> **Archived**: 2026-09-10 16:47
> **Related Plan**: plans/archive/plan-20260910-1621-brc-archive-integration-20260910.md
> **Outcome**: Completed
> **Lifecycle**: contract
> **Parent Run ID**: run-20260910-1647
> **Archive Projection V1**: `plans/plan-20260910-1621-brc-archive-integration-20260910.md` => `plans/archive/plan-20260910-1621-brc-archive-integration-20260910.md`
> **Archive Projection V1**: `tasks/notes/20260910-1621-brc-archive-integration-20260910.notes.md` => `tasks/archive/notes-20260910-1647-brc-archive-integration-20260910.md`
> **Archive Projection V1**: `tasks/contracts/20260910-1621-brc-archive-integration-20260910.contract.md` => `tasks/archive/contract-20260910-1647-brc-archive-integration-20260910.md`
> **Archive Projection V1**: `tasks/reviews/20260910-1621-brc-archive-integration-20260910.review.md` => `tasks/archive/review-20260910-1647-brc-archive-integration-20260910.md`

# Task Contract: brc-archive-integration-20260910

> **Status**: Fulfilled
> **Plan**: plans/archive/plan-20260910-1621-brc-archive-integration-20260910.md
> **Task Profile**: docs-only
> <!-- legal values: code-change | docs-only | ledger-closeout | migration | eval-only | delegated-run | bugfix (omit for legacy passthrough); see docs/reference-configs/sprint-contracts.md -->
> **Owner**: ancienttwo
> **Capability ID**: root
> **Last Updated**: 2026-09-10 16:21
> **Review File**: `tasks/archive/review-20260910-1647-brc-archive-integration-20260910.md`
> **Notes File**: `tasks/archive/notes-20260910-1647-brc-archive-integration-20260910.md`
> **Exemplar**: `docs/reference-configs/contract-brief-example.md`

## Why

Inactive branches retain useful history and a few uncommitted snapshots. Removing them without ancestry preservation loses discoverability; replaying superseded runtime trees would regress accepted behavior.

## Goal

Merge the 20 frozen inactive heads and seven uncommitted files into reachable history, preserve unique historical research, publish through required CI, and remove their refs/worktree directories while leaving the two active work locations untouched.

## Scope

- In scope: frozen Git ancestry, historical research/archive records, integration verification, branch and worktree cleanup.
- Out of scope: Operator and reconciliation WIP, runtime changes, provider/campaign execution, release, global configuration.
- Taste constraints: preserve current main production bytes and use explicit per-head provenance.

## Stop Conditions

- Stop and hand back to the parent if the change would require editing a path outside Allowed Paths.
- Stop if an Exit Criteria command cannot be run in this environment.
- Stop if Goal, Scope, or Exit Criteria are internally contradictory.

## Falsifier

A changed protected worktree, missing frozen ancestor, or product-path delta against the pinned target falsifies the consolidation. Check Git identity and content before publication or deletion.

## Root Cause Evidence

Not applicable: history and documentation consolidation.

## Workflow Inventory

- Source plan: `plans/archive/plan-20260910-1621-brc-archive-integration-20260910.md`
- Deferred-goal ledger: `tasks/todos.md`
- Review file: `tasks/archive/review-20260910-1647-brc-archive-integration-20260910.md`
- Notes file: `tasks/archive/notes-20260910-1647-brc-archive-integration-20260910.md`
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
  - docs/researches/
  - docs/architecture/.projection-manifest.json
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

This block contains only non-executable artifact requirements. Define every
executable check once in the canonical Verification Plan below. Each check must
state its phase, cost, evidence policy, necessity, and input environment; a
missing or malformed plan fails closed.

```yaml
exit_criteria:
  files_exist:
    - docs/researches/20260910-inactive-branch-consolidation.md
  artifacts_exist:
    - .ai/harness/checks/latest.json
    - tasks/archive/notes-20260910-1647-brc-archive-integration-20260910.md
```

## Verification Plan

```json
{
  "protocol": 1,
  "checks": [
    {
      "id": "deploy-sql-order",
      "kind": "command",
      "command": "bash scripts/check-deploy-sql-order.sh",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Required repository SQL ordering integrity.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "architecture-sync",
      "kind": "command",
      "command": "bash scripts/check-architecture-sync.sh",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Required architecture projection integrity.",
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
      "necessity": "Required digest-bound task artifact synchronization.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "task-workflow",
      "kind": "command",
      "command": "bash scripts/check-task-workflow.sh --strict",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Required workflow lifecycle integrity.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "project-state",
      "kind": "command",
      "command": "bun scripts/inspect-project-state.ts --repo . --format text",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Required repository state inspection.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "init-dry-run",
      "kind": "command",
      "command": "bun src/cli/index.ts init --repo . --dry-run",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Required installed contract dry-run parity.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "diff-whitespace",
      "kind": "command",
      "command": "git diff --check 3c570360543fe5b93378bec81c2a7d4f68f10663",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Reject malformed whitespace in integrated files.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "product-tree-preserved",
      "kind": "command",
      "command": "git diff --exit-code 3c570360543fe5b93378bec81c2a7d4f68f10663 -- src scripts assets deploy tests package.json bun.lock",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Prove superseded branches do not revert any production or test bytes.",
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

- Functional behavior: final source/test/package tree stays byte-identical to main@3c570360; newly reachable parents preserve legacy bytes.
- Edge cases: squash-merged refs and uncommitted historical snapshots remain recoverable, without reactivating old plans or grants.
- Regression risks: no executable delta; the eight named local checks plus required exact-head CI cover integration. No local full-suite run is justified.

## Rollback Point

- Commit / checkpoint: main@3c570360543fe5b93378bec81c2a7d4f68f10663.
- Revert strategy: revert integration publication to restore the tree; all frozen original commits remain reachable for recovery.
