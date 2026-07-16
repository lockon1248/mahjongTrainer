## Why

初始籌碼最低值已限制為 `100`，但目前 setup modal 在輸入不合法時只是不送出，使用者會卡在彈窗內卻不知道原因。這造成了可玩性與可理解性問題。

## What Changes

- 在開局 setup modal 內新增明確的最低籌碼錯誤提示
- 讓錯誤提示在使用者修正到合法值後自動清除
- 補齊 modal 驗證回饋測試

## Mainline Mapping

- Mainline task: `12. 開局籌碼與勝負條件設定`
- Child change: `taiwan-mahjong-match-setup-validation-feedback`

## Impact

- 影響 `mahjong-vue-table-shell`
