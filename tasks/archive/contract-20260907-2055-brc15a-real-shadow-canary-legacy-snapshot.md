> **Archived**: 2026-09-10
> **Outcome**: Historical snapshot; superseded by later negative-observation closeout, not accepted by this cleanup
> **Source Commit**: `f8a9dea9e157e2494472c9c223d5662cd521bfe3`
> **Source Path**: `tasks/contracts/20260907-2055-brc15a-real-shadow-canary.contract.md`

# Task Contract: brc15a-real-shadow-canary

> **Status**: Fulfilled
> **Plan**: plans/archive/plan-20260907-2055-brc15a-real-shadow-canary-legacy-snapshot.md
> **Task Profile**: eval-only
> <!-- legal values: code-change | docs-only | ledger-closeout | migration | eval-only | delegated-run | bugfix (omit for legacy passthrough); see docs/reference-configs/sprint-contracts.md -->
> **Owner**: ancienttwo
> **Capability ID**: root
> **Last Updated**: 2026-09-07 21:06
> **Review File**: `tasks/archive/review-20260907-2055-brc15a-real-shadow-canary-legacy-snapshot.md`
> **Notes File**: `tasks/archive/notes-20260907-2055-brc15a-real-shadow-canary-legacy-snapshot.md`
> **Exemplar**: `docs/reference-configs/contract-brief-example.md`

## Why

Fixture passes do not establish real GPT Issue authoring usefulness or current Connector access; BRC15a requires bounded real observation.

## Goal

Execute the approved private BRC15a shadow canary through existing product authoring and observation authorities, record actual results and the subsequent user investment decision.

## Scope

- In scope: approved plan external setup and bounded grant; real shadow authoring/observation; redacted report and canonical acceptance artifacts.
- Out of scope: product code, active repair, Task/Claim creation, Issue closure, PR/merge in the canary, release, exact-SHA producer implementation.
- Taste constraints: <!-- advisory only, no run gate; default style/taste lives in AGENTS.md and the minimal-change policy, use this to record a per-task override -->

## Stop Conditions

- Stop and hand back to the parent if the change would require editing a path outside Allowed Paths.
- Stop if an Exit Criteria command cannot be run in this environment.
- Stop if Goal, Scope, or Exit Criteria are internally contradictory.

## Falsifier

A real provider permission failure, unavailable authority, unknown effect, or budget stop falsifies runnable readiness. Preserve the negative result; never fabricate Issue or revision evidence.

## Root Cause Evidence

Required when Task Profile is `bugfix`; leave as-is otherwise.

- root_cause: one sentence naming file:line/condition (testable, not "a state issue").
- repro: the command or UI path that reproduces the symptom.
- regression_guard: path to a test that fails on the unfixed code and passes after the fix (must also appear as a `package_test` check in Verification Plan).
- pre_fix_failure_artifact: path to a captured run of regression_guard on the UNFIXED code. Capture with `bun test <regression_guard> > <artifact> 2>&1; echo "PRE_FIX_EXIT=$?" >> <artifact>` (no pipes — pipes swallow the exit status). The gate requires a non-zero `PRE_FIX_EXIT=` line plus the regression_guard path string in the artifact (see the Root Cause Evidence Gate section in docs/reference-configs/sprint-contracts.md).

## Workflow Inventory

- Source plan: `plans/archive/plan-20260907-2055-brc15a-real-shadow-canary-legacy-snapshot.md`
- Deferred-goal ledger: `tasks/todos.md`
- Review file: `tasks/archive/review-20260907-2055-brc15a-real-shadow-canary-legacy-snapshot.md`
- Notes file: `tasks/archive/notes-20260907-2055-brc15a-real-shadow-canary-legacy-snapshot.md`
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
  - plans/archive/plan-20260907-2055-brc15a-real-shadow-canary-legacy-snapshot.md
  - plans/sprints/20260902-2238-gpt-pro-seeded-repair-campaign.sprint.md
  - docs/researches/20260907-brc15a-real-shadow-canary.md
  - tasks/archive/contract-20260907-2055-brc15a-real-shadow-canary-legacy-snapshot.md
  - tasks/archive/review-20260907-2055-brc15a-real-shadow-canary-legacy-snapshot.md
  - tasks/archive/notes-20260907-2055-brc15a-real-shadow-canary-legacy-snapshot.md
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
    - docs/researches/20260907-brc15a-real-shadow-canary.md
  artifacts_exist:
    - .ai/harness/checks/latest.json
    - tasks/archive/notes-20260907-2055-brc15a-real-shadow-canary-legacy-snapshot.md
```

## Verification Plan

```json
{
  "protocol": 1,
  "checks": [
    {
      "id": "integrity-1",
      "kind": "command",
      "command": "bash scripts/check-deploy-sql-order.sh",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Required repository integrity for durable canary evidence and workflow artifacts.",
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
      "necessity": "Required repository integrity for durable canary evidence and workflow artifacts.",
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
      "necessity": "Required repository integrity for durable canary evidence and workflow artifacts.",
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
      "necessity": "Required repository integrity for durable canary evidence and workflow artifacts.",
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
      "necessity": "Required repository integrity for durable canary evidence and workflow artifacts.",
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
      "necessity": "Required repository integrity for durable canary evidence and workflow artifacts.",
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

- Functional behavior: real external evaluation evidence is captured once under the approved 64 invocation / 2 round / 2700 second grant; no automated replay of external mutations in verification.
- Edge cases: unknown requires reconciliation; negative results are valid observations, user decision remains required.
- Regression risks: no product source changes. Existing BRC6a/BRC9 focused and CI evidence is baseline only; no full-suite trigger.

## Rollback Point

- Commit / checkpoint:
- Revert strategy:
