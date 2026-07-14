## ADDED Requirements

### Requirement: 和牌摘要必須顯示正確台型與總台數

牌桌 UI SHALL 在和牌結果摘要中顯示來自 scoring core 的 `scoringItems` 與 `totalTai`，而不是只顯示和牌座位與結束狀態。

#### Scenario: 榮和結果摘要顯示台數

- **WHEN** 玩家以 `discard-win` 完成合法和牌，且 scoring core 已產生台型與總台數
- **THEN** 結果摘要 MUST 顯示對應的台型明細與 `totalTai`

##### Example: 榮和後顯示實際台數

- **GIVEN** `east` 對 `north` 的捨牌完成和牌，且 scoring core 產生至少一個台型與對應 `totalTai`
- **WHEN** 牌桌渲染本局結果摘要
- **THEN** 玩家 MUST 看得到非空的台型明細與總台數，而不是 `無`
