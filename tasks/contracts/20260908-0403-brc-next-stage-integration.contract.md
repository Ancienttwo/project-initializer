# Task Contract: brc-next-stage-integration

> **Status**: Active
> **Plan**: plans/plan-20260908-0403-brc-next-stage-integration.md
> **Task Profile**: code-change
> <!-- legal values: code-change | docs-only | ledger-closeout | migration | eval-only | delegated-run | bugfix (omit for legacy passthrough); see docs/reference-configs/sprint-contracts.md -->
> **Owner**: ancienttwo
> **Capability ID**: root
> **Last Updated**: 2026-09-08 04:03
> **Review File**: `tasks/reviews/20260908-0403-brc-next-stage-integration.review.md`
> **Notes File**: `tasks/notes/20260908-0403-brc-next-stage-integration.notes.md`
> **Exemplar**: `docs/reference-configs/contract-brief-example.md`

## Why

Two accepted BRC work packages overlap in authoring/adoption inputs but are not yet integrated. The user explicitly stopped further BRC6a probes and directed the next stage.

## Goal

Combine accepted schema/snapshot alignment and user-default/GitHub activation behavior in an isolated candidate, preserving unverified exact-version gates and main WIP.

## Scope

- In scope: merge accepted branches, resolve only their overlapping changes, focused combined verification and integration research.
- Out of scope: GPT calls, stopped grants, BRC6a reprobes, new audit authority, main merge, release/install.
- Preserve current UI defaults and real app activation.

## Stop Conditions

- Stop and hand back to the parent if the change would require editing a path outside Allowed Paths.
- Stop if an Exit Criteria command cannot be run in this environment.
- Stop if Goal, Scope, or Exit Criteria are internally contradictory.

## Falsifier

The integrated authoring input must contain the frozen registry metadata contract and GitHub activation with no model/thinking injection; any lost field, broadened admission or failed combined regression rejects integration.

## Root Cause Evidence

Required when Task Profile is `bugfix`; leave as-is otherwise.

- root_cause: one sentence naming file:line/condition (testable, not "a state issue").
- repro: the command or UI path that reproduces the symptom.
- regression_guard: path to a test that fails on the unfixed code and passes after the fix (must also appear as a `package_test` check in Verification Plan).
- pre_fix_failure_artifact: path to a captured run of regression_guard on the UNFIXED code. Capture with `bun test <regression_guard> > <artifact> 2>&1; echo "PRE_FIX_EXIT=$?" >> <artifact>` (no pipes — pipes swallow the exit status). The gate requires a non-zero `PRE_FIX_EXIT=` line plus the regression_guard path string in the artifact (see the Root Cause Evidence Gate section in docs/reference-configs/sprint-contracts.md).

## Workflow Inventory

- Source plan: `plans/plan-20260908-0403-brc-next-stage-integration.md`
- Deferred-goal ledger: `tasks/todos.md`
- Review file: `tasks/reviews/20260908-0403-brc-next-stage-integration.review.md`
- Notes file: `tasks/notes/20260908-0403-brc-next-stage-integration.notes.md`
- Checks file: `.ai/harness/checks/latest.json`
- Run snapshots: `.ai/harness/runs/`
- Scope gate: edit only paths listed under `allowed_paths`; update this contract before widening scope.
- Completion gate: run `verify-sprint --prepare-acceptance`, record one typed AcceptanceReceipt under the frozen policy below, then run `verify-sprint`; review Markdown is projection only.

## Change Assessment

```json
{"protocol": 1, "oracles": [{"id": "combined-regressions", "kind": "deterministic_test", "paths": ["*"]}]}
```

## Acceptance Policy

```json
{"protocol":2,"reviewer":"Codex","source":"codex-review","user_waiver":"allowed"}
```

## Allowed Paths

