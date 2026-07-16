## 1. 恢復 active 主線板

- [x] 1.1 建立 successor 主線板 `taiwan-mahjong-mainline-progress-board-current`，重新作為 repo 的 current mainline board。
- [x] 1.2 回填目前已完成主線段落、目前唯一 active child change 與對應 completion condition。

## 2. 依真實狀態同步 workflow

- [ ] 2.1 完成 `taiwan-mahjong-center-discard-highlight-rules`、`taiwan-mahjong-unocss-and-shared-enums` 與 `taiwan-mahjong-dealer-rotation-and-turn-pace` 的逐一盤點，確認哪些 task 勾選成立、哪些 change 可真正關閉，再回填到本 board。
- [x] 2.2 將 `taiwan-mahjong-dealer-rotation-and-turn-pace` 退回真實狀態：取消不成立的驗證 task 勾選，避免把失敗驗證當成已完成。

## 3. 主線板維護

- [ ] 3.1 在下一份 successor board 建立前，持續以本 board 作為 current mainline board；當 `taiwan-mahjong-dealer-rotation-and-turn-pace` archive 或下一個 child change 開立時，同輪更新本 board。
