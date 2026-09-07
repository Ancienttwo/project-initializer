# Task Contract: brc15a-adoption-alignment

> **Status**: Active
> **Plan**: plans/plan-20260908-0143-brc15a-adoption-alignment.md
> **Task Profile**: bugfix
> <!-- legal values: code-change | docs-only | ledger-closeout | migration | eval-only | delegated-run | bugfix (omit for legacy passthrough); see docs/reference-configs/sprint-contracts.md -->
> **Owner**: ancienttwo
> **Capability ID**: root
> **Last Updated**: 2026-09-08 01:44
> **Review File**: `tasks/reviews/20260908-0143-brc15a-adoption-alignment.review.md`
> **Notes File**: `tasks/notes/20260908-0143-brc15a-adoption-alignment.notes.md`
> **Exemplar**: `docs/reference-configs/contract-brief-example.md`

## Why

The real BRC15a run created ten Issues but admitted none; prompt and verification projections omitted the contracts consumed by adoption.

## Goal

Make authoring convey the existing metadata and exact capability authority; refuse incomplete snapshot policies before any provider launch; correct model verification projection only where exact provider evidence proves it.

## Scope

- In scope: approved bounded authoring/adoption alignment, deterministic regressions, native integrity checks and durable evidence.
- Out of scope: live GPT, grant minting, old receipt rewrite, active campaign, release and unrelated main WIP.
- Taste constraints: <!-- advisory only, no run gate; default style/taste lives in AGENTS.md and the minimal-change policy, use this to record a per-task override -->

## Stop Conditions

- Stop and hand back to the parent if the change would require editing a path outside Allowed Paths.
- Stop if an Exit Criteria command cannot be run in this environment.
- Stop if Goal, Scope, or Exit Criteria are internally contradictory.

## Falsifier

A prompt built from dirty capability bytes, a missing registry admitting provider I/O, or issue-number selection passing startup would falsify the correction; the focused tests exercise these cases.

## Root Cause Evidence

Required when Task Profile is `bugfix`; leave as-is otherwise.

- root_cause: gpt-pro-issue-authoring.ts buildIssueAuthoringPrompt omits metadata types and exact capability vocabulary; development-campaign-policy.ts admits issue-number selection that the full snapshot reader rejects.
- repro: bun test tests/effects/gpt-pro-issue-authoring.test.ts tests/unit/development-campaign-policy.test.ts
- regression_guard: tests/effects/gpt-pro-issue-authoring.test.ts
- pre_fix_failure_artifact: tasks/reviews/20260908-0143-brc15a-adoption-alignment.pre-fix.log

## Workflow Inventory

- Source plan: `plans/plan-20260908-0143-brc15a-adoption-alignment.md`
- Deferred-goal ledger: `tasks/todos.md`
- Review file: `tasks/reviews/20260908-0143-brc15a-adoption-alignment.review.md`
- Notes file: `tasks/notes/20260908-0143-brc15a-adoption-alignment.notes.md`
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
  - tasks/todos.md
  - tasks/reviews/20260908-0143-brc15a-adoption-alignment.pre-fix.log
  - docs/architecture/.projection-manifest.json
  - src/core/automation/issue-batch-reconcile.ts
  - src/effects/automation/gpt-pro-issue-authoring.ts
  - src/effects/automation/issue-batch-adoption.ts
  - src/effects/automation/campaign-capability-registry.ts
  - src/effects/automation/development-campaign-policy.ts
  - src/cli/chatgpt-browser/
  - tests/effects/development-campaign-store.test.ts
  - tests/effects/gpt-pro-issue-authoring.test.ts
  - tests/unit/development-campaign-policy.test.ts
  - tests/unit/issue-batch-reconcile.test.ts
  - tests/cli/chatgpt-browser.test.ts
  - tests/fixtures/repair-campaign/protected-capabilities.json
  - docs/researches/20260908-brc15a-adoption-alignment.md
  - plans/plan-20260908-0143-brc15a-adoption-alignment.md
  - tasks/contracts/20260908-0143-brc15a-adoption-alignment.contract.md
  - tasks/reviews/20260908-0143-brc15a-adoption-alignment.review.md
  - tasks/notes/20260908-0143-brc15a-adoption-alignment.notes.md
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
    - docs/researches/20260908-brc15a-adoption-alignment.md
  artifacts_exist:
    - .ai/harness/checks/latest.json
    - tasks/notes/20260908-0143-brc15a-adoption-alignment.notes.md
```

## Verification Plan

```json
{
  "protocol": 1,
  "checks": [
    {
      "id": "authoring-regression",
      "kind": "package_test",
      "path": "tests/effects/gpt-pro-issue-authoring.test.ts",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Replays metadata and exact registry authority regression before provider I/O.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "boundary-check-0",
      "kind": "command",
      "command": "bun test tests/unit/development-campaign-policy.test.ts tests/unit/issue-batch-reconcile.test.ts tests/effects/issue-batch-adoption.test.ts tests/effects/development-campaign-store.test.ts tests/cli/chatgpt-browser.test.ts --timeout 60000",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Named affected boundary coverage or required repository integrity; no full-suite trigger.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "boundary-check-1",
      "kind": "command",
      "command": "bun run check:type",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Named affected boundary coverage or required repository integrity; no full-suite trigger.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "boundary-check-2",
      "kind": "command",
      "command": "bash scripts/check-deploy-sql-order.sh",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Named affected boundary coverage or required repository integrity; no full-suite trigger.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "boundary-check-3",
      "kind": "command",
      "command": "bash scripts/check-architecture-sync.sh",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Named affected boundary coverage or required repository integrity; no full-suite trigger.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "boundary-check-4",
      "kind": "command",
      "command": "bash scripts/check-task-sync.sh",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Named affected boundary coverage or required repository integrity; no full-suite trigger.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "boundary-check-5",
      "kind": "command",
      "command": "bash scripts/check-task-workflow.sh --strict",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Named affected boundary coverage or required repository integrity; no full-suite trigger.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "boundary-check-6",
      "kind": "command",
      "command": "bun scripts/inspect-project-state.ts --repo . --format text",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Named affected boundary coverage or required repository integrity; no full-suite trigger.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "boundary-check-7",
      "kind": "command",
      "command": "bun src/cli/index.ts init --repo . --dry-run",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Named affected boundary coverage or required repository integrity; no full-suite trigger.",
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

- Functional behavior: metadata constraints and frozen capability IDs reach initial and continuation prompts; startup rejects incomplete issue-number snapshots.
- Edge cases: dirty current registry is ignored; missing frozen registry refuses before intent and provider I/O.
- Regression risks: Oracle effort authority remains absent, so model verification remains false and BRC15a is pending. No provider call or old receipt mutation.

## Rollback Point

- Commit / checkpoint: main 33c5012e1185a695fdaf54a7bb84fc613cfb653b.
- Revert strategy: revert only the bounded alignment commit; preserve the independent canary and Oracle packages.
