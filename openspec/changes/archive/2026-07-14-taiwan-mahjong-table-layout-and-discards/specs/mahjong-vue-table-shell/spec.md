## ADDED Requirements

### Requirement: 依桌位相對位置呈現牌桌

牌桌 SHALL 將真人玩家固定渲染在桌面下方，其餘三家依桌位相對位置環繞中央桌面，而不是只以資料順序平面排列。

#### Scenario: 真人玩家固定在下方

- **WHEN** 牌桌渲染一個已初始化的牌局
- **THEN** 真人玩家座位 MUST 出現在下方玩家區域，其餘三家 MUST 出現在其餘環繞位置

##### Example: 東家真人玩家維持在下方

- **GIVEN** 真人控制座位為 `east`
- **WHEN** 牌桌渲染目前牌局快照
- **THEN** `east` 玩家 MUST 出現在下方區域，`north` 與 `south` MUST 出現在左右側區域，`west` MUST 出現在上方對家區域

### Requirement: 中央桌面完整顯示四家捨牌池

牌桌 SHALL 在中央桌面同時顯示四家的捨牌池，而不是只顯示捨牌數量。

#### Scenario: 四家捨牌池都可在中央區讀取

- **WHEN** 牌局快照中有一位以上玩家已經捨牌
- **THEN** 牌桌 MUST 在中央桌面渲染每一家的捨牌內容，並保留座位歸屬

##### Example: 混合捨牌張數仍可讀取

| Seat | Discard tiles |
| ---- | ------------- |
| east | `1-character`, `2-character` |
| south | `5-dot` |
| west | none |
| north | `red-dragon`, `east-wind`, `plum` |

- **WHEN** 牌桌渲染這個快照
- **THEN** 中央區域 MUST 顯示四個捨牌池，包含 `west` 的空捨牌池，而不是把資訊折疊成數字統計

### Requirement: 真人暗手依台灣麻將順序顯示

牌桌 SHALL 以 `萬 -> 筒 -> 條 -> 風 -> 三元 -> 花` 的順序顯示真人玩家暗手。

#### Scenario: 混合暗手會先分組再顯示

- **WHEN** 真人玩家暗手同時包含數牌、字牌與花牌
- **THEN** 顯示順序 MUST 依序為 `萬`、`筒`、`條`、`風`、`三元`、`花`

##### Example: 混合手牌先依顯示順序整理

- **GIVEN** 真人暗手包含 `7-bamboo`、`east-wind`、`3-character`、`red-dragon`、`2-dot`、`orchid`
- **WHEN** 牌桌渲染這手牌
- **THEN** 顯示順序 MUST 為 `3-character`、`2-dot`、`7-bamboo`、`east-wind`、`red-dragon`、`orchid`

### Requirement: 副露區與捨牌池必須反映裁決後牌局狀態

當 `claim-window` 裁決接受 `chi`、`pon`、`kan-exposed` 時，牌桌 SHALL 顯示宣告者的新副露，且 claimed tile MUST 不再留在觸發者的中央捨牌池中。

#### Scenario: 碰牌後副露與捨牌池同步

- **WHEN** 某位玩家對他家捨牌宣告 `pon` 並被裁決接受
- **THEN** 宣告者的副露區 MUST 顯示新的 `pon` 組合，且被碰的那張牌 MUST 從觸發者捨牌池移除

##### Example: 西風碰牌不再同時留在兩處

- **GIVEN** `east` 對 `north` 打出的 `west-wind` 成功宣告 `pon`
- **WHEN** 牌桌渲染裁決後快照
- **THEN** `east` 的副露區 MUST 顯示包含 `west-wind` 的碰組，且 `north` 的中央捨牌池 MUST NOT 再保留同一張被碰走的 `west-wind`
