> **Status**: Executing
> **Created**: 20260910-1742
> **Slug**: retention-release-0-19-0
> **Planning Source**: codex-plan
> **Orchestration Kind**: host-plan
> **Artifact Level**: work-package
> **Promotion Reason**: merge_boundary
> **Verification Boundary**: Explicit release gate, required CI, registry and installed hook proof
> **Rollback Surface**: Scoped source revert and explicit runtime package selection
> **Workflow Profile**: strict
> **Execution Mode**: worktree
> **Substantive Change SHA256**: `sha256:3497b5579c19694af3c161fcf8d946d18f1655462295f1700f5f595a338a5dd0`

# Release repo-harness 0.19.0 with bounded checkpoints

## Scope and decision
The user approved publishing the already reviewed composer and checkpoint changes and refreshing the Bun-global runtime. The registry and installed package are 0.18.0; 0.19.0 metadata was merged in PR #388 but remains unpublished. Keep 0.19.0 and supplement its existing release record. The archctx journal-read worktree remains a separate local deliverable.

P1: package.json and assets/skill-version.json own version 0.19.0; docs/CHANGELOG.md and deploy/release-checklists/260910-repo-harness-0.19.0.md describe it. The existing reviewed source delta owns checkpoint publication/collection and browser draft restoration. Global CLI and hook resolve into the Bun-global installed package.
P2: scoped patch -> reviewed commit/PR -> required CI -> merged immutable source -> npm tarball/tag -> registry readback -> Bun-global install -> CLI/hook and repeated-checkpoint proof.
P3: reuse source review and focused evidence from the archived implementation plan, preserving the exact code. Keep current checkpoint durable before collection; retain raw ledger/blob authority; preserve original draft fence. Execute the explicit full release gate once for the frozen source and use the same candidate tarball for publish/readback. Registry authentication currently returns E401; continue safe preparation while the user restores it. No manual installed-package patch or archctx publication.

## Scope paths
All 16 copied implementation/research/archive paths from the prior plan, docs/CHANGELOG.md, deploy/release-checklists/260910-repo-harness-0.19.0.md, this plan, and ignored build/runtime evidence. No version bump is needed.

## Task Breakdown
- [ ] Freeze owned implementation and release notes, preserving existing reviewed source.
- [ ] Run the explicit release gate and record scoped/root/package evidence.
- [ ] Commit and open the scoped release PR; merge after required CI passes.
- [ ] Publish 0.19.0, verify registry/tag/tarball, and install the same release in Bun-global.
- [ ] Verify installed CLI/hook and checkpoint cleanup; record publication and archive this plan.

## Promotion Gate
- Merge/PR unit: reviewed composer/checkpoint fixes plus the 0.19.0 release supplement.
- Rollback surface: revert the scoped source commit; select a prior registry package if runtime rollback is needed. Published versions are immutable.
- Verification boundary: full check:release, required remote CI, and registry/installed runtime readback.
- Review/acceptance boundary: reuse completed source review; compare the supplemental release diff and consume exact CI/package evidence.
- High-risk surface: deleting duplicate recovery caches requires tested ownership/durability rules; old global hooks lack those rules until install.
- Why not checklist row: the implementation plan is archived and this approval adds an independent public release/runtime boundary. The release-filing path raises the final resolver to strict; use the canonical contract and acceptance flow in this isolated worktree.

## Evidence Contract
- State/progress path: this plan and the existing release filing.
- Verification evidence: exact candidate SHA, diff digest, release log, CI run IDs, package integrity and installed runtime receipt.
- Evaluator rubric: existing composer/storage invariants pass; released bytes contain the fixes and the selected global CLI/hook execute them.
- Stop condition: all authorized delivery steps complete, or an external auth/CI blocker is reported with completed preparation.
- Rollback surface: scoped source revert and explicit runtime package selection.

## Verification
The full release gate is mandatory in scripts/check-npm-release.sh and runs both governance and functional lanes plus tarball installation. Expected 10-20 minutes. Earlier focused tests/review remain baseline evidence only for their original source; they do not claim full-suite coverage. Execute through verify-sprint --prepare-acceptance with an explicit expensive Verification Plan criterion; root integrity checks are included in the release gate. Publication then uses check:release-published and a bounded installed-store publication/reader smoke. Full skill-effectiveness evaluation is unavailable and is not claimed.
