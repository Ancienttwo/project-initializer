> **Archived**: 2026-09-06 16:25
> **Related Plan**: plans/archive/plan-20260906-0401-brc8-bounded-worker-acquisition.md
> **Outcome**: Completed
> **Lifecycle**: contract
> **Parent Run ID**: run-20260906-1625
> **Archive Projection V1**: `plans/plan-20260906-0401-brc8-bounded-worker-acquisition.md` => `plans/archive/plan-20260906-0401-brc8-bounded-worker-acquisition.md`
> **Archive Projection V1**: `tasks/notes/20260906-0401-brc8-bounded-worker-acquisition.notes.md` => `tasks/archive/notes-20260906-1625-brc8-bounded-worker-acquisition.md`
> **Archive Projection V1**: `tasks/contracts/20260906-0401-brc8-bounded-worker-acquisition.contract.md` => `tasks/archive/contract-20260906-1625-brc8-bounded-worker-acquisition.md`
> **Archive Projection V1**: `tasks/reviews/20260906-0401-brc8-bounded-worker-acquisition.review.md` => `tasks/archive/review-20260906-1625-brc8-bounded-worker-acquisition.md`

# Task Contract: brc8-bounded-worker-acquisition

> **Status**: Fulfilled
> **Plan**: plans/archive/plan-20260906-0401-brc8-bounded-worker-acquisition.md
> **Task Profile**: code-change
> <!-- legal values: code-change | docs-only | ledger-closeout | migration | eval-only | delegated-run | bugfix (omit for legacy passthrough); see docs/reference-configs/sprint-contracts.md -->
> **Owner**: ancienttwo
> **Capability ID**: root
> **Last Updated**: 2026-09-06 04:02
> **Review File**: `tasks/archive/review-20260906-1625-brc8-bounded-worker-acquisition.md`
> **Notes File**: `tasks/archive/notes-20260906-1625-brc8-bounded-worker-acquisition.md`
> **Exemplar**: `docs/reference-configs/contract-brief-example.md`

## Why

BRC7 admits exact repair plans but has no authenticated worker acquisition handoff. BRC8 must connect existing Engineer scheduling to Fleet while preventing parallel acquisitions from exceeding the campaign grant.

## Goal

Deliver campaign-scoped authenticated acquire-next and local-host WorkEnvelope handoff with campaign-wide max_parallel_tasks enforced at the common Fleet claim boundary.

## Scope

- In scope: exact campaign membership filtering in existing acquire-next; shared Fleet capacity admission; explicit campaign step execution authorization and real envelope/actor-receipt handoff; focused concurrency and authority verification.
- Out of scope: BRC9 budgets, BRC10 liveness, provider dispatch services, autonomous loops, automatic merge, new root lifecycle commands, planner semantic inference, Task/Lease/Acceptance/Publication schema changes, BRC6 authority changes.
- Taste constraints: <!-- advisory only, no run gate; default style/taste lives in AGENTS.md and the minimal-change policy, use this to record a per-task override -->

## Stop Conditions

- Stop and hand back to the parent if the change would require editing a path outside Allowed Paths.
- Stop if an Exit Criteria command cannot be run in this environment.
- Stop if Goal, Scope, or Exit Criteria are internally contradictory.

## Falsifier

Two real Engineer acquisitions in one campaign produce more current non-released leases than its max_parallel_tasks, or an execution handoff lacks a current ClaimActorReceipt/WorkEnvelope. Cheapest proof: two different-capability task acquisitions racing with max_parallel_tasks=1.

## Root Cause Evidence

Required when Task Profile is `bugfix`; leave as-is otherwise.

- root_cause: one sentence naming file:line/condition (testable, not "a state issue").
- repro: the command or UI path that reproduces the symptom.
- regression_guard: path to a test that fails on the unfixed code and passes after the fix (must also appear under exit_criteria.tests_pass).
- pre_fix_failure_artifact: path to a captured run of regression_guard on the UNFIXED code. Capture with `bun test <regression_guard> > <artifact> 2>&1; echo "PRE_FIX_EXIT=$?" >> <artifact>` (no pipes — pipes swallow the exit status). The gate requires a non-zero `PRE_FIX_EXIT=` line plus the regression_guard path string in the artifact (see the Root Cause Evidence Gate section in docs/reference-configs/sprint-contracts.md).

## Workflow Inventory

- Source plan: `plans/archive/plan-20260906-0401-brc8-bounded-worker-acquisition.md`
- Deferred-goal ledger: `tasks/todos.md`
- Review file: `tasks/archive/review-20260906-1625-brc8-bounded-worker-acquisition.md`
- Notes file: `tasks/archive/notes-20260906-1625-brc8-bounded-worker-acquisition.md`
- Checks file: `.ai/harness/checks/latest.json`
- Run snapshots: `.ai/harness/runs/`
- Scope gate: edit only paths listed under `allowed_paths`; update this contract before widening scope.
- Completion gate: run `verify-sprint --prepare-acceptance`, record one typed AcceptanceReceipt under the frozen policy below, then run `verify-sprint`; review Markdown is projection only.

