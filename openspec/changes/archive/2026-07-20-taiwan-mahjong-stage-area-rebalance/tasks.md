## 1. 先補失敗驗證

- [x] 1.1 交付 `tests/ui/game-table-layout.test.ts` / `tests/ui/game-table-view.test.ts` 的新語意保護，先描述更寬舞台與較緊實 bottom panel 的期望 class，並先跑到失敗。
- [x] 1.2 交付桌機 smoke browser 驗證的新面積判準，先描述目前版本不夠吃滿可用寬度與底部面板過高的失敗條件，並先跑到失敗。

## 2. 修正固定舞台與桌面密度

- [x] 2.1 調整 `src/views/game/GameView.vue` 的 stage frame / scaler 寬度利用率，讓遊戲區在桌機下更有效利用畫面。
- [x] 2.2 調整 `src/views/game/components/GameTableView.vue` 的桌面 grid 比例與 bottom player panel 密度，讓中央牌桌更有存在感、底部玩家區不再臃腫。

## 3. 驗證與主線同步

- [x] 3.1 跑對應 Vitest 與 Playwright 驗證，確認這次變更同時通過 UI 語意與 browser 比例檢查。
- [x] 3.2 更新 mainline board，將 task 18 與 current active child change 映射為本 change。

## 4. 寬螢幕再放大

- [x] 4.1 交付「需求：唯讀牌桌殼層」的 `GameView` 寬螢幕舞台語意與 browser 寬度利用率失敗驗證，讓約 `2048px` viewport 下左右留白過多會先被測試抓住，並直接覆蓋「舞台寬度利用率」與「acceptance criteria」的新成功標準。
- [x] 4.2 交付「需求：唯讀牌桌殼層」在較寬桌機 viewport 下的再放大量，調整 `src/views/game/GameView.vue` 的桌機寬螢幕上限與必要 class，讓遊戲區在較寬桌面下再放大一段，但不回到滿版攤平，對應「需要把寬螢幕上限再往上推一段，而不是只靠 104rem」與 `interface / data shape` 的限制。
- [x] 4.3 重新跑對應 Vitest、Playwright 與 Spectra 驗證，並以實際截圖確認左右留白已縮小，直接覆蓋 `behavior`、`failure modes` 與「在較寬 viewport 下不再保留當前等級的邊界留白」的 acceptance criteria。
