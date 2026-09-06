> **Archived**: 2026-09-07 03:42
> **Related Plan**: plans/archive/plan-20260907-0116-brc9-acquisition-accounting.md
> **Outcome**: Completed
> **Lifecycle**: contract
> **Parent Run ID**: run-20260907-0342
> **Archive Projection V1**: `plans/plan-20260907-0116-brc9-acquisition-accounting.md` => `plans/archive/plan-20260907-0116-brc9-acquisition-accounting.md`
> **Archive Projection V1**: `tasks/notes/20260907-0116-brc9-acquisition-accounting.notes.md` => `tasks/archive/notes-20260907-0342-brc9-acquisition-accounting.md`
> **Archive Projection V1**: `tasks/contracts/20260907-0116-brc9-acquisition-accounting.contract.md` => `tasks/archive/contract-20260907-0342-brc9-acquisition-accounting.md`
> **Archive Projection V1**: `tasks/reviews/20260907-0116-brc9-acquisition-accounting.review.md` => `tasks/archive/review-20260907-0342-brc9-acquisition-accounting.md`

# Task Contract: brc9-acquisition-accounting

> **Status**: Fulfilled
> **Plan**: plans/archive/plan-20260907-0116-brc9-acquisition-accounting.md
> **Task Profile**: code-change
> <!-- legal values: code-change | docs-only | ledger-closeout | migration | eval-only | delegated-run | bugfix (omit for legacy passthrough); see docs/reference-configs/sprint-contracts.md -->
> **Owner**: ancienttwo
> **Capability ID**: root
> **Last Updated**: 2026-09-07 01:16
> **Review File**: `tasks/archive/review-20260907-0342-brc9-acquisition-accounting.md`
> **Notes File**: `tasks/archive/notes-20260907-0342-brc9-acquisition-accounting.md`
> **Exemplar**: `docs/reference-configs/contract-brief-example.md`

## Why

Campaign CLI acquisition bypasses the existing budget, so successful acquisitions and pre-Claim budget stops are unenforced.

## Goal

Reserve and settle real campaign acquisitions exactly once, preserving concurrent worker capacity, idle-key retries and fail-closed crash recovery.

## Scope

- In scope: existing acquisition budget, campaign transaction serialization, immutable admission/result recovery, real acquisition regressions.
- Out of scope: new budget authority, worker dispatch changes, repair/transient policy, adoption sequencing, BRC10, whole BRC9 completion.
- Taste constraints: <!-- advisory only, no run gate; default style/taste lives in AGENTS.md and the minimal-change policy, use this to record a per-task override -->

## Stop Conditions

- Stop and hand back to the parent if the change would require editing a path outside Allowed Paths.
- Stop if an Exit Criteria command cannot be run in this environment.
- Stop if Goal, Scope, or Exit Criteria are internally contradictory.

## Falsifier

An unbudgeted real acquisition or a repeated charge for the same successful key falsifies the change. Two-process capacity behavior must remain dispatch plus idle, with the idle key usable after release.

## Root Cause Evidence

Required when Task Profile is `bugfix`; leave as-is otherwise.

- root_cause: one sentence naming file:line/condition (testable, not "a state issue").
- repro: the command or UI path that reproduces the symptom.
- regression_guard: path to a test that fails on the unfixed code and passes after the fix (must also appear as a `package_test` check in Verification Plan).
- pre_fix_failure_artifact: path to a captured run of regression_guard on the UNFIXED code. Capture with `bun test <regression_guard> > <artifact> 2>&1; echo "PRE_FIX_EXIT=$?" >> <artifact>` (no pipes — pipes swallow the exit status). The gate requires a non-zero `PRE_FIX_EXIT=` line plus the regression_guard path string in the artifact (see the Root Cause Evidence Gate section in docs/reference-configs/sprint-contracts.md).

## Workflow Inventory

- Source plan: `plans/archive/plan-20260907-0116-brc9-acquisition-accounting.md`
- Deferred-goal ledger: `tasks/todos.md`
- Review file: `tasks/archive/review-20260907-0342-brc9-acquisition-accounting.md`
- Notes file: `tasks/archive/notes-20260907-0342-brc9-acquisition-accounting.md`
- Checks file: `.ai/harness/checks/latest.json`
- Run snapshots: `.ai/harness/runs/`
- Scope gate: edit only paths listed under `allowed_paths`; update this contract before widening scope.
- Completion gate: run `verify-sprint --prepare-acceptance`, record one typed AcceptanceReceipt under the frozen policy below, then run `verify-sprint`; review Markdown is projection only.

## Change Assessment

```json
{"protocol":1,"oracles":[{"id":"real-acquisition-accounting-and-crash-controls","kind":"deterministic_test","paths":["src/effects/automation/campaign-acquisition.ts","src/effects/engineers/acquire.ts"]}]}
```

