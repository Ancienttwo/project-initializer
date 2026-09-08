> **Archived**: 2026-09-08 17:14
> **Related Plan**: plans/archive/plan-20260908-1656-brc354-consumer-closure.md
> **Outcome**: Superseded
> **Lifecycle**: contract
> **Parent Run ID**: run-20260908-1714
> **Archive Projection V1**: `plans/plan-20260908-1656-brc354-consumer-closure.md` => `plans/archive/plan-20260908-1656-brc354-consumer-closure.md`
> **Archive Projection V1**: `tasks/notes/20260908-1656-brc354-consumer-closure.notes.md` => `tasks/archive/notes-20260908-1714-brc354-consumer-closure.md`
> **Archive Projection V1**: `tasks/contracts/20260908-1656-brc354-consumer-closure.contract.md` => `tasks/archive/contract-20260908-1714-brc354-consumer-closure.md`
> **Archive Projection V1**: `tasks/reviews/20260908-1656-brc354-consumer-closure.review.md` => `tasks/archive/review-20260908-1714-brc354-consumer-closure.md`

# Task Contract: brc354-consumer-closure

> **Status**: Active
> **Plan**: plans/archive/plan-20260908-1656-brc354-consumer-closure.md
> **Task Profile**: code-change
> <!-- legal values: code-change | docs-only | ledger-closeout | migration | eval-only | delegated-run | bugfix (omit for legacy passthrough); see docs/reference-configs/sprint-contracts.md -->
> **Owner**: ancienttwo
> **Capability ID**: root
> **Last Updated**: 2026-09-08 16:56
> **Review File**: `tasks/archive/review-20260908-1714-brc354-consumer-closure.md`
> **Notes File**: `tasks/archive/notes-20260908-1714-brc354-consumer-closure.md`
> **Exemplar**: `docs/reference-configs/contract-brief-example.md`

## Why

Worker-writable logs and summaries cannot author supervision, inactivity or reclaim. Complete the preserved Docker consumer boundary while active remains closed.

## Goal

Produce a reviewable Docker producer/consumer/recovery candidate with model-free exact-bound evidence; never claim adapter-only completion of #354.

## Scope

- In scope: preserved containment carrier, managed invocation, contract-run/helper, actual finish and recovery, focused tests and evidence.
- Out of scope: model calls, new grants, active admission enablement, live campaigns, merge, Issue closure and package release.
- Taste constraints: <!-- advisory only, no run gate; default style/taste lives in AGENTS.md and the minimal-change policy, use this to record a per-task override -->

## Stop Conditions

- Stop and hand back to the parent if the change would require editing a path outside Allowed Paths.
- Stop if an Exit Criteria command cannot be run in this environment.
- Stop if Goal, Scope, or Exit Criteria are internally contradictory.

## Falsifier

If a workload mount exposes control storage, or recomputing writable logs and summary creates positive inactivity, reject this candidate. First proof: protected-control mount regression before any live provider work.

## Root Cause Evidence

Required when Task Profile is `bugfix`; leave as-is otherwise.

- root_cause: one sentence naming file:line/condition (testable, not "a state issue").
- repro: the command or UI path that reproduces the symptom.
- regression_guard: path to a test that fails on the unfixed code and passes after the fix (must also appear as a `package_test` check in Verification Plan).
- pre_fix_failure_artifact: path to a captured run of regression_guard on the UNFIXED code. Capture with `bun test <regression_guard> > <artifact> 2>&1; echo "PRE_FIX_EXIT=$?" >> <artifact>` (no pipes — pipes swallow the exit status). The gate requires a non-zero `PRE_FIX_EXIT=` line plus the regression_guard path string in the artifact (see the Root Cause Evidence Gate section in docs/reference-configs/sprint-contracts.md).

## Workflow Inventory

- Source plan: `plans/archive/plan-20260908-1656-brc354-consumer-closure.md`
- Deferred-goal ledger: `tasks/todos.md`
- Review file: `tasks/archive/review-20260908-1714-brc354-consumer-closure.md`
- Notes file: `tasks/archive/notes-20260908-1714-brc354-consumer-closure.md`
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
  - src/core/automation/campaign-containment.ts
  - src/core/automation/campaign-runtime.ts
  - src/effects/automation/campaign-container.ts
  - src/effects/automation/campaign-runtime.ts
  - src/effects/automation/campaign-worker.ts
  - src/effects/automation/campaign-recovery.ts
  - scripts/contract-run.ts
  - scripts/diagnose-campaign-container-readback.ts
  - assets/templates/helpers/contract-run.ts
  - deploy/campaign-container/
  - tests/
  - plans/
  - tasks/
  - docs/researches/
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
    - src/effects/automation/campaign-container.ts
  artifacts_exist:
    - docs/researches/20260908-brc354-consumer-closure.md
    - tasks/archive/notes-20260908-1714-brc354-consumer-closure.md
```

## Verification Plan

```json
{
  "protocol": 1,
  "checks": [
    {
      "id": "focused",
      "kind": "command",
      "command": "bun test tests/effects/campaign-container-readback-diagnostic.test.ts tests/effects/brc10-lifecycle.test.ts tests/effects/campaign-closeout.test.ts tests/unit/brc10-lifecycle.test.ts tests/campaign-finish-failure-audit.test.ts tests/bounded-supervisor-audit.test.ts tests/effects/campaign-revision-admission.test.ts tests/campaign-observe-revision-cli.test.ts",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Covers containment decoding, accounting/recovery/closeout, previous bounded supervisor fixes and revision admission/CLI. Named suites cover the changed consumers; no full local suite trigger.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "docker",
      "kind": "command",
      "command": "BRC_TEST_CONTAINER_IMAGE=sha256:72270cb098680b4e5e9e34f3ed7da6d861551bf946813a485069554055e08523 bun test tests/effects/campaign-container-live.test.ts tests/effects/campaign-runtime-container.test.ts tests/effects/brc10-lifecycle.test.ts -t \"Docker|container|control journal|output flood|interruption publication|resource drift\"",
      "cwd": ".",
      "phase": "verification",
      "cost": "expensive",
      "evidence_policy": "current_exact",
      "necessity": "Real model-free Docker needed for OS containment and actual consumer evidence; saved fixture cannot prove this. Fixed local image; no credentials.",
      "inputs": {
        "env": [
          "BRC_TEST_CONTAINER_IMAGE"
        ]
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
      "necessity": "Validate shared invocation and consumer TypeScript contracts.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "helpers",
      "kind": "command",
      "command": "bun run check:helpers",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Verify distributed helper bytes match their canonical source.",
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
      "necessity": "Required root repository-integrity check.",
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
      "necessity": "Required root repository-integrity check.",
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
      "necessity": "Required root repository-integrity check.",
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
      "necessity": "Required root repository-integrity check.",
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
      "necessity": "Required root repository-integrity check.",
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
      "necessity": "Required root repository-integrity check.",
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

- Functional behavior:
- Edge cases:
- Regression risks:

## Rollback Point

- Commit / checkpoint:
- Revert strategy:
