## 1. 主線板交接與退役

- [x] 1.1 建立 successor 主線板 `taiwan-mahjong-mainline-progress-board-live`，作為新的 current board。
- [x] 1.2 將目前最新主線狀態、已完成段落與 current active child change 移轉到新主線板。
- [x] 1.3 在 MVP 完成後結束 live 主線板維護，允許這份 successor board 直接退役並封存，不再要求後續優化 change 維持 current mainline board。

## 2. 舊主線板封存

- [x] 2.1 在 successor 主線板接手後，封存 `taiwan-mahjong-mainline-progress-board`。

## 3. workflow 防呆

- [x] 3.1 將主線板 successor handoff lifecycle 規則補進全域 `/Users/tim/.codex/AGENTS.md`。
- [x] 3.2 將同樣規則補進 repo `AGENTS.md`。
