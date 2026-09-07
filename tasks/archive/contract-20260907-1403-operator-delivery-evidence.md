> **Archived**: 2026-09-07 14:03
> **Related Plan**: plans/archive/plan-20260907-1207-operator-delivery-evidence.md
> **Outcome**: Completed
> **Lifecycle**: contract
> **Parent Run ID**: run-20260907-1403
> **Archive Projection V1**: `plans/plan-20260907-1207-operator-delivery-evidence.md` => `plans/archive/plan-20260907-1207-operator-delivery-evidence.md`
> **Archive Projection V1**: `tasks/notes/20260907-1207-operator-delivery-evidence.notes.md` => `tasks/archive/notes-20260907-1403-operator-delivery-evidence.md`
> **Archive Projection V1**: `tasks/contracts/20260907-1207-operator-delivery-evidence.contract.md` => `tasks/archive/contract-20260907-1403-operator-delivery-evidence.md`
> **Archive Projection V1**: `tasks/reviews/20260907-1207-operator-delivery-evidence.review.md` => `tasks/archive/review-20260907-1403-operator-delivery-evidence.md`

# Task Contract: operator-delivery-evidence

> **Status**: Fulfilled
> **Plan**: plans/archive/plan-20260907-1207-operator-delivery-evidence.md
> **Task Profile**: code-change
> <!-- legal values: code-change | docs-only | ledger-closeout | migration | eval-only | delegated-run | bugfix (omit for legacy passthrough); see docs/reference-configs/sprint-contracts.md -->
> **Owner**: ancienttwo
> **Capability ID**: root
> **Last Updated**: 2026-09-07 13:24
> **Review File**: `tasks/archive/review-20260907-1403-operator-delivery-evidence.md`
> **Notes File**: `tasks/archive/notes-20260907-1403-operator-delivery-evidence.md`
> **Exemplar**: `docs/reference-configs/contract-brief-example.md`

## Why

TaskDetail 缺少已有通知观察的来源与阶段。展示必须来自当前 Claim 的权威 effect，避免把通知时间误解为 worker 活动。

## Goal

按已批准计划贯通 delivery_evidence 投影、protocol 4 严格消费者及消息投递证据 UI；不引入新的运行 authority。

## Scope

- In scope: 当前 notify effect 的 allowlisted evidence、0/1/multi/error 投影、protocol 4、既有 TaskDetail 和配套测试文档。
- Out of scope: BRC 生命周期、预算、session discovery、控制操作、历史列表、自动刷新、持久化迁移。
- Taste constraints: <!-- advisory only, no run gate; default style/taste lives in AGENTS.md and the minimal-change policy, use this to record a per-task override -->

## Stop Conditions

- Stop and hand back to the parent if the change would require editing a path outside Allowed Paths.
- Stop if an Exit Criteria command cannot be run in this environment.
- Stop if Goal, Scope, or Exit Criteria are internally contradictory.

## Falsifier

若必须新增 store 扫描或从 session 推断通知事实，此方案不成立；先验证现有 statuses 的选择和绑定。

## Root Cause Evidence

Required when Task Profile is `bugfix`; leave as-is otherwise.

- root_cause: one sentence naming file:line/condition (testable, not "a state issue").
- repro: the command or UI path that reproduces the symptom.
- regression_guard: path to a test that fails on the unfixed code and passes after the fix (must also appear as a `package_test` check in Verification Plan).
- pre_fix_failure_artifact: path to a captured run of regression_guard on the UNFIXED code. Capture with `bun test <regression_guard> > <artifact> 2>&1; echo "PRE_FIX_EXIT=$?" >> <artifact>` (no pipes — pipes swallow the exit status). The gate requires a non-zero `PRE_FIX_EXIT=` line plus the regression_guard path string in the artifact (see the Root Cause Evidence Gate section in docs/reference-configs/sprint-contracts.md).

## Workflow Inventory

- Source plan: `plans/archive/plan-20260907-1207-operator-delivery-evidence.md`
- Deferred-goal ledger: `tasks/todos.md`
- Review file: `tasks/archive/review-20260907-1403-operator-delivery-evidence.md`
- Notes file: `tasks/archive/notes-20260907-1403-operator-delivery-evidence.md`
- Checks file: `.ai/harness/checks/latest.json`
- Run snapshots: `.ai/harness/runs/`
- Scope gate: edit only paths listed under `allowed_paths`; update this contract before widening scope.
- Completion gate: run `verify-sprint --prepare-acceptance`, record one typed AcceptanceReceipt under the frozen policy below, then run `verify-sprint`; review Markdown is projection only.

## Change Assessment

```json
{"protocol": 1, "oracles": [{"id": "producer-projection", "kind": "deterministic_test", "paths": ["src/core/fleet/board.ts"]}]}
```

## Acceptance Policy

```json
{"protocol":2,"reviewer":"Codex","source":"codex-plugin","user_waiver":"allowed"}
```

## Allowed Paths

```yaml
allowed_paths:
  - src/core/fleet/board.ts
  - src/effects/engineers/agent-runtime-effect-store.ts
  - src/effects/fleet/board.ts
  - src/core/operator/fleet-snapshot.ts
  - src/operator-web/
  - tests/
  - scripts/check-tarball-install-smoke.sh
  - tasks/todos.md
  - docs/researches/20260829-c0-collaboration-two-plane-authority-freeze.md
  - docs/design/DESIGN-local-human-control-board-v1.md
  - docs/researches/20260907-multica-multi-harness-board-extraction.md
  - plans/archive/plan-20260907-1207-operator-delivery-evidence.md
  - plans/archive/
  - tasks/archive/contract-20260907-1403-operator-delivery-evidence.md
  - tasks/archive/review-20260907-1403-operator-delivery-evidence.md
  - tasks/archive/notes-20260907-1403-operator-delivery-evidence.md
  - tasks/archive/
  - docs/architecture/
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
    - tasks/archive/notes-20260907-1403-operator-delivery-evidence.md
```

