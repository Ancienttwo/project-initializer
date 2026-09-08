> **Archived**: 2026-09-08 19:29
> **Related Plan**: plans/archive/plan-20260908-1851-worktree-cleanup-closeout.md
> **Outcome**: Completed
> **Lifecycle**: plan
> **Parent Run ID**: run-20260908-1929
> **Archive Projection V1**: `plans/plan-20260908-1851-worktree-cleanup-closeout.md` => `plans/archive/plan-20260908-1851-worktree-cleanup-closeout.md`
> **Archive Projection V1**: `tasks/notes/20260908-1851-worktree-cleanup-closeout.notes.md` => `tasks/archive/notes-20260908-1929-worktree-cleanup-closeout.md`
> **Archive Projection V1**: `tasks/contracts/20260908-1851-worktree-cleanup-closeout.contract.md` => `tasks/archive/contract-20260908-1929-worktree-cleanup-closeout.md`
> **Archive Projection V1**: `tasks/reviews/20260908-1851-worktree-cleanup-closeout.review.md` => `tasks/archive/review-20260908-1929-worktree-cleanup-closeout.md`

# Plan: Worktree 合并后清理闭环与批量逐项恢复

> **Status**: Archived
> **Created**: 20260908-1851
> **Slug**: worktree-cleanup-closeout
> **Planning Source**: waza-think
> **Orchestration Kind**: host-plan
> **Source Ref**: (none)
> **Artifact Level**: work-package
> **Promotion Reason**: verification_boundary
> **Verification Boundary**: Single-publication cleanup failure, real Git batch cleanup, dry-run safety, downstream template parity and session hint regression
> **Rollback Surface**: Revert only this work-package code and documentation; preserve already published task commits
> **Spec**: `docs/spec.md`
> **Research**: See `docs/researches/`
> **Task Contract**: `tasks/archive/contract-20260908-1929-worktree-cleanup-closeout.md`
> **Task Review**: `tasks/archive/review-20260908-1929-worktree-cleanup-closeout.md`
> **Implementation Notes**: `tasks/archive/notes-20260908-1929-worktree-cleanup-closeout.md`

## Agentic Routing
- Selected route: planning
- Routing reason: Captured from waza-think planning output.
- Source ref: (none)
- Due diligence:
  - P1 map: See captured planning output below.
  - P2 trace: See captured planning output below.
  - P3 decision rationale: See captured planning output below.

## Workflow Inventory
Complete this inventory before implementation. If any line is unknown, keep the plan in Draft and fill it before projection.

- Active plan: `plans/archive/plan-20260908-1851-worktree-cleanup-closeout.md`
- Sprint contract: `tasks/archive/contract-20260908-1929-worktree-cleanup-closeout.md`
- Sprint review: `tasks/archive/review-20260908-1929-worktree-cleanup-closeout.md`
- Implementation notes: `tasks/archive/notes-20260908-1929-worktree-cleanup-closeout.md`
- Deferred-goal ledger: `tasks/todos.md`
- Current checks: `.ai/harness/checks/latest.json`
- Run snapshots: `.ai/harness/runs/`
- Scope authority: `tasks/archive/contract-20260908-1929-worktree-cleanup-closeout.md` `allowed_paths`
- Concurrency rule: `.ai/harness/active-plan` selects the active plan for this worktree when present; `.ai/harness/active-worktree` records the owning worktree. If another worktree already owns active work, open or switch to the matching worktree instead of serializing unrelated plans.
- Execution isolation: approved contract-level work projects through `repo-harness run plan-to-todo --plan plans/archive/plan-20260908-1851-worktree-cleanup-closeout.md` and may start `repo-harness run contract-worktree start --plan plans/archive/plan-20260908-1851-worktree-cleanup-closeout.md`.

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
- Contract file: `tasks/archive/contract-20260908-1929-worktree-cleanup-closeout.md`
- Review file: `tasks/archive/review-20260908-1929-worktree-cleanup-closeout.md`
- Implementation notes file: `tasks/archive/notes-20260908-1929-worktree-cleanup-closeout.md`
- Template: `.claude/templates/contract.template.md`
- Verification command: `repo-harness run verify-contract --contract tasks/archive/contract-20260908-1929-worktree-cleanup-closeout.md --strict`
- Active plan rule: this captured plan is written to `.ai/harness/active-plan` and the owning worktree is written to `.ai/harness/active-worktree` unless --no-active is used. Do not infer active execution from the latest non-archived plan.

## Handoff

- Checks file: `.ai/harness/checks/latest.json`
- Session handoff: `.ai/harness/handoff/current.md`

## Promotion Gate

