## 1. AI 自回合 decision

- [x] 1.1 實作 Requirement `AI self-turn action decision` 的 decision helper，遵守設計決策「AI 自回合優先順序採保守主線策略」與「不做進階最佳化，只確保主線不漏合法動作」，讓 AI 先選 `win-self-draw`，其次合法槓牌，並以 `tests/core/ai-decision-core.test.ts` 驗證。

## 2. Store 自動回合推進

- [x] 2.1 實作 Requirement `AI auto-turn applies legal self-turn actions`：在 `gameSession` 的 AI 自動回合推進中接入自回合候選，遵守設計決策「Store 仍透過 core 套用 AI 自回合動作」，讓 AI 可在 discard 前執行合法自回合動作，並以 `tests/ui/ai-self-turn-actions.test.ts` 或互動測試驗證。

## 3. 整體驗證

- [x] 3.1 執行整體驗證：以 `npm test -- --run tests/core/ai-decision-core.test.ts tests/ui/ai-self-turn-actions.test.ts tests/ui/interactive-turn-loop.test.ts`、`npm run typecheck` 與 `spectra analyze taiwan-mahjong-ai-claim-quality-pass --json` 驗證 AI 主線補強成立。
