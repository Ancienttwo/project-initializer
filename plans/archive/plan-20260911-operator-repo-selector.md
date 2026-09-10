# Plan: Repository-scoped operator board

> **Status**: Done
> **Artifact Level**: work-package
> **Promotion Reason**: verification_boundary

## Scope / P1 / P2 / P3

Owner requests a top-bar repo switcher and no mixed-repository task queue. Isolated branch codex/operator-repo-selector from 8fc92c08. Standard workflow; this plan is the execution artifact.

P1: App.tsx owns worklist filters, selected task, composer and collaboration reads. Core operator snapshot redacts repo_root; browser decoder owns closed transport validation. Fleet authority remains unchanged.

P2: Fleet snapshot -> redacted operator response -> decoder -> selected repo -> worklist/counts/overview -> task details. Existing App consumes all repositories at once; no repo selection exists. Add server-projected display_name from canonical repo_root basename, never expose full paths. Keep repo ID as selection/request identity, with ID disambiguation for duplicate names.

P3: Operator transport moves atomically to protocol 5 for required display_name, with no old-payload fallback. Top bar retains explicitly labeled fleet health; scope only rendering, not authority or write gates. Default first repo; persist explicit/default selection in browser storage. If selected repo disappears, show a choose-repository state instead of silently switching. Switch clears task/draft/collaboration and resets worklist filters; refreshing preserves a surviving selection. No all-repository task mode, new scheduler, registry mutations or fixes to other repositories. At 10x repos the native selector grows; avoid adding search infrastructure without need.

## Task Breakdown

- [x] Add transport name and repo selection with scoped presentation.
- [x] Test switching, persistence, refresh/removal, duplicate names, stale detail/collaboration isolation and transport rejection.
- [x] Build and inspect desktop/mobile browser UI; run required integrity checks and record delivery.

## Verification

Focused operator-web interaction/SSR/types, operator fleet projection and serve tests; check:type; build:operator-web; browser smoke using built assets and controlled fixtures. Required hook/helper, deployment SQL, architecture, task-sync, strict workflow, project inspection and init dry-run checks. No full suite: changed boundary is the operator projection/UI; named tests cover it.

## Promotion Gate

- **Merge/PR unit**: Per-repository operator UI plus atomic name transport.
- **Rollback surface**: Revert UI/protocol change together.
- **Verification boundary**: Projection/decoder tests, interaction tests and actual browser rendering.
- **Review/acceptance boundary**: Frozen scoped diff and recorded focused checks.
- **High-risk surface**: Selection must never retarget a message or relax fleet write gates.
- **Why not checklist row**: Independent UI behavior and transport compatibility boundary.

## Evidence Contract

- **State/progress path**: This plan's Task Breakdown.
- **Verification evidence**: Commands above and acceptance notes below.
- **Evaluator rubric**: Single-repo tasks/counts/details, clear human names, preserved authority and no cross-repo stale state.
- **Stop condition**: Focused/integrity checks pass and browser interaction matches the request.
- **Rollback surface**: Revert the scoped UI and transport commit together; no live repository state changes.

> **Substantive Change SHA256**: `sha256:b7ffabf3f57f0cb3cd80323ee6b44a6551aaf12f2cc9d5172c6b0a934b787497`

## Acceptance Notes

- Operator-web interaction/SSR/task-diff/collaboration, payload decoder and projection tests: 215 pass. Operator serve CLI tests: 28 pass. Typecheck passes. Adjusted pre-existing cross-repo tests to explicitly switch repos and assert scoped counts; retained composer/late-response guards.
- Required integrity checks pass, including final diff-bound task-sync and strict workflow. No full suite for the scoped reasons above. Parent read the final UI/transport diff against unchanged write gates, task identity and snapshot provenance.
- Final build: build:operator-web passes, JS index-B8ckyb8w.js and CSS index-BpvUpmy-.css.
- Actual Chrome preview on port 4319: 10 named repos. repo-harness selection displays only its 17 tasks; BYOK canary selection displays only its 18 tasks. Desktop screenshot and 390x844 responsive screenshot show a usable top-bar selector without horizontal overflow. Temporary viewport reset afterward. Preview retained for user inspection; original port 4318 untouched.
- Protocol 5 is an atomic browser/server boundary; source Fleet protocol remains unchanged. Full paths remain redacted. Durable semantics recorded in docs/researches/operator-repository-selection.md.
- No registry writes, task messages, campaign execution, global install or release performed. Existing two repo_board_unavailable observations remain outside this slice.
