# Task diff merge decisions

Configured external filters are refused instead of silently disabling transformations; fsmonitor is disabled for every new-reader Git invocation. This preserves explicit comparison semantics.

Root Cause Evidence:
- root_cause: `task-diff.ts` disabled external diff/textconv but native Git still invokes clean/process filters and fsmonitor.
- repro: real Git configured filter writes `filter-ran` during the GET read.
- regression_guard: `tests/effects/operator-task-diff.test.ts`, configured clean/process case.
- pre_fix_failure_artifact: `/tmp/operator-diff-filters-prefix.log`, PRE_FIX_EXIT=1; returned untracked paths included `filter-ran`.

Git-emitted paths are canonicalized before comparing with Node realpaths. The focused real-Git effect test is added to the existing Windows/macOS/Linux matrix, retaining all ownership checks.

> **Substantive Change SHA256**: `sha256:2983d8e71f8d7bc3f680965b3ef5df88eccd62050a5a6f257d18bbc6a115a0f4`

The first prepare-acceptance run lacked the isolated worktree's CodeGraph index. The existing required CodeGraph setup initialized/synced that index; deterministic projection then retained the same model and flow-proof digests and updated only generated provenance. The proof-only refresh signal is reconciled through the official command, not accepted as a semantic architecture change. The first official plugin invocation was rejected as stale_scope while generated provenance changed; it is not acceptance evidence. Final review runs only after the corrected subject and workflow authority are committed.

Root Cause Evidence (Git observation cascade):
- root_cause: diff lazily fetched missing promisor blobs and omitted assume-unchanged tracked entries.
- repro: real Git missing blob invoked configured upload-pack marker; assume-unchanged edit returned an empty patch.
- regression_guard: effect tests cover both states and the production worker missing a canonical sprint blob; worker environment disables lazy fetch for inherited authority readers too.
- pre_fix_failure_artifact: `/tmp/operator-diff-cascade-prefix.log`, PRE_FIX_EXIT=1 for both reported cases; `/tmp/operator-diff-cascade-all.log` passes 12 real Git tests with 47 assertions.

CI fixtures isolate system/global Git config. The hosted runners configure Git LFS globally; the intentional filter refusal was reached before unrelated test assertions. Product behavior still refuses configured external transformations, including unused commands. No host/global configuration was changed.

> **Substantive Change SHA256**: `sha256:1a50bcbd36ca009d89c8bb22a566c200cc3982c40b043f3b4c94cfa19eefa51d`

PR comparison against origin/main:
> **Substantive Change SHA256**: `sha256:4a531f8ce0dcaff1090938e6c1772e18db0bd022cab6f5ed05c3ed3f5e1f25e4`

Windows CI exposed pre-existing directory-fsync EPERM in the lease writer used during fixture setup, before any diff read. Reader fixtures now seed canonical serialized lease bytes using the existing path functions on every platform; no write-durability implementation or expectation is changed.

> **Substantive Change SHA256**: `sha256:79db7293745bb780d6c22796e9422e92d748b7006b642503fca911f77356315f`

Final PR comparison against origin/main:
> **Substantive Change SHA256**: `sha256:ac9b456e5de8653da7be32b11d42cd8b8c9fd738d80293b8c4a1d40d5f2aacb4`

Semantic acceptance remains blocked: `/tmp/operator-diff-plugin-review.json` is stale_scope and `/tmp/operator-diff-plugin-final.json` is review_budget_exhausted. The existing one-attempt circuit policy was preserved. All 11 declared verification commands passed at run-20260910T231010-87128. An explicit owner waiver is still required; merge authorization is not a waiver.

Owner explicitly approved the typed user waiver and continuation. A temporary Windows fixture diagnostic records the exact binding values before the unavailable read; it must be removed after proving the refusal point and before final acceptance.

> **Substantive Change SHA256**: `sha256:cfa91fb2c3556a7e9b8445e87ca81bf7a2697956e984b7f875312e81b99fe757`

Integrated origin/main a8b56203 (PR #396) before final acceptance; App/i18n merged cleanly and the generated projection is regenerated from the new base.
> **Substantive Change SHA256**: `sha256:47a8ecda15a04c08ebe66ec39ac87385896a1a8dcf81364bf20cdb84ebd3e758`
