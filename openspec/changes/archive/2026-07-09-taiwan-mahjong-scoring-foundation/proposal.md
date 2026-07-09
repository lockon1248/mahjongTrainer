## Why

上一個 change 已完成規則 baseline、規則測試矩陣、core domain model 與 rule-case schema，但目前專案仍缺少真正可執行的胡牌與算台核心。若此時直接進入 Vue 或牌局流程，胡牌成立條件、台型比對與結算責任仍會被迫分散在 store 或 UI，違反目前已建立的 core 邊界。

## What Changes

- 建立純 TypeScript 的牌型拆解基礎模型，供後續胡牌判定與算台比對重用。
- 建立標準胡牌成立判定，先覆蓋 `WIN-STANDARD-001` 與 `WIN-MELD-001` 需要的核心行為。
- 建立基礎台型比對介面與結算輸出 shape，讓 `SCORE-STACK-001` 可用固定 schema 驗證。
- 建立對應的 `tests/core` 測試，將規則測試矩陣中的 scoring 相關案例落成可執行測試。

## Non-Goals

- 不實作 Vue app scaffold、router、pinia 或任何牌桌 UI。
- 不處理發牌、摸打循環、補花流程、宣告窗口、流局連莊等完整牌局流程。
- 不補進尚未確認的特殊胡、封頂、查聽、搶槓或最低台數規則。
- 不在本 change 內實作 AI 出牌或副露策略。

## Capabilities

### New Capabilities

- `mahjong-scoring-core`: 定義台灣 16 張麻將的牌型拆解、標準胡牌判定、基礎台型比對與結算輸出邊界。

### Modified Capabilities

(none)

## Impact

- Affected specs: `mahjong-scoring-core`
- Affected code:
  - New: `openspec/changes/taiwan-mahjong-scoring-foundation/specs/mahjong-scoring-core/spec.md`, `openspec/changes/taiwan-mahjong-scoring-foundation/design.md`, `openspec/changes/taiwan-mahjong-scoring-foundation/tasks.md`, `src/core/scoring/`, `tests/core/`
  - Modified: `src/core/index.ts`, `src/core/testing/ruleCase.ts`
  - Removed: (none)
