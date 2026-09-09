# Plan: Resume stopped adopted campaigns only after settled failed execution

> **Status**: Executing
> **Created**: 20260910-0004
> **Slug**: campaign-settled-resume
> **Planning Source**: codex-plan
> **Orchestration Kind**: host-plan
> **Source Ref**: (none)
> **Artifact Level**: work-package
> **Promotion Reason**: risk_boundary
> **Verification Boundary**: Commands named in the captured planning output plus `repo-harness run verify-contract --contract tasks/contracts/20260910-0004-campaign-settled-resume.contract.md --strict`.
> **Rollback Surface**: Before execution remove `plans/plan-20260910-0004-campaign-settled-resume.md`; after execution revert branch `codex/campaign-settled-resume` or the explicitly reviewed diff.
> **Spec**: `docs/spec.md`
> **Research**: See `docs/researches/`
> **Task Contract**: `tasks/contracts/20260910-0004-campaign-settled-resume.contract.md`
> **Task Review**: `tasks/reviews/20260910-0004-campaign-settled-resume.review.md`
> **Implementation Notes**: `tasks/notes/20260910-0004-campaign-settled-resume.notes.md`

## Agentic Routing
- Selected route: planning
- Routing reason: Captured from codex-plan planning output.
- Source ref: (none)
- Due diligence:
  - P1 map: See captured planning output below.
  - P2 trace: See captured planning output below.
  - P3 decision rationale: See captured planning output below.

## Workflow Inventory
Complete this inventory before implementation. If any line is unknown, keep the plan in Draft and fill it before projection.

- Active plan: `plans/plan-20260910-0004-campaign-settled-resume.md`
- Sprint contract: `tasks/contracts/20260910-0004-campaign-settled-resume.contract.md`
- Sprint review: `tasks/reviews/20260910-0004-campaign-settled-resume.review.md`
- Implementation notes: `tasks/notes/20260910-0004-campaign-settled-resume.notes.md`
- Deferred-goal ledger: `tasks/todos.md`
- Current checks: `.ai/harness/checks/latest.json`
- Run snapshots: `.ai/harness/runs/`
- Scope authority: `tasks/contracts/20260910-0004-campaign-settled-resume.contract.md` `allowed_paths`
- Concurrency rule: `.ai/harness/active-plan` selects the active plan for this worktree when present; `.ai/harness/active-worktree` records the owning worktree. If another worktree already owns active work, open or switch to the matching worktree instead of serializing unrelated plans.
- Execution isolation: approved contract-level work projects through `repo-harness run plan-to-todo --plan plans/plan-20260910-0004-campaign-settled-resume.md` and may start `repo-harness run contract-worktree start --plan plans/plan-20260910-0004-campaign-settled-resume.md`.

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
- Contract file: `tasks/contracts/20260910-0004-campaign-settled-resume.contract.md`
- Review file: `tasks/reviews/20260910-0004-campaign-settled-resume.review.md`
- Implementation notes file: `tasks/notes/20260910-0004-campaign-settled-resume.notes.md`
- Template: `.claude/templates/contract.template.md`
- Verification command: `repo-harness run verify-contract --contract tasks/contracts/20260910-0004-campaign-settled-resume.contract.md --strict`
- Active plan rule: this captured plan is written to `.ai/harness/active-plan` and the owning worktree is written to `.ai/harness/active-worktree` unless --no-active is used. Do not infer active execution from the latest non-archived plan.

## Handoff

- Checks file: `.ai/harness/checks/latest.json`
- Session handoff: `.ai/harness/handoff/current.md`

## Promotion Gate

- **Merge/PR unit**: Captured plan `plans/plan-20260910-0004-campaign-settled-resume.md` is the proposed mergeable execution unit; revise before execute if this is only a checklist step.
- **Rollback surface**: Before execution remove `plans/plan-20260910-0004-campaign-settled-resume.md`; after execution revert branch `codex/campaign-settled-resume` or the explicitly reviewed diff.
- **Verification boundary**: Commands named in the captured planning output plus `repo-harness run verify-contract --contract tasks/contracts/20260910-0004-campaign-settled-resume.contract.md --strict`.
- **Review/acceptance boundary**: `tasks/reviews/20260910-0004-campaign-settled-resume.review.md` must record pass against the captured acceptance criteria.
- **High-risk surface**: Risks named in captured planning output; keep the plan Draft if risk ownership is not concrete.
- **Why not checklist row**: risk_boundary

## Evidence Contract

