# Canonical acceptance disposition in campaign falsification closeout

AcceptanceReceipt owns the disposition vocabulary: `external_pass`, `user_waiver`, and `reject`. The campaign CLI verifies the typed receipt through the trusted helper and passes its JSON unchanged. The not-planned consumer must accept `external_pass` and `user_waiver`; `pass` belongs to other status vocabularies and is not an alias for an acceptance disposition.

The earlier model-free positive fixture injected `pass`, masking a consumer/helper mismatch. Its corrected `external_pass` case fails against the original consumer before provider activity. Invalid `pass` and `reject` cases must retain a zero provider-call count. Evidence paths, committed bytes, subject binding, parent identity and non-executing planning checks remain unchanged.

This repair is the one directly blocking scope exception during the BRC14/BRC15 continuation. It does not waive a review, synthesize receipts, alter a campaign grant, or change successor eligibility.
