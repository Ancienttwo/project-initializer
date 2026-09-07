# Plan: BRC15a real GPT shadow canary

> **Status**: Draft
> **Created**: 20260907-2055
> **Slug**: brc15a-real-shadow-canary
> **Planning Source**: waza-think
> **Orchestration Kind**: host-plan
> **Source Ref**: sprint:plans/sprints/20260902-2238-gpt-pro-seeded-repair-campaign.sprint.md#BRC15a — Real GPT shadow canary 与价值观测
> **Artifact Level**: work-package
> **Promotion Reason**: verification_boundary
> **Verification Boundary**: Real provider observation and explicit bounded external mutation grant
> **Rollback Surface**: Before execution remove `plans/plan-20260907-2055-brc15a-real-shadow-canary.md`; after execution revert branch `codex/brc15a-real-shadow-canary` or the explicitly reviewed diff.
> **Spec**: `docs/spec.md`
> **Research**: See `docs/researches/`
> **Task Contract**: `tasks/contracts/20260907-2055-brc15a-real-shadow-canary.contract.md`
> **Task Review**: `tasks/reviews/20260907-2055-brc15a-real-shadow-canary.review.md`
> **Implementation Notes**: `tasks/notes/20260907-2055-brc15a-real-shadow-canary.notes.md`

## Agentic Routing
- Selected route: planning
- Routing reason: Captured from waza-think planning output.
- Source ref: sprint:plans/sprints/20260902-2238-gpt-pro-seeded-repair-campaign.sprint.md#BRC15a — Real GPT shadow canary 与价值观测
- Due diligence:
  - P1 map: See captured planning output below.
  - P2 trace: See captured planning output below.
  - P3 decision rationale: See captured planning output below.

## Workflow Inventory
Complete this inventory before implementation. If any line is unknown, keep the plan in Draft and fill it before projection.

- Active plan: `plans/plan-20260907-2055-brc15a-real-shadow-canary.md`
- Sprint contract: `tasks/contracts/20260907-2055-brc15a-real-shadow-canary.contract.md`
- Sprint review: `tasks/reviews/20260907-2055-brc15a-real-shadow-canary.review.md`
- Implementation notes: `tasks/notes/20260907-2055-brc15a-real-shadow-canary.notes.md`
- Deferred-goal ledger: `tasks/todos.md`
- Current checks: `.ai/harness/checks/latest.json`
- Run snapshots: `.ai/harness/runs/`
- Scope authority: `tasks/contracts/20260907-2055-brc15a-real-shadow-canary.contract.md` `allowed_paths`
- Concurrency rule: `.ai/harness/active-plan` selects the active plan for this worktree when present; `.ai/harness/active-worktree` records the owning worktree. If another worktree already owns active work, open or switch to the matching worktree instead of serializing unrelated plans.
- Execution isolation: approved contract-level work projects through `repo-harness run plan-to-todo --plan plans/plan-20260907-2055-brc15a-real-shadow-canary.md` and may start `repo-harness run contract-worktree start --plan plans/plan-20260907-2055-brc15a-real-shadow-canary.md`.

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
- Contract file: `tasks/contracts/20260907-2055-brc15a-real-shadow-canary.contract.md`
- Review file: `tasks/reviews/20260907-2055-brc15a-real-shadow-canary.review.md`
- Implementation notes file: `tasks/notes/20260907-2055-brc15a-real-shadow-canary.notes.md`
- Template: `.claude/templates/contract.template.md`
- Verification command: `repo-harness run verify-contract --contract tasks/contracts/20260907-2055-brc15a-real-shadow-canary.contract.md --strict`
- Active plan rule: this captured plan is written to `.ai/harness/active-plan` and the owning worktree is written to `.ai/harness/active-worktree` unless --no-active is used. Do not infer active execution from the latest non-archived plan.

## Handoff

- Checks file: `.ai/harness/checks/latest.json`
- Session handoff: `.ai/harness/handoff/current.md`

## Promotion Gate

