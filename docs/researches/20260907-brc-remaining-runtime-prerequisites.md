# Remaining BRC runtime prerequisites

Read-only investigation against integrated main `33c5012e1185a695fdaf54a7bb84fc613cfb653b`. This document does not complete a Sprint row or authorize a provider invocation.

## Current observable transport

The installed Oracle 0.18.0 passes the non-launching `chatgpt browser-doctor` capability checks, including copy-profile transport. Its optional app-preselection capability is absent. The doctor explicitly reports `opensBrowser: false`: this is not proof of a logged-in GPT Pro session, Connector access, or Issue-writing permission.

The current repository binding selects `Profile 11`. The historical Connector probe records that Profile 11 lacked Connector access and that Profile 13 produced matching content answers. That historical result is not a current permission check. An ad-hoc Profile 13 doctor also leaves the browser closed; it cannot establish that the chosen account can perform the canary.

`src/effects/automation/gpt-pro-issue-authoring.ts` checks the saved browser binding against the campaign authorization's `chrome_profile_directory`. Its browser input uses the Oracle transport, GPT Pro model and required secret scan; it does not select a ChatGPT app. A doctor override therefore does not change the campaign's actual account or authorization.

## Provider capability remains an external prerequisite

The [current OpenAI GitHub app documentation](https://help.openai.com/en/articles/11145903-connecting-github-to-chatgpt), read on 2026-09-07, describes on-demand repository retrieval rather than a ChatGPT-managed synchronized index. It also states that the built-in GitHub app is read-only. This does not establish the capabilities of a separate custom app on the user's account. Consequently neither Issue creation nor a trusted exact-revision receipt can be inferred from the built-in app's availability.

The Sprint requires GPT Pro to create the Issues; local Issue creation is forbidden as a substitute. Before a real canary, identify the selected account's actual writable tool, the authorized disposable repository, and explicit call/time limits. Observe created Issues through the existing independent GitHub observer. Missing capabilities must remain an observed blocker, not be replaced with local writes or model self-report.

## Completion boundary

BRC6a's admission correction is merged, but its trusted exact-revision producer remains absent. The current content challenge and browser result contain no independently observed revision proof. BRC14 cannot acquire an accepted audit by adding a SHA field, a caller-supplied receipt or a fake success fixture. The approved PRD also keeps BRC15's full model-free matrix dependent on BRC14; a subset of existing unit tests does not complete that matrix.

BRC15a is the independently executable observation once its runtime inputs are supplied and its actual Issue-writing capability is established. Its result must report exact-SHA as unverified, preserve unknown reservations and record the owner's investment decision. No browser session, provider call, Issue mutation or Sprint completion was performed in this investigation.

## Remaining controller implementation

The read-only call-path audit found no fresh-audit producer/consumer. `development-campaign-store.ts` accepts opaque `evidence_refs`; cleanup protects entry to audit/next group/completion but does not establish audit acceptance. The CLI still exposes generic transition, and the core's `accept_group` checks the preceding state rather than a fresh-audit authority. `gpt-pro-issue-authoring.ts` uses the immutable initial target for new intents and continuation, so Group 2/3 cannot yet consume the previous accepted final main.

Once a real revision producer is available, one coherent BRC14 package must connect fresh-session identity, complete slots, budgeted audit invocation, the result authority, controlled transitions and the next-group baseline. Keeping the generic transition as an alternate acceptance path would leave the invariant unenforced. Creating only an always-rejecting audit endpoint would not deliver this package.

The independent source audit also ran 48 focused tests (191 assertions) across admission, Connector challenge, adoption, campaign store and closeout; all passed on the current checkout. Those tests confirm existing boundaries only. Static ten-slot fixtures and two-slot effect fixtures do not prove the full BRC15 canary; no complete BRC15 runner was found. This observation does not replace a frozen final acceptance or mark any remaining row done.
