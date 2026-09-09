# Implementation Notes: projection-late-write-receipt

> **Status**: Active
> **Plan**: plans/plan-20260909-2248-projection-late-write-receipt.md
> **Contract**: tasks/contracts/20260909-2248-projection-late-write-receipt.contract.md
> **Review**: tasks/reviews/20260909-2248-projection-late-write-receipt.review.md
> **Last Updated**: 2026-09-09 22:48
> **Lifecycle**: notes
> **Substantive Change SHA256**: `sha256:5faedad7b2318984bc16078b4dccf8dc49bb9fcba5a6382d07b4214835eab787`

## Design Decisions

- Receipt representation: `result` stays the provider's verbatim answer and the receipt
  gains a derived `declaredWrites`. Merging prior committed applies into `result.files`
  would forge the provider's answer and break `assertProjectionResult(receipt.result)` in
  `restamp-publication.ts`, which re-validates `receiptDigest` over that exact body.
- `projectionDeclaredWrites` in `src/core/architecture/projection.ts` is the only mapping
  from the provider shape to what consumers gate on, so an upstream shape change has one
  consumer edit.
- `unchanged` files are excluded from declared writes: the result contract makes their
  preimage and output digests equal, so they are not writes. This matches what the
  materialization reader already filtered for.
- Ordering: a path claimed by this attempt's own result wins over any earlier apply, and
  among earlier applies the newest `committedAt` wins, because the latest statement about
  a path describes the current state. Output is sorted by path so the projection is
  deterministic regardless of the provider's array order.
- The decoder imposes uniqueness (`applyId`, and path within one apply) but not sort
  order: commit order inside one ChangeSet belongs to the provider, and the declared-write
  projection sorts what consumers read.
- `src/effects/refactor/materialization.ts` fails closed rather than consulting declared
  writes: prior committed applies carry `hash`, not the `outputDigest` that transaction
  verifies bytes against, so it cannot faithfully reproduce them.

## Deferred: capability feature handshake

The upstream capabilities flag `projection-prior-committed-applies-v1` is deliberately not
added to `ARCHCTX_REQUIRED_FEATURES`, and the archctx pin stays at 0.5.8. The field is
optional and absent under 0.5.8, so the receipt correctly declares nothing there (covered
by the guard's third case). Add the required-feature entry and raise the pin in the same
slice that pins the upstream version; requiring the feature before that version exists
would fail every projection closed.

## Deviations From Plan Or Spec

- None recorded.

## Tradeoffs Considered

| Option | Decision | Reason |
|--------|----------|--------|
| Merge prior applies into `result.files` | Rejected | Forges the provider's verbatim answer and breaks the receipt-digest revalidation in restamp publication |
| Receipt-level `declaredWrites` projection | Chosen | Keeps one source of truth with a recomputable projection consumers can gate on |
| Infer the late write from the working tree | Rejected | Projection-owned paths are excluded from every snapshot repo-harness captures, and a local derivation would be a second authority |

## Open Questions

- The upstream `codex/projection-prior-committed-applies` branch is unpublished; this
  consumer is built against the agreed shape. If the landed shape differs, the edit is
  confined to `ProjectionPriorCommittedApplyV1`, its decoder, and `projectionDeclaredWrites`.

## Evidence Links

- Checks: `.ai/harness/checks/latest.json`
- Run snapshots: `.ai/harness/runs/`

## Promotion Filter

Promote a candidate to `tasks/lessons.md`, `docs/researches/`, or harness asset files only when all three hold: hard to reverse, surprising without local context, and a real trade-off existed. If any one is missing, keep it in this notes file instead.

## Promotion Candidates

- Promote to `tasks/lessons.md` only after a repeated correction or failure pattern.
- Promote to `docs/researches/` only when it is durable repo knowledge with evidence.
- Promote to harness asset files only after verification across more than one task or fixture.
