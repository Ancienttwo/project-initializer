# BRC14 fresh main audit readiness

只读研究，基于 BRC13 候选 `b9684c3c72a260a8d04a48f2e662e60a78e672bb`。BRC14 仍 pending；本文不构成实现、验收或 campaign activation 证明。

## 已有权威与实际链条

`ProgramAuthorizationV1.campaign` 在 `src/core/automation/budget.ts` 提供 campaign identity、group_count、require_fresh_main_audit、profile 与预算。`src/core/automation/development-campaign.ts` 和对应 store 已有 append-only CAS event chain：group_running → group_auditing → group_accepted → group_preparing，expected_current_sha256 负责并发保护。

`IssueBatchIntentV1` 在 `src/core/automation/issue-batch.ts` 绑定 campaign_id、group_number、base_main_sha 和 intent_sha256。Adoption receipt 在 `src/core/automation/issue-batch-adoption.ts` 绑定同组 Issue、Task/slot、authoring session 和 unfilled_slots。BRC13 的 cleanup receipt 是 audit admission 的前置事实，不能代替 audit 结论。

浏览器新会话入口是 `src/cli/chatgpt-browser/engine.ts` 的 runBrowserConsult；runBrowserFollowup 通过 sourceSessionId 明确复用旧会话。Fresh audit 必须从新会话入口产生，不能把 authoring follow-up 改名后当新审计。

## 两个阻断点

1. `src/core/automation/connector-challenge.ts` 的 ConnectorChallengeReceiptV1 只有 challenge_verified：三项内容答案匹配。它没有可信 Connector revision readback producer，不能证明模型读取 exact final_main_sha。Sprint BRC6a/BRC14 明确要求缺证据时 unverified，不进入下一组。模型回显 SHA、通知 receipt 和本地 Git fetch 都不补足这个证明。
2. `src/effects/automation/gpt-pro-issue-authoring.ts` 的 startIssueBatchAuthoring 从 immutable campaign definition 取初始 target_revision 作为 base_main_sha；continuation 也要求同一初始 revision。它不能满足 Group 2 基于 Group 1 final main、Group 3 基于 Group 2 final main。原始授权不能被重写来模拟滚动 baseline。

另有状态推进入口需要同包收口：`src/cli/commands/campaign.ts` 暴露通用 transition，event evidence_refs 只是 opaque string array。单纯新增 audit receipt，而继续允许绕过它执行 accept_group/prepare_group，不能建立可信顺序。

## 最小完整接线提案

先形成 BRC6a 的真实 trusted revision producer 与验证契约。BRC14 再在同一包接通 audit receipt、group baseline resolver 和受控 transition：G1 取授权初始 target；G2/G3 只取上一组 accepted audit 的 final_main_sha。没有可验证 producer 时可以记录 unverified；不能实现一个靠调用者标签或模型文本升级的 accepted 分支。

拟议 audit receipt 至少连接 campaign_id + group_number + intent_sha256、expected_main_sha、observed_main_sha、adoption digest、完整 slots/unfilled accounting、Issue/PR identities、新 audit_session_ref、trusted revision evidence digest、raw answer digest 和闭集 disposition。该 receipt 尚未实现，不能被当作现存 authority。

新 GPT audit 调用需要预算 vocabulary 中的真实 operation。现有 initial/fill_missing/edit_issue/challenge 不能承载改名的 audit。所有新会话、重试、未知结果都仍须经过唯一 budget store。

## 验证面与停止边界

- Wrong SHA、复用 authoring session、缺 slot/unfilled、无可信 revision receipt：均不得 accept_group。
- accepted 的 G2/G3 intent 必须分别采用前组 final main；不修改原 campaign authorization。
- accepted_with_followups 不突破 group_count；rejected 不自动 rollback main；unverified 不推进，重试仍受预算约束。
- 通过真实共享 store 的负例证明裸 transition 不能绕过 audit receipt；CAS race 只能推进一次。
- 复用 development-campaign、connector-challenge、issue-batch-adoption fixtures，增加实际 receipt → next-intent consumer 测试。

本次只读追踪没有找到可消费的 trusted exact-revision producer。BRC14 的可执行边界须在该事实改变后重新核对；BRC15a 明确标为 exact-SHA 未验证的 shadow observation 不因此自动获得 active 权限。
