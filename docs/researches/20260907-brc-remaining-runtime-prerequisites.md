# Remaining BRC runtime prerequisites

Read-only investigation against integrated main `33c5012e1185a695fdaf54a7bb84fc613cfb653b`. This document does not complete a Sprint row or authorize a provider invocation.

## Current observable transport

The installed Oracle 0.18.0 passes the non-launching `chatgpt browser-doctor` capability checks, including copy-profile transport. Its optional app-preselection capability is absent. The doctor explicitly reports `opensBrowser: false`: this is not proof of a logged-in GPT Pro session, Connector access, or Issue-writing permission.

The current repository binding selects `Profile 11`. The historical Connector probe records that Profile 11 lacked Connector access and that Profile 13 produced matching content answers. That historical result is not a current permission check. An ad-hoc Profile 13 doctor also leaves the browser closed; it cannot establish that the chosen account can perform the canary.

`src/effects/automation/gpt-pro-issue-authoring.ts` checks the saved browser binding against the campaign authorization's `chrome_profile_directory`. Its browser input uses the Oracle transport, GPT Pro model and required secret scan; it does not select a ChatGPT app. A doctor override therefore does not change the campaign's actual account or authorization.

## Live account capability supersedes the generic documentation assumption

The [OpenAI GitHub app documentation](https://help.openai.com/en/articles/11145903-connecting-github-to-chatgpt), read on 2026-09-07, describes on-demand repository retrieval and a read-only app. A subsequent live account inspection contradicted applying that limitation to this account: Profile 13's connected OpenAI GitHub plugin exposes Create issue, Update issue, Fetch commit, Fetch file, Resolve ref, Get commit tree SHA and immutable tree/blob readers. Its permission view says Allow all actions. The observed account's tool surface takes precedence over the generic article; a missing Issue-write tool is no longer the identified blocker. Actual repository permission and successful execution still require the bounded canary, and the UI action list does not itself prove exact-revision readback.

The Sprint requires GPT Pro to create the Issues; local Issue creation is forbidden as a substitute. Before a real canary, identify the selected account's actual writable tool, the authorized disposable repository, and explicit call/time limits. Observe created Issues through the existing independent GitHub observer. Missing capabilities must remain an observed blocker, not be replaced with local writes or model self-report.

## Completion boundary

BRC6a's admission correction is merged, but its trusted exact-revision producer remains absent. The current content challenge and browser result contain no independently observed revision proof. BRC14 cannot acquire an accepted audit by adding a SHA field, a caller-supplied receipt or a fake success fixture. The approved PRD also keeps BRC15's full model-free matrix dependent on BRC14; a subset of existing unit tests does not complete that matrix.

BRC15a is the independently executable observation once its runtime inputs are supplied and its actual Issue-writing capability is established. Its result must report exact-SHA as unverified, preserve unknown reservations and record the owner's investment decision. No browser session, provider call, Issue mutation or Sprint completion was performed in this investigation.

## Remaining controller implementation

The read-only call-path audit found no fresh-audit producer/consumer. `development-campaign-store.ts` accepts opaque `evidence_refs`; cleanup protects entry to audit/next group/completion but does not establish audit acceptance. The CLI still exposes generic transition, and the core's `accept_group` checks the preceding state rather than a fresh-audit authority. `gpt-pro-issue-authoring.ts` uses the immutable initial target for new intents and continuation, so Group 2/3 cannot yet consume the previous accepted final main.

Once a real revision producer is available, one coherent BRC14 package must connect fresh-session identity, complete slots, budgeted audit invocation, the result authority, controlled transitions and the next-group baseline. Keeping the generic transition as an alternate acceptance path would leave the invariant unenforced. Creating only an always-rejecting audit endpoint would not deliver this package.

The independent source audit also ran 48 focused tests (191 assertions) across admission, Connector challenge, adoption, campaign store and closeout; all passed on the current checkout. Those tests confirm existing boundaries only. Static ten-slot fixtures and two-slot effect fixtures do not prove the full BRC15 canary; no complete BRC15 runner was found. This observation does not replace a frozen final acceptance or mark any remaining row done.

## Live profile inspection

Oracle's existing copyChromeProfile helper created disposable copies of Profile 13, and the existing native CDP diagnostic verified a live ChatGPT composer. The settings UI was inspected without submitting prompts or changing permissions. It showed the connected GitHub plugin's concrete read/write action list. Each owned browser was closed and its session-bearing copy removed. The shared browser MCP was already occupied and was left intact. No model invocation or Issue mutation occurred.

The repository's shared Git state contains no campaign budget artifacts to reuse. The next concrete preparation is a disposable canary target with an explicit small grant and Profile 13 binding, followed by the existing budgeted authoring/observation path. In parallel, inspect actual tool-result transport before designing the BRC6a producer; action names or a model's echoed SHA remain insufficient.

The existing probe conversation was inspected with an isolated CDP network observer. Three bounded capture attempts did not produce a stable conversation tool-result payload: the first filter missed the current plural conversation endpoint, the second encountered an unavailable response body, and the last saw only list responses within its observation window. HTTP 200 metadata and a conversation link are not trusted revision evidence. Further work requires a reproducible result producer; no accepted BRC6a path was enabled.

Concrete canary repository/account/limits are proposed in `plans/plan-20260907-2055-brc15a-real-shadow-canary.md`. The installed operator grant-list command returned no stored authorization for the current repository. The plan awaits its explicit external-run grant; it is not a request for the user to rediscover the already inspected profile or Issue-write tool.
