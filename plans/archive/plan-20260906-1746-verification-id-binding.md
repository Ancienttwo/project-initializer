> **Archived**: 2026-09-06 18:24
> **Related Plan**: plans/archive/plan-20260906-1746-verification-id-binding.md
> **Outcome**: Completed
> **Lifecycle**: plan
> **Parent Run ID**: run-20260906-1824
> **Archive Projection V1**: `plans/plan-20260906-1746-verification-id-binding.md` => `plans/archive/plan-20260906-1746-verification-id-binding.md`
> **Archive Projection V1**: `tasks/notes/20260906-1746-verification-id-binding.notes.md` => `tasks/archive/notes-20260906-1824-verification-id-binding.md`
> **Archive Projection V1**: `tasks/contracts/20260906-1746-verification-id-binding.contract.md` => `tasks/archive/contract-20260906-1824-verification-id-binding.md`
> **Archive Projection V1**: `tasks/reviews/20260906-1746-verification-id-binding.review.md` => `tasks/archive/review-20260906-1824-verification-id-binding.md`

# Plan: Correct verification identity and complete cutover consumers

> **Status**: Archived
> **Created**: 20260906-1746
> **Slug**: verification-id-binding
> **Planning Source**: codex-plan-or-waza-think
> **Orchestration Kind**: host-plan
> **Source Ref**: (none)
> **Artifact Level**: work-package
> **Promotion Reason**: verification_boundary
> **Verification Boundary**: Installed admitted long-ID counter regression and receipt projection
> **Rollback Surface**: Verification execution identity lookup and receipt mapping
> **Spec**: `docs/spec.md`
> **Research**: See `docs/researches/`
> **Task Contract**: `tasks/archive/contract-20260906-1824-verification-id-binding.md`
> **Task Review**: `tasks/archive/review-20260906-1824-verification-id-binding.md`
> **Implementation Notes**: `tasks/archive/notes-20260906-1824-verification-id-binding.md`

## Agentic Routing
- Selected route: planning
- Routing reason: Captured from codex-plan-or-waza-think planning output.
- Source ref: (none)
- Due diligence:
  - P1 map: See captured planning output below.
  - P2 trace: See captured planning output below.
  - P3 decision rationale: See captured planning output below.

## Workflow Inventory
Complete this inventory before implementation. If any line is unknown, keep the plan in Draft and fill it before projection.

- Active plan: `plans/archive/plan-20260906-1746-verification-id-binding.md`
- Sprint contract: `tasks/archive/contract-20260906-1824-verification-id-binding.md`
- Sprint review: `tasks/archive/review-20260906-1824-verification-id-binding.md`
- Implementation notes: `tasks/archive/notes-20260906-1824-verification-id-binding.md`
- Deferred-goal ledger: `tasks/todos.md`
- Current checks: `.ai/harness/checks/latest.json`
- Run snapshots: `.ai/harness/runs/`
- Scope authority: `tasks/archive/contract-20260906-1824-verification-id-binding.md` `allowed_paths`
- Concurrency rule: `.ai/harness/active-plan` selects the active plan for this worktree when present; `.ai/harness/active-worktree` records the owning worktree. If another worktree already owns active work, open or switch to the matching worktree instead of serializing unrelated plans.
- Execution isolation: approved contract-level work projects through `repo-harness run plan-to-todo --plan plans/archive/plan-20260906-1746-verification-id-binding.md` and may start `repo-harness run contract-worktree start --plan plans/archive/plan-20260906-1746-verification-id-binding.md`.

## Approach
### Strategy
Use the captured planning output below as the execution source of truth.

### Trade-offs
| Option | Pros | Cons | Decision |
|--------|------|------|----------|
| Captured plan | Preserves the approved Codex Plan or Waza think decision | Requires the captured text to be concrete enough to execute | Use |

## Detailed Design
### File Changes
| File | Action | Description |
|------|--------|-------------|
| See captured planning output | Follow | Implement only the approved scope named below |

### Code Snippets
See captured planning output.

### Data Flow
See captured planning output.

## Risk Assessment
| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Captured plan lacks enough detail | Medium | Execution may need clarification | Stop before implementation if the captured output contradicts repo rules or lacks concrete file targets |

## Task Contracts
- Contract file: `tasks/archive/contract-20260906-1824-verification-id-binding.md`
- Review file: `tasks/archive/review-20260906-1824-verification-id-binding.md`
- Implementation notes file: `tasks/archive/notes-20260906-1824-verification-id-binding.md`
- Template: `.claude/templates/contract.template.md`
- Verification command: `repo-harness run verify-contract --contract tasks/archive/contract-20260906-1824-verification-id-binding.md --strict`
- Active plan rule: this captured plan is written to `.ai/harness/active-plan` and the owning worktree is written to `.ai/harness/active-worktree` unless --no-active is used. Do not infer active execution from the latest non-archived plan.

