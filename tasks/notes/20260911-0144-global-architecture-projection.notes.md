# Implementation Notes: global architecture projection

## P1: Map
Global install/update owns ~/.repo-harness/config.json; repository init owns adoption only. CLI status, Stop, projection orchestration and three shell gates now consume one global loader. Repository models, architecture documents, freshness policy and acceptance remain local.

## P2: Trace and root cause
Before this change, global install/update did not initialize projection. The provider read repo policy, whose missing settings became disabled; shell seeders wrote disabled repo switches. The red two-repository CLI regression expected archctx but received disabled (captured under .ai/harness/checks/global-architecture-pre-fix.log).
After: install/update seeds archctx/automatic once -> repository init reports readiness -> global loader -> existing exact-version provider handshake -> durable job/receipt pipeline. Missing models remain not-ready and do not authorize semantic adoption.

## P3: Decision
Cut over execution settings to one host authority, with no repo override or migration merge. Operator-invoked adoption removes retired repo execution keys. Preserve explicit global disabled, unrelated global fields, package-owned provider version, human-owned regions and approval boundaries. At ten times the repositories, repeated setup is removed; provider work remains bounded by existing timeout/queue contracts.

## Verification and review
The focused development baseline passed 141 tests. Subsequent config/Stop delta passed 45 tests, global setup entrypoint passed, seeders passed, and three affected helper regressions passed. Architecture and security specialists inspected the full diff. Null enum coercion and a new jq dependency were found and fixed; Node-only shell parsing retains the existing runtime support using the same authority. Final required checks are recorded by verify-sprint.

## Known limit
The provider process-tree timeout regression fails both here and on unmodified main because descendant.pid is absent. Logs: /tmp/global-provider-timeout-recheck.log and /tmp/global-provider-base.log. It is outside this configuration change and remains unfixed. Native specialist review is not the contract's external Codex-plugin AcceptanceReceipt; do not infer merge acceptance from it. This task opens a draft PR if that receipt remains unavailable.

The user additionally requested a v0.19 proactive refactoring discovery check after this PR; keep that evaluation separate from this implementation.


Final review delta: malformed Node readiness now exits nonzero instead of emitting a synthetic provider/apply pair. Both Node-only valid-policy and corrupt-readiness checks pass. Remote main advanced from 8fc92c08 to 09e4a4d0 with only a projection manifest rebind (#400); the branch incorporates that manifest-only update before final prepared evidence. External current-target merge acceptance remains pending.

> **Substantive Change SHA256**: `sha256:bee75aaab8faa2213b92fd281c0193a9112052c8671193105f515d3a6cf38f43`

PR merge-base evidence (09e4a4d0; source unchanged from final passing preparation):
> **Substantive Change SHA256**: `sha256:b5bc1f792456ca2603e9413400a749aa6b6d3b342d0498af285f13abde339c4d`

Final preparation: 25/25 checks passed, run `run-20260911T021315-69480-20260911-0144-global-architecture-projection.json`, evidence event `evt-01M268DR3704SJRDCK8X8WPH5X`. PR #401 is open as draft pending external acceptance.
