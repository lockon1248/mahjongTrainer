## Why

目前牌局在流局後雖然能正確進入 `ended + draw` 狀態，但使用者一按「下一局」，core 會直接丟出 `cannot create next round from unresolved draw outcome`，導致本地練習流程卡死。這和目前產品「能持續打多局練習」的基本需求衝突。

根據目前採用的台灣 16 張麻將規則來源，流局後應由莊家連莊並重新開局；但查聽、臭莊計分等流局後延伸規則仍未定案，因此這個 change 要做的是補齊「可正常開下一局」這條主線，不去猜尚未定案的後續商業邏輯。

## What Changes

- 補一個新的 round-flow delta spec，明確要求流局後可以建立下一局，且沿用原莊家。
- 調整 core 的 `createNextRoundFromCompletedRound()`，讓流局結果不再一律被視為不可續局。
- 調整 store 的下一局流程與回歸測試，驗證流局後可以正常重新開局。
- 同步更新主線 board 的 `current active child change`。

## Non-Goals

- 不在這個 change 內補查聽、流局罰則、聽牌結算。
- 不在這個 change 內新增「臭莊」UI 文案或額外結果摘要。
- 不改動一般胡牌後的連莊與換莊規則。

## Capabilities

### Modified Capabilities

- `mahjong-round-flow-core`: 流局後的下一局建立規則改為可續局，且保留未定案流局後政策不被寫死。

## Impact

- Affected specs: `mahjong-round-flow-core`
- Affected code:
  - Modified: `openspec/specs/mahjong-round-flow-core/spec.md`
  - Modified: `openspec/specs/taiwan-mahjong-rules-baseline.md`
  - Modified: `openspec/changes/taiwan-mahjong-mainline-progress-board/design.md`
  - Modified: `tests/core/dealer-progression.test.ts`
  - Modified: `tests/ui/game-session.store.test.ts`
  - Modified: `src/core/rules/roundFlow.ts`
