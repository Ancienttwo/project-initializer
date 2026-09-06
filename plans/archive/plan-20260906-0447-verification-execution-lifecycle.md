> **Archived**: 2026-09-06 17:33
> **Related Plan**: plans/archive/plan-20260906-0447-verification-execution-lifecycle.md
> **Outcome**: Completed
> **Lifecycle**: plan
> **Parent Run ID**: run-20260906-1733
> **Archive Projection V1**: `plans/plan-20260906-0447-verification-execution-lifecycle.md` => `plans/archive/plan-20260906-0447-verification-execution-lifecycle.md`
> **Archive Projection V1**: `tasks/notes/20260906-0447-verification-execution-lifecycle.notes.md` => `tasks/archive/notes-20260906-1733-verification-execution-lifecycle.md`
> **Archive Projection V1**: `tasks/contracts/20260906-0447-verification-execution-lifecycle.contract.md` => `tasks/archive/contract-20260906-1733-verification-execution-lifecycle.md`
> **Archive Projection V1**: `tasks/reviews/20260906-0447-verification-execution-lifecycle.review.md` => `tasks/archive/review-20260906-1733-verification-execution-lifecycle.md`

# Plan: 全量测试执行与验收生命周期重构

> **Status**: Archived
> **Created**: 20260906-0447
> **Slug**: verification-execution-lifecycle
> **Planning Source**: codex-analysis
> **Orchestration Kind**: host-plan
> **Source Ref**: docs/researches/20260906-verification-execution-dataflow.md
> **Artifact Level**: work-package
> **Promotion Reason**: verification_boundary
> **Verification Boundary**: 计数型执行矩阵、真实 ledger/receipt/merge 组合、包装入口与根 integrity checks；按最终风险决定昂贵全套
> **Rollback Surface**: 原子回滚 executable schema、runner、reader 与模板，不混用新旧 contract
> **Spec**: `docs/spec.md`
> **Research**: See `docs/researches/`
> **Task Contract**: `tasks/archive/contract-20260906-1733-verification-execution-lifecycle.md`
> **Task Review**: `tasks/archive/review-20260906-1733-verification-execution-lifecycle.md`
> **Implementation Notes**: `tasks/archive/notes-20260906-1733-verification-execution-lifecycle.md`

## Agentic Routing
- Selected route: parent-p1-p2-p3
- Routing reason: Captured from codex-analysis planning output.
- Source ref: docs/researches/20260906-verification-execution-dataflow.md
- Due diligence:
  - P1 map: See captured planning output below.
  - P2 trace: See captured planning output below.
  - P3 decision rationale: See captured planning output below.

## Workflow Inventory
Complete this inventory before implementation. If any line is unknown, keep the plan in Draft and fill it before projection.

- Active plan: `plans/archive/plan-20260906-0447-verification-execution-lifecycle.md`
- Sprint contract: `tasks/archive/contract-20260906-1733-verification-execution-lifecycle.md`
- Sprint review: `tasks/archive/review-20260906-1733-verification-execution-lifecycle.md`
- Implementation notes: `tasks/archive/notes-20260906-1733-verification-execution-lifecycle.md`
- Deferred-goal ledger: `tasks/todos.md`
- Current checks: `.ai/harness/checks/latest.json`
- Run snapshots: `.ai/harness/runs/`
- Scope authority: `tasks/archive/contract-20260906-1733-verification-execution-lifecycle.md` `allowed_paths`
- Concurrency rule: `.ai/harness/active-plan` selects the active plan for this worktree when present; `.ai/harness/active-worktree` records the owning worktree. If another worktree already owns active work, open or switch to the matching worktree instead of serializing unrelated plans.
- Execution isolation: approved contract-level work projects through `repo-harness run plan-to-todo --plan plans/archive/plan-20260906-0447-verification-execution-lifecycle.md` and may start `repo-harness run contract-worktree start --plan plans/archive/plan-20260906-0447-verification-execution-lifecycle.md`.

