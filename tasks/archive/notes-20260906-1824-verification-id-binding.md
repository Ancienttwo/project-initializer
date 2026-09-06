> **Archived**: 2026-09-06 18:24
> **Related Plan**: plans/archive/plan-20260906-1746-verification-id-binding.md
> **Outcome**: Completed
> **Lifecycle**: notes
> **Parent Run ID**: run-20260906-1824
> **Archive Projection V1**: `plans/plan-20260906-1746-verification-id-binding.md` => `plans/archive/plan-20260906-1746-verification-id-binding.md`
> **Archive Projection V1**: `tasks/notes/20260906-1746-verification-id-binding.notes.md` => `tasks/archive/notes-20260906-1824-verification-id-binding.md`
> **Archive Projection V1**: `tasks/contracts/20260906-1746-verification-id-binding.contract.md` => `tasks/archive/contract-20260906-1824-verification-id-binding.md`
> **Archive Projection V1**: `tasks/reviews/20260906-1746-verification-id-binding.review.md` => `tasks/archive/review-20260906-1824-verification-id-binding.md`

# Implementation Notes: verification-id-binding

> **Status**: Active
> **Plan**: plans/archive/plan-20260906-1746-verification-id-binding.md
> **Contract**: tasks/archive/contract-20260906-1824-verification-id-binding.md
> **Review**: tasks/archive/review-20260906-1824-verification-id-binding.md
> **Last Updated**: 2026-09-06 17:46
> **Lifecycle**: notes

> **Substantive Change SHA256**: `sha256:2ed664cdb988a3bb531fdf8cbae3ccb4197f2213cc06ea7d0cd1931ec69d9a5c`

## Design Decisions

- Observed installed counter reproduction: valid long ID executes twice with identical cache key; ledger display ID is redacted. Raw immutable execution records retain the original ID. Existing fingerprints are the control authority.

## Deviations From Plan Or Spec

- Required CI exposed omitted Verification Plan producers and static consumers from the initial cutover. The parent widened this correction to those proven failures before editing, preserving strict runtime validation.

## Tradeoffs Considered

| Option | Decision | Reason |
|--------|----------|--------|
| Preserve display ID as control key | Rejected | Ledger redaction changes it; executable fingerprints already bind the operation. |
| Relax parser to accept current template prose | Rejected | Correcting the canonical producer preserves the existing strict authoring contract. |
| Restore legacy grader output | Rejected | It would revive the retired executable authority; command graders instead emit the canonical plan. |

## Open Questions

- None.

## Evidence Links

- Checks: `.ai/harness/checks/latest.json`
- Run snapshots: `.ai/harness/runs/`

## Promotion Filter

Promote a candidate to `tasks/lessons.md`, `docs/researches/`, or harness asset files only when all three hold: hard to reverse, surprising without local context, and a real trade-off existed. If any one is missing, keep it in this notes file instead.

## Promotion Candidates

- Promote to `tasks/lessons.md` only after a repeated correction or failure pattern.
- Promote to `docs/researches/` only when it is durable repo knowledge with evidence.
- Promote to harness asset files only after verification across more than one task or fixture.

## Frozen scope decision

- This is the directly blocking correction of the approved expensive-dedup goal, discovered during installed readback; it does not expand into a global redactor or schema redesign.
- Original main publication `879c9bfd` and CI run `34025058232` remain evidence for that original subject. No original full/local helper baseline is relabeled as proof of this correction.
- Same-key latest failure or invalid immutable evidence supersedes prior success even when a display ID differs. A renamed expensive check requires an explicit plan decision; it cannot become an unseen first run.

## CI failure classification

- `run --help`: two declared helpers absent from grouping; added both, with the explicit line budget increased by their two lines.
- Canonical template: guidance interrupted the required adjacent JSON block; moved guidance after the block and added real source/installed template parsing red-green. This also fixes Human Review Card fixtures.
- Campaign/fleet/continuation: fixture contracts or installed canonical template absent after old authoring path retirement.
- Skill grader: producer still emitted legacy executable lists; migrate commands once into explicit Verification Plan while retaining file criteria.
- Hooks: static assertions referenced the retired executable gate instead of the current receipt/evaluate readers.
- C1 inventory: adjudicate Verification Plan as Verification-plane (fails C-1, satisfies C-2), without changing frozen delivery identities.

## Frozen implementation coverage

- All CI omissions are within the original Verification Plan cutover. No BRC9 production files changed.
- Eval grading excludes its runtime evidence cache from the disposable repository snapshot and invokes read-only contract status handling; these outputs cannot invalidate the command input snapshot.
- Development evidence: identity effect 30 pass; real acquisition/continuation 31 pass; CLI 17 pass; template/schema 5 pass; authority inventory 19 pass; hook/grader 43 pass; Human Review Card 2 pass. Final acceptance below is recorded separately by the canonical prepare.
- No new dependency, persistent compatibility path, or schema relaxation was introduced.
