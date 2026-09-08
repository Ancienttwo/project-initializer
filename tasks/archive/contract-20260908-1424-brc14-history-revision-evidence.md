> **Archived**: 2026-09-08 14:24
> **Related Plan**: plans/archive/plan-20260908-1350-brc14-history-revision-evidence.md
> **Outcome**: Completed
> **Lifecycle**: contract
> **Parent Run ID**: run-20260908-1424
> **Archive Projection V1**: `plans/plan-20260908-1350-brc14-history-revision-evidence.md` => `plans/archive/plan-20260908-1350-brc14-history-revision-evidence.md`
> **Archive Projection V1**: `tasks/notes/20260908-1350-brc14-history-revision-evidence.notes.md` => `tasks/archive/notes-20260908-1424-brc14-history-revision-evidence.md`
> **Archive Projection V1**: `tasks/contracts/20260908-1350-brc14-history-revision-evidence.contract.md` => `tasks/archive/contract-20260908-1424-brc14-history-revision-evidence.md`
> **Archive Projection V1**: `tasks/reviews/20260908-1350-brc14-history-revision-evidence.review.md` => `tasks/archive/review-20260908-1424-brc14-history-revision-evidence.md`

# Task Contract: brc14-history-revision-evidence

> **Status**: Fulfilled
> **Plan**: plans/archive/plan-20260908-1350-brc14-history-revision-evidence.md
> **Task Profile**: code-change
> <!-- legal values: code-change | docs-only | ledger-closeout | migration | eval-only | delegated-run | bugfix (omit for legacy passthrough); see docs/reference-configs/sprint-contracts.md -->
> **Owner**: ancienttwo
> **Capability ID**: root
> **Last Updated**: 2026-09-08 13:50
> **Review File**: `tasks/archive/review-20260908-1424-brc14-history-revision-evidence.md`
> **Notes File**: `tasks/archive/notes-20260908-1424-brc14-history-revision-evidence.md`
> **Exemplar**: `docs/reference-configs/contract-brief-example.md`

## Why

BRC14 currently cannot accept any group because exact revision provenance has no producer. Real provider history now supplies complete GitHub commit/ref tool returns; safe consumption must preserve session and group identity.

## Goal

Capture provider history at the owning browser boundary, validate exact GitHub commit/ref provenance, and enable verified fresh-audit recommendations to use existing bounded group transitions while keeping active admission disabled.

## Scope

- In scope: Oracle history output, session binding, private capture reader, strict campaign revision decoder, fresh audit protocol and sequencing, focused tests and durable evidence.
- Out of scope: active admission, new GPT calls, GitHub writes, BRC6a reopening, BRC15a reruns, release and main WIP.
- Taste constraints: one strict history producer; missing or malformed authority remains unverified.

## Stop Conditions

- Stop and hand back to the parent if the change would require editing a path outside Allowed Paths.
- Stop if an Exit Criteria command cannot be run in this environment.
- Stop if Goal, Scope, or Exit Criteria are internally contradictory.

## Falsifier

A provider response cannot bind same conversation/turn/connector and complete GitHub commit/ref identities. Validate real captured history and adversarial fixtures before changing fresh audit acceptance.

## Root Cause Evidence

Required when Task Profile is `bugfix`; leave as-is otherwise.

- root_cause: one sentence naming file:line/condition (testable, not "a state issue").
- repro: the command or UI path that reproduces the symptom.
- regression_guard: path to a test that fails on the unfixed code and passes after the fix (must also appear as a `package_test` check in Verification Plan).
- pre_fix_failure_artifact: path to a captured run of regression_guard on the UNFIXED code. Capture with `bun test <regression_guard> > <artifact> 2>&1; echo "PRE_FIX_EXIT=$?" >> <artifact>` (no pipes — pipes swallow the exit status). The gate requires a non-zero `PRE_FIX_EXIT=` line plus the regression_guard path string in the artifact (see the Root Cause Evidence Gate section in docs/reference-configs/sprint-contracts.md).

## Workflow Inventory

- Source plan: `plans/archive/plan-20260908-1350-brc14-history-revision-evidence.md`
- Deferred-goal ledger: `tasks/todos.md`
- Review file: `tasks/archive/review-20260908-1424-brc14-history-revision-evidence.md`
- Notes file: `tasks/archive/notes-20260908-1424-brc14-history-revision-evidence.md`
- Checks file: `.ai/harness/checks/latest.json`
- Run snapshots: `.ai/harness/runs/`
- Scope gate: edit only paths listed under `allowed_paths`; update this contract before widening scope.
- Completion gate: run `verify-sprint --prepare-acceptance`, record one typed AcceptanceReceipt under the frozen policy below, then run `verify-sprint`; review Markdown is projection only.

## Change Assessment

```json
{"protocol":1,"oracles":[{"id":"history-revision","kind":"deterministic_test","paths":["*"]}]}
```

## Acceptance Policy

```json
{"protocol":2,"reviewer":"Codex","source":"codex-review","user_waiver":"allowed"}
```

## Allowed Paths

```yaml
allowed_paths:
  - docs/
  - .archcontext/
  - AGENTS.md
  - CLAUDE.md
  - plans/
  - tasks/
  - tasks/archive/contract-20260908-1424-brc14-history-revision-evidence.md
  - tasks/archive/review-20260908-1424-brc14-history-revision-evidence.md
  - tasks/archive/notes-20260908-1424-brc14-history-revision-evidence.md
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
    - tasks/archive/notes-20260908-1424-brc14-history-revision-evidence.md
```

## Verification Plan

```json
{
  "protocol": 1,
  "checks": [
    {
      "id": "focused",
      "kind": "command",
      "command": "bun test --timeout 60000 tests/unit/campaign-revision-evidence.test.ts tests/unit/campaign-fresh-audit.test.ts tests/effects/campaign-fresh-audit.test.ts tests/unit/oracle-session-evidence.test.ts",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Exact history provenance, transport tampering, audit recommendations and bounded sequencing; no real provider calls.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "provider-boundary",
      "kind": "command",
      "command": "bun test --timeout 60000 tests/cli/chatgpt-browser.test.ts --test-name-pattern 'session history capture|fresh audit capture'",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Exercises invocation option, worker artifact and engine metadata handoffs without provider I/O.",
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
      "necessity": "Checks all union consumers.",
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
      "necessity": "Required repository integrity.",
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
      "necessity": "Required repository integrity.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "tasks",
      "kind": "command",
      "command": "bash scripts/check-task-sync.sh",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Required repository integrity.",
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
      "necessity": "Required repository integrity.",
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
      "necessity": "Required repository integrity.",
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
      "necessity": "Required repository integrity.",
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
