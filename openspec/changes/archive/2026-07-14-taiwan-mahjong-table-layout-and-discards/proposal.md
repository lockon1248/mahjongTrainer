## Why

目前牌桌畫面仍以四塊資訊卡並排為主，既看不到中央捨牌池，也沒有真實牌桌的東南西北相對位置，導致玩家難以用打牌視角理解局面。手牌目前也未依麻將慣用順序排列，讓實際操作與閱讀成本過高。

## What Changes

- 將牌桌改為玩家永遠位於下方、其餘三家依桌位環繞的桌面版型。
- 在中央桌面完整顯示四家的捨牌區，而不是只顯示捨牌數量。
- 將人類玩家手牌排序固定為 `萬 → 筒 → 條 → 風 → 三元 → 花`，提升讀牌與出牌體驗。
- 補上副露狀態與中央捨牌池的一致性，讓吃、碰、槓後的 claimed tile 會離開捨牌池，並以副露區呈現於對應玩家。
- 以最小必要範圍修補 `claim-window` 裁決後的狀態同步缺口，避免 UI 呈現與實際牌局狀態脫節。

## Capabilities

### New Capabilities

- (none)

### Modified Capabilities

- `mahjong-vue-table-shell`: 將牌桌從資訊卡式快照提升為具有中央捨牌池、固定手牌排序、東南西北環繞桌位，且能正確呈現副露與捨牌同步狀態的可玩牌桌介面。

## Impact

- Affected specs: `mahjong-vue-table-shell`
- Affected code:
  - Modified: `src/core/rules/roundFlow.ts`
  - Modified: `src/views/game/components/GameTableView.vue`
  - Modified: `src/views/game/selectors.ts`
  - Modified: `src/views/game/types.ts`
  - Modified: `tests/core/round-flow-claims.test.ts`
  - Modified: `tests/ui/game-session.store.test.ts`
  - Modified: `tests/ui/game-table-view.test.ts`
  - Modified: `tests/ui/interactive-turn-loop.test.ts`
  - Modified: `tests/ui/round-result-sync.test.ts`
  - Modified: `tests/ui/human-claim-window.test.ts`
  - Modified: `tests/ui/human-self-turn-actions.test.ts`
  - Modified: `tests/ui/next-round-flow.test.ts`
  - New: `tests/ui/game-table-layout.test.ts`
