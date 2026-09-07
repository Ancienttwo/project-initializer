> **Archived**: 2026-09-07 14:03
> **Related Plan**: plans/archive/plan-20260907-1207-operator-delivery-evidence.md
> **Outcome**: Completed
> **Lifecycle**: plan
> **Parent Run ID**: run-20260907-1403
> **Archive Projection V1**: `plans/plan-20260907-1207-operator-delivery-evidence.md` => `plans/archive/plan-20260907-1207-operator-delivery-evidence.md`
> **Archive Projection V1**: `tasks/notes/20260907-1207-operator-delivery-evidence.notes.md` => `tasks/archive/notes-20260907-1403-operator-delivery-evidence.md`
> **Archive Projection V1**: `tasks/contracts/20260907-1207-operator-delivery-evidence.contract.md` => `tasks/archive/contract-20260907-1403-operator-delivery-evidence.md`
> **Archive Projection V1**: `tasks/reviews/20260907-1207-operator-delivery-evidence.review.md` => `tasks/archive/review-20260907-1403-operator-delivery-evidence.md`

# Plan: Operator Task Message delivery evidence

> **Status**: Archived
> **Created**: 20260907-1207
> **Slug**: operator-delivery-evidence
> **Planning Source**: waza-think
> **Orchestration Kind**: host-plan
> **Source Ref**: docs/researches/20260907-multica-multi-harness-board-extraction.md
> **Artifact Level**: work-package
> **Promotion Reason**: verification_boundary
> **Verification Boundary**: Notify effect evidence projection and protocol 4 consumers without new runtime authority
> **Rollback Surface**: Revert projection and bundled UI together; no persisted data migration
> **Spec**: `docs/spec.md`
> **Research**: See `docs/researches/`
> **Task Contract**: `tasks/archive/contract-20260907-1403-operator-delivery-evidence.md`
> **Task Review**: `tasks/archive/review-20260907-1403-operator-delivery-evidence.md`
> **Implementation Notes**: `tasks/archive/notes-20260907-1403-operator-delivery-evidence.md`

## Agentic Routing
- Selected route: planning
- Routing reason: Captured from waza-think planning output.
- Source ref: docs/researches/20260907-multica-multi-harness-board-extraction.md
- Due diligence:
  - P1 map: See captured planning output below.
  - P2 trace: See captured planning output below.
  - P3 decision rationale: See captured planning output below.

## Workflow Inventory

- Proposed plan: `plans/archive/plan-20260907-1207-operator-delivery-evidence.md`，原以 Draft / `--no-active` 捕获，现用户已明确授权实施。
- 按用户“开工吧”授权生成 contract/review 并在独立 worktree 实施。
- Contract target: `tasks/archive/contract-20260907-1403-operator-delivery-evidence.md`。
- Review target: `tasks/archive/review-20260907-1403-operator-delivery-evidence.md`。
- Evidence: `.ai/harness/checks/latest.json` 与 `.ai/harness/runs/`；最终绑定实施时冻结的 subject/base。
- Existing BRC10 plan: `plans/archive/plan-20260907-0554-brc10-lifecycle.md`，不覆盖，不修改其执行状态。
- 预计为中等规模的一个工作包；主要成本是协议消费者和 UI 证据贯通，约半天至一天实施/定向验证，外部 review/CI 时间另计。

## Promotion Gate

- **Merge/PR unit**: Captured plan `plans/archive/plan-20260907-1207-operator-delivery-evidence.md` is the proposed mergeable execution unit; revise before execute if this is only a checklist step.
- **Rollback surface**: Revert projection and bundled UI together; no persisted data migration
- **Verification boundary**: Notify effect evidence projection and protocol 4 consumers without new runtime authority
- **Review/acceptance boundary**: `tasks/archive/review-20260907-1403-operator-delivery-evidence.md` must record pass against the captured acceptance criteria.
- **High-risk surface**: Risks named in captured planning output; keep the plan Draft if risk ownership is not concrete.
- **Why not checklist row**: verification_boundary

## Evidence Contract

- **State/progress path**: `plans/archive/plan-20260907-1207-operator-delivery-evidence.md` task breakdown, `tasks/todos.md` deferred-goal ledger, `tasks/archive/contract-20260907-1403-operator-delivery-evidence.md`, `tasks/archive/review-20260907-1403-operator-delivery-evidence.md`, and `tasks/archive/notes-20260907-1403-operator-delivery-evidence.md`
- **Verification evidence**: `.ai/harness/checks/latest.json`, `.ai/harness/runs/`, and the commands named in the captured planning output
- **Evaluator rubric**: `tasks/archive/review-20260907-1403-operator-delivery-evidence.md` must record a passing Waza /check style recommendation
- **Stop condition**: all task breakdown items are complete, sprint verification passes, and the review recommends pass
- **Rollback surface**: Revert projection and bundled UI together; no persisted data migration

