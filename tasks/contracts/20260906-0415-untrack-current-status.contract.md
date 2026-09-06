# Task Contract: untrack-current-status

> **Status**: Active
> **Plan**: plans/plan-20260906-0415-untrack-current-status.md
> **Task Profile**: code-change
> <!-- legal values: code-change | docs-only | ledger-closeout | migration | eval-only | delegated-run | bugfix (omit for legacy passthrough); see docs/reference-configs/sprint-contracts.md -->
> **Owner**: ancienttwo
> **Capability ID**: root
> **Last Updated**: 2026-09-06 04:16
> **Review File**: `tasks/reviews/20260906-0415-untrack-current-status.review.md`
> **Notes File**: `tasks/notes/20260906-0415-untrack-current-status.notes.md`
> **Exemplar**: `docs/reference-configs/contract-brief-example.md`

## Why

`tasks/current.md` is committed but derived from untracked local markers, so `git show main:tasks/current.md` presents one session's state as mainline truth. No drift check can fix a tracked artifact with untracked inputs. Leaving it invites every parallel session to overwrite it and every reader to trust a stale snapshot.

## Goal

`tasks/current.md` is untracked and ignored (self-host and downstream template), still generated locally, no longer read across branches by session context or rendered with a mainline section, no longer exempted in diff-fingerprint or check-task-sync, treated by the workflow contract like `.ai/harness/handoff/current.md`, and described everywhere as an ignored local read model. Both workflow-contract copies and both root contracts stay identical.

## Scope

- In scope: check-task-workflow tolerate-absent snapshot check (plan 8a), assets/reference-configs authority edits with docs projection (plan 8b); paths listed in the plan Scope; test updates needed by those changes; helper and reference-config projections.
- Out of scope: any automated deletion of tracked files in downstream repos; changes to handoff, checks, sprint, or plan lifecycle; changes to what the snapshot body contains beyond removing the mainline section.
- Taste constraints: <!-- advisory only, no run gate; default style/taste lives in AGENTS.md and the minimal-change policy, use this to record a per-task override -->

## Stop Conditions

- Stop and hand back to the parent if the change would require editing a path outside Allowed Paths.
- Stop if an Exit Criteria command cannot be run in this environment.
- Stop if Goal, Scope, or Exit Criteria are internally contradictory.

## Falsifier

If some gate or hook requires `tasks/current.md` to be committed (for example check-task-workflow requiring it tracked, or a CI job that reads it from the checkout without generating it), untracking reds CI. Cheapest check: `rg -n 'current.md' scripts/check-task-workflow.sh .github/workflows scripts/check-ci.sh` and confirm each hit tolerates an absent or ignored file, or that ensure-task-workflow regenerates it before the reader runs.

## Root Cause Evidence

Required when Task Profile is `bugfix`; leave as-is otherwise.

- root_cause: one sentence naming file:line/condition (testable, not "a state issue").
- repro: the command or UI path that reproduces the symptom.
- regression_guard: path to a test that fails on the unfixed code and passes after the fix (must also appear under exit_criteria.tests_pass).
- pre_fix_failure_artifact: path to a captured run of regression_guard on the UNFIXED code. Capture with `bun test <regression_guard> > <artifact> 2>&1; echo "PRE_FIX_EXIT=$?" >> <artifact>` (no pipes — pipes swallow the exit status). The gate requires a non-zero `PRE_FIX_EXIT=` line plus the regression_guard path string in the artifact (see the Root Cause Evidence Gate section in docs/reference-configs/sprint-contracts.md).

## Workflow Inventory

- Source plan: `plans/plan-20260906-0415-untrack-current-status.md`
- Deferred-goal ledger: `tasks/todos.md`
- Review file: `tasks/reviews/20260906-0415-untrack-current-status.review.md`
- Notes file: `tasks/notes/20260906-0415-untrack-current-status.notes.md`
- Checks file: `.ai/harness/checks/latest.json`
- Run snapshots: `.ai/harness/runs/`
- Scope gate: edit only paths listed under `allowed_paths`; update this contract before widening scope.
- Completion gate: run `verify-sprint --prepare-acceptance`, record one typed AcceptanceReceipt under the frozen policy below, then run `verify-sprint`; review Markdown is projection only.