## Approach
### Strategy
Use the captured planning output below as the execution source of truth.

### Trade-offs
| Option | Pros | Cons | Decision |
|--------|------|------|----------|
| Captured plan | Preserves the approved Codex Plan or Waza think decision | Requires the captured text to be concrete enough to execute | Use |

## Detailed Design
### File Changes
| File | Action | Description |
|------|--------|-------------|
| See captured planning output | Follow | Implement only the approved scope named below |

### Code Snippets
See captured planning output.

### Data Flow
See captured planning output.

## Risk Assessment
| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Captured plan lacks enough detail | Medium | Execution may need clarification | Stop before implementation if the captured output contradicts repo rules or lacks concrete file targets |

## Task Contracts
- Contract file: `tasks/archive/contract-20260906-1733-verification-execution-lifecycle.md`
- Review file: `tasks/archive/review-20260906-1733-verification-execution-lifecycle.md`
- Implementation notes file: `tasks/archive/notes-20260906-1733-verification-execution-lifecycle.md`
- Template: `.claude/templates/contract.template.md`
- Verification command: `repo-harness run verify-contract --contract tasks/archive/contract-20260906-1733-verification-execution-lifecycle.md --strict`
- Active plan rule: this captured plan is written to `.ai/harness/active-plan` and the owning worktree is written to `.ai/harness/active-worktree` unless --no-active is used. Do not infer active execution from the latest non-archived plan.

## Handoff

- Checks file: `.ai/harness/checks/latest.json`
- Session handoff: `.ai/harness/handoff/current.md`

## Promotion Gate

- **Merge/PR unit**: Captured plan `plans/archive/plan-20260906-0447-verification-execution-lifecycle.md` is the proposed mergeable execution unit; revise before execute if this is only a checklist step.
- **Rollback surface**: 原子回滚 executable schema、runner、reader 与模板，不混用新旧 contract
- **Verification boundary**: 计数型执行矩阵、真实 ledger/receipt/merge 组合、包装入口与根 integrity checks；按最终风险决定昂贵全套
- **Review/acceptance boundary**: `tasks/archive/review-20260906-1733-verification-execution-lifecycle.md` must record pass against the captured acceptance criteria.
- **High-risk surface**: Risks named in captured planning output; keep the plan Draft if risk ownership is not concrete.
- **Why not checklist row**: verification_boundary

## Evidence Contract

- **State/progress path**: `plans/archive/plan-20260906-0447-verification-execution-lifecycle.md` task breakdown, `tasks/todos.md` deferred-goal ledger, `tasks/archive/contract-20260906-1733-verification-execution-lifecycle.md`, `tasks/archive/review-20260906-1733-verification-execution-lifecycle.md`, and `tasks/archive/notes-20260906-1733-verification-execution-lifecycle.md`
- **Verification evidence**: `.ai/harness/checks/latest.json`, `.ai/harness/runs/`, and the commands named in the captured planning output
- **Evaluator rubric**: `tasks/archive/review-20260906-1733-verification-execution-lifecycle.md` must record a passing Waza /check style recommendation
- **Stop condition**: all task breakdown items are complete, sprint verification passes, and the review recommends pass
- **Rollback surface**: 原子回滚 executable schema、runner、reader 与模板，不混用新旧 contract

## Captured Planning Output

## Goal

在正常多 agent / main 持续推进的环境中，消除隐式或相同事实驱动的昂贵全量重复执行，同时保留精确验收、真实测试失败、进程所有权和发布准入。交付一个跨 contract → executor → evidence → acceptance 的原子 schema cutover。用户已批准本工作包，按下述边界实施。

## P1 / P2 Evidence

完整调用图、源码位置、61 项检查和组合计数实验见 `docs/researches/20260906-verification-execution-dataflow.md`。固定基线 `ad4afe7765b62a66a58f6378f8d0efcd3c3006cf`。

