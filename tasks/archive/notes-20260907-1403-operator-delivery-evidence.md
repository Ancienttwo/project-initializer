> **Archived**: 2026-09-07 14:03
> **Related Plan**: plans/archive/plan-20260907-1207-operator-delivery-evidence.md
> **Outcome**: Completed
> **Lifecycle**: notes
> **Parent Run ID**: run-20260907-1403
> **Archive Projection V1**: `plans/plan-20260907-1207-operator-delivery-evidence.md` => `plans/archive/plan-20260907-1207-operator-delivery-evidence.md`
> **Archive Projection V1**: `tasks/notes/20260907-1207-operator-delivery-evidence.notes.md` => `tasks/archive/notes-20260907-1403-operator-delivery-evidence.md`
> **Archive Projection V1**: `tasks/contracts/20260907-1207-operator-delivery-evidence.contract.md` => `tasks/archive/contract-20260907-1403-operator-delivery-evidence.md`
> **Archive Projection V1**: `tasks/reviews/20260907-1207-operator-delivery-evidence.review.md` => `tasks/archive/review-20260907-1403-operator-delivery-evidence.md`

# Implementation Notes: operator-delivery-evidence

> **Status**: Active
> **Plan**: plans/archive/plan-20260907-1207-operator-delivery-evidence.md
> **Contract**: tasks/archive/contract-20260907-1403-operator-delivery-evidence.md
> **Review**: tasks/archive/review-20260907-1403-operator-delivery-evidence.md
> **Last Updated**: 2026-09-07
> **Lifecycle**: notes
> **Substantive Change SHA256**: `sha256:273370adb6ecada656f2e75453078daa97235da8871aacaa216d6252168a610e`

## Design Decisions

- Implementation base is `7430fb93`, including BRC10 #338. Root checkout and its unowned architecture manifest were not changed.
- Reuse the existing notify candidate selection and status list. Delivery still joins the Task Message receipt; latest observation is independently labelled as notification evidence.
- Strict UTC timestamp decoding mirrors the existing notification wire grammar because the core mechanics module imports Node crypto and cannot enter the browser bundle.
- Expandable evidence details retain the existing copy interaction. A notification-specific relative-time label reuses existing age formatting without calling it a board snapshot.

## Deviations From Plan Or Spec

- Real Chrome screenshots exposed implicit grid minimums stretching the shared detail column beyond the viewport when collaboration content is present. Constrain the existing detail body/block tracks with `minmax(0, 1fr)` so the new evidence remains readable on narrow screens. This is the one directly blocking adjacent layout correction.

- The authority freeze record and its inventory digest must advance with the explicitly approved Fleet protocol 4 change; all other authority versions stay unchanged.
- Installed smoke uses the real empty Fleet HTTP response plus the installed strict decoder and a nonempty installed UI fixture. Real effect-to-receipt behavior is covered by the producer tests; the packaging smoke does not claim live notification delivery.

## Verification Scope

- Named tests cover producer, Fleet/Operator projection, decoder, UI, CLI, write boundary and authority inventory. No full-suite trigger was identified.
- Real Chrome rendering passed all seven states: 1440px desktop and explicit 390px viewport (evidence widths 535px/350px). Artifacts: `.ai/harness/evidence/operator-delivery/browser-acceptance.json`, `single-verified.png`, `stopped-verified.png`, and other state screenshots. The temporary fixture entrypoints are saved beside them and removed from source. No live provider or user session. Raw endpoint fields remain excluded.
- Freeze toolchain: Bun 1.4.0, Node v26.5.0, npm 11.17.0; bun.lock SHA256 `2d2340964dae7342b457db7c9d7c687c68c2f5658d107859a54e8890381aa0f5`. Packaging creates its own disposable install and HOME; no task-specific environment overrides.
- Expensive final tarball smoke runs once via prepare-acceptance after implementation/base freeze. It already builds the Operator bundle through prepack.

## Residual Risks

- Tasks without a bound notify effect have no notification evidence. This does not discover arbitrary BRC sessions.
- Existing store scans and torn-read detection remain the throughput limit; no new scans were added.


## Acceptance Evidence Reuse

All product checks and installed tarball smoke passed on the exact tree committed
as `1d94ba1fe1aed296214e4b7a6ede4aa68db81cc4`. The only formal failure was the missing diff-bound
workflow annotation. Tarball execution `vx-14c71df96f9c4283ac4b` passed in 29.4s.
After this baseline, only workflow evidence and deterministic architecture
provenance may change. The contract retains that immutable packaging baseline
with a current delta check proving all other Git-visible content is unchanged.
The original pass is not claimed as a new full-tree packaging pass; there is no
uncovered packaging input change and no justification for another expensive run.

The final Change Assessment now names the existing `producer-projection` test
criterion as the deterministic oracle for the new Fleet projection types. No new
test command or code was added. Product/type checks from the all-pass second
contract execution also retain their recorded baselines with the same exact
content delta; workflow checks remain current.

## Publication integration with BRC13

> **Substantive Change SHA256**: `sha256:afb7d66731f94257b23ee69ebf947b4eb1694a3014b241d8cc9ca9ed4dc71cf5`

The publication delta is bound to remote main `2cbd3b2ba9e12daea0c55ff01f6a6f9d8b0a7c22`. Integration preserves Operator commit `426f24c8` and ledger reconciliation `fa9e61cd` as ancestors, together with BRC13. The only merge conflict was the generated architecture manifest; the configured provider refreshed it against the combined source and a current deterministic reconciliation returned noop with no human actions. No production source was edited during integration.

The original external-pass receipt remains bound to its original subject and target `7430fb93`; this appendix does not extend or replace it. On the combined tree, the ten Fleet/Operator test files (unit fleet-board, operator-fleet-snapshot, operator-web-types, r1-provider-neutral-agent-runtime; effects fleet-board; CLI fleet-board, fleet-feedback, operator-serve; Operator interactions and UI) passed 260 tests with 1326 assertions. Typecheck passed. BRC13 main CI `34095153642` is retained as its own baseline, not relabelled as a combined-tree pass. Required repository integrity checks are rerun for publication; required CI remains the publication gate. No second external review, local full suite, or package release is introduced by this integration.
