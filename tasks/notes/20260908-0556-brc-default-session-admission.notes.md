# Implementation Notes: brc-default-session-admission

> **Status**: Active
> **Plan**: plans/plan-20260908-0556-brc-default-session-admission.md
> **Contract**: tasks/contracts/20260908-0556-brc-default-session-admission.contract.md
> **Review**: tasks/reviews/20260908-0556-brc-default-session-admission.review.md
> **Last Updated**: 2026-09-08 05:56
> **Lifecycle**: notes

## Design Decisions

- ...

## Deviations From Plan Or Spec

- None recorded.

## Tradeoffs Considered

| Option | Decision | Reason |
|--------|----------|--------|
| ... | ... | ... |

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

## Owner priority change — 2026-09-08

The Owner required the original BRC15a Acceptance mapping and per-Issue offline metadata diagnosis before continuing activation prerequisites. Implementation is paused here, with WIP preserved and no main merge. The initial default-model regression was captured red then passed the first predicate change; this is development evidence only.

Research identified that a renamed boolean is insufficient: persist structured provider/local/parent session evidence, bump the authoring session protocol and reject old model-only inputs. The partial WIP starts that cutover but has not completed challenge/adoption consumers or fixture updates. It is not typechecked or accepted after the protocol edits and must not be shipped. Include exact profileDir binding and source provider-parent identity when resumed.

The independent metadata/evidence work continues in `codex/brc15a-offline-evidence`, rooted at `700fe3b0`, and must be integrated without absorbing this partial implementation. BRC6a remains Owner-closed; no additional GPT call, budget mint or active campaign has occurred.

## Resume after the required metadata diagnosis

The Owner-requested offline replay and original budget mapping completed in f3fbdd3e and was integrated before resuming this safety prerequisite. No active launch is authorized by the observation closeout.

Session admission uses structured evidence, not a renamed boolean. Protocol 2 rejects old model-only authoring sessions and old challenge inputs; the verification field is only a checked projection of evidence. Exact profile root and source provider-parent binding are required.

The post-repair source-drift fixture now supplies a verified edit session while retaining an invalid Issue body. Otherwise its deliberately unverified parent prevents the next fill from acquiring session evidence and the no-progress budget stops before the intended drift assertion. Separate missing-evidence and unverified-edit tests retain those refusal paths; production budget and drift gates were not changed.

> **Substantive Change SHA256**: `sha256:93f472abee467294531c976378e5dc3f6d1a9074c1e91f19d2bf26a71153d769`
