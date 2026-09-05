> **Archived**: 2026-09-06 04:23
> **Related Plan**: plans/archive/plan-20260906-0305-persistent-claude-review.md
> **Outcome**: Completed
> **Lifecycle**: contract
> **Parent Run ID**: run-20260906-0423
> **Archive Projection V1**: `plans/plan-20260906-0305-persistent-claude-review.md` => `plans/archive/plan-20260906-0305-persistent-claude-review.md`
> **Archive Projection V1**: `tasks/notes/20260906-0305-persistent-claude-review.notes.md` => `tasks/archive/notes-20260906-0423-persistent-claude-review.md`
> **Archive Projection V1**: `tasks/contracts/20260906-0305-persistent-claude-review.contract.md` => `tasks/archive/contract-20260906-0423-persistent-claude-review.md`
> **Archive Projection V1**: `tasks/reviews/20260906-0305-persistent-claude-review.review.md` => `tasks/archive/review-20260906-0423-persistent-claude-review.md`

# Task Contract: persistent-claude-review

> **Status**: Fulfilled
> **Plan**: plans/archive/plan-20260906-0305-persistent-claude-review.md
> **Task Profile**: code-change
> <!-- legal values: code-change | docs-only | ledger-closeout | migration | eval-only | delegated-run | bugfix (omit for legacy passthrough); see docs/reference-configs/sprint-contracts.md -->
> **Owner**: ancienttwo
> **Capability ID**: root
> **Last Updated**: 2026-09-06 03:05
> **Review File**: `tasks/archive/review-20260906-0423-persistent-claude-review.md`
> **Notes File**: `tasks/archive/notes-20260906-0423-persistent-claude-review.md`
> **Exemplar**: `docs/reference-configs/contract-brief-example.md`

## Why

A one-shot invisible reviewer loses repair context. A persistent reviewer must never issue acceptance for stale code or terminate unrelated user processes.

## Goal

Require usable tmux in host readiness and provide task-scoped Claude round/status/close/cancel commands with a persistent stream-json child, exact context fences, real AcceptanceReceipt recording and owned cleanup.

## Scope

- In scope: readiness, one task-scoped provider host, bounded repair rounds, exact-context receipt admission, status and precise close/cancel, documented runtime ownership.
- Out of scope: board UI, automatic worktree lifecycle creation, scheduler changes, native Claude TUI, provider fallback and automatic session recovery.

## Stop Conditions

- Stop and hand back to the parent if the change would require editing a path outside Allowed Paths.
- Stop if an Exit Criteria command cannot be run in this environment.
- Stop if Goal, Scope, or Exit Criteria are internally contradictory.

## Falsifier

Reject the implementation if two rounds do not retain the same provider process/session, stale evidence produces acceptance, ambiguous submission is replayed, or cleanup touches an unowned process. The previous isolated protocol experiment is baseline only; the production-path live fixture must prove the integration.

## Workflow Inventory

- Source plan: `plans/archive/plan-20260906-0305-persistent-claude-review.md`
- Deferred-goal ledger: `tasks/todos.md`
- Review file: `tasks/archive/review-20260906-0423-persistent-claude-review.md`
- Notes file: `tasks/archive/notes-20260906-0423-persistent-claude-review.md`
- Checks file: `.ai/harness/checks/latest.json`
- Run snapshots: `.ai/harness/runs/`
- Scope gate: edit only paths listed under `allowed_paths`; update this contract before widening scope.
- Completion gate: run `verify-sprint --prepare-acceptance`, record one typed AcceptanceReceipt under the frozen policy below, then run `verify-sprint`; review Markdown is projection only.

## Change Assessment

```json
{"protocol":1,"oracles":[{"id":"persistent-review-contract-checks","kind":"deterministic_test","paths":["*"]}]}
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
  - docs/reference-configs/external-tooling.md
  - assets/
  - scripts/
  - README.md
  - tasks/current.md
  - tasks/workstreams/
  - .archcontext/
  - .ai/context/
  - plans/
  - tasks/todos.md
  - tasks/archive/contract-20260906-0423-persistent-claude-review.md
  - tasks/archive/review-20260906-0423-persistent-claude-review.md
  - tasks/archive/notes-20260906-0423-persistent-claude-review.md
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
    - tasks/archive/notes-20260906-0423-persistent-claude-review.md
  tests_pass:
    - path: tests/claude-review.test.ts
    - path: tests/acceptance-receipt.test.ts
  commands_succeed:
    - bun test tests/check-agent-tooling.test.ts -t 'tmux is a required runtime capability'
    - bun run check:type
    - bun run check:helpers
    - bun run check:reference-configs
criterion_reuse:
  tests_pass:
    - tests/acceptance-receipt.test.ts
  commands_succeed:
    - bun test tests/check-agent-tooling.test.ts -t 'tmux is a required runtime capability'
    - bun run check:type
    - bun run check:helpers
    - bun run check:reference-configs
```

## Acceptance Notes (Human Review)

- Functional behavior: real tmux host tests use the existing protected receipt writer; a separate live provider fixture proves semantic FAIL/repair/PASS.
- Edge cases: exact-context rejection, ambiguous/concurrent delivery, bounded rounds and owned cleanup.
- Regression risks: three focused test files plus type/helper/reference integrity cover the changed boundaries. No whole-suite risk is uncovered. Real tmux lifecycle tests are not reused because tmux is outside the verifier toolchain fingerprint.

The machine criteria in run `run-20260906T034622-75624-20260906-0305-persistent-claude-review` all passed for subject `sha256:f80767d0695fcc3361f8c6f945dd5d6f19be7c47792398e77465b078c7830081`. The overall run failed solely because this contract had not declared its deterministic oracle. No implementation changed after that run. Preserve its full readiness-file baseline; final criteria rerun the three tmux readiness cases instead of repeating the unrelated readiness coverage. Lifecycle and receipt tests plus type/projection checks remain cheap focused criteria. The baseline is a machine-check pass, not an accepted workflow run.

## Rollback Point

- Commit / checkpoint:
- Revert strategy:
