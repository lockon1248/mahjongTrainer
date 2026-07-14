## 1. Core 下一局莊家推導

- [x] 1.1 實作 Requirement `Next-round dealer progression after win` 的 core helper，遵守設計決策「core 提供下一局初始化入口」與「只實作已定案的 win 後莊家流程」，讓上一局胡牌結果可建立下一局 baseline round，並以 `tests/core/dealer-progression.test.ts` 驗證莊家胡牌連莊與閒家胡牌下家坐莊。
- [x] 1.2 完成 Requirement `Next-round dealer progression after win` 的 table 資料形狀，讓下一局保留正確 `dealerSeat` / `prevailingWind`，並以 typecheck 與 core 測試驗證可直接被 store 消費。

## 2. Core 流局邊界

- [x] 2.1 實作 Requirement `Draw outcome stays unresolved for undecided post-draw rules` 的下一局邊界，遵守設計決策「流局只保留終局，不推導下一局莊家」，讓流局終局不得靜默推導下一局，並以 core 或 store 測試驗證 draw 路徑會保留明確不可決定狀態。

## 3. Store 下一局流程

- [x] 3.1 在 `gameSession` store 新增 `startNextRound()`，讓已結束牌局可透過 core 建立下一局，並以 store 測試驗證 win 路徑可成功重開新局。
- [x] 3.2 讓 `startNextRound()` 在流局未定案路徑回報明確 error，不猜測後續連莊或查聽，並以 store 測試驗證 draw 路徑不會靜默成功。

## 4. UI 終局入口

- [x] 4.1 實作 Requirement `Next-round action entry after round end`，遵守設計決策「ui 採最小結果操作入口」：在 `GameView` / `GameTableView` 只於終局顯示最小「下一局」入口，並以 `tests/ui/next-round-flow.test.ts` 驗證非終局不顯示。
- [x] 4.2 實作 Requirement `Next-round action submission`：串接 props / emits，讓結果區操作只送出開始下一局意圖給 store，不在 component 內直接改 round state，並以 UI 測試驗證點擊後會呼叫對應 store action。

## 5. 整體驗證

- [x] 5.1 執行整體驗證：以 `npm test -- --run tests/core/dealer-progression.test.ts tests/ui/next-round-flow.test.ts tests/ui/game-session.store.test.ts tests/ui`、`npm run typecheck` 與 `spectra analyze taiwan-mahjong-draw-outcome-and-dealer-flow --json` 驗證流局／莊家流程閉環成立。