## Captured Planning Output

### Goal and success criteria

让 Operator TaskDetail 对有权威 Task Message notify effect 的当前任务回答：通知通过哪个 adapter、最近一次通知观察发生在何时、effect 停在什么阶段、对应什么 receipt，以及当前 claim 是否只有一个可投影的 effect。

本包是消息投递证据展示，不是 worker execution history 或任意 session 管理。用户可从一个任务详情读到投递事实，不需要为这几个字段手工查 effect 文件。未证明绑定的 BRC9/BRC10 终端不承诺出现在看板；本次没有核验它们是否已有 Engineer binding。

成功条件：正常、无当前 claim、无通知记录、多候选、读取失败、读取期间变化均有不同且准确的表现；原有 task 状态、attention_owner、消息发送与 receipt ACK 语义保持一致；缺失数据不伪造。

### Chosen approach and classification

| 项目 | 决定 | 原因 |
| --- | --- | --- |
| attention-first worklist、常驻 TaskDetail、Task Message 唯一写入口 | Keep | 已实现且是现有产品合同，不把 Multica 拖拽看板搬进来 |
| 当前 notify effect 的来源、阶段和时间 | 本包实现 | 现有摘要未展示，已有权威可直接投影 |
| 完整 observation 历史、分页、跨 effect 时间线 | 不加入 | 最新观察足以补当前缺口；跨 effect 不能被叫作多次 worker run |
| 自动刷新 / WebSocket | 不加入 | 现有手动刷新与 stale 呈现足够验证首包价值，传输改造是独立成本 |
| worker attempt 历史、provider run handle、terminal producer | 不加入 | 独立生产者和 join 合同，不由 notify effect 合成 |
| 任意已有 session 发现 / attach / Stop / Retry / Resume | 不加入 | 尚无本包可消费的可信绑定及控制授权合同 |

最小选项就是扩展当前摘要与现有详情区，不另起页面、服务或控制台。未选择新的 detail GET：它会增加路由、身份重验及第二次采集，并不改善这几个固定字段的价值。未选择整个 Multica 式 run 平台：现有 Task/Claim/Lease/receipt authority 已承担对应职责，另建数据库和调度器没有必要。

### P1 — observed boundaries and ownership

- 基线 main `a3fb4db2b9f411d6e7bc5184807275e9aa471378`；外部参照 `multica-ai/multica@7a438bd5b8bf39afd54259a7eb0971390e50a8ef`。外部代码是设计参考，不是运行依赖。
- `src/core/engineers/agent-runtime-effect.ts` 定义操作 `notify_inbox | wake_for_offer`，observations 是这些操作的结果；其 `process_exit_code` 不是 worker 终止证明。
- `src/effects/engineers/agent-runtime-effect-store.ts:401` 的 `projectTaskAgentRuntimeState` 已按 task/revision/claim/generation 选择 notify 候选；多于一个保持 `reconciliation_required`，成功投递状态另由 `readTaskMessageDelivery` 的 receipt 决定。
- `src/effects/fleet/board.ts:264` 消费一次已读取的 runtime statuses，随后重读 revision 检查 torn join；`failedCardInput` 承担 card-level 失败隔离。
- `src/core/fleet/board.ts` 是 Fleet 摘要和分类 authority；`src/core/operator/fleet-snapshot.ts` 只做浏览器安全投影；`src/operator-web/types.ts` 严格解码；`src/operator-web/App.tsx:850` 已有投递区。
- `src/effects/operator/server.ts:108` 的路由表只允许 Task Message 一个浏览器写入口，本包不改路由。
- BRC10 owner 在独立会话 `01a075cf-df0e-78a3-9f21-c049fce140f3` 工作。本计划使用 `--no-active` 捕获，不替换它的计划标记、不写它的 worktree。实现前以当时 main 和所有权回传重验漂移。

### P2 — source to display

```text
immutable notify intent / observation / current + Task Message receipt
                         |
         projectTaskAgentRuntimeState (one candidate decision)
                         |
           Fleet collector (existing revision check)
                         |
         Fleet canonical projection / snapshot digest
                         |
           Operator safe projection -> strict decoder
                         |
            existing TaskDetail delivery block
```

