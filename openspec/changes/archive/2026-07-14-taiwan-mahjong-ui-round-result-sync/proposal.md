## Why

目前牌桌 UI 只顯示 `outcome` 狀態字樣，例如 `win` 或 `draw`，但玩家仍看不到誰胡牌、誰放槍、總台數、流局原因，畫面也沒有把「本局已結束」這件事清楚映射出來。主線雖然已能在 core/store 層結束本局與開下一局，但結果資訊還沒有完整接回玩家可見畫面。

這一步的工作不是新增規則，而是把既有 `RoundResult` 映射成穩定、唯讀的結果摘要 UI。

## What Changes

- 在 selector / view model 映射既有 `RoundResult`
- 在牌桌 UI 顯示最小結果摘要區塊
- 補齊測試，驗證 win / draw 結果能正確顯示且 view 不重算規則

## Non-Goals

- 不新增新的 scoring 規則
- 不做複雜結果 modal 或動畫
- 不在 view 層重算胡牌、流局或支付責任

## Capabilities

### New Capabilities

- `mahjong-vue-table-shell`: 牌桌結果摘要映射與顯示

### Modified Capabilities

- `mahjong-vue-table-shell`: 從只顯示 outcome 狀態字樣，擴充為顯示結果摘要細節

## Impact

- Affected specs: `mahjong-vue-table-shell`
- Affected code:
  - Modified: `src/views/game/selectors.ts`, `src/views/game/types.ts`, `src/views/game/components/GameTableView.vue`
  - New: `tests/ui/round-result-sync.test.ts`
  - Removed: (none)
