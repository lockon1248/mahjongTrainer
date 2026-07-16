## Context

`taiwan-mahjong-match-setup-minimum-chips-guard` 已把最低初始籌碼收斂為 `100`，但目前 modal submit 被阻擋時沒有任何訊息。使用者現在會看到一個仍開著的彈窗，但不知道是因為數值太低。

## Goals / Non-Goals

**Goals:**

- 當初始籌碼低於 `100` 時，在 setup modal 中顯示明確提示
- 當使用者修正為合法值後，自動清除提示
- 保持現有 native modal 結構，不引入外部 UI 套件

**Non-Goals:**

- 不修改最低值 `100`
- 不增加新的勝利條件或結算規則
- 不把這個提示做成 browser alert / OS dialog

## Decisions

### Keep the validation feedback inside the existing setup modal

使用者卡住的地方就在 setup modal，所以回饋也應該出現在同一個 modal 內，而不是依賴外層頁面 error banner。這樣能在最接近操作點的位置解釋原因。

### Clear the message as soon as the input becomes valid

錯誤提示不應殘留到使用者已經輸入合法值之後，因此在 input 回到 `>= 100` 時即自動清除。

## Implementation Contract

- Behavior:
  - 當使用者在 setup modal 內輸入小於 `100` 的初始籌碼並按下送出時，modal MUST 顯示明確錯誤訊息。
  - 當使用者將初始籌碼修正為 `100` 或以上時，錯誤訊息 MUST 自動消失。
- Interface / data shape:
  - 錯誤提示由 `MatchSetupModal` 的本地 UI state 管理。
- Failure modes:
  - modal 不得在不合法值下沉默失敗。
- Acceptance criteria:
  - `tests/ui/match-setup-modal.test.ts` 驗證錯誤訊息出現與清除。

