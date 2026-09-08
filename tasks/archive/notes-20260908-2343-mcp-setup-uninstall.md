> **Archived**: 2026-09-08 23:43
> **Related Plan**: plans/archive/plan-20260908-2325-mcp-setup-uninstall.md
> **Outcome**: Completed
> **Lifecycle**: notes
> **Parent Run ID**: run-20260908-2343
> **Archive Projection V1**: `plans/plan-20260908-2325-mcp-setup-uninstall.md` => `plans/archive/plan-20260908-2325-mcp-setup-uninstall.md`
> **Archive Projection V1**: `tasks/notes/20260908-2325-mcp-setup-uninstall.notes.md` => `tasks/archive/notes-20260908-2343-mcp-setup-uninstall.md`
> **Archive Projection V1**: `tasks/contracts/20260908-2325-mcp-setup-uninstall.contract.md` => `tasks/archive/contract-20260908-2343-mcp-setup-uninstall.md`
> **Archive Projection V1**: `tasks/reviews/20260908-2325-mcp-setup-uninstall.review.md` => `tasks/archive/review-20260908-2343-mcp-setup-uninstall.md`

# Implementation Notes: mcp-setup-uninstall

> **Status**: Active
> **Plan**: plans/archive/plan-20260908-2325-mcp-setup-uninstall.md
> **Contract**: tasks/archive/contract-20260908-2343-mcp-setup-uninstall.md
> **Review**: tasks/archive/review-20260908-2343-mcp-setup-uninstall.md
> **Last Updated**: 2026-09-08 23:26
> **Lifecycle**: notes

## Decisions
- HTTP startup caches credentials and shutdown flushes OAuth grants. Offline teardown requires explicit services-stopped; no runtime or remote revocation claim.
- Shared registry source is overwritten by setup and manual grants serve other consumers. Preserve preimages under the existing registry mutation lock; restore only exact owned rows. Unproven or modified rows remain unresolved. New explicit setup after user edits captures the user's current state.
- MCP setup/uninstall share a storage-root lock, then take the existing registry lock. Codex uses the existing project-root runtime lock and bounded TOML receipt. No new dependency; setup-ownership serves both writers/readers, uninstall owns scoped plan/apply.
- Full suite omitted: focused setup/registry and configuration tests plus typecheck and six required checks cover changed behavior; HTTP runtime is untouched.

## Verification coverage
- Development baseline: 67 MCP setup/registry/uninstall tests plus 22 existing configuration/uninstall tests passed. Two later ownership epoch/missing-receipt tests also passed (14 focused uninstall tests total).
- Installed CLI smoke built npm tarball and installed into a fresh directory/HOME, exercised help, both setup commands, JSON dryrun/apply and repeated apply, and verified credential/config absence. Result: /tmp/mcp-uninstall-smoke-result.json. Rebuild after final source freeze if code changes.
- New production files: `mcp/setup-ownership.ts` shares receipt and locking between setup and teardown; `mcp/uninstall.ts` owns offline bounded cleanup. New regression file covers real destructive/preservation behavior. No dependencies added.

> **Substantive Change SHA256**: `sha256:92004d8bad8d6cc4f35c5222a58f7483604123a7d067a1b50b6c9620e39d0b16`

- Final source tarball rebuild and fresh installed CLI smoke passed. Independent composition and registry safety reviews PASS. Contract verification ran 14 requirements with zero failures; evidence binding requires the contract to be committed before final receipt.

- Default review target remains origin/main, so selection also includes the already locally accepted user-config-uninstall slice at 46405ed9. Bind its two owned configuration surfaces to the existing ownership check; current reviewers covered the main-relative MCP delta, and existing configuration regression tests cover the shared helper delta. No new executable checks or repeat broad review required.
