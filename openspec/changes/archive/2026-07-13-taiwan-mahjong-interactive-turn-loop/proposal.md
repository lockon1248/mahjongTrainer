## Why

`mahjong-vue-table-shell` 目前只提供唯讀牌桌:store 只呼叫 `createBaselineRound`,畫面只映射初始 snapshot,回合無法前進。核心 `round flow` 早已提供完整、純函式的回合狀態機（`drawForCurrentSeat`、`discardTile`、`resolveClaimWindow`、`evaluateExhaustiveDraw`）與中階 AI 決策（`chooseAiDiscardDecision`、`chooseAiClaimDecision`）,但尚未被 store 與 UI 接上。若不建立可推進的回合迴圈,已完成的核心引擎就無法在瀏覽器中實際被玩到,也無法驗證分層邊界在互動情境下是否成立。

## What Changes

- 在 `gameSession` store 新增回合推進 actions,透過既有 core API 執行「摸牌 → 打牌 →（自動蒐集 AI 宣告）裁決 → 換家」的迴圈,store 只協調不自行判規則。
- store 驅動 AI 三家:輪到 AI 座位時自動出牌;claim-window 由 store 蒐集各家 AI 宣告後交由 `resolveClaimWindow` 裁決。
- `GameTableView` 增加最小動作入口:人類座位手牌可點擊觸發打牌,並提供推進回合的入口;維持以唯讀映射呈現回合進展（含 `lastClaimResolution`、`currentSeat`、`phase`、`outcome`）。
- 補齊測試缺口:store 回合推進與錯誤分支、UI 動作意圖送出、流局路徑映射。

## Non-Goals

- 不做人類互動式吃碰槓胡宣告 UI;本階段 claim-window 一律自動裁決（人類座位在宣告視窗中視為 pass 或依核心規則自動處理）。
- 不做拖曳打牌、動畫、音效、教學提示。
- 不把胡牌、吃碰槓、補花的合法性判定搬進 store 或 component,一律沿用 core。
- 不做多人連線、帳號、持久化或回放。

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `mahjong-vue-table-shell`: 由唯讀牌桌殼層擴充為可推進的回合迴圈,新增 store 回合推進與 AI 自動出牌協調,以及牌桌的最小人類打牌動作入口。

## Impact

- Affected specs: `mahjong-vue-table-shell`
- Affected code:
  - Modified: `src/stores/gameSession.ts`, `src/views/game/GameView.vue`, `src/views/game/components/GameTableView.vue`, `src/views/game/selectors.ts`, `src/views/game/types.ts`
  - New: `tests/ui/interactive-turn-loop.test.ts`
  - Removed: (none)
