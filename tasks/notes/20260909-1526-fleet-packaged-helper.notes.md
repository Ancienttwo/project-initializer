# Runtime ownership

The existing runner and protected platform utility now live in effects/runtime. CLI and fleet call that single implementation; the former CLI paths have no re-export shim. Both source and packaged acceptance helper imports point at the relocated platform utility. Plan projection runs in the already-linked worktree, where its existing topology check prevents nested provision.

The real canary provision failure was compensated and reconciled as observed no-progress; no successful acquisition or worker execution was claimed.

Architecture path relocation uses standing Owner approval to continue BRC14/15, recorded as owner-brc1415-continuation-20260909. It updates the existing contract-assets capability source path and deterministic projections; no capability or privilege is added.

> **Substantive Change SHA256**: `sha256:8aeff0f503d342f89b09a8df80221fa12a5f84591a375242c8bcb6a4fe94dd7f`
