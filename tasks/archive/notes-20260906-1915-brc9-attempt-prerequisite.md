> **Archived**: 2026-09-06 19:15
> **Related Plan**: plans/archive/plan-20260906-1743-brc9-attempt-prerequisite.md
> **Outcome**: Completed
> **Lifecycle**: notes
> **Parent Run ID**: run-20260906-1915
> **Archive Projection V1**: `plans/plan-20260906-1743-brc9-attempt-prerequisite.md` => `plans/archive/plan-20260906-1743-brc9-attempt-prerequisite.md`
> **Archive Projection V1**: `tasks/notes/20260906-1743-brc9-attempt-prerequisite.notes.md` => `tasks/archive/notes-20260906-1915-brc9-attempt-prerequisite.md`
> **Archive Projection V1**: `tasks/contracts/20260906-1743-brc9-attempt-prerequisite.contract.md` => `tasks/archive/contract-20260906-1915-brc9-attempt-prerequisite.md`
> **Archive Projection V1**: `tasks/reviews/20260906-1743-brc9-attempt-prerequisite.review.md` => `tasks/archive/review-20260906-1915-brc9-attempt-prerequisite.md`

# Implementation Notes: brc9-attempt-prerequisite

> **Status**: Active
> **Plan**: plans/archive/plan-20260906-1743-brc9-attempt-prerequisite.md
> **Contract**: tasks/archive/contract-20260906-1915-brc9-attempt-prerequisite.md
> **Review**: tasks/archive/review-20260906-1915-brc9-attempt-prerequisite.md
> **Last Updated**: 2026-09-06 17:43
> **Lifecycle**: notes

## Design Decisions

The existing attempt store owns write-time admission. Reuse observeRetryEligibility under its existing work-package lock and retain identity replay before new-attempt admission. The canonical retry policy remains WorkPackageRetryPolicyV1; this slice does not invent a campaign policy or pre-adoption Task identity.

The shared outcome tuple belongs in the core attempt module. Scheduling imports it at runtime while the attempt module imports scheduling types only, preserving the runtime dependency direction.

## Integration Constraints

The generic controller reserves budget before attempt start. A refused new attempt prevents dispatch; any reserved budget remains subject to the existing reconciliation rule. This slice does not add compensating budget events or change controller lifecycle semantics.

BRC9 remains pending until the remaining #282 campaign limits and pre-adoption identity contract are available. This independently verifiable #287 prerequisite does not complete the sprint row.

## Evidence

- Pre-fix regression: /tmp/brc9-attempt-before.txt, 4 pass / 11 fail, PRE_FIX_EXIT=1. Terminal/backoff mutation, malformed policy and outcome boundary guards fail on the original implementation.
- No production edit was made before collecting that regression evidence.
- Development verification: 16/16 attempt regressions; 21/21 controller/acquire-next tests; typecheck pass. Logs: /tmp/brc9-attempt-after.txt and /tmp/brc9-attempt-consumers.txt.
- Canonical Verification Plan validates through the installed helper. The JSON block immediately follows its heading, as required by the current parser.

## Open Questions

- None within this slice. Campaign step/provider reservation composition remains a later prerequisite design boundary.

## Acceptance and integration boundary

Canonical prepare run-20260906T175639-10979 passed 24/24. The official codex-plugin review approved subject sha256:31ed7b64f7c8a506a901c1659c7e53b72c18a84d8efcc941a9799a9141115e95 against 879c9bfd with zero findings. A typed external_pass AcceptanceReceipt is recorded; final verify-sprint consumed it without rerunning verification. Native specialist attempts failed before review and were not counted as passes.

Publication remains pending because main CI 34025058232 is red after the verification lifecycle cutover. The user approved leaving those fixes to the original owner; the concrete handoff was delivered to pane %20. BRC9 production changes remain exclusively in this worktree. No full-suite rerun or new CI run was started here.


## Updated target integration

The original owner published the verification cutover repairs as 322d7cde. Integration into this worktree changed none of the three production files, the attempt regression file or the research note from the official f8812317 review. The only conflict was the generated architecture manifest; ordinary index/apply regenerated it. Its semantic state and target output digests remain unchanged; provenance/digest fields bind the new tree.

New-target prepare run-20260906T182709-55475 passed 24/24. The owner's explicit approval of integration closeout is recorded as a typed user_waiver receipt for the new subject sha256:764956670f99a9f2093ea5a224fcc26a2eb6282ac837dfa1ea363e0bb336b1b6. The original external_pass remains historical evidence for its original subject, not a new provider review. Final verify-sprint consumed the new receipt without rerunning verification. CI run 34027338609 on the repaired target is still the outstanding publication condition.


## Final target readiness

The repaired main target is 4c6e59784cb5ae0b2c46e387586cc1630e37a030. GitHub CI run 34028703586 completed success for Test, all three MCP matrix jobs and Required / CI. The actual 322d7cde..4c6e5978 delta is confined to two Human Review Card fixtures in tests/helper-scripts.test.ts and the verification research note. Production package bytes did not change.

After integrating this target, git diff against f8812317 confirms no change to the three attempt production files, their regression test or the BRC9 research note. Ordinary architecture projection applied with no human actions or refresh signals. Old external review and prepare runs retain their original subjects; fresh exact-target preparation and the existing owner grant provide the final integration binding. No duplicate full suite is required or run.

## Publication diff binding

Canonical finish published dbce6cc2f7c559ea6f5446bc35dea3cb39bed98d onto 4c6e59784cb5ae0b2c46e387586cc1630e37a030. CI run 34029781788 passed all three MCP matrix jobs but stopped at task-sync before the test suite: the archived workflow artifacts lacked the publication diff identity. The same direct-base check reproduced the refusal locally. This annotation binds that exact substantive diff; it does not change production bytes or reassign any review, prepare run, or AcceptanceReceipt to a different subject.

> **Substantive Change SHA256**: `sha256:29a0c5c4757046fdbc7917a284f4a0a3119563a777b58ce0e6ae53c32d5b7274`
