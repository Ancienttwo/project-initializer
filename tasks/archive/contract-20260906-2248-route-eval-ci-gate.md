> **Archived**: 2026-09-06 22:48
> **Related Plan**: plans/archive/plan-20260906-0257-route-eval-ci-gate.md
> **Outcome**: Superseded
> **Lifecycle**: contract
> **Parent Run ID**: run-20260906-2248
> **Archive Projection V1**: `plans/plan-20260906-0257-route-eval-ci-gate.md` => `plans/archive/plan-20260906-0257-route-eval-ci-gate.md`
> **Archive Projection V1**: `tasks/notes/20260906-0257-route-eval-ci-gate.notes.md` => `tasks/archive/notes-20260906-2248-route-eval-ci-gate.md`
> **Archive Projection V1**: `tasks/contracts/20260906-0257-route-eval-ci-gate.contract.md` => `tasks/archive/contract-20260906-2248-route-eval-ci-gate.md`
> **Archive Projection V1**: `tasks/reviews/20260906-0257-route-eval-ci-gate.review.md` => `tasks/archive/review-20260906-2248-route-eval-ci-gate.md`

# Task Contract: route-eval-ci-gate

> **Status**: Active
> **Plan**: plans/archive/plan-20260906-0257-route-eval-ci-gate.md
> **Task Profile**: code-change
> <!-- legal values: code-change | docs-only | ledger-closeout | migration | eval-only | delegated-run | bugfix (omit for legacy passthrough); see docs/reference-configs/sprint-contracts.md -->
> **Owner**: ancienttwo
> **Capability ID**: root
> **Last Updated**: 2026-09-06 02:57
> **Review File**: `tasks/archive/review-20260906-2248-route-eval-ci-gate.md`
> **Notes File**: `tasks/archive/notes-20260906-2248-route-eval-ci-gate.md`
> **Exemplar**: `docs/reference-configs/contract-brief-example.md`

## Why

`src/cli/hook/prompt-intents.ts` is a 580-line regex intent classifier that re-derives LLM-owned semantics; retiring it needs a numeric oracle. The existing route-nl-vs-ts eval has only 9 scenarios and no named CI step, so a classifier regression on an uncovered intent or action is invisible until a user hits it. Skipping this leaves "delete the regex" as a feeling instead of a number.

## Goal

`bun run check:route-eval` runs the TS arm of `scripts/route-nl-vs-ts-eval.ts` over an expanded `ROUTE_SCENARIOS` corpus that covers every `PROMPT_GUARD_INTENTS` entry and every prompt-layer-reachable `PROMPT_GUARD_ACTIONS` entry, prints one line per scenario plus a coverage summary, exits non-zero on any mismatch or coverage shortfall against pinned constants, and runs as the named `[ci] route eval (TS arm)` step in `scripts/check-ci.sh` before `[ci] tests`. NL arm, report protocol, `evals/evals.json`, and runtime prompt-guard behavior are unchanged.

## Scope

- In scope: `scripts/route-nl-vs-ts-eval.ts` (corpus + `--check-ts-arm` mode), `tests/route-nl-vs-ts-eval.test.ts`, `package.json` script, `scripts/check-ci.sh` step, one paragraph in `docs/reference-configs/loop-engine-nl-decision-table.md`, and `tests/bootstrap-files.test.ts` only if its check-ci step assertions need the new line.
- Out of scope: any edit to `src/cli/hook/prompt-intents.ts`, `src/cli/hook/prompt-guard-decision.ts`, `evals/evals.json`, hook runtime, or the NL arm. Do not move scenarios into a separate data file. Do not invent prompts from taste: every scenario cites a `lessonSource` from an existing test, `tasks/lessons.md`, or a decision-table rule. Actions unreachable from the prompt layer go into the plan's `## Unreachable Actions` section with a reason, never faked.
- Taste constraints: <!-- advisory only, no run gate; default style/taste lives in AGENTS.md and the minimal-change policy, use this to record a per-task override -->

## Stop Conditions

- Stop and hand back to the parent if the change would require editing a path outside Allowed Paths.
- Stop if an Exit Criteria command cannot be run in this environment.
- Stop if Goal, Scope, or Exit Criteria are internally contradictory.

## Falsifier

