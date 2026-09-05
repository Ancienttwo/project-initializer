> **Archived**: 2026-09-06 04:41
> **Related Plan**: plans/archive/plan-20260906-0428-claude-startup-cancel.md
> **Outcome**: Completed
> **Lifecycle**: notes
> **Parent Run ID**: run-20260906-0441
> **Archive Projection V1**: `plans/plan-20260906-0428-claude-startup-cancel.md` => `plans/archive/plan-20260906-0428-claude-startup-cancel.md`
> **Archive Projection V1**: `tasks/notes/20260906-0428-claude-startup-cancel.notes.md` => `tasks/archive/notes-20260906-0441-claude-startup-cancel.md`
> **Archive Projection V1**: `tasks/contracts/20260906-0428-claude-startup-cancel.contract.md` => `tasks/archive/contract-20260906-0441-claude-startup-cancel.md`
> **Archive Projection V1**: `tasks/reviews/20260906-0428-claude-startup-cancel.review.md` => `tasks/archive/review-20260906-0441-claude-startup-cancel.md`

# Startup cancellation decisions

P1: CLI cancellation delegates to closeClaudeReview; the host owns spawn and publishes processes.json only afterward. P2: real non-executable provider spawn fails before that publication, then cancel dereferences the missing file. Pre-fix focused regression recorded ENOENT and PRE_FIX_EXIT=1 in the contract evidence artifact. P3: preserve the no-unowned-signals invariant with one bootstrap lock and explicit pre-spawn/no-child evidence; ambiguous post-spawn failure remains a named refusal, never a fabricated cleanup.

The caller records startup protocol participation before launching tmux. This matters for older or incomplete runtime state: absence of spawn intent alone does not prove a prior host used the lock. No automatic restart, state reset or admission reset is introduced. At 10x concurrent tasks the lock remains per task; a busy bootstrap returns bounded lock contention rather than signalling its host.

Sibling sweep: processes.json readers are runClaudeReviewRound, claudeReviewStatus, closeClaudeReview and host startup. The round already waits for publication; status catches and reports interruption; the host rejects duplicate metadata. Only cancel required a pre-publication terminal path.

> **Substantive Change SHA256**: `sha256:68eafbc99e57e7551f2a1916e72a3d0c12c149d018f93bade36721102fc44c43`

Final preparation run `run-20260906T043528-11104-20260906-0428-claude-startup-cancel` passed all 17 criteria (including real lifecycle tests and pre-fix evidence). Required deploy-SQL, architecture, task-sync, strict workflow, state inspection and init dry-run checks passed; init planned zero operations. Claude session `726e4e79-6aa9-4511-aaa8-4f7656a1d818`, PID 42162, accepted subject `sha256:44015071d71b899a6cf71592734c8d745a2e92518bc544971cc9ff834066352c` on target `ad4afe7765b62a66a58f6378f8d0efcd3c3006cf`; final verify-sprint consumed the exact receipt without rerunning checks. Three P3 observations are retained in the review projection; none changes ownership safety or acceptance. Rollback is to revert this bugfix publication, preserving the accepted base ad4afe77. No product changes follow acceptance.
