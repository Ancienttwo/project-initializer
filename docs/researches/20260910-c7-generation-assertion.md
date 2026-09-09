# C7 generation assertion scope

The C7 CLI regression verifies that a shape-valid but unproven execution context does not reach public read surfaces. Claim IDs, task identities and receipt digests remain excluded from serialized payloads, and handoff execution_context remains null.

Lease generation is numeric. Searching its decimal spelling as a substring of the whole JSON response can match unrelated content. CI34376981934 on b75ba6fd failed because generation4242 occurred inside the legitimate signal digest `sha256:47c4013424684242727e9cceed3e35b00b2dee3363371b722f46fcd64ecb11e6`; the execution_context was null. No collaboration or campaign runtime behavior changed in the correction.

The test now traverses parsed response values and rejects the exact numeric generation or its exact string representation, including nested arrays and records. Long forged identity/digest exclusions and the existing withheld-context assertions remain intact. Deterministic tests admit the captured legitimate digest and reject nested forged generation values; the old assertion fails the collision test in `tasks/evidence/c7-generation-assertion-pre-fix.log`.
