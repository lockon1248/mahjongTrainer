## Why

固定舞台已經解決主頁捲軸問題，但在寬螢幕下遊戲區仍被 `game-stage-frame` / `game-stage-scaler` 的保守寬度上限鎖住，左右留白過大，玩家實際看到的牌桌仍像縮在中間。使用者已明確要求上方資訊列維持不動，這一輪只修正橫向空間利用率。

## What Changes

- 放寬固定舞台的橫向寬度策略，讓 `game-stage-frame` 與 `game-stage-scaler` 在桌機寬螢幕下可佔用更高比例的可用寬度。
- 調整牌桌三欄配置，讓左右玩家區與中央牌池跟著更寬的舞台一起放大，吃回過量左右留白。
- 保留全站 header 與上方資訊列內容／樣式，不在本 change 內重做資訊列。
- 補上對應 UI 與 browser 驗證，保護「橫向放大但仍維持固定舞台無主頁捲軸」的行為。

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `mahjong-vue-table-shell`: 固定舞台在維持無主頁捲軸與保留 header / 上方資訊列內容樣式不變的前提下，還必須在寬螢幕情境下擴大遊戲主舞台的橫向佔比，減少左右留白。

## Impact

- Affected specs: `mahjong-vue-table-shell`
- Affected code:
  - Modified: `src/views/game/GameView.vue`, `src/views/game/components/GameTableView.vue`, `tests/ui/game-table-view.test.ts`, `tests/ui/game-table-layout.test.ts`, `e2e/game-table.smoke.spec.ts`, `openspec/changes/taiwan-mahjong-mainline-progress-board-current/design.md`
  - New: none
  - Removed: none