关键复现：同一模拟 full command 的累计次数依次为 baseline=1、unchanged=1、contract prose=2、plan prose=3、main empty commit=4、direct verify twice=6。done prompt gate 通过 direct verifier 自动进入同一路径。finish/merge-gate 正常路径没有额外全量，不能误改它们为新的 executor。

## P3 Decision

测试事实与当前验收的生命周期分开，执行只有一个 owner。使用已存在的 ledger、run snapshots、materializer 和 process supervisor；不创建第二个缓存服务或跨仓库数据库。

### 1. 单一 executable contract

在 contract 中增加唯一、versioned 的 JSON Verification Plan block，替换 tests_pass / commands_succeed 的可执行声明和 criterion_reuse 双列表。非执行的 files_exist、artifacts_exist、QA/manual fields 保留原权威。

每个 executable descriptor 至少包含：
- id：合同内稳定且唯一；
- kind：package_test 或 command；
- test path / command、cwd；
- phase：preflight 或 verification；
- cost：normal 或 expensive；
- evidence_policy：current_exact 或 baseline_with_delta；
- necessity：选择范围与昂贵执行的具体原因；
- 输入依赖声明，缺失时不可自动复用；
- baseline_with_delta 时必须引用 immutable baseline event/run 和当前 delta checks，不能只有一段“之前跑过”的文案。

LLM/parent 决定 scope 和必要性；runtime 只校验结构、引用、执行条件和实际结果，不从 shell 字符串或路径 regex 推导“这个就是全量/这个不影响行为”。只有当前 required checks 决定完成与否。

### 2. 共享 decision core 与唯一 execution effect

建议新增：
- `src/core/evidence/verification-plan.ts`：JSON schema/validation、canonical descriptor fingerprint、execution/evaluation 状态转换；
- `src/effects/evidence/verification-execution.ts`：冻结实际 checkout snapshot、调用现有 supervisor、记录一次 execution、查询现有 evidence。

它们替代脚本内重复的可执行 criterion parsing/cache/decision 部分，而不是在旧实现外套一层。两个真实消费者为 prepare/direct execution 与 done/acceptance reader。

source snapshot 首期保守使用完整冻结 tree（有受控 WIP 时形成完整虚拟 tree并前后校验），包含 modes、deletion、symlink/gitlink。execution identity 绑定实际 snapshot、descriptor、cwd、runner/toolchain 和声明的环境依赖。不能只用 review subject，它只覆盖 changed paths。

文案变化导致完整 tree 不同，不伪造 cache hit：旧 full pass 是历史 baseline；当前明确的 delta plan + 当前检查供 semantic acceptance 判断。没有新的 scope 决策时返回 needs_verification_plan，不能自动执行昂贵命令。

### 3. 入口与资源所有权

- `verify-sprint --prepare-acceptance`：prepare plan → preflight → query evidence → 显式 execute missing required checks → publish evaluation。
- `verify-contract`：相同 plan/执行 effect；删去 context 缺席就 uncached execute 的路径。read-only 继续准确表示不改 contract，不能再被 done 当 evidence-only。
- `prompt-handler` 的 done gate：只消费当前 structured evaluation/receipt；不得调用可执行 verifier。missing、failed、stale、waiting 分开报告。
- 普通 verify-sprint/finalize、finish、ship、receipt verify：仅验证 evidence / integration，不 spawn criterion。
- expensive lock 在 cache/plan/preflight 之后获取，只覆盖实际 expensive command；release 必须确认现有 process group 已结束。相同 execution request 在已有锁原语下 recheck，防止同时 miss 后双跑。
- 资源等待返回 typed waiting；不新派 reviewer、不持有 publication lock、不改判 pass。保留 bounded wait、取消后绝不启动、失去 ownership 拒绝写入。

### 4. Evidence 与 target 的生命周期

现有 EvidenceEvent 继续作为权威，execution result/run snapshot 为 immutable 内容；当前 checks/latest 仍只能由 materializer 生成。

