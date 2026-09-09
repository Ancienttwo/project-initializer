> **Archived**: 2026-09-10 00:02
> **Related Plan**: plans/archive/plan-20260909-2347-campaign-execution-environment.md
> **Outcome**: Completed
> **Lifecycle**: plan
> **Parent Run ID**: run-20260910-0002
> **Archive Projection V1**: `plans/plan-20260909-2347-campaign-execution-environment.md` => `plans/archive/plan-20260909-2347-campaign-execution-environment.md`
> **Archive Projection V1**: `tasks/notes/20260909-2347-campaign-execution-environment.notes.md` => `tasks/archive/notes-20260910-0002-campaign-execution-environment.md`
> **Archive Projection V1**: `tasks/contracts/20260909-2347-campaign-execution-environment.contract.md` => `tasks/archive/contract-20260910-0002-campaign-execution-environment.md`
> **Archive Projection V1**: `tasks/reviews/20260909-2347-campaign-execution-environment.review.md` => `tasks/archive/review-20260910-0002-campaign-execution-environment.md`

# Plan: Supply a verifiable Linux campaign execution environment

> **Status**: Archived
> **Created**: 20260909-2347
> **Slug**: campaign-execution-environment
> **Planning Source**: codex-plan
> **Orchestration Kind**: host-plan
> **Source Ref**: (none)
> **Artifact Level**: work-package
> **Promotion Reason**: verification_boundary
> **Verification Boundary**: Commands named in the captured planning output plus `repo-harness run verify-contract --contract tasks/archive/contract-20260910-0002-campaign-execution-environment.md --strict`.
> **Rollback Surface**: Before execution remove `plans/archive/plan-20260909-2347-campaign-execution-environment.md`; after execution revert branch `codex/campaign-execution-environment` or the explicitly reviewed diff.
> **Spec**: `docs/spec.md`
> **Research**: See `docs/researches/`
> **Task Contract**: `tasks/archive/contract-20260910-0002-campaign-execution-environment.md`
> **Task Review**: `tasks/archive/review-20260910-0002-campaign-execution-environment.md`
> **Implementation Notes**: `tasks/archive/notes-20260910-0002-campaign-execution-environment.md`

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

- Active plan: `plans/archive/plan-20260909-2347-campaign-execution-environment.md`
- Sprint contract: `tasks/archive/contract-20260910-0002-campaign-execution-environment.md`
- Sprint review: `tasks/archive/review-20260910-0002-campaign-execution-environment.md`
- Implementation notes: `tasks/archive/notes-20260910-0002-campaign-execution-environment.md`
- Deferred-goal ledger: `tasks/todos.md`
- Current checks: `.ai/harness/checks/latest.json`
- Run snapshots: `.ai/harness/runs/`
- Scope authority: `tasks/archive/contract-20260910-0002-campaign-execution-environment.md` `allowed_paths`
- Concurrency rule: `.ai/harness/active-plan` selects the active plan for this worktree when present; `.ai/harness/active-worktree` records the owning worktree. If another worktree already owns active work, open or switch to the matching worktree instead of serializing unrelated plans.
- Execution isolation: approved contract-level work projects through `repo-harness run plan-to-todo --plan plans/archive/plan-20260909-2347-campaign-execution-environment.md` and may start `repo-harness run contract-worktree start --plan plans/archive/plan-20260909-2347-campaign-execution-environment.md`.

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
- Contract file: `tasks/archive/contract-20260910-0002-campaign-execution-environment.md`
- Review file: `tasks/archive/review-20260910-0002-campaign-execution-environment.md`
- Implementation notes file: `tasks/archive/notes-20260910-0002-campaign-execution-environment.md`
- Template: `.claude/templates/contract.template.md`
- Verification command: `repo-harness run verify-contract --contract tasks/archive/contract-20260910-0002-campaign-execution-environment.md --strict`
- Active plan rule: this captured plan is written to `.ai/harness/active-plan` and the owning worktree is written to `.ai/harness/active-worktree` unless --no-active is used. Do not infer active execution from the latest non-archived plan.

## Handoff

- Checks file: `.ai/harness/checks/latest.json`
- Session handoff: `.ai/harness/handoff/current.md`

## Promotion Gate

- **Merge/PR unit**: Captured plan `plans/archive/plan-20260909-2347-campaign-execution-environment.md` is the proposed mergeable execution unit; revise before execute if this is only a checklist step.
- **Rollback surface**: Before execution remove `plans/archive/plan-20260909-2347-campaign-execution-environment.md`; after execution revert branch `codex/campaign-execution-environment` or the explicitly reviewed diff.
- **Verification boundary**: Commands named in the captured planning output plus `repo-harness run verify-contract --contract tasks/archive/contract-20260910-0002-campaign-execution-environment.md --strict`.
- **Review/acceptance boundary**: `tasks/archive/review-20260910-0002-campaign-execution-environment.md` must record pass against the captured acceptance criteria.
- **High-risk surface**: Risks named in captured planning output; keep the plan Draft if risk ownership is not concrete.
- **Why not checklist row**: verification_boundary

