## 1. 收斂桌機舞台比例

- [x] 1.1 交付「Requirement: 唯讀牌桌殼層」在大桌機 viewport 下採用較保守的舞台上限與較均衡的玩家資訊格語意，讓牌桌不再過度滿寬攤平，並以 `tests/ui/game-table-layout.test.ts` 驗證 balanced desktop class / stat-grid 語意已被渲染。
- [x] 1.2 交付「Scenario: render table snapshot as a balanced fixed-stage desktop layout」的 browser 驗證，讓首頁進牌局後在大桌機 viewport 下仍無主頁垂直捲軸，且牌桌不會再以 `scale = 1` 滿寬攤平成不自然布局，並以 `npm run test:e2e -- --grep "首頁可以進入牌局頁並看到本機對局"` 驗證。

## 2. 保留可玩性與桌面可讀性

- [x] 2.1 交付「Scenario: balanced desktop layout preserves readable player panels」行為，讓玩家面板統計區在大桌機下恢復合理分組與閱讀比例，並以 `tests/ui/game-table-layout.test.ts` 與 `tests/ui/interactive-turn-loop.test.ts` 驗證。
- [x] 2.2 交付人類碰牌與流局下一局場景在修正後的桌機比例下仍維持固定舞台與正確互動，並以 `npm run test:e2e -- --grep "(人類宣告碰牌後，副露、暗手與中央捨牌池會同步更新|流局結果畫面按下一局後會回到新局且不顯示錯誤)"` 驗證。

## 3. 收尾與主線同步

- [x] 3.1 交付本 change 的 artifact / acceptance criteria 收尾，讓 `spectra validate --changes "taiwan-mahjong-stage-desktop-balance" --strict` 與對應 Vitest / Playwright 驗證都通過，並以 `spectra instructions apply --change "taiwan-mahjong-stage-desktop-balance" --json` 確認 workflow 可進入 `all_done`。
- [x] 3.2 交付 mainline board 的最新 truth，同步回填 `taiwan-mahjong-stage-desktop-balance` 的進度與 active child change 狀態，並以內容檢查確認 `openspec/changes/taiwan-mahjong-mainline-progress-board-current/design.md` 沒有殘留過時映射。
