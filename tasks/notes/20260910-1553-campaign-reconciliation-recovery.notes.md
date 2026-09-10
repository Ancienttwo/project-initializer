# Reconciliation recovery decisions

Owner approval: Codex conversation `01a089b3-6b92-72e2-ba20-da48ab37c465`, user message `msg_01a08a7b-c10c-78d0-a5c3-9cd1722610f3`, received `2026-09-10T08:42:41.300Z`, text `批准`. This approves the described architecture update, external review, PR/CI and subsequent live repair/stop/continuation. Controlled root context files, the context map and the capability request are included only as outputs of the approved canonical architecture refresh.

> **Substantive Change SHA256**: `sha256:6759c460fd228345267bbbac2d75456ffb6b64957daeab6e7f41fa84395f875d`

The original reservation/reconciliation/expiry receipts are immutable. The explicit repair uses the original raw-record digest, validates replacement evidence and the complete event first, then records the repair and single charge. Terminal acknowledgment appends stop after expiry and never reopens execution. This avoids replacement-schema migration and keeps the existing strict continuation gate.

The late-settlement exhausted projection issue is directly on the required recovery path and is covered in this slice. The live BYOK issue, grant, browser and ledger stores have not been changed by this work.

## Scope and verification rationale

Repair is restricted to malformed evidence digests under an original reconciled_reserved decision. It preserves evidence reference names and charges the complete reserved vector; no cheaper resolution is repaired. The private prepare/publish seam serves ordinary usage, reconciliation, and operator recovery so they share one validated event and accounting commit. The only new non-workflow file is the recovery runbook; the RED log is required bugfix evidence. No dependencies were added.

Development verification used the existing persistence fixtures and isolated HOME. The initial grouped development run omitted the repository standard 60-second per-test timeout: one existing filesystem test exceeded Bun's 5-second default amid host load; no assertion was weakened, and final named checks use the normal bounded runner. A new store-test assertion initially read events from the mutation return instead of readDevelopmentCampaignStatus; it was corrected, and the store/continuation regressions passed.

Sibling sweep: reconcileAutomationReservation was the caller-controlled evidence publication hazard. recordCampaignProviderOutcome validates its outcome, exact stored reservation and raw digest before writing a provider observation, and constructs its usage evidence from a sealed receipt; it does not take arbitrary reconciliation evidence. Ordinary append publishes only the already validated event. No other production surface was changed.

## Prepared operator evidence

The source CLI default preview used the exact live record hash `45312b61bc2476ede4ec7cb4c28a5e50bb7487ebfc4c448fbb3a85fdd76470f4` and independently hashed original harvest bytes to `ac6c8bddb1e36eae7fd576c244c8debd6e15cd3f99c105d13eed63eb4dba1978`. All 14 files under the live run were byte-identical before/after. The proposed single charge is one agent turn, one runner invocation and one provider failure, with no acquisition, repair cycle or model dispatch. Request/readback remain in `/tmp/campaign-reconciliation-recovery/live-repair-request.json` and `live-preview.json`. This is preview evidence, not a completed settlement.

`npm pack --json --pack-destination /tmp/campaign-reconciliation-recovery` rebuilt the real package. Tarball SHA-256: `046beb41886c62586967d7130395703b1ceb6b0f6dd0a1ad2e2e33fe0238c933`. A fresh temporary HOME and Bun install resolved the package; the installed three changed source files match this worktree exactly. Its executable CLI help resolves the command and flags. The existing operator CLI fixture was copied into the disposable installed package solely as a harness and passed 1 test / 6 assertions, exercising default no-write preview and explicit apply through the installed CLI. No package was published or globally activated.

Four native adversarial angles (assumption violation, cascade construction, composition, abuse) and security/architecture specialists found no blocking source issue. A separate disposable composition probe passed 1 test / 10 assertions for usage-before-current crash recovery and ordinary-API interleaving. These reviews do not substitute for the contract-frozen external acceptance provider or the still-pending architecture acceptance.

The first proof-reconciliation attempt raced this task's package build adding ignored dist files and was correctly refused as snapshot drift. The build has finished; subsequent proof-only reconciliation correctly refused a non-empty current projection. The two direct-call selectors were updated to match the reviewed refactor, and the architecture delta review passed. Current classifier reports `entrypoint-changed` plus `verified-flow-proof-changed`, which requires a real approval reference. No architecture acceptance reference was invented.

## Final focused validation

The seven-file run finished with 140 pass / 1 timeout / 739 assertions in 389.49 seconds. The only failure was the unchanged exact-Issue admission case at its existing 60-second limit; the new combined recovery/continuation case passed. A bounded control ran that exact case once on clean baseline `3c570360` and once on this patch, preserving the same timeout and all assertions: baseline passed in 19.59 seconds, patch passed in 10.31 seconds. Each performed 717 local Git commands; the longest individual Git command was 139.49ms on baseline and 51.29ms on the patch. Thus the timeout did not reproduce and no patch regression was identified; the original failed aggregate log remains evidence, not relabeled as a clean suite pass. No source/test workaround was added. Logs and Git performance traces are `/tmp/campaign-reconciliation-recovery/{baseline,patch}-exact-60000.{log,git-trace}`.

Typecheck and seven non-architecture root integrity checks passed. Strict architecture check remains blocked on the recorded acceptance candidates; final canonical acceptance, external review, PR/CI and live activation have not completed. The local checkpoint is a reviewable source boundary, not publication or campaign recovery.

## Architecture acceptance

The owner-approved architecture apply completed with receipt `sha256:9cba7a5d555ed6fbe562961c5ff20fc758b11066c15562bae30825ed544768db` and the exact user-message approval reference above. The generated capability proof is `proven`, selectors 8/8. Actual tracked outputs are the projection manifest, six index/diagram stamp updates, and automation-budget module documentation. Two old proof-only candidates were reconciled with current empty noops; two old semantic candidates were retired after strict ancestry and current-proof checks. Readiness reports 0 unresolved candidates and 0 invalid artifacts. The first apply attempt failed a CodeGraph handshake without writes; after an up-to-date index readback, the same approved request succeeded without changing timeouts.

Final canonical verification includes the capability-declared budget driver e2e (two existing local fixture cases) in addition to the previously named seven files, so reserve-act-append exhaustion and operator stop-receipt parity are explicit. No real provider is used by these fixtures.

## Approved continuation authority

The owner separately approved the fresh-campaign recovery on 2026-09-10T09:34:48.768Z in message `msg_01a08aab-79bc-7143-8c73-a5a764f1ee27` (`批准`), responding to the concrete proposal to retain Issues #177/#178, stop the poisoned third campaign, and issue a new campaign-bound grant with only 39 provider calls and 44 agent turns/runner invocations. Other limits remain unchanged and expiry remains `2026-09-10T13:19:45.830Z`. This post-delivery operator authority does not widen the source patch into intent replacement or browser changes. Review and CI precede live source activation. Re-read remaining balances and state immediately before mutation; completed worker/verifier work remains SKIP.

Read-only source and live-record inspection confirmed that the third campaign had already persisted a resume intent without supersedes at 15:23 HKT. Correct supersedes changes the immutable prompt/intent; omitting it conflicts with the verifier's existing continuation. No public same-campaign repair exists. The replacement campaign must supersede the acceptance campaign, not the poisoned third campaign, which never became the effective continuation.
