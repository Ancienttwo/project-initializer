# projection manifest 遲到 writer 調查（2026-09-09）

## 1. 判斷

沒有證據顯示 `docs/architecture/.projection-manifest.json` 被 archctx 的遲到 writer 覆蓋過，信心 HIGH。觀察到的舊 `baseHeadSha` 來自 sticky provenance 疊加另一層順序效應：檔案在 codex/* 分支上生成，PR 合併後才落到 main。

全歷史唯一一次真實內容回退發生在 git merge 衝突解析 `1e2e9aef`（2026-08-25），前後序列是 `6aeb9346` → `1e2e9aef` → `b3e42f7f` 人手 restore。該次 writer 是 git，不是 archctx。

## 2. 資料面

323 份 receipt 裡有 117 份滿足 `inputSnapshot.baseHeadSha ≠ headSha`，屬穩態分佈。`outputSnapshot` 的 `(sourceTreeDigest, modelDigest)` 配對重現 0 次。manifest 的 209 個 first-parent commit 中只有 1 個 blob 重現，即上述 merge。

`baseHeadSha` 唯一一次 ancestry 回退是 `91b5b6eb` → `b94a5949`，同時語義 digest 前進，符合 PR 合併次序。

## 3. 被更正的前提

`archctx projection run` 是短命 RPC client，`planUpdate` 與 `applyUpdate` 實際跑在常駐 archctxd，每 worktree 一個。`node_modules/archctx/bin/archctx.mjs:43341` 的 createCliRuntime 走 `createOrStartRuntimeRpcClient`；repo-harness `src/effects/architecture/archctx-provider.ts:234` 原樣繼承 env，因此永遠走 RPC。

跨進程鎖在 `archctx.mjs:38904 acquireDaemonLock`，用 O_EXCL 檔鎖，root 經 `realpathSync.native` 正規化（`archctx.mjs:16174`）。daemon 內 `withWriter`（`runtime-daemon/src/index.ts:5602`）包住整個 `applyUpdate`（`:2844-2907`），hash 檢查與寫入都落在臨界區內。

## 4. writer 呼叫鏈

這是唯一寫 manifest 的路徑；repo-harness 的 src、scripts、assets、.ai/hooks 都沒有直接寫入或 git restore 該路徑。

`projection-orchestrator.ts:116` / `cli/commands/architecture-projection.ts:155` / `projection-acceptance.ts:178,254,324`
→ `archctx-provider.ts:314` runArchitectureProjection
→ `:320` args
→ `:239` spawn 子進程
→ archctx `main.ts:299` projection
→ `main.ts:3701` createCliRuntime
→ RPC
→ `main.ts:1550` applyProjectionProtocolFixedPoint
→ `main.ts:1408` planUpdate（`main.ts:2004` 在此讀 expectedHash）
→ `main.ts:1418` applyUpdate
→ `runtime-daemon/src/index.ts:2855` withWriter
→ `:2874` changeSetEngine.apply
→ `changeset-engine/src/index.ts:348` assertExpectedHash
→ `:352` await journal.recordChangeSetFile（`local-store-sqlite/src/index.ts:2185`，同步 SQLite 包成 async，非真 I/O 窗口）
→ `:362` renameSync
→ `:368` atomicWriteFile

安裝的 0.5.8 對應 `archctx.mjs:17564-17629, 17657, 9052`，與研究 revision bcafdfa5 形狀一致。

## 5. 暫停點表

情境為兩個並發 projection run 打同一 root、共用單一 daemon。

- plan 後 apply 前：`Expected hash mismatch` 拒絕，實測 6/6。
- 進 applyUpdate 但未到 hash 檢查：另一方拿到 `runtime writer is locked`。
- journal await 中：不可達。withWriter 獨占，且生產 journal 是同步的。
- 寫入後 receipt 前：另一方 CAS 失敗，這正是 job-ca58d5a7 的形狀。

附錄 E 的 TOCTOU 靠注入自製 journal 才撐得開，屬測試 seam。

## 6. 實驗

環境為安裝版 0.5.8，throwaway repo 加 ARCHCONTEXT_STATE_DIR 隔離。

- 24 並發 init 共用同一 daemon。
- 8 並發裸 RPC writer 不排隊，只靠 withWriter 保護。
- 生產形狀的並發 apply 跑 6 輪，每輪恰一勝一敗，無殘留 backup。

## 7. 兩道守衛失明

記錄用，不在本次修法範圍。

profile `architecture-documentation-projection` 的 worktree digest 忽略整個 `docs/architecture`（`projection-engine/src/index.ts:626-637`）。repo-harness 的 `assertExpectedSnapshot` ignore set 同樣含 `docs/architecture`（`archctx-provider.ts:93-99, 547-555`）。假如真有覆蓋發生，fence 既不攔截也不留痕，H2 的否證來自歷史掃描，與 fence 無關。

repo-harness `projection-jobs.ts:311` 的目錄鎖只覆蓋 queue drain，apply、adopt 與 acceptance 三個入口都繞過它。今天無害，因為下游 daemon 已經序列化。

## 8. 唯一未實測覆蓋的可達路徑

兩軌獨立指出，皆為 inferred。

`acquireDaemonLock`（`archctx.mjs:38904`；研究 revision `runtime-daemon/src/index.ts:8369-8377, 8417-8421`）在 EEXIST 且 isStaleLock 成立時無條件 rmSync 再重試，不校驗刪掉的是否仍是剛才檢查的那把鎖。兩個 starter 同時看到 stale lock 就可能得到兩個活 daemon，withWriter 於是失去跨 daemon 效力。另一個入口是 HOME 或 ARCHCONTEXT_STATE_DIR 不一致。

判別實驗：兩個 STATE_DIR 各起一個 daemon 打同一 root，daemon1 在 assertExpectedHash 之後注入延遲，daemon2 完整 apply B，隨後恢復 A。預期最終內容為 A、雙方都回報 applied、fence 不報錯。若不注入延遲也能重現，H4 升級為可達。

## 9. 有硬證據的獨立 slice

不在本次修法範圍。job-ca58d5a7 的 journal 在 2026-09-09T09:29:58.858Z committed，manifestFiles 含 manifest（existed true，pid 89251），同一 job 的 receipt 卻是 09:31:19.504Z attempt 2 noop、files=[]。應成立的不變量是「journal committed ⇒ 存在聲明該寫入的 receipt」。證據在 `.ai/harness/handoff/manifest-writer-journal-proof-20260909.json`。

## 10. 明確不做

- 不刪 sticky，固定點的五項輸入定義正確。
- 不再加一次 hash 檢查，單 daemon 下 withWriter 已覆蓋。
- 不把 fence 失明、receipt 對帳、寫入序列化、聲明輸出範圍混為同一個保證。

10 倍並發下最先壞掉的是 CAS 失敗率與 receipt 對帳缺口的放大，寫入序列化本身還撐得住。

## 11. 覆蓋缺口

- 未逐一掃過 28 個 codex/* worktree 分支的歷史。
- MCP 通用 write-file 工具面理論上可寫任意路徑。
