> **Archived**: 2026-09-06 22:42
> **Related Plan**: plans/archive/plan-20260906-2017-brc9-campaign-budget-prerequisite.md
> **Outcome**: Completed
> **Lifecycle**: notes
> **Parent Run ID**: run-20260906-2242
> **Archive Projection V1**: `plans/plan-20260906-2017-brc9-campaign-budget-prerequisite.md` => `plans/archive/plan-20260906-2017-brc9-campaign-budget-prerequisite.md`
> **Archive Projection V1**: `tasks/notes/20260906-2017-brc9-campaign-budget-prerequisite.notes.md` => `tasks/archive/notes-20260906-2242-brc9-campaign-budget-prerequisite.md`
> **Archive Projection V1**: `tasks/contracts/20260906-2017-brc9-campaign-budget-prerequisite.contract.md` => `tasks/archive/contract-20260906-2242-brc9-campaign-budget-prerequisite.md`
> **Archive Projection V1**: `tasks/reviews/20260906-2017-brc9-campaign-budget-prerequisite.review.md` => `tasks/archive/review-20260906-2242-brc9-campaign-budget-prerequisite.md`

# BRC9 campaign budget prerequisite decisions

> **Substantive Change SHA256**: `sha256:1f25ff53a0eb2cd0b61e966e8e72374bb4e1bca3715e46319987132dfa611982`

The existing campaign authorization payload owns the two new limits. Local step admission/completion events share the existing ledger with leaf usage events; there is no outer unresolved reservation. Scope and exact semantics are frozen in the approved plan. The BRC9 sprint row remains pending for consumer wiring and the other named prerequisites.

## Verification scope

The contract names existing #282/#279 and campaign producer/consumer tests plus a new real-store composition regression. No local full suite is required. Publication evidence for the preceding #287 package was corrected separately in 2cf1dd5b; its historical prepare/review/receipt subjects are unchanged.

## Resumed after upstream closure

The user returned 77b16acb5b054d0f173d5383c1364dd0cea913a2 and Required CI run 34034642323. A direct GitHub check confirmed completed success for Test, all MCP platforms and Required / CI. The target delta from our 2cf1dd5b base additionally includes release telemetry/gitignore/artifact repair and snapshot diagnostics; it is not described as only the final two-file correction. None edits this package's four production owners. The protected inventory adds the two artifact-repair admission paths. Old #287 external review, prepare and owner receipts remain bound to their original subjects.

Resumed development evidence: typecheck passes; core/authoring/schema/composition batch 51/51; existing #282 durable-store file 49/49; authoring/heartbeat/adoption consumers 47/47. The expanded composition file has 16 passing cases including deadline completion, cross-process admission, exact grant/refusal and projection. These are development checks, not final acceptance. Canonical preparation will run the contract's exact target-bound checks after implementation/review freeze. No local full suite is required.

## Revision quiescence and fixture isolation

The review found that publishing revision 2 after a step admission but before its completion would replace the budget digest required by completion. The existing open-reservation guard did not cover a local admission with no leaf. Publication now folds the same campaign ledger under the existing run lock and refuses an active step; completed consumption remains revision-independent.

- Root cause: revision publication treated absence of external reservations as quiescence despite an active revision-bound step.
- Pre-fix evidence: the new real-store begin -> revision regression failed because publication did not throw (`/tmp/brc9-budget-revision-red.txt`).
- Fix: require no active campaign step before publishing a replacement revision; preserve existing generic and leaf guards.
- Verification: the regression proves unchanged current on refusal, successful completion and revision, and two retained step charges after a subsequent admission. A combined run initially exposed the existing store fixture's leaked global clock; its lifecycle now installs in beforeAll and restores clock/environment in afterAll. The three affected store/authoring/composition files pass 73/73, 387 assertions (`/tmp/brc9-budget-revision-green-2.txt`).

No dependency was added. The new test file owns real-store composition, revision and concurrency regressions. New typed events and the ledger fold protect the shared step/provider invariant across admission, completion and operator projection; they introduce no second persistence authority.

## Coherent board reads and historical step authority

- Root cause: board status and campaign metrics came from separate scans without checking their event and reservation identities. The isolated-child interleaving regression performed a real writer operation during the read and reproduced a mixed snapshot (`/tmp/brc9-budget-board-red.txt`). The board now validates event count, full chain digest and unresolved reservation digests against current using the exact arrays supplied to the campaign fold; a mismatch refuses the read without mutation or automatic retry.
- Root cause: step event shape/digest validation did not bind its budget to published history. Recomputed foreign-authorization and foreign-budget events were accepted during recovery (`/tmp/brc9-budget-foreign-red.txt`). All stored/prospective campaign folds now verify the exact authorization and budget ancestry; a live step must still name current revision. Valid completed prior-revision steps remain consumable. The shared store fold serves drift, admission, completion and read projection, avoiding divergent validation authority.
- The prior frozen subject 475afb8d passed all 29 contract checks and its official codex-plugin static review, but native architecture review found the above gaps. Its prepare failed Change Assessment because the contract omitted routed-risk oracles; that declaration now points to the actual named regressions, integrity checks, projection readback and semantic review. These old checks/review remain original-subject evidence and are not final acceptance for the fixes.

Cross-revision mutation replay remains refused, matching existing reservation authority rules. Historical events remain readable; the package adds no historical mutation-receipt lookup. Completion already seals no-progress exhaustion through the shared repair path; no second exhaustion implementation was added.

## Acceptance boundary

Final implementation 77523d58 has passing canonical prepare run-20260906T215359-61531 (29/29) and all final native review angles. The external review budget permits one invocation per work-package; the previous external pass remains bound to 475afb8d. The owner subsequently explicitly approved user_waiver acceptance for checkpoint 89c8df63. The typed grant and receipt were recorded on 2026-09-06, binding subject sha256:05c65fddf637349e7233a198ca71f710d312a84b780c241c74055e234d1d6165, target 77b16acb and verification evidence sha256:50379ecc2c02997f8bc6588b1ac3d19302fb0848ac491b9f05a17cb358790ce3. Canonical finalization passed without rerunning verification. Main has an unowned dirty architecture manifest that the user explicitly requires preserving; finish/merge remain on hold. The review artifact contains the exact final subject/target and evidence ledger. No finish, merge or push occurred.

Review also identified an existing standalone campaign leaf reservation/usage ancestry gap in base 77b16acb. It predates this package and requires a separate #282/BRC6 leaf-history decision; the new step-event authority checks do not redesign that protocol.

## Approved target integration

The owner explicitly approved preserving the main dirty projection by committing its exact bytes, followed by target rebinding and merge. The projection was preserved as d969c667 atop 92bd33fe, with semantic state, source digest, model and flow proof unchanged. The newly advanced upstream #329 delta adds context-map drift validation and repairs duplicate root registrations; it does not edit the four budget production owners. The budget worktree merges that exact target. Its generated-manifest conflict was resolved by retaining the already reviewed budget baseline, then regenerating via ordinary architecture projection; the original main snapshot remains reachable in d969c667. The added upstream context-map gate passes on the integrated candidate.

The earlier owner receipt stays bound to target 77b16acb. Target integration requires refreshed exact-context preparation and a new receipt from the existing owner grant; it does not justify a local full-suite rerun. Main push waits for the already running 92bd33fe CI 34038743723 to finish.
