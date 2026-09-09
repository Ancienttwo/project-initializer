> **Archived**: 2026-09-10 00:28
> **Related Plan**: plans/archive/plan-20260910-0004-campaign-settled-resume.md
> **Outcome**: Completed
> **Lifecycle**: contract
> **Parent Run ID**: run-20260910-0028
> **Archive Projection V1**: `plans/plan-20260910-0004-campaign-settled-resume.md` => `plans/archive/plan-20260910-0004-campaign-settled-resume.md`
> **Archive Projection V1**: `tasks/notes/20260910-0004-campaign-settled-resume.notes.md` => `tasks/archive/notes-20260910-0028-campaign-settled-resume.md`
> **Archive Projection V1**: `tasks/contracts/20260910-0004-campaign-settled-resume.contract.md` => `tasks/archive/contract-20260910-0028-campaign-settled-resume.md`
> **Archive Projection V1**: `tasks/reviews/20260910-0004-campaign-settled-resume.review.md` => `tasks/archive/review-20260910-0028-campaign-settled-resume.md`

# Task Contract: campaign-settled-resume

> **Status**: Fulfilled
> **Plan**: plans/archive/plan-20260910-0004-campaign-settled-resume.md
> **Task Profile**: code-change
> <!-- legal values: code-change | docs-only | ledger-closeout | migration | eval-only | delegated-run | bugfix (omit for legacy passthrough); see docs/reference-configs/sprint-contracts.md -->
> **Owner**: ancienttwo
> **Capability ID**: root
> **Last Updated**: 2026-09-10 00:04
> **Review File**: `tasks/archive/review-20260910-0028-campaign-settled-resume.md`
> **Notes File**: `tasks/archive/notes-20260910-0028-campaign-settled-resume.md`
> **Exemplar**: `docs/reference-configs/contract-brief-example.md`

## Why

The adopted resume gate treats all successful acquisitions as live work, preventing a new continuation after a settled failed and retired execution. Readiness must come from complete canonical effect evidence, while old grants and counts remain immutable.

## Goal

Allow a fresh adopted continuation only when every prior acquisition has a settled failed final, retired dispatch, released lease and proven inactive container effects. Share this predicate between preflight and author admission.

## Scope

- In scope: validated planning record inventory, failed-dispatch proof, shared adopted-source eligibility, preflight/admission integration and negative tests.
- Out of scope: old-grant revival, lease recovery, counter rewrites, successful task continuation, incomplete runtime results, Docker containment and new Issues.
- Taste constraints: <!-- advisory only, no run gate; default style/taste lives in AGENTS.md and the minimal-change policy, use this to record a per-task override -->

## Stop Conditions

- Stop and hand back to the parent if the change would require editing a path outside Allowed Paths.
- Stop if an Exit Criteria command cannot be run in this environment.
- Stop if Goal, Scope, or Exit Criteria are internally contradictory.

## Falsifier

A new continuation is admitted with incomplete, active, unretired, successful or uncharged predecessor effects; or changes any prior budget counter or Issue identity.

## Root Cause Evidence

Required when Task Profile is `bugfix`; leave as-is otherwise.

- root_cause: one sentence naming file:line/condition (testable, not "a state issue").
- repro: the command or UI path that reproduces the symptom.
- regression_guard: path to a test that fails on the unfixed code and passes after the fix (must also appear as a `package_test` check in Verification Plan).
- pre_fix_failure_artifact: path to a captured run of regression_guard on the UNFIXED code. Capture with `bun test <regression_guard> > <artifact> 2>&1; echo "PRE_FIX_EXIT=$?" >> <artifact>` (no pipes — pipes swallow the exit status). The gate requires a non-zero `PRE_FIX_EXIT=` line plus the regression_guard path string in the artifact (see the Root Cause Evidence Gate section in docs/reference-configs/sprint-contracts.md).

## Workflow Inventory

