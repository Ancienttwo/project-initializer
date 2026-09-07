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
