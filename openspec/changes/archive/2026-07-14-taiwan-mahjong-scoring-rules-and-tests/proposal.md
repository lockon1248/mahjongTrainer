## Why

目前專案雖然已經有基本可玩牌桌與回合流程，但產品核心目標其實是「麻將練習台數與計算」。現況只有極少量示範台型，`claim-window` 的和牌結果甚至沒有完整接入 scoring，使玩家在榮和後看不到正確台數。像 `天胡`、`大小三元` 等特殊規則與完整台型清單，也尚未成為 repo 內的權威規格與測試主線。

這個 change 的目的，是把主線重新拉回 scoring/rules 核心：先補齊權威規則文件與測試矩陣，再規劃 scoring core、round-flow、UI 與 browser E2E 的逐步落地任務。

## What Changes

- 建立一個新的 scoring / rules child change，專門處理台型、特殊胡型、最低胡牌台數與結果接線。
- 補一份以中文為主的權威規則擴充規劃，將 `天胡`、`大小三元` 與其他待補台型納入主線工作。
- 新增 `mahjong-scoring-core` capability spec，定義 scoring 必須來自權威規則目錄，而不是只靠零散示範台型。
- 將和牌結果接線、規則擴充、單元測試、整合測試與 browser E2E 拆成可逐步完成的 task。

## Non-Goals

- 這個 change 不在 proposal 階段直接猜完整台型台數表。
- 這個 change 不在此刻一次實作所有 scoring 規則。
- 這個 change 不重新設計既有牌桌版面。

## Capabilities

### New Capabilities

- `mahjong-scoring-core`: 提供可被 round flow、store 與 UI 使用的權威算台規則、特殊胡型與總台數計算能力。

### Modified Capabilities

- `mahjong-rule-config-core`: 補齊最低胡牌台數、特殊胡型與相關桌規設定的權威來源。
- `mahjong-vue-table-shell`: 讓和牌結果摘要必須能正確顯示台型明細與總台數，而不是只顯示和牌結束。

## Impact

- Affected specs: `mahjong-scoring-core`, `mahjong-rule-config-core`, `mahjong-vue-table-shell`
- Affected code:
  - Modified: `openspec/specs/taiwan-mahjong-rules-baseline.md`
  - Modified: `openspec/specs/taiwan-mahjong-rule-test-matrix.md`
  - Modified: `openspec/changes/taiwan-mahjong-mainline-progress-board/design.md`
  - Modified: `openspec/changes/taiwan-mahjong-mainline-progress-board/tasks.md`
  - New: `openspec/changes/taiwan-mahjong-scoring-rules-and-tests/specs/mahjong-scoring-core/spec.md`
  - Modified: `src/core/scoring/validation.ts`
  - Modified: `src/core/scoring/patterns.ts`
  - Modified: `src/core/scoring/settlement.ts`
  - Modified: `src/core/rules/roundFlow.ts`
  - Modified: `src/views/game/selectors.ts`
  - Modified: `src/views/game/components/GameTableView.vue`
  - Modified: `tests/core/scoring-patterns.test.ts`
  - Modified: `tests/core/scoring-settlement.test.ts`
  - Modified: `tests/core/scoring-win-validation.test.ts`
  - Modified: `tests/core/round-flow-outcome.test.ts`
  - Modified: `tests/ui/round-result-sync.test.ts`
  - Modified: `e2e/game-table.smoke.spec.ts`
