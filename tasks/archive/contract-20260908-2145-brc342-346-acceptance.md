> **Archived**: 2026-09-08 21:45
> **Related Plan**: plans/archive/plan-20260908-2102-brc342-346-acceptance.md
> **Outcome**: Completed
> **Lifecycle**: contract
> **Parent Run ID**: run-20260908-2145
> **Archive Projection V1**: `plans/plan-20260908-2102-brc342-346-acceptance.md` => `plans/archive/plan-20260908-2102-brc342-346-acceptance.md`
> **Archive Projection V1**: `tasks/notes/20260908-2102-brc342-346-acceptance.notes.md` => `tasks/archive/notes-20260908-2145-brc342-346-acceptance.md`
> **Archive Projection V1**: `tasks/contracts/20260908-2102-brc342-346-acceptance.contract.md` => `tasks/archive/contract-20260908-2145-brc342-346-acceptance.md`
> **Archive Projection V1**: `tasks/reviews/20260908-2102-brc342-346-acceptance.review.md` => `tasks/archive/review-20260908-2145-brc342-346-acceptance.md`

# Task Contract: brc342-346-acceptance

> **Status**: Fulfilled
> **Plan**: plans/archive/plan-20260908-2102-brc342-346-acceptance.md
> **Task Profile**: code-change
> <!-- legal values: code-change | docs-only | ledger-closeout | migration | eval-only | delegated-run | bugfix (omit for legacy passthrough); see docs/reference-configs/sprint-contracts.md -->
> **Owner**: ancienttwo
> **Capability ID**: root
> **Last Updated**: 2026-09-08 21:02
> **Review File**: `tasks/archive/review-20260908-2145-brc342-346-acceptance.md`
> **Notes File**: `tasks/archive/notes-20260908-2145-brc342-346-acceptance.md`
> **Exemplar**: `docs/reference-configs/contract-brief-example.md`

## Why

Prevent issue closure from mistaking primitive tests for actual role/preparation coverage. Preserve independent supervision and closed active admission.

## Goal

Prove actual-profile command/retained-proof and bounded probe matrix without model calls or admission bypass; report the exact active-admission boundary.

## Scope

- In scope: campaign runtime regression tests, cleanup evidence reconciliation and issue closeout documentation.
- Out of scope: active enablement, paid model calls, grants, TTL/GC, package release.
- Taste constraints: <!-- advisory only, no run gate; default style/taste lives in AGENTS.md and the minimal-change policy, use this to record a per-task override -->

## Stop Conditions

- Stop and hand back to the parent if the change would require editing a path outside Allowed Paths.
- Stop if an Exit Criteria command cannot be run in this environment.
- Stop if Goal, Scope, or Exit Criteria are internally contradictory.

## Falsifier

What observable evidence would prove this task's direction wrong, and the cheapest proof point to check first. Leave as-is if not applicable.

## Root Cause Evidence

Required when Task Profile is `bugfix`; leave as-is otherwise.

- root_cause: one sentence naming file:line/condition (testable, not "a state issue").
- repro: the command or UI path that reproduces the symptom.
- regression_guard: path to a test that fails on the unfixed code and passes after the fix (must also appear as a `package_test` check in Verification Plan).
- pre_fix_failure_artifact: path to a captured run of regression_guard on the UNFIXED code. Capture with `bun test <regression_guard> > <artifact> 2>&1; echo "PRE_FIX_EXIT=$?" >> <artifact>` (no pipes — pipes swallow the exit status). The gate requires a non-zero `PRE_FIX_EXIT=` line plus the regression_guard path string in the artifact (see the Root Cause Evidence Gate section in docs/reference-configs/sprint-contracts.md).

## Workflow Inventory

- Source plan: `plans/archive/plan-20260908-2102-brc342-346-acceptance.md`
- Deferred-goal ledger: `tasks/todos.md`
- Review file: `tasks/archive/review-20260908-2145-brc342-346-acceptance.md`
- Notes file: `tasks/archive/notes-20260908-2145-brc342-346-acceptance.md`
- Checks file: `.ai/harness/checks/latest.json`
- Run snapshots: `.ai/harness/runs/`
- Scope gate: edit only paths listed under `allowed_paths`; update this contract before widening scope.
- Completion gate: run `verify-sprint --prepare-acceptance`, record one typed AcceptanceReceipt under the frozen policy below, then run `verify-sprint`; review Markdown is projection only.

