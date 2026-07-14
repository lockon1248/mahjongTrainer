## ADDED Requirements

### Requirement: Round result summary mapping

前端 selector 必須將 core 已有的 `RoundResult` 映射為穩定的結果摘要資料，供牌桌 UI 唯讀顯示。

#### Scenario: Win result is mapped into a readable summary

- **WHEN** store 持有一個 `win` outcome 的牌局
- **THEN** selector 必須映射出包含 `winnerSeat`、`discarderSeat`、`totalTai` 與結果類型的摘要資料

##### Example: discard win exposes winner and discarder

- **GIVEN** 一個 `winnerSeat = south`、`discarderSeat = west` 的胡牌結果
- **WHEN** selector 建立牌桌快照
- **THEN** 結果摘要 MUST 包含 `south` 與 `west`

### Requirement: Round result summary rendering

牌桌 UI 在本局結束時，必須顯示結果摘要；在本局尚未結束時，不得渲染該摘要。

#### Scenario: Only completed rounds render the result summary

- **WHEN** 牌局 outcome 為 `in-progress`
- **THEN** 畫面不得顯示結果摘要

##### Example: draw result shows draw reason

- **GIVEN** 一個 `draw` outcome，且 `drawReason = wall-exhausted`
- **WHEN** table view 渲染結果區
- **THEN** 畫面必須顯示該流局原因
