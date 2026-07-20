## MODIFIED Requirements

### Requirement: 唯讀牌桌殼層

前端 SHALL 渲染一個唯讀的麻將牌桌殼層，將來自 core 支援的 store 牌局狀態映射到畫面，並在桌機與平板情境下維持對局畫面作為單一固定視窗舞台。該固定舞台除不得讓摘要、牌桌與玩家區塊把整頁撐出主捲軸外，還 MUST 在保留全站 header 與上方資訊列內容／樣式不變的前提下，優先擴大遊戲主舞台在寬螢幕下的橫向佔比，減少左右留白。

#### Scenario: render table snapshot as a wider fixed-stage game screen

- **WHEN** game store 持有一個已初始化的牌局快照
- **THEN** game table view SHALL 依該快照渲染可見的玩家區塊、桌面摘要、目前回合資訊與牌局結果摘要，且桌機與平板下 MUST 維持整個對局畫面在單一視窗內可見，並讓遊戲主舞台在寬螢幕下比前一版使用更多橫向空間

##### Example: initialized round uses a wider stage without changing header or summary styling

- **GIVEN** store state 內含一個已初始化的牌局快照，且頁面同時顯示全站 header、桌面摘要、中央牌桌、四家玩家區與玩家操作列
- **WHEN** game table view 渲染
- **THEN** view MUST 顯示所有座位與目前牌局資訊、MUST NOT 讓頁面出現主頁垂直捲軸，並 MUST 保留 header 與摘要列既有內容／樣式，同時讓遊戲區左右留白明顯少於前一版

#### Scenario: wider game stage expands the table layout instead of only stretching the shell

- **WHEN** 遊戲舞台在桌機寬螢幕下放大橫向寬度
- **THEN** 牌桌三欄配置 SHALL 同步擴大左右玩家區與中央牌池的可用寬度，而不是只拉大外層容器

##### Example: widened stage grows both shell and table columns

| Widened area | Expected result |
| ------------ | --------------- |
| Stage frame / scaler | Uses a higher percentage of the desktop viewport width than the previous stage tuning |
| Mahjong table columns | Left panel, center pools, and right panel all receive visibly larger horizontal room instead of staying at the previous conservative ratio |
