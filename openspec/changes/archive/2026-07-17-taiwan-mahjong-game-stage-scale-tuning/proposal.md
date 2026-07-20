## Why

目前固定舞台已經解決主頁捲軸問題，但縮放後的遊戲主舞台視覺比例仍過於保守，導致畫面中央內容偏小、四周留白過多，看起來像被縮在中間。使用者已明確要求先保留全站 header 與上方資訊列的既有內容與樣式，優先把遊戲區放大。

## What Changes

- 調整固定舞台在遊戲頁內的可用寬高分配，讓遊戲區明顯放大，但仍保留外框留白。
- 保留全站 header 與現有資訊列內容／樣式，不在這個 change 內重做資訊列設計。
- 微調外層 shell、stage frame 與 scaler 的尺寸策略，減少縮放後多餘空白，讓牌桌與玩家區更貼近可用視窗。
- 補上對應 UI 驗證，保護「遊戲區放大但不回到主頁捲軸」這個目標。

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `mahjong-vue-table-shell`: 固定舞台在桌機與平板上除維持無主頁捲軸外，還必須優先把遊戲主舞台放大到更接近可用視窗空間，且在本 change 內保留 header 與現有資訊列樣式不變。

## Impact

- Affected specs: `mahjong-vue-table-shell`
- Affected code:
  - Modified: `src/App.vue`, `src/views/game/GameView.vue`, `src/views/game/components/GameTableView.vue`, `src/styles/main.css`, `tests/ui/game-table-view.test.ts`, `tests/ui/game-table-layout.test.ts`, `e2e/game-table.smoke.spec.ts`
  - New: none
  - Removed: none