- **Merge/PR unit**: Captured plan `plans/plan-20260907-2055-brc15a-real-shadow-canary.md` is the proposed mergeable execution unit; revise before execute if this is only a checklist step.
- **Rollback surface**: Before execution remove `plans/plan-20260907-2055-brc15a-real-shadow-canary.md`; after execution revert branch `codex/brc15a-real-shadow-canary` or the explicitly reviewed diff.
- **Verification boundary**: Real provider observation and explicit bounded external mutation grant
- **Review/acceptance boundary**: `tasks/reviews/20260907-2055-brc15a-real-shadow-canary.review.md` must record pass against the captured acceptance criteria.
- **High-risk surface**: Risks named in captured planning output; keep the plan Draft if risk ownership is not concrete.
- **Why not checklist row**: verification_boundary

## Evidence Contract

- **State/progress path**: `plans/plan-20260907-2055-brc15a-real-shadow-canary.md` task breakdown, `tasks/todos.md` deferred-goal ledger, `tasks/contracts/20260907-2055-brc15a-real-shadow-canary.contract.md`, `tasks/reviews/20260907-2055-brc15a-real-shadow-canary.review.md`, and `tasks/notes/20260907-2055-brc15a-real-shadow-canary.notes.md`
- **Verification evidence**: `.ai/harness/checks/latest.json`, `.ai/harness/runs/`, and the commands named in the captured planning output
- **Evaluator rubric**: `tasks/reviews/20260907-2055-brc15a-real-shadow-canary.review.md` must record a passing Waza /check style recommendation
- **Stop condition**: all task breakdown items are complete, sprint verification passes, and the review recommends pass
- **Rollback surface**: Before execution remove `plans/plan-20260907-2055-brc15a-real-shadow-canary.md`; after execution revert branch `codex/brc15a-real-shadow-canary` or the explicitly reviewed diff.

## Captured Planning Output

## Goal and success criteria

Execute Sprint BRC15a's real GPT shadow observation through the existing budgeted product path. Record actual authoring, missing-slot follow-up, independent GitHub observation, adoption dry-run and the user's subsequent investment decision. No quality threshold or synthetic fixture count can substitute for these observations. BRC6a, BRC14 and BRC15 remain distinct acceptance boundaries.

## Proposed concrete operator grant

- Target: new private `Ancienttwo/repo-harness-brc15a-canary-20260907`; never reuse `repo-harness-page` or another existing repository.
- Local target: `/Users/ancienttwo/Projects/repo-harness-brc15a-canary-20260907`, created from tracked commit `33c5012e1185a695fdaf54a7bb84fc613cfb653b`, excluding all main working-tree changes. Create a fresh Git history so the canary setup push cannot publish historical refs. Retain source/capability files; omit workflow automation from the disposable target.
- Account: existing Chrome `Profile 13`, copied by Oracle for each invocation. Its live composer and connected GitHub plugin actions were inspected. Keep the production repo binding unchanged.
- Mode: `shadow`; external sources `manual` and GitHub enabled only for the dedicated canary repository.
- One group, at most ten slots, allowed kinds `bugfix` and `test_gap`, no local worker or acquisition.
- At most two authoring rounds in total: initial plus one fill_missing or one explicitly identified edit_issue. An edit consumes the remaining round; do not then perform a third fill.
- At most 64 provider invocations and 16 controller steps; at most 45 minutes from grant issuance. Unknown results stop for reconciliation and are not retried as a fresh invocation. Maximum provider failures and consecutive no-progress steps are both 2. Token/cost limits remain null because current provider usage cannot enforce them.
- Grant identity: campaign `brc15a-20260907-shadow`, authorization `brc15a-20260907-shadow-grant`, issuer `Ancienttwo`, contract scope `contract_less` for authoring/observation only; allowed work package is that campaign id, allowed risk is `low`, merge mode `manual`, merge method `squash`. These merge fields grant no execution path in shadow mode. Remaining schema bounds: agent turns 10, runner invocations 10, successful acquisitions 1, repair cycles 2, parallel tasks 1; those active operations remain unreachable. Transient retry: at most 2 consecutive failures, initial backoff 5000 ms, maximum backoff 30000 ms, with unknown-result reconciliation still mandatory. Issuance is the actual approved mint time; expiry is exactly 45 minutes later.
- Only repository setup and GPT-created Issue bodies are external mutations in this package. No Task materialization, Claim, worker, code repair, PR, merge, Issue close, production release or automatic deletion of the canary repository.

