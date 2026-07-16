## 1. AI 自動推進穩定性

- [x] 1.1 落地 design 的決策「以 store phase invariants 作為穩定性真相來源」與 task 1: AI auto-turn phase continuity、Requirement `AI auto-turn progression remains phase-stable`，讓 AI 自動推進只走合法 phase 轉換且不中途停滯，並以 `tests/ui/game-session.store.test.ts` 與 `tests/ui/interactive-turn-loop.test.ts` 驗證。

## 2. claim-window 與終局停頓保護

- [x] 2.1 落地 design 的決策「將延遲排程視為 UI wiring，不讓它決定規則」與 task 2: Human intervention and claim-window pause stability、Requirement `AI auto-turn yields to human claim intervention`，讓人類有合法宣告時 AI 自動推進必須停下，並以 `tests/ui/game-session.store.test.ts` 與 `tests/ui/interactive-turn-loop.test.ts` 驗證。
- [x] 2.2 落地 design 的決策「用多層回歸保護 AI 自動推進」與 task 3: ended-to-next-round auto-turn recovery、Requirement `AI auto-turn resets cleanly across ended and next-round transitions`，讓終局停止與下一局恢復都能被真實流程保護，並以 `tests/ui/next-round-flow.test.ts` 與 `e2e/game-table.smoke.spec.ts` 驗證。

## 3. 完整驗證

- [x] 3.1 完成本 change 回歸，讓 `npm run test -- tests/ui/game-session.store.test.ts tests/ui/interactive-turn-loop.test.ts tests/ui/next-round-flow.test.ts`、`npm run typecheck` 與 `npx playwright test e2e/game-table.smoke.spec.ts` 全部通過，並以命令輸出驗證。
