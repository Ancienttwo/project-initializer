> **Archived**: 2026-09-08 19:29
> **Related Plan**: plans/archive/plan-20260908-1851-worktree-cleanup-closeout.md
> **Outcome**: Completed
> **Lifecycle**: contract
> **Parent Run ID**: run-20260908-1929
> **Archive Projection V1**: `plans/plan-20260908-1851-worktree-cleanup-closeout.md` => `plans/archive/plan-20260908-1851-worktree-cleanup-closeout.md`
> **Archive Projection V1**: `tasks/notes/20260908-1851-worktree-cleanup-closeout.notes.md` => `tasks/archive/notes-20260908-1929-worktree-cleanup-closeout.md`
> **Archive Projection V1**: `tasks/contracts/20260908-1851-worktree-cleanup-closeout.contract.md` => `tasks/archive/contract-20260908-1929-worktree-cleanup-closeout.md`
> **Archive Projection V1**: `tasks/reviews/20260908-1851-worktree-cleanup-closeout.review.md` => `tasks/archive/review-20260908-1929-worktree-cleanup-closeout.md`

# Task Contract: worktree-cleanup-closeout

> **Status**: Fulfilled
> **Plan**: plans/archive/plan-20260908-1851-worktree-cleanup-closeout.md
> **Task Profile**: bugfix
> <!-- legal values: code-change | docs-only | ledger-closeout | migration | eval-only | delegated-run | bugfix (omit for legacy passthrough); see docs/reference-configs/sprint-contracts.md -->
> **Owner**: ancienttwo
> **Capability ID**: root
> **Last Updated**: 2026-09-08 18:52
> **Review File**: `tasks/archive/review-20260908-1929-worktree-cleanup-closeout.md`
> **Notes File**: `tasks/archive/notes-20260908-1929-worktree-cleanup-closeout.md`
> **Exemplar**: `docs/reference-configs/contract-brief-example.md`

## Why

合并后 cleanup 失败不能伪装成完整收尾；单个 dirty worktree 不应阻止批量处理其余安全项。

## Goal

实现已批准计划的合并后清理状态、逐项批量清理与安全回归，保留 publication 和用户 WIP。

## Scope

- In scope: 两个 shell helper 及下游模板、SessionStart 提示、聚焦回归与流程文档。
- In scope (owner approved continuation): preserve primary projection WIP, synchronize main, merge this accepted task locally and clean its worktree.
- Out of scope: 历史目录批量清理、远程推送与发布、新清理策略或状态库。

## Stop Conditions

- Stop and hand back to the parent if the change would require editing a path outside Allowed Paths.
- Stop if an Exit Criteria command cannot be run in this environment.
- Stop if Goal, Scope, or Exit Criteria are internally contradictory.

## Falsifier

若临时 Git fixture 中 cleanup 拒绝后 finish 已返回非零，或 dirty 首项之后安全项仍被清理，则对应假设不成立。

## Root Cause Evidence

- root_cause: scripts/contract-worktree.sh finish 的 cleanup else 仅 echo，吞没失败；scripts/ship-worktrees.sh cleanup_merged 对单项 guard 失败 exit 1 终止整批。
- repro: bun test tests/contract-worktree-single-publication.test.ts tests/contract-worktree-squash-cleanup.test.ts --test-name-pattern cleanup-closeout
- regression_guard: tests/contract-worktree-squash-cleanup.test.ts
- pre_fix_failure_artifact: .ai/harness/runs/worktree-cleanup-closeout-red.log

## Workflow Inventory

- Source plan: `plans/archive/plan-20260908-1851-worktree-cleanup-closeout.md`
- Deferred-goal ledger: `tasks/todos.md`
- Review file: `tasks/archive/review-20260908-1929-worktree-cleanup-closeout.md`
- Notes file: `tasks/archive/notes-20260908-1929-worktree-cleanup-closeout.md`
- Checks file: `.ai/harness/checks/latest.json`
- Run snapshots: `.ai/harness/runs/`
- Scope gate: edit only paths listed under `allowed_paths`; update this contract before widening scope.
- Completion gate: run `verify-sprint --prepare-acceptance`, record one typed AcceptanceReceipt under the frozen policy below, then run `verify-sprint`; review Markdown is projection only.

## Change Assessment

```json
{"protocol":1,"oracles":[{"id":"cleanup-focused-and-integrity","kind":"deterministic_test","paths":["*"]}]}
```

## Acceptance Policy

```json
{"protocol":2,"reviewer":"Codex","source":"codex-plugin","user_waiver":"allowed"}
```

## Allowed Paths

```yaml
allowed_paths:
  - docs/architecture/.projection-manifest.json
  - tasks/todos.md
  - scripts/contract-worktree.sh
  - scripts/ship-worktrees.sh
  - assets/templates/helpers/contract-worktree.sh
  - assets/templates/helpers/ship-worktrees.sh
  - src/cli/hook/session-context.ts
  - tests/contract-worktree-single-publication.test.ts
  - tests/contract-worktree-squash-cleanup.test.ts
  - tests/helper-scripts.test.ts
  - tests/session-context.test.ts
  - docs/reference-configs/agentic-development-flow.md
  - plans/archive/plan-20260908-1851-worktree-cleanup-closeout.md
  - tasks/archive/contract-20260908-1929-worktree-cleanup-closeout.md
  - tasks/archive/review-20260908-1929-worktree-cleanup-closeout.md
  - tasks/archive/notes-20260908-1929-worktree-cleanup-closeout.md
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
    - tasks/archive/notes-20260908-1929-worktree-cleanup-closeout.md
```

