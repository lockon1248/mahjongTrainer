## 1. 主線同步與 E2E 規格

- [x] 1.1 將主線 board 的 `current active child change` 更新為 `taiwan-mahjong-draw-next-round-e2e-regression`。
- [x] 1.2 依設計決策「以 E2E bridge 直接建立可到達的流局完成狀態」，建立 `mahjong-vue-table-shell` delta spec，要求瀏覽器流程覆蓋流局後按下一局。

## 2. E2E regression 實作

- [x] 2.1 依 design 的 `Task 1: draw next round E2E bridge`，擴充 `src/views/game/e2eBridge.ts` 與相關型別，提供流局完成場景。
- [x] 2.2 依 design 的 `Task 2: draw next round browser regression`、設計決策「驗證重點放在結果畫面到下一局的可操作連續性」與 `Requirement: 流局結果畫面必須支援下一局瀏覽器續局流程`，擴充 `e2e/game-table.smoke.spec.ts`，驗證流局結果畫面按下「下一局」後可正常開新局且沒有錯誤。

## 3. 完整回歸驗證

- [x] 3.1 執行完整單元測試與型別檢查。
- [x] 3.2 執行完整 Playwright E2E。
