# BRC15a real GPT shadow canary

Status: original failed attempt is stopped and fully charged; Oracle selector fix is verified in an isolated candidate. BRC15a remains pending; no replacement grant has been minted.

The private target is Ancienttwo/repo-harness-brc15a-canary-20260907, seeded from tracked repo-harness 33c5012e1185a695fdaf54a7bb84fc613cfb653b with fresh history and no GitHub workflow automation. Production working-tree changes were excluded. Target initialization commit: 33d692aaa0ab593df0c160082b18fdac02c82e9c. Remote private/main readback passed, initial Issue inventory was empty, and target working tree was clean before mint.

Only the target browser binding uses Profile 13. Grant limits: one group, ten slots, two authoring rounds, 64 provider calls, 16 controller steps and 2700 seconds from issuance. No active task, Claim, worker, repair, PR, merge, Issue closure or release is permitted. Exact-SHA verification remains unverified; action availability and local Git identity are not trusted provider execution proof.

## Evidence to record

Actual grant and campaign identities, ledger/reservation outcomes, authoring session, independent observation counts, dry-run adoption, missing/duplicate/unjudged slots, human intervention, elapsed time, and subsequent user investment decision. A negative observation is retained; no replacement grant or synthetic Issues may conceal it.

## Authorized run

- Grant: `36647fc2e785cc52235e0fcd2eee4a200f1e69827151775f9c5207de696e618c`; issued `2026-09-07T13:09:03.819Z`, expires `2026-09-07T13:54:03.819Z`.
- Campaign: `brc15a-20260907-shadow`; repository `repo_3b81945f21334250`.
- Automation run: `92a3e22794595f6911d7d8a1dd1ba2ba9978c47ffcd32f464a1464aff9a61352`.
- Initial authoring invoked via installed `repo-harness campaign author`, mandatory gitleaks scan and Oracle copy-profile transport. At first observation one provider reservation was open, zero completed calls; this is dispatch evidence only.
- Contract structural check and six declared repository integrity checks passed during setup (11/11); final evidence acceptance remains pending.

## Observed result

The initial provider invocation ran from intent creation at 13:09:37Z to persisted failed browser result at 13:10:28Z, approximately 51 seconds. Oracle 0.18.0 reported `Thinking time: option not found (requested Pro); refusing to submit without confirmed Pro.` The diagnostic showed the current `Thinking effort` menu with `composer-model-picker-slider-simple-view` and visible `Pro, 5 of 5`; Oracle still could not verify the requested selection. Visible text is not grounds to bypass the model verifier.

- Session: `chgpt_20260907_211028_brc15a-20260907-shadow-group-1-issue-authoring`.
- Intent: `sha256:c163340835361b30dac02901e39db96afb7406a695599a669256c30db6c28654`.
- Session receipt: `sha256:eba15c2a08884e512bdf30b6ec53d3d9204ee0e6e484446134f9779d750d0ad1`.
- Browser status failed, model verified false, reattachable false. Mandatory gitleaks 8.30.1 scan passed.
- One initial authoring invocation attempted; zero successful authoring rounds. Prompt was refused before submission, so no Issue authoring was executed by this invocation. Ten slots remain unjudged; duplicate and quality rates are not measurable. Initial GitHub inventory was zero; no post-run Issue observation succeeded through the campaign observer, so no independent final inventory claim is made.
- `campaign adopt --dry-run` refused with `issue_adoption_reconciliation_required: completed initial authoring session is required`. No Task/Claim/WorkGraph publication or worker was reached.
- Budget projection retains one open provider reservation: provider_calls consumed 0, reserved 1; event_count 0. This is not a free or successful call. Current authoring code appends usage only for completed results; failed browser output is insufficient for us to invent a terminal charge or release the reservation.
- Canonical transition `require_reconciliation` was applied using the exact current digest and failed session digest. No follow-up, second grant, local Issue creation, repair, Issue close, PR, merge or release was attempted.

## Interpretation and remaining boundary

This run proves that the current installed Oracle model verifier cannot execute the approved authoring path on the observed UI. It does not measure GPT Issue quality, Connector write access to this target, exact-SHA authority, or canary business value. Browser transport readiness is the immediate prerequisite. The independent BRC6a trusted revision producer and BRC14 audit/acceptance producers remain pending.

