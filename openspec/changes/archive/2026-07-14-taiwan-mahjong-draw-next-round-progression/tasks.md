## 1. 流局續局規格與主線同步

- [x] 1.1 依設計決策「將「可建立下一局」與「流局後完整結算」拆開」，更新 `mahjong-round-flow-core` delta spec，明確要求流局後可建立下一局且原莊家續莊。
- [x] 1.2 依相同設計決策，補充 `taiwan-mahjong-rules-baseline.md` 的流局 baseline，避免程式與權威規則再次分離。
- [x] 1.3 將主線 board 的 `current active child change` 更新為 `taiwan-mahjong-draw-next-round-progression`。

## 2. 以測試先鎖定 bug

- [x] 2.1 依 Task 1 的 implementation contract，先把 `tests/core/dealer-progression.test.ts` 改成流局可續局且原莊家續莊的 failing test。
- [x] 2.2 依 Task 2 的 implementation contract，先把 `tests/ui/game-session.store.test.ts` 改成流局後 `startNextRound()` 成功的 failing test。

## 3. 最小實作與驗證

- [x] 3.1 依設計決策「將「可建立下一局」與「流局後完整結算」拆開」、「流局後一律沿用原莊家開下一局」與「rule config 只延續既有可延續設定，不自行補 post-draw 結果」，實作 `src/core/rules/roundFlow.ts` 的 `需求：流局結果`，讓流局 round 可建立下一局且保留既有胡牌後換莊規則。
- [x] 3.2 依 design 的 `Task 1: core 流局續局規則` 與 `Task 2: store 下一局回歸`，執行 `tests/core/dealer-progression.test.ts` 與 `tests/ui/game-session.store.test.ts`，確認 bugfix 通過。
