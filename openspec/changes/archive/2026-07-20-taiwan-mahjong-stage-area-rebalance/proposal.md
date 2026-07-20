## Why

目前固定舞台已經脫離「縮在中央太小」與「整個桌面過度攤平」兩個極端，但最新實際畫面仍然明確失真：桌機下左右留白過大、中央牌池像被塞進狹窄中欄、下方玩家區又被拉成過高的資訊板。這代表目前驗證只保住了邊界，沒有保住實際可接受的桌面面積分配。

## What Changes

- 重新平衡固定舞台在桌機下的可用面積，讓遊戲區更有效吃掉左右留白。
- 放大中央牌桌實際佔比，同時收斂下方玩家區的垂直膨脹感。
- 針對更寬的桌機 viewport 再放寬固定舞台上限，避免畫面已經修過一次後仍在 2K 左右寬度留下過多邊界空白。
- 保持 header 與上方資訊列內容／樣式不變。
- 補上新的 UI / browser 驗證，保護「遊戲區面積更大、中央桌面密度更正常、玩家區不再像扁長資訊板」。

## Capabilities

### Modified Capabilities

- `mahjong-vue-table-shell`: 固定舞台除維持無主頁捲軸、避免過度縮小與避免滿寬攤平外，還必須在桌機 viewport 下讓主要遊戲區有效佔據可用畫面寬度，減少過量左右留白，並維持中央桌面與玩家區的合理密度。

## Impact

- Affected specs: `mahjong-vue-table-shell`
- Affected code:
  - Modified: `src/views/game/GameView.vue`, `src/views/game/components/GameTableView.vue`, `tests/ui/game-table-layout.test.ts`, `tests/ui/game-table-view.test.ts`, `e2e/game-table.smoke.spec.ts`, `openspec/changes/taiwan-mahjong-mainline-progress-board-current/design.md`
  - New: `openspec/changes/taiwan-mahjong-stage-area-rebalance/*`
