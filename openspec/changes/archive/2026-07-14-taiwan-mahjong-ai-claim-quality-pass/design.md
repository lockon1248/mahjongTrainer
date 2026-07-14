## Context

AI 目前的 decision core 只有：

- `chooseAiDiscardDecision`
- `chooseAiClaimDecision`

而 `advanceTurn()` 在 AI `discard` 階段也只會直接選一張牌丟出。這代表當 AI 自己手上已合法自摸，或可暗槓 / 加槓時，系統仍會跳過這些合法動作。

## Goals / Non-Goals

**Goals**

- 讓 AI 在自己的回合會先檢查合法自回合動作
- 最少支援 `win-self-draw`、`kan-concealed`、`kan-added`
- 維持既有 AI 自動推進能力

**Non-Goals**

- 不做複雜權重優化
- 不做未定案規則

## Decisions

### AI 自回合優先順序採保守主線策略

AI 自回合先採最小可玩策略：

- 有 `win-self-draw` 就直接胡
- 否則有槓牌候選就選一個合法槓
- 否則回到既有 discard

### Store 仍透過 core 套用 AI 自回合動作

AI 不直接改 state；store 仍透過既有 core helper / action 套用。

### 不做進階最佳化，只確保主線不漏合法動作

這次只補主線缺口，不追求最好 decision。

## Implementation Contract

**Behavior**

- AI 自己的回合若存在合法 `win-self-draw`，必須優先執行
- 若沒有自摸胡但有合法 `kan-concealed` / `kan-added`，AI 必須能執行至少一個合法槓牌候選
- 若沒有自回合候選，既有 discard 流程維持原樣

**Acceptance criteria**

- `tests/core/ai-decision-core.test.ts` 驗證 AI 自回合優先選自摸胡，其次可選槓牌
- `tests/ui/ai-self-turn-actions.test.ts` 或 store/互動測試驗證 AI 自動回合會實際套用自回合動作
- `npm test -- --run tests/core/ai-decision-core.test.ts tests/ui/ai-self-turn-actions.test.ts tests/ui/interactive-turn-loop.test.ts`
- `npm run typecheck`
- `spectra analyze taiwan-mahjong-ai-claim-quality-pass --json`
