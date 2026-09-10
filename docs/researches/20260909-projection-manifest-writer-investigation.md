# Projection manifest writer investigation

Status: Journaled writer identified; the alleged stale request identity is contradicted by the checkout timeline. A stale-content overwrite has not been established.

## Scope and decision

Investigate the reported change of `docs/architecture/.projection-manifest.json` from generation stamp `e2d876ce` to `bc2328db`, before changing retry or write guards. Source locations below refer to repo-harness `d48d2eeee8e71e7014a6bee6dc36c7ae9fab1d72` and arch-context `bcafdfa5e54e8a8db30b947d9a7e46e0313a87a2` (merged through Ancienttwo/arch-context#150 as `a2c34ca5326b506452fbcee49b2e745bddb642e5`).

No production fix follows from an old generation stamp alone. Keep local HEAD, remote-tracking refs, generation provenance, and input identity separate. Do not remove sticky provenance or change retries to capture `origin/main`.

## P1 — ownership and identity

- repo-harness `drainArchitectureProjectionJobs` in `src/effects/architecture/projection-orchestrator.ts` canonicalizes the supplied checkout root, claims a job, and calls `captureArchitectureProjectionSnapshot(root)` for each attempt (lines 67, 101–113).
- `captureProjectionSnapshotObservation` in `src/effects/architecture/archctx-provider.ts` runs `git rev-parse HEAD` with that root as cwd (lines 400–404). A newer `origin/main` is not the checkout's input identity.
- arch-context renders generation provenance in `packages/core/projection-engine/src/index.ts`; `stickyArchitectureDocumentationProjectionProvenance` retains a validated prior provenance when its semantic fingerprint matches. `baseHeadSha` and full worktree identity are intentionally absent from the sticky comparison (lines 655–695).
- arch-context writes declared files through `ChangeSetEngine.applyFileOperation` in `packages/core/changeset-engine/src/index.ts` (lines 335–378). Per-file expectedHash validation occurs before an awaited journal operation and the backup/write sequence.

## P2 — observed checkout timeline

All times below are UTC on 2026-09-09. Both `HEAD` and `main` reflogs were inspected, so this is not inferred from commit creation times.

| Time | Local HEAD | Observation |
|---|---|---|
| 04:41:38 | bc2328db | Local amend completed |
| 04:48:18 | bc2328db | Fetch advanced origin/main to 22303134; local HEAD did not advance |
| 09:31:19.504 | bc2328db | job-ca58d5a7da32ca18d1e23f15, attempt 2: noop; input headSha/baseHeadSha bc2328db; files=[] |
| 09:37:22.298 | bc2328db | job-387fd0b4ef8440be1f20794f: noop; same input identity; files=[] |
| 10:43:52 | 3a30bd89 | Local pull finally fast-forwarded |
| 11:08:30.707 | 3a30bd89 | job-ba2bec8acd739f635b3ac3c1: noop; input headSha/baseHeadSha 3a30bd89; files=[] |

The two bc2328db receipts used the actual local HEAD. The earlier handoff's assertion that this checkout was already far beyond that revision is false for these completion times. The current evidence does not support a retry reusing an obsolete expected.headSha.

`git show bc2328db:docs/architecture/.projection-manifest.json` contains provenance.baseHeadSha `e2d876ce7c8167af9db000eacfa2fa83c395d177`. That commit was created earlier, but `git merge-base --is-ancestor e2d876ce bc2328db` exits 1. Do not substitute wall-clock ordering for ancestry or semantic freshness across branch/squash history.

Reproduction of the historical observations:

```sh
git reflog show HEAD --date=iso --since='2026-09-09 12:00:00 +0800'
git reflog show main --date=iso --since='2026-09-09 12:00:00 +0800'
git reflog show refs/remotes/origin/main --date=iso --since='2026-09-09 12:00:00 +0800'
git show bc2328db:docs/architecture/.projection-manifest.json
git merge-base --is-ancestor e2d876ce bc2328db
```

Local receipt sources are `.ai/harness/architecture-projection/receipts/<jobId>.json`. Their result receipt digests, in table order, are:

- `sha256:0c59bcf3953ab6ba6ef9ee8a3e6ff499672a34516c301c50147be1d0458c9daf`
- `sha256:f882c175309b6b39885bf49484129314f1f3532392dbdc01b91dff792d2518b7`
- `sha256:7e08802003544bfb79b43b5decf4526aa3ae3822dc9bcbc7a0154448de65b5ea`

The local handoff `manifest-writer-timeline-20260909.json` preserves selected receipt bodies and reflog text. Reflogs/runtime caches are local and may expire; this document records the observed facts rather than making their continued existence a repository gate.

## Journal attribution

`runtimeStatePaths(root)` in arch-context `packages/local-runtime/local-store-sqlite/src/index.ts:1009` resolves storage from the canonical git common directory and checkout root. A read-only SQLite connection to this checkout's resolved store found three committed manifest writes on 2026-09-09:

| Created / committed (UTC) | Journal | Request | Draft base HEAD |
|---|---|---|---|
| 09:29:58.268 / 09:29:58.858 | changeset_60b19e29-cba4-47bd-8609-875a9d10137e | repo-harness.projection.job-ca58d5a7da32ca18d1e23f15 | bc2328db |
| 10:47:01.819 / 10:47:02.451 | changeset_5fffb2a8-b351-44d5-b6b3-acafb4255d33 | repo-harness.projection.job-2826cb8081c0ee2e5ec8688c | 3a30bd89 |
| 11:54:35.972 / 11:54:36.518 | changeset_ae4dfd46-9836-486c-9475-28404690d27a | repo-harness.projection.job-f46b203da231f37502b10379 | d48d2eee |

All three `files_json` records name `docs/architecture/.projection-manifest.json`, `operation: render_projection`, `existed: true`. The first ChangeSet is `changeset.docs-projection-ee5cffd24c0be372`. This attributes an actual committed write to job-ca58d5a7 at 09:29, before that same job's 09:31 noop retry receipt. Each draft base HEAD agrees with the local reflog at its write time.

Query boundary (the DB path must come from `runtimeStatePaths`, not a guessed legacy `.archcontext/.local` location):

```sql
SELECT journal_id, changeset_id, status, created_at, completed_at,
       metadata_json, files_json
FROM changeset_journal
WHERE root = :checkout_root
  AND created_at >= '2026-09-09T00:00:00'
  AND created_at < '2026-09-10T00:00:00'
ORDER BY created_at;
```

The writer chain is CLI projection files (including `plan.manifest`, `packages/surfaces/cli/src/main.ts:1239`) → `planUpdate`/`applyUpdate` → daemon `applyUpdate` (`packages/local-runtime/runtime-daemon/src/index.ts:2844`) → engine `applyFileOperation`. Both docs and protocol clean/noop branches return before plan/apply (CLI lines 1117–1129 and 1529–1554). Production source scanning found no alternate direct manifest writer in arch-context. These paths and journal metadata serialization are unchanged between tag v0.5.8 and the inspected fix revision; the only delta in those owning files is #150's generated-rebuild guard.

The daemon's `withWriter` boolean serializes one instance (`runtime-daemon/src/index.ts:5602`); RPC startup additionally acquires the canonical workspace lock via exclusive `openSync(..., "wx")` (lines 6207 and 8367). Direct engine callers and external file writers do not automatically participate in that RPC lock.

Attribution limits: `changeSetMetadata` (`local-store-sqlite/src/index.ts:7514`) deliberately projects operation metadata without `projectionFiles` bodies or per-file expectedHash. `files_json` records paths and backup/temp names, not before/after bytes. No projection_apply_receipts rows were returned for these journals. Thus this proves the job's physical write and current checkout identity, not byte-for-byte reconstruction of the originally reported, subsequently restored manifest or the absence of external writers. Selected journal evidence is preserved in the local `manifest-writer-journal-proof-20260909.json` handoff.

## Controlled probes and limits

The parent reran three isolated probes against the fixed source revision above:

1. Render with unchanged sticky inputs and prior HEAD aaaa…, current HEAD bbbb…. Output preserves prior HEAD/worktreeDigest. This proves an old stamp can be legitimate, not that this explains the historical write.
2. Plan A and B against one old file; apply B; apply A. A throws `Expected hash mismatch`, B-new remains, and `aDidOverwriteB=false`. This covers a late apply whose hash check occurs after B, using a minimal modelStore stub, not the entire production daemon.
3. Pause A inside its journal callback after the hash check; let a separate engine instance apply B; resume A. `bApplied=true` and `aOverwroteB=true`. This proves a direct-engine TOCTOU without common serialization, not production reachability.

All probe commands exited 0; the third intentionally demonstrates a bad outcome. These exploratory scripts are not committed regression tests. Full scripts and outputs are embedded in the local GPT handoff `manifest-writer-gpt-research-20260909.md`.

## P3 — constraints and remaining attribution

The standard daemon has instance and canonical workspace serialization; assigning the direct-engine race to this incident would require a reachable bypassing writer. Increasing concurrent callers increases pressure on that boundary; a second hash read alone is not proof of atomicity against external writers.

Receipt status noop/files=[] alone is not independent filesystem evidence. Here the journal identifies the earlier apply, and source tracing shows that the subsequent clean/noop path does not write the manifest. The obsolete-request-head explanation is rejected for the observed journals/receipts. Do not ship a speculative retry/provenance fix. If a reverse-content write recurs, capture both manifest byte hashes and full semantic provenance with the existing journal/request identity before restoring the file; that bounded evidence is necessary to test a distinct stale-content claim.

Adjacent changes remain separate: arch-context#150 removes the generic generated-file rebuild from explicit projection-only ChangeSets; repo-harness#379 separates CI jobs. Neither is evidence that the original manifest incident or provider lease/write boundary was fixed. No package release or global install is part of this investigation.