`delivery_evidence.latest` 来自同一次选择的 `status.observation`，已有 delivery_state 仍来自现有映射和 receipt，不从新字段反推。observed_at 仅说明通知操作的观察时间，不能说成 ACK 时间、agent 心跳、最近代码进展或完成时间。

纯读取路径必须继续使用 observe/no-repair 行为。`readAgentRuntimeEffectStatus` 内部可能修复 current.json，禁止为了展示新增调用该修复型入口；复用 collector 已读取并校验的 status。读取失败沿现有 card containment 输出 error，不能静默补空记录。

### P3 — exact data contract

扩展 `FleetBoardInboxSummaryV1`，新增 required `delivery_evidence` 字段。该字段及其嵌套对象由 Fleet owning types 定义，Operator 使用投影类型，不复制一套语义定义。

`delivery_evidence` 是 null，或包含以下字段的只读对象：

| 字段 | 合同 |
| --- | --- |
| candidate_count | 非负整数；按当前 task_id、task_revision、claim_id、lease_generation 过滤后的 notify effect 数，不按 message_id 过滤，也不擅自排除 terminal effects |
| latest | 仅 candidate_count=1 时有值；其他数量必须为 null |

latest 固定字段：

| 字段 | 来源 / 类型 |
| --- | --- |
| adapter_kind | observation.adapter.adapter_kind，复用当前 closed enum；必须与 intent endpoint fence 一致 |
| effect_state | observation.state，复用 AgentRuntimeEffectState |
| receipt_kind | observation.receipt_kind，复用既有 receipt kind 闭集及 null，不虚构 ACK |
| observed_at | observation.observed_at，严格 timestamp |
| observation_sequence | observation.sequence，非负整数 |
| observation_sha256 | observation.observation_sha256，既有 digest 格式 |

不新增 endpoint/host 指纹，现有 `effect_sha256` 和新的 source observation digest 已可定位证据；不透传 host_id、endpoint_id/provider_thread_id、control_ref、路径、session 名称、环境变量、进程输出或 exit code。

分支不变量：

1. `card.error !== null` 当且仅当 `delivery_evidence === null`。null 是该区数据不可用，不伪造 candidate_count=0；card.error 继续提供错误原因。collector、pure projection 的 fixture 和 browser decoder 都覆盖这一关系。
2. 没有 current claim：正常 `{candidate_count:0, latest:null}`，UI 用既有 claim_id/generation 表达“无当前 Claim”。有 current claim 但无候选：同一数据形状，UI 表达“尚无通知记录”。
3. 唯一候选：从同一 status 同时产生现有摘要与 latest；`latest.observation_sha256 === status.current.latest_observation_sha256`，sequence/state/effect/intent/adapter 也保持现有校验关系，错误按现有 typed error 隔离。不能分别选择两条观察拼起来。
4. 多候选：精确 candidate_count、latest=null，原摘要 `reconciliation_required/unknown` 不变。UI 文案为“当前 Claim 关联 N 条通知记录；当前摘要需要对账”，不声称多次 worker 执行或必然发生重复发送。即使是两个不同 message_id，也保留现有选择语义。本包不删除、supersede 或改选候选。
5. stopped/superseded 是通知 effect 的终态；即便现有 delivery_state=pending，也显示“通知已停止”或“通知已作废”，不能用动画或等待文案宣称仍在投递。保留原始 delivery state，不修改生产映射来美化显示。
6. 新字段不参与 column、attention_owner、readiness、unread_count 的决策；加入 canonical snapshot 内容并由现有摘要 digest 覆盖。读取期间观察变化继续显示 changed_during_read。

### Public surface and compatibility

- Fleet protocol 3 → 4，`OPERATOR_FLEET_PAYLOAD_PROTOCOL` 同步为 4；CLI JSON、MCP 所消费的 Fleet snapshot、HTTP response 和 bundled UI 同批交付。health/collaboration/message 协议不变。
- decoder 拒绝 protocol 3、缺少 delivery_evidence、错误枚举/digest/timestamp、count/latest 不一致及 error/null 不一致。沿用现有 invalid/stale 错误呈现，不增加旧字段 fallback 或双协议读取。
- Entity delta：一个现有 payload 的 required 投影字段及一次版本升级；新增命令、API route、配置、服务、数据库、后台定时器、外部账户、依赖均为 0。
- 不修改 runtime effect 落盘格式、现有 observations/receipts，也不迁移持久化数据。旧 UI/server 混搭会被协议拒绝，需一起更新；已打开的旧页面使用现有重新加载路径。

