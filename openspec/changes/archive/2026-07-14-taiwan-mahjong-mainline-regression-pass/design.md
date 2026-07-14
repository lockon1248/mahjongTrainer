## Context

目前已有多個 child change 分別覆蓋：

- 真人 claim-window
- 真人自回合動作
- 流局與下一局銜接
- 結果同步
- AI 自回合動作

但主線仍缺「整條路徑在現在 repo 狀態下能一起成立」的回歸測試。

## Goals / Non-Goals

**Goals**

- 用一組主線整合測試覆蓋主要閉環
- 執行全域驗證並確認 mainline / archived changes 一致

**Non-Goals**

- 不做新功能
- 不再拆新規格

## Decisions

### 主線整合測試以既有能力組合，不重寫規則

測試只組合既有 store/core/UI 能力，不在測試中重寫規則判定。

### 至少覆蓋兩條主線終局

整合測試至少覆蓋：

- 胡牌結果同步
- 流局結果同步

## Implementation Contract

**Acceptance criteria**

- `tests/ui/mainline-playable-flow.test.ts` 覆蓋開局、摸打、宣告、胡牌或流局、結果同步
- `npm test -- --run tests/core tests/ui`
- `npm run typecheck`
- `spectra analyze taiwan-mahjong-mainline-regression-pass --json`
