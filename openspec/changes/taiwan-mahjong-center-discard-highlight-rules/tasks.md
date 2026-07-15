## 1. 中央牌池高亮資料 contract 與高亮樣式語意

- [x] 1.1 落地 design 的 task 1: 中央牌池高亮資料 contract、Requirement `中央牌池 claim highlight semantics` 與決策「使用合法宣告候選導出中央牌池高亮狀態」，讓 `GameTableView` 只用既有 `claimCandidates` / snapshot 導出單張捨牌的白、紅、黃高亮狀態，並以 `tests/ui/human-claim-window.test.ts` 驗證。
- [x] 1.2 落地 design 的 task 2: 中央牌池高亮樣式與語意、決策「最後一張捨牌限定白色吃牌高亮」、「紅色與黃色高亮都只標示當前可宣告目標牌」與「紅黃高亮共存而不互相覆蓋」，讓中央牌池只有目前出牌者最後一張可出現宣告高亮，且 `pon` / `kan-exposed` 與 `win` 可紅黃共存，並以 `tests/ui/game-table-layout.test.ts` 驗證。

## 2. AI 和牌證明展示

- [x] 2.1 落地 design 的 task 3: ai 和牌證明展示、Requirement `AI winning proof reveal` 與決策「AI 和牌證明直接復用終局快照」，讓 AI 和牌終局時畫面會顯示其暗手與副露證明，而人類和牌或流局不會誤顯示，並以 `tests/ui/round-result-sync.test.ts` 驗證。
- [x] 2.2 讓 browser flow 可觀察 Requirement `AI winning proof reveal` 與 `中央牌池 claim highlight semantics` 的真實畫面差異，並以 `e2e/game-table.smoke.spec.ts` 驗證中央牌池高亮與 AI 和牌證明都由實際畫面呈現。

## 3. 完整驗證

- [x] 3.1 完成本 change 回歸，讓 `npm run test -- tests/ui/human-claim-window.test.ts tests/ui/game-table-layout.test.ts tests/ui/round-result-sync.test.ts tests/ui/game-table-view.test.ts`、`npm run typecheck` 與 `npx playwright test e2e/game-table.smoke.spec.ts` 全部通過，並以命令輸出驗證。
