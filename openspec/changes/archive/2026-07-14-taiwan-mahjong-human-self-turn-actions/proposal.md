## Why

目前主線已完成人類打牌與 `claim-window` 宣告，但真人在自己的回合仍只有「打牌」這一條路徑，尚未能執行自摸胡、暗槓、加槓與補牌等核心自回合動作。這代表產品雖然已經能跑完整個基本摸打循環，卻仍未達到主 spec 所要求的「真人端具備基本可玩操作閉環」。

下一個主線缺口不是再補宣告視窗，而是補齊真人自己回合的合法操作入口，讓前端牌桌不只會停在真人 discard turn，也能在合法時提供自摸胡與槓牌相關決策，並由 core / store 正確套用。

## What Changes

- 在 `round-flow core` 補充真人自回合可執行動作的合法候選邊界。
- 在 `gameSession` store 補上真人自回合 action 送出與回合推進。
- 在牌桌 UI 顯示最小自回合操作入口，僅呈現目前合法的 `win-self-draw`、`kan-concealed`、`kan-added` 與對應補牌後續。
- 補齊 core / store / UI 測試，覆蓋合法候選、送出動作、補牌與結果同步。

## Non-Goals

- 不在這個 change 內處理未定案規則，例如搶槓、特殊胡、封頂或流局查聽。
- 不在這個 change 內建立結算詳情面板或動畫音效。
- 不在這個 change 內處理下一局銜接或莊家流程。

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `mahjong-round-flow-core`: 補充真人自回合合法動作候選與對應狀態轉換。
- `mahjong-vue-table-shell`: 由支援真人出牌與 claim-window 宣告，擴充為支援真人自摸胡、暗槓、加槓與補牌流程。

## Impact

- Affected specs: `mahjong-round-flow-core`, `mahjong-vue-table-shell`
- Affected code:
  - Modified: `src/core/rules/roundFlow.ts`, `src/core/rules/types.ts`, `src/core/types/action.ts`, `src/stores/gameSession.ts`, `src/views/game/GameView.vue`, `src/views/game/components/GameTableView.vue`, `src/views/game/selectors.ts`, `src/views/game/types.ts`, `src/core/index.ts`
  - New: `tests/core/human-self-turn-actions.test.ts`, `tests/ui/human-self-turn-actions.test.ts`
  - Removed: (none)
