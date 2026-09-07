# Plan: BRC6a active admission boundary correction

> **Status**: Executing
> **Created**: 20260907-1706
> **Slug**: brc6a-admission
> **Planning Source**: codex-plan
> **Orchestration Kind**: host-plan
> **Source Ref**: docs/researches/20260907-brc14-fresh-audit-readiness.md
> **Artifact Level**: work-package
> **Promotion Reason**: risk_boundary
> **Verification Boundary**: new admission refusal versus historical settlement and cleanup
> **Rollback Surface**: single bounded admission safety change, no persistence migration
> **Spec**: `docs/spec.md`
> **Research**: See `docs/researches/`
> **Task Contract**: `tasks/contracts/20260907-1706-brc6a-admission.contract.md`
> **Task Review**: `tasks/reviews/20260907-1706-brc6a-admission.review.md`
> **Implementation Notes**: `tasks/notes/20260907-1706-brc6a-admission.notes.md`

## Agentic Routing
- Selected route: planning
- Routing reason: Captured from codex-plan planning output.
- Source ref: docs/researches/20260907-brc14-fresh-audit-readiness.md
- Due diligence:
  - P1 map: See captured planning output below.
  - P2 trace: See captured planning output below.
  - P3 decision rationale: See captured planning output below.

## Workflow Inventory
Complete this inventory before implementation. If any line is unknown, keep the plan in Draft and fill it before projection.

- Active plan: `plans/plan-20260907-1706-brc6a-admission.md`
- Sprint contract: `tasks/contracts/20260907-1706-brc6a-admission.contract.md`
- Sprint review: `tasks/reviews/20260907-1706-brc6a-admission.review.md`
- Implementation notes: `tasks/notes/20260907-1706-brc6a-admission.notes.md`
- Deferred-goal ledger: `tasks/todos.md`
- Current checks: `.ai/harness/checks/latest.json`
- Run snapshots: `.ai/harness/runs/`
- Scope authority: `tasks/contracts/20260907-1706-brc6a-admission.contract.md` `allowed_paths`
- Concurrency rule: `.ai/harness/active-plan` selects the active plan for this worktree when present; `.ai/harness/active-worktree` records the owning worktree. If another worktree already owns active work, open or switch to the matching worktree instead of serializing unrelated plans.
- Execution isolation: approved contract-level work projects through `repo-harness run plan-to-todo --plan plans/plan-20260907-1706-brc6a-admission.md` and may start `repo-harness run contract-worktree start --plan plans/plan-20260907-1706-brc6a-admission.md`.

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
- Contract file: `tasks/contracts/20260907-1706-brc6a-admission.contract.md`
- Review file: `tasks/reviews/20260907-1706-brc6a-admission.review.md`
- Implementation notes file: `tasks/notes/20260907-1706-brc6a-admission.notes.md`
- Template: `.claude/templates/contract.template.md`
- Verification command: `repo-harness run verify-contract --contract tasks/contracts/20260907-1706-brc6a-admission.contract.md --strict`
- Active plan rule: this captured plan is written to `.ai/harness/active-plan` and the owning worktree is written to `.ai/harness/active-worktree` unless --no-active is used. Do not infer active execution from the latest non-archived plan.

## Handoff

- Checks file: `.ai/harness/checks/latest.json`
- Session handoff: `.ai/harness/handoff/current.md`

## Promotion Gate

- **Merge/PR unit**: Captured plan `plans/plan-20260907-1706-brc6a-admission.md` is the proposed mergeable execution unit; revise before execute if this is only a checklist step.
- **Rollback surface**: single bounded admission safety change, no persistence migration
- **Verification boundary**: new admission refusal versus historical settlement and cleanup
- **Review/acceptance boundary**: `tasks/reviews/20260907-1706-brc6a-admission.review.md` must record pass against the captured acceptance criteria.
- **High-risk surface**: Risks named in captured planning output; keep the plan Draft if risk ownership is not concrete.
- **Why not checklist row**: risk_boundary

## Evidence Contract

- **State/progress path**: `plans/plan-20260907-1706-brc6a-admission.md` task breakdown, `tasks/todos.md` deferred-goal ledger, `tasks/contracts/20260907-1706-brc6a-admission.contract.md`, `tasks/reviews/20260907-1706-brc6a-admission.review.md`, and `tasks/notes/20260907-1706-brc6a-admission.notes.md`
- **Verification evidence**: `.ai/harness/checks/latest.json`, `.ai/harness/runs/`, and the commands named in the captured planning output
- **Evaluator rubric**: `tasks/reviews/20260907-1706-brc6a-admission.review.md` must record a passing Waza /check style recommendation
- **Stop condition**: all task breakdown items are complete, sprint verification passes, and the review recommends pass
- **Rollback surface**: single bounded admission safety change, no persistence migration

