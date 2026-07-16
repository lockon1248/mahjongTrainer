## Context

AI decision core 現在已經能做到三件事：

- 選出合法的出牌
- 有胡先胡
- 在部分宣告場景中用 baseline heuristic 選 `chi` / `pon` / `pass`

但「能選」不等於「選得像中階 AI」。目前缺的是更清楚的品質護欄：哪些搭子不該輕易拆、哪些孤張應優先放掉、什麼情況下副露反而比 `pass` 更差。這些不是新規則，而是既有 AI 能力要補到比較可信的決策品質。

## Goals / Non-Goals

**Goals**

- 提高 AI discard heuristic 的手牌完成度判讀。
- 提高 AI claim heuristic 對 `pass` 與副露的品質判斷。
- 讓測試能直接保護幾個典型「不該亂打」案例。

**Non-Goals**

- 不做深度搜尋。
- 不把 scoring 全量導入 discard EV。
- 不改 UI auto-turn。

## Decisions

### 先用可解釋 heuristic 補品質，不跳到搜尋式 AI

這次仍維持 deterministic heuristic，但補強其判斷維度，例如搭子保留、完成面數、重複價值比較與過度副露抑制。這能在不爆炸擴張成本的前提下，先把最明顯的低品質決策修掉。

### 以典型劣化案例驅動 regression

與其追求抽象「更聰明」，這次應先把最常見的劣化案例寫成可執行測試，例如：

- 不要為了打一張字牌而拆現成搭子
- 不要在無明確前進收益時隨便 `chi`
- 不要在 `pass` 明顯更穩時過度 `pon`

### 保留可測試的 reasoning marker

若 decision output 完全不可解釋，品質回歸很難定位。因此這次允許 decision core 對外暴露足以測試的 score summary 或 reasoning marker，但不把它包裝成產品 UI。

## Implementation Contract

### Task 1: discard heuristic quality regression

- Observable behavior:
  - AI 在多個合法棄牌中，應優先保留完成度較高的搭子與順子結構。
  - AI 對明顯孤張或低連結價值牌的棄牌優先度應高於拆有效搭子。
- Failure modes:
  - 不可為了局部單張評分而拆掉明顯較佳的兩面或已成型結構。
  - 不可回退成「只要合法就隨便打一張」。
- Verification target:
  - `tests/core/ai-decision-core.test.ts`

### Task 2: claim heuristic quality regression

- Observable behavior:
  - 當 `chi` / `pon` / `kan-exposed` 無法提供明確前進收益時，AI 應可保守選 `pass`。
  - 當副露能明確改善手牌結構時，AI 應優先該宣告而不是無條件 `pass`。
- Failure modes:
  - 不可過度副露破壞手牌結構。
  - 不可因保守策略而忽略明顯更好的合法宣告。
- Verification target:
  - `tests/core/ai-decision-core.test.ts`

## Acceptance Criteria

- `mahjong-ai-decision-core` delta spec 已補上更高品質的 discard / claim heuristic requirement。
- `tests/core/ai-decision-core.test.ts` 至少覆蓋一組 discard quality regression 與一組 claim quality regression。
- `npm run test -- tests/core/ai-decision-core.test.ts` 與 `npm run typecheck` 通過。

## Scope Boundaries

**In scope**

- discard heuristic quality
- claim heuristic quality
- reasoning markers for testability

**Out of scope**

- auto-turn stability
- 搜尋式 AI
- UI 顯示 AI 思考過程
