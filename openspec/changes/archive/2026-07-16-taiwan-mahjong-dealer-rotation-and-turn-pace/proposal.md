## Why

目前牌局雖然已可完成單局摸打與下一局銜接，但玩家體驗仍停留在「永遠像東風起手的單局展示」：缺少明確的輪莊 / 連莊持續賽局語意，也缺少足夠清楚的桌面回合辨識。再加上 AI 出牌節奏過快，玩家很難跟上目前到底輪到哪一家。

## What Changes

- 將莊家胡牌連莊、閒家胡牌下家接莊、流局原莊續莊的賽局機制正式納入權威規格，讓牌局不再只是單局 MVP。
- 在四家牌框中加入明確的莊家旗標，讓玩家可直接看出當前哪一家是莊家。
- 強化當前出牌者的牌框高亮，讓玩家無需只看上方摘要也能知道目前輪到哪一家。
- 將 AI 自動出牌節奏改為約兩秒級別，而不是瞬間推進，讓真人有可閱讀的觀戰與跟牌節奏。

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `mahjong-round-flow-core`: 下一局初始化與流局後續局規則需明確定義輪莊 / 連莊語意，讓賽局可持續推進。
- `mahjong-vue-table-shell`: 牌桌需顯示莊家旗標、當前出牌者強高亮，並以較慢的 AI 節奏推進畫面。

## Impact

- Affected specs: `mahjong-round-flow-core`, `mahjong-vue-table-shell`
- Affected code:
  - Modified: `src/core/rules/roundFlow.ts`, `src/core/rules/types.ts`, `src/stores/gameSession.ts`, `src/views/game/components/GameTableView.vue`, `src/views/game/types.ts`, `src/views/game/selectors.ts`, `tests/core/dealer-progression.test.ts`, `tests/ui/interactive-turn-loop.test.ts`, `tests/ui/game-table-view.test.ts`, `tests/ui/next-round-flow.test.ts`, `e2e/game-table.smoke.spec.ts`
  - New: none
  - Removed: none
