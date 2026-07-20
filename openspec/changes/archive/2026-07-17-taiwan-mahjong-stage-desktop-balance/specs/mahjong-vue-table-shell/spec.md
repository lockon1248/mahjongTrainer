## MODIFIED Requirements

### Requirement: 唯讀牌桌殼層

前端 SHALL 渲染一個唯讀的麻將牌桌殼層，將來自 core 支援的 store 牌局狀態映射到畫面，並在桌機與平板情境下維持對局畫面作為單一固定視窗舞台。該固定舞台除不得讓摘要、牌桌與玩家區塊把整頁撐出主捲軸外，還 MUST 在大桌機 viewport 下維持合理的桌面比例平衡，不得因縮放回到 `1` 而將牌桌過度攤平成不自然的滿寬布局。

#### Scenario: render table snapshot as a balanced fixed-stage desktop layout

- **WHEN** game store 持有一個已初始化的牌局快照，且桌機 viewport 足夠大到讓固定舞台不必縮放
- **THEN** game table view SHALL 仍維持合理的桌面比例，不得把玩家面板與中央牌池過度水平拉平

##### Example: large desktop keeps the table balanced instead of fully stretched

- **GIVEN** store state 內含一個已初始化的牌局快照，且頁面顯示全站 header、桌面摘要、中央牌桌與四家玩家區
- **WHEN** game table view 在大桌機 viewport 下渲染
- **THEN** view MUST 保持固定舞台無主頁垂直捲軸，也 MUST 讓牌桌看起來像合理桌面比例，而不是滿版平鋪的長條式布局

#### Scenario: balanced desktop layout preserves readable player panels

- **WHEN** 玩家面板顯示手牌、花牌、副露與捨牌統計
- **THEN** 這些統計 SHALL 採用較均衡的資訊密度，而不是在大桌機下被過度橫向展開成空洞的單列視覺

##### Example: player stat groups remain compact on large desktop

| Area | Expected result |
| ---- | --------------- |
| Player stat grid | Remains visually grouped instead of stretching into a sparse single row |
| Overall stage | Larger than the overly shrunken version, but not as flat as the over-expanded version |
