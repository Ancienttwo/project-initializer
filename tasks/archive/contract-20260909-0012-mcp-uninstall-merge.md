> **Archived**: 2026-09-09 00:12
> **Related Plan**: plans/archive/plan-20260909-0010-mcp-uninstall-merge.md
> **Outcome**: Completed
> **Lifecycle**: contract
> **Parent Run ID**: run-20260909-0012
> **Archive Projection V1**: `plans/plan-20260909-0010-mcp-uninstall-merge.md` => `plans/archive/plan-20260909-0010-mcp-uninstall-merge.md`
> **Archive Projection V1**: `tasks/notes/20260909-0010-mcp-uninstall-merge.notes.md` => `tasks/archive/notes-20260909-0012-mcp-uninstall-merge.md`
> **Archive Projection V1**: `tasks/contracts/20260909-0010-mcp-uninstall-merge.contract.md` => `tasks/archive/contract-20260909-0012-mcp-uninstall-merge.md`
> **Archive Projection V1**: `tasks/reviews/20260909-0010-mcp-uninstall-merge.review.md` => `tasks/archive/review-20260909-0012-mcp-uninstall-merge.md`

# Task Contract: mcp-uninstall-merge

> **Status**: Fulfilled
> **Plan**: plans/archive/plan-20260909-0010-mcp-uninstall-merge.md
> **Task Profile**: code-change
> <!-- legal values: code-change | docs-only | ledger-closeout | migration | eval-only | delegated-run | bugfix (omit for legacy passthrough); see docs/reference-configs/sprint-contracts.md -->
> **Owner**: ancienttwo
> **Capability ID**: root
> **Last Updated**: 2026-09-09 00:10
> **Review File**: `tasks/archive/review-20260909-0012-mcp-uninstall-merge.md`
> **Notes File**: `tasks/archive/notes-20260909-0012-mcp-uninstall-merge.md`
> **Exemplar**: `docs/reference-configs/contract-brief-example.md`

## Why

Owner approved merging the completed MCP uninstall after main synchronized; immutable prior archives must remain intact.

## Goal

Merge accepted MCP uninstall onto current main and clean only its worktree after current-base verification.

## Scope

- In scope: current-base integration, existing verification and local publication.
- Out of scope: new implementation, release, unrelated WIP.
- Taste constraints: <!-- advisory only, no run gate; default style/taste lives in AGENTS.md and the minimal-change policy, use this to record a per-task override -->

## Stop Conditions

- Stop and hand back to the parent if the change would require editing a path outside Allowed Paths.
- Stop if an Exit Criteria command cannot be run in this environment.
- Stop if Goal, Scope, or Exit Criteria are internally contradictory.

## Falsifier

Any MCP source/test delta from f3b96cfd or loss of main architecture drift changes would falsify this integration.

## Root Cause Evidence

Required when Task Profile is `bugfix`; leave as-is otherwise.

- root_cause: one sentence naming file:line/condition (testable, not "a state issue").
- repro: the command or UI path that reproduces the symptom.
- regression_guard: path to a test that fails on the unfixed code and passes after the fix (must also appear as a `package_test` check in Verification Plan).
- pre_fix_failure_artifact: path to a captured run of regression_guard on the UNFIXED code. Capture with `bun test <regression_guard> > <artifact> 2>&1; echo "PRE_FIX_EXIT=$?" >> <artifact>` (no pipes — pipes swallow the exit status). The gate requires a non-zero `PRE_FIX_EXIT=` line plus the regression_guard path string in the artifact (see the Root Cause Evidence Gate section in docs/reference-configs/sprint-contracts.md).

## Workflow Inventory

- Source plan: `plans/archive/plan-20260909-0010-mcp-uninstall-merge.md`
- Deferred-goal ledger: `tasks/todos.md`
- Review file: `tasks/archive/review-20260909-0012-mcp-uninstall-merge.md`
- Notes file: `tasks/archive/notes-20260909-0012-mcp-uninstall-merge.md`
- Checks file: `.ai/harness/checks/latest.json`
- Run snapshots: `.ai/harness/runs/`
- Scope gate: edit only paths listed under `allowed_paths`; update this contract before widening scope.
- Completion gate: run `verify-sprint --prepare-acceptance`, record one typed AcceptanceReceipt under the frozen policy below, then run `verify-sprint`; review Markdown is projection only.

## Change Assessment

```json
{"protocol": 1, "oracles": [{"id": "mcp", "kind": "deterministic_test", "paths": ["src/cli/mcp/uninstall.ts", "src/cli/mcp/setup-ownership.ts", "src/cli/mcp/setup.ts", "src/effects/repo-registry.ts"]}, {"id": "ownership", "kind": "deterministic_test", "paths": ["src/cli/installer/configuration-ownership.ts", "src/cli/installer/uninstall.ts"]}]}
```

## Acceptance Policy

```json
{"protocol":2,"reviewer":"Codex","source":"codex-review","user_waiver":"allowed"}
```

## Allowed Paths

```yaml
allowed_paths:
  - docs/spec.md
  - plans/
  - tasks/todos.md
  - tasks/archive/contract-20260909-0012-mcp-uninstall-merge.md
  - tasks/archive/review-20260909-0012-mcp-uninstall-merge.md
  - tasks/archive/notes-20260909-0012-mcp-uninstall-merge.md
  - tasks/archive/
  - docs/architecture/
  - docs/repo-harness-chatgpt-mcp-setup.md
  - README.md
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
    - tasks/archive/notes-20260909-0012-mcp-uninstall-merge.md
```

## Verification Plan

```json
{
  "protocol": 1,
  "checks": [
    {
      "id": "mcp",
      "kind": "command",
      "command": "bun test tests/cli/mcp-uninstall.test.ts tests/cli/mcp-setup.test.ts tests/cli/registry.test.ts",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Verify bounded MCP teardown, shared ownership and required repository integrity.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "ownership",
      "kind": "command",
      "command": "bun test tests/cli/configuration-ownership.test.ts tests/cli/uninstall.test.ts",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Verify bounded MCP teardown, shared ownership and required repository integrity.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "types",
      "kind": "command",
      "command": "bun run check:type",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Verify bounded MCP teardown, shared ownership and required repository integrity.",
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
      "necessity": "Verify bounded MCP teardown, shared ownership and required repository integrity.",
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
      "necessity": "Verify bounded MCP teardown, shared ownership and required repository integrity.",
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
      "necessity": "Verify bounded MCP teardown, shared ownership and required repository integrity.",
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
      "necessity": "Verify bounded MCP teardown, shared ownership and required repository integrity.",
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
      "necessity": "Verify bounded MCP teardown, shared ownership and required repository integrity.",
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
      "necessity": "Verify bounded MCP teardown, shared ownership and required repository integrity.",
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