- **Merge/PR unit**: Captured plan `plans/archive/plan-20260908-1851-worktree-cleanup-closeout.md` is the proposed mergeable execution unit; revise before execute if this is only a checklist step.
- **Rollback surface**: Revert only this work-package code and documentation; preserve already published task commits
- **Verification boundary**: Single-publication cleanup failure, real Git batch cleanup, dry-run safety, downstream template parity and session hint regression
- **Review/acceptance boundary**: `tasks/archive/review-20260908-1929-worktree-cleanup-closeout.md` must record pass against the captured acceptance criteria.
- **High-risk surface**: Risks named in captured planning output; keep the plan Draft if risk ownership is not concrete.
- **Why not checklist row**: verification_boundary

## Evidence Contract

- **State/progress path**: `plans/archive/plan-20260908-1851-worktree-cleanup-closeout.md` task breakdown, `tasks/todos.md` deferred-goal ledger, `tasks/archive/contract-20260908-1929-worktree-cleanup-closeout.md`, `tasks/archive/review-20260908-1929-worktree-cleanup-closeout.md`, and `tasks/archive/notes-20260908-1929-worktree-cleanup-closeout.md`
- **Verification evidence**: `.ai/harness/checks/latest.json`, `.ai/harness/runs/`, and the commands named in the captured planning output
- **Evaluator rubric**: `tasks/archive/review-20260908-1929-worktree-cleanup-closeout.md` must record a passing Waza /check style recommendation
- **Stop condition**: all task breakdown items are complete, sprint verification passes, and the review recommends pass
- **Rollback surface**: Revert only this work-package code and documentation; preserve already published task commits

## Captured Planning Output

### Goal and scope
将 worktree 清理纳入合并后收尾：仅当本任务目录、Git worktree 登记和本地任务分支均已移除时报告完整收尾。已合并但清理失败须明确报告，并可通过现有 cleanup 命令恢复。批量清理逐项拒绝不安全项，继续处理安全项，最终汇总并返回失败状态表示仍有受阻项。
用户已批准执行修复，并追加批准主分支同步、本任务本地合并与清理；不执行历史目录批量清理，不推送或发布。实现作为一个可独立验证、回滚的 work-package，执行时走 plan-to-todo -> contract worktree。

### P1 — Map
当前基线 a1393e44。scripts/contract-worktree.sh 拥有单任务 finish/cleanup；scripts/ship-worktrees.sh 拥有批量枚举与分派；worktree-merge-lib.sh 是现有合并判定边界，继续复用。assets/templates/helpers/ 下同名脚本是下游投影，必须同步。src/cli/hook/session-context.ts 仅投影操作提示，不做清理。现有 tests/contract-worktree-single-publication.test.ts、tests/contract-worktree-squash-cleanup.test.ts、tests/helper-scripts.test.ts 和 tests/session-context.test.ts 提供真实临时 Git 仓库及提示验证面。

### P2 — Trace and root cause evidence
输入 finish --merge：校验并发布 publication commit -> 提交 finish transaction -> 输出 merged -> 从目标主 worktree 调用 cleanup。scripts/contract-worktree.sh:2197 的 cleanup 失败分支仅 warning，最后 echo 成功使整条命令仍可能返回 0。合并事实必须保留，但返回值不能掩盖未完成收尾。
输入 ship-worktrees --cleanup-merged：枚举 -> worktree_merge_mode -> 状态检查 -> dirty guard -> cleanup。scripts/ship-worktrees.sh:1382 的 guard 失败直接 exit 1，使后续安全项得不到处理；status repair 中 fail/exit 及 cleanup 子命令失败也须纳入逐项隔离。--dry-run 同样存在首项退出问题。
症状：任务合并后目录滞留，单个 dirty 项阻断后续批量处理。根因：单项收尾结果被吞没、批处理用全局终止表达单项拒绝。修复前证明：在临时仓库中注入 cleanup 拒绝，并构造排序在前的 dirty merged 项加后续 clean merged 项，先记录旧行为失败。回归护栏：目标提交不回滚、dirty 内容不变、后续安全项被移除、最终状态为非零。

