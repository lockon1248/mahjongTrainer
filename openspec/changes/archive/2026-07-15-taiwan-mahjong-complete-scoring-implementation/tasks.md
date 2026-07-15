## 1. 主線交接與 profile-aware rule config

- [x] 1.1 依「Task 5: 主線 board 交接到 implementation child change」更新 `openspec/changes/taiwan-mahjong-mainline-progress-board-live/design.md`，讓目前 active child change 改為 `taiwan-mahjong-complete-scoring-implementation`，並以主線 board 內容審查驗證舊 spec catalog 已記為完成、新 implementation 已成為 current child change。
- [x] 1.2 落地「rule config MUST expose scoringProfile as a first-class setting」、「rule config MUST provide profile-aware scoring catalog inputs」與「Task 1: profile-aware rule config 落地」，讓 root config 與 scoring slice 能攜帶 `classic-taiwan` / `flower-wind-bonus`、`maxTai` 與 profile-aware 設定來源，並以 `tests/core/rule-config-core.test.ts` 驗證。

## 2. 結構化 scoring item 與核心計台

- [x] 2.1 落地「結構化 scoring item 必須成為 runtime 結果輸出」、「Task 2: 結構化 scoringItems 與完整 pattern evaluation 落地」與「以結構化 scoring item 取代純字串 scoringItems」，讓 `buildSettlementResult`、`validateStandardWin` 與 round result 使用結構化 `scoringItems`，並以 `tests/core/scoring-settlement.test.ts`、`tests/core/scoring-win-validation.test.ts` 驗證。
- [x] 2.2 落地「profile-aware scoring catalog MUST drive runtime evaluation」、「Task 2: 結構化 scoringItems 與完整 pattern evaluation 落地」與「以 profile-aware scoring catalog 驅動 pattern evaluation」，讓 scoring core 依 active profile 評估第一批高價值 pattern，並以 `tests/core/scoring-patterns.test.ts` 驗證。
- [x] 2.3 落地「conflict and override rules MUST be enforced before totalTai is finalized」、「Task 3: profile 差異與衝突規則回歸」與「先落地第一批高價值 pattern 與衝突規則」，讓 `concealed-self-draw`、`full-flush`、暗槓覆蓋明槓與 `all-sequences` 排他條件在算台前被正確裁決，並以新增的 `SCORE-CONFLICT-*` 類型 `tests/core/scoring-settlement.test.ts` 驗證。

## 3. Vue 結果摘要與 E2E

- [x] 3.1 落地「和牌結果摘要 MUST render structured scoring items」、「Task 4: Vue 結果摘要與 E2E 接線」與「round result 與 Vue shell 只做最小必要適配」，讓 selector、view model 與 `GameTableView` 能顯示逐項台型名稱、台數與 `totalTai`，並以 `tests/ui/round-result-sync.test.ts`、`tests/ui/game-table-view.test.ts` 驗證。
- [x] 3.2 落地「Vue result summary MUST reflect profile-driven scoring differences without local rule logic」與「Task 4: Vue 結果摘要與 E2E 接線」，讓相同手牌在不同 scoring profile 下的結果摘要只依 snapshot 資料改變，並以 `e2e/game-table.smoke.spec.ts` 與至少一條 `SCORE-PROFILE-*` 對應流程驗證。

## 4. 完整驗證與回填

- [x] 4.1 完成這個 change 的 runtime 回歸，讓 `npm run test -- tests/core/scoring-patterns.test.ts tests/core/scoring-settlement.test.ts tests/core/scoring-win-validation.test.ts tests/core/rule-config-core.test.ts tests/ui/round-result-sync.test.ts tests/ui/game-table-view.test.ts`、`npm run test -- tests/core/round-flow-claims.test.ts tests/core/human-self-turn-actions.test.ts` 與 `npx playwright test e2e/game-table.smoke.spec.ts` 全部通過，並以命令輸出驗證。
