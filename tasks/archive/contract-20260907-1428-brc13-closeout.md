> **Archived**: 2026-09-07 14:28
> **Related Plan**: plans/archive/plan-20260907-1224-brc13-closeout.md
> **Outcome**: Completed
> **Lifecycle**: contract
> **Parent Run ID**: run-20260907-1428
> **Archive Projection V1**: `plans/plan-20260907-1224-brc13-closeout.md` => `plans/archive/plan-20260907-1224-brc13-closeout.md`
> **Archive Projection V1**: `tasks/notes/20260907-1224-brc13-closeout.notes.md` => `tasks/archive/notes-20260907-1428-brc13-closeout.md`
> **Archive Projection V1**: `tasks/contracts/20260907-1224-brc13-closeout.contract.md` => `tasks/archive/contract-20260907-1428-brc13-closeout.md`
> **Archive Projection V1**: `tasks/reviews/20260907-1224-brc13-closeout.review.md` => `tasks/archive/review-20260907-1428-brc13-closeout.md`

# Task Contract: brc13-closeout

> **Status**: Fulfilled
> **Plan**: plans/archive/plan-20260907-1224-brc13-closeout.md
> **Task Profile**: code-change
> <!-- legal values: code-change | docs-only | ledger-closeout | migration | eval-only | delegated-run | bugfix (omit for legacy passthrough); see docs/reference-configs/sprint-contracts.md -->
> **Owner**: ancienttwo
> **Capability ID**: root
> **Last Updated**: 2026-09-07 12:26
> **Review File**: `tasks/archive/review-20260907-1428-brc13-closeout.md`
> **Notes File**: `tasks/archive/notes-20260907-1428-brc13-closeout.md`
> **Exemplar**: `docs/reference-configs/contract-brief-example.md`

## Why

BRC13 must close only the adopted Issue whose complete Task set has integrated, then clean its exact execution topology without racing a new owner or repeating an unknown external mutation.

## Goal

Deliver the ordered campaign closeout transaction, bounded mutation/readback evidence, actual merge revision proof, exact remote and local cleanup, and cleanup_pending admission fence.

## Scope

- In scope: BRC13 Provider/merge/cleanup authority, existing budget and publication consumers, shared bind/cleanup lock, CLI entry, focused regressions and delivery.
- Out of scope: Operator/Fleet board projection, notification runtime store, BRC6a readback semantics, real campaign runs and global release.
- Taste constraints: <!-- advisory only, no run gate; default style/taste lives in AGENTS.md and the minimal-change policy, use this to record a per-task override -->

## Stop Conditions

- Stop and hand back to the parent if the change would require editing a path outside Allowed Paths.
- Stop if an Exit Criteria command cannot be run in this environment.
- Stop if Goal, Scope, or Exit Criteria are internally contradictory.

## Falsifier

A cleanup concurrent with a new bind, a close before all Issue Tasks have actual reachable merge evidence, or a repeated unknown mutation falsifies this design. Prove each with disposable process/Git/Provider fixtures.

## Workflow Inventory

- Source plan: `plans/archive/plan-20260907-1224-brc13-closeout.md`
- Deferred-goal ledger: `tasks/todos.md`
- Review file: `tasks/archive/review-20260907-1428-brc13-closeout.md`
- Notes file: `tasks/archive/notes-20260907-1428-brc13-closeout.md`
- Checks file: `.ai/harness/checks/latest.json`
- Run snapshots: `.ai/harness/runs/`
- Scope gate: edit only paths listed under `allowed_paths`; update this contract before widening scope.
- Completion gate: run `verify-sprint --prepare-acceptance`, record one typed AcceptanceReceipt under the frozen policy below, then run `verify-sprint`; review Markdown is projection only.

## Change Assessment

```json
{"protocol": 1, "oracles": [{"id": "closeout-effects", "kind": "deterministic_test", "paths": ["*"]}]}
```

## Acceptance Policy

```json
{"protocol":2,"reviewer":"Codex","source":"codex-plugin","user_waiver":"allowed"}
```

## Allowed Paths

```yaml
allowed_paths:
  - plans/archive/plan-20260907-1224-brc13-closeout.md
  - plans/sprints/20260902-2238-gpt-pro-seeded-repair-campaign.sprint.md
  - tasks/todos.md
  - tasks/archive/contract-20260907-1428-brc13-closeout.md
  - tasks/archive/review-20260907-1428-brc13-closeout.md
  - tasks/archive/notes-20260907-1428-brc13-closeout.md
  - docs/researches/20260907-brc13-closeout.md
  - .archcontext/model/nodes/capability.runtime-harness.development-campaign.yaml
  - src/core/automation/budget.ts
  - src/core/automation/campaign-closeout.ts
  - src/effects/automation/budget-store.ts
  - src/effects/automation/campaign-closeout.ts
  - src/effects/automation/campaign-closeout-provider.ts
  - src/effects/automation/campaign-not-planned.ts
  - src/effects/automation/development-campaign-store.ts
  - src/effects/automation/gpt-pro-issue-authoring.ts
  - src/effects/automation/campaign-planning-proof.ts
  - src/effects/automation/campaign-worker.ts
  - src/effects/publication/publication-receipt.ts
  - src/effects/publication/publication-lifecycle.ts
  - src/effects/state/coordination-worktree-topology.ts
  - src/effects/state/coordination-sprint.ts
  - src/cli/commands/campaign.ts
  - scripts/contract-worktree.sh
  - scripts/archive-workflow.sh
  - assets/templates/helpers/archive-workflow.sh
  - tests/archive-evidence-gates.test.ts
  - assets/templates/helpers/contract-worktree.sh
  - tests/fixtures/repair-campaign/protected-capabilities.json
  - tests/helpers/campaign-adoption-repository.ts
  - tests/helpers/campaign-acquisition-fixture.ts
  - tests/effects/campaign-closeout.test.ts
  - tests/unit/campaign-closeout-budget.test.ts
  - tests/unit/campaign-closeout.test.ts
  - tests/unit/publication-lifecycle.test.ts
  - tests/cli/fleet-feedback.test.ts
  - tests/unit/publication-recovery-reconcile.test.ts
  - tests/coordination-lease-store.test.ts
  - tests/fleet-acquire-concurrency.test.ts
  - tests/sprint-claim-concurrency.test.ts
  - docs/architecture/.projection-manifest.json
  - docs/architecture/changelog.md
  - docs/architecture/decisions/index.md
  - docs/architecture/diagrams/architecture.likec4
  - docs/architecture/diagrams/architecture.mmd
  - docs/architecture/diagrams/architecture.structurizr.json
  - docs/architecture/index.md
  - docs/architecture/modules/runtime-harness/development-campaign.md
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
    - docs/researches/20260907-brc13-closeout.md
    - src/effects/automation/campaign-closeout.ts
    - src/effects/automation/campaign-not-planned.ts
  artifacts_exist:
    - .ai/harness/checks/latest.json
    - tasks/archive/notes-20260907-1428-brc13-closeout.md
```

## Verification Plan

```json
{
  "protocol": 1,
  "checks": [
    {
      "id": "closeout-budget",
      "kind": "command",
      "command": "bun test tests/unit/campaign-closeout-budget.test.ts tests/unit/campaign-closeout.test.ts --timeout 60000",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Compound reservation and exact operation count without relaxing global stop.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "closeout-effects",
      "kind": "command",
      "command": "bun test tests/effects/campaign-closeout.test.ts --timeout 60000",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "baseline_with_delta",
      "necessity": "Ordered merge/Issue/cleanup, unknown outcome and two-process bind races.",
      "inputs": {
        "env": []
      },
      "baseline": {
        "run_file": ".ai/harness/runs/verification-vx-c52d56a1a8ff47fcb5e5.json",
        "execution_id": "vx-c52d56a1a8ff47fcb5e5"
      },
      "delta_checks": [
        "archive-effects",
        "typecheck"
      ]
    },
    {
      "id": "affected",
      "kind": "command",
      "command": "bun test tests/unit/publication-lifecycle.test.ts tests/cli/fleet-feedback.test.ts tests/unit/publication-recovery-reconcile.test.ts tests/coordination-lease-store.test.ts tests/fleet-acquire-concurrency.test.ts tests/sprint-claim-concurrency.test.ts tests/effects/campaign-provider-execution.test.ts tests/effects/brc10-lifecycle.test.ts tests/effects/development-campaign-store.test.ts tests/characterization/repair-campaign-authority-freeze.test.ts --timeout 60000",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "baseline_with_delta",
      "necessity": "Actual publication, coordination, existing Provider and protection consumers.",
      "inputs": {
        "env": []
      },
      "baseline": {
        "run_file": ".ai/harness/runs/verification-vx-c4dd146b5b6e4f1c8130.json",
        "execution_id": "vx-c4dd146b5b6e4f1c8130"
      },
      "delta_checks": [
        "archive-effects",
        "typecheck"
      ]
    },
    {
      "id": "typecheck",
      "kind": "command",
      "command": "bun run check:type",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Cross-module contract type safety.",
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
      "necessity": "Required repository integrity or helper parity.",
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
      "necessity": "Required repository integrity or helper parity.",
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
      "necessity": "Required repository integrity or helper parity.",
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
      "necessity": "Required repository integrity or helper parity.",
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
      "necessity": "Required repository integrity or helper parity.",
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
      "necessity": "Required repository integrity or helper parity.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "cleanup-parity",
      "kind": "command",
      "command": "cmp scripts/contract-worktree.sh assets/templates/helpers/contract-worktree.sh && cmp scripts/archive-workflow.sh assets/templates/helpers/archive-workflow.sh",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Required repository integrity or helper parity.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "archive-effects",
      "kind": "command",
      "command": "bun test tests/archive-evidence-gates.test.ts --timeout 60000",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "One blocking finish fix: scratch clone preserves exact review ref without moving source main; existing evidence gates stay closed.",
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

- Functional behavior: original prepare 18/18 at be1de662; reviewed P1 corrections are included at f009e9b6.
- Edge cases: correction consumer baseline vx-c4dd146b5b6e4f1c8130 passed on f009e9b6 plus deterministic architecture projection. Subsequent delta changes only one test expected error string and workflow evidence; product source is unchanged. Current closeout-effects and typecheck cover that delta. This is baseline plus delta, not a new full-suite claim.
- Regression risks: unknown POST without matching bounded readback remains reconciliation pending; writable inactivity must still be proven.

## Rollback Point

- Commit / checkpoint:
- Revert strategy:

Final publication delta: archive prediction helper now copies the exact configured review target into its private scratch clone. This is the single directly blocking scope extension. Campaign source is unchanged from accepted d439df53; retained transaction evidence vx-c52d56a1a8ff47fcb5e5 and consumer evidence vx-c4dd146b5b6e4f1c8130 are baseline only, combined with current archive-effects, typecheck and all integrity checks.
