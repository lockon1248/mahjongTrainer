## Why

前兩個 change 已完成規則 baseline 與 scoring foundation，但專案仍缺少真正可執行的牌局流程核心。若此時直接進入 UI 或 AI，發牌、補花、摸打順序、宣告窗口與流局判定就會被迫散落在 store 或 view，破壞目前已建立的 `src/core` 邊界。

## What Changes

- 建立純 TypeScript 的 round flow core，定義發牌、起手補花、回合摸打與牌牆耗盡流局的基礎流程。
- 建立宣告窗口與優先序處理基礎，先覆蓋 baseline 已確認的 `胡 > 槓 > 碰 > 吃`。
- 建立對應的 `tests/core` 測試，將 `FLOWER-REPLACE-*`、`FLOWER-CHAIN-*`、`CLAIM-PRIORITY-*`、`DRAW-*` 類型案例落成可執行測試。
- 保持未定案桌規外掛化，不在本 change 內寫死流局查聽、流局連莊、搶槓、過水與一炮多響。

## Non-Goals

- 不實作完整 AI 決策或出牌策略。
- 不實作 Vue app scaffold、router、Pinia 或牌桌畫面。
- 不補進尚未確認的特殊胡、完整台型、最低台數與花牌計分。
- 不在本 change 內決定流局後是否連莊、是否查聽、是否搶槓或是否過水限制。

## Capabilities

### New Capabilities

- `mahjong-round-flow-core`: 定義台灣 16 張麻將 baseline 的發牌、補花、摸打循環、宣告優先序與流局流程核心。

### Modified Capabilities

(none)

## Impact

- Affected specs: `mahjong-round-flow-core`
- Affected code:
  - New: `openspec/changes/taiwan-mahjong-round-flow-foundation/specs/mahjong-round-flow-core/spec.md`, `src/core/rules/`, `tests/core/`
  - Modified: `src/core/index.ts`, `src/core/testing/ruleCase.ts`, `src/core/types/action.ts`, `src/core/types/result.ts`, `src/core/types/table.ts`
  - Removed: (none)
