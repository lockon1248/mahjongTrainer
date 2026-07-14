## Why

目前牌桌畫面仍以四塊資訊卡並排為主，既看不到中央捨牌池，也沒有真實牌桌的東南西北相對位置，導致玩家難以用打牌視角理解局面。手牌目前也未依麻將慣用順序排列，讓實際操作與閱讀成本過高。

## What Changes

- 將牌桌改為玩家永遠位於下方、其餘三家依桌位環繞的桌面版型。
- 在中央桌面完整顯示四家的捨牌區，而不是只顯示捨牌數量。
- 將人類玩家手牌排序固定為 `萬 → 筒 → 條 → 風 → 三元 → 花`，提升讀牌與出牌體驗。
- 保留現有 store / rules 流程，只調整 view model 與 UI 呈現邊界。

## Capabilities

### New Capabilities

- (none)

### Modified Capabilities

- `mahjong-vue-table-shell`: 將牌桌從資訊卡式快照提升為具有中央捨牌池、固定手牌排序與東南西北環繞桌位的可玩牌桌介面。

## Impact

- Affected specs: `mahjong-vue-table-shell`
- Affected code:
  - Modified: `src/views/game/components/GameTableView.vue`
  - Modified: `src/views/game/selectors.ts`
  - Modified: `src/views/game/types.ts`
  - Modified: `src/views/game/GameView.vue`
  - Modified: `src/styles/main.css`
  - Modified: `tests/ui/game-table-view.test.ts`
  - Modified: `tests/ui/interactive-turn-loop.test.ts`
  - Modified: `tests/ui/round-result-sync.test.ts`
  - New: `tests/ui/game-table-layout.test.ts`
