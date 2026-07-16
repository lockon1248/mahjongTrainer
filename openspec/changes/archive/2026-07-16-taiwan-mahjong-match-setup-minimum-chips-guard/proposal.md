## Why

目前開局設定只擋 `<= 0`，使用者仍可輸入 `10` 這種極低籌碼，導致整場對局在非預期條件下快速進入破產結束。這與產品想避免意外設定的目標不符。

## What Changes

- 將開局初始籌碼的最低允許值明確定義為 `100`
- 在 setup modal 與 store 啟動邊界都套用相同的最小值防呆
- 補齊 UI / store regression tests

## Mainline Mapping

- Mainline task: `12. 開局籌碼與勝負條件設定`
- Child change: `taiwan-mahjong-match-setup-minimum-chips-guard`

## Impact

- 影響 `mahjong-match-session`
- 影響 `mahjong-vue-table-shell`
