# repo-harness 0.19.1 Release Filing

- Date: 2026-09-11
- Package: `repo-harness@0.19.1`
- Base release: `v0.19.0`
- Release branch: `codex/release-0191`
- Pinned integration candidate: `03516106dc843b694241023097a85ab89ee30807` (PR #408; contains PR #401 merge `9563083c8fcbbdbf2b88a2d76b5dc5e0a1ac1142`). Publication requires main to contain equivalent product content after #408 merges.
- Candidate identity: final release PR head and prepared verification receipt.
- Publish status: **not published; preparation in progress**.
- Dependency authority: `archctx` and `archctx-contracts` remain exactly `0.5.10`.

## Release Content

repo-harness 0.19.1 makes architecture maintenance easier to enable across repositories and brings measured refactoring opportunities to the Agent for a user decision. Archctx and archctx-contracts remain pinned to 0.5.10.

### Added

- **Proactive refactor recommendations.** Normal Stop and `refactor recommendations --repo <root> --json` surface measured opportunities. The Agent explains evidence, inferred benefit and risk, then asks the user whether to proceed. Observation does not create plans, accept recommendations or enable execution.
- **One global architecture projection configuration.** Global install/update initializes shared projection preferences once. Repository init reports readiness; CLI, Stop and helper consumers read the same per-user authority.
- **Repository-scoped Operator boards and fenced worktree diffs.** The selected repository scopes the board, while task diffs remain read-only and bound to the requested worktree identity.
- **Bounded auto-campaign turns and explicit stale-registry pruning.** Campaign turns retain their approval, budget and evidence boundaries; registry pruning is an explicit operator action.
- **Evidence reclaim tooling.** Stop bounds only its own recomputable summaries, preserving verifier execution records. The reclaim path reports and removes only data owned by its retention policy.

### Fixed

- Installation upgrades respect recorded ownership, preserve user modifications, synchronize complete bundled skill trees and seed the Herdr pin.
- Campaign preparation may retry the identical admitted request only before any runtime effect, without renewing its deadline.
- Protected helper execution binds the main CLI and Hook CLI to the same trusted package for architecture readiness.
- Recommendation delivery keeps prior identities instead of repeating prompts after a 64-entry wraparound; capacity exhaustion pauses delivery explicitly.

### Upgrade notes

Run `repo-harness update` once to initialize the global architecture and recommendation settings. Projection execution settings now come from `~/.repo-harness/config.json`; repository-local execution keys no longer control projection. Explicit global disabled choices are preserved. Recommendations require an existing architecture model and complete code facts. Refactor execution still requires explicit user approval and the normal execution gates.

BRC native-host execution is not enabled by this release; its execution contract remains deferred.

## Verification

- Full `bun run check:release` is the required release criterion. Its exact candidate identity and result are recorded by the release contract verification receipt and projected into `tasks/reviews/20260911-0454-release-0191.review.md`. Only a passing result permits publication; this filing alone is not a pass claim. The command includes repository checks, functional tests and packed installation smoke.
- Retained package artifact, checksum and manifest are reported with the final candidate verification. They must be read back before publication.
- npm `repo-harness@0.19.1`: E404 observed before preparation; recheck before publication.
- Skill evaluation: unavailable for this release candidate. `full_test_count`, `dry_run_ratio`, `grader_pass_rate`, and `effectiveness_authority` are unavailable. Focused feature/CLI evidence is not a complete skill evaluation.

## Publication Boundary

Do not publish until the merged release source, full gate, exact package and release approval are ready. This preparation does not create npm versions, tags, GitHub releases or global installations.
