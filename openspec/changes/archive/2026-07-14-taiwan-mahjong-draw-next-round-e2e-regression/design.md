## Context

這次缺口不是規則正確性，而是驗證層級不足。流局後續局的 bug 已在 core 與 store 被修掉，但若瀏覽器層沒有固定回歸，之後仍可能因畫面 wiring、按鈕事件或 store 接線回退。

## Goals / Non-Goals

**Goals:**

- 提供一個可重現流局完成狀態的 E2E 場景。
- 驗證玩家在流局結果畫面按「下一局」後會進入新的 in-progress round。
- 在這輪把完整回歸補齊。

**Non-Goals:**

- 不新增新的流局商業規則。
- 不改動現有牌桌布局。

## Decisions

### 以 E2E bridge 直接建立可到達的流局完成狀態

這次要驗證的是 UI 真實流程，不是 AI 自動打一整局的隨機結果，因此以 bridge seed 一個合法的流局完成狀態最穩定。

### 驗證重點放在結果畫面到下一局的可操作連續性

測試要確認：
1. 畫面先顯示流局結果
2. 使用者看得到「下一局」
3. 點擊後回到新局的進行中狀態
4. 不顯示錯誤訊息

## Implementation Contract

### Task 1: draw next round E2E bridge

- Observable behavior:
  - E2E 模式可注入一個已流局結束、可按下一局的合法場景。
- Verification target:
  - `e2e/game-table.smoke.spec.ts`

### Task 2: draw next round browser regression

- Observable behavior:
  - 玩家在流局結果畫面按下「下一局」後會回到新局。
  - 新局應回到 `in-progress`，且摘要顯示莊家與本局資訊，不殘留上一局錯誤。
- Verification target:
  - `npm run test:e2e`

## Acceptance Criteria

- Playwright 有一條固定回歸覆蓋流局後按下一局。
- 這輪完整回歸包含 unit、typecheck 與 E2E。
