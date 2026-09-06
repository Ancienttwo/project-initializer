> **Archived**: 2026-09-07 04:59
> **Related Plan**: plans/archive/plan-20260907-0348-brc9-transient-retry-consumption.md
> **Outcome**: Completed
> **Lifecycle**: contract
> **Parent Run ID**: run-20260907-0459
> **Archive Projection V1**: `plans/plan-20260907-0348-brc9-transient-retry-consumption.md` => `plans/archive/plan-20260907-0348-brc9-transient-retry-consumption.md`
> **Archive Projection V1**: `tasks/notes/20260907-0348-brc9-transient-retry-consumption.notes.md` => `tasks/archive/notes-20260907-0459-brc9-transient-retry-consumption.md`
> **Archive Projection V1**: `tasks/contracts/20260907-0348-brc9-transient-retry-consumption.contract.md` => `tasks/archive/contract-20260907-0459-brc9-transient-retry-consumption.md`
> **Archive Projection V1**: `tasks/reviews/20260907-0348-brc9-transient-retry-consumption.review.md` => `tasks/archive/review-20260907-0459-brc9-transient-retry-consumption.md`

# Task Contract: brc9-transient-retry-consumption

> **Status**: Fulfilled
> **Plan**: plans/archive/plan-20260907-0348-brc9-transient-retry-consumption.md
> **Task Profile**: code-change
> <!-- legal values: code-change | docs-only | ledger-closeout | migration | eval-only | delegated-run | bugfix (omit for legacy passthrough); see docs/reference-configs/sprint-contracts.md -->
> **Owner**: ancienttwo
> **Capability ID**: root
> **Last Updated**: 2026-09-07 03:48
> **Review File**: `tasks/archive/review-20260907-0459-brc9-transient-retry-consumption.md`
> **Notes File**: `tasks/archive/notes-20260907-0459-brc9-transient-retry-consumption.md`
> **Exemplar**: `docs/reference-configs/contract-brief-example.md`

## Why

Verified transient failures currently disappear into no_progress or generic provider_failure usage; campaign admission cannot enforce a consecutive retry limit.

## Goal

Enforce explicitly authorized campaign transient streak and deterministic backoff from the existing usage ledger before new side effects, preserving exact replay and unresolved reservations. Complete the BRC9 acceptance mapping against all previously published budget consumers and the integrated repair package before whole-row closure.

## Scope

- In scope: campaign grant policy, existing ledger outcome fold, admission gate, verified worker/provider settlement, explicit test grant fixtures.
- Out of scope: BRC10, cleanup, automatic claim release, BRC6a, new retry store/counter, runtime policy defaults.
- Taste constraints: <!-- advisory only, no run gate; default style/taste lives in AGENTS.md and the minimal-change policy, use this to record a per-task override -->

## Stop Conditions

- Stop and hand back to the parent if the change would require editing a path outside Allowed Paths.
- Stop if an Exit Criteria command cannot be run in this environment.
- Stop if Goal, Scope, or Exit Criteria are internally contradictory.

## Falsifier

A typed transient result permits a new effect at the limit, successful bookkeeping resets the streak, or replay changes the usage charge.

## Root Cause Evidence

Required when Task Profile is `bugfix`; leave as-is otherwise.

- root_cause: one sentence naming file:line/condition (testable, not "a state issue").
- repro: the command or UI path that reproduces the symptom.
- regression_guard: path to a test that fails on the unfixed code and passes after the fix (must also appear as a `package_test` check in Verification Plan).
- pre_fix_failure_artifact: path to a captured run of regression_guard on the UNFIXED code. Capture with `bun test <regression_guard> > <artifact> 2>&1; echo "PRE_FIX_EXIT=$?" >> <artifact>` (no pipes — pipes swallow the exit status). The gate requires a non-zero `PRE_FIX_EXIT=` line plus the regression_guard path string in the artifact (see the Root Cause Evidence Gate section in docs/reference-configs/sprint-contracts.md).

