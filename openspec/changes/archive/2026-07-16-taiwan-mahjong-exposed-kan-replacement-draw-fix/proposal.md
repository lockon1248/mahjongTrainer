## Why

目前 round flow 在接受 `kan-exposed` 後，會直接把牌局切回出牌階段，卻沒有補上台灣 16 張麻將規則要求的槓後補牌。這會讓玩家或 AI 進入少一張活牌的錯誤狀態，進而出現已副露成型卻無法正常收尾或胡牌的死局體驗。

## What Changes

- 將 `mahjong-round-flow-core` 的 claim resolution contract 補齊為：`kan-exposed` 被接受後，必須和暗槓、加槓一樣從牌尾補牌，直到補到非花牌才回到出牌階段。
- 補上明槓補牌的回歸驗證，涵蓋 claim-window 裁決後的手牌張數、牌尾消耗與花牌連續補牌語意。
- 將這個 bugfix 掛回主線 board，明確標示為目前進行中的 child change。

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `mahjong-round-flow-core`: accepted `kan-exposed` claims now require the same replacement-draw flow as other kong actions so the claimant keeps a legal live-tile count before discarding.

## Impact

- Affected specs: `mahjong-round-flow-core`
- Affected code:
  - Modified: `src/core/rules/roundFlow.ts`
  - Modified: `tests/core/round-flow-claims.test.ts`
  - Modified: `openspec/changes/taiwan-mahjong-mainline-progress-board-current/design.md`
  - Modified: `openspec/changes/taiwan-mahjong-mainline-progress-board-current/tasks.md`