### UI behavior

在现有 TaskDetail 的 deliveryRuntime 区块将标题及解释改为“消息投递证据”。保留 delivery/reachability/failure/effect digest，增加 adapter、人类可读的 effect 阶段、最近通知观察时间、receipt 类型。sequence 与 observation digest 放在该区现有证据详情层，digest 使用已有复制交互，不增加新的后端动作。

时间展示复用 i18n 的既有格式化方式，并始终使用字段原值；不增加心跳阈值。无 claim、无记录、读取失败、多记录需要对账、stopped、superseded 都给明确文案。未知和失败不染成“正在工作”。所有语言在 `src/operator-web/i18n.ts` 同步。

当前任务的 message composer、权限、成功/失败提示、草稿、唯一 accent 写入口不变。新信息在窄屏 detail pane 内可读；默认不平铺长 digest。完整执行日志、自动刷新、runtime 控制、BRC 预算显示均不在此包。

### Files and implementation steps

预计 8 个生产/展示文件，加协议 smoke、现有测试及文档，整体超过 8 个文件；原因是一个已有 Fleet 合同从 producer 到 CLI/browser 的贯通变更，不是新增服务。

- `src/core/fleet/board.ts`：新增 owning projection types、protocol 4、immutable card projection 与 digest 覆盖。
- `src/effects/engineers/agent-runtime-effect-store.ts`：在已有候选选择和 status 上产生 evidence；保留旧选择、receipt 和 error 语义。
- `src/effects/fleet/board.ts`：success/empty/failed 构造器贯通，继续 revision 检查和 card containment。
- `src/core/operator/fleet-snapshot.ts`：显式复制 allowlisted evidence 字段，避免 raw intent 外泄。
- `src/operator-web/types.ts`：严格 protocol 4 与嵌套关系解码。
- `src/operator-web/App.tsx`、`src/operator-web/i18n.ts`、`src/operator-web/fixture.ts`：现有区域展示与各状态 fixture。
- `scripts/check-tarball-install-smoke.sh`：更新实际 installed operator payload 的版本及新字段断言。
- 机械更新已有 typed snapshot test fixtures 和协议 literal，不引入通用 fallback fixture builder。扫描 `src/`、`tests/`、`scripts/` 中 `FLEET_BOARD_PROTOCOL`、`OPERATOR_FLEET_PAYLOAD_PROTOCOL`、`operator_fleet_snapshot`、`fleet_board_snapshot`；当前命中还包括 `tests/unit/collaboration-authority-baseline.test.ts`。
- 文档同步：`docs/design/DESIGN-local-human-control-board-v1.md` 的 presentation/transport amendment 与 `docs/researches/20260907-multica-multi-harness-board-extraction.md` 的当前选择。BRC Sprint 和 BRC10 合同不改。

本包为一个独立 PR / rollback / acceptance 边界；执行顺序只在文末 `## Task Breakdown` 维护，不拆成必须互相等待的多个 Phase。

### Verification plan for the implementation contract

开发阶段按行为选择局部测试；最终合同每个可执行 criterion 只声明一次。最终检查按四组记录，不把这里的清单重复复制成两份 coverage。

1. Producer/projection focused tests（phase=verification, cost=normal, evidence_policy=current_exact）：
   `bun test --timeout 60000 tests/unit/r1-provider-neutral-agent-runtime.test.ts tests/unit/fleet-board.test.ts tests/effects/fleet-board.test.ts tests/unit/operator-fleet-snapshot.test.ts`
   必要性：真实 effect/receipt 来源、候选边界、current/observation 绑定、error/null 不变量、torn read、摘要与分类不变、浏览器安全投影。
2. Consumer/UI focused tests（phase=verification, cost=normal, evidence_policy=current_exact）：
   `bun test --timeout 60000 tests/unit/operator-web-types.test.ts tests/operator-web/operator-ui.test.tsx tests/operator-web/operator-interactions.test.tsx tests/operator-web/operator-collaboration.test.tsx tests/cli/fleet-board.test.ts tests/cli/operator-serve.test.ts tests/effects/operator-write-boundary.test.ts tests/unit/collaboration-authority-baseline.test.ts tests/readme-dx.test.ts`
   必要性：strict protocol 升级、CLI/browser consumers、原有 exactly-one-write/contrast 守卫、准确终态文案、窄屏及现有交互邻接。测试 fixture 更新不等于重新解释其业务断言。
