## Why

主 spec `openspec/specs/taiwan-mahjong-trainer.md` 需要一份持續有效的主線 progress board，才能直接回答「現在做到哪裡」「下一步是什麼」。先前的 `taiwan-mahjong-mainline-playable-v1` 已作為一個階段性的總表被歸檔，但在 `taiwan-mahjong-table-layout-and-discards` 完成後，repo 內缺少一份新的 active 主線 change 來承接目前進度與下一步。

這份 change 的目的不是新增產品功能，而是把主線進度板恢復成 repo 內的即時權威來源，避免之後又要從 archived changes 反推當前狀態。

## What Changes

- 建立新的 active 主線 progress board，直接對應 `openspec/specs/taiwan-mahjong-trainer.md`。
- 回填目前已完成的主線段落，至少包含先前已歸檔能力與 `taiwan-mahjong-table-layout-and-discards`。
- 明確列出唯一的目前進行中主線任務，以及它對應的 child change 狀態欄位。
- 明確標示 `current active child change` 與 `next planned child change` 僅為狀態資訊，不得當成已完成 task。
- 定義後續維護規則：每次 child change 完成並 archive 後，同步更新這份 progress board。

## Non-Goals

- 這份 change 不直接新增任何產品功能。
- 這份 change 不重新定義既有 capability spec。
- 這份 change 不替尚未定案的下一個 UI 需求自行命名或補規格。

## Capabilities

### New Capabilities

- (none)

### Modified Capabilities

- (none)

## Impact

- Affected specs: `taiwan-mahjong-trainer`
- Affected code:
  - New: `openspec/changes/taiwan-mahjong-mainline-progress-board/.openspec.yaml`
  - New: `openspec/changes/taiwan-mahjong-mainline-progress-board/proposal.md`
  - New: `openspec/changes/taiwan-mahjong-mainline-progress-board/design.md`
  - New: `openspec/changes/taiwan-mahjong-mainline-progress-board/tasks.md`