## Verification Plan

```json
{
  "protocol": 1,
  "checks": [
    {
      "id": "producer-projection",
      "kind": "command",
      "command": "bun test --timeout 60000 tests/unit/r1-provider-neutral-agent-runtime.test.ts tests/unit/fleet-board.test.ts tests/effects/fleet-board.test.ts tests/unit/operator-fleet-snapshot.test.ts",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "baseline_with_delta",
      "necessity": "Effect/receipt binding, candidates, containment and safe projections. Retain the successful unchanged-code baseline; the current delta excludes only workflow records and generated architecture bookkeeping.",
      "inputs": {
        "env": []
      },
      "baseline": {
        "run_file": ".ai/harness/runs/verification-vx-3737600c2e4148e2bf68.json",
        "execution_id": "vx-3737600c2e4148e2bf68"
      },
      "delta_checks": [
        "packaging-inputs-unchanged"
      ]
    },
    {
      "id": "consumer-ui",
      "kind": "command",
      "command": "bun test --timeout 60000 tests/unit/operator-web-types.test.ts tests/operator-web/operator-ui.test.tsx tests/operator-web/operator-interactions.test.tsx tests/operator-web/operator-collaboration.test.tsx tests/cli/fleet-board.test.ts tests/cli/operator-serve.test.ts tests/effects/operator-write-boundary.test.ts tests/unit/collaboration-authority-baseline.test.ts tests/readme-dx.test.ts",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "baseline_with_delta",
      "necessity": "Protocol 4 decoder, UI and unchanged write boundary. Retain the successful unchanged-code baseline; the current delta excludes only workflow records and generated architecture bookkeeping.",
      "inputs": {
        "env": []
      },
      "baseline": {
        "run_file": ".ai/harness/runs/verification-vx-f939071afe364fb98f59.json",
        "execution_id": "vx-f939071afe364fb98f59"
      },
      "delta_checks": [
        "packaging-inputs-unchanged"
      ]
    },
    {
      "id": "integrity-0",
      "kind": "command",
      "command": "bun run check:type",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "baseline_with_delta",
      "necessity": "Required type or repository integrity verification. Retain the successful unchanged-code baseline; the current delta excludes only workflow records and generated architecture bookkeeping.",
      "inputs": {
        "env": []
      },
      "baseline": {
        "run_file": ".ai/harness/runs/verification-vx-dd713bd410f94b14bab5.json",
        "execution_id": "vx-dd713bd410f94b14bab5"
      },
      "delta_checks": [
        "packaging-inputs-unchanged"
      ]
    },
    {
      "id": "integrity-1",
      "kind": "command",
      "command": "bash scripts/check-deploy-sql-order.sh",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Required type or repository integrity verification.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "integrity-2",
      "kind": "command",
      "command": "bash scripts/check-architecture-sync.sh",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Required type or repository integrity verification.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "integrity-3",
      "kind": "command",
      "command": "bash scripts/check-task-sync.sh",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Required type or repository integrity verification.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "integrity-4",
      "kind": "command",
      "command": "bash scripts/check-task-workflow.sh --strict",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Required type or repository integrity verification.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "integrity-5",
      "kind": "command",
      "command": "bun scripts/inspect-project-state.ts --repo . --format text",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Required type or repository integrity verification.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "integrity-6",
      "kind": "command",
      "command": "bun src/cli/index.ts init --repo . --dry-run",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Required type or repository integrity verification.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "packaging-inputs-unchanged",
      "kind": "command",
      "command": "git diff --exit-code 1d94ba1fe1aed296214e4b7a6ede4aa68db81cc4 -- . ':!tasks' ':!plans' ':!docs/architecture'",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Proves every versioned packaging, production, test and dependency input is unchanged from the successful tarball baseline; only workflow and generated architecture bookkeeping are excluded.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "packaged-integration",
      "kind": "command",
      "command": "bash scripts/check-tarball-install-smoke.sh",
      "cwd": ".",
      "phase": "verification",
      "cost": "expensive",
      "evidence_policy": "baseline_with_delta",
      "necessity": "Retain installed protocol 4 tarball pass; current delta proves only workflow records or architecture provenance changed afterward.",
      "inputs": {
        "env": []
      },
      "baseline": {
        "run_file": ".ai/harness/runs/verification-vx-14c71df96f9c4283ac4b.json",
        "execution_id": "vx-14c71df96f9c4283ac4b"
      },
      "delta_checks": [
        "packaging-inputs-unchanged",
        "integrity-3",
        "integrity-4"
      ]
    }
  ]
}
```

This is the sole executable verification authority. Use `baseline_with_delta`
only when a referenced immutable baseline plus named current delta checks prove
the intended coverage; do not infer that choice from paths or command text.

## Acceptance Notes (Human Review)

- Functional behavior: Product checks passed on 1d94ba1fe1aed296214e4b7a6ede4aa68db81cc4; packaging uses its immutable successful baseline plus an exact content delta for workflow-only follow-through.
- Edge cases:
- Regression risks:

## Rollback Point

- Commit / checkpoint: 7430fb93 (BRC10 #338 integrated before implementation).
- Revert strategy: Revert projection and protocol 4 bundled UI together; no persisted migration.