## Change Assessment

```json
{"protocol": 1, "oracles": [{"id": "docker-runtime", "kind": "runtime_readback", "paths": ["*"]}, {"id": "admission", "kind": "deterministic_test", "paths": ["*"]}]}
```

## Acceptance Policy

```json
{"protocol":2,"reviewer":"Codex","source":"codex-plugin","user_waiver":"allowed"}
```

## Allowed Paths

```yaml
allowed_paths:
  - plans/
  - tasks/
  - docs/researches/2026-09-08-brc342-346-acceptance.md
  - docs/architecture/.projection-manifest.json
  - tests/effects/campaign-runtime-container.test.ts
  - tests/effects/campaign-revision-observation.test.ts
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
    - tasks/archive/notes-20260908-2145-brc342-346-acceptance.md
```

## Verification Plan

```json
{
  "protocol": 1,
  "checks": [
    {
      "id": "docker-runtime",
      "kind": "command",
      "command": "BRC_TEST_CONTAINER_IMAGE=sha256:72270cb098680b4e5e9e34f3ed7da6d861551bf946813a485069554055e08523 bun test tests/effects/campaign-runtime-container.test.ts",
      "cwd": ".",
      "phase": "verification",
      "cost": "expensive",
      "evidence_policy": "baseline_with_delta",
      "necessity": "All 24 current runtime checks passed on 50be60d1. Later changes only bind workflow evidence; exact source equality retains this same-contract execution without another Docker run.",
      "inputs": {
        "env": []
      },
      "baseline": {
        "execution_id": "vx-5ca0fe3ea25f44848edf",
        "run_file": ".ai/harness/runs/verification-vx-5ca0fe3ea25f44848edf.json"
      },
      "delta_checks": [
        "runtime-source-unchanged",
        "containment-unchanged"
      ]
    },
    {
      "id": "admission-parser",
      "kind": "command",
      "command": "bun test tests/unit/brc10-lifecycle.test.ts tests/effects/campaign-revision-observation.test.ts",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Real admission fence without mocks and unknown-operation/deadline refusals.",
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
      "necessity": "Typecheck test and production contracts.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "helper-parity",
      "kind": "command",
      "command": "cmp scripts/contract-run.ts assets/templates/helpers/contract-run.ts",
      "cwd": ".",
      "phase": "preflight",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Packaged actual producer remains byte-identical.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "deploy",
      "kind": "command",
      "command": "bash scripts/check-deploy-sql-order.sh",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Required repository integrity check.",
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
      "necessity": "Required repository integrity check.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "task-sync",
      "kind": "command",
      "command": "REPO_HARNESS_DIFF_BASE=911ff4d28b6ca68653e811a1138a31e950c2fe03 REPO_HARNESS_DIFF_MODE=merge-base bash scripts/check-task-sync.sh",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Validate the actual frozen PR diff, not only the clean checkout. The initial CI refusal identified its exact substantive digest.",
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
      "necessity": "Required repository integrity check.",
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
      "necessity": "Required repository integrity check.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "adoption",
      "kind": "command",
      "command": "bun src/cli/index.ts init --repo . --dry-run",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Required repository integrity check.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "containment-unchanged",
      "kind": "command",
      "command": "git diff --exit-code ab2b55a8 -- src/core/automation/ src/effects/automation/ scripts/contract-run.ts assets/templates/helpers/contract-run.ts deploy/campaign-container/ tests/effects/campaign-container-live.test.ts",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Compare only actual containment/runtime dependencies; unrelated #364 CLI adoption changes do not invalidate this boundary.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "runtime-source-unchanged",
      "kind": "command",
      "command": "git diff --exit-code 50be60d1 -- tests/effects/campaign-runtime-container.test.ts .codex/agents/ src/core/automation/ src/effects/automation/ scripts/contract-run.ts assets/templates/helpers/contract-run.ts deploy/campaign-container/",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Exact current profile, test, production and image source equality to the passing frozen runtime subject.",
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

- Functional behavior: runtime matrix is complete at the no-model Docker boundary; active admission remains closed.
- Edge cases:
- Regression risks: the actual runtime fixture passed 24 checks; unchanged #363 containment remains historical evidence, not a cross-contract typed baseline.

## Rollback Point

- Commit / checkpoint:
- Revert strategy:
