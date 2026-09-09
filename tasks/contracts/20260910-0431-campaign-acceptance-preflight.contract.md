# Task Contract: campaign-acceptance-preflight

> **Status**: Active
> **Plan**: plans/plan-20260910-0431-campaign-acceptance-preflight.md
> **Task Profile**: bugfix
> <!-- legal values: code-change | docs-only | ledger-closeout | migration | eval-only | delegated-run | bugfix (omit for legacy passthrough); see docs/reference-configs/sprint-contracts.md -->
> **Owner**: ancienttwo
> **Capability ID**: root
> **Last Updated**: 2026-09-10 04:31
> **Review File**: `tasks/reviews/20260910-0431-campaign-acceptance-preflight.review.md`
> **Notes File**: `tasks/notes/20260910-0431-campaign-acceptance-preflight.notes.md`
> **Exemplar**: `docs/reference-configs/contract-brief-example.md`

## Why

Real BRC execution passed the business regression but canonical acceptance rejected missing benchmark metadata and acquisition-owned workflow rewrites. Reject invalid metadata before dispatch and preserve the frozen business scope.

## Goal

Campaign admission validates canonical contract metadata without executing acceptance criteria; Fleet acquire preserves all authored workflow bytes while activating the acquired worktree.

## Scope

- In scope: trusted metadata preflight, Fleet activation, model-free regression and durable evidence.
- Out of scope: business allowlist exemptions, budget changes, stopped dispatch replay, model or browser changes.
- Taste constraints: <!-- advisory only, no run gate; default style/taste lives in AGENTS.md and the minimal-change policy, use this to record a per-task override -->

## Stop Conditions

- Stop and hand back to the parent if the change would require editing a path outside Allowed Paths.
- Stop if an Exit Criteria command cannot be run in this environment.
- Stop if Goal, Scope, or Exit Criteria are internally contradictory.

## Falsifier

A valid admitted contract or fresh acquisition still causes canonical scope/metadata failure before its business command. Reproduce with the real packaged helpers in a disposable repository.

## Root Cause Evidence

- root_cause: src/cli/commands/campaign.ts runCampaignPlanningPreflight omits canonical verification metadata, and src/effects/fleet/acquire.ts defaultProject reruns authoring projection after proof freeze, rewriting tracked artifacts outside business allowed_paths.
- repro: bun test tests/cli/campaign-acceptance-preflight.test.ts tests/cli/fleet-offer-acquire.test.ts
- regression_guard: tests/cli/campaign-acceptance-preflight.test.ts
- pre_fix_failure_artifact: tasks/evidence/campaign-acceptance-preflight-pre-fix.log

## Workflow Inventory

- Source plan: `plans/plan-20260910-0431-campaign-acceptance-preflight.md`
- Deferred-goal ledger: `tasks/todos.md`
- Review file: `tasks/reviews/20260910-0431-campaign-acceptance-preflight.review.md`
- Notes file: `tasks/notes/20260910-0431-campaign-acceptance-preflight.notes.md`
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
  - src/cli/commands/campaign.ts
  - src/effects/fleet/acquire.ts
  - scripts/verify-contract.sh
  - assets/templates/helpers/verify-contract.sh
  - tests/cli/campaign-acceptance-preflight.test.ts
  - tests/cli/campaign-planning.test.ts
  - tests/cli/fleet-offer-acquire.test.ts
  - docs/researches/20260910-campaign-acceptance-preflight.md
  - plans/plan-20260910-0431-campaign-acceptance-preflight.md
  - tasks/todos.md
  - tasks/evidence/campaign-acceptance-preflight-pre-fix.log
  - tasks/contracts/20260910-0431-campaign-acceptance-preflight.contract.md
  - tasks/reviews/20260910-0431-campaign-acceptance-preflight.review.md
  - tasks/notes/20260910-0431-campaign-acceptance-preflight.notes.md
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
    - tasks/notes/20260910-0431-campaign-acceptance-preflight.notes.md
```

## Verification Plan

```json
{
  "protocol": 1,
  "checks": [
    {
      "id": "cli-campaign-acceptance-preflight",
      "kind": "package_test",
      "path": "tests/cli/campaign-acceptance-preflight.test.ts",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Covers canonical metadata admission, acquired scope, or existing verification and compensation behavior.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "cli-campaign-planning",
      "kind": "package_test",
      "path": "tests/cli/campaign-planning.test.ts",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Covers canonical metadata admission, acquired scope, or existing verification and compensation behavior.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "cli-fleet-offer-acquire",
      "kind": "package_test",
      "path": "tests/cli/fleet-offer-acquire.test.ts",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Covers canonical metadata admission, acquired scope, or existing verification and compensation behavior.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "verification-lifecycle-adapters",
      "kind": "package_test",
      "path": "tests/verification-lifecycle-adapters.test.ts",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Covers canonical metadata admission, acquired scope, or existing verification and compensation behavior.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "fleet-acquire-concurrency",
      "kind": "package_test",
      "path": "tests/fleet-acquire-concurrency.test.ts",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Covers canonical metadata admission, acquired scope, or existing verification and compensation behavior.",
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
      "necessity": "Required repository integrity or TypeScript verification for the changed helper and CLI boundaries.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "sql",
      "kind": "command",
      "command": "bash scripts/check-deploy-sql-order.sh",
      "cwd": ".",
      "phase": "preflight",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Required repository integrity or TypeScript verification for the changed helper and CLI boundaries.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "architecture",
      "kind": "command",
      "command": "bash scripts/check-architecture-sync.sh",
      "cwd": ".",
      "phase": "preflight",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Required repository integrity or TypeScript verification for the changed helper and CLI boundaries.",
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
      "necessity": "Required repository integrity or TypeScript verification for the changed helper and CLI boundaries.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "workflow",
      "kind": "command",
      "command": "bash scripts/check-task-workflow.sh --strict",
      "cwd": ".",
      "phase": "preflight",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Required repository integrity or TypeScript verification for the changed helper and CLI boundaries.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "inspect",
      "kind": "command",
      "command": "bun scripts/inspect-project-state.ts --repo . --format text",
      "cwd": ".",
      "phase": "preflight",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Required repository integrity or TypeScript verification for the changed helper and CLI boundaries.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "adoption",
      "kind": "command",
      "command": "bun src/cli/index.ts init --repo . --dry-run",
      "cwd": ".",
      "phase": "preflight",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Required repository integrity or TypeScript verification for the changed helper and CLI boundaries.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "installed-tarball",
      "kind": "command",
      "command": "bash scripts/check-tarball-install-smoke.sh",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "The changed bundled helper must remain usable from an installed tarball with its canonical library and dependent helpers.",
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