## Captured Planning Output

# BRC6a active admission boundary correction

## Goal

Stop new active campaign work when the current Connector transport cannot prove the exact Git revision. Preserve strict reconciliation, settlement and cleanup of already admitted work. This is the bounded safety portion of BRC6a: it does not deliver a revision producer, close the BRC6a Sprint row, implement BRC14, or activate a real campaign.

## P1 / P2 / P3

P1: Connector challenge owns content-sample verification. Adoption, planning, Fleet offers/acquisition and worker launch consume it across automation/Fleet boundaries. The existing campaign planning proof also revalidates historical WorkEnvelope and recovered Lease state; it must not become a blanket execution denial.

P2: `verifyConnectorChallenge` accepts old-commit answers paired with a new echoed SHA when the sampled tree is unchanged. `adoptIssueBatch` then materializes active Tasks; its stored-adoption branch can republish before the new-adoption path. Historical canonical manifests feed campaign planning and generic Fleet offers. A guard only on new adoption leaves old-artifact admission open. A guard on the shared antecedent proof instead strands recovery and final settlement.

P3: Keep one content-evidence authority and the current immutable antecedent validation. Add one explicit refusal for new active admission while trusted revision evidence is unavailable; do not create an unproducible receipt schema, override flag, fake producer, compatibility fallback, or test-only product path. Put refusal before external calls, budget reservations, Lease/dispatch creation and new launches. Historical settlement/cleanup retains its original exact Claim/Lease/reservation/final checks. At 10x scale the refusal is constant-cost; existing journal/proof scans retain their current cost. No dependencies or release/migration are added.

## Scope

- Keep `challenge_verified` semantically limited to content matching; freeze the stale-answer/new-SHA counterexample in a real regression test.
- Refuse active adoption before both new and stored replay branches. Explicit shadow observation remains available.
- Refuse new active planning and plan_ready admission, and active acquisition (including stored-artifact/generic Fleet routes). Preserve terminal closure of an already issued planning job where it cannot authorize execution.
- Keep `campaignTaskPlanProof` as historical antecedent validation; expose the current admission refusal in Fleet execution readiness without invalidating historical envelope/recovery validation.
- Refuse new handoff and new child launch. Existing immutable final replay may settle only after the original strict checks. Retirement and inactivity observation remain available. Recovery must not create a new executable dispatch or retry; exact final settlement/recovery and exact closeout remain available.
- Use explicit synthetic historical fixture construction with the existing typed builders and stores for lower-level lifecycle tests. No production bypass, skipped failures, fabricated provider proof, guard mocks, or copied old runtime. Update tests that expected unsupported active admission to assert the new refusal.
- Update affected architecture/protected inventory consumers and durable research. The existing BRC14 readiness worktree remains separately owned and is not merged by this package.

## Non-goals

No trusted revision producer, browser transport change, challenge-to-exact-SHA relabelling, BRC14 group sequencing, budget arithmetic change, broader Lease semantics, real provider/canary execution, npm publication or tag.

## Task Breakdown

- [x] Freeze pre-fix regressions for active new/stored adoption and old-artifact execution admission; capture the four-field Root Cause Evidence.
- [x] Implement the shared refusal and separate admission from antecedent proof at each observed mutation/readiness boundary.
- [x] Migrate historical fixture setup using typed artifacts; prove recovery/final/cleanup remain strict and cannot launch new work.
- [ ] Run focused changed-boundary tests, affected lifecycle tests, typecheck and six repository integrity checks. Freeze once and prepare final acceptance through verify-sprint; do not add a local full-suite criterion without uncovered cross-module risk.
- [ ] Record the bounded safety result with BRC6a still pending, consume one required acceptance boundary, canonical finish, publish/merge and follow required CI; clean only this package's worktree.

## Verification boundary

New active calls and stored replay must refuse before provider/observation/reservation/Lease/dispatch writes. Generic Fleet acquisition must remain unavailable for historical campaign manifests. Shadow budget tests must pass. Historical retirement, proven inactivity, exact final replay/settlement and exact closeout must retain positive coverage, plus wrong Claim/generation/reservation/final refusal. Existing non-campaign Fleet behavior remains covered. Original broad CI is baseline only; named delta suites are final local acceptance, and required remote CI covers publication.

## Rollback

One bounded Git change set. No stored data is migrated or rewritten. Reverting restores the unsafe admission behavior and therefore requires an explicit owner decision; no automatic rollback or fallback is implemented.

## Annotations
<!-- [NOTE]: prefixed inline. Claude processes all and revises. -->

