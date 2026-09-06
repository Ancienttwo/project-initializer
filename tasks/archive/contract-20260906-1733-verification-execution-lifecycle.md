> **Archived**: 2026-09-06 17:33
> **Related Plan**: plans/archive/plan-20260906-0447-verification-execution-lifecycle.md
> **Outcome**: Completed
> **Lifecycle**: contract
> **Parent Run ID**: run-20260906-1733
> **Archive Projection V1**: `plans/plan-20260906-0447-verification-execution-lifecycle.md` => `plans/archive/plan-20260906-0447-verification-execution-lifecycle.md`
> **Archive Projection V1**: `tasks/notes/20260906-0447-verification-execution-lifecycle.notes.md` => `tasks/archive/notes-20260906-1733-verification-execution-lifecycle.md`
> **Archive Projection V1**: `tasks/contracts/20260906-0447-verification-execution-lifecycle.contract.md` => `tasks/archive/contract-20260906-1733-verification-execution-lifecycle.md`
> **Archive Projection V1**: `tasks/reviews/20260906-0447-verification-execution-lifecycle.review.md` => `tasks/archive/review-20260906-1733-verification-execution-lifecycle.md`

# Task Contract: verification-execution-lifecycle

> **Status**: Fulfilled
> **Plan**: plans/archive/plan-20260906-0447-verification-execution-lifecycle.md
> **Task Profile**: bugfix
> <!-- legal values: code-change | docs-only | ledger-closeout | migration | eval-only | delegated-run | bugfix (omit for legacy passthrough); see docs/reference-configs/sprint-contracts.md -->
> **Owner**: ancienttwo
> **Capability ID**: root
> **Last Updated**: 2026-09-06 10:19
> **Review File**: `tasks/archive/review-20260906-1733-verification-execution-lifecycle.md`
> **Notes File**: `tasks/archive/notes-20260906-1733-verification-execution-lifecycle.md`
> **Exemplar**: `docs/reference-configs/contract-brief-example.md`

## Why

昂贵测试执行与证据消费混在多个入口，done hook 可无缓存重跑，main/文案变化使已完成执行被重复付费。验收重绑定必须保留真实测试事实与 exact publication fence。

## Goal

完成已批准的 verification-execution-lifecycle 计划：单一 typed executable plan、唯一 executor、reader-only done/finalize、实际执行锁、历史 baseline 与 current integration 分离、一次性 schema migration 和 CI preflight 前置。

## Scope

- In scope: user-approved acceptance blocker follow-up (tmux fixture socket alignment and prepare readback); approved plan 中的 contract schema、execution/evidence、done、acceptance/merge、模板迁移和CI preflight；对应回归与包装读回。
- Out of scope: CI importer、全量并发调优、跨仓库缓存、无关业务测试及其他worktree。
- Taste constraints: <!-- advisory only, no run gate; default style/taste lives in AGENTS.md and the minimal-change policy, use this to record a per-task override -->

## Stop Conditions

- Stop and hand back to the parent if the change would require editing a path outside Allowed Paths.
- Stop if an Exit Criteria command cannot be run in this environment.
- Stop if Goal, Scope, or Exit Criteria are internally contradictory.

## Falsifier

若同一有效 baseline 下 done/direct/prepare 重试仍增加 expensive counter，或旧 baseline 被当成新源码 full pass，本方向实现即失败。最小证明是 tests/prompt-handler.test.ts 的 done counter 红测及隔离 Git执行矩阵。

## Root Cause Evidence

Required when Task Profile is `bugfix`; leave as-is otherwise.

- root_cause: src/cli/hook/prompt-handler.ts done gate calls executable verify-contract before consuming existing evidence; verify-contract without injected context disables cache and re-executes commands.
- repro: bun test tests/prompt-handler.test.ts --test-name-pattern 'done with fresh contract'
- regression_guard: tests/prompt-handler.test.ts
- pre_fix_failure_artifact: .ai/harness/evidence/pre-fix/verification-execution-lifecycle.log

## Workflow Inventory

- Source plan: `plans/archive/plan-20260906-0447-verification-execution-lifecycle.md`
- Deferred-goal ledger: `tasks/todos.md`
- Review file: `tasks/archive/review-20260906-1733-verification-execution-lifecycle.md`
- Notes file: `tasks/archive/notes-20260906-1733-verification-execution-lifecycle.md`
- Checks file: `.ai/harness/checks/latest.json`
- Run snapshots: `.ai/harness/runs/`
- Scope gate: edit only paths listed under `allowed_paths`; update this contract before widening scope.
- Completion gate: run `verify-sprint --prepare-acceptance`, record one typed AcceptanceReceipt under the frozen policy below, then run `verify-sprint`; review Markdown is projection only.

