## 1. 出牌判斷品質

- [x] 1.1 落地 design 的決策「先用可解釋 heuristic 補品質，不跳到搜尋式 AI」與 task 1: discard heuristic quality regression、Requirement `AI discard heuristic preserves stronger hand progress`，讓 AI 優先保留較高完成度的結構而不是隨意拆搭，並以 `tests/core/ai-decision-core.test.ts` 驗證。

## 2. 宣告判斷品質

- [x] 2.1 落地 design 的決策「以典型劣化案例驅動 regression」與 task 2: claim heuristic quality regression、Requirement `AI claim heuristic prefers meaningful improvement over blind melding`，讓 AI 在低價值副露時可保守 `pass`、在明顯改善時正確副露，並以 `tests/core/ai-decision-core.test.ts` 驗證。

## 3. 完整驗證

- [x] 3.1 落地 design 的決策「保留可測試的 reasoning marker」，並完成本 change 回歸，讓 `npm run test -- tests/core/ai-decision-core.test.ts`、`npm run typecheck` 與 `spectra analyze taiwan-mahjong-ai-decision-quality --json` 全部通過，並以命令輸出驗證。