## Workflow Inventory

- Source plan: `plans/archive/plan-20260907-0348-brc9-transient-retry-consumption.md`
- Deferred-goal ledger: `tasks/todos.md`
- Review file: `tasks/archive/review-20260907-0459-brc9-transient-retry-consumption.md`
- Notes file: `tasks/archive/notes-20260907-0459-brc9-transient-retry-consumption.md`
- Checks file: `.ai/harness/checks/latest.json`
- Run snapshots: `.ai/harness/runs/`
- Scope gate: edit only paths listed under `allowed_paths`; update this contract before widening scope.
- Completion gate: run `verify-sprint --prepare-acceptance`, record one typed AcceptanceReceipt under the frozen policy below, then run `verify-sprint`; review Markdown is projection only.

## Change Assessment

```json
{"protocol":1,"oracles":[{"id":"brc9-transient-retry-consumption","kind":"deterministic_test","paths":["src/core/automation/budget.ts"]}]}
```

## Acceptance Policy

```json
{"protocol":2,"reviewer":"Codex","source":"codex-plugin","user_waiver":"allowed"}
```

## Allowed Paths

```yaml
allowed_paths:
  - src/core/automation/budget.ts
  - src/effects/automation/budget-store.ts
  - src/effects/automation/campaign-worker.ts
  - src/effects/automation/campaign-provider-execution.ts
  - tests/effects/campaign-worker.test.ts
  - tests/effects/campaign-acquisition.test.ts
  - tests/unit/brc9-transient-retry-consumption.test.ts
  - tests/cli/development-campaign.test.ts
  - tests/effects/campaign-provider-execution.test.ts
  - tests/effects/campaign-step.test.ts
  - tests/effects/development-campaign-store.test.ts
  - tests/effects/gpt-pro-issue-authoring.test.ts
  - tests/effects/issue-batch-observer.test.ts
  - tests/helpers/campaign-adoption-repository.ts
  - tests/unit/campaign-authoring-budget-prerequisite.test.ts
  - tests/unit/campaign-step-budget-prerequisite.test.ts
  - tests/unit/issue-282-automation-budget-prd-drift.test.ts
  - plans/prds/20260828-2321-guarded-merge-unattended-automation.prd.md
  - plans/sprints/20260902-2238-gpt-pro-seeded-repair-campaign.sprint.md
  - docs/researches/20260905-repair-campaign-sprint-execution-boundaries.md
  - docs/architecture/
  - docs/researches/20260907-brc9-transient-retry-consumption.md
  - plans/archive/plan-20260907-0348-brc9-transient-retry-consumption.md
  - tasks/todos.md
  - tasks/archive/contract-20260907-0459-brc9-transient-retry-consumption.md
  - tasks/archive/review-20260907-0459-brc9-transient-retry-consumption.md
  - tasks/archive/notes-20260907-0459-brc9-transient-retry-consumption.md
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
    - tasks/archive/notes-20260907-0459-brc9-transient-retry-consumption.md
```

## Verification Plan