- **State/progress path**: `plans/plan-20260910-0004-campaign-settled-resume.md` task breakdown, `tasks/todos.md` deferred-goal ledger, `tasks/contracts/20260910-0004-campaign-settled-resume.contract.md`, `tasks/reviews/20260910-0004-campaign-settled-resume.review.md`, and `tasks/notes/20260910-0004-campaign-settled-resume.notes.md`
- **Verification evidence**: `.ai/harness/checks/latest.json`, `.ai/harness/runs/`, and the commands named in the captured planning output
- **Evaluator rubric**: `tasks/reviews/20260910-0004-campaign-settled-resume.review.md` must record a passing Waza /check style recommendation
- **Stop condition**: all task breakdown items are complete, sprint verification passes, and the review recommends pass
- **Rollback surface**: Before execution remove `plans/plan-20260910-0004-campaign-settled-resume.md`; after execution revert branch `codex/campaign-settled-resume` or the explicitly reviewed diff.

## Captured Planning Output

## Direction

A stopped adopted campaign with fully settled failed execution may create one fresh continuation of its own original Issues. It must never revive the stopped grant, reopen the retired dispatch, reuse a released claim, decrement acquisitions or treat failure as no_progress. Existing never-adopted successor replacement retains its narrower boundary.

P1: gpt-pro-issue-authoring currently rejects every adopted source with acquisition>0. campaign prepare-resume currently projects source records but does not apply that same source-eligibility predicate. campaign-worker owns handoff/final/terminal records; the protected container journal owns runtime inactivity; budget store owns counters and settlements; continuation is an immutable exclusive binding.
P2: the actual predecessor was adopted/published, acquired once, worker+verifier terminated with external_blocked/verifier_rejected, both results settled, dispatch retired, lease released, then canonical stop. Normal resume rejects solely on acquisition count even though all effects have closed. The new source must be this adopted stopped campaign, not an attempted replacement of the prior source's continuation link.
P3: introduce one source-eligibility reader shared by prepare-resume and author admission. Zero acquisition retains existing behavior with explicit quiescence validation. Nonzero acquisition requires complete canonical handoff inventory matching the budget acquisition count, exact settled external_blocked failed final for each dispatch, retirement, available lease, and freshly validated native container terminal receipts for both roles. Reject missing, unknown, recovered/partial, success/publication or active evidence. No supplied booleans. Existing single-continuation binder remains unchanged. At 10x scale record enumeration dominates; groups and acquisition budget are bounded, do not add another dispatch index authority.

## Scope

- src/effects/automation/campaign-planning-store.ts: enumerate validated planning records through owning store, not caller filesystem parsing.
- src/effects/automation/campaign-authoring-resume.ts: shared stopped-adopted eligibility consuming canonical budget and execution authorities.
- src/effects/automation/campaign-worker.ts: read-only failed retired dispatch proof, reusing existing terminal and budget validation; no worker launch/recovery behavior change.
- src/effects/automation/gpt-pro-issue-authoring.ts and src/cli/commands/campaign.ts: use shared eligibility before request file/provider writes.
- tests/effects/campaign-authoring-resume.test.ts and bounded new settled-resume tests/fixtures as required for negative coverage.
- docs/researches/20260910-campaign-settled-resume.md and canonical workflow/architecture artifacts.

## Task Breakdown

1. Prove source gate refusal with model-free regression using canonical settled dispatch fixtures; enumerate negative evidence branches.
2. Implement shared read-only eligibility and a fresh continuation through existing binder. Keep original issue IDs and cumulative spent counters.
3. Test rejection for unretired dispatch, held/unknown lease, missing final or budget settlement, incomplete/forged runtime proof, acquisition inventory mismatch and completed task; test exclusive continuation and unchanged predecessor records.
4. After environment PR #384 merges, bind base/digests to exact origin/main. Focused tests, check:type and six required integrity checks; security/acceptance on frozen implementation, no local full suite. PR/CI/squash merge.
5. Real zero-model prepare-resume against stopped canary, repair expired budget drift with existing canonical verb when needed. Build final image and prove readiness before a new budget-bound continuation; preserve old WIP/evidence and original one-group/two-slot manual-merge goal.

## Verification

Deterministic model-free state/effect tests plus exact negative authority cases, typecheck and mandatory integrity. No provider or browser invocation until both repairs are merged and actual preflight succeeds. Grant caps derive remaining original budget without increases; old consumption is immutable. Actual model continuation/fresh audit remains BRC acceptance, not claimed by these tests.

## Annotations
<!-- [NOTE]: prefixed inline. Claude processes all and revises. -->

## Task Breakdown
- [ ] Execute captured plan: Resume stopped adopted campaigns only after settled failed execution