```yaml
allowed_paths:
  - docs/architecture/.projection-manifest.json
  - docs/repo-harness-chatgpt-browser-engine.md
  - docs/researches/20260908-brc-default-github-provider-evidence.md
  - docs/researches/20260908-brc-next-stage-integration.md
  - docs/researches/20260908-brc15a-adoption-alignment.md
  - plans/
  - plans/archive/plan-20260908-0143-brc15a-adoption-alignment.md
  - plans/archive/plan-20260908-0205-brc15a-provider-verification-evidence.md
  - src/cli/chatgpt-browser/engine.ts
  - src/cli/chatgpt-browser/oracle-provider.ts
  - src/cli/chatgpt-browser/oracle-session-evidence.ts
  - src/cli/chatgpt-browser/session-store.ts
  - src/cli/chatgpt-browser/types.ts
  - src/core/automation/issue-batch-reconcile.ts
  - src/effects/automation/campaign-capability-registry.ts
  - src/effects/automation/development-campaign-policy.ts
  - src/effects/automation/gpt-pro-issue-authoring.ts
  - src/effects/automation/issue-batch-adoption.ts
  - tasks/archive/contract-20260908-0205-brc15a-adoption-alignment.md
  - tasks/archive/contract-20260908-0251-brc15a-provider-verification-evidence.md
  - tasks/archive/notes-20260908-0205-brc15a-adoption-alignment.md
  - tasks/archive/notes-20260908-0251-brc15a-provider-verification-evidence.md
  - tasks/archive/review-20260908-0205-brc15a-adoption-alignment.md
  - tasks/archive/review-20260908-0251-brc15a-provider-verification-evidence.md
  - tasks/archive/todo-20260908-0205-brc15a-adoption-alignment.md
  - tasks/archive/todo-20260908-0251-brc15a-provider-verification-evidence.md
  - tasks/contracts/20260908-0403-brc-next-stage-integration.contract.md
  - tasks/notes/20260908-0403-brc-next-stage-integration.notes.md
  - tasks/reviews/20260908-0143-brc15a-adoption-alignment.pre-fix.log
  - tasks/reviews/20260908-0403-brc-next-stage-integration.review.md
  - tasks/todos.md
  - tests/cli/chatgpt-browser.test.ts
  - tests/cli/development-campaign.test.ts
  - tests/effects/development-campaign-store.test.ts
  - tests/effects/gpt-pro-issue-authoring.test.ts
  - tests/unit/development-campaign-policy.test.ts
  - tests/unit/issue-batch-reconcile.test.ts
  - tests/unit/oracle-session-evidence.test.ts
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

```yaml
exit_criteria:
  files_exist:
    - docs/researches/20260908-brc-next-stage-integration.md
  artifacts_exist:
    - .ai/harness/checks/latest.json
    - tasks/notes/20260908-0403-brc-next-stage-integration.notes.md
```

## Verification Plan

```json
{
  "protocol": 1,
  "checks": [
    {
      "id": "combined-regressions",
      "kind": "command",
      "command": "bun test --timeout 60000 tests/effects/gpt-pro-issue-authoring.test.ts tests/unit/issue-batch-reconcile.test.ts tests/unit/development-campaign-policy.test.ts tests/effects/development-campaign-store.test.ts tests/cli/development-campaign.test.ts tests/cli/chatgpt-browser.test.ts tests/unit/oracle-session-evidence.test.ts",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Proves combined accepted authoring/browser/policy inputs and required repository integrity on the new integrated subject.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "typecheck",
      "kind": "command",
      "command": "bun run check:type",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Proves combined accepted authoring/browser/policy inputs and required repository integrity on the new integrated subject.",
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
      "necessity": "Proves combined accepted authoring/browser/policy inputs and required repository integrity on the new integrated subject.",
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
      "necessity": "Proves combined accepted authoring/browser/policy inputs and required repository integrity on the new integrated subject.",
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
      "necessity": "Proves combined accepted authoring/browser/policy inputs and required repository integrity on the new integrated subject.",
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
      "necessity": "Proves combined accepted authoring/browser/policy inputs and required repository integrity on the new integrated subject.",
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
      "necessity": "Proves combined accepted authoring/browser/policy inputs and required repository integrity on the new integrated subject.",
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
      "necessity": "Proves combined accepted authoring/browser/policy inputs and required repository integrity on the new integrated subject.",
      "inputs": {
        "env": []
      }
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
