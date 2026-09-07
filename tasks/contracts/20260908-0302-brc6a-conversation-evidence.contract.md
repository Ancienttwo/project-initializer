# Task Contract: brc6a-conversation-evidence

> **Status**: Active
> **Plan**: plans/plan-20260908-0302-brc6a-conversation-evidence.md
> **Task Profile**: docs-only
> <!-- legal values: code-change | docs-only | ledger-closeout | migration | eval-only | delegated-run | bugfix (omit for legacy passthrough); see docs/reference-configs/sprint-contracts.md -->
> **Owner**: ancienttwo
> **Capability ID**: root
> **Last Updated**: 2026-09-08 03:02
> **Review File**: `tasks/reviews/20260908-0302-brc6a-conversation-evidence.review.md`
> **Notes File**: `tasks/notes/20260908-0302-brc6a-conversation-evidence.notes.md`
> **Exemplar**: `docs/reference-configs/contract-brief-example.md`

## Why

Oracle answer text is not a Connector tool response. Preserve a provider-origin history snapshot so audit consumers can inspect the actual evidence boundary.

## Goal

Deliver a bounded read-only Oracle operator capture and durable BRC6a findings; no new model invocation or revision acceptance.

## Scope

- In scope: isolated Oracle collector/script/tests/docs on codex/brc6a-conversation-evidence; this repository records research and verification.
- Out of scope: new GPT runs, budgets, active admission, fresh audit semantics, default model changes and main merge.
- Taste constraints: <!-- advisory only, no run gate; default style/taste lives in AGENTS.md and the minimal-change policy, use this to record a per-task override -->

## Stop Conditions

- Stop and hand back to the parent if the change would require editing a path outside Allowed Paths.
- Stop if an Exit Criteria command cannot be run in this environment.
- Stop if Goal, Scope, or Exit Criteria are internally contradictory.

## Falsifier

The existing-conversation response has no tool-origin records. The read-only preflight instead captured two GitHub fetch_file results; missing original requests remain explicit.

## Root Cause Evidence

Required when Task Profile is `bugfix`; leave as-is otherwise.

- root_cause: one sentence naming file:line/condition (testable, not "a state issue").
- repro: the command or UI path that reproduces the symptom.
- regression_guard: path to a test that fails on the unfixed code and passes after the fix (must also appear as a `package_test` check in Verification Plan).
- pre_fix_failure_artifact: path to a captured run of regression_guard on the UNFIXED code. Capture with `bun test <regression_guard> > <artifact> 2>&1; echo "PRE_FIX_EXIT=$?" >> <artifact>` (no pipes — pipes swallow the exit status). The gate requires a non-zero `PRE_FIX_EXIT=` line plus the regression_guard path string in the artifact (see the Root Cause Evidence Gate section in docs/reference-configs/sprint-contracts.md).

## Workflow Inventory

- Source plan: `plans/plan-20260908-0302-brc6a-conversation-evidence.md`
- Deferred-goal ledger: `tasks/todos.md`
- Review file: `tasks/reviews/20260908-0302-brc6a-conversation-evidence.review.md`
- Notes file: `tasks/notes/20260908-0302-brc6a-conversation-evidence.notes.md`
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
{"protocol":2,"reviewer":"Codex","source":"codex-review","user_waiver":"allowed"}
```

## Allowed Paths

```yaml
allowed_paths:
  - docs/researches/20260908-brc6a-conversation-history-evidence.md
  - plans/
  - tasks/todos.md
  - tasks/contracts/20260908-0302-brc6a-conversation-evidence.contract.md
  - tasks/reviews/20260908-0302-brc6a-conversation-evidence.review.md
  - tasks/notes/20260908-0302-brc6a-conversation-evidence.notes.md
  - docs/architecture/.projection-manifest.json
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
    - docs/researches/20260908-brc6a-conversation-history-evidence.md
  artifacts_exist:
    - .ai/harness/checks/latest.json
    - tasks/notes/20260908-0302-brc6a-conversation-evidence.notes.md
```

## Verification Plan

```json
{
  "protocol": 1,
  "checks": [
    {
      "id": "integrity-0",
      "kind": "command",
      "command": "bash scripts/check-deploy-sql-order.sh",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Required repository integrity for the research and workflow delta; Oracle focused/type/build and read-only live evidence are recorded separately.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "integrity-1",
      "kind": "command",
      "command": "bash scripts/check-architecture-sync.sh",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Required repository integrity for the research and workflow delta; Oracle focused/type/build and read-only live evidence are recorded separately.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "integrity-2",
      "kind": "command",
      "command": "bash scripts/check-task-sync.sh",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Required repository integrity for the research and workflow delta; Oracle focused/type/build and read-only live evidence are recorded separately.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "integrity-3",
      "kind": "command",
      "command": "bash scripts/check-task-workflow.sh --strict",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Required repository integrity for the research and workflow delta; Oracle focused/type/build and read-only live evidence are recorded separately.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "integrity-4",
      "kind": "command",
      "command": "bun scripts/inspect-project-state.ts --repo . --format text",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Required repository integrity for the research and workflow delta; Oracle focused/type/build and read-only live evidence are recorded separately.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "integrity-5",
      "kind": "command",
      "command": "bun src/cli/index.ts init --repo . --dry-run",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Required repository integrity for the research and workflow delta; Oracle focused/type/build and read-only live evidence are recorded separately.",
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
