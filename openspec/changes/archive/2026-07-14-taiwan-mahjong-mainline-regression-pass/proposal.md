## Why

主線前 1 到 8 段已分別完成，但還缺一組明確的主線回歸驗證，確認：

- 開局
- 摸打
- 宣告
- 胡牌或流局
- 結果同步

這些已完成能力在目前 codebase 中能一起成立，而不是只各自單測通過。

## What Changes

- 新增主線整合測試
- 執行主線層級 typecheck / UI / core / Spectra 驗證

## Non-Goals

- 不新增新規則
- 不調整 UI 設計
- 不做額外重構

## Capabilities

### Modified Capabilities

- `mahjong-vue-table-shell`: 主線整合測試覆蓋與回歸保護

## Impact

- Affected specs: `mahjong-vue-table-shell`
- Affected code:
  - New: `tests/ui/mainline-playable-flow.test.ts`
  - Modified: (none)