## Handoff

- Checks file: `.ai/harness/checks/latest.json`
- Session handoff: `.ai/harness/handoff/current.md`

## Promotion Gate

- **Merge/PR unit**: Captured plan `plans/archive/plan-20260906-1746-verification-id-binding.md` is the proposed mergeable execution unit; revise before execute if this is only a checklist step.
- **Rollback surface**: Verification execution identity lookup and receipt mapping
- **Verification boundary**: Installed admitted long-ID counter regression and receipt projection
- **Review/acceptance boundary**: `tasks/archive/review-20260906-1824-verification-id-binding.md` must record pass against the captured acceptance criteria.
- **High-risk surface**: Risks named in captured planning output; keep the plan Draft if risk ownership is not concrete.
- **Why not checklist row**: verification_boundary

## Evidence Contract

- **State/progress path**: `plans/archive/plan-20260906-1746-verification-id-binding.md` task breakdown, `tasks/todos.md` deferred-goal ledger, `tasks/archive/contract-20260906-1824-verification-id-binding.md`, `tasks/archive/review-20260906-1824-verification-id-binding.md`, and `tasks/archive/notes-20260906-1824-verification-id-binding.md`
- **Verification evidence**: `.ai/harness/checks/latest.json`, `.ai/harness/runs/`, and the commands named in the captured planning output
- **Evaluator rubric**: `tasks/archive/review-20260906-1824-verification-id-binding.md` must record a passing Waza /check style recommendation
- **Stop condition**: all task breakdown items are complete, sprint verification passes, and the review recommends pass
- **Rollback surface**: Verification execution identity lookup and receipt mapping

## Captured Planning Output

## Objective
Close the reproduced long-check-ID hole in the already approved verification lifecycle cutover. A schema-valid long ID must not permit a second ordinary expensive execution after a pass.

## P1 / P2 Evidence
Installed CLI fixture /tmp/rh-cutover-long-check-id-repro.json records counter 1 then 2 for the same cache_key; ledger redaction rewrites payload.check_id. The effect currently uses that display string in reusableResult, priorExecutionExists, baseline supersession, and historical receipt lookup. The materialized receipt also keys results by raw ID.

## P3 Decision
Use existing execution/cache fingerprints as the execution-control authority. Do not change the global secret redactor, invent an ID length cap, rewrite history, or add raw/projected fallback. Exact reuse selects the latest same-cache-key event first, validates its immutable record and original check ID, and rejects invalid/latest-failed facts. Prior expensive execution detection uses the executable fingerprint independently of a display ID, so renaming cannot authorize a rerun. Historical exact validation already binds check_fingerprint; remove the redundant redacted ID comparison. At the materialized receipt boundary, project expected IDs once using the canonical writer projection, then map supplied results back to declared check keys for validation. Reject missing/duplicate/tampered projected IDs. Baseline counterevidence uses same cache key, including a later failed equivalent execution under another name. At scale, fingerprints retain bounded semantics; ledger scan cost is unchanged.

## Scope
src/effects/evidence/verification-execution.ts and tests/effects/verification-execution.test.ts; task evidence and a bounded research addendum. No global redaction/schema change, no full-suite local execution, no unrelated cleanup.

## Verification
Use deterministic counter regressions for long ID, renamed ID, latest failure/invalid run, and writer-projected receipt validation. Run the effect/core/adapter/receipt focused files, typecheck, projections and six repository integrity checks. Consume original CI as evidence for its original subject only. Rebuild/install the bounded correction and repeat the tiny installed counter readback; Required CI retains its declared release checks.

## CI cutover closure

Required CI run 34025058232 on 879c9bfd failed. Complete the consumers omitted by the new canonical Verification Plan: helper help inventory, protocol ownership adjudication, and proven fixture/producer migrations. Preserve original assertions and fail-closed validation. Diagnose each failing file before widening its Allowed Paths. Validate named affected cases locally; the corrected publication still requires remote CI.

## Annotations
<!-- [NOTE]: prefixed inline. Claude processes all and revises. -->

## Task Breakdown
- [x] Reproduce the admitted long-ID failure and correct fingerprint/receipt identity binding with focused red-green checks.
- [x] Complete the canonical authoring and static-consumer omissions proven by Required CI.
- [ ] Verify the frozen correction, record acceptance, integrate and read back installed behavior without rerunning local full-suite baselines.
