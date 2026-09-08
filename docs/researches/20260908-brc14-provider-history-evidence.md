# BRC14 provider-history revision evidence

## Real observation

On 2026-09-08, Oracle 98bebeb2 completed a new read-only GitHub observation in conversation `6a9fa035-b610-83ea-b000-0ad484e21e65`, provider session `perform-a-fresh-read-only-3`. Explicit GitHub activation and complete prompt submission succeeded. The configured user default was preserved; provider history reported `gpt-6-pro`, while local model verification remains false. Runtime was approximately 1m51s. The fresh grant admitted one provider call; its ledger settled one call with no open reservation. Earlier failed reservations were reconciled conservatively and their budgets remain closed.

The initial SSE destination was lost across worker serialization. Oracle 9fe69d2b fixes both storage and worker reconstruction. This does not retroactively create a stream artifact for the real observation.

Read-only history recovery returned HTTP 200 from the actual conversation endpoint. Decoded response SHA256: `a55c05ead0cab070da100e9e19581d457ac83e1870dc6930462ec6e749ba770b`. Both page flags are false and continuation is null. The preserved response is under ignored `.ai/harness/runs/brc14-readonly-r3/conversation-history.json`; original observation and budget are alongside it.

The server history contains actual tool-author messages, not only assistant text:

- Commit message `2f192221-739c-4f2d-84fe-021765f7b3d2`: full 13/13-line `api_tool.call_tool` return for commit `33d692aaa0ab593df0c160082b18fdac02c82e9c`, with tree `e198e1a525df4614f8dfd4564f32b0034dfb08f7`.
- Ref message `1ef2996e-1740-4b21-b25e-d91935c7c2a3`: full 13/13-line return for `refs/heads/main`, whose object points to that commit.
- Both bind the same turn, GitHub invoked resource, connector ID, citation URL and unchanged nested GitHub JSON. Corresponding call request messages are absent; this is provider-origin tool-return evidence, not a complete tool request/response pair.
- The tree wrapper is truncated. Its content line contains 36 root entries which match local `git ls-tree` exactly, but production identity validation excludes that truncated wrapper and consumes the complete commit/ref returns only.

## Production boundary

Oracle captures a completed session's own history before closing or archiving its tab and writes a private session-bound envelope. The destination survives CLI serialization and worker reconstruction. Harness requires the invocation-owned file, matching terminal session metadata and actual conversation ID before exposing typed history to campaign validation.

The strict decoder checks successful exact-origin history, digest, complete pagination, one prompt-bearing user turn, same final-answer turn, explicit GitHub activation, tool role/name/resource, complete numbered JSON wrapper and matching repository/ref/commit URLs and values. It does not scan assistant prose for SHAs or repair missing metadata. Unknown or contradictory evidence stays unverified.

Fresh audit protocol 2 includes the prompt and answer digests and either a revision evidence object or null. Verified accepted/accepted_with_followups observations may use bounded existing transitions; rejected/unverified results cannot accept or seed a group. Acceptance rechecks the live group snapshot. The active admission gate remains unchanged.

## Acceptance limit

The real run above is a pre-active revision observation, not a completed-group audit. Its historical raw result stays unchanged and is not upgraded into a new receipt. BRC6a remains Owner-closed; BRC14 still needs its full group-audit acceptance and BRC15 still needs the active/manual closed loop. No new GPT invocation or active campaign is part of this implementation package.

## Follow-up sequencing implementation

The original group-loop design (plans/sprints/20260902-GPT-issues-loop.md:1168) permits accepted_with_followups to feed the next authorized group. The authoring context now reads the previous accepted observation and passes its findings verbatim into both initial and continuation prompts before the prompt digest and provider admission. Planning and observer callers retain their SHA-only baseline projection. Findings do not create extra slots, change allowed issue kinds or authorize a fourth group.

The canonical campaign lifecycle records complete_with_followups -> completed_with_followups separately from complete -> completed. Both completion paths require all authorized groups and the matching final verified audit disposition; findings length never substitutes for that disposition. Historical status stays a pure event projection, and prior recorded completed outcomes are not reinterpreted. This is model-free implementation evidence, not full live BRC14 or BRC15 acceptance.

## Formal pre-active admission

Protocol2 revision observation now requests same-session history and retains its immutable raw result before settlement. It validates exact request/output/session/profile/connector/commit/ref identity through the existing history decoder. Protocol1 and historical unavailable observations are retained as original artifacts and cannot serve as active authority.

Every active entrypoint, including fleet offer projection, passes its stored intent into one guard. The guard checks the current campaign/grant/group baseline, active policy and provider repository; validates original budget grant and the actual stored reservation plus observed progress event; and rejects stopped or exhausted budget/campaign state. Later groups continue consuming the preceding accepted audit baseline; the bootstrap observation is never treated as evidence for a later main revision.

Offer queries use read-only usage validation: a lagging budget current projection is refolded for reads and is not repaired by a status query. Existing locked settlement and recovery behavior remains separate. These are model-free implementation checks. R3 retains its historical unavailable result; no new real observation or active/manual canary has been run with this package.

## Bounded closeout after R4

The Owner-approved R4 observation on 2026-09-08 stopped before submission: Oracle recorded `promptSubmitted:false` and `APP_SELECTION_UNVERIFIED: GitHub: app-not-found`. Its reservation was reconciled conservatively (`reconciled_reserved`, no open reservations); that charge does not establish a model turn. The original failed result remains unchanged.

A no-send Profile 13 reproduction exposed an actual GitHub inline pill restored while the selector waited for menu candidates. Oracle 14cfbfc6 rechecks the same strict pill identity during that wait. Its regression failed before the fix and passed afterward; 26 browser tests, typecheck and real no-send UI verification pass. This is a local selector repair, not a new BRC6a probe or live BRC14 acceptance.

Owner directed integration of existing work and an end to open-ended evidence experiments. This round ends with BRC6a/BRC15a closures preserved, BRC14/BRC15 live acceptance unfulfilled, and active/manual unstarted. Existing runtime gates and budgets remain enforced. No further GPT call is scheduled by this closeout.

## Conservative active boundary after integration review

The integration review found that revision and budget proof could admit the host worker before #354 independent supervision was connected. The final guard now explicitly rejects new active preparation/launch even when revision and settlement are valid. There is no configuration override. Existing recorded final settlement and legitimate recovery retain their separate paths. A valid stored intent/history/ledger combination reaches the specific supervision refusal without external calls or budget/materialization changes.

The observation CLI separately returns success for settled verified observations and their replay; unavailable evidence and errors remain nonzero. This success does not authorize active execution. The no-argument production-closed test is removed; 48 focused observation/CLI/finalization/worker tests pass. #354 and BRC14/BRC15 live acceptance remain unfulfilled.
