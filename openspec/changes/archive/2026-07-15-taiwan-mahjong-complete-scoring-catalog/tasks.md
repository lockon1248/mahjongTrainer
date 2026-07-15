## 1. Change artifacts 與主線同步

- [x] 1.1 依「Task 1: 完整牌型台數 change artifact 建立完成」建立有效的 proposal、design、delta specs 與 tasks，讓 `taiwan-mahjong-complete-scoring-catalog` 成為可 apply 的權威 change，並以 `spectra validate taiwan-mahjong-complete-scoring-catalog --strict` 驗證。
- [x] 1.2 依「Task 4: 主線 board 追蹤同步」與「主線 board 必須在同一輪切換 active child change」更新 `openspec/changes/taiwan-mahjong-mainline-progress-board-live/design.md`，讓 current active child change 明確指向本 change，並以內容檢查確認主線 board 不再顯示 `none`。

## 2. scoring 規格 contract

- [x] 2.1 落地「完整牌型台數目錄必須成為權威 scoring 來源」，讓 baseline 與後續 code 都以單一權威牌型目錄驅動一般台型、特殊胡型、門清類台型、花牌與風牌相關台型，並以 `openspec/specs/taiwan-mahjong-rules-baseline.md` 內容審查確認每類牌型都有名稱、台數與成立條件。
- [x] 2.2 落地「台型疊加與衝突規則必須可被明確判定」，讓 spec 明確定義互斥、覆蓋、可疊加與封頂規則，並以 `openspec/specs/taiwan-mahjong-rules-baseline.md` 與後續 `tests/core/scoring-*` 測試案例清單審查確認沒有只列名稱卻缺衝突規則的台型。
- [x] 2.3 落地「scoring 結果必須保留可供 UI 與 E2E 驗證的牌型說明」，讓 `scoringItems` 後續必須能穩定輸出台型識別、名稱、台數與命中原因，並以 `openspec/specs/mahjong-scoring-core/spec.md` delta 內容審查與至少一條 `e2e/game-table.smoke.spec.ts` 後續案例規劃驗證。
- [x] 2.4 依「以 GameTower 台數頁作為本輪牌型盤點來源，但先抽象成權威 scoring catalog」與「Task 2: scoring catalog contract 明確化」完成牌型來源盤點，讓 GameTower 規則被整理成權威 catalog 而不是散落文案，並以 baseline 對照該頁台型清單的內容審查驗證。

## 3. rule config 與 profile 規格 contract

- [x] 3.1 落地「scoring catalog 設定必須集中於 rule config」，讓 scoring core 後續只從單一 rule config 取得 `minimumTai`、台型開關與計台政策，並以 `openspec/specs/mahjong-rule-config-core/spec.md` delta 內容審查驗證。
- [x] 3.2 落地「rule config 必須能表達 scoring profile 與 profile 差異」、「profile 差異必須透過設定而不是散落條件分支處理」與「牌型目錄必須分成基礎規則與 profile 規則」，讓一般台數表與特殊 profile 規則可被一致切換，並以 `openspec/specs/taiwan-mahjong-rules-baseline.md` 的 profile 區分內容審查驗證。
- [x] 3.3 落地「未定案牌型與未定案 policy 必須可被顯式標記」，讓尚未定值的台型不會被當成正式規則落地，並以 baseline 的 `待確認／爭議規則` 區與 rule config delta spec 交叉檢查驗證。
- [x] 3.4 落地「rule config 必須支援封頂與疊加限制設定」，讓後續 scoring core 可以直接取得 `maxTai` 與衝突規則切片，並以 `mahjong-rule-config-core` delta spec 與 `mahjong-scoring-core` delta spec 內容一致性審查驗證。

## 4. 測試矩陣與後續 apply 契約

- [x] 4.1 依「測試 contract 必須同時要求 core 與 browser E2E」補齊 `openspec/specs/taiwan-mahjong-rule-test-matrix.md`，讓每一類新增台型至少有對應 core 案例分類，並以穩定 Case ID 內容審查驗證。
- [x] 4.2 依「Task 3: 測試主線 contract 補齊」補出至少一條和牌結果顯示流程的 browser E2E 契約，讓未來 apply change 不會只寫 unit test，並以 `e2e/game-table.smoke.spec.ts` 後續案例規劃與 spec 內容審查驗證。
- [x] 4.3 依 design 的 Open Questions 整理 `GameTower` 一般台數表、`見花見字` 特殊規則與低關聯台型的納入邊界，讓後續 apply change 在實作前有明確決策入口，並以 change `design.md` 與 `tasks.md` 內容審查驗證未確認事項已被顯式記錄而非被偷偷寫死。
