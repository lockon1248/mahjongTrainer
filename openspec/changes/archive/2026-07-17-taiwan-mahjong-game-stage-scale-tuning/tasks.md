## 1. 放大固定舞台的可用空間

- [x] 1.1 交付「保留固定舞台，優先調整外層可用空間分配」與「唯讀牌桌殼層」的外層容器行為，讓 `App.vue` 與 `GameView.vue` 在保留全站 header 的前提下縮減重複留白、放大遊戲主舞台，並以 `tests/ui/game-table-view.test.ts` 驗證固定舞台仍存在且遊戲區採用放大後的容器語意。
- [x] 1.2 交付「外框留白保留，但要從『大面積空白』改成『有邊界感的呼吸』」的尺寸策略，讓遊戲主舞台更接近可用視窗邊界但不變成滿版，並以 browser 驗證或對應 UI assertion 確認桌機畫面下留白縮減且未出現主頁捲軸。

## 2. 保留資訊列樣式不變的前提下放大遊戲區

- [x] 2.1 交付「不碰資訊列內容／樣式，只讓它跟著更大的舞台一起長大」與 `render table snapshot as a larger fixed-stage game screen` 行為，讓 header 與上方資訊列維持既有內容／樣式，同時中央牌桌與四家玩家區視覺上明顯放大，並以 `tests/ui/game-table-layout.test.ts` 或等效 UI 測試驗證遊戲區更貼近可用視窗空間。
- [x] 2.2 交付 `enlarged game stage keeps expanded sections inside the same viewport` 行為，讓副露區、結果摘要與下一局操作在放大後仍留在同一固定舞台內，並以 `tests/ui/interactive-turn-loop.test.ts` 或等效流程測試驗證主要互動與狀態切換不受影響。

## 3. 驗證放大後的固定舞台

- [x] 3.1 交付「放大遊戲區但不回到主頁捲軸」的 browser 驗證，讓首頁進牌局、碰牌場景與流局進下一局等真實流程在放大後仍維持無主頁垂直捲軸，並以 `npm run test:e2e -- --grep ...` 的實際輸出作為完成證據。
- [x] 3.2 交付本 change 的 behavior、acceptance criteria 與 artifact 收尾，讓 `spectra validate --changes taiwan-mahjong-game-stage-scale-tuning --strict` 與對應 Vitest / Playwright 驗證都通過，並以 `spectra instructions apply --change "taiwan-mahjong-game-stage-scale-tuning" --json` 確認 workflow 可進入 `all_done`。
