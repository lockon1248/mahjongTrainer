## Context

`2026-07-15-taiwan-mahjong-complete-scoring-catalog` 已經把雙 profile、權威牌型目錄、衝突規則、E2E 契約與 v1 邊界同步到主 specs。但 runtime 仍停在初始示範版：

- `ScoringRuleConfig` 只有 `minimumTai` 與少量 `specialHands`
- `evaluateScoringPatterns` 只會回傳少數 pattern id 字串
- `buildSettlementResult` 只會把 pattern id 用固定對照表加總
- `GameTableView` 只會把字串 id 轉成人類可讀名稱

這與目前主 specs 已要求的行為有落差：
- 需要 `classic-taiwan` / `flower-wind-bonus` profile 切換
- 需要互斥、覆蓋、疊加與封頂入口
- 需要結構化 `scoringItems`，供 UI 與 E2E 驗證

因此這個 change 的工作不是再擴寫規格，而是把目前已定案的權威規則真正落地到 code、tests 與現有和牌結果摘要 UI。

## Goals / Non-Goals

**Goals:**

- 讓 `rule config` 能切換 `classic-taiwan` 與 `flower-wind-bonus` 兩套 scoring profile。
- 讓 scoring core 依權威牌型目錄回傳結構化 `scoringItems`，並正確處理第一批 profile 差異與衝突規則。
- 保持 round result、Pinia selector 與現有牌桌結果摘要 UI 可以直接消費新的 `scoringItems` 資料形狀。
- 以 test-first 補齊 core unit tests 與至少一條 browser E2E 回歸。

**Non-Goals:**

- 這一輪不實作胡牌彈窗。
- 這一輪不新增 AI 和牌展示區塊。
- 這一輪不處理低關聯房規加成，如 `幸運柴神`、`拉莊`。
- 這一輪不重做整個牌桌 UI 版型。

## Decisions

### 以結構化 scoring item 取代純字串 scoringItems

目前 `scoringItems: string[]` 不足以表達名稱、台數、profile 差異與命中原因。本 change 改為由 core 回傳結構化 item，至少包含：
- 穩定 `patternId`
- 顯示名稱
- `tai`
- 簡短命中原因或來源摘要

這樣現有結果摘要 UI 可以直接渲染，後續胡牌彈窗也不需要再從 id 反推規則。

### 以 profile-aware scoring catalog 驅動 pattern evaluation

不再把台數寫死在 `settlement.ts` 的單一對照表。改為由 scoring catalog 依 profile 輸出可用 pattern 定義，讓 `patterns` 與 `settlement` 共用同一份來源。

這能避免 `classic-taiwan` 與 `flower-wind-bonus` 在花牌、風牌、槓牌上的差異散落在多個條件分支中。

### 先落地第一批高價值 pattern 與衝突規則

雖然 baseline 已列出完整第一版目錄，但這一輪優先先把會直接影響可玩性與你目前測試需求的第一批落地：
- `dealer-win`
- `self-draw`
- `concealed-hand`
- `concealed-self-draw`
- `dragon-triplet`
- `big-three-dragons`
- `little-three-dragons`
- `heaven-win`
- `earth-win`
- `seat-flower` / `any-flower`
- `seat-or-round-wind` / `any-wind-triplet`
- `exposed-kong-bonus` / `concealed-kong-bonus`
- `all-sequences`
- `all-triplets`
- `half-flush`
- `full-flush`
- `single-wait`

以及對應衝突：
- `concealed-self-draw` 覆蓋 `concealed-hand` 與 `self-draw`
- `full-flush` 覆蓋 `half-flush`
- 暗槓覆蓋同組明槓計台
- `all-sequences` 的排他條件

其餘已列入 baseline 但尚未必要的 pattern 若缺少現成 context，可維持未啟用或延後，但不得回退既有權威 spec。

### round result 與 Vue shell 只做最小必要適配

這一輪不做新彈窗，因此 UI 只做最小必要改動：
- selector 將新的 `scoringItems` 帶到 view model
- `GameTableView` 顯示結構化台型名稱與台數
- E2E 只驗證畫面有正確逐項台型與總台數

不在這個 change 擴大成完整和牌明細面板。

## Implementation Contract

### Task 1: profile-aware rule config 落地

- Observable behavior:
  - 呼叫端可以建立帶有 `scoringProfile` 的 root rule config，並取得對應 scoring config 切片。
- Interface / data shape:
  - `MahjongRuleConfig` 與 `ScoringRuleConfig` 必須能表達 `scoringProfile`、封頂入口與 pattern 設定來源。
- Acceptance criteria:
  - `tests/core/rule-config-core.test.ts` 新增 profile 切換與 config slice 測試通過。
- Scope boundaries:
  - 只處理 scoring 相關設定，不改 round flow 其他無關規則。

### Task 2: 結構化 scoringItems 與完整 pattern evaluation 落地

- Observable behavior:
  - `validateStandardWin` 與 `buildSettlementResult` 會回傳結構化 `scoringItems` 與正確 `totalTai`。
- Interface / data shape:
  - `SettlementResult.scoringItems`、`WinningEvaluationResult.matchedPatterns` 與 round result 摘要資料形狀需同步更新。
- Failure modes:
  - 若 `minimumTai` 未達門檻，仍可看出命中的結構化台型，但 settlement 必須為 `null`。
- Acceptance criteria:
  - `tests/core/scoring-patterns.test.ts`、`tests/core/scoring-settlement.test.ts`、`tests/core/scoring-win-validation.test.ts` 通過。

### Task 3: profile 差異與衝突規則回歸

- Observable behavior:
  - 同一手牌在不同 profile 下會得到不同 `scoringItems`。
  - 覆蓋 / 互斥規則不會重複計台。
- Acceptance criteria:
  - 新增 `SCORE-PROFILE-*` 與 `SCORE-CONFLICT-*` 對應的 core tests 通過。

### Task 4: Vue 結果摘要與 E2E 接線

- Observable behavior:
  - 和牌結果摘要會顯示逐項台型名稱與對應台數，而不是只顯示舊字串映射。
- Interface / data shape:
  - `src/views/game/types.ts` 與 selector 的 `resultSummary.scoringItems` 需改為結構化 item 陣列。
- Acceptance criteria:
  - `tests/ui/round-result-sync.test.ts`、`tests/ui/game-table-view.test.ts` 與 `e2e/game-table.smoke.spec.ts` 通過。

### Task 5: 主線 board 交接到 implementation child change

- Observable behavior:
  - `taiwan-mahjong-mainline-progress-board-live` 會顯示目前 active child change 已從 spec catalog 切到 implementation。
- Acceptance criteria:
  - 主線 board 內容審查可看到新的 child change 名稱與下一步規劃。

## Risks / Trade-offs

- [scoringItems 改型別會連動多層資料流] → 先從 core types、result types、selector、view model 一路做小步更新，並用 UI tests 鎖住。
- [完整 catalog 很大，容易一次做太多] → 先以 baseline 裡已列為高價值且有明確條件的 pattern 優先，剩餘項目只在權威 spec 已定義且有足夠 context 時追加。
- [profile 差異容易讓條件判斷分散] → 以 profile-aware catalog 集中定義，避免 `if profile === ...` 散落在多個模組。
- [E2E 太重導致節奏變慢] → 只保留關鍵一條真實和牌結果顯示流程，但它必須驗證新的結構化台型明細。

## Open Questions

- 目前沒有。兩套 profile、v1 排除邊界與本輪最小 UI 範圍都已定案。