The next bounded slice is Oracle model/effort verification against the actual new slider UI, with a deterministic pre-submit regression and terminal-result reconciliation evidence. Do not bypass Pro verification or retry this reserved invocation. User investment decision remains unrecorded; this document cannot close BRC15a or authorize another grant.

## Recovery after user instruction to continue

P1: the failure belongs to external Oracle `src/browser/actions/thinkingTime.ts`, not repo-harness campaign authoring semantics. The installed file was byte-identical to the build of npm 0.18.0 source commit `083bba7e61f487ad3d99b42039d9f603f61dc4ff`. The UI has an active simple power panel, a Power keyboard control, a hidden numeric slider and an `aria-describedby` announcement, rather than the expected effort submenu. Initial raw `.click()` probes did not open the Radix menu; replaying the actual Oracle selector without prompt submission reproduced the original failure and captured the owning controls.

P2: explicit Pro -> ensureThinkingTime -> no matching flat row -> no Effort submenu -> option-not-found -> pre-submit failure. The new selector reads the active panel's unique control, checks its numeric range and linked `Pro, 5 of 5.` announcement together, and verifies each ArrowRight transition. It rejects contradictory/missing evidence, disabled controls, locked slider ancestors and duplicate active panels. Model-list text cannot satisfy this check.

P3: keep this adapter fix in the Oracle producer, without changing campaign prompts, model verification requirements or global installation. The supported environment override selects this exact isolated candidate for a subsequent authorized run. This patch handles the observed English five-position Pro control; unfamiliar labels/shapes still refuse. At larger volume it adds no per-run persistent authority or unbounded polling.

- Oracle candidate worktree: `/Users/ancienttwo/Projects/oracle-wt-brc15a-pro-slider`, commits `749cab6a` and final `26e12021` on `codex/brc15a-pro-slider`.
- Fix scope: `src/browser/actions/thinkingTime.ts`, its existing regression suite and CHANGELOG. No new dependency.
- Red: six newly added power-control cases failed on unfixed source. Green: 150 tests across thinkingTime and both modelSelection suites; full TypeScript check, build, focused lint and formatting passed.
- Real browser checks used Profile 13 copies and only the selector: preselected Pro verified; then numeric value 3 was established with ArrowLeft and the patched selector verified transition to Pro. Neither probe submitted a prompt. Those two live probes cover 749cab6a; the subsequent bounded disabled-ancestor guard in 26e12021 is covered by its focused regression and is not claimed as a repeated live probe. Temporary copied profiles were closed and removed by the probe's own finally handler.
- Existing `browser-doctor` resolves the candidate via `REPO_HARNESS_ORACLE_BIN=/Users/ancienttwo/Projects/oracle-wt-brc15a-pro-slider/dist/bin/oracle-cli.js` and reports required capabilities ready. This doctor result is capability evidence only; the separate selector probes supply live UI evidence.

### Exact reservation reconciliation

The provider invocation did run. Its failed session was passed to the existing `reconcileAutomationReservation` API with `reconciled_reserved` and `provider_failure`, binding the exact session digest and charging the full reserved upper bound. No zero-usage or GPT-completion claim was made. Current ledger: provider_calls consumed 1 / reserved 0; provider_failures consumed 1 / reserved 0; open reservations 0; event count 1; ledger digest `af574fc60194143188f313f913a09ac133594df7c2cba2a58b66d5e5f174b1ad`. The campaign was then canonically stopped against its exact current digest. Original failed session and charge remain immutable.

### Proposed next run; not authorized or minted

Reuse the same private target and exact head, Profile 13 and pinned candidate. New identities: campaign `brc15a-20260907-pro-slider`, authorization `brc15a-20260907-pro-slider-grant`. Request only the remaining one authoring round, at most 63 provider calls and one provider failure; keep one group / ten slots / 16 controller steps / shadow only, with a fresh 45-minute expiry from mint. All other grant bounds and prohibitions remain as originally approved. This preserves the original cumulative two-invocation authoring ceiling and 64-call ceiling. No follow-up authoring after this remaining round. The original plan explicitly disallows an automatic second grant, so this proposed mint needs a new user authorization. Successful selector probes cannot replace real GPT authoring or the eventual user investment decision.
