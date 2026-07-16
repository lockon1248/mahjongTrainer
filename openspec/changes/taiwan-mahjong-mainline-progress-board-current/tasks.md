## 1. 恢復 active 主線板

- [x] 1.1 建立 successor 主線板 `taiwan-mahjong-mainline-progress-board-current`，重新作為 repo 的 current mainline board。
- [x] 1.2 回填目前已完成主線段落、目前唯一 active child change 與對應 completion condition。

## 2. 依真實狀態同步 workflow

- [x] 2.1 完成近期 child changes 的逐一盤點：`taiwan-mahjong-center-discard-highlight-rules`、`taiwan-mahjong-unocss-and-shared-enums`、`taiwan-mahjong-dealer-rotation-and-turn-pace`、`taiwan-mahjong-ai-turn-stability`、`taiwan-mahjong-ai-decision-quality` 已正式 archive 並回填 completed。
- [x] 2.2 將 current active child change 更新回真實狀態：目前修補中的項目改為 `taiwan-mahjong-exposed-kan-replacement-draw-fix`，避免主線 board 繼續停留在已完成的舊 change。

## 3. 主線板維護

- [ ] 3.1 在下一份 successor board 建立前，持續以本 board 作為 current mainline board；目前 active child change 為 `taiwan-mahjong-exposed-kan-replacement-draw-fix`，後續當這份 change archive 或下一個 child change 開立時，同輪更新本 board。
