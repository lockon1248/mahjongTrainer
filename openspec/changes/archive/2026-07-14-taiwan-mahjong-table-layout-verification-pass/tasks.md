## 1. 主線與驗證範圍對齊

- [x] 1.1 依設計決策「主線 board 只更新狀態欄位，不預先打勾主線 task」，將 `taiwan-mahjong-table-layout-verification-pass` 掛回主線 board 的 `current active child change`，並保留主線 task 未完成狀態。

## 2. 多步流程驗證補強

- [x] 2.1 依設計決策「以等效真實流程整合測試補足 E2E 缺口」，盤點 `taiwan-mahjong-table-layout-and-discards` 既有 core / store / component 測試，確認缺的是 UI 事件出發的多步流程驗證。
- [x] 2.2 依設計決策「驗證必須覆蓋宣告後的三個同步面」，在 `tests/ui/table-layout-verification-flow.test.ts` 新增一條人類宣告後同步更新副露區、暗手與中央捨牌池的驗證。

## 3. 變更驗證

- [x] 3.1 執行與本 change 直接相關的測試命令，至少包含新增或修改的整合測試，以及它依賴的 store / core 回歸測試。
- [x] 3.2 執行 `spectra analyze taiwan-mahjong-table-layout-verification-pass --json` 與 `spectra validate taiwan-mahjong-table-layout-verification-pass`。
