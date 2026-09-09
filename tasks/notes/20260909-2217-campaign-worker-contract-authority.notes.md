# Implementation Notes: campaign-worker-contract-authority

> **Status**: Active
> **Plan**: plans/plan-20260909-2217-campaign-worker-contract-authority.md
> **Contract**: tasks/contracts/20260909-2217-campaign-worker-contract-authority.contract.md
> **Review**: tasks/reviews/20260909-2217-campaign-worker-contract-authority.review.md
> **Last Updated**: 2026-09-09 22:17
> **Lifecycle**: notes

## Design Decisions

- Preserve every existing contract byte-for-byte, including incomplete templates. Re-rendering partially authored contracts would require inferring ownership from prose; the canonical brief preflight already rejects incomplete input.

## Deviations From Plan Or Spec

- The handoff suggested detecting templates. The smaller invariant initializes only missing contracts; no second placeholder parser and no contract mutation occurs on projection replay.

## Tradeoffs Considered

| Option | Decision | Reason |
|--------|----------|--------|
| Re-render detected templates | Rejected | Partially authored content cannot safely be inferred from placeholder matches. |
| Preserve existing contracts | Selected | Keeps the admitted proof valid and leaves validation to preflight. |

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

> **Substantive Change SHA256**: `sha256:9e4ca2a7fa496fcabf16cac6c152913619808ec6fcf6670bca38bf5d9722d179`

## Proof authority cutover

The existing canary handoff already contains the erroneous digest. New handoffs remove the duplicate field, and bind/launch consume only the admitted envelope proof. Old records stay immutable; obsolete extra data is not read as authority. Existing launch request mismatch and all admission/lease checks remain fail-closed. This is a single authoring and reading authority cutover, with no repair verb or compatibility fallback.
