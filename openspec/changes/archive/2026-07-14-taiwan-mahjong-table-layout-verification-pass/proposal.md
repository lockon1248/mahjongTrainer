## Why

`taiwan-mahjong-table-layout-and-discards` 已經完成並封存，但依最新 workflow 稽核，它目前雖然有 core / store / component 測試，仍缺一條更貼近真實玩家路徑的多步流程驗證，無法明確證明「從 UI 觸發宣告，到副露區與中央捨牌池同步更新」這段可玩性行為可被重跑驗證。

這個 change 的目的不是改產品需求，而是補齊上一個 UI change 的驗證證據，讓它符合「每個 change 都有相對應單元測試或 E2E / 等效真實流程驗證」的防呆規則。

## What Changes

- 盤點 `taiwan-mahjong-table-layout-and-discards` 既有的 core / store / UI 測試覆蓋。
- 補上一條等效真實流程驗證，覆蓋「人類從 UI 進行宣告後，副露、暗手與中央捨牌池同步更新」。
- 以可重跑測試命令確認這條驗證與既有回歸測試一起通過。

## Non-Goals

- 不新增新的產品功能或 UI spec。
- 不重寫已封存 change 的需求內容。
- 不在這次 change 內引入完整 Playwright 基礎設施。

## Capabilities

### New Capabilities

- (none)

### Modified Capabilities

- (none)

## Impact

- Affected specs: (none)
- Affected code:
  - Modified: `openspec/changes/taiwan-mahjong-mainline-progress-board/design.md`
  - Modified: `openspec/changes/taiwan-mahjong-mainline-progress-board/tasks.md`
  - New: `tests/ui/table-layout-verification-flow.test.ts`
