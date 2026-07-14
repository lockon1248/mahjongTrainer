## Context

`RoundResult` 已存在於 core，包含 `winnerSeat`、`discarderSeat`、`totalTai`、`scoringItems`、`drawReason` 與 unresolved draw 規則；但目前 `GameTableSnapshotViewModel` 只帶 `outcome` 字串，導致 view 只能知道「有沒有結束」，不知道結果細節。

這表示畫面雖然已可在終局顯示「下一局」，卻仍沒有主線必要資訊讓玩家理解這局到底發生了什麼。

## Goals / Non-Goals

**Goals**

- 讓 selector 將 `RoundResult` 映射為穩定結果摘要
- 讓 UI 在本局結束時顯示結果摘要
- 驗證 view 僅做唯讀映射，不重算規則

**Non-Goals**

- 不補充新的結果規則
- 不做複雜 modal / 面板互動
- 不在 component 內計算 payout

## Decisions

### Selector 提供結果摘要 view model

結果摘要必須由 selector 提供，而不是在 component 內直接拆 `RoundResult`。這樣 UI 可以保持唯讀。

### UI 採最小結果摘要區

這次只做最小資訊區，涵蓋：

- result type
- ended
- winner seat
- discarder seat
- total tai
- draw reason

### In-progress 不顯示結果摘要

當本局尚未結束時，結果摘要區不應渲染空殼。

## Implementation Contract

**Behavior**

- 當 outcome 為 `win` 或 `draw`，畫面必須顯示結果摘要
- 當 outcome 為 `in-progress`，畫面不得顯示結果摘要
- selector 必須使用既有 `RoundResult` 作為唯一資料來源

**Interface / data shape**

- `GameTableSnapshotViewModel` 至少新增一個結果摘要欄位
- `GameTableView` 透過 props 唯讀渲染該摘要

**Failure modes**

- 若 win 結果缺少 `winnerSeat` 顯示，視為主線錯誤
- 若 discard win 顯示錯誤的 `discarderSeat`，視為主線錯誤
- 若 draw 結果畫面自行推論不存在的結算資料，視為主線錯誤

**Acceptance criteria**

- `tests/ui/round-result-sync.test.ts` 驗證 win / draw 結果摘要顯示
- 既有 UI 測試仍通過
- `npm test -- --run tests/ui/round-result-sync.test.ts tests/ui`
- `npm run typecheck`
- `spectra analyze taiwan-mahjong-ui-round-result-sync --json`

**Scope boundaries**

- In scope: selector 映射、最小結果摘要 UI、對應測試
- Out of scope: payout breakdown、動畫、複雜結果面板