If the TS arm cannot reach most actions from a prompt plus `PromptGuardState` alone (they depend on filesystem or git state the eval cannot fake), the corpus cannot be the oracle and the slice is wrong. Cheapest check: enumerate the branches of `runPromptGuardVerdictFromPrompt` first and count reachable actions before writing scenarios.

## Root Cause Evidence

Required when Task Profile is `bugfix`; leave as-is otherwise.

- root_cause: one sentence naming file:line/condition (testable, not "a state issue").
- repro: the command or UI path that reproduces the symptom.
- regression_guard: path to a test that fails on the unfixed code and passes after the fix (must also appear under exit_criteria.tests_pass).
- pre_fix_failure_artifact: path to a captured run of regression_guard on the UNFIXED code. Capture with `bun test <regression_guard> > <artifact> 2>&1; echo "PRE_FIX_EXIT=$?" >> <artifact>` (no pipes — pipes swallow the exit status). The gate requires a non-zero `PRE_FIX_EXIT=` line plus the regression_guard path string in the artifact (see the Root Cause Evidence Gate section in docs/reference-configs/sprint-contracts.md).

## Workflow Inventory

- Source plan: `plans/archive/plan-20260906-0257-route-eval-ci-gate.md`
- Deferred-goal ledger: `tasks/todos.md`
- Review file: `tasks/archive/review-20260906-2248-route-eval-ci-gate.md`
- Notes file: `tasks/archive/notes-20260906-2248-route-eval-ci-gate.md`
- Checks file: `.ai/harness/checks/latest.json`
- Run snapshots: `.ai/harness/runs/`
- Scope gate: edit only paths listed under `allowed_paths`; update this contract before widening scope.
- Completion gate: run `verify-sprint --prepare-acceptance`, record one typed AcceptanceReceipt under the frozen policy below, then run `verify-sprint`; review Markdown is projection only.

## Change Assessment

```json
{"protocol":1,"oracles":[{"id":"route-eval-ts-arm","kind":"deterministic_test","paths":["scripts/route-nl-vs-ts-eval.ts","tests/route-nl-vs-ts-eval.test.ts"]},{"id":"ci-chain-wiring","kind":"deterministic_test","paths":["scripts/check-ci.sh","package.json","tests/bootstrap-files.test.ts"]}]}
```

## Acceptance Policy

```json
{"protocol":2,"reviewer":"Codex","source":"codex-review","user_waiver":"allowed"}
```

## Allowed Paths

```yaml
allowed_paths:
  - plans/archive/plan-20260906-0257-route-eval-ci-gate.md
  - tasks/archive/contract-20260906-2248-route-eval-ci-gate.md
  - tasks/archive/review-20260906-2248-route-eval-ci-gate.md
  - tasks/archive/notes-20260906-2248-route-eval-ci-gate.md
  - tasks/todos.md
  - scripts/route-nl-vs-ts-eval.ts
  - scripts/check-ci.sh
  - package.json
  - tests/route-nl-vs-ts-eval.test.ts
  - tests/bootstrap-files.test.ts
  - docs/reference-configs/loop-engine-nl-decision-table.md
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
    - scripts/route-nl-vs-ts-eval.ts
    - scripts/check-ci.sh
  artifacts_exist:
    - .ai/harness/checks/latest.json
    - tasks/archive/notes-20260906-2248-route-eval-ci-gate.md
```


## Verification Plan

```json
{
  "protocol": 1,
  "checks": [
    {
      "id": "route-eval-ts",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Verifies the route-eval TypeScript arm.",
      "inputs": {
        "env": []
      },
      "kind": "package_test",
      "path": "tests/route-nl-vs-ts-eval.test.ts"
    },
    {
      "id": "bootstrap-files",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Verifies CI wiring in bootstrap files.",
      "inputs": {
        "env": []
      },
      "kind": "package_test",
      "path": "tests/bootstrap-files.test.ts"
    },
    {
      "id": "route-eval",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Runs the named route-eval CI gate.",
      "inputs": {
        "env": []
      },
      "kind": "command",
      "command": "bun run check:route-eval"
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
      "id": "typecheck",
      "cwd": ".",
      "phase": "preflight",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Checks the typed implementation boundary.",
      "inputs": {
        "env": []
      },
      "kind": "command",
      "command": "bun run check:type"
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
