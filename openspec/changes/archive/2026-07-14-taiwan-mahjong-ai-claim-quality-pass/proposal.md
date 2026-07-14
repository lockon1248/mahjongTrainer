## Why

目前主線已讓真人具備完整基本操作，也能把結果接回 UI；但 AI 仍只會做兩件事：

- 出牌
- 在 `claim-window` 做宣告裁決

它還不會在自己的回合執行 `win-self-draw`、`kan-concealed`、`kan-added`。這會造成主線在某些局面下雖可跑，但 AI 會錯過明顯合法動作，影響基本可玩閉環。

## What Changes

- 補上 AI 自回合 decision 邊界
- 讓 store 自動回合推進時會先處理 AI 自回合合法動作，再進入 discard
- 補齊 AI 測試與互動回合測試

## Non-Goals

- 不做進階牌效最佳化
- 不做長期策略或風險評估
- 不處理未定案規則如搶槓

## Capabilities

### New Capabilities

- `mahjong-ai-core`: AI 自回合動作決策

### Modified Capabilities

- `mahjong-vue-table-shell`: AI 自動回合推進時會處理合法自回合動作

## Impact

- Affected specs: `mahjong-ai-core`, `mahjong-vue-table-shell`
- Affected code:
  - Modified: `src/core/ai/decision.ts`, `src/core/ai/types.ts`, `src/core/ai/context.ts`, `src/stores/gameSession.ts`
  - New: `tests/ui/ai-self-turn-actions.test.ts`
  - Modified tests: `tests/core/ai-decision-core.test.ts`, `tests/ui/interactive-turn-loop.test.ts`
