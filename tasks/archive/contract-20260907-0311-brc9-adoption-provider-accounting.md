> **Archived**: 2026-09-07 03:11
> **Related Plan**: plans/archive/plan-20260907-0203-brc9-adoption-provider-accounting.md
> **Outcome**: Completed
> **Lifecycle**: contract
> **Parent Run ID**: run-20260907-0311
> **Archive Projection V1**: `plans/plan-20260907-0203-brc9-adoption-provider-accounting.md` => `plans/archive/plan-20260907-0203-brc9-adoption-provider-accounting.md`
> **Archive Projection V1**: `tasks/notes/20260907-0203-brc9-adoption-provider-accounting.notes.md` => `tasks/archive/notes-20260907-0311-brc9-adoption-provider-accounting.md`
> **Archive Projection V1**: `tasks/contracts/20260907-0203-brc9-adoption-provider-accounting.contract.md` => `tasks/archive/contract-20260907-0311-brc9-adoption-provider-accounting.md`
> **Archive Projection V1**: `tasks/reviews/20260907-0203-brc9-adoption-provider-accounting.review.md` => `tasks/archive/review-20260907-0311-brc9-adoption-provider-accounting.md`

# Task Contract: brc9-adoption-provider-accounting

> **Status**: Fulfilled
> **Plan**: plans/archive/plan-20260907-0203-brc9-adoption-provider-accounting.md
> **Task Profile**: code-change
> <!-- legal values: code-change | docs-only | ledger-closeout | migration | eval-only | delegated-run | bugfix (omit for legacy passthrough); see docs/reference-configs/sprint-contracts.md -->
> **Owner**: ancienttwo
> **Capability ID**: root
> **Last Updated**: 2026-09-07 02:04
> **Review File**: `tasks/archive/review-20260907-0311-brc9-adoption-provider-accounting.md`
> **Notes File**: `tasks/archive/notes-20260907-0311-brc9-adoption-provider-accounting.md`
> **Exemplar**: `docs/reference-configs/contract-brief-example.md`

## Why

Active adoption provider observations bypass campaign accounting. Budgeted post-seal drift/recovery probes change the ledger, so the original seal cannot prove current full-ledger equality. Shadow's already accepted strict terminal proof must remain unchanged.

## Goal

Budget active adoption observations and preserve two explicit proof contracts. Shared `read/verifyCampaignAuthoringBudgetTerminal` requires the seal digest to equal the current complete ledger. Active `read/verifyCampaignAuthoringReadonlyContinuation` proves an exact historical seal plus its validated readonly successors and separately returns current_ledger_sha256/completion_event_sha256s. The old terminal proves only the sealing point; it is never presented as current full-ledger proof.

## Scope

- In scope: explicit active-only historical seal/readonly-continuation APIs; unchanged shared strict read/verify and shadow completion-plus-seal locking; active observation admission, drift checks and recovery; separate persisted readonly_continuation evidence.
- Out of scope: mutation or generic worker suffix approval, new authoring authority, transient policy, BRC10 and whole BRC9 completion.
- Taste constraints: <!-- advisory only, no run gate; default style/taste lives in AGENTS.md and the minimal-change policy, use this to record a per-task override -->

## Stop Conditions

- Stop and hand back to the parent if the change would require editing a path outside Allowed Paths.
- Stop if an Exit Criteria command cannot be run in this environment.
- Stop if Goal, Scope, or Exit Criteria are internally contradictory.

## Falsifier

Strict shared terminal read/verify accepting any changed full ledger falsifies shadow compatibility. Only the explicitly named active readonly-continuation API may accept a historical seal; its result must bind the current ledger and completed successor events. The committed integration base is ce5e42d3, not the unrelated dirty main documentation.

An unbudgeted production provider probe, accepted drift, missing/changed prefix, unresolved operation, or accepted mutation/challenge/generic suffix falsifies the protocol.

## Root Cause Evidence

Required when Task Profile is `bugfix`; leave as-is otherwise.

- root_cause: one sentence naming file:line/condition (testable, not "a state issue").
- repro: the command or UI path that reproduces the symptom.
- regression_guard: path to a test that fails on the unfixed code and passes after the fix (must also appear as a `package_test` check in Verification Plan).
- pre_fix_failure_artifact: path to a captured run of regression_guard on the UNFIXED code. Capture with `bun test <regression_guard> > <artifact> 2>&1; echo "PRE_FIX_EXIT=$?" >> <artifact>` (no pipes — pipes swallow the exit status). The gate requires a non-zero `PRE_FIX_EXIT=` line plus the regression_guard path string in the artifact (see the Root Cause Evidence Gate section in docs/reference-configs/sprint-contracts.md).

## Workflow Inventory

- Source plan: `plans/archive/plan-20260907-0203-brc9-adoption-provider-accounting.md`
- Deferred-goal ledger: `tasks/todos.md`
- Review file: `tasks/archive/review-20260907-0311-brc9-adoption-provider-accounting.md`
- Notes file: `tasks/archive/notes-20260907-0311-brc9-adoption-provider-accounting.md`
- Checks file: `.ai/harness/checks/latest.json`
- Run snapshots: `.ai/harness/runs/`
- Scope gate: edit only paths listed under `allowed_paths`; update this contract before widening scope.
- Completion gate: run `verify-sprint --prepare-acceptance`, record one typed AcceptanceReceipt under the frozen policy below, then run `verify-sprint`; review Markdown is projection only.

## Change Assessment

