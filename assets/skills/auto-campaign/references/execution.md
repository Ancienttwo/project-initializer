# Execution reference

Run commands in the target repository. Read each command's `--help` from the
selected `repo-harness` runtime before using it. Missing commands or authorities
are blockers, not reasons to substitute a different controller.

## Preflight and draft inputs

Read `.ai/harness/policy.json` at the exact target Git revision, including
`development_campaign` and `external_sources`. The campaign must permit active
execution and every bound in standard.json; the GitHub selector must support
the complete campaign Issue snapshot. Verify the configured browser binding
with `repo-harness chatgpt browser-doctor`, mandatory prompt scanner, worker
execution capability and the user's allowed execution environment. Do not use
`campaign author`, `adopt --dry-run`, or `observe-revision` as readiness probes:
they can persist intent or consume provider budget. Shadow/off is not active.

Prepare one input JSON object with exactly these fields:

| Fields | Authority |
| --- | --- |
| `repository_id`, `work_graph_revision` | Registered repository's canonical graph, read with `repo-harness sprint graph --sprint <path> --format json`; require the graph at the authorized target. Never hash a label to fabricate a graph revision. |
| `allowed_work_package_ids` | Explicitly authorized IDs from that graph/scope. Do not authorize unrelated existing work. |
| `target_ref`, `target_revision` | Authorized full ref and its resolved Git commit; read back the remote target before grant creation. |
| `authorization_id`, `campaign_id` | New unique identities for this explicitly requested turn, recorded with the draft; never replace existing identities on resume. |
| `issued_by` | Actual authorizing operator identity from the session or supplied authorization. |
| `issued_at` | Current UTC timestamp at draft preparation; expired drafts require renewed explicit authorization, not silent refresh. |
| `local_parent_host` | Actual current host, `codex` or `claude`. |
| `chrome_profile_directory` | Exact verified profile from the saved browser binding. |

If the canonical graph, committed sprint/publication policy, operator identity,
or any other prerequisite is unavailable, report the missing prerequisite.
Do not borrow hashes/IDs from examples or create placeholder authority.

Run `bun <installed-skill>/scripts/prepare-grant.ts <input.json>` and capture
stdout as the draft. The helper resolves the selected CLI package through
`repo-harness docs path harness-overview`, then uses that runtime's
`sealProgramAuthorization` and `canonicalAutomationJson`. It validates shape
and seals bytes; it does not attest input provenance or grant permission.
Read standard.json and the complete resulting draft back to the operator in
plain language. Reuse approval already covering that exact scope and budget.
Otherwise obtain approval before the following mutating steps.

## New campaign progression

1. `repo-harness automation grant mint --repo <repo> --from <draft.json>`.
   Keep the returned digest and immutable stored path.
2. `repo-harness campaign start --repo <repo> --authorization-sha256 <digest>
   --idempotency-key <stable-key>`. Read the returned current state.
3. `repo-harness campaign transition --repo <repo> --request <request.json>`
   with operation `prepare_group`. The exact request contains `campaign_id`,
   `expected_current_sha256` from the current state, `idempotency_key`,
   `operation`, `evidence_refs` and `observed_at`. Let the runtime reject stale
   state. Never advance lifecycle merely to bypass a missing prerequisite.
4. `repo-harness campaign author --repo <repo> --campaign-id <id>
   --group-number <group> --gitleaks-bin <verified-path>`. Retain the emitted
   intent/session identifiers. `campaign step` takes the same campaign/group,
   `--intent-sha256` and a stable `--idempotency-key`; consume its typed result.
5. When authoring is actually ready, `campaign adopt` requires those identities
   plus exact-main `--sprint-path`, `--publication-policy` and `--gitleaks-bin`.
   Consume the canonical adopted tasks; do not write substitute Tasks/WorkGraph.
   Subsequent `campaign step` planning uses the owning `--host`, `--session-id`
   and, when required, the real `--planning-result` and issued Engineer
   `--authorization-id` (distinct from the program grant).
6. Follow returned planning/acquisition and worker contracts through the
   existing runtime. `campaign closeout` consumes the stored worker selector
   via `--request`, owning `--host` and `--session-id`; it does not accept an
   invented receipt. Stop as soon as a PR awaits manual merge. For a later
   explicit continuation, `campaign audit` requires the exact campaign/group,
   intent, fresh attempt key and scanner. Fresh-main evidence and runtime
   transition guards determine acceptance/completion, not the skill.

These are state-dependent steps, not a shell loop. Read status and budget
between effects; never blindly rerun the sequence after a timeout.

## Resume, stop and reporting

Use `campaign status --repo <repo> --campaign-id <id>`, the original stored
grant (`automation grant list --repo <repo>` lists it), and `automation budget
show --repo <repo> --run <automation-run-id>` with the runtime's recorded run
identity. Inspect the existing intent, owner/Lease and unsettled reservations.
Replay the same logical operation with its recorded idempotency key only when
the runtime allows it; distinct operations need distinct recorded keys.

A stopped or expired campaign is not an ordinary resume. `prepare-resume` can
prepare a successor and therefore falls outside this skill's same-grant
continuation. Stop for a new authorization decision. No automatic successor,
grant renewal, increased cap, extra group, merge, or detached continuation.

Report the first stop boundary defined in SKILL.md with authoritative evidence.
Do not mark accepted when fresh audit/receipt evidence is absent. Unresolved
external outcomes retain their fences and require the existing reconciliation
protocol. Save only recovery pointers in the existing handoff surface.
