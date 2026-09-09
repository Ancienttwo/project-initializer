# Replacement authority

The replacement record lives on the predecessor group, not the superseded successor: the predecessor already owns the exclusive `continuation` artifact and its authoring lock, so one lock serializes competing successors without introducing a second authority.

`created_at` of the replacement record is the replacement successor's intent `created_at`, never a fresh clock read. A crash between the resume-source write and the replacement write must reproduce identical bytes on retry, and the immutable store treats identical bytes as a no-op.

The chain is walked, never flattened: `resolveEffectiveContinuation` reads `continuation` and then follows `superseded-<intent>` links, so the binder and the adoption checker cannot disagree about which successor is effective.

`previous_markers` is an array in both resume modes because a chain can carry more than one confirmed remote marker. Only verified, completed authoring sessions of a superseded intent contribute their requested slots, so an unverified session can never widen the accepted marker set.

## Deviations from the approved design

`bindAdoptedResume` receives the verified `ContinuationReplacementBasis` minted by `assertReplaceableStoppedSuccessor`, not a bare successor reference. The design named a reference, but the replacement record must carry the superseded run's terminal evidence; passing the verified basis keeps one derivation site instead of re-reading the same stores under a second, unchecked path.

There is no `issue_author !== 'gpt_pro'` narrowing in the `start_group` guard. `ProgramAuthorizationV1.campaign.issue_author` is validator-pinned to `'gpt_pro'` (`src/core/automation/budget.ts:307,333`), so a non-gpt_pro branch is unreachable and the guard is unconditional by construction. The design's "non-gpt_pro campaign unaffected" test was dropped for the same reason.

`campaign prepare-resume` takes explicit `--source-group-number`, `--superseded-group-number` and `--target-revision`. Issue batch intents are keyed by campaign id and group number, and the successor campaign whose target revision the source publication must be an ancestor of does not exist yet at preflight time; deriving either locally would be a second authority.

The `previous_markers` chain is built idempotently: a retry after an interrupted replacement already finds its own link in the chain, so the requested successor is prepended only when the chain does not carry it. The first implementation double-counted it, which changed the prompt, the intent digest and therefore the campaign id's immutable intent on retry.

No ESM import cycle appeared, so the design's fallback module split was not needed.

> **Substantive Change SHA256**: `sha256:fca6d0dbf8c38f86fa3c133f72360a47b5f47a1e3bb86b0c5064adaeb8fb4534`