当前 evaluation 显式记录 requirements hash、current snapshot、执行引用、baseline/delta coverage、剩余未满足检查。原有 subject 精确选择规则不增加“旧 subject fallback”；新的当前评价在验证 baseline 引用和当前 delta 后产生当前 subject 的事件。

AcceptanceReceipt 绑定已审查 snapshot/VerificationPlan/evaluation；其 base 是审查时上下文。provider expectedContext 在一次审查期间仍必须一致。调整 ChangeAssessment 的历史 packet 验证为相对于该冻结上下文重算，不再用浮动 main 重写旧 opinion 的对象。

merge 阶段再独立验证当前 exact base + candidate tree + 当前集成检查。base 前进只失效 integration assessment / seal，不抹掉旧测试事实；必须生成新的明确 delta/integration decision。不能仅以文件无 overlap 判断没有跨模块风险。若不能证明覆盖则阻止 publication，允许 planner 追加 targeted review/tests 或由原 CI gate 验证；不得自动触发本地 full。

seal 继续 exact base/head/full diff/receipt binding；发布前 CAS/recheck 保留。只在短 publication 窗口保护 target，不要求团队暂停 main 等待测试。

### 5. CI 与 release

将 task-sync、已具备依赖的 workflow/projection preflight 移至 run_bun_tests 前；preflight 失败时 expensive command 计数为零。保持 CI isolate discovery、所有失败汇总、Required / CI 和 release full requirement。

本地默认 focused + integrity；只有明确风险或用户/release 要求才增加 local full。CI 是 publication gate，首期不导入它来伪装 local AcceptanceReceipt。CI attestation bridge、merge queue 和跨 worktree result reuse 均不在此包范围。

### 6. 一次性迁移及删除旧路径

- operator-invoked migration 处理 active executable contracts：保留 exact command/package owner，旧条目的 phase/cost/baseline 需要明确作者决定；缺项失败，不猜测、不自动跑测试。
- 切换新 executable schema 的同一工作包删除旧运行时 parser、criterion_reuse 双列表、无 context 执行和 command-string preflight classifier；重复/混合 schema fail closed。
- archived contracts 只读保留，不能直接拿旧 schema 执行。旧 cache 不作为新 run 的 authority，保留历史但不双读。
- contract 模板与所有生成器（plan-to-todo、project-init-lib、ensure-task-workflow）使用同一 canonical executable template；删除同部分内嵌 authoring 副本。不要借机重做无关模板内容。
- scripts/ 是 helper authority；通过 sync-helper-sources 生成 assets helper。workflow manifest 若新增/删除 helper，assets 和 installed manifest 同步；host 入口通过正式打包/安装读回验证。

## Scope / ownership

- core/effects：上述两个共享模块；现有 src/core/evidence/types.ts、src/effects/evidence/{verify-producer,checks-materializer}.ts 按实际事件扩展调整。
- executor adapters：scripts/{verify-contract.sh,verify-sprint.sh,run-bounded-verifier-command.ts}；src/cli/runtime/helper-runner.ts；现有 process-supervisor/expensive-run-lock 仅改 lock ownership 所需接口。
- reader / acceptance：src/cli/hook/prompt-handler.ts；scripts/acceptance-receipt.ts；src/core/review/change-assessment.ts 与 src/effects/review/change-assessment.ts；scripts/merge-gate.ts、contract-worktree.sh、ship-worktrees.sh 只改新的 evaluation/integration 消费边界。
- authoring / projection：assets/templates/contract.template.md、其安装投影、上述三个生成器、workflow manifest、scripts/check-ci.sh、必要的 reference-config 说明。
- tests：扩展既有 helper/prompt/evidence/acceptance/merge/guardrail 测试；将临时 flow-matrix 提炼为正式小 fixture，避免复制整个 helper-scripts.test.ts。

不修改业务测试的断言、CI 隔离并发、发布保护策略、现有其他 worktree、共享 main 或全局安装（实现后的正式安装读回除外）。

