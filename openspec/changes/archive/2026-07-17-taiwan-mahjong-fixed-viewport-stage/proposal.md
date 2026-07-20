## Why

目前對局畫面會隨著上方摘要、副露區與玩家區塊高度成長而把整頁撐出主捲軸，導致玩家需要上下捲動才能看完整個桌面。這會破壞牌桌作為單一可視場景的可讀性，也讓桌機與平板上的操作節奏變差。

## What Changes

- 將對局畫面定義為單一固定舞台，桌機與平板優先在單一視窗內完整顯示，不再依內容自然把頁面撐高。
- 為遊戲畫面加入視窗導向的等比縮放策略，讓上方摘要、中央牌桌、四家牌區與玩家操作列一起縮放，而不是各區塊各自溢出。
- 收斂對局畫面內各區塊的高度責任，讓超出空間的壓力優先由局部區塊吸收，避免重新產生主頁捲軸。
- 補上對應的 UI 驗證，確保桌機／平板情境下不再出現依內容把整頁撐高的回歸。

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `mahjong-vue-table-shell`: 對局畫面在桌機與平板上必須以單一固定視窗舞台渲染，避免主頁捲軸並支援整體等比縮放。

## Impact

- Affected specs: `mahjong-vue-table-shell`
- Affected code:
  - Modified: `src/views/game/GameView.vue`, `src/views/game/components/GameTableView.vue`, `src/styles/main.css`, `src/views/game/types.ts`, `tests/ui/game-table-layout.test.ts`, `tests/ui/game-table-view.test.ts`, `tests/ui/interactive-turn-loop.test.ts`
  - New: none
  - Removed: none
