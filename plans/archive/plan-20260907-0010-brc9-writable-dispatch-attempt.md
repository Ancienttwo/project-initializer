> **Archived**: 2026-09-07 00:58
> **Related Plan**: plans/archive/plan-20260907-0010-brc9-writable-dispatch-attempt.md
> **Outcome**: Completed
> **Lifecycle**: plan
> **Parent Run ID**: run-20260907-0058
> **Archive Projection V1**: `plans/plan-20260907-0010-brc9-writable-dispatch-attempt.md` => `plans/archive/plan-20260907-0010-brc9-writable-dispatch-attempt.md`
> **Archive Projection V1**: `tasks/notes/20260907-0010-brc9-writable-dispatch-attempt.notes.md` => `tasks/archive/notes-20260907-0058-brc9-writable-dispatch-attempt.md`
> **Archive Projection V1**: `tasks/contracts/20260907-0010-brc9-writable-dispatch-attempt.contract.md` => `tasks/archive/contract-20260907-0058-brc9-writable-dispatch-attempt.md`
> **Archive Projection V1**: `tasks/reviews/20260907-0010-brc9-writable-dispatch-attempt.review.md` => `tasks/archive/review-20260907-0058-brc9-writable-dispatch-attempt.md`

# Plan: BRC9 writable dispatch and attempt bridge

> **Status**: Archived
> **Created**: 20260907-0010
> **Slug**: brc9-writable-dispatch-attempt
> **Planning Source**: waza-think
> **Orchestration Kind**: host-plan
> **Source Ref**: docs/researches/20260905-repair-campaign-sprint-execution-boundaries.md
> **Artifact Level**: work-package
> **Promotion Reason**: verification_boundary
> **Verification Boundary**: Real WorkEnvelope to writable child and TaskAutomationAttempt with crash-safe exact identity
> **Rollback Surface**: Revert source while retaining immutable launch, budget and attempt evidence
> **Spec**: `docs/spec.md`
> **Research**: See `docs/researches/`
> **Task Contract**: `tasks/archive/contract-20260907-0058-brc9-writable-dispatch-attempt.md`
> **Task Review**: `tasks/archive/review-20260907-0058-brc9-writable-dispatch-attempt.md`
> **Implementation Notes**: `tasks/archive/notes-20260907-0058-brc9-writable-dispatch-attempt.md`

## Agentic Routing
- Selected route: planning
- Routing reason: Captured from waza-think planning output.
- Source ref: docs/researches/20260905-repair-campaign-sprint-execution-boundaries.md
- Due diligence:
  - P1 map: See captured planning output below.
  - P2 trace: See captured planning output below.
  - P3 decision rationale: See captured planning output below.

## Workflow Inventory
Complete this inventory before implementation. If any line is unknown, keep the plan in Draft and fill it before projection.

- Active plan: `plans/archive/plan-20260907-0010-brc9-writable-dispatch-attempt.md`
- Sprint contract: `tasks/archive/contract-20260907-0058-brc9-writable-dispatch-attempt.md`
- Sprint review: `tasks/archive/review-20260907-0058-brc9-writable-dispatch-attempt.md`
- Implementation notes: `tasks/archive/notes-20260907-0058-brc9-writable-dispatch-attempt.md`
- Deferred-goal ledger: `tasks/todos.md`
- Current checks: `.ai/harness/checks/latest.json`
- Run snapshots: `.ai/harness/runs/`
- Scope authority: `tasks/archive/contract-20260907-0058-brc9-writable-dispatch-attempt.md` `allowed_paths`
- Concurrency rule: `.ai/harness/active-plan` selects the active plan for this worktree when present; `.ai/harness/active-worktree` records the owning worktree. If another worktree already owns active work, open or switch to the matching worktree instead of serializing unrelated plans.
- Execution isolation: approved contract-level work projects through `repo-harness run plan-to-todo --plan plans/archive/plan-20260907-0010-brc9-writable-dispatch-attempt.md` and may start `repo-harness run contract-worktree start --plan plans/archive/plan-20260907-0010-brc9-writable-dispatch-attempt.md`.

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
- Contract file: `tasks/archive/contract-20260907-0058-brc9-writable-dispatch-attempt.md`
- Review file: `tasks/archive/review-20260907-0058-brc9-writable-dispatch-attempt.md`
- Implementation notes file: `tasks/archive/notes-20260907-0058-brc9-writable-dispatch-attempt.md`
- Template: `.claude/templates/contract.template.md`
- Verification command: `repo-harness run verify-contract --contract tasks/archive/contract-20260907-0058-brc9-writable-dispatch-attempt.md --strict`
- Active plan rule: this captured plan is written to `.ai/harness/active-plan` and the owning worktree is written to `.ai/harness/active-worktree` unless --no-active is used. Do not infer active execution from the latest non-archived plan.

