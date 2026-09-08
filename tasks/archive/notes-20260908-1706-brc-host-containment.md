> **Archived**: 2026-09-08 17:06
> **Related Plan**: plans/archive/plan-20260908-0420-brc-host-containment.md
> **Outcome**: Superseded
> **Lifecycle**: notes
> **Parent Run ID**: run-20260908-1706
> **Archive Projection V1**: `plans/plan-20260908-0420-brc-host-containment.md` => `plans/archive/plan-20260908-0420-brc-host-containment.md`
> **Archive Projection V1**: `tasks/notes/20260908-0420-brc-host-containment.notes.md` => `tasks/archive/notes-20260908-1706-brc-host-containment.md`
> **Archive Projection V1**: `tasks/contracts/20260908-0420-brc-host-containment.contract.md` => `tasks/archive/contract-20260908-1706-brc-host-containment.md`
> **Archive Projection V1**: `tasks/reviews/20260908-0420-brc-host-containment.review.md` => `tasks/archive/review-20260908-1706-brc-host-containment.md`

# BRC containment slice decisions

> **Prior Adapter Substantive Change SHA256**: `sha256:9b53a37f5e6698f1f16d51841da81086172f2ac44647e588979a7f0172a7ade7`

The prior adapter slice passed. The newly authorized consumer integration is now paused with unfinished verification; its current bytes are not covered by that prior digest.

Expected spec is owned by the pre-create request journal. Docker readbacks can validate that spec and a frozen drift baseline, but cannot author permission. Top-level Mounts compare by unique destination; the one documented request-side ReadOnly omission is decoded locally to that field. No global null/array cleanup is permitted.

The model-free live suite is explicitly enabled by its pinned local image for verification. Its default skip without Docker image configuration is not acceptance; the contract command always supplies the image. Frozen evidence covers 19 tests and 59 assertions. No full-suite trigger exists because current campaign consumers have not been switched to this new carrier.

## Consumer integration pause

The user approved consumer integration. V2 invocation binds a pinned Docker image, separate protected probe and workload handles, one absolute deadline, role mount access and a protected terminal receipt. contract-run routes managed children to Docker without host PATH fallback. Unknown/malformed provider operations still cannot authorize inactivity. Failed-process accounting consumes supervision independently of writable-owner eligibility. Native historical fixtures are explicitly modeled unit-test facts, not Docker proof.

Current evidence (development only): real runtime probe plus worker/verifier Git command paths passed 3 tests / 21 assertions in `consumer-integration/brc-runtime-live-2.log`. A later run through the actual exported contract-run child boundary also passed these three cases. Typecheck passed after safe stream-fd writes and the dry-run finish guard. No full suite or paid provider run occurred.

Three failed integration batches are retained: lifecycle 44 pass / 2 fail; initial model-free image FROM local-ID build rejected; latest combined adapter/runtime run 20 pass / 2 fail / 1 error. The latest failures were the outer Bun 5-second timeout, including cancellation interrupted in pre-start Docker info. A source inspection also found the two new controller-death/output-flood tests nested under the resource-drift test; neither executed. Stop under global AGENTS.md:44, without another repair/reverify cycle. Raw logs and current path hashes are in `.ai/harness/runs/brc-host-diagnosis/consumer-integration/`.

Exact next bounded slice: move the two nested cases to real top-level image-gated tests; give outer test harness enough time for its already-fixed workload deadline plus the finite cleanup window (do not lengthen workload deadlines); rerun only these cases and the two failed lifecycle cases on frozen bytes. The cross-process lifecycle failure may reflect source edits during the earlier process test; verify instead of assuming. Then run the declared focused set and required integrity checks once. The latest source has no current acceptance receipt.

Unfinished runtime boundary: controller-crash start journal can prevent relaunch and the independent watchdog bounds effects, but recovery cannot yet reconstruct a missing terminal receipt/output after controller death. Do not claim complete crash reconciliation. No issue closure or merge is authorized by the partial evidence.

BRC6a evidence: `repo-harness-wt-brc6a-readback-research` HEAD `2cccfe43`, research options lines 114-126 records app activation, conversation `6a9f0045-c728-83ea-a489-27796265282a`, canary `33d692aaa0ab593df0c160082b18fdac02c82e9c`, matching README blob `4779ce156e273311fa013c0bd7f71b9c9048129d`. Main owner-closeout document explicitly says no provider-origin resolved-commit receipt and runtime gate unchanged. This confirms feasibility, not current normal-admission acceptance. Preserve the gate.

## Authorized continuation

The user explicitly requested continuation after the stop report. Retain all prior failed batches; fix the identified test registration/outer harness bounds first, freeze source during process tests, then continue the existing controller-crash recovery slice. Workload deadlines, admission and issue closure criteria remain unchanged.
