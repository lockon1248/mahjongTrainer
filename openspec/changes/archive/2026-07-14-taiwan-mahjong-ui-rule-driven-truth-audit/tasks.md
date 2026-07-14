## 1. 主線與規格建立

- [x] 1.1 將主線 board 的 `current active child change` 更新為 `taiwan-mahjong-ui-rule-driven-truth-audit`。
- [x] 1.2 依設計決策「UI 欄位必須有可追溯的規則來源」與「Placeholder state 不得偽裝成產品狀態」，建立 `mahjong-vue-table-shell` delta spec。

## 2. UI 狀態稽核主線

- [x] 2.1 依設計決策「稽核必須形成清單，不可只靠人工印象修補」與 design 的 `Task 1: UI 狀態盤點`，盤點目前牌桌所有狀態型 UI 欄位與提示，並標出其規則來源或缺口。
- [x] 2.2 依 `Requirement: 產品狀態型 UI 必須由明確規則或業務判定驅動` 與 design 的 `Task 2: 分類與處置規則`，把每個欄位分類為可保留、需移除/隱藏、或需後續規則實作。
- [x] 2.3 依盤點結果開立後續 child changes，或在同一個 change 內直接完成已知假 UI 修正並記錄無需拆分的原因。

## 3. 驗證與流程防呆

- [x] 3.1 依設計決策「驗證要同時保護存在性與語意正確性」與 design 的 `Task 3: 驗證策略`，為後續 UI 狀態修正定義必須補的 UI / E2E 驗證要求。
- [x] 3.2 將這次錯誤抽象成可跨專案套用的防呆規則，更新全域 `/Users/tim/.codex/AGENTS.md`。
- [x] 3.3 將同一套 UI 真實性防呆更新到本 repo `AGENTS.md`，確保此 repo 後續 child changes 都受約束。
