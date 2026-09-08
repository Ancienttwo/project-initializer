# Adopted continuation decisions

P1/P2: old campaign definition, authorization, intent, publication, planning jobs and acquisitions are exact-bound. Rebinding any old entity would invalidate those records. Existing resume-from already carries exact provider Issue identities and instructs a new provider session to re-audit them. Publication generates successor task IDs without replacing predecessor manifests; old stopped planning remains refused.

P3: retain that pipeline and add a stopped, published, zero-successful-acquisition predecessor branch. Require no open reservations and no active controller step. Rebuild source adoption with its real builder, require its publication to be an unchanged ancestor of the new target, and compare every requested slot/ID/URL to that receipt.

The new campaign-authoring-resume.ts protects the cross-module invariant for initial authoring, follow-up editing and adoption/replay. No package dependency or new CLI is added. A successor resume-source record stores lineage/identities; the predecessor continuation record stores only the exact winning successor. The existing immutable artifact store serializes this ownership before provider dispatch. A crash may leave a non-dispatched successor intent, but cannot authorize two successors or rewrite old evidence. Unknown requests retain their original key; no automatic takeover/reset.

Resumed follow-ups allow only edit_issue for the corresponding original identity; fill_missing must not create replacements. Actual adoption validates output IDs regardless of the model prompt. Unfilled results remain governed by existing adoption semantics; an empty delivery still cannot satisfy BRC15.

Verification stays at the affected authoring/adoption boundary plus required integrity checks and required remote CI. Oracle, Docker, worker/verifier, cleanup and fresh-audit implementations are unchanged. Live call authorization and a frozen target are separate from model-free test success.

Development regression:47 pass,0 fail across continuation, existing authoring and adoption; typecheck passes.

> **Substantive Change SHA256**: `sha256:877511f3194bda9ffba05f538d2b96e4dbb69fbd5d896332df6a0a0d43d783d0`
