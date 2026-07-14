## Why

目前主線已支援人類出牌與 AI 自動回合推進，但一旦進入 `claim-window`，人類座位仍被固定視為 `pass`。這使得產品雖然能跑完整個回合循環，卻仍無法讓真人玩家完整參與吃、碰、明槓、榮和等核心宣告流程，距離「可完整進行基本牌局流程」還差最後一段主要互動能力。

## What Changes

- 在 `round-flow` / store 邊界新增可供 UI 直接消費的人類合法宣告候選，避免在 Vue / Pinia 內重算規則。
- 調整 `gameSession` 的回合推進策略：當 `claim-window` 對人類座位存在合法宣告時，停止自動推進並等待人類決定。
- 在牌桌畫面新增最小宣告 UI，讓人類可在 `pass`、`chi`、`pon`、`kan-exposed`、`win` 之間選擇目前合法的動作。
- 補齊 core / store / UI 測試，覆蓋人類宣告候選顯示、宣告送出、AI 與人類混合裁決、以及無合法宣告時維持自動推進。

## Non-Goals

- 不在這個 change 內實作暗槓、加槓、自摸胡等「自己回合內」的額外人類操作入口。
- 不在這個 change 內加入宣告動畫、音效、倒數計時或多層對話框。
- 不在這個 change 內改動算台規則、特殊胡、封頂、搶槓等仍屬未定案規則。

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `mahjong-vue-table-shell`: 由僅支援人類出牌擴充為支援人類在 `claim-window` 中選擇合法宣告。
- `mahjong-round-flow-core`: 補充供 UI / store 讀取的人類合法宣告候選邊界，避免在前端層重算規則。

## Impact

- Affected specs: `mahjong-vue-table-shell`, `mahjong-round-flow-core`
- Affected code:
  - Modified: `src/stores/gameSession.ts`, `src/views/game/GameView.vue`, `src/views/game/components/GameTableView.vue`, `src/views/game/selectors.ts`, `src/views/game/types.ts`, `src/core/rules/roundFlow.ts`, `src/core/rules/types.ts`, `src/core/index.ts`
  - New: `tests/ui/human-claim-window.test.ts`, `tests/core/human-claim-candidates.test.ts`
  - Removed: (none)