## Change Assessment

```json
{"protocol":1,"oracles":[{"id":"session-context-cutover","kind":"deterministic_test","paths":["src/cli/hook/session-context.ts","tests/"]},{"id":"adoption-ignore","kind":"deterministic_test","paths":["src/core/adoption/gitignore-plan.ts","tests/"]},{"id":"refresh-helper","kind":"deterministic_test","paths":["scripts/refresh-current-status.sh","tests/helper-scripts.test.ts"]},{"id":"contract-and-docs","kind":"deterministic_test","paths":["assets/workflow-contract.v1.json",".ai/harness/workflow-contract.json","CLAUDE.md","AGENTS.md","docs/reference-configs/"]}]}
```

## Acceptance Policy

```json
{"protocol":2,"reviewer":"Codex","source":"codex-review","user_waiver":"allowed"}
```

## Allowed Paths

```yaml
allowed_paths:
  - plans/plan-20260906-0415-untrack-current-status.md
  - tasks/contracts/20260906-0415-untrack-current-status.contract.md
  - tasks/reviews/20260906-0415-untrack-current-status.review.md
  - tasks/notes/20260906-0415-untrack-current-status.notes.md
  - tasks/todos.md
  - tasks/current.md
  - .gitignore
  - src/cli/hook/session-context.ts
  - src/effects/review/diff-fingerprint.ts
  - src/core/adoption/gitignore-plan.ts
  - scripts/refresh-current-status.sh
  - scripts/check-task-sync.sh
  - scripts/check-task-workflow.sh
  - assets/templates/helpers/check-task-workflow.sh
  - assets/reference-configs/
  - scripts/architecture-event.ts
  - scripts/context-contract-sync.sh
  - assets/templates/helpers/architecture-event.ts
  - assets/templates/helpers/context-contract-sync.sh
  - scripts/lib/project-init-lib.sh
  - assets/CLAUDE.md
  - assets/AGENTS.md
  - scripts/CLAUDE.md
  - scripts/AGENTS.md
  - assets/hooks/CLAUDE.md
  - assets/hooks/AGENTS.md
  - assets/templates/helpers/refresh-current-status.sh
  - assets/templates/helpers/check-task-sync.sh
  - assets/workflow-contract.v1.json
  - .ai/harness/workflow-contract.json
  - assets/skill-commands/
  - SKILL.md
  - README.md
  - CLAUDE.md
  - AGENTS.md
  - docs/reference-configs/
  - docs/spec.md
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
    - .gitignore
    - scripts/refresh-current-status.sh
  artifacts_exist:
    - .ai/harness/checks/latest.json
    - tasks/notes/20260906-0415-untrack-current-status.notes.md
  tests_pass:
    - path: tests/scaffold-parity.test.ts
    - path: tests/bootstrap-files.test.ts
    - path: tests/evidence-projection-drift.test.ts
    - path: tests/readme-dx.test.ts
  commands_succeed:
    - test -z "$(git ls-files tasks/current.md)"
    - git check-ignore -q tasks/current.md
    - bun run check:type
    - bun run check:helpers
    - bun run check:reference-configs
criterion_reuse:
  tests_pass:
    - path: tests/scaffold-parity.test.ts
    - path: tests/bootstrap-files.test.ts
    - path: tests/evidence-projection-drift.test.ts
    - path: tests/readme-dx.test.ts
  commands_succeed:
    - bun run check:type
    - bun run check:helpers
    - bun run check:reference-configs
```

## Acceptance Notes (Human Review)

- Functional behavior:
- Edge cases:
- Regression risks:

## Rollback Point

- Commit / checkpoint:
- Revert strategy:
