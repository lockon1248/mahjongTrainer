## 1. Core 自回合候選邊界

- [x] 1.1 實作 Requirement `Human self-turn action candidates` 的合法候選 helper，遵守設計決策「core 提供自回合合法動作候選」，讓 core 提供真人自回合合法動作候選，並以 `tests/core/human-self-turn-actions.test.ts` 驗證候選是否只在合法局面出現。
- [x] 1.2 完成 Requirement `Human self-turn action candidates` 的資料形狀，讓候選保留必要的 tile / meld 識別資訊，避免 store / UI 重算，並以 typecheck 與 core 測試驗證可直接消費。

## 2. Core 自回合狀態轉換

- [x] 2.1 實作 Requirement `Human self-turn action resolution` 的 `win-self-draw` 套用流程，讓合法自摸胡可直接結束牌局，並以 core 測試驗證 outcome 轉為 `win`。
- [x] 2.2 實作 Requirement `Human self-turn action resolution` 的 `kan-concealed`、`kan-added` 狀態轉換與後續補牌推進，遵守「槓後補牌仍走既有 round-flow 狀態機」，並以 core 測試驗證槓後會進入正確後續狀態。

## 3. Store 自回合 action 協調

- [x] 3.1 依設計決策「人類自回合 action 與既有 discard turn 共存」，在 `gameSession` store 暴露 `availableHumanSelfTurnActions`，只在真人自己的回合提供合法候選，並以 store 測試驗證無候選時維持既有出牌流程。
- [x] 3.2 在 `gameSession` store 新增 `submitHumanSelfTurnAction(...)`，讓真人送出合法自回合動作後正確更新 round 或 error，並以 store 測試驗證 `win-self-draw` 與至少一個槓牌路徑。

## 4. UI 自回合操作入口

- [x] 4.1 實作 Requirement `Human self-turn action entry`，並遵守「UI 採最小按鈕列，而不是重型操作面板」：在 `GameView` / `GameTableView` 顯示合法自回合按鈕列，並以 `tests/ui/human-self-turn-actions.test.ts` 驗證只渲染合法動作。
- [x] 4.2 實作 Requirement `Human self-turn action submission`：串接 props / emits，讓自回合按鈕將意圖送往 store，不在 component 內自行裁決，並以 UI 測試驗證點擊後會送出正確 action 資料。

## 5. 整體驗證

- [x] 5.1 執行整體驗證：以 `npm test -- --run tests/core/human-self-turn-actions.test.ts tests/ui/human-self-turn-actions.test.ts tests/ui/game-session.store.test.ts tests/ui`、`npm run typecheck` 與 `spectra analyze taiwan-mahjong-human-self-turn-actions --json` 驗證自回合 action 閉環成立。
