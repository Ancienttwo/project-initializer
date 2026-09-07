> **Archived**: 2026-09-07 14:28
> **Related Plan**: plans/archive/plan-20260907-1224-brc13-closeout.md
> **Outcome**: Completed
> **Lifecycle**: notes
> **Parent Run ID**: run-20260907-1428
> **Archive Projection V1**: `plans/plan-20260907-1224-brc13-closeout.md` => `plans/archive/plan-20260907-1224-brc13-closeout.md`
> **Archive Projection V1**: `tasks/notes/20260907-1224-brc13-closeout.notes.md` => `tasks/archive/notes-20260907-1428-brc13-closeout.md`
> **Archive Projection V1**: `tasks/contracts/20260907-1224-brc13-closeout.contract.md` => `tasks/archive/contract-20260907-1428-brc13-closeout.md`
> **Archive Projection V1**: `tasks/reviews/20260907-1224-brc13-closeout.review.md` => `tasks/archive/review-20260907-1428-brc13-closeout.md`

# Implementation Notes: brc13-closeout

> **Status**: Active
> **Plan**: plans/archive/plan-20260907-1224-brc13-closeout.md
> **Contract**: tasks/archive/contract-20260907-1428-brc13-closeout.md
> **Review**: tasks/archive/review-20260907-1428-brc13-closeout.md
> **Lifecycle**: notes

## Design decisions

The reviewing Lease, not a bound-only ClaimActor live check, owns closeout. The worker store now exposes the immutable original/recovered completed antecedent and its original budget settlement. Publication reconcile consumes a shared Provider decoder, fetches a fresh target, checks actual mergeCommit reachability and persists the consuming transaction's proof before removing the Lease. Historical generic integration observations are not rewritten or promoted to mergeCommit evidence.

Comment, close and remote-delete attempts reserve mutation plus mandatory readback together. Started/result records prevent repeat mutation after unknown results. Readback has no independent admission exemption; deadline, stop and unknown reservation remain global fences. A Git fetch has an explicit git_read leaf. Each Task closes its merge step before waiting for sibling Issue members, so waiting does not hold the global active-step slot.

Exact local cleanup and final bind share topology-before-Task lock ordering. Bind revalidates the real worktree and branch inside the barrier. Cleanup checks all Lease references, dirty status, exact head and target, invokes the existing helper with exact expected inputs, then reobserves absence. The helper uses compare-and-delete for the expected local ref; it never discards dirty work.

## Limitations to retain in acceptance

BRC10's Provider completion is not writable-descendant containment. A command execution with unknown inactivity leaves BRC13 cleanup pending; no receipt from notification, process-group quiescence alone or human PR merge upgrades that proof. This is an explicit refusal, not a claim that ordinary command-driven campaigns have automatic cleanup coverage.

For an unknown POST response, comment readback is a bounded first-page observation of 100 comments. Known comments use their exact returned id. Absence from that page cannot prove failure or permit a second mutation; it leaves reconciliation pending. A moved local target refuses cleanup rather than assuming the old integration observation describes current main.

The not_planned path now consumes a committed typed decision and falsifier artifact, both explicitly covered by the exact local AcceptanceReceipt verified by the existing acceptance authority. Every Issue member must have a non-admitted not_reproducible planning result and no Lease. This path does not reinterpret generic worker evidence as a falsifier, and a post-admission not_reproducible worker remains a human-attention case. Initial prepare and the one external review are recorded below; publication remains subject to final correction acceptance.

## Evidence

Development evidence is in /tmp/brc13-*.log. Passing component evidence includes the publication regression suite, coordination bind delta, budget/closeout/lifecycle checks, BRC10/Provider consumers, and a real two-process bind-versus-cleanup race. These are development runs, not a final frozen-subject acceptance result. The worker-to-publication-to-cleanup integration fixture passed, including idempotent replay. The not_planned fixture proves missing acceptance coverage refuses before any Provider call. Falsifier semantics are explicitly accepted local artifact content; the closeout consumer does not claim to have executed the supplied command.

The long integration fixture uses an explicit 40-call/turn ceiling instead of the shorter acquisition fixture's 10. Only this fixture input changed; production limits and the original defaults are unchanged. Every closeout external read/mutation remains metered, including Git fetch; compound attempts reserve both possible failures.

> **Substantive Change SHA256**: `sha256:b5bce714a436cbbb1a6c37a8973859f167b0469e1b3ce86558f5714435c6a182`

Architecture projection generated only the owned development-campaign boundary and deterministic umbrella stamps. The initial unavailable CodeGraph signal was resolved by creating the isolated index; the current provider check is an empty noop. Accepted apply wrote its outputs but reported post-apply digest reconciliation, so the exact stale candidates are retired only after the resulting projection commit and a current proof check.

> **Substantive Change SHA256**: `sha256:ce9005c3905dabc22ba8a15a1bed6ec0c364ec87335b81cf078fe82a3279c6f3`

## Independent review and correction

Frozen baseline be1de662: canonical prepare run-20260907T135138-13315 passed 18/18. One codex-plugin external review returned FAIL. The original transcript below is preserved verbatim; no second external review is claimed.

