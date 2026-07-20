## 1. 放寬固定舞台的橫向寬度

- [x] 1.1 交付「Requirement: 唯讀牌桌殼層」在桌機寬螢幕下採用更寬的 `game-stage-frame` / `game-stage-scaler` 橫向策略，讓遊戲主舞台比前一版顯著減少左右留白，並以 `tests/ui/game-table-view.test.ts` 驗證新的 stage class / width 語意已被渲染。
- [x] 1.2 交付「Scenario: render table snapshot as a wider fixed-stage game screen」的 browser 驗證，讓首頁進牌局後在保留 header 與上方資訊列不變的前提下仍無主頁垂直捲軸，且遊戲舞台在桌機 viewport 下佔用更高比例寬度，並以 `npm run test:e2e -- --grep "首頁可以進入牌局頁並看到本機對局"` 驗證。

## 2. 讓牌桌三欄跟著變寬

- [x] 2.1 交付「Scenario: wider game stage expands the table layout instead of only stretching the shell」行為，讓 `mahjong-table` 的左右玩家區與中央牌池同步取得更寬的橫向空間，而不是只拉大外層容器，並以 `tests/ui/game-table-layout.test.ts` 驗證牌桌採用新的較寬三欄配置語意。
- [x] 2.2 交付放寬後仍維持固定舞台與主要互動可見的牌桌流程，讓玩家副露、結果摘要與下一局操作不因橫向放大而破壞既有固定舞台語意，並以 `tests/ui/interactive-turn-loop.test.ts` 與 `npm run test:e2e -- --grep "(人類宣告碰牌後，副露、暗手與中央捨牌池會同步更新|流局結果畫面按下一局後會回到新局且不顯示錯誤)"` 驗證。

## 3. 收尾與主線同步

- [x] 3.1 交付本 change 的 artifact / acceptance criteria 收尾，讓 `spectra validate --changes "taiwan-mahjong-stage-width-expansion" --strict` 與對應 Vitest / Playwright 驗證都通過，並以 `spectra instructions apply --change "taiwan-mahjong-stage-width-expansion" --json` 確認 workflow 可進入 `all_done`。
- [x] 3.2 交付 mainline board 的最新 truth，同步回填 `taiwan-mahjong-stage-width-expansion` 的進度與 active child change 狀態，並以內容檢查確認 `openspec/changes/taiwan-mahjong-mainline-progress-board-current/design.md` 沒有殘留過時映射。