## Acceptance Policy

```json
{"protocol":2,"reviewer":"Codex","source":"codex-plugin","user_waiver":"allowed"}
```

## Allowed Paths

```yaml
allowed_paths:
  - docs/researches/20260907-brc9-acquisition-accounting.md
  - docs/architecture/
  - plans/archive/plan-20260907-0116-brc9-acquisition-accounting.md
  - tasks/todos.md
  - tasks/archive/contract-20260907-0342-brc9-acquisition-accounting.md
  - tasks/archive/review-20260907-0342-brc9-acquisition-accounting.md
  - tasks/archive/notes-20260907-0342-brc9-acquisition-accounting.md
  - src/effects/automation/campaign-acquisition.ts
  - src/effects/engineers/acquire.ts
  - tests/effects/campaign-acquisition.test.ts
  - tests/helpers/campaign-acquisition-fixture.ts
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
    - tasks/archive/notes-20260907-0342-brc9-acquisition-accounting.md
```

## Verification Plan

```json
{
  "protocol": 1,
  "checks": [
{"id":"engineer-acquire-neighbor","kind":"package_test","path":"tests/unit/me0b-engineer-acquire.test.ts","cwd":".","phase":"verification","cost":"normal","evidence_policy":"current_exact","necessity":"Verifies known own-claim release, foreign-claim preservation and rollback failure at the corrected Engineer boundary.","inputs":{"env":[]}},
{"id":"worker-neighbor","kind":"package_test","path":"tests/effects/campaign-worker.test.ts","cwd":".","phase":"verification","cost":"normal","evidence_policy":"current_exact","necessity":"Covers the shared campaign worker consumer or required repository integrity.","inputs":{"env":[]}},
{"id":"sql","kind":"command","command":"bash scripts/check-deploy-sql-order.sh","cwd":".","phase":"verification","cost":"normal","evidence_policy":"current_exact","necessity":"Covers the shared campaign worker consumer or required repository integrity.","inputs":{"env":[]}},
{"id":"architecture","kind":"command","command":"bash scripts/check-architecture-sync.sh","cwd":".","phase":"verification","cost":"normal","evidence_policy":"current_exact","necessity":"Covers the shared campaign worker consumer or required repository integrity.","inputs":{"env":[]}},
{"id":"task-sync","kind":"command","command":"bash scripts/check-task-sync.sh","cwd":".","phase":"verification","cost":"normal","evidence_policy":"current_exact","necessity":"Covers the shared campaign worker consumer or required repository integrity.","inputs":{"env":[]}},
{"id":"workflow","kind":"command","command":"bash scripts/check-task-workflow.sh --strict","cwd":".","phase":"verification","cost":"normal","evidence_policy":"current_exact","necessity":"Covers the shared campaign worker consumer or required repository integrity.","inputs":{"env":[]}},
{"id":"state","kind":"command","command":"bun scripts/inspect-project-state.ts --repo . --format text","cwd":".","phase":"verification","cost":"normal","evidence_policy":"current_exact","necessity":"Covers the shared campaign worker consumer or required repository integrity.","inputs":{"env":[]}},
{"id":"init","kind":"command","command":"bun src/cli/index.ts init --repo . --dry-run","cwd":".","phase":"verification","cost":"normal","evidence_policy":"current_exact","necessity":"Covers the shared campaign worker consumer or required repository integrity.","inputs":{"env":[]}},
    {
      "id": "focused-regression",
      "kind": "package_test",
      "path": "tests/effects/campaign-acquisition.test.ts",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Covers the changed behavior named by this contract.",
      "inputs": { "env": [] }
    },
    {
      "id": "typecheck",
      "kind": "command",
      "command": "bun run check:type",
      "cwd": ".",
      "phase": "preflight",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Checks TypeScript contracts before behavioral verification.",
      "inputs": { "env": [] }
    }
  ]
}
```

This is the sole executable verification authority. Use `baseline_with_delta`
only when a referenced immutable baseline plus named current delta checks prove
the intended coverage; do not infer that choice from paths or command text.

## Acceptance Notes (Human Review)

- Functional behavior: actual acquisition results own accounting; no invented success after an unknown effect.
- Edge cases: same-key replay, idle then acquisition, budget limit, concurrent processes, result-before-usage crash.
- Regression risks: worker invocation budget shares the same run and remains bounded. No full-suite trigger: named acquisition and worker tests cover changed behavior.

## Rollback Point

- Commit / checkpoint: 80d7659207d2d7dbb3083fa0a30969651aacb9f3.
- Revert strategy: revert source while retaining immutable budget and acquisition records.
