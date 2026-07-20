## 1. 壓縮牌桌本體高度

- [x] 1.1 交付「Requirement: 唯讀牌桌殼層」在桌機寬螢幕下採用更緊湊的玩家面板與中央牌池高度語意，讓牌桌本體原始高度低於前一版，並以 `tests/ui/game-table-layout.test.ts` 驗證緊湊牌桌 class / layout 語意已被渲染。
- [x] 1.2 交付「Scenario: compacted table reduces stage shrink pressure instead of only changing width tokens」的 browser 驗證，讓首頁進牌局後在保留 header 與上方資訊列不變的前提下仍無主頁垂直捲軸，且固定舞台縮放倍率明顯高於前一版，並以 `npm run test:e2e -- --grep "首頁可以進入牌局頁並看到本機對局"` 驗證。

## 2. 維持互動流程與可讀性

- [x] 2.1 交付更緊湊牌桌下的人類操作、結果摘要與副露區仍可見可用，讓壓縮高度不會破壞玩家互動流程，並以 `tests/ui/interactive-turn-loop.test.ts` 驗證。
- [x] 2.2 交付人類碰牌與流局下一局場景在更緊湊牌桌下仍維持固定舞台與正確顯示，並以 `npm run test:e2e -- --grep "(人類宣告碰牌後，副露、暗手與中央捨牌池會同步更新|流局結果畫面按下一局後會回到新局且不顯示錯誤)"` 驗證。

## 3. 收尾與主線同步

- [x] 3.1 交付本 change 的 artifact / acceptance criteria 收尾，讓 `spectra validate --changes "taiwan-mahjong-stage-height-compaction" --strict` 與對應 Vitest / Playwright 驗證都通過，並以 `spectra instructions apply --change "taiwan-mahjong-stage-height-compaction" --json` 確認 workflow 可進入 `all_done`。
- [x] 3.2 交付 mainline board 的最新 truth，同步回填 `taiwan-mahjong-stage-height-compaction` 的進度與 active child change 狀態，並以內容檢查確認 `openspec/changes/taiwan-mahjong-mainline-progress-board-current/design.md` 沒有殘留過時映射。
