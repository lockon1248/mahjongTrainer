## Context

AI 自動回合推進現在跨了三層：

- `gameSession` store 的 `advanceTurn()`
- `GameView.vue` 的延遲排程
- browser / component 測試對這條流程的驗證

這條鏈已經能跑完多數主線情境，但目前最脆弱的地方不是規則本身，而是「何時該繼續推進、何時必須停下、何時不應再排下一步」的流程穩定性。既有 `tests/ui/interactive-turn-loop.test.ts` 失敗就說明這層 guardrail 還不夠穩。

這次 change 要先把 AI 自動推進當成一個可驗證的流程系統來硬化，而不是先碰 AI 決策本身。

## Goals / Non-Goals

**Goals**

- 固定 AI 自動推進的 phase continuity。
- 補齊 claim-window、人類可介入、終局停止、下一局續局的流程 guardrail。
- 提供可重現的 store / UI / browser regression。

**Non-Goals**

- 不改 AI heuristic。
- 不新增 UI 新功能。
- 不改 round-flow core 規則。

## Decisions

### 以 store phase invariants 作為穩定性真相來源

AI 自動推進是否正確，應以 store round snapshot 的 phase / outcome / currentSeat 轉換為唯一真相，而不是只看畫面有沒有更新。測試也應優先驗證這些 invariants。

### 將延遲排程視為 UI wiring，不讓它決定規則

`GameView.vue` 的 timer 只負責「何時呼叫下一次 `advanceTurn()`」，不能自己推導流程。任何需要停下或終止的條件都必須由 store 可判斷，UI 只消費這個狀態。

### 用多層回歸保護 AI 自動推進

這次驗證至少分三層：

- store：phase continuity 與停止條件
- component：延遲後會續推、遇到人類 claim 會停
- browser：終局到下一局的真實可玩流程不回退

## Implementation Contract

### Task 1: AI auto-turn phase continuity

- Observable behavior:
  - AI 自動推進在 `draw`、`discard`、`claim-window`、`ended` 之間只會走合法轉換。
  - 當流程仍可繼續時，延遲後會安排下一步，而不是只跑第一步就停住。
- Failure modes:
  - 不可在 `in-progress` 狀態下漏排下一步而卡住。
  - 不可在 `ended` 狀態後仍繼續排程 `advanceTurn()`。
- Verification target:
  - `tests/ui/game-session.store.test.ts`
  - `tests/ui/interactive-turn-loop.test.ts`

### Task 2: Human intervention and claim-window pause stability

- Observable behavior:
  - 當人類座位在 `claim-window` 有合法候選時，AI 自動推進必須停下。
  - 當人類沒有合法候選時，AI 自動裁決路徑維持自動前進。
- Failure modes:
  - 不可略過人類可宣告時機。
  - 不可把無人類候選的 `claim-window` 永久卡住。
- Verification target:
  - `tests/ui/game-session.store.test.ts`
  - `tests/ui/interactive-turn-loop.test.ts`

### Task 3: Ended-to-next-round auto-turn recovery

- Observable behavior:
  - 本局結束時 AI 自動推進停止。
  - 按下「下一局」或進入新局後，新的 in-progress round 能重新建立正確自動推進語意。
- Failure modes:
  - 不可沿用上一局殘留 timer 或錯誤 phase。
  - 不可在新局開始後停留於 ended 語意。
- Verification target:
  - `tests/ui/next-round-flow.test.ts`
  - `e2e/game-table.smoke.spec.ts`

## Acceptance Criteria

- `mahjong-vue-table-shell` delta spec 已補上 AI auto-turn stability requirement。
- `interactive-turn-loop` 類型測試不再只驗證單步延遲，而是能保護整條 AI 自動推進鏈。
- browser regression 可覆蓋終局到下一局後 AI 流程重新接起。

## Scope Boundaries

**In scope**

- AI 自動推進 phase continuity
- claim-window / ended 停止條件
- store / UI / browser regression

**Out of scope**

- AI heuristic quality
- 新桌規
- 新 UI 設計
