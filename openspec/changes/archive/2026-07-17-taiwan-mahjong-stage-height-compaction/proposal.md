## Why

上一輪已確認 `game-stage-frame` 寬度上限不是主要問題，實際渲染後真正把牌桌縮小的是整個 `game-stage-content` 高度過高，導致固定舞台被迫用 `scale` 大幅縮小。使用者已明確要求上方資訊列不動，因此這一輪必須直接壓縮牌桌本體高度，讓寬度放大真正看得見。

## What Changes

- 壓縮固定舞台內牌桌本體的垂直高度，優先處理中央捨牌池、玩家面板統計區與人類手牌區的基底高度。
- 保留全站 header 與上方資訊列內容／樣式不變，不在本 change 內重排資訊列。
- 讓固定舞台在桌機寬螢幕下維持無主頁捲軸的同時，顯著提高實際可視寬度與縮放倍率。
- 補上針對縮放倍率與實際畫面結果的 UI / browser 驗證，避免再出現「程式改了但畫面看不出差異」。

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `mahjong-vue-table-shell`: 固定舞台除維持無主頁捲軸、保留 header 與上方資訊列不變外，還必須在桌機寬螢幕下把牌桌本體壓縮到較低的基底高度，避免整個遊戲區因高度過高而被過度縮小。

## Impact

- Affected specs: `mahjong-vue-table-shell`
- Affected code:
  - Modified: `src/views/game/GameView.vue`, `src/views/game/components/GameTableView.vue`, `tests/ui/game-table-view.test.ts`, `tests/ui/game-table-layout.test.ts`, `e2e/game-table.smoke.spec.ts`, `openspec/changes/taiwan-mahjong-mainline-progress-board-current/design.md`
  - New: none
  - Removed: none
