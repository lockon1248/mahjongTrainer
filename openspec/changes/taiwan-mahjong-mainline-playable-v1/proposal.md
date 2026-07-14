## Why

主 spec 的產品目標是「在瀏覽器中提供可完整進行基本牌局流程的台灣 16 張麻將」，但目前實作只完成其中一部分主線能力。雖然已經有 Vue 殼層、Pinia session、基礎規則核心、AI 自動回合與人類出牌入口，離「完整可玩」仍缺少幾個明確且可排序的主線缺口。

目前 repo 內已有單點 capability change，但還缺一份直接對應主 spec 的總主線 change，用來定義接下來要依序完成哪些任務、哪些 change 應先做、每一步完成後主線會前進到哪裡。這份 change 的目的就是補上這個總控任務清單。

這份 change 不是為了新增另一套 spec 系統，而是要把主 spec 已完成的歷史工項、目前進行中的能力，以及後續尚未開始的主線缺口，全部收斂到單一入口，讓後續每完成一個子 change 就能立即回填主線進度。

## What Changes

- 建立一份直接對應 `openspec/specs/taiwan-mahjong-trainer.md` 的主線 change。
- 將「完整基本牌局流程」拆成按依賴順序排列的主線任務。
- 為每個主線任務定義完成條件、對應 change 名稱與大致影響範圍。
- 明確標記目前已完成、進行中、尚未開始的主線項目，避免後續再從 capability spec 反推總進度。
- 補上「主 spec 交付階段」對「已歸檔 / 進行中 / 下一個子 change」的對照。
- 建立後續維護規則：任何主線子 change 狀態變更時，必須同步更新這份總表。

## Non-Goals

- 這個 change 不直接實作任何產品功能。
- 這個 change 不新增新的規則定案內容。
- 這個 change 不取代各 capability 自己的 proposal / design / delta spec。
- 這個 change 不把尚未確認的桌規空缺直接當成已定案需求。

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

(none)

## Impact

- Affected specs: `taiwan-mahjong-trainer`
- Affected code:
  - New: `openspec/changes/taiwan-mahjong-mainline-playable-v1/proposal.md`, `openspec/changes/taiwan-mahjong-mainline-playable-v1/design.md`, `openspec/changes/taiwan-mahjong-mainline-playable-v1/tasks.md`
  - Modified: (none)
  - Removed: (none)