3. 类型和六项 repo integrity（phase=verification, cost=normal, evidence_policy=current_exact），各为独立 criterion：`bun run check:type`、`bash scripts/check-deploy-sql-order.sh`、`bash scripts/check-architecture-sync.sh`、`bash scripts/check-task-sync.sh`、`bash scripts/check-task-workflow.sh --strict`、`bun scripts/inspect-project-state.ts --repo . --format text`、`bun src/cli/index.ts init --repo . --dry-run`。
4. Packaged integration（phase=verification, cost=expensive, evidence_policy=current_exact）：`bash scripts/check-tarball-install-smoke.sh`。必要性：protocol 与 bundled UI 必须在实际 tarball 安装后配套，单元测试不覆盖 packaging；该脚本的 npm pack/prepack 已执行 operator build，不再额外重复 `build:operator-web`。仅在代码和 base 冻结后经 `verify-sprint --prepare-acceptance` 跑一次；首次预算估计数分钟，执行前说明实际未覆盖风险，证据输入包括 lockfiles、Bun/Node/npm 版本及临时安装依赖。重试遵循既有 evidence reuse/rerun reason。

Browser acceptance artifact：用 disposable fixture/loopback operator 展示有单条通知、无记录、两条不同消息、多候选、读取失败及 stopped/superseded；确认用户能区分通知与执行，不触发额外写入；桌面和窄屏截图/操作证据各一份。只用受控 runtime fixtures，不调用真实 Claude/Codex 或用户 session。

不要求 full suite：命名的 producer→transport→decoder→UI→packaged consumer 已覆盖协议影响；本包不改变运行生命周期或其他业务模块。若发现这些检查未覆盖的真实跨模块风险，再明确原因修订 Verification Plan。CI/发布门禁原有要求不豁免。

### Risk, capacity and rollback

最脆弱前提是“用户关心的任务存在可验证的 notify effect”。前提不成立时，本包只能诚实显示无记录，不能降低任意 session 的查找成本。这一限制已进入目标和验收，不通过扫描终端补数据。

现有 runtime collector 会扫描 effect store，并在各 card 后做 revision 重读；本包只增加固定大小字段，不新增扫描或历史数组。10 倍规模首先仍受已有 store 扫描/同步采集成本限制，不在本包另建索引或后台刷新。拒绝 raw endpoint 指纹泛化和历史窗口，正是为了不把展示包变成新的存储工程。

回滚整包代码与 bundled UI（protocol 4 一并回退），无落盘迁移、无数据删除、无新运行状态需清理。消费者必须成对回退，不能只回退前端或只恢复 protocol 常量。

### Discussion disposition and handoff

与 BRC-claude 两轮讨论后的决定：采纳投递/执行分离、无原始 endpoint 外泄、多候选不挑最新、精确 current/observation 绑定及 stopped/superseded 准确文案；不采纳历史列表、额外 endpoint 指纹或第二套 session authority。

BRC10 边界同步请求已进入其会话队列，尚未收到 owner 回执。其 provider lifecycle/terminal producer 进展不由本包推断；本包不编辑它的 `src/effects/collaboration/provider-output-adapter.ts`、Lease/reclaim、campaign budget 或合同。若 owner 指出相同文件正在编辑，实现时选择新 main / 独立 worktree集成，不并发修改同一 checkout。

用户已授权实施。核实 main 漂移并通过 `repo-harness run plan-to-todo --plan plans/archive/plan-20260907-1207-operator-delivery-evidence.md` 建立独立 contract/worktree。最终独立 review 消费准备好的验收证据，不重复运行昂贵检查；PR/merge/release 按届时授权和现有工作流执行，不将当前“讨论并生成方案”解释成上线授权。

## Task Breakdown
- [x] 修改 owning types 与唯一候选投影，完成无 claim/零/一/多/error/终态的定向回归。
- [x] 贯通 Fleet、Operator、strict decoder、snapshot digest 和 protocol 消费者。
- [x] 更新既有 TaskDetail 投递区域和语言，验证终态、未知及证据复制的真实交互。
- [ ] 冻结实现与 target base，一次完成风险范围内验收、packaged payload smoke 和独立验收。
- [ ] 合并前确认只有该包文件，按现有 contract-worktree finish 收口并更新人类阅读文档。

## Planning verification

本轮已完成 canonical Draft capture、文档空白检查和 17 个具名源码路径引用核验；Task Breakdown 只有一处。六项 repo integrity 均退出 0。architecture projection 已无 pending/blocking，但共享 `.projection-manifest.json` 有未提交变更，不归本包，不吸收进后续提交。没有创建 active-plan marker，也没有运行产品测试或实施本方案。
