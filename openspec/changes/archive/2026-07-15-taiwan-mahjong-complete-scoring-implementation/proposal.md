## Why

完整牌型台數規格已經定案並同步到主 specs，但目前 runtime 仍停留在示範版 scoring：只有少數 pattern、沒有 profile 切換、`scoringItems` 仍是字串陣列，無法支撐這個專案作為台數練習器的核心目標。若不把權威台型目錄、rule config profile 與 UI / E2E 接線一起落地，後續胡牌彈窗與 AI 和牌顯示仍會建立在不完整資料上。

## What Changes

- 將 `classic-taiwan` 與 `flower-wind-bonus` 兩套 scoring profile 落地到 rule config 與 scoring core。
- 以權威牌型目錄實作第一版完整計台，包含 profile 差異、疊加、互斥、覆蓋與最低台數門檻。
- 將 `scoringItems` 從純 pattern id 字串升級為可供 UI 與 E2E 驗證的結構化台型明細。
- 更新 round result / store selector / game table 畫面，使真實和牌結果能顯示結構化台型明細與總台數。
- 補齊對應的 core unit tests 與 browser E2E，確保不同 profile 與關鍵衝突規則都有回歸驗證。

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `mahjong-scoring-core`: 將完整牌型台數目錄、profile 切換、衝突規則與結構化 `scoringItems` 落地到 runtime scoring。
- `mahjong-rule-config-core`: 將 scoring profile、封頂入口、pattern 設定與 profile 差異落地到可消費的 rule config。
- `mahjong-vue-table-shell`: 將和牌結果摘要改為顯示結構化台型明細與 profile 驅動的台數結果。

## Impact

- Affected specs: `mahjong-scoring-core`, `mahjong-rule-config-core`, `mahjong-vue-table-shell`
- Affected code:
  - Modified: `src/core/config/index.ts`, `src/core/config/types.ts`, `src/core/scoring/patterns.ts`, `src/core/scoring/settlement.ts`, `src/core/scoring/types.ts`, `src/core/scoring/validation.ts`, `src/core/types/result.ts`, `src/core/rules/roundFlow.ts`, `src/views/game/selectors.ts`, `src/views/game/types.ts`, `src/views/game/components/GameTableView.vue`, `tests/core/scoring-patterns.test.ts`, `tests/core/scoring-settlement.test.ts`, `tests/core/scoring-win-validation.test.ts`, `tests/core/rule-config-core.test.ts`, `tests/ui/round-result-sync.test.ts`, `tests/ui/game-table-view.test.ts`, `e2e/game-table.smoke.spec.ts`
  - New: `openspec/changes/taiwan-mahjong-complete-scoring-implementation/proposal.md`, `openspec/changes/taiwan-mahjong-complete-scoring-implementation/design.md`, `openspec/changes/taiwan-mahjong-complete-scoring-implementation/tasks.md`, `openspec/changes/taiwan-mahjong-complete-scoring-implementation/specs/mahjong-scoring-core/spec.md`, `openspec/changes/taiwan-mahjong-complete-scoring-implementation/specs/mahjong-rule-config-core/spec.md`, `openspec/changes/taiwan-mahjong-complete-scoring-implementation/specs/mahjong-vue-table-shell/spec.md`
  - Removed: none
