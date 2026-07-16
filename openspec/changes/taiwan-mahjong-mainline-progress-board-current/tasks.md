## 1. 恢復 active 主線板

- [x] 1.1 建立 successor 主線板 `taiwan-mahjong-mainline-progress-board-current`，重新作為 repo 的 current mainline board。
- [x] 1.2 回填目前已完成主線段落、目前唯一 active child change 與對應 completion condition。

## 2. 依真實狀態同步 workflow

- [x] 2.1 完成 `taiwan-mahjong-center-discard-highlight-rules`、`taiwan-mahjong-unocss-and-shared-enums` 與 `taiwan-mahjong-dealer-rotation-and-turn-pace` 的逐一盤點：前兩者已正式 archive 並回填 completed，`taiwan-mahjong-dealer-rotation-and-turn-pace` 保持未完成，且後續 planned child changes 改為 `taiwan-mahjong-ai-turn-stability`、`taiwan-mahjong-ai-decision-quality`。
- [x] 2.2 將 `taiwan-mahjong-dealer-rotation-and-turn-pace` 退回真實狀態：取消不成立的驗證 task 勾選，避免把失敗驗證當成已完成。

## 3. 主線板維護

- [ ] 3.1 在下一份 successor board 建立前，持續以本 board 作為 current mainline board；`taiwan-mahjong-dealer-rotation-and-turn-pace`、`taiwan-mahjong-ai-turn-stability`、`taiwan-mahjong-ai-decision-quality` 已 archive，後續當下一個 child change 開立或狀態變更時，同輪更新本 board。
