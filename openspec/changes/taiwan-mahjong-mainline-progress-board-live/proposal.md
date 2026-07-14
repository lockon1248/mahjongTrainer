## Why

目前 `taiwan-mahjong-mainline-progress-board` 的 task 已全部完成，但它仍被留在 active 狀態當主線看板使用，這和「完成的 change 應封存」規則衝突。問題不是主線板不需要存在，而是主線板需要用「交接」而不是「永遠不封存」的方式維持。

這個 change 的目的，是建立一份新的 live 主線板作為當前進度來源，並讓舊主線板在交接完成後正式封存，避免再出現「task 全勾完但 change 不封存」的結構矛盾。

## What Changes

- 建立新的 active 主線 progress board change 作為 current board。
- 將目前最新主線狀態複製到新 board。
- 封存舊的 `taiwan-mahjong-mainline-progress-board`。
- 補上全域與 repo workflow 規則，要求主線板用 successor handoff 方式輪替。

## Non-Goals

- 不新增產品需求。
- 不直接實作 UI 真實性稽核內容。
- 不改動既有 child change 的完成狀態。

## Capabilities

### Modified Workflow

- 主線 progress board 改採 successor handoff lifecycle，而不是 completed-but-still-active 模式。

## Impact

- Affected workflow:
  - Modified: `/Users/tim/.codex/AGENTS.md`
  - Modified: `AGENTS.md`
  - Modified: `openspec/changes/taiwan-mahjong-mainline-progress-board/design.md`
  - New active board: `openspec/changes/taiwan-mahjong-mainline-progress-board-live/`
