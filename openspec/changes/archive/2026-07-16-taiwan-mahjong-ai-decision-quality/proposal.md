## Summary

提升 AI 出牌與宣告決策品質，讓 3 位 AI 在既有合法規則邊界內做出更合理的選擇，減少明顯亂打與低價值副露。

## Motivation

`taiwan-mahjong-ai-decision-foundation` 已經建立 baseline heuristic 與可用的 decision core，`taiwan-mahjong-ai-claim-quality-pass` 也補過部分宣告品質；但目前產品目標是「中階 AI」，而不是只要能出一個合法動作就算完成。當 AI 長期做出破壞搭子、錯過明顯較佳保留、或在低價值情境過度副露的選擇時，即使規則與流程正確，整體對局仍會顯得失真且容易落入低品質流局。

這份 change 的責任不是改流程穩定性，而是聚焦 AI decision core 本身：讓出牌與宣告 heuristic 更接近 repo 既定的「基本牌效判斷與主動吃碰槓能力」。

## Proposed Solution

- 補齊 AI 出牌 heuristic regression，明確保護搭子保留、孤張處理、明顯完成度比較與保守棄牌。
- 補強宣告 heuristic，讓 `chi` / `pon` / `kan-exposed` / `pass` 的選擇更能反映牌型進展，而不是只求局部可行。
- 讓 AI decision output 保留足夠的 reasoning marker 或 score summary，方便測試驗證選擇品質。

## Non-Goals

- 不做搜尋式 AI、Monte Carlo 或全局 EV 模型。
- 不在這個 change 內調整 auto-turn timing 或 UI 延遲推進。
- 不新增未定案桌規的隱含加權。

## Impact

- Affected specs: `mahjong-ai-decision-core`
- Affected code:
  - Modified: `src/core/ai/decision.ts`, `src/core/ai/context.ts`, `src/core/ai/types.ts`, `tests/core/ai-decision-core.test.ts`
  - New: none
  - Removed: none