## Verification Plan

```json
{
  "protocol": 1,
  "checks": [
    {
      "id": "publication",
      "kind": "package_test",
      "path": "tests/contract-worktree-single-publication.test.ts",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "baseline_with_delta",
      "necessity": "Real Git regression for cleanup failure, publication preservation and safe batch continuation.",
      "inputs": {
        "env": []
      },
      "baseline": {
        "run_file": ".ai/harness/runs/verification-vx-a8336ff6cbe342b4bd51.json",
        "execution_id": "vx-a8336ff6cbe342b4bd51"
      },
      "delta_checks": [
        "cleanup-byte-parity",
        "task-sync",
        "architecture",
        "workflow",
        "inspect",
        "init"
      ]
    },
    {
      "id": "batch",
      "kind": "package_test",
      "path": "tests/contract-worktree-squash-cleanup.test.ts",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "baseline_with_delta",
      "necessity": "Real Git regression for cleanup failure, publication preservation and safe batch continuation.",
      "inputs": {
        "env": []
      },
      "baseline": {
        "run_file": ".ai/harness/runs/verification-vx-f0d4ec316dae441ba9b0.json",
        "execution_id": "vx-f0d4ec316dae441ba9b0"
      },
      "delta_checks": [
        "cleanup-byte-parity",
        "task-sync",
        "architecture",
        "workflow",
        "inspect",
        "init"
      ]
    },
    {
      "id": "helper",
      "kind": "command",
      "command": "bun test --timeout 60000 tests/helper-scripts.test.ts --test-name-pattern ship-worktrees",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "baseline_with_delta",
      "necessity": "Existing ship cleanup and scaffold protections.",
      "inputs": {
        "env": []
      },
      "baseline": {
        "run_file": ".ai/harness/runs/verification-vx-576ee2f140d34e2d9a18.json",
        "execution_id": "vx-576ee2f140d34e2d9a18"
      },
      "delta_checks": [
        "cleanup-byte-parity",
        "task-sync",
        "architecture",
        "workflow",
        "inspect",
        "init"
      ]
    },
    {
      "id": "session",
      "kind": "command",
      "command": "bun test --timeout 60000 tests/session-context.test.ts --test-name-pattern worktree",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "baseline_with_delta",
      "necessity": "SessionStart guidance matches cleanup semantics.",
      "inputs": {
        "env": []
      },
      "baseline": {
        "run_file": ".ai/harness/runs/verification-vx-dba4a01e6bf244a589cc.json",
        "execution_id": "vx-dba4a01e6bf244a589cc"
      },
      "delta_checks": [
        "cleanup-byte-parity",
        "task-sync",
        "architecture",
        "workflow",
        "inspect",
        "init"
      ]
    },
    {
      "id": "template-finish",
      "kind": "command",
      "command": "cmp scripts/contract-worktree.sh assets/templates/helpers/contract-worktree.sh",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Downstream parity.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "template-ship",
      "kind": "command",
      "command": "cmp scripts/ship-worktrees.sh assets/templates/helpers/ship-worktrees.sh",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Downstream parity.",
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
      "necessity": "Required repository integrity check for substantive changes.",
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
      "necessity": "Required repository integrity check for substantive changes.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "task-sync",
      "kind": "command",
      "command": "REPO_HARNESS_DIFF_BASE=ba09b548842790dab66cdcfbebcf4003816f249e bash scripts/check-task-sync.sh",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Required repository integrity check for substantive changes.",
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
      "necessity": "Required repository integrity check for substantive changes.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "inspect",
      "kind": "command",
      "command": "bun scripts/inspect-project-state.ts --repo . --format text",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Required repository integrity check for substantive changes.",
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
      "necessity": "Required repository integrity check for substantive changes.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "cleanup-byte-parity",
      "kind": "command",
      "command": "git diff --exit-code 2937544f558a9cd4aefab4edf86f17ad2b8570ba -- src scripts assets tests package.json bun.lock .ai/harness/policy.json .ai/harness/workflow-contract.json",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Proves implementation, tests, dependencies and policy unchanged from passing integration baseline; remaining delta is workflow evidence and generated provenance.",
      "inputs": {
        "env": []
      }
    }
  ]
}
```

## Acceptance Notes (Human Review)

- Integration baseline: run-20260908T192329-58384-20260908-1851-worktree-cleanup-closeout.json at 2937544f. Publication, batch, helper and session tests passed with immutable per-check execution records; later integrity evidence was invalidated by a notes-only digest update during the run. The failed overall run is retained and is not called a passing acceptance.
- Reuse only its four successful test records through baseline_with_delta. The current cleanup-byte-parity check covers src/scripts/assets/tests, dependencies and policy against that baseline, while all six required integrity checks and template parity execute on the current snapshot. No source or regression changed after those passing executions; no full suite is justified.
- Owner approved primary WIP preservation, main synchronization and local merge/cleanup of this task. Historical batch cleanup and remote release remain outside scope.

## Rollback Point

- Checkpoint: a1393e44.
- Revert this work-package code; never abort or roll back already published user task commits after cleanup failure.
