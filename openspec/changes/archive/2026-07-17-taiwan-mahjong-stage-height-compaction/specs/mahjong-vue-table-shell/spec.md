## MODIFIED Requirements

### Requirement: 唯讀牌桌殼層

前端 SHALL 渲染一個唯讀的麻將牌桌殼層，將來自 core 支援的 store 牌局狀態映射到畫面，並在桌機與平板情境下維持對局畫面作為單一固定視窗舞台。該固定舞台除不得讓摘要、牌桌與玩家區塊把整頁撐出主捲軸外，還 MUST 在保留全站 header 與上方資訊列內容／樣式不變的前提下，壓縮牌桌本體的原始高度，避免整個遊戲區因內容過高而被過度縮小。

#### Scenario: render table snapshot as a visually larger fixed-stage game screen

- **WHEN** game store 持有一個已初始化的牌局快照
- **THEN** game table view SHALL 依該快照渲染可見的玩家區塊、桌面摘要、目前回合資訊與牌局結果摘要，且桌機與平板下 MUST 維持整個對局畫面在單一視窗內可見，並讓牌桌本體以較低的基底高度換取更高的實際可視尺寸

##### Example: initialized round looks larger because the table base height is more compact

- **GIVEN** store state 內含一個已初始化的牌局快照，且頁面同時顯示全站 header、桌面摘要、中央牌桌、四家玩家區與玩家操作列
- **WHEN** game table view 渲染
- **THEN** view MUST 顯示所有座位與目前牌局資訊、MUST NOT 讓頁面出現主頁垂直捲軸，並 MUST 保留 header 與摘要列既有內容／樣式，同時讓實際畫面中的牌桌比前一版更大而不是縮在中央

#### Scenario: compacted table reduces stage shrink pressure instead of only changing width tokens

- **WHEN** 固定舞台在桌機寬螢幕下計算縮放
- **THEN** 牌桌本體 SHALL 以更低的原始高度降低縮放壓力，讓實際縮放倍率高於前一版，而不是只改寬度 token 但維持相同縮小感

##### Example: compacted player panels and discard pools increase visible table size

| Compacted area | Expected result |
| -------------- | --------------- |
| Player panels | Smaller base height with the same seat information still visible |
| Center discard pools | Lower empty-state height so the stage can render at a larger visible scale |
| Overall stage | The rendered game table appears visibly larger while the page still avoids vertical scrolling |