```json
{
  "verdict": "needs-attention",
  "summary": "Do not ship yet: remote deletion is not bound to its actual destination, and partial failures can strand closeout.",
  "findings": [
    {
      "severity": "high",
      "title": "Bind deletion and readback to the same push destination",
      "body": "The guard hashes `git remote get-url`, which identifies the fetch URL, but deletion uses `git push <remote>`, which can use separate push URLs. A configured or changed pushurl can therefore receive a destructive deletion without invalidating the guard. The subsequent ls-remote checks the fetch destination instead, so it cannot establish what happened at the deletion destination. The expected OID protects branch content, not repository identity.",
      "file": "src/effects/automation/campaign-closeout-provider.ts",
      "line_start": 71,
      "line_end": 82,
      "confidence": 0.98,
      "recommendation": "Resolve and persist the effective push destination, reject multiple or mismatched destinations, and use that exact destination for both deletion and readback. Add a separate-pushurl regression."
    },
    {
      "severity": "high",
      "title": "Resume Lease release after persisting the merge proof",
      "body": "The callback persists the merge record before reconcilePublication removes the reviewing Lease. If the process dies or Lease removal fails between those operations, retries find the merge record and skip reconciliation, then always throw because the Lease still exists. The closeout command cannot recover its own partially committed transition, leaving cleanup and subsequent campaign progression blocked.",
      "file": "src/effects/automation/campaign-closeout.ts",
      "line_start": 92,
      "line_end": 106,
      "confidence": 0.99,
      "recommendation": "Add an idempotent release phase that validates the persisted proof against the exact remaining claim, generation and publication before completing Lease release. Test interruption immediately after proof persistence."
    },
    {
      "severity": "medium",
      "title": "Read back the newly created comment beyond the first page",
      "body": "For an Issue with at least 100 existing comments, the new closure comment is absent from this first-page response. The POST can succeed, but confirmation fails and leaves the reservation unresolved. Since phase results are persisted and replayed, retries keep inspecting the same incomplete response and cannot complete either closure disposition.",
      "file": "src/effects/automation/campaign-closeout-provider.ts",
      "line_start": 81,
      "line_end": 93,
      "confidence": 0.99,
      "recommendation": "When POST returns an ID, verify that exact comment directly. For an unknown POST outcome, provide budgeted paginated reconciliation without resending the mutation. Test an Issue with more than 100 comments."
    }
  ],
  "next_steps": []
}
```

P1 destination correction binds one identical effective fetch/push destination and uses its exact value for deletion and readback; mismatched or multiple URLs refuse. P1 recovery correction keeps publication as the only Lease release owner: under Task lock it checks the exact stored integration observation, remaining claim/generation/revision/publication receipt, canonical done proof and current campaign authority. A changed generation remains untouched. Red/green proof: /tmp/brc13-review-red.log (2 failures) and /tmp/brc13-review-green.log (2 passes).

P2 known-response correction reads the exact returned comment id, independent of existing comment count. Unknown POST response still uses its reserved bounded page and remains reconciliation pending if unconfirmed; this package does not add paginated recovery admission.

> **Substantive Change SHA256**: `sha256:4af560a0e2cd2c803b1bed6d39af7e7c05bcfb48c08781c06f4aee803e607a1f`

Final delta after f009e9b6: the changed-generation regression correctly refused at the earlier publication receipt guard; only its expected error string changed. Correction consumer execution vx-c4dd146b5b6e4f1c8130 passed and is retained as explicit baseline_with_delta. Current transaction tests, typecheck and integrity checks cover the final delta; no product source changed after that consumer baseline.

> **Substantive Change SHA256**: `sha256:f1c122c54fb7970ee639e361f9788d06f1bc4606b27914b8540dab433d8d71e7`

Final prepare run-20260907T141535-74011 passed 18/18. AcceptanceReceipt disposition user_waiver binds subject sha256:081ff402bcdf25e0d9090d046571cd3b079c48ed065f4d64274293f6bb60cdb8 and target 7430fb9315175bc20762df94da25baa9885bc779 under the existing delegated owner authorization. The original external FAIL remains above; no second external review or production campaign execution occurred.

## Blocking finish correction

Root Cause Evidence: trigger = canonical finish with local main behind origin/main; observed = scratch acceptance refused exact target after local clone mapped stale source main to scratch origin/main; cause = local clone does not copy source remote-tracking refs; falsifier = main/origin-main parameterized prediction regression. Red /tmp/brc13-archive-red.log: one pass, one failure. Green /tmp/brc13-archive-green.log: 12 pass, 182 assertions.

The helper now fetches the exact source review OID into its private scratch clone and binds the resolved ref before the existing exact source/scratch check. It does not move source refs, change acceptance policy or relax the guard. This is the only directly blocking out-of-scope fix admitted; a second unrelated fault requires handoff. The corrected repo-local canonical CLI must execute finish so it consumes this helper; the installed helper still has the reproduced omission.

> **Substantive Change SHA256**: `sha256:3d52c8d4783733c9f54aacb215284e188b41644c23f304ed5c621e9bcfa48b19`
