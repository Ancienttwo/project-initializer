# Task Contract: brc15a-provider-verification-evidence

> **Status**: Active
> **Plan**: plans/plan-20260908-0205-brc15a-provider-verification-evidence.md
> **Task Profile**: code-change
> <!-- legal values: code-change | docs-only | ledger-closeout | migration | eval-only | delegated-run | bugfix (omit for legacy passthrough); see docs/reference-configs/sprint-contracts.md -->
> **Owner**: ancienttwo
> **Capability ID**: root
> **Last Updated**: 2026-09-08 02:06
> **Review File**: `tasks/reviews/20260908-0205-brc15a-provider-verification-evidence.review.md`
> **Notes File**: `tasks/notes/20260908-0205-brc15a-provider-verification-evidence.notes.md`
> **Exemplar**: `docs/reference-configs/contract-brief-example.md`

## Why

Campaign authoring currently overrides the user model and does not activate the GitHub Connector.

## Goal

Use the configured UI default, require explicit GitHub app selection before send, and preserve provider-owned observations without inventing model or revision authority.

## Scope

- In scope: authoring defaults, Oracle app activation, structured session evidence, corresponding tests and research.
- Out of scope: live GPT calls, new grants, global installation, release, changing exact-SHA acceptance.
- Taste constraints: <!-- advisory only, no run gate; default style/taste lives in AGENTS.md and the minimal-change policy, use this to record a per-task override -->

## Stop Conditions

- Stop and hand back to the parent if the change would require editing a path outside Allowed Paths.
- Stop if an Exit Criteria command cannot be run in this environment.
- Stop if Goal, Scope, or Exit Criteria are internally contradictory.

## Falsifier

A plain text mention satisfying the app-selection check, a changed plugin surviving the send gate, or console text providing session identity falsifies the implementation. Focused DOM and descriptor negative tests guard these boundaries.

## Root Cause Evidence

Required when Task Profile is `bugfix`; leave as-is otherwise.

- root_cause: one sentence naming file:line/condition (testable, not "a state issue").
- repro: the command or UI path that reproduces the symptom.
- regression_guard: path to a test that fails on the unfixed code and passes after the fix (must also appear as a `package_test` check in Verification Plan).
- pre_fix_failure_artifact: path to a captured run of regression_guard on the UNFIXED code. Capture with `bun test <regression_guard> > <artifact> 2>&1; echo "PRE_FIX_EXIT=$?" >> <artifact>` (no pipes — pipes swallow the exit status). The gate requires a non-zero `PRE_FIX_EXIT=` line plus the regression_guard path string in the artifact (see the Root Cause Evidence Gate section in docs/reference-configs/sprint-contracts.md).

## Workflow Inventory

- Source plan: `plans/plan-20260908-0205-brc15a-provider-verification-evidence.md`
- Deferred-goal ledger: `tasks/todos.md`
- Review file: `tasks/reviews/20260908-0205-brc15a-provider-verification-evidence.review.md`
- Notes file: `tasks/notes/20260908-0205-brc15a-provider-verification-evidence.notes.md`
- Checks file: `.ai/harness/checks/latest.json`
- Run snapshots: `.ai/harness/runs/`
- Scope gate: edit only paths listed under `allowed_paths`; update this contract before widening scope.
- Completion gate: run `verify-sprint --prepare-acceptance`, record one typed AcceptanceReceipt under the frozen policy below, then run `verify-sprint`; review Markdown is projection only.

## Change Assessment

```json
{"protocol":1,"oracles":[{"id":"browser-authoring-regressions","kind":"deterministic_test","paths":["*"]}]}
```

## Acceptance Policy

```json
{"protocol":2,"reviewer":"Codex","source":"codex-review","user_waiver":"allowed"}
```

## Allowed Paths

```yaml
allowed_paths:
  - docs/researches/
  - docs/repo-harness-chatgpt-browser-engine.md
  - docs/spec.md
  - plans/
  - tasks/todos.md
  - tasks/contracts/20260908-0205-brc15a-provider-verification-evidence.contract.md
  - tasks/reviews/20260908-0205-brc15a-provider-verification-evidence.review.md
  - tasks/notes/20260908-0205-brc15a-provider-verification-evidence.notes.md
  - .ai/context/capabilities.json
  - .claude/templates/
  - src/
  - tests/
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
    - tasks/notes/20260908-0205-brc15a-provider-verification-evidence.notes.md
```

## Verification Plan

```json
{
  "protocol": 1,
  "checks": [
    {
      "id": "browser-authoring-regressions",
      "kind": "command",
      "command": "bun test tests/unit/oracle-session-evidence.test.ts tests/effects/gpt-pro-issue-authoring.test.ts tests/effects/issue-batch-adoption.test.ts tests/cli/chatgpt-browser.test.ts",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "baseline_with_delta",
      "necessity": "Covers descriptor identity, log-only negative evidence, default-model initial/followup/readback and explicit GitHub request, preserving admission refusal. Immutable execution covers the frozen production/test content. Only task-sync digest and contract evidence binding changed afterward; integrity-2 covers that workflow delta.",
      "inputs": {
        "env": []
      },
      "baseline": {
        "run_file": ".ai/harness/runs/verification-vx-2b525d873c704a5bb9f5.json",
        "execution_id": "vx-2b525d873c704a5bb9f5"
      },
      "delta_checks": [
        "integrity-2"
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
      "necessity": "Checks the changed caller and session contracts.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "integrity-0",
      "kind": "command",
      "command": "bash scripts/check-deploy-sql-order.sh",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Required repository integrity for substantive changes.",
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
      "necessity": "Required repository integrity for substantive changes.",
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
      "necessity": "Required repository integrity for substantive changes.",
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
      "necessity": "Required repository integrity for substantive changes.",
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
      "necessity": "Required repository integrity for substantive changes.",
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
      "necessity": "Required repository integrity for substantive changes.",
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

- Functional behavior: user UI defaults preserved; GitHub selected before send; provider handle identifies the exact metadata observation.
- Edge cases: missing/duplicate/disabled/lost app, malformed handle, wrong parent/session, log-only session IDs remain non-authoritative.
- Regression risks: live Oracle execution of the new selector remains untested without a new GPT grant; manual pre-submit UI and independent activated README probe are narrower evidence.

- Baseline: vx-2b525d873c704a5bb9f5 passed the exact final product/test content; only workflow evidence updated afterward. This is baseline-plus-delta coverage, not a new full-suite claim.

## Rollback Point

- Commit / checkpoint:
- Revert strategy:
