## 1. 主線與權威規則對齊

- [x] 1.1 將 `taiwan-mahjong-scoring-rules-and-tests` 掛回主線 board 的 `current active child change`，並把目前進行中主線項目改為 scoring / 特殊規則主線，而不是下一個 UI 任務。
- [x] 1.2 依設計決策「先補權威規則目錄，再補 scoring implementation」，更新 `openspec/specs/taiwan-mahjong-rules-baseline.md`，把完整台型、特殊胡型、最低胡牌台數、花牌計分與封頂等 scoring 主線缺口改成明確的規則工作清單，而不是籠統待確認。
- [x] 1.3 依設計決策「先補權威規則目錄，再補 scoring implementation」，更新 `openspec/specs/taiwan-mahjong-rule-test-matrix.md`，加入 scoring / 特殊規則對應案例，至少包含 `天胡`、`大小三元`、榮和結果接台數、最低台數門檻。

## 2. scoring capability spec

- [x] 2.1 依設計決策「scoring core 必須成為獨立 capability」，建立 Requirement `和牌結果必須經過權威算台流程` 與 Requirement `scoring 規則必須來自權威台型目錄` 的 `mahjong-scoring-core` delta spec。
- [x] 2.2 依 Requirement `最低胡牌台數與特殊規則必須成為可配置權威設定`、Requirement `最低胡牌台數門檻必須可被驗證`，以及設計決策「scoring core 必須成為獨立 capability」，更新 `mahjong-rule-config-core` 與 `mahjong-vue-table-shell` 的相關 delta spec，要求最低胡牌台數、特殊規則設定與和牌結果摘要都必須正確接線。

## 3. scoring implementation 主線

- [x] 3.1 依設計決策「discard-win 與 self-draw win 都必須經過同一條 scoring 結果鏈」，實作 Requirement `和牌結果必須經過權威算台流程`，讓 `roundFlow` 不再直接產生沒有台數的和牌結果。
- [x] 3.2 依 Requirement `最低胡牌台數門檻必須可被驗證`，補上最低胡牌台數與既有基礎台型的 core tests，讓無台 / 有台結果可被明確驗證。
- [x] 3.3 依設計決策「規則實作按批次前進，而不是一次塞滿」，補上特殊胡型第一批規則與測試，至少包含 `天胡`、`大小三元`，並讓 settlement 與 UI summary 可顯示對應台型與總台數。
- [x] 3.4 依設計決策「規則實作按批次前進，而不是一次塞滿」，規劃花牌計分、其他特殊胡型與後續台型批次，確保不會再散落成臨時 bugfix。

## 4. UI 與 browser 驗證

- [x] 4.1 依 Requirement `和牌摘要必須顯示正確台型與總台數`，補上 UI result summary regression，驗證榮和 / 自摸都會顯示正確 `totalTai` 與 `scoringItems`。
- [x] 4.2 依設計決策「每一批規則都要有對應測試與 browser 驗證」，擴充 Playwright E2E，驗證至少一條榮和結果與一條特殊胡型結果能在真實瀏覽器中看到正確台數與台型。

## 5. 變更驗證

- [x] 5.1 依設計決策「每一批規則都要有對應測試與 browser 驗證」，對每個子批次執行對應的 core / store / UI / browser E2E 驗證。
- [x] 5.2 執行 `spectra analyze taiwan-mahjong-scoring-rules-and-tests --json` 與 `spectra validate taiwan-mahjong-scoring-rules-and-tests`。
