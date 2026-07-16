## Summary

強化 AI 自動回合推進的穩定性與驗證閉環，避免規則已經可處理的局面在 store / UI 自動推進層出現 phase 混亂、停滯或續局接線脆弱。

## Motivation

目前 repo 已具備 AI 自動摸打、人類 claim-window 暫停、終局後下一局與 dealer progression 等多段流程，但這些行為分散在 `gameSession` store、`GameView` 的延遲推進，以及 browser / component 測試之間。先前 `taiwan-mahjong-dealer-rotation-and-turn-pace` 就已經暴露出 `interactive-turn-loop` 驗證不穩，代表 AI 自動推進層仍缺一份專注於「流程穩定性」的 hardening change。

這份 change 不假設目前有新的已知產品 bug；它的目標是把 AI 自動推進從「大致可用」補到「有明確 guardrail 與可重現驗證」，優先降低未來出現卡 phase、停在錯誤狀態或終局續局接線回退卻無法及早發現的風險。

## Proposed Solution

- 盤點並收斂 AI 自動推進的唯一責任邊界：`advanceTurn()`、`claim-window` 暫停條件、延遲排程與終局後停止條件。
- 補 store / UI / browser regression，固定 AI 多步推進、claim-window 暫停、人類可介入時停止、終局後不再誤排程，以及下一局重新進入 in-progress 的流程語意。
- 將與 AI 自動推進相關的流程觀測點明確化，讓測試能直接驗證 phase continuity，而不是只靠畫面偶然同步。

## Non-Goals

- 不在這個 change 內調整 AI 出牌或吃碰槓胡策略品質。
- 不新增新的輪莊、計分或桌規邏輯。
- 不重做牌桌視覺設計或結果 UI 文案。

## Impact

- Affected specs: `mahjong-vue-table-shell`
- Affected code:
  - Modified: `src/stores/gameSession.ts`, `src/views/game/GameView.vue`, `src/views/game/e2eBridge.ts`, `tests/ui/game-session.store.test.ts`, `tests/ui/interactive-turn-loop.test.ts`, `tests/ui/next-round-flow.test.ts`, `e2e/game-table.smoke.spec.ts`
  - New: none
  - Removed: none
