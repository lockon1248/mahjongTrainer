## 0. 主線板恢復為 active 進度來源

- [x] 0.1 依設計決策「主線 progress board 必須維持 active，而不是只留 archived 歷史表」，對照 `openspec/specs/taiwan-mahjong-trainer.md`、既有 archived changes 與目前 repo 狀態，確認先前主線 board 已不再是 current board。
- [x] 0.2 建立新的 active 主線 progress board，作為 repo 內回答「現在做到哪裡 / 下一步是什麼」的權威來源。

## 1. 已完成主線段落回填

- [x] 1.1 依設計決策「已完成項目只以已歸檔 child change 或已落地程式狀態回填」，回填基礎工程、核心規則、AI foundation、互動摸打、宣告、流局、結果同步、主線回歸驗證等已完成主線段落，並納入 `taiwan-mahjong-playwright-e2e-foundation`。
- [x] 1.2 將 `taiwan-mahjong-table-layout-and-discards` 與 `taiwan-mahjong-table-layout-verification-pass` 納入「UI 中文化與牌桌可讀性強化」已完成段落。

## 2. 目前進行中主線項目

- [x] 2.1 依設計決策「目前進行中主線項目只保留一個」，目前唯一進行中的主線項目改為完成算台與特殊規則主線所對應的 child change；待該 child change 完成實作、驗證與 archive 後，才能將這個主線 task 打勾。
- [x] 2.2 將 `current active child change` 狀態更新為 `taiwan-mahjong-scoring-rules-and-tests`，並將 `next planned child change` 改為待依 scoring 主線的子批次拆分後回填。

## 3. 尚未開始主線段落與維護規則

- [x] 3.1 依設計決策「未定案的下一個 child change 不得自行命名補完」，將 `尚未開始` 段落保留為待 proposal / design / tasks 建立後回填，不自行補功能名稱。
- [x] 3.2 依設計決策「主線 task 只有在對應 child change 完成並封存後才能打勾」，將 `current active child change` / `next planned child change` 保留為狀態資訊，不混成 task。
- [x] 3.3 在 design 內明確寫出 `尚未開始` 段落與主線 board 維護規則，要求 child change 封存後同輪同步更新。
