## 1. 持續賽局的輪莊 / 連莊

- [x] 1.1 落地 design 的 task 1: 持續賽局的輪莊 / 連莊規格、Requirement `Next-round dealer progression after draw` 與決策「以局間輪莊規則作為持續賽局最小閉環」，讓流局後建立下一局時原莊續莊而不重設為初始東家，並以 `tests/core/dealer-progression.test.ts` 驗證。
- [x] 1.2 落地 design 的 task 1: 持續賽局的輪莊 / 連莊規格與 Requirement `Next-round dealer progression forms a continuous session loop`，讓胡牌與流局後的下一局都依前一局結果決定 `dealerSeat` 而不是回到單局 MVP 起點，並以 `tests/ui/next-round-flow.test.ts` 驗證。

## 2. 莊家旗標與當前出牌者高亮

- [x] 2.1 落地 design 的 task 2: 莊家旗標與當前出牌者強高亮、Requirement `Dealer badge on all four player panels` 與決策「莊家旗標與當前出牌者高亮都直接由 snapshot 驅動」，讓四家牌框都能顯示穩定的莊家旗標，並以 `tests/ui/game-table-view.test.ts` 驗證。
- [x] 2.2 落地 design 的 task 2: 莊家旗標與當前出牌者強高亮與 Requirement `Strong active turn highlight on the current player panel`，讓 `currentSeat` 對應的牌框具備強化高亮且不與莊家旗標混淆，並以 `tests/ui/game-table-view.test.ts` 驗證。

## 3. AI 約兩秒出牌節奏

- [x] 3.1 落地 design 的 task 3: ai 約兩秒出牌節奏、Requirement `AI auto-turn pacing remains human-readable` 與決策「AI 出牌節奏由 store 推進層節流，而不是 core 改成 async 規則」，讓 AI 自動推進以約兩秒節奏前進且不污染 core 介面，並以 `tests/ui/interactive-turn-loop.test.ts` 驗證。
- [x] 3.2 落地 design 的 task 3: ai 約兩秒出牌節奏與 Requirement `Human claim windows are not skipped by AI pacing`，讓 AI 節奏在遇到人類合法 `claim-window` 時會停下而不是自動略過，並以 `tests/ui/game-session.store.test.ts` 與 `e2e/game-table.smoke.spec.ts` 驗證。

## 4. 完整驗證

- [x] 4.1 完成本 change 回歸，讓 `npm run test -- tests/core/dealer-progression.test.ts tests/ui/next-round-flow.test.ts tests/ui/game-table-view.test.ts tests/ui/interactive-turn-loop.test.ts tests/ui/game-session.store.test.ts`、`npm run typecheck` 與 `npx playwright test e2e/game-table.smoke.spec.ts` 全部通過，並以命令輸出驗證。
