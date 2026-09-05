> **Archived**: 2026-09-06 04:23
> **Related Plan**: plans/archive/plan-20260906-0305-persistent-claude-review.md
> **Outcome**: Completed
> **Lifecycle**: notes
> **Parent Run ID**: run-20260906-0423
> **Archive Projection V1**: `plans/plan-20260906-0305-persistent-claude-review.md` => `plans/archive/plan-20260906-0305-persistent-claude-review.md`
> **Archive Projection V1**: `tasks/notes/20260906-0305-persistent-claude-review.notes.md` => `tasks/archive/notes-20260906-0423-persistent-claude-review.md`
> **Archive Projection V1**: `tasks/contracts/20260906-0305-persistent-claude-review.contract.md` => `tasks/archive/contract-20260906-0423-persistent-claude-review.md`
> **Archive Projection V1**: `tasks/reviews/20260906-0305-persistent-claude-review.review.md` => `tasks/archive/review-20260906-0423-persistent-claude-review.md`

# Persistent Claude review implementation decisions

The user approved production integration after the live protocol proof. The new `claude-review` command owns acceptance sessions; advisory `cross-review` stays one-shot. Initial session creation consumes semantic-review admission, while up to three repair rounds reuse that exact session. The contract uses the existing Claude policy to exercise the independent provider at final acceptance. No full suite is required: named lifecycle, acceptance and readiness tests cover the changed boundaries.

Production-path live fixture passed: real verifier evidence, same PID/session FAIL then PASS, final receipt consumption, EOF exit and sentinel preservation. Evidence is under `.ai/harness/runs/claude-review-production-fixture/`; durable findings are promoted into the research document. No external model fixture verdict is being used to approve this implementation diff.

Final schema validation also refuses array-to-string enum coercion. The live fixture remains transport/lifecycle baseline; its normal string-valued raw results remain subject to the stricter current validator.

> **Substantive Change SHA256**: `sha256:dd1d7e83476051beeeeafb2c29e92ccca01cd0eeb0eba4f44b21d64d503992df`


## Publication boundary

The implementation passed independent Claude acceptance and final verify-sprint
against target revision `29b3fd12a02c4ad3d50790bde818a01b719daaea`.
The reviewer exited on stdin EOF after acceptance. Before publication, the
parallel BRC7 work package advanced local main to
`58401d7da5f59fef597db48e21e6ffa62a96504b`. The original receipt must not be
relabeled as acceptance for that new target. No new reviewer was started.
The user explicitly approved one successor acceptance session on the new base.
The closed session and circuit admission are preserved under
`.ai/harness/runs/persistent-review-successor-authorization/`; this explicit
operator reset reopens only this task admission and adds no automatic recovery.

Read-only merge-tree reports conflicts only in the generated
`docs/architecture/.projection-manifest.json` and `tasks/current.md`; regenerate
these projections during integration. This is a syntactic merge observation,
not semantic acceptance of the integrated candidate. Original run snapshots,
provider requests/results, closed-session evidence and the live two-round fixture
are preserved in the main checkout's ignored
`.ai/harness/runs/persistent-claude-review-closeout/` cache.

Successor acceptance passed on target `58401d7da5f59fef597db48e21e6ffa62a96504b`,
subject `sha256:a00fabf1e20b2a5906515fe550ff59dc9898f0dc6716b16eeb9fc78269f9bdd8`,
session `4342318b-c96e-4ef9-8d94-5d2dc3376054`, child PID 29666.
Prepared run `run-20260906T041811-11014-20260906-0305-persistent-claude-review`
passed all 11 criteria; final verify-sprint consumed the receipt without reruns.
All six repository integrity checks passed; init dry-run planned zero operations.
The provider retained F-001/P2 and F-002/F-003/P3, plus F-004/P3 for the
fixed model alias; these remain non-blocking and recorded in the review.
No new code changes were made after this acceptance.
