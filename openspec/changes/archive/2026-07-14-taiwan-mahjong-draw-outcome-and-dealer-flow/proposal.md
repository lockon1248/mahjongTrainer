## Why

目前主線已完成真人摸打、宣告視窗與自回合動作，但單局結束後仍缺少「誰在下一局坐莊」與「是否能建立下一局」的閉環。現況 core 已能回傳 `win` / `draw` outcome，但 session 仍停在單一局結果，沒有把已定案的莊家規則接回下一局初始化。

這一步只實作 baseline 已定案內容：

- 莊家胡牌可連莊
- 閒家胡牌時由下家坐莊
- 流局保留為明確終局結果，但不猜測流局後是否連莊、查聽或聽牌獎懲

## What Changes

- 在 core 補上由上一局 result 推導下一局莊家與圈風的入口
- 在 store 提供從已結束牌局建立下一局的流程
- 在牌桌 UI 顯示結果狀態下的「下一局」入口，僅在已定案條件下建立下一局
- 補齊 core / store / UI 測試，驗證莊家胡牌連莊、閒家胡牌下家坐莊，以及流局時不猜測後續規則

## Non-Goals

- 不處理流局是否連莊
- 不處理流局查聽、聽牌獎懲
- 不處理整場對局、圈風推進到完整比賽結束
- 不處理結果詳情面板或複雜結算 UI

## Capabilities

### New Capabilities

- `mahjong-round-flow-core`: 已結束牌局建立下一局的莊家/圈風推導入口
- `mahjong-vue-table-shell`: 結束牌局後的下一局建立入口

### Modified Capabilities

- `mahjong-round-flow-core`: 讓既有 `win` / `draw` outcome 能銜接到下一局初始化邊界
- `mahjong-vue-table-shell`: 讓 store/session 不再只停在單局結果，而可在已定案條件下建立下一局

## Impact

- Affected specs: `mahjong-round-flow-core`, `mahjong-vue-table-shell`
- Affected code:
  - Modified: `src/core/rules/roundFlow.ts`, `src/core/rules/types.ts`, `src/core/types/table.ts`, `src/stores/gameSession.ts`, `src/views/game/GameView.vue`, `src/views/game/components/GameTableView.vue`, `src/views/game/selectors.ts`, `src/views/game/types.ts`
  - New: `tests/core/dealer-progression.test.ts`, `tests/ui/next-round-flow.test.ts`
  - Removed: (none)
