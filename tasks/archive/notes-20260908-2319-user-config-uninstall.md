> **Archived**: 2026-09-08 23:19
> **Related Plan**: plans/archive/plan-20260908-2246-user-config-uninstall.md
> **Outcome**: Completed
> **Lifecycle**: notes
> **Parent Run ID**: run-20260908-2319
> **Archive Projection V1**: `plans/plan-20260908-2246-user-config-uninstall.md` => `plans/archive/plan-20260908-2246-user-config-uninstall.md`
> **Archive Projection V1**: `tasks/notes/20260908-2246-user-config-uninstall.notes.md` => `tasks/archive/notes-20260908-2319-user-config-uninstall.md`
> **Archive Projection V1**: `tasks/contracts/20260908-2246-user-config-uninstall.contract.md` => `tasks/archive/contract-20260908-2319-user-config-uninstall.md`
> **Archive Projection V1**: `tasks/reviews/20260908-2246-user-config-uninstall.review.md` => `tasks/archive/review-20260908-2319-user-config-uninstall.md`

# User configuration uninstall decisions

- Reuse `install-state.json` ownership_manifest for files, links and trees. Configuration fragment receipts carry original/installed values only; cleanup gives them precedence over the old CodeGraph projection to avoid double deletion.
- Restoration history is retained as static provenance. Deleting it made a repeated uninstall unable to distinguish restored user configuration from old unproven installation output. It has mode 0600 and contains only touched configuration fragments, not whole host files.
- Codex opaque hooks.state cannot be assigned to a command from observed repository evidence. Report unresolved/nonzero rather than synthesize ownership. User edits and unsupported TOML spelling are also preserved.
- Default cleanup covers user-level installer projections. Package manager removal, official plugin lifecycle, independent MCP service setup/workspaces and repository unadoption remain separate. No real HOME mutation occurred in development.
- No dependencies added. runtime-host-lock.ts moves the existing lock unchanged so both CLI entrypoints share it; configuration-ownership.ts isolates shared restoration provenance used by Codex, CodeGraph and runtime transactions; uninstall.ts owns read-only planning and guarded application across both hosts.

- Review corrections: receipts now distinguish active installation ownership from inactive restoration history. A red regression demonstrated old-history deletion of a user same-value setting; the fixed epoch test passes. Standalone CodeGraph setup now shares the host lock and persists selector-only pending preimages before writing. Explicit `--recover-interrupted` restores only those selectors; a SIGKILL regression covers refusal, preview and recovery. Two native reviewers passed this same review boundary after delta readback.
- Validation is confined to temporary HOME fixtures. The existing integration group passed 81 tests; the final subject uses the named contract verification group and type/integrity checks. The installed tarball smoke is repeated for the frozen implementation.

> **Substantive Change SHA256**: `sha256:dcc20287b4fa2305c72480e658b7c8fea4b800171f6a90379d62a8a4ad430a44`

- Frozen implementation verification: run-20260908T231405-51674 passed all 9 executable checks (123 tests + typecheck + six integrity commands). Initial assessment lacked oracle declarations; bound existing installer tests to the two selected modules without changing executable coverage. Final packed CLI smoke passed both-host install, dry-run, uninstall and repeat uninstall; archive shasum 7c1227b0bdb6207af91c7628ef49849ba6eed0c6.