- Source plan: `plans/archive/plan-20260910-0004-campaign-settled-resume.md`
- Deferred-goal ledger: `tasks/todos.md`
- Review file: `tasks/archive/review-20260910-0028-campaign-settled-resume.md`
- Notes file: `tasks/archive/notes-20260910-0028-campaign-settled-resume.md`
- Checks file: `.ai/harness/checks/latest.json`
- Run snapshots: `.ai/harness/runs/`
- Scope gate: edit only paths listed under `allowed_paths`; update this contract before widening scope.
- Completion gate: run `verify-sprint --prepare-acceptance`, record one typed AcceptanceReceipt under the frozen policy below, then run `verify-sprint`; review Markdown is projection only.

## Change Assessment

```json
{"protocol":1,"oracles":[{"id":"settled-resume-authority","kind":"deterministic_test","paths":["*"]}]}
```

## Acceptance Policy

```json
{"protocol":2,"reviewer":"Codex","source":"codex-plugin","user_waiver":"allowed"}
```

## Allowed Paths

```yaml
allowed_paths:
  - src/effects/automation/campaign-planning-store.ts
  - src/effects/automation/campaign-worker.ts
  - src/effects/automation/campaign-authoring-resume.ts
  - src/effects/automation/gpt-pro-issue-authoring.ts
  - src/cli/commands/campaign.ts
  - tests/effects/campaign-settled-resume.test.ts
  - tests/effects/campaign-authoring-resume.test.ts
  - tests/helpers/historical-campaign-lifecycle.ts
  - docs/researches/20260910-campaign-settled-resume.md
  - docs/architecture/
  - tasks/
  - plans/
  - .archcontext/
  - .ai/context/
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
    - docs/researches/20260910-campaign-settled-resume.md
  artifacts_exist:
    - .ai/harness/checks/latest.json
    - tasks/archive/notes-20260910-0028-campaign-settled-resume.md
```

## Verification Plan

```json
{
  "protocol": 1,
  "checks": [
    {
      "id": "settled-resume",
      "kind": "package_test",
      "path": "tests/effects/campaign-settled-resume.test.ts",
      "necessity": "Canonical settled effect proof and retained rejection boundaries.",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "authoring-resume",
      "kind": "package_test",
      "path": "tests/effects/campaign-authoring-resume.test.ts",
      "necessity": "Canonical settled effect proof and retained rejection boundaries.",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "dispatch-recovery",
      "kind": "package_test",
      "path": "tests/effects/brc10-lifecycle.test.ts",
      "necessity": "Canonical settled effect proof and retained rejection boundaries.",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "typecheck",
      "kind": "command",
      "command": "bun run check:type",
      "necessity": "Required type or repository integrity.",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "sql",
      "kind": "command",
      "command": "bash scripts/check-deploy-sql-order.sh",
      "necessity": "Required type or repository integrity.",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "architecture",
      "kind": "command",
      "command": "bash scripts/check-architecture-sync.sh",
      "necessity": "Required type or repository integrity.",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "task-sync",
      "kind": "command",
      "command": "bash scripts/check-task-sync.sh",
      "necessity": "Required type or repository integrity.",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "workflow",
      "kind": "command",
      "command": "bash scripts/check-task-workflow.sh --strict",
      "necessity": "Required type or repository integrity.",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "state",
      "kind": "command",
      "command": "bun scripts/inspect-project-state.ts --repo . --format text",
      "necessity": "Required type or repository integrity.",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "adoption",
      "kind": "command",
      "command": "bun src/cli/index.ts init --repo . --dry-run",
      "necessity": "Required type or repository integrity.",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
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

- Functional behavior: one fresh continuation with original Issue identities and preserved spending.
- Edge cases: missing/unknown/active/successful predecessor effects refuse before writes or provider dispatch.
- Regression risks: inventory completeness, receipt identity, and source eligibility drift between CLI and admission.

## Rollback Point

- Commit / checkpoint: environment PR #384 head 22714545; rebind after main merge.
- Revert strategy: revert isolated resume PR; no persistent old-authority rewrite is introduced.