## Change Assessment

```json
{"protocol":1,"oracles":[{"id":"brc8-concurrency-and-authority","kind":"deterministic_test","paths":["*"]}]}
```

## Acceptance Policy

```json
{"protocol":2,"reviewer":"Codex","source":"codex-plugin","user_waiver":"allowed"}
```

## Allowed Paths

```yaml
allowed_paths:
  - src/effects/engineers/scheduling-acquire-next.ts
  - src/effects/fleet/acquire.ts
  - src/cli/commands/campaign.ts
  - src/effects/automation/campaign-acquisition.ts
  - src/effects/automation/campaign-capacity.ts
  - src/effects/automation/campaign-planning-proof.ts
  - tests/unit/issue-280-acquire-next.test.ts
  - tests/claude-review.test.ts
  - tests/effects/campaign-acquisition.test.ts
  - tests/fleet-acquire-concurrency.test.ts
  - tests/cli/campaign-planning.test.ts
  - tests/helpers/campaign-adoption-repository.ts
  - docs/researches/20260905-repair-campaign-sprint-execution-boundaries.md
  - docs/architecture/
  - .archcontext/
  - plans/archive/plan-20260906-0401-brc8-bounded-worker-acquisition.md
  - plans/sprints/20260902-2238-gpt-pro-seeded-repair-campaign.sprint.md
  - tasks/todos.md
  - tasks/current.md
  - tasks/archive/contract-20260906-1625-brc8-bounded-worker-acquisition.md
  - tasks/archive/review-20260906-1625-brc8-bounded-worker-acquisition.md
  - tasks/archive/notes-20260906-1625-brc8-bounded-worker-acquisition.md
  - tasks/workstreams/
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
    - src/effects/automation/campaign-acquisition.ts
    - src/effects/automation/campaign-capacity.ts
  artifacts_exist:
    - .ai/harness/checks/latest.json
    - tasks/archive/notes-20260906-1625-brc8-bounded-worker-acquisition.md
  tests_pass: []
  commands_succeed:
    - bun run check:type
    - bun run check:state-boundaries
    - bun test --timeout 60000 tests/unit/issue-280-acquire-next.test.ts tests/unit/me1a-engineer-scheduling-acquire.test.ts tests/fleet-acquire-concurrency.test.ts tests/cli/fleet-offer-acquire.test.ts tests/effects/campaign-acquisition.test.ts
criterion_reuse:
  tests_pass: []
  commands_succeed:
    - bun run check:type
    - bun run check:state-boundaries
    - bun test --timeout 60000 tests/unit/issue-280-acquire-next.test.ts tests/unit/me1a-engineer-scheduling-acquire.test.ts tests/fleet-acquire-concurrency.test.ts tests/cli/fleet-offer-acquire.test.ts tests/effects/campaign-acquisition.test.ts
```

## Acceptance Notes (Human Review)

- Functional behavior: preserve canonical ordering, real Lease ownership and admitted contract scope; local host receives one authenticated acquisition.
- Edge cases: cross-group/cross-Engineer cap, direct Fleet entry, same capability serialization, idempotency conflict/replay, stale source/proof/principal, lost claim, provisioning compensation, off/shadow and normal idle.
- Regression risks: scheduling and Fleet claim integration. Named real concurrency/authority suites cover this slice; all six root integrity checks also apply. BRC7 full-suite baseline run-20260906T032157-9397 passed on its own subject and target; it is not a BRC8 pass. No full-suite criterion is justified absent an uncovered integration risk. Prepare final expensive evidence once after implementation freeze.

- Final review delta coverage: retain canonical run-20260906T045251-63588 (subject sha256:1991972e77cd03e5ebb99633cfde94d95b063565cba6d64685387657b0540521) as the eight-suite baseline. The only later production change is typed Fleet capacity refusal consumed by Engineer acquire-next. The five final suites cover both layers, CLI transport, real handoff/replay and the new unrelated-ready-task regression. BRC6 adoption and BRC7 planning/CLI are unchanged from that passing baseline. Final evidence is for this delta; the old subject is not a pass for the new subject.

## Rollback Point

- Commit / checkpoint: main 58401d7da5f59fef597db48e21e6ffa62a96504b.
- Revert strategy: revert the BRC8 connection and guard; preserve existing leases, WorkEnvelopes, BRC6 manifests and BRC7 evidence. No schema migration or new capacity counter exists.

- Upstream integration boundary: main 6a502de647c6ec3aac33b2afc6bb59970e0c67a1 combines remote 8e709e62 with accepted startup cancellation 492add48. Their test-only semantic conflict leaves the new cancellation sentinel on the retired socket while teardown uses the renamed socket. The sole directly blocking out-of-scope fix updates only that test socket; no product behavior changes. Verify the real Claude review suite plus cross-review package/catalog tests, then preserve the five-suite BRC8 final criteria.
