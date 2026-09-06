# Task Contract: context-files-ci-step

> **Status**: Active
> **Plan**: plans/plan-20260906-0338-context-files-ci-step.md
> **Task Profile**: code-change
> <!-- legal values: code-change | docs-only | ledger-closeout | migration | eval-only | delegated-run | bugfix (omit for legacy passthrough); see docs/reference-configs/sprint-contracts.md -->
> **Owner**: ancienttwo
> **Capability ID**: root
> **Last Updated**: 2026-09-06 03:38
> **Review File**: `tasks/reviews/20260906-0338-context-files-ci-step.review.md`
> **Notes File**: `tasks/notes/20260906-0338-context-files-ci-step.notes.md`
> **Exemplar**: `docs/reference-configs/contract-brief-example.md`

## Why

The prompt-injection and secret scan over agent context files runs only when an operator remembers `check:context-files`. Nothing on the PR path executes it, so an injected instruction or secret in a context file merges silently.

## Goal

`scripts/check-ci.sh` runs `bash scripts/check-context-files.sh` as a named `[ci] context files` step in the workflow-checks block, after deploy-sql-order and before architecture-sync; the scan exits 0 on this branch.

## Scope

- In scope: the two-line step in `scripts/check-ci.sh`; `tests/bootstrap-files.test.ts` only if it asserts the step list.
- Out of scope: changing the scan, package.json, workflow YAML, or any other check.
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
- regression_guard: path to a test that fails on the unfixed code and passes after the fix (must also appear under exit_criteria.tests_pass).
- pre_fix_failure_artifact: path to a captured run of regression_guard on the UNFIXED code. Capture with `bun test <regression_guard> > <artifact> 2>&1; echo "PRE_FIX_EXIT=$?" >> <artifact>` (no pipes — pipes swallow the exit status). The gate requires a non-zero `PRE_FIX_EXIT=` line plus the regression_guard path string in the artifact (see the Root Cause Evidence Gate section in docs/reference-configs/sprint-contracts.md).

## Workflow Inventory

- Source plan: `plans/plan-20260906-0338-context-files-ci-step.md`
- Deferred-goal ledger: `tasks/todos.md`
- Review file: `tasks/reviews/20260906-0338-context-files-ci-step.review.md`
- Notes file: `tasks/notes/20260906-0338-context-files-ci-step.notes.md`
- Checks file: `.ai/harness/checks/latest.json`
- Run snapshots: `.ai/harness/runs/`
- Scope gate: edit only paths listed under `allowed_paths`; update this contract before widening scope.
- Completion gate: run `verify-sprint --prepare-acceptance`, record one typed AcceptanceReceipt under the frozen policy below, then run `verify-sprint`; review Markdown is projection only.

## Change Assessment

```json
{"protocol":1,"oracles":[{"id":"ci-step-wiring","kind":"deterministic_test","paths":["scripts/check-ci.sh","tests/bootstrap-files.test.ts"]}]}
```

## Acceptance Policy

```json
{"protocol":2,"reviewer":"Codex","source":"codex-review","user_waiver":"allowed"}
```

## Allowed Paths

```yaml
allowed_paths:
  - plans/plan-20260906-0338-context-files-ci-step.md
  - tasks/contracts/20260906-0338-context-files-ci-step.contract.md
  - tasks/reviews/20260906-0338-context-files-ci-step.review.md
  - tasks/notes/20260906-0338-context-files-ci-step.notes.md
  - tasks/todos.md
  - scripts/check-ci.sh
  - tests/bootstrap-files.test.ts
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

Executable checks are authored only in the canonical `## Verification Plan` JSON block below. Each typed descriptor records its command or package-test path, phase, cost, evidence policy, necessity, and declared inputs. The YAML `exit_criteria` block contains non-executable assertions only; retired `tests_pass`, `commands_succeed`, and `criterion_reuse` lists are not valid authoring surfaces.
```yaml
exit_criteria:
  files_exist:
    - scripts/check-ci.sh
  artifacts_exist:
    - .ai/harness/checks/latest.json
    - tasks/notes/20260906-0338-context-files-ci-step.notes.md
```


## Verification Plan

```json
{
  "protocol": 1,
  "checks": [
    {
      "id": "bootstrap-files",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Verifies the CI step wiring.",
      "inputs": {
        "env": []
      },
      "kind": "package_test",
      "path": "tests/bootstrap-files.test.ts"
    },
    {
      "id": "check-ci-syntax",
      "cwd": ".",
      "phase": "preflight",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Checks check-ci shell syntax.",
      "inputs": {
        "env": []
      },
      "kind": "command",
      "command": "bash -n scripts/check-ci.sh"
    },
    {
      "id": "context-files",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Runs the context-files CI check.",
      "inputs": {
        "env": []
      },
      "kind": "command",
      "command": "bash scripts/check-context-files.sh"
    }
  ]
}
```

## Acceptance Notes (Human Review)

- Functional behavior:
- Edge cases:
- Regression risks:

## Rollback Point

- Commit / checkpoint:
- Revert strategy:
