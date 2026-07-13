## 1. Start with a read-only table shell before interactive actions

- [x] 1.1 實作 `Vue app shell bootstrap`，讓 `src/main.ts` 與 `App.vue` 可在本機瀏覽器正常掛載應用殼層，並以 smoke test 與 `npm run typecheck` 驗證。
- [x] 1.2 實作 `Read-only game table shell` 的基礎 `GameTableView`，讓初始化 round snapshot 可被映射為唯讀桌面區塊、玩家區塊與局面摘要，並以 UI / component 測試驗證。

## 2. Keep Pinia as an orchestration layer only

- [x] 2.1 實作 `Pinia session skeleton`，讓 store 透過 core API 初始化新局並暴露目前 round snapshot，而不自行產生規則結果，並以 store 測試與 `npm run typecheck` 驗證。
- [x] 2.2 實作 `UI-safe round state consumption` 的 thin selector 或直接映射邊界，讓 view 層可消費 round snapshot 而不在 component 內重算規則，並以 component 測試驗證。

## 3. Route-level views first, presentational components second

- [x] 3.1 實作 `Router with home and game entrypoints`，讓 home 與 game 兩個路由都可正常渲染對應頁面容器，並以 router smoke test 驗證。
- [x] 3.2 建立首頁與牌桌頁的 route-level views，再視需要拆出最小 display components，讓頁面責任明確而不過早碎片化，並以載入測試與 `npm run typecheck` 驗證。

## 4. Surface core state directly instead of inventing UI-only mirrors

- [x] 4.1 維持 `mahjong-vue-table-shell` 對 core round snapshot 的直接映射，讓 `GameTableView` 主要顯示 `players`、`table`、`currentSeat`、`phase`、`outcome` 等既有資料，而不建立大規模 UI-only mirrors，並以 render assertion 驗證。
- [x] 4.2 執行整體驗證，確認 `Vue app shell bootstrap`、`Router with home and game entrypoints`、`Read-only game table shell`、`Pinia session skeleton` 與 `UI-safe round state consumption` 可協同運作，並以 `npm test -- --run tests/smoke tests/ui`、`npm run typecheck` 與 `spectra analyze taiwan-mahjong-vue-table-shell --json` 驗證。
