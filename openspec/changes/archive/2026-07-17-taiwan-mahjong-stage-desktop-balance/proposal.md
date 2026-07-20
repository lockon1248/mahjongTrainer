## Why

上一輪雖然把牌桌從過度縮小拉大了，但在更大的桌機螢幕下又出現另一個失真：固定舞台縮放回到 `1` 後，整個牌桌過度滿寬攤平，玩家資訊與中央牌池之間出現不自然的大面積空白。這次必須修正桌機寬螢幕下的比例平衡，而不是再單向追求放大。

## What Changes

- 收斂桌機寬螢幕下的固定舞台最大寬度，避免 `scale = 1` 時整個桌面無限制滿寬攤平。
- 把玩家面板資訊格從過度水平展開的佈局拉回較均衡的桌面比例。
- 保留全站 header 與上方資訊列內容／樣式不變。
- 補上對應 UI / browser 驗證，保護「不再縮在中央，也不再過度攤平」的桌機比例。

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `mahjong-vue-table-shell`: 固定舞台在桌機寬螢幕下除維持可視尺寸與無主頁捲軸外，還必須保有合理的桌面比例平衡，不得因縮放回到 `1` 而將牌桌過度攤平成不自然的滿寬布局。

## Impact

- Affected specs: `mahjong-vue-table-shell`
- Affected code:
  - Modified: `src/views/game/GameView.vue`, `src/views/game/components/GameTableView.vue`, `tests/ui/game-table-layout.test.ts`, `e2e/game-table.smoke.spec.ts`, `openspec/changes/taiwan-mahjong-mainline-progress-board-current/design.md`
  - New: none
  - Removed: none