## Change Assessment

```json
{"protocol":1,"oracles":[{"id":"verification-execution-regressions","kind":"deterministic_test","paths":["*"]},{"id":"package-default-readback","kind":"runtime_readback","paths":["*"]}]}
```

## Acceptance Policy

```json
{"protocol":2,"reviewer":"Codex","source":"codex-plugin","user_waiver":"allowed"}
```

## Allowed Paths

```yaml
allowed_paths:
  - src/core/evidence/
  - src/effects/evidence/
  - src/cli/hook/prompt-handler.ts
  - src/cli/hook/mutation-observed.ts
  - src/cli/runtime/helper-runner.ts
  - src/effects/process-supervisor.ts
  - src/effects/process-runner.ts
  - src/effects/expensive-run-lock.ts
  - src/core/review/
  - src/effects/review/
  - scripts/
  - assets/partials/
  - assets/partials-agents/
  - assets/templates/
  - assets/workflow-contract.v1.json
  - assets/reference-configs/
  - docs/researches/20260906-verification-execution-dataflow.md
  - docs/architecture/
  - docs/reference-configs/
  - .ai/harness/workflow-contract.json
  - .claude/templates/
  - tests/
  - plans/archive/plan-20260906-0447-verification-execution-lifecycle.md
  - tasks/
  - AGENTS.md
  - CLAUDE.md
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

This block contains only non-executable artifact requirements. The Verification
Plan is the single executable authority: every check explicitly binds its phase,
cost, evidence policy, necessity, and input environment. Add a full suite only
when its descriptor records an explicit release requirement or uncovered
cross-module risk; a cache miss, prose edit, or target movement does not authorize
an implicit rerun.

```yaml
exit_criteria:
  files_exist:
    - docs/spec.md
  artifacts_exist:
    - .ai/harness/checks/latest.json
    - tasks/archive/notes-20260906-1733-verification-execution-lifecycle.md
