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
