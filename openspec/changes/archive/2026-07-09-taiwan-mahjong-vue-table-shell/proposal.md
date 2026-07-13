## Why

核心規則、結算、rule config 與中階 AI 都已具備可重用邊界，現在可以正式進入 `階段 4`。若再不建立 Vue scaffold 與牌桌 shell，專案仍無法把已完成的 core 能力映射到瀏覽器畫面，也無法開始驗證狀態流與桌面 UI 結構是否合理。

## What Changes

- 建立 Vue app scaffold、router 與 Pinia 基礎骨架，讓前端有正式的進入點與狀態協調層。
- 建立 `GameTableView` 的牌桌 shell，先把 core round state 映射為唯讀畫面區塊。
- 定義 UI 與 core 的邊界：store 只協調 session 狀態，view 只顯示與送出動作，不自行判定規則。
- 建立對應的 smoke / component 測試，驗證 app shell、router、store 與牌桌骨架能正確載入。

## Non-Goals

- 不在本 change 內完成完整互動牌桌體驗、拖曳打牌、動畫、音效或教學提示。
- 不在本 change 內把胡牌、吃碰槓、補花合法性判定搬進 Vue 或 Pinia。
- 不做多人連線、帳號系統、資料持久化或回放功能。

## Capabilities

### New Capabilities

- `mahjong-vue-table-shell`: 定義台灣 16 張麻將前端 app scaffold、router、Pinia session skeleton 與唯讀牌桌 shell。

### Modified Capabilities

- `mahjong-round-flow-core`: 補充可供 UI / store 消費的穩定 round state 讀取邊界，但不改變 core 規則責任。

## Impact

- Affected specs: `mahjong-vue-table-shell`, `mahjong-round-flow-core`
- Affected code:
  - New: `openspec/changes/taiwan-mahjong-vue-table-shell/specs/mahjong-vue-table-shell/spec.md`, `src/main.ts`, `src/App.vue`, `src/router/`, `src/stores/`, `src/views/home/`, `src/views/game/`, `tests/smoke/`, `tests/ui/`
  - Modified: `src/core/index.ts`, `src/core/rules/`, `openspec/specs/mahjong-round-flow-core/spec.md`
  - Removed: (none)