## Handoff

- Checks file: `.ai/harness/checks/latest.json`
- Session handoff: `.ai/harness/handoff/current.md`

## Promotion Gate

- **Merge/PR unit**: Captured plan `plans/archive/plan-20260907-0010-brc9-writable-dispatch-attempt.md` is the proposed mergeable execution unit; revise before execute if this is only a checklist step.
- **Rollback surface**: Revert source while retaining immutable launch, budget and attempt evidence
- **Verification boundary**: Real WorkEnvelope to writable child and TaskAutomationAttempt with crash-safe exact identity
- **Review/acceptance boundary**: `tasks/archive/review-20260907-0058-brc9-writable-dispatch-attempt.md` must record pass against the captured acceptance criteria.
- **High-risk surface**: Risks named in captured planning output; keep the plan Draft if risk ownership is not concrete.
- **Why not checklist row**: verification_boundary

## Evidence Contract

- **State/progress path**: `plans/archive/plan-20260907-0010-brc9-writable-dispatch-attempt.md` task breakdown, `tasks/todos.md` deferred-goal ledger, `tasks/archive/contract-20260907-0058-brc9-writable-dispatch-attempt.md`, `tasks/archive/review-20260907-0058-brc9-writable-dispatch-attempt.md`, and `tasks/archive/notes-20260907-0058-brc9-writable-dispatch-attempt.md`
- **Verification evidence**: `.ai/harness/checks/latest.json`, `.ai/harness/runs/`, and the commands named in the captured planning output
- **Evaluator rubric**: `tasks/archive/review-20260907-0058-brc9-writable-dispatch-attempt.md` must record a passing Waza /check style recommendation
- **Stop condition**: all task breakdown items are complete, sprint verification passes, and the review recommends pass
- **Rollback surface**: Revert source while retaining immutable launch, budget and attempt evidence

## Captured Planning Output

## Goal

Connect a real campaign acquisition to one host-initiated writable contract worker and the existing TaskAutomationAttemptV1 authority. Preserve the local parent host as the spawn owner; campaign step returns a durable handoff and never launches a worker itself.

## Scope

- In scope: immutable handoff built from the acquired EngineerOffer, WorkEnvelope and stored ClaimActorReceipt; exact live authority revalidation at the contract-run child boundary; persist-first launch identity and replay refusal; existing budget reservation for actual worker/verifier invocations; explicit closed attempt result and durable host process evidence; regression and installed-helper coverage.
- Out of scope: adoption terminal sequencing, acquisition charging, new retry or repair policy, Lease renewal/reclaim, automatic merge/cleanup, GPT audits/canaries, new daemon, root lifecycle command, native hook protocol, read-only delegation changes, marking BRC9 complete.

## P1 / P2 / P3

P1: campaign-acquisition currently returns only an envelope/receipt/prompt. contract-run owns the existing writable child spawn and brief/delegation preflight. controller-run demonstrates the exact Task/WorkPackage/Claim/Lease/Binding join but launches read-only delegated-run; it is not a writable host. automation-attempt-store owns attempt sequence, outcome and retry eligibility. The campaign budget store remains the only spending authority. Native hooks return context and wake adapters do not launch task workers.

P2: acquired EngineerOffer + WorkEnvelope + ClaimActorReceipt -> immutable campaign handoff -> local host invokes installed contract-run with the handoff selector -> exact live binding and contract proof -> launch claim and attempt start persisted -> existing bounded child runner -> immutable process/result evidence -> existing attempt completion. A replay of a started launch without a final result fails closed and never invokes the child again. A completed launch replays its exact result. Changed command, contract, claim generation or handoff bytes cannot reuse the identity.