## Acceptance matrix

1. baseline expensive=1；同输入 prepare 重试/done/receipt/finalize/finish/ship 追加 expensive=0。
2. contract/plan 文案或 main 空 commit 不自动执行 full；当前 evaluation 要么重绑定且引用真实 baseline，要么明确 needs_verification_plan；绝不能假报 current full pass。
3. main 变化发生在 full 执行期间：命令结果仍保存在原 snapshot；integration 为 pending/stale，不丢失该执行事实也不自动再跑。
4. 真正源码/lockfile/test command/toolchain 输入改变：不能复用成 current_exact；targeted/full 选择由当前 plan 决定。
5. preflight失败、缺 plan、混合/旧 executable schema：expensive=0；failure != waiting != missing。
6. forced rerun 有 reason；failure/timeout 不缓存为 pass；两个相同请求只启动一次；等待时取消不能后来启动。
7. ledger 不接受 forged/stale/cross-contract/cross-worktree result；latest 只能 materialize；baseline 引用缺失时 fail closed。
8. Receipt 对历史固定上下文验真；integration 对新 base 重新校验；seal 的 base/head 和发布 CAS 不能放宽。
9. CI preflight 红时 full=0；CI 测试红时 Required / CI 仍红；.test.tsx 不遗漏。
10. source/package/default CLI/done helper 路径行为一致；不依靠测试绕过官方入口。

## Verification

开发期间先固化上述失败场景并实际 red-green，用计数器代替昂贵 full command，保留本报告固定基线。执行相关 helper、prompt、evidence、acceptance、merge、process-owner、CI fixture；类型/投影与根六项 integrity checks 按最终 diff 运行。

这是跨 executable schema、evidence authority 与 protected acceptance 的集成切换。最终 freeze 后只生成一次统一 acceptance evidence；若命名测试未覆盖新组合（特别 package-owned runtime 下 plan→execute→ledger→receipt→finish），补一个完整 disposable composed fixture。只有它仍暴露不能以命名测试覆盖的整仓集成风险，才把 full suite 加入最终合同并先声明成本；CI 和显式 release 自有 full 要求不豁免。reviewer 消费这一份 evidence，不重复运行。

## Risks and rollback

最高风险是把历史 baseline 错当成新 tree 全量通过，以及 target lifetime 改动放松 publication gate。采用显式 coverage 引用、typed pending 状态和负向集成测试防止。完整 tree snapshot 保守，可能多返回 needs_verification_plan；这是可观察的 scope 决策，不是允许自动补跑。

整包回滚新 executable schema + readers + 模板，保留 immutable 历史事件。不得回滚到一半后用旧 parser 读新 contract。正式上线前需要一次 active-contract inventory / migration dry-run；实施前在隔离 worktree 核对并迁移本工作包 active contract。

新增文件的理由：research 是人类可读事实入口；本 Approved plan 是实现边界；两个计划中的 core/effect 文件替换现有跨入口重复决策并服务 execution 与 evidence reader 两类消费者。没有新增依赖、服务或持久化目录。

## Annotations
<!-- [NOTE]: prefixed inline. Claude processes all and revises. -->

## Task Breakdown
- [x] 在隔离 contract worktree 固化 done/direct/target/文案/并发组合红测，并冻结 executable schema 与迁移契约。
- [x] 实现共享 plan/decision 与唯一 execution effect，迁移 direct/prepare/done，删除旧 executable parser/reuse/preflight authoring。
- [x] 将 expensive 资源锁下沉至实际执行并完成等待/取消/同请求去重验证。
- [x] 分离 frozen review evaluation 与 current integration target，接通 ledger、receipt、finalize、seal，保留 exact publication gate。
- [x] 同步模板/生成器/package projections、前置 CI preflight，跑命名集成与六项 integrity checks。
- [ ] 冻结一次最终 evidence；完成正式 package/default CLI 读回和验收，再按现有流程发布收口。
