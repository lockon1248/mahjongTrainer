## MODIFIED Requirements

### Requirement: 唯讀牌桌殼層

前端 SHALL 渲染一個唯讀的麻將牌桌殼層，將來自 core 支援的 store 牌局狀態映射到畫面，並在桌機與平板情境下維持對局畫面作為單一固定視窗舞台。該固定舞台除不得讓摘要、牌桌與玩家區塊把整頁撐出主捲軸外，還 MUST 在桌機 viewport 下有效利用主要可用寬度，減少過量左右留白，並維持中央牌桌與底部玩家操作區的合理桌面密度。

#### Scenario: render table snapshot with a rebalanced stage area on desktop

- **WHEN** game store 持有一個已初始化的牌局快照，且桌機 viewport 足以完整顯示固定舞台
- **THEN** game table view SHALL 讓主要遊戲區明顯佔據可用畫面寬度，而不是保留過量左右留白

##### Example: desktop viewport gives more area to the playable stage

- **GIVEN** store state 內含一個已初始化的牌局快照，且頁面已渲染 header、摘要列、中央牌桌與四家玩家區
- **WHEN** game table view 在桌機 viewport 下渲染
- **THEN** 固定舞台 MUST 維持無主頁捲軸，也 MUST 讓遊戲區比目前失真版本更有效利用桌面寬度

##### Example: wider desktop viewport does not stop too early at a narrow stage cap

- **GIVEN** 約 `2048px` 的桌機 viewport，且牌桌內容可在不縮放或輕微縮放下完整顯示
- **WHEN** game table view 渲染固定舞台
- **THEN** 舞台 MUST 不得過早停在造成明顯左右邊界空白的寬度上限

#### Scenario: bottom player panel stays readable without becoming bloated

- **WHEN** 下方玩家區同時顯示玩家狀態、操作按鈕、統計與暗手牌
- **THEN** 其版型 SHALL 優先維持操作可讀性，而不是形成空洞、過高的資訊板視覺

##### Example: bottom player panel reads as an action area instead of a stretched banner

| Area | Expected result |
| ---- | --------------- |
| Bottom player panel | Keeps action affordance and concealed tiles readable while reducing empty vertical feel |
| Center table | Stays visually central instead of looking squeezed into a narrow middle strip |