```json
{"protocol":1,"oracles":[{"id":"exact-terminal-and-budgeted-adoption","kind":"deterministic_test","paths":["src/effects/automation/budget-store.ts","src/effects/automation/issue-batch-adoption.ts"]}]}
```

## Acceptance Policy

```json
{"protocol":2,"reviewer":"Codex","source":"codex-plugin","user_waiver":"allowed"}
```

## Allowed Paths

```yaml
allowed_paths:
  - docs/researches/20260907-brc9-adoption-provider-accounting.md
  - docs/architecture/
  - plans/archive/plan-20260907-0203-brc9-adoption-provider-accounting.md
  - tasks/todos.md
  - tasks/archive/contract-20260907-0311-brc9-adoption-provider-accounting.md
  - tasks/archive/review-20260907-0311-brc9-adoption-provider-accounting.md
  - tasks/archive/notes-20260907-0311-brc9-adoption-provider-accounting.md
  - src/effects/automation/budget-store.ts
  - src/effects/automation/issue-batch-adoption.ts
  - tests/effects/issue-batch-adoption.test.ts
  - tests/effects/issue-batch-shadow-budget.test.ts
  - tests/unit/campaign-authoring-budget-prerequisite.test.ts
  - tests/helpers/campaign-adoption-repository.ts
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
    - tasks/archive/notes-20260907-0311-brc9-adoption-provider-accounting.md
```

## Verification Plan

```json
{
  "protocol": 1,
  "checks": [
{"id":"shadow-strict-neighbor","kind":"package_test","path":"tests/effects/issue-batch-shadow-budget.test.ts","cwd":".","phase":"verification","cost":"normal","evidence_policy":"current_exact","necessity":"Preserves accepted shadow full-ledger terminal equality, same-lock seal and zero-I/O replay; rejects later readonly ledger changes.","inputs":{"env":[]}},
{"id":"terminal","kind":"package_test","path":"tests/unit/campaign-authoring-budget-prerequisite.test.ts","cwd":".","phase":"verification","cost":"normal","evidence_policy":"current_exact","necessity":"Covers the changed terminal protocol, real provider/adoption consumers or required repository integrity.","inputs":{"env":[]}},
{"id":"provider-neighbor","kind":"package_test","path":"tests/unit/campaign-step-budget-prerequisite.test.ts","cwd":".","phase":"verification","cost":"normal","evidence_policy":"current_exact","necessity":"Covers the changed terminal protocol, real provider/adoption consumers or required repository integrity.","inputs":{"env":[]}},
{"id":"acquisition-neighbor","kind":"package_test","path":"tests/effects/campaign-acquisition.test.ts","cwd":".","phase":"verification","cost":"normal","evidence_policy":"current_exact","necessity":"Covers the changed terminal protocol, real provider/adoption consumers or required repository integrity.","inputs":{"env":[]}},
{"id":"sql","kind":"command","command":"bash scripts/check-deploy-sql-order.sh","cwd":".","phase":"verification","cost":"normal","evidence_policy":"current_exact","necessity":"Covers the changed terminal protocol, real provider/adoption consumers or required repository integrity.","inputs":{"env":[]}},
{"id":"architecture","kind":"command","command":"bash scripts/check-architecture-sync.sh","cwd":".","phase":"verification","cost":"normal","evidence_policy":"current_exact","necessity":"Covers the changed terminal protocol, real provider/adoption consumers or required repository integrity.","inputs":{"env":[]}},
{"id":"task-sync","kind":"command","command":"bash scripts/check-task-sync.sh","cwd":".","phase":"verification","cost":"normal","evidence_policy":"current_exact","necessity":"Covers the changed terminal protocol, real provider/adoption consumers or required repository integrity.","inputs":{"env":[]}},
{"id":"workflow","kind":"command","command":"bash scripts/check-task-workflow.sh --strict","cwd":".","phase":"verification","cost":"normal","evidence_policy":"current_exact","necessity":"Covers the changed terminal protocol, real provider/adoption consumers or required repository integrity.","inputs":{"env":[]}},
{"id":"state","kind":"command","command":"bun scripts/inspect-project-state.ts --repo . --format text","cwd":".","phase":"verification","cost":"normal","evidence_policy":"current_exact","necessity":"Covers the changed terminal protocol, real provider/adoption consumers or required repository integrity.","inputs":{"env":[]}},
{"id":"init","kind":"command","command":"bun src/cli/index.ts init --repo . --dry-run","cwd":".","phase":"verification","cost":"normal","evidence_policy":"current_exact","necessity":"Covers the changed terminal protocol, real provider/adoption consumers or required repository integrity.","inputs":{"env":[]}},
    {
      "id": "focused-regression",
      "kind": "package_test",
      "path": "tests/effects/issue-batch-adoption.test.ts",
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

- Functional behavior: every actual active-adoption GitHub invocation reserves before effect. Strict terminal proof requires current full-ledger equality. Active continuation binds the historical sealing point, unchanged authoring authority, current ledger and completed successor events separately.
- Edge cases: source drift, unknown effects, stored snapshot recovery, budget refusal, forbidden or unrelated suffixes.
- Regression risks: shared strict consumers must not inherit active continuation semantics. Shadow rejects an old seal after a settled GitHub read; the explicit active API accepts only the permitted continuation. Named terminal/provider/adoption/acquisition consumers cover the delta; final target is pinned before prepare. The earlier 29-test integration result remains a pre-alignment baseline, not final evidence.

## Rollback Point

- Commit / checkpoint:
- Revert strategy:
