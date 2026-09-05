> **Archived**: 2026-09-06 04:41
> **Related Plan**: plans/archive/plan-20260906-0428-claude-startup-cancel.md
> **Outcome**: Completed
> **Lifecycle**: contract
> **Parent Run ID**: run-20260906-0441
> **Archive Projection V1**: `plans/plan-20260906-0428-claude-startup-cancel.md` => `plans/archive/plan-20260906-0428-claude-startup-cancel.md`
> **Archive Projection V1**: `tasks/notes/20260906-0428-claude-startup-cancel.notes.md` => `tasks/archive/notes-20260906-0441-claude-startup-cancel.md`
> **Archive Projection V1**: `tasks/contracts/20260906-0428-claude-startup-cancel.contract.md` => `tasks/archive/contract-20260906-0441-claude-startup-cancel.md`
> **Archive Projection V1**: `tasks/reviews/20260906-0428-claude-startup-cancel.review.md` => `tasks/archive/review-20260906-0441-claude-startup-cancel.md`

# Task Contract: claude-startup-cancel

> **Status**: Fulfilled
> **Plan**: plans/archive/plan-20260906-0428-claude-startup-cancel.md
> **Task Profile**: bugfix
> <!-- legal values: code-change | docs-only | ledger-closeout | migration | eval-only | delegated-run | bugfix (omit for legacy passthrough); see docs/reference-configs/sprint-contracts.md -->
> **Owner**: ancienttwo
> **Capability ID**: root
> **Last Updated**: 2026-09-06 04:28
> **Review File**: `tasks/archive/review-20260906-0441-claude-startup-cancel.md`
> **Notes File**: `tasks/archive/notes-20260906-0441-claude-startup-cancel.md`
> **Exemplar**: `docs/reference-configs/contract-brief-example.md`

## Why

Cancellation must work after bootstrap failure without fabricating evidence that an unknown provider was cleaned.

## Goal

Cancel proven pre-spawn failures and prevent delayed startup after cancellation; preserve precise cleanup and reject ambiguous post-spawn ownership.

## Scope

- In scope: startup/cancel locking, spawn intent/no-child evidence, lifecycle regression tests and durable findings.
- Out of scope: automatic recovery, reviewer admission reset, other P3 findings, provider model and other work packages.
- Taste constraints: <!-- advisory only, no run gate; default style/taste lives in AGENTS.md and the minimal-change policy, use this to record a per-task override -->

## Stop Conditions

- Stop and hand back to the parent if the change would require editing a path outside Allowed Paths.
- Stop if an Exit Criteria command cannot be run in this environment.
- Stop if Goal, Scope, or Exit Criteria are internally contradictory.

## Falsifier

A cancelled bootstrap starts a provider, or missing metadata after spawn intent is reported cleaned without ownership proof. First reproduce real provider spawn failure.

## Root Cause Evidence

- root_cause: closeClaudeReview reads processes.json unconditionally before cancellation, while runClaudeReviewHost publishes it only after provider spawn succeeds.
- repro: bun test tests/claude-review.test.ts -t 'startup spawn failure'
- regression_guard: tests/claude-review.test.ts
- pre_fix_failure_artifact: .ai/harness/runs/claude-startup-cancel/pre-fix.log

## Workflow Inventory

- Source plan: `plans/archive/plan-20260906-0428-claude-startup-cancel.md`
- Deferred-goal ledger: `tasks/todos.md`
- Review file: `tasks/archive/review-20260906-0441-claude-startup-cancel.md`
- Notes file: `tasks/archive/notes-20260906-0441-claude-startup-cancel.md`
- Checks file: `.ai/harness/checks/latest.json`
- Run snapshots: `.ai/harness/runs/`
- Scope gate: edit only paths listed under `allowed_paths`; update this contract before widening scope.
- Completion gate: run `verify-sprint --prepare-acceptance`, record one typed AcceptanceReceipt under the frozen policy below, then run `verify-sprint`; review Markdown is projection only.

## Change Assessment

```json
{"protocol":1,"oracles":[{"id":"startup-cancel-regressions","kind":"deterministic_test","paths":["*"]}]}
```

## Acceptance Policy

```json
{"protocol":1,"reviewer":"Claude","user_waiver":"forbidden"}
```

## Allowed Paths

```yaml
allowed_paths:
  - docs/spec.md
  - docs/researches/20260906-tmux-claude-review-lifecycle.md
  - docs/architecture/
  - tasks/current.md
  - plans/
  - tasks/todos.md
  - tasks/archive/contract-20260906-0441-claude-startup-cancel.md
  - tasks/archive/review-20260906-0441-claude-startup-cancel.md
  - tasks/archive/notes-20260906-0441-claude-startup-cancel.md
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

Choose the smallest checks that cover the changed behavior. Add a full suite
only for an explicit release requirement or an observed cross-module coverage
gap; state that reason and expected cost in Acceptance Notes. Do not duplicate
coverage between `tests_pass` and `commands_succeed`. Before the first run,
list eligible deterministic criteria in `criterion_reuse`; eligibility requires
all inputs to be bound by the frozen subject/toolchain context. Leave external
or mutable-state criteria ineligible. The canonical acceptance runner owns the
expensive execution; workers and reviewers consume its evidence.

If a full suite already passed before a bounded follow-up edit, preserve its
run identity as baseline evidence and choose focused checks for the actual delta.
The parent revises these criteria and records the baseline plus coverage rationale
in Acceptance Notes, unless an explicit user/release requirement still requires
a full run on the new subject. A cache miss alone does not justify another full
suite; never label the old subject's pass as a full pass for the new subject.

```yaml
exit_criteria:
  files_exist:
    - docs/spec.md
  artifacts_exist:
    - .ai/harness/checks/latest.json
    - tasks/archive/notes-20260906-0441-claude-startup-cancel.md
  tests_pass:
    - path: tests/claude-review.test.ts
  commands_succeed:
    - bun run check:type
    - bun run check:helpers
    - bun run check:reference-configs
criterion_reuse:
  tests_pass: []
  commands_succeed:
    - bun run check:type
    - bun run check:helpers
    - bun run check:reference-configs
```

## Acceptance Notes (Human Review)

- Functional behavior: red-green real tmux startup failure and existing review lifecycle tests.
- Edge cases: delayed bootstrap, lock contention, ambiguous spawn intent, sentinel preservation, no acceptance from cancellation.
- Regression risks: named lifecycle tests and type checks cover the two changed runtime modules; no full-suite trigger is present.

## Rollback Point

- Commit / checkpoint:
- Revert strategy:
