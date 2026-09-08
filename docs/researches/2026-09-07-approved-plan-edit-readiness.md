# Approved plan edit readiness

The AiphaBee Terminal quote task exposed a Standard edit deadlock: `projectEffectiveState` satisfied `complete_approved_work_package` only when `firstOpenTask` returned null. The same fact gated editing and shipping, so approved implementation could not begin. Missing plan content also returned null and incorrectly satisfied the requirement.

The projector now emits an explicit approved-plan fact from the existing plan path, nonempty content and approved/executing status. The readiness evaluator uses that fact only for editing. Shipping continues to require the completed-work fact and fresh subject-bound evidence. This does not introduce a second plan parser or change the frozen requirement matrix; approval status remains the existing planning authority, not a new claim that arbitrary Markdown is structurally complete.

Regression evidence: the new open-task edit and missing-content tests both failed against the original implementation. The corrected projector passes them. A fresh-evidence test separately proves that open tasks block shipping and completed tasks permit it. Existing policy and readiness characterization fixtures remain unchanged.

Scope: source projector, pure readiness evaluator and their tests. No changes to strict worktree, review, entitlement, or deployment policy. The only satisfaction producer for this key was the projector; the continuation envelope's similarly named reason describes completion and remains unchanged.
