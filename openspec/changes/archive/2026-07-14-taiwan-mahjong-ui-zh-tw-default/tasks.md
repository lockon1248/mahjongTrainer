## 1. 中文產品文案與格式化

- [x] 1.1 交付 `Product-facing game table copy defaults to Traditional Chinese` 與設計決策「保留摘要資訊，但移除 raw/debug 語氣」：讓 `GameView` 與 `GameTableView` 以繁體中文顯示頁面標題、摘要標籤、玩家欄位、結果摘要與操作按鈕，並以 `tests/ui/game-table-view.test.ts`、`tests/ui/round-result-sync.test.ts` 驗證。
- [x] 1.2 交付「Table values are formatted into player-readable Chinese text」與設計決策「由 view component 負責產品文案格式化」、「牌張先用中文文字，不重做圖像牌面」：將座位、階段、宣告、結果與牌張從 raw domain 值格式化為中文可讀文字，並以 `tests/ui/human-claim-window.test.ts`、`tests/ui/human-self-turn-actions.test.ts` 驗證。

## 2. 互動畫面回歸驗證

- [x] 2.1 保持現有 props、emits、`data-testid` 與 turn loop 行為不變，同時完成中文 UI 更新，並以 `tests/ui/interactive-turn-loop.test.ts`、`tests/ui/next-round-flow.test.ts` 驗證。
- [x] 2.2 確認 change 與實作一致，執行 `spectra analyze taiwan-mahjong-ui-zh-tw-default --json` 與 `PATH="$HOME/.nvm/versions/node/v22.21.1/bin:$PATH" npx vitest run tests/ui/game-table-view.test.ts tests/ui/human-claim-window.test.ts tests/ui/human-self-turn-actions.test.ts tests/ui/interactive-turn-loop.test.ts tests/ui/round-result-sync.test.ts tests/ui/next-round-flow.test.ts` 驗證整體完成。
