## 1. 合法宣告候選邊界

- [ ] 1.1 實作 `UI-safe human claim candidates` 需求：在 `src/core/rules` 新增供 store 讀取指定座位合法宣告候選的 helper，讓 `pass`、`chi`、`pon`、`kan-exposed`、`win` 的可選集合由 core 產生，並以 `tests/core/human-claim-candidates.test.ts` 驗證 `chi` 只限下家、`pon` / `kan-exposed` 需相同牌、`win` 需合法胡牌。
- [ ] 1.2 讓 `UI-safe human claim candidates` 對資料形狀保留 `actionType`、`tile` 與需要的 `consumedTiles`，使 UI 能渲染具體候選而不重算規則，並以 typecheck 與 core 測試驗證資料形狀可被 store / view 直接消費。

## 2. Store 暫停與送出宣告

- [ ] 2.1 實作 `Claim-window pause before auto-advancement` 需求：在 `gameSession` store 暴露 `availableHumanClaims`，讓 `advanceTurn()` 在人類有合法候選時停在 `claim-window`，並以 `tests/ui/game-session.store.test.ts` 驗證不會自動跳到下一家。
- [ ] 2.2 實作 `Human claim-window action` 需求：在 `gameSession` store 新增 `submitHumanClaim(actionType, consumedTiles?)`，讓人類選擇可與 AI 宣告一起送入 `resolveClaimWindow()` 裁決，並以 store 測試驗證 `pass` 與一個非 `pass` 宣告後牌局都會繼續推進。
- [ ] 2.3 維持既有 AI 自動裁決路徑：當人類沒有任何合法候選時，store 仍應自動蒐集 AI 宣告並完成裁決，並以既有互動回合測試加一個「無人類候選仍自動推進」案例驗證不回歸。

## 3. 人類宣告 UI

- [ ] 3.1 實作 `Human claim-window action` 畫面入口：在 `GameView` / `GameTableView` 顯示只包含合法候選的宣告按鈕列，並以 `tests/ui/human-claim-window.test.ts` 驗證不合法動作不會被渲染。
- [ ] 3.2 串接 props / emits：讓宣告按鈕只送出人類意圖給 store，不在 component 內自行裁決，並以 UI 測試驗證點擊 `pass` 或其他候選會呼叫對應 store action。
- [ ] 3.3 讓 `currentSeat`、`phase`、`lastClaimResolution`、`outcome` 在宣告完成後仍維持唯讀映射更新，並以 render assertion 驗證 claim 後畫面會反映最新快照。

## 4. 整體驗證

- [ ] 4.1 執行整體驗證：確認 `Human claim-window action`、`Claim-window pause before auto-advancement`、`UI-safe human claim candidates` 可協同運作，並以 `npm test -- --run tests/core/human-claim-candidates.test.ts tests/ui/human-claim-window.test.ts tests/ui/game-session.store.test.ts tests/ui`、`npm run typecheck` 與 `spectra analyze taiwan-mahjong-human-claim-window --json` 驗證。