P3: use the existing standalone contract-run path, including its sole execution-boundary injection owner. Do not claim new OS allowed-path confinement or token limits. Keep the current single-unresolved budget policy; another invocation can be refused while external execution is unresolved. Capacity remains an upper bound, not permission to bypass the budget. At 10x concurrency this existing reservation serialization is the first limit, and this package does not create another ledger to avoid it.

## Design

1. Add a campaign-worker effect that persists the acquired offer/envelope/receipt and local-parent binding under the existing immutable group record store. Return a selector containing repository/campaign/group/intent/dispatch identity from campaign acquisition. Authority values come from the actual acquisition; no Task, Claim, Lease or feature classification is inferred from prose.
2. Add one optional --campaign-handoff JSON-file input to existing contract-run. The selector locates the stored handoff; the file itself grants no authority. Require run mode, the exact acquired worktree and projected contract. Generic contract-run behavior stays unchanged. Resolve the owning effect from the installed package using the existing helper package layout.
3. Before actual spawn, revalidate canonical publication, policy active, parent session, Engineer principal/Binding, stored ClaimActorReceipt, WorkEnvelope and plan proof. Persist the exact command/contract-bound launch claim, then start the existing attempt with real WorkPackage/Task/Claim/Lease identity and current campaign budget. Replays never repeat a host action after ambiguous start.
4. Reserve each worker/verifier invocation through the existing budget store and bind its host-observed process result and output digests before usage. Unknown process outcomes remain unresolved. Keep execution outcome distinct from semantic acceptance: a worker supplies the closed attempt result in a dedicated contract-run result artifact; missing/invalid result fails closed to reconciliation, and no process exit is promoted to AcceptanceReceipt or canonical_done.
5. Persist final launch evidence before completing the existing attempt. Check live ownership again; stale or unknown authority cannot report a successful owned completion. Exact replay recovers from final-evidence-before-attempt-completion without spawning. No automatic retry or Claim release is added.

## Entity and file boundary

No dependency, daemon, policy key, host adapter or root command is added. One optional existing-helper flag and one internal handoff/result contract are necessary to carry the observed missing identity across the existing process boundary. One owning campaign-worker module protects the acquisition-to-spawn invariant and is consumed by campaign-acquisition and contract-run. Its tests use a factored existing acquisition fixture so both acquisition and worker tests consume the same real authority setup. Expected implementation/test/helper/docs surface exceeds eight files; the active contract will enumerate exact paths, including the mirrored packaged helper and workflow artifacts.

## Verification

Real disposable acquisition + actual child process tests: valid owned write and attempt result; zero-spawn stale Claim/Lease/Binding/plan; changed command replay refusal; same-key exactly once; launch-before-process crash; process-result-before-attempt-completion crash; unknown exit/result; budget exhaustion before child; parent/session mismatch; shadow/off refusal; worker result never creates AcceptanceReceipt. Consume existing acquisition, attempt-store and contract-run named tests for unchanged neighbors. Include type, SQL, architecture, context map, task sync, strict workflow, project state and init dry-run. No local full suite: named checks cover every changed authority and child boundary. Freeze then one canonical prepare; review consumes evidence. Target must be pinned after integrating the final main delta. Preserve baseline subjects honestly.

## Delivery and rollback

Use one external review and exact Owner acceptance if findings require correction under the one-review budget. Installed canonical contract-worktree finish only after final evidence. Retain a publication-wide task-sync digest in archived notes. Wait for the current main CI owner before pushing; do not cancel another full run. This is a partial BRC9 package sourced to the research document, not the whole sprint row. Roll back source by revert; never erase immutable launch/attempt/budget records or retry an unknown effect. BRC10 consumes the produced identity/evidence only after BRC9 complete acceptance.

## Task Breakdown

- [x] Persist the real acquisition handoff and exact launch authority.
- [x] Wire the existing contract-run host boundary to budget and attempt records.
- [ ] Prove real child execution, fencing, replay and crash behavior with named tests.
- [ ] Promote the producer interface and limitations into research; freeze and prepare exact evidence.
- [ ] Review, accept, canonical finish and follow the one publication CI; keep BRC9 pending.

## Annotations
<!-- [NOTE]: prefixed inline. Claude processes all and revises. -->