## P1/P2/P3 and constraints

The product authority is ProgramAuthorizationV1 minted through `repo-harness automation grant mint`, then the existing campaign/budget stores. The proposal is not a minted grant. The operator must approve these concrete repository/account/limit values before external setup and minting.

The current authoring effect validates the repository's saved profile binding against the grant, persists IssueBatchIntent before Oracle, scans the prompt with gitleaks, and reserves the provider invocation. Adoption in shadow dry-run uses budgeted GitHub identity/page reads and immutable observation outcomes. Use that path directly; do not create Issues with gh or call an unbudgeted observation runner. Native CDP was used only for non-model login/tool inspection, not as an alternate authoring provider.

After seed files and canary-only policy are committed, obtain the actual registered repository identity and target commit. Seal the grant against those exact values and record its digest. The initial work-graph revision comes from the empty canary WorkGraph, not a guessed digest. GitHub selection must admit the dedicated fresh repository's issue numbers 1 through 20, without requiring GPT to set labels or assignees that its prompt forbids. Bound pages to 2, issues to 20, per-body bytes to 8192, total bytes to 163840 and each GitHub observation deadline to 30000 ms.

Rollback stops the campaign and preserves the journal, reservations and remote Issues for inspection; do not erase unknown effects. At 10x demand, the same group/round/call/deadline bounds refuse further work. The fragile assumption is that the installed GitHub actions can actually access the newly created repository; a permission failure is a canary finding and stops, not permission to switch accounts or create Issues locally.

## Execution sequence

1. Create the isolated local seed and private repository; commit only the target's initialization/policy files. Verify origin, default branch, exact head, empty Issue inventory and remote identity. Bind only this local target to Profile 13 using `chatgpt browser-setup`.
2. Generate and validate the full ProgramAuthorizationV1 from the approved limits and actual repository/target/work-graph identity. Mint via the operator CLI. Create the campaign with a stable idempotency key and prepare group 1 via the current store/CLI transition. Save exact identities before any browser call.
3. Run `campaign author` for group 1 with `/opt/homebrew/bin/gitleaks`. Capture the immutable intent, browser/session/model-verification metadata and provider reservation/outcome. Do not change the product prompt to manufacture better findings or exact-revision evidence.
4. Run `campaign adopt --dry-run` against the canary Sprint and publication policy. Consume the existing immutable observation/outcome for complete, partial, ambiguous or failed state. Record every observed slot, duplicate, unexpected Issue and invalid metadata item with its denominator.
5. Only if the first result identifies missing slots or a permitted repair and the ledger allows the second round, use `campaign author-followup` with the exact existing session and requested slots/Issue identity. Verify whether previously valid slots changed. Repeat adoption dry-run within the same grant. An unknown reservation or expired budget stops further calls.
6. Record wall time, actual invocation and authoring-round counts, valid/duplicate/missing/unjudged Issues, any human intervention and source drift. State exact-SHA unverified regardless of content challenge success. Verify no Task, Claim, worktree acquisition, PR or Issue-close event was produced.
7. Present the actual result to the user for the required investment decision. Only after recording that decision and passing the evidence review may BRC15a be marked done through the Sprint tool. Never auto-complete BRC6a/BRC14/BRC15.

## Validation and delivery

Validate the seed's policy, grant, campaign definition and exact remote binding before execution. Use the existing frozen campaign budget/adoption test evidence as baseline; do not rerun the full repository suite merely to execute this observation. The decisive new evidence is the real canary and complete admitted ledger, not more fixture tests. Commit a redacted human report and the contract's durable acceptance references to repo-harness through its isolated workflow. Do not commit copied profiles, raw credentials or unrelated conversation history.

Real provider latency may consume the entire 45-minute grant. There is no automatic second grant or retry campaign. A negative observation is valid evidence; completion additionally requires the user's recorded investment decision.

## Annotations
<!-- [NOTE]: prefixed inline. Claude processes all and revises. -->

## Task Breakdown
- [ ] Execute captured plan: BRC15a real GPT shadow canary
