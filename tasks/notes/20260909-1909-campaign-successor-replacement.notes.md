# Replacement authority

The replacement record lives on the predecessor group, not the superseded successor: the predecessor already owns the exclusive `continuation` artifact and its authoring lock, so one lock serializes competing successors without introducing a second authority.

`created_at` of the replacement record is the replacement successor's intent `created_at`, never a fresh clock read. A crash between the resume-source write and the replacement write must reproduce identical bytes on retry, and the immutable store treats identical bytes as a no-op.

The chain is walked, never flattened: `resolveEffectiveContinuation` reads `continuation` and then follows `superseded-<intent>` links, so the binder and the adoption checker cannot disagree about which successor is effective.

`previous_markers` is an array in both resume modes because a chain can carry more than one confirmed remote marker. Only verified, completed authoring sessions of a superseded intent contribute their requested slots, so an unverified session can never widen the accepted marker set.