## Evidence Contract

- **State/progress path**: `plans/archive/plan-20260909-2347-campaign-execution-environment.md` task breakdown, `tasks/todos.md` deferred-goal ledger, `tasks/archive/contract-20260910-0002-campaign-execution-environment.md`, `tasks/archive/review-20260910-0002-campaign-execution-environment.md`, and `tasks/archive/notes-20260910-0002-campaign-execution-environment.md`
- **Verification evidence**: `.ai/harness/checks/latest.json`, `.ai/harness/runs/`, and the commands named in the captured planning output
- **Evaluator rubric**: `tasks/archive/review-20260910-0002-campaign-execution-environment.md` must record a passing Waza /check style recommendation
- **Stop condition**: all task breakdown items are complete, sprint verification passes, and the review recommends pass
- **Rollback surface**: Before execution remove `plans/archive/plan-20260909-2347-campaign-execution-environment.md`; after execution revert branch `codex/campaign-execution-environment` or the explicitly reviewed diff.

## Captured Planning Output

## Direction and constraints

The execution environment must supply the accepted task's tools and platform dependencies before a paid worker starts. Pin the actual harness package in the Docker image and provision dependencies inside Linux using the target lockfile. Keep the existing containment authority, non-root workload, read-only common Git mount, immutable image ID and host journal. Do not widen mounts, modify the watchdog, reinterpret results or grant budgets.

P1: deploy/campaign-container/Dockerfile supplies Codex/Node/Bun only; campaign-runtime prepares a codex version probe then a worktree-mounted workload; campaign-container owns exact request/readback and terminal receipts. Target fleet worktree has macOS-installed node_modules. The trusted harness package CLI is absent from the image.
P2: authored contract -> admitted worker -> version probe success -> Docker worker -> package Vitest load fails on missing Linux ARM64 Rolldown -> canonical verify-sprint command absent -> verifier_rejected. Both failures are deterministic environment facts; no model needed to reproduce them.
P3: build the actual package into the image from a local packed artifact and frozen harness lockfile; explicitly prepare target Linux dependencies through the existing container runner, then execute an operator-selected zero-model verification command with no credential mount. This is an operator deployment boundary, not a new campaign state or fallback runtime. At 10x scale dependency installation is the first cost; defer shared caching until observed demand, use immutable image caching now.

## Geju direction

Thesis: an image with a working Codex binary is not an executable task environment. Clean target is a pinned harness package plus a target-owned Linux dependency preparation and exact command proof. Confidence high for current two failures; a real isolated probe will falsify any hidden path assumptions. Move: end-state backcasting. Delete reliance on host-installed native binaries as readiness evidence. Conservative image-only install leaves native dependencies unresolved; broad runtime rewrite violates scope; staged clean path fixes image supply and proves it under existing containment first. Do not add extra mounts, credential inheritance, target schema heuristics or claim a no-model probe is live BRC acceptance.

## Scope

- deploy/campaign-container/Dockerfile: require an exact local packed harness artifact and frozen bun.lock; install Linux dependencies and expose actual CLI.
- scripts/build-campaign-image.sh: package current source, build local image using disposable context; no publication/global install; emit immutable image ID and artifact hashes.
- scripts/run-campaign-preflight.ts: operator-only no-auth command execution through existing prepare/run containment APIs with explicit worktree/image/command/deadline; retained terminal evidence and nonzero failures. No campaign/provider budget mutation.
- tests/effects/campaign-environment.test.ts: actual pinned image/harness/helper and Linux native package probe with zero model calls; missing tools/native deps reject; existing containment tests retained.
- docs/researches/20260909-campaign-execution-environment.md: runbook, exact RED/GREEN evidence and supply constraints.
- Canonical workflow/architecture projections required by changed paths.

## Task Breakdown

1. Capture original-image zero-model failures and record Root Cause Evidence.
2. Implement image supply and explicit preflight; build frozen candidate image.
3. Prove actual harness helper resolution and Linux-native target test loading in a disposable target checkout, preserving existing canary WIP. Run focused tests, typecheck and six integrity checks.
4. Freeze exact subject; canonical acceptance and finish; PR Required CI then squash merge. No local harness full suite.
5. Subsequent work-package owns settled-execution recovery protocol, retaining original Issues/spent budget and never reviving old grant. Do not implement recovery in this image-supply PR.

## Verification

Focused environment/container checks plus check:type and six mandatory integrity checks. Live Docker test is explicit model-free, image ID recorded in environment inputs. Target probe validates actual installed package and native dependency loading without claiming task acceptance. No repeated expensive target full suite; actual task final acceptance stays with resumed worker contract.

## Annotations
<!-- [NOTE]: prefixed inline. Claude processes all and revises. -->

## Task Breakdown
- [ ] Execute captured plan: Supply a verifiable Linux campaign execution environment