### P3 — Decision
最小方案：修改现有控制流与提示，不引入新的状态库、服务、命令、依赖或清理策略。finish 在已提交事务之后处理 cleanup；清理失败返回 1，明确输出“merged; cleanup incomplete”、publication SHA、保留路径和从目标主 worktree 运行的精准 cleanup 恢复命令。不得触发 transaction abort 或建议重跑 merge。成功输出必须在目录、登记、本地分支移除的现有 cleanup 成功条件成立后发出。
批处理在每个候选的子进程边界隔离退出，显式检查各命令返回值，避免 shell 条件上下文抑制 errexit 后继续危险操作。保留已清理/预览可清理、受阻、未合并跳过的计数和逐项原因；任一已合并候选受阻或操作失败则遍历结束后 exit 1，否则 0。--slug 保持精确过滤，--dry-run 不删除且遍历完整；不将预览称为已清理。
保护现有 dirty、锁定、身份变化、合并判定及当前目录检查；未知状态拒绝该项。保留显式 --discard-scaffold-only 的现有语义，默认不启用。Draft PR 与 finish --no-merge 保留目录。单任务 finish 仅清理自身，不能顺带扫描其他任务。
风险：调用者可能把 finish 非零当成未合并并重试；输出与文档明确 publication 已完成，仅重试 cleanup，并验证既有调用路径不回滚已发布提交。10x worktree 时瓶颈仍为逐仓 Git 状态/合并判定；顺序运行维持身份与数据安全，不并行化删除。

### File targets
涉及超过 5 个文件：4 个脚本（scripts 与 assets/templates/helpers 同名的 contract-worktree.sh、ship-worktrees.sh），src/cli/hook/session-context.ts，以上 4 个现有测试文件，docs/reference-configs/agentic-development-flow.md；加执行流程生成的 plan/contract/review 等必要工作流产物。只在现有文件内修复；新增 plan 用于独立验收边界，不新增产品抽象。
SessionStart 提示改为逐项保留 dirty 并继续处理安全项，不再声称阻断整批。流程文档将本地合并收尾顺序写为验证 -> 合并确认 -> 本任务 cleanup -> readback -> 完成，PR 路径保持合并前保留。

### Acceptance and verification
1. finish 正常路径自动移除目录、Git worktree 登记和本地任务分支；cleanup 被拒绝时 exit 1，目标 publication SHA 不变，恢复命令可单独完成清理。
2. 批次包含 dirty merged + clean ancestor merged + clean squash-absorbed + unmerged：前者内容保留，两种安全项清理，未合并保留，最终 exit 1 且汇总正确；改变枚举顺序不改变结果。
3. dry-run 完整报告同一批次且不删除任何目录/分支；status 不可读、锁定或单项 cleanup 失败不阻止后续安全项；--slug 不触碰其他项。已有 scaffold 显式清理保护继续通过。
4. SessionStart 文案与新控制流一致；脚本模板字节一致。
执行时在 contract JSON Verification Plan 中逐条声明 phase/cost/evidence policy/necessity/environment inputs，不复制第二份可执行验收清单。聚焦命令：
- bun test --timeout 60000 tests/contract-worktree-single-publication.test.ts tests/contract-worktree-squash-cleanup.test.ts
- bun test --timeout 60000 tests/helper-scripts.test.ts --test-name-pattern 'ship-worktrees'
- bun test --timeout 60000 tests/session-context.test.ts --test-name-pattern 'worktree'
- cmp scripts/contract-worktree.sh assets/templates/helpers/contract-worktree.sh
- cmp scripts/ship-worktrees.sh assets/templates/helpers/ship-worktrees.sh
实现后的 repository integrity：bash scripts/check-deploy-sql-order.sh；bash scripts/check-architecture-sync.sh；bash scripts/check-task-sync.sh；bash scripts/check-task-workflow.sh --strict；bun scripts/inspect-project-state.ts --repo . --format text；bun src/cli/index.ts init --repo . --dry-run。
测试范围覆盖收尾事务、真实 Git 清理、下游模板和提示，不要求全套 bun test。先冻结实现再验收，昂贵项通过 verify-sprint --prepare-acceptance 记录并复用；如估计单步超过 10 分钟先说明成本及必要性。只做一次适用 /check，不增加未请求的跨模型审查。

### Completion and rollback
实现完成后同步 tasks，记录聚焦测试和完整性检查结果，将稳定行为写入流程文档，再按已获授权的交付边界结束；发布/合并操作不由本计划推断授权。代码回滚为 revert 此 work-package，不回滚已成功合并的用户任务。删除前的安全检查不可豁免；已安全删除的目录不靠代码回滚恢复。历史积压清理作为独立显式操作，不在测试中触碰真实用户 worktrees。

## Annotations
<!-- [NOTE]: prefixed inline. Claude processes all and revises. -->

## Task Breakdown
- [x] 在临时 Git fixtures 中证明单项 cleanup 失败被吞没和批处理首项退出两个缺口。
- [x] 修复 finish 合并后清理失败状态及精准恢复指引，保留 publication 事务事实。
- [x] 修复批量逐项隔离、继续执行、汇总状态与 dry-run 行为，并同步下游模板。
- [x] 更新 SessionStart 提示、现有聚焦回归用例和流程文档。
- [x] 冻结变更，完成 contract 聚焦验收及 required integrity checks，记录证据与收尾状态。
