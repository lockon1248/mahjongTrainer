## Why

目前牌桌 UI 已出現「畫面有欄位、但後面沒有真實規則驅動」的誤導問題。這不只是單一欄位 bug，而是整個前端狀態顯示流程缺少一條明確的產品真實性檢核主線。若不先補這條主線，之後任何 `聽牌`、`可胡`、`可宣告`、`局勢狀態`、`提示` 類 UI 都可能再次把 placeholder state、debug state 或未完成欄位直接暴露成產品資訊。

這個 change 的目的，是先建立一條「所有 UI 狀態都必須由明確規則或業務判定驅動」的檢核主線，並把牌桌目前所有狀態顯示欄位列入稽核與後續修正任務來源。

## What Changes

- 建立新的 UI 真實性 child change，專門稽核牌桌上所有狀態欄位是否有對應規則來源。
- 為 `mahjong-vue-table-shell` 補上「UI 狀態不得顯示未驅動 placeholder」的權威 requirement。
- 將稽核、分類、修正與驗證拆成可執行的 task，而不是零碎 bugfix。
- 把這次錯誤抽象成全域與 repo `AGENTS.md` 的防呆規則。

## Non-Goals

- 這個 change 不在 proposal 階段直接實作全部 UI 狀態修正。
- 這個 change 不直接猜所有尚未定案的規則值。
- 這個 change 不進行新的視覺設計。

## Capabilities

### Modified Capabilities

- `mahjong-vue-table-shell`: 牌桌 UI 的所有產品狀態欄位都必須可追溯到明確規則、演算法或業務判定來源。

## Impact

- Affected specs: `mahjong-vue-table-shell`
- Affected workflow:
  - Modified: `/Users/tim/.codex/AGENTS.md`
  - Modified: `AGENTS.md`
  - Modified: `openspec/changes/taiwan-mahjong-mainline-progress-board/design.md`
