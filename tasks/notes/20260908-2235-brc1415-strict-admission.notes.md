# Implementation Notes: brc1415-strict-admission

> **Status**: Active
> **Plan**: plans/plan-20260908-2235-brc1415-strict-admission.md
> **Contract**: tasks/contracts/20260908-2235-brc1415-strict-admission.contract.md
> **Review**: tasks/reviews/20260908-2235-brc1415-strict-admission.review.md
> **Last Updated**: 2026-09-08 22:35
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

## Admission boundary decision

The current main baseline passed 63 tests. The prepared guard-only change passed 25 tests before adding the adoption consumer assertion. That added assertion exposed the fixture's intentionally unverified authoring session before browser binding, not a production regression. The final assertion preserves that independent refusal and proves zero external calls and unchanged ledger/Git after strict admission succeeds. Real authoring/worker acceptance remains pending a new disposable target and budget.

Final local prepare passed all 14 checks/assertions, including revised 25-case regression, typecheck, runtime source equality and six integrity checks. The first architecture entry only generated missing worktree output and stopped before tests; retry passed. Evidence binding requires committing the newly created contract. Live target/budget authorization and explicit activation-boundary resolution remain pending.

## Authorized AiphaBee execution

Owner delegated target/budget selection and named AiphaBee. Use independent clone of chenrenya/aip-main-open, refs/heads/codex/brc1415-canary; preserve production main and other task worktrees. Shadow observation receives at most two provider calls; only a successful observation permits a new active grant with the remaining thirty-eight and the same overall ninety-minute deadline. Active authoring uses at most two rounds, two Issues and parallel limit two. Manual merge remains an Owner checkpoint. No default model override.

Single directly blocking fix: campaign capability resolution ignored the selected registry authority. tests/effects/campaign-capability-registry.test.ts failed 4/5 before the fix (/tmp/aip-brc-registry-red.log) and passed 5/5 afterward. It now reads only the frozen selected source; existing ArchContext fixtures declare that source explicitly. Five affected suites passed 86 cases in /tmp/aip-brc-registry-affected.log. AiphaBee frozen registry resolves its four actual capabilities. No registry migration or dual read is introduced.

Canonical five-suite run retained 85 passes and one existing 5-second planning fixture timeout, which then observed its disposed repository. The same five suites passed all 86 in development. No production or assertion change is justified: final focused command uses an explicit 60-second per-case timeout, retaining the failed run and allowing one bounded rerun.


## AiphaBee bounded run: pre-submission blocker (2026-09-08 23:11 HKT)

Owner selected AiphaBee and delegated the finite scope. The isolated clone targets chenrenya/aip-main-open refs/heads/codex/brc1415-canary at 0720c399bf157234d04b6940436b196b3ac47607. The allocation is one group, two Issues, two parallel workers, two authoring rounds, manual merge, forty total provider calls and a ninety-minute window ending 2026-09-08T16:34:27.212Z. Only the two-call shadow grant was minted; the conditional thirty-eight-call active grant was not minted.

The source candidate completed fourteen scoped acceptance criteria, including eighty-six affected tests and TypeScript. The final run is .ai/harness/runs/run-20260908T230034-3349-20260908-2235-brc1415-strict-admission.json; its original subject and unchanged Docker evidence remain the only local acceptance claims.

The first shadow observation failed with APP_SELECTION_UNVERIFIED: GitHub: app-not-found. Oracle candidate 14cfbfc6ad6494397e46eac548338ff3e599c21f recorded status:error and browser.runtime.promptSubmitted:false in oracle-home/sessions/perform-a-fresh-read-only/meta.json. No prompt, authored Issue, task worker, active campaign, merge or deployment resulted. The original failed session remains unchanged. A separate no-send Work Chrome inspection showed Chat/Work surfaces and an installed GitHub entry at https://chatgpt.com/plugins; this is UI readiness evidence only, not proof of the copied Oracle profile or repository access. The exact Oracle failure root cause remains unproven.

Production reconcileAutomationReservation settled reservation a77d3838d41755825e31979ad0d5b5de2655baa53c209f9b3ab433a6e5b2f79b with reconciled_reserved/provider_failure and the original Oracle metadata digest. Run 1ce1bd593fac9741f970e32fbd292d2d2160bc59c1ff35e8f8f95bd4d1b03545 readback has zero open reservations and ledger 3368ad4dd2c3e2f39e98e365faa0d877dfb24a9b52cc5fa0d70ddd5419ee0cdb. This conservatively charges one reserved invocation; it is not evidence of a model turn. The budget projection remains active until its finite expiry, with no stop receipt; no controller was started and no retry is scheduled. Raw readback is retained in the canary clone Garbage/brc1415/reconciliation-readback.json.

The single permitted blocking scope expansion was the capability registry correction. The newly observed Oracle preselection blocker reaches the AGENTS.md second-out-of-scope stop boundary. BRC14/BRC15 remain incomplete. A bounded Oracle preselection diagnosis/repair is the next required slice before any new observation; it must preserve strict selection proof, default model, immutable failed evidence and the finite authorization window.


## Oracle repair scope resolution

Owner approved the newly discovered Oracle selector slice. It is fixed locally at Oracle 2bb2acb7 with a red-green regression, 31 passing browser cases, typecheck/build and real successful prompt submission. The second shadow attempt completed but both GitHub resource calls returned 404; no exact revision evidence was produced. All shadow reservations are settled, the two-call shadow allocation is consumed, and no active grant was minted. Durable details are in docs/researches/20260908-brc14-provider-history-evidence.md under the authorized Oracle repair result. Owner subsequently confirmed intentional local/Web GPT account separation. Resolve a target already accessible to the Web GPT account before any new budgeted observation; preserve both account isolation and current-model selection.


Owner subsequently accepted Connector/account availability based on manual testing and directed skipping this investigation. No further availability probe or account configuration change is required. Publish the locally verified source candidate; keep active/manual execution and exact-revision results separate and leave BRC14/BRC15 live acceptance incomplete.


## Actual BRC14 request boundary

Public BYOK SDK read succeeded. The observed fetch_commit response was truncated, exposing that the request did not name the raw resources required by the existing decoder. Correct both observation and fresh audit requests together; share their exact URL derivation with the decoder, preserve all verification conditions. Development evidence: two caller assertions red, then 43 observation/audit cases and 17 decoder cases green, with typecheck. The remaining live result and acceptance stay separate.
