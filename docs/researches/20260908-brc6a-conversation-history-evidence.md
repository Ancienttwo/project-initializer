> Historical snapshot preserved on 2026-09-10 from `068ec631285bc5afc92c48e9fdda5b04acb62f47`. Status and observations below describe that original investigation; they grant no current execution authority. Consult [20260907-brc6a-admission.md](20260907-brc6a-admission.md) for the later implementation boundary and [consolidation provenance](20260910-inactive-branch-consolidation.md) for disposition.

# BRC6a: original conversation history and unpaired GitHub results

## Verified progress

The completed, explicitly GitHub-activated ChatGPT conversation
`6a9f0045-c728-83ea-a489-27796265282a` can be reloaded without a new prompt to obtain
provider-origin tool results. A disposable Profile 13 copy and its owned Chrome
observed the browser's own GET to
`/backend-api/conversations/6a9f0045-c728-83ea-a489-27796265282a?include_has_versions=true&num_turns=10`.
The HTTP 200 JSON response has `conversation_id`, `messages[]` and `page_info`.
This advances beyond the prior UI-only and assistant-self-report boundary.

There are 16 saved messages. Two are tool-role `api_tool.call_tool` results:
`0a23b742-3db7-424e-bdd0-2c472982c13f` and
`2929fee9-8f25-4b0d-95f4-7f28d0da24a9`. Their provider metadata includes
`invoked_resource.app_name=GitHub`, a connector-scoped `fetch_file` resource URI,
and `citation_metadata.__connector_id=connector_76869538009648d5b282a4bb21c3d157`.
The second result contains all seven resource lines, including `content`,
`encoding=utf-8`, `sha=4779ce156e273311fa013c0bd7f71b9c9048129d`, `display_title=README.md`,
and the canary repository's commit-pinned display URL for
`33d692aaa0ab593df0c160082b18fdac02c82e9c`. These are actual tool-origin records,
not a reconstruction from the final answer.

## Remaining authority gap

No original assistant/code `recipient=api_tool.call_tool` request is retained in
this history. Present code requests are only list_resources, read_resource and
find_in_resource. Both history pagination flags are false; this does not certify
that the service retained every original message. The two summary source-message
IDs are absent. Expanding Worked for and clicking the visible summary rows did
not retrieve those requests; the rows rendered as plain text, and the only other
captured conversation response was the empty textdocs list.

Therefore the original `fetch_file` repository/path/ref parameters cannot yet be
paired with these results. The result URL, user prompt, final answer and summary
IDs must not fill that gap. BRC6a remains pending; no active-adoption or fresh-audit
receipt is created. The missing field is now precisely the original tool request
provenance, rather than an unsupported blanket claim that Connector results are
unavailable. This does not establish that a future live response stream lacks it.

## Reusable operator producer

Oracle branch `codex/brc6a-conversation-evidence`, commit `b6f35dcc`, based on
`43adb603`, adds `scripts/capture-conversation-evidence.ts` and its
`src/browser/conversationEvidence.ts` collector. It reuses existing profile copy,
Chrome launch, CDP and Commander dependencies. The collector is separate to test
its asynchronous protocol and cancellation without real browser/model calls;
no new service or dependency is introduced.

The operator supplies an existing conversation ID, source profile and new output
path. Only an exact-origin/path GET with matching response URL, status, MIME and
body conversation ID is retained. The decoded body is preserved unchanged with
its hash and pagination. Capture is bounded by 45 seconds (maximum configurable
120 seconds) and 8 MiB. Output is published atomically without replacement and is owner-only; headers/cookies are
excluded. Owned Chrome and temporary profile are cleaned on success, failure or
cancellation. No model/thinking picker, prompt submission, alternate endpoint,
automatic pagination, Oracle session mutation or revision admission is involved.

## Verification and artifact boundary

- 22 focused collector tests passed: unrelated/redirected traffic, HTTP failures,
  malformed/mismatched/paginated bodies, byte limits, timeouts, cancellation,
  output permissions, atomic competing-writer publication, overwrite refusal, normalized Profile binding and SIGQUIT cleanup.
- Oracle TypeScript check, build compiler/vendor steps and targeted oxlint passed.
  The pnpm wrapper initially refused its automatic dependency reinstall against
  the intentionally shared node_modules link. Dependencies were not changed;
  the exact build compiler and existing build:vendor script were executed directly.
- The final operator successfully read the same existing conversation. Its decoded
  body SHA-256 is `16c6b5ca0808ba75070d19021137895330f3ae108319dfc38dad5f66cd0bad12`.
  Hash readback and mode `0600` passed; no temporary operator profiles remained
  and no owned Chrome process remained after completion.
- Raw history and structural validation live only in ignored, owner-only
  `.ai/harness/evidence/brc6a-conversation-history/`. Raw private prompts/tool output
  and reasoning summaries are not committed or printed into ordinary logs.
- Repo integrity results and one frozen-boundary review are recorded in this
  package's canonical workflow artifacts. No full suite, new GPT request,
  provider budget, GitHub write, release or main merge was performed.

The next bounded producer investigation is an explicitly authorized future live
Oracle run's actual request-bearing network stream. Replaying the historical
response again cannot manufacture the omitted requests. Existing canary grants
remain stopped and cannot fund that investigation.
