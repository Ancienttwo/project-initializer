# 0.19 installed runtime upgrade and Herdr policy repair

## Root cause evidence

- Observed behavior: fleet compares installed role bytes only with the candidate package; bundled cross-review compares only SKILL.md. A legitimate older package is refused as drift, while reference-only changes are silently skipped.
- Owning boundary: `scripts/install-agent-fleet.sh#compareAndWrite`, `src/cli/commands/init.ts#syncBundledItemsAtHome`; both omitted the existing protocol-2 installation ownership ledger. `installProfileHostMutationPaths` also omitted deep-worker.
- Reproduction: receipt-owned old role content fails upgrade with exit 1 on the original helper; original bundled sync leaves retired references present. New regression cases exercise both Claude and Codex, SKILL.md changes, reference-only changes, and subsequent user edits.
- Resolution: reuse `readInstalledProfile` and `managedInstallSurfaceIsCurrent`; update only recorded, unchanged files/trees. Compare entire skill trees and replace old trees through the existing compensating transaction. Include deep-worker in transaction capture and complete-fleet evidence. Unknown or edited content still fails closed; no force flag or ownership inference is added.

## Herdr configuration boundary

The shell policy seeds already declare the Herdr pin, but the active TypeScript adoption defaults omitted it. Standard adoption now projects the canonical `.ai/harness/policy.json#external_tooling.herdr` pin, guarded by the existing pin drift test. Repository-specific explicit values remain authoritative.

The tooling checker reports a missing/malformed floor as `configuration-error`, retaining the observed CLI version and failing strict readiness with a repository-init instruction. It does not infer a version requirement from the installed executable, claim server failure, or change global runtime refresh into a repository mutation.

For a missing declaration, run the repaired `repo-harness init --repo .` in the affected repository. A malformed explicit declaration must be corrected deliberately; merging defaults does not override it.

## Verification and limits

- Red/green run: original fleet helper rejects the receipt-owned upgrade; repaired helper passes. Herdr missing/malformed cases originally report unavailable, and the original adoption plan omits the pin; all new regression cases pass after repair.
- Focused coverage: fleet installer, bundled init, global runtime init, install profiles, adoption plan/apply, tooling checker, Herdr pin drift. The seven initial profile-fixture failures were obsolete six-role fixtures; after adding deep-worker, all 63 tests in the affected installer/profile/bundled-runtime selection passed.
- Package verification: `npm pack` builds both runtime artifacts; extracted package scripts and projected helper independently resolve their packaged TypeScript ownership reader. A disposable HOME fresh install and receipt-owned upgrade reproduce all 14 role files without producer module links. Archive contains the required modules and no Python cache artifacts.
- No new production dependency or abstraction. The one new test helper serializes a protocol-2 ownership fixture for two regression consumers; this prevents tests from requiring unrelated full-profile tools. This research file preserves the verified upgrade boundary.
- No full-suite trigger: changes are covered by the named installer, policy, and detector suites plus repository integrity checks. No release or live user configuration mutation is claimed. Installations without valid ownership evidence remain blocked rather than being silently adopted.