```json
{
  "protocol": 1,
  "checks": [
    {
      "id": "brc9-transient-retry-consumption",
      "kind": "package_test",
      "path": "tests/unit/brc9-transient-retry-consumption.test.ts",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Covers the changed grant, ledger, typed outcome or its real campaign consumer.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "issue-282-automation-budget-core",
      "kind": "package_test",
      "path": "tests/unit/issue-282-automation-budget-core.test.ts",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "baseline_with_delta",
      "necessity": "The exact successful 0062dbe8 execution remains historical baseline; current worker, store and transient tests cover the only recovery delta, with type and integrity checks.",
      "inputs": {
        "env": []
      },
      "baseline": {
        "run_file": ".ai/harness/runs/verification-vx-03e39e20dddb4735865e.json",
        "execution_id": "vx-03e39e20dddb4735865e"
      },
      "delta_checks": [
        "campaign-worker",
        "budget-store",
        "brc9-transient-retry-consumption",
        "typecheck"
      ]
    },
    {
      "id": "issue-287-automation-attempt",
      "kind": "package_test",
      "path": "tests/unit/issue-287-automation-attempt.test.ts",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "baseline_with_delta",
      "necessity": "The exact successful 0062dbe8 execution remains historical baseline; current worker, store and transient tests cover the only recovery delta, with type and integrity checks.",
      "inputs": {
        "env": []
      },
      "baseline": {
        "run_file": ".ai/harness/runs/verification-vx-b1d4e23bb705433bb912.json",
        "execution_id": "vx-b1d4e23bb705433bb912"
      },
      "delta_checks": [
        "campaign-worker",
        "budget-store",
        "brc9-transient-retry-consumption",
        "typecheck"
      ]
    },
    {
      "id": "campaign-worker",
      "kind": "package_test",
      "path": "tests/effects/campaign-worker.test.ts",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Covers the changed grant, ledger, typed outcome or its real campaign consumer.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "campaign-acquisition",
      "kind": "package_test",
      "path": "tests/effects/campaign-acquisition.test.ts",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "baseline_with_delta",
      "necessity": "The exact successful 0062dbe8 execution remains historical baseline; current worker, store and transient tests cover the only recovery delta, with type and integrity checks.",
      "inputs": {
        "env": []
      },
      "baseline": {
        "run_file": ".ai/harness/runs/verification-vx-91337ac2ccf7454f816e.json",
        "execution_id": "vx-91337ac2ccf7454f816e"
      },
      "delta_checks": [
        "campaign-worker",
        "budget-store",
        "brc9-transient-retry-consumption",
        "typecheck"
      ]
    },
    {
      "id": "issue-batch-adoption",
      "kind": "package_test",
      "path": "tests/effects/issue-batch-adoption.test.ts",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "baseline_with_delta",
      "necessity": "The exact successful 0062dbe8 execution remains historical baseline; current worker, store and transient tests cover the only recovery delta, with type and integrity checks.",
      "inputs": {
        "env": []
      },
      "baseline": {
        "run_file": ".ai/harness/runs/verification-vx-d64697b0f5004c89a2c7.json",
        "execution_id": "vx-d64697b0f5004c89a2c7"
      },
      "delta_checks": [
        "campaign-worker",
        "budget-store",
        "brc9-transient-retry-consumption",
        "typecheck"
      ]
    },
    {
      "id": "development-campaign",
      "kind": "package_test",
      "path": "tests/cli/development-campaign.test.ts",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "baseline_with_delta",
      "necessity": "The exact successful 0062dbe8 execution remains historical baseline; current worker, store and transient tests cover the only recovery delta, with type and integrity checks.",
      "inputs": {
        "env": []
      },
      "baseline": {
        "run_file": ".ai/harness/runs/verification-vx-a24ff60d820f4868ac5c.json",
        "execution_id": "vx-a24ff60d820f4868ac5c"
      },
      "delta_checks": [
        "campaign-worker",
        "budget-store",
        "brc9-transient-retry-consumption",
        "typecheck"
      ]
    },
    {
      "id": "campaign-provider-execution",
      "kind": "package_test",
      "path": "tests/effects/campaign-provider-execution.test.ts",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "baseline_with_delta",
      "necessity": "The exact successful 0062dbe8 execution remains historical baseline; current worker, store and transient tests cover the only recovery delta, with type and integrity checks.",
      "inputs": {
        "env": []
      },
      "baseline": {
        "run_file": ".ai/harness/runs/verification-vx-de97f5e0855341f48fd7.json",
        "execution_id": "vx-de97f5e0855341f48fd7"
      },
      "delta_checks": [
        "campaign-worker",
        "budget-store",
        "brc9-transient-retry-consumption",
        "typecheck"
      ]
    },
    {
      "id": "campaign-step",
      "kind": "package_test",
      "path": "tests/effects/campaign-step.test.ts",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "baseline_with_delta",
      "necessity": "The exact successful 0062dbe8 execution remains historical baseline; current worker, store and transient tests cover the only recovery delta, with type and integrity checks.",
      "inputs": {
        "env": []
      },
      "baseline": {
        "run_file": ".ai/harness/runs/verification-vx-58e532097bbb460282b4.json",
        "execution_id": "vx-58e532097bbb460282b4"
      },
      "delta_checks": [
        "campaign-worker",
        "budget-store",
        "brc9-transient-retry-consumption",
        "typecheck"
      ]
    },
    {
      "id": "development-campaign-store",
      "kind": "package_test",
      "path": "tests/effects/development-campaign-store.test.ts",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "baseline_with_delta",
      "necessity": "The exact successful 0062dbe8 execution remains historical baseline; current worker, store and transient tests cover the only recovery delta, with type and integrity checks.",
      "inputs": {
        "env": []
      },
      "baseline": {
        "run_file": ".ai/harness/runs/verification-vx-01b8717392584ccb93a8.json",
        "execution_id": "vx-01b8717392584ccb93a8"
      },
      "delta_checks": [
        "campaign-worker",
        "budget-store",
        "brc9-transient-retry-consumption",
        "typecheck"
      ]
    },
    {
      "id": "gpt-pro-issue-authoring",
      "kind": "package_test",
      "path": "tests/effects/gpt-pro-issue-authoring.test.ts",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "baseline_with_delta",
      "necessity": "The exact successful 0062dbe8 execution remains historical baseline; current worker, store and transient tests cover the only recovery delta, with type and integrity checks.",
      "inputs": {
        "env": []
      },
      "baseline": {
        "run_file": ".ai/harness/runs/verification-vx-dc49fdb08dc64e089934.json",
        "execution_id": "vx-dc49fdb08dc64e089934"
      },
      "delta_checks": [
        "campaign-worker",
        "budget-store",
        "brc9-transient-retry-consumption",
        "typecheck"
      ]
    },
    {
      "id": "issue-batch-observer",
      "kind": "package_test",
      "path": "tests/effects/issue-batch-observer.test.ts",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "baseline_with_delta",
      "necessity": "The exact successful 0062dbe8 execution remains historical baseline; current worker, store and transient tests cover the only recovery delta, with type and integrity checks.",
      "inputs": {
        "env": []
      },
      "baseline": {
        "run_file": ".ai/harness/runs/verification-vx-79ab6134342149959040.json",
        "execution_id": "vx-79ab6134342149959040"
      },
      "delta_checks": [
        "campaign-worker",
        "budget-store",
        "brc9-transient-retry-consumption",
        "typecheck"
      ]
    },
    {
      "id": "campaign-authoring-budget-prerequisite",
      "kind": "package_test",
      "path": "tests/unit/campaign-authoring-budget-prerequisite.test.ts",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "baseline_with_delta",
      "necessity": "The exact successful 0062dbe8 execution remains historical baseline; current worker, store and transient tests cover the only recovery delta, with type and integrity checks.",
      "inputs": {
        "env": []
      },
      "baseline": {
        "run_file": ".ai/harness/runs/verification-vx-e6f599cbd8074f1b83a0.json",
        "execution_id": "vx-e6f599cbd8074f1b83a0"
      },
      "delta_checks": [
        "campaign-worker",
        "budget-store",
        "brc9-transient-retry-consumption",
        "typecheck"
      ]
    },
    {
      "id": "campaign-step-budget-prerequisite",
      "kind": "package_test",
      "path": "tests/unit/campaign-step-budget-prerequisite.test.ts",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "baseline_with_delta",
      "necessity": "The exact successful 0062dbe8 execution remains historical baseline; current worker, store and transient tests cover the only recovery delta, with type and integrity checks.",
      "inputs": {
        "env": []
      },
      "baseline": {
        "run_file": ".ai/harness/runs/verification-vx-c628ee23008943579358.json",
        "execution_id": "vx-c628ee23008943579358"
      },
      "delta_checks": [
        "campaign-worker",
        "budget-store",
        "brc9-transient-retry-consumption",
        "typecheck"
      ]
    },
    {
      "id": "issue-282-automation-budget-prd-drift",
      "kind": "package_test",
      "path": "tests/unit/issue-282-automation-budget-prd-drift.test.ts",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "baseline_with_delta",
      "necessity": "The exact successful 0062dbe8 execution remains historical baseline; current worker, store and transient tests cover the only recovery delta, with type and integrity checks.",
      "inputs": {
        "env": []
      },
      "baseline": {
        "run_file": ".ai/harness/runs/verification-vx-c4670ec4bb994785a39c.json",
        "execution_id": "vx-c4670ec4bb994785a39c"
      },
      "delta_checks": [
        "campaign-worker",
        "budget-store",
        "brc9-transient-retry-consumption",
        "typecheck"
      ]
    },
    {
      "id": "typecheck",
      "kind": "command",
      "command": "bun run check:type",
      "cwd": ".",
      "phase": "preflight",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Required repository integrity for the shared budget protocol and consumers.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "state-boundaries",
      "kind": "command",
      "command": "bun run check:state-boundaries",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Required repository integrity for the shared budget protocol and consumers.",
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
      "necessity": "Required repository integrity for the shared budget protocol and consumers.",
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
      "necessity": "Required repository integrity for the shared budget protocol and consumers.",
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
      "necessity": "Required repository integrity for the shared budget protocol and consumers.",
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
      "necessity": "Required repository integrity for the shared budget protocol and consumers.",
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
      "necessity": "Required repository integrity for the shared budget protocol and consumers.",
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
      "necessity": "Required repository integrity for the shared budget protocol and consumers.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "budget-store",
      "kind": "package_test",
      "path": "tests/unit/issue-282-automation-budget-store.test.ts",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Covers the changed grant, ledger, typed outcome or its real campaign consumer.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "strict-shadow-terminal",
      "kind": "package_test",
      "path": "tests/effects/issue-batch-shadow-budget.test.ts",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "baseline_with_delta",
      "necessity": "The exact successful 0062dbe8 execution remains historical baseline; current worker, store and transient tests cover the only recovery delta, with type and integrity checks.",
      "inputs": {
        "env": []
      },
      "baseline": {
        "run_file": ".ai/harness/runs/verification-vx-3ea0e3679475457b8849.json",
        "execution_id": "vx-3ea0e3679475457b8849"
      },
      "delta_checks": [
        "campaign-worker",
        "budget-store",
        "brc9-transient-retry-consumption",
        "typecheck"
      ]
    }
  ]
}
```

This is the sole executable verification authority. Use `baseline_with_delta`
only when a referenced immutable baseline plus named current delta checks prove
the intended coverage; do not infer that choice from paths or command text.

## Acceptance Notes (Human Review)

- Functional behavior: explicit policy and immutable usage events stop new effects at the authorized streak limit.
- Edge cases: replay, crash recovery, missing policy, known versus unknown outcome, typed user/permanent blockers, deterministic backoff and semantic reset.
- Regression risks: shared budget admission and grant validation; named direct consumers cover those boundaries without a redundant local full suite.

## Rollback Point

- Commit / checkpoint:
- Revert strategy:

## Review correction coverage

The single formal review on subject `sha256:61306b215a997143fc5503d38c4e4206088876f5b7aa560920e64b8213e631d9` identified pre-admission launch poisoning and historical settled-final charge recomputation. Both corrections stay in worker/store ownership. Prepare `run-20260907T043935-20213` remains the 25-check baseline for its original subject/target; unchanged consumer checks explicitly reference those immutable executions with current worker/store/transient delta tests. No baseline is relabeled as a new-subject exact pass.