```


## Verification Plan

```json
{
  "protocol": 1,
  "checks": [
    {
      "id": "typecheck",
      "cwd": ".",
      "phase": "preflight",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Checks TypeScript contracts before evidence is evaluated.",
      "inputs": {
        "env": []
      },
      "kind": "command",
      "command": "bun run check:type"
    },
    {
      "id": "prompt-handler-regression",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Covers the done-gate regression that previously triggered repeated verification.",
      "inputs": {
        "env": []
      },
      "kind": "package_test",
      "path": "tests/prompt-handler.test.ts"
    },
    {
      "id": "projections",
      "kind": "command",
      "command": "bun scripts/sync-helper-sources.ts --check && bun scripts/sync-reference-configs.ts --check && bun scripts/check-state-boundaries.ts && cmp AGENTS.md CLAUDE.md && cmp assets/workflow-contract.v1.json .ai/harness/workflow-contract.json",
      "cwd": ".",
      "phase": "preflight",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Validates deterministic authoring projections and module boundaries before integration checks.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "tmux-review-regression",
      "kind": "command",
      "command": "bun test --timeout 60000 tests/claude-review.test.ts",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Reverify the complete tmux review fixture after aligning its delayed-spawn socket with production and cleanup. Prior 27-file execution passed 401 tests and failed only this fixture; that aggregate remains failed historical evidence.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "helper-integration-tests",
      "kind": "command",
      "command": "bun test --timeout 60000 tests/helper-scripts.test.ts",
      "cwd": ".",
      "phase": "verification",
      "cost": "expensive",
      "evidence_policy": "baseline_with_delta",
      "necessity": "Retain the immutable passing baseline. Named delta checks cover lifecycle fixes plus integration of pinned main 2fbd9060: local current-status projection, scaffold/default paths, review fingerprints and merge sealing. Helper/package layout projections remain checked. No uncovered integration risk requires repeating the baseline command.",
      "inputs": {
        "env": []
      },
      "baseline": {
        "run_file": ".ai/harness/runs/verification-vx-e75023f82ef247df9bdf.json",
        "execution_id": "vx-e75023f82ef247df9bdf"
      },
      "delta_checks": [
        "tmux-review-regression",
        "repository-integrity",
        "execution-failure-supersession",
        "main-integration",
        "local-status-helpers"
      ]
    },
    {
      "id": "package-default-readback",
      "kind": "command",
      "command": "bash scripts/check-tarball-install-smoke.sh",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "baseline_with_delta",
      "necessity": "Retain the immutable passing baseline. Named delta checks cover lifecycle fixes plus integration of pinned main 2fbd9060: local current-status projection, scaffold/default paths, review fingerprints and merge sealing. Helper/package layout projections remain checked. No uncovered integration risk requires repeating the baseline command.",
      "inputs": {
        "env": []
      },
      "baseline": {
        "run_file": ".ai/harness/runs/verification-vx-4337d86432674ff7853a.json",
        "execution_id": "vx-4337d86432674ff7853a"
      },
      "delta_checks": [
        "tmux-review-regression",
        "repository-integrity",
        "execution-failure-supersession",
        "main-integration",
        "local-status-helpers"
      ]
    },
    {
      "id": "repository-integrity",
      "kind": "command",
      "command": "bash scripts/check-deploy-sql-order.sh && bash scripts/check-architecture-sync.sh && REPO_HARNESS_DIFF_BASE=81b117dd89c6f22a67eae955ade299b9f79bd580 REPO_HARNESS_DIFF_MODE=merge-base bash scripts/check-task-sync.sh && bash scripts/check-task-workflow.sh --strict && bun scripts/inspect-project-state.ts --repo . --format text && REPO_HARNESS_SOURCE_ROOT=\"$PWD\" bun src/cli/index.ts init --repo . --dry-run",
      "cwd": ".",
      "phase": "preflight",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Required repository-integrity checks before executing the affected lifecycle fixtures.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "execution-failure-supersession",
      "kind": "command",
      "command": "bun test --timeout 60000 tests/unit/verification-plan.test.ts tests/effects/verification-execution.test.ts tests/verification-lifecycle-adapters.test.ts tests/acceptance-receipt.test.ts tests/acceptance-receipt-evidence-fingerprint.test.ts",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Covers latest-execution failure supersession and strict immutable-result validation through the canonical evidence redaction projection, plus core, source/projected adapters and receipt consumers.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "main-integration",
      "kind": "command",
      "command": "bun run check:route-eval && bash scripts/check-context-files.sh && bun test --timeout 60000 tests/bootstrap-files.test.ts tests/create-project-dirs.runtime.test.ts tests/workflow-contract.test.ts tests/session-context.test.ts tests/merge-gate.test.ts tests/check-task-sync.test.ts tests/scaffold-parity.test.ts tests/readme-dx.test.ts tests/evidence-projection-drift.test.ts tests/route-nl-vs-ts-eval.test.ts tests/characterization/repair-campaign-authority-freeze.test.ts",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Covers integration of main current-status cutover with new schema generators, evidence subjects and merge receipts. Includes the route/context CI gates from pinned origin/main c3bf07ea; source adapter regressions separately verify preflight failure never launches the suite. Includes the bounded BRC8 characterization correction from main 81b117dd.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "local-status-helpers",
      "kind": "command",
      "command": "bun test --timeout 60000 tests/helper-scripts.test.ts --test-name-pattern 'refresh-current-status|check-task-workflow strict tolerates'",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Covers exactly the two helper behavior changes introduced by main without repeating the helper baseline suite.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "migrated-contracts",
      "kind": "command",
      "command": "for contract in tasks/contracts/20260906-0415-untrack-current-status.contract.md tasks/contracts/20260906-0257-route-eval-ci-gate.contract.md tasks/contracts/20260906-0338-context-files-ci-step.contract.md; do bun scripts/verification-plan.ts validate --repo . --contract \"$contract\" >/dev/null || exit; done",
      "cwd": ".",
      "phase": "preflight",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Validates the three migrated active contracts through the sole strict parser. Completed historical contracts are outside this operator migration; no criterion is executed.",
      "inputs": {
        "env": []
      }
    }
  ]
}
```

## Acceptance Notes (Human Review)

- Functional behavior: canonical execution only; current evaluation distinguishes exact/baseline evidence.
- Edge cases: main moves, prose changes, missing plan/evidence, failures/timeouts, cross-worktree ownership and package runtime.
- Regression risks: no stale-as-pass or bypass of exact merge gate. Named verification and composed fixture cover the new boundary; no unconditional local full suite.

## Rollback Point

- Commit / checkpoint: 492add48
- Revert strategy: revert schema/readers/authoring as one work-package; preserve immutable historical events.
