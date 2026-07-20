## MODIFIED Requirements

### Requirement: 唯讀牌桌殼層

前端 SHALL 渲染一個唯讀的麻將牌桌殼層，將來自 core 支援的 store 牌局狀態映射到畫面，並在桌機與平板情境下維持對局畫面作為單一固定視窗舞台。該固定舞台除不得讓摘要、牌桌與玩家區塊把整頁撐出主捲軸外，還 MUST 優先把遊戲主舞台放大到更接近可用視窗空間，同時在本需求範圍內保留全站 header 與現有資訊列內容／樣式不變。

#### Scenario: render table snapshot as a larger fixed-stage game screen

- **WHEN** game store 持有一個已初始化的牌局快照
- **THEN** game table view SHALL 依該快照渲染可見的玩家區塊、桌面摘要、目前回合資訊與牌局結果摘要，且桌機與平板下 MUST 維持整個對局畫面在單一視窗內可見，並讓遊戲主舞台比前一版更接近可用視窗空間

##### Example: initialized round uses a larger stage without changing header or summary styling

- **GIVEN** store state 內含一個已初始化的牌局快照，且頁面同時顯示全站 header、桌面摘要、中央牌桌、四家玩家區與玩家操作列
- **WHEN** game table view 渲染
- **THEN** view MUST 顯示所有座位與目前牌局資訊、MUST NOT 讓頁面出現主頁垂直捲軸，並 MUST 保留 header 與摘要列既有內容／樣式，同時讓遊戲區視覺上明顯放大

#### Scenario: enlarged game stage keeps expanded sections inside the same viewport

- **WHEN** 玩家副露區、操作列或結果摘要增加可見內容
- **THEN** 對局畫面 SHALL 仍維持在同一個固定舞台內，超出空間的壓力 MUST 由局部區塊吸收，且放大後的遊戲區 MUST 仍比前一版更貼近可用視窗邊界

##### Example: larger stage still avoids page scroll after result summary appears

| Visible content increase | Expected result |
| ------------------------ | --------------- |
| Human player gains multiple exposed meld groups | The enlarged fixed-stage layout remains visible without page-level vertical scrolling |
| Round-end summary and next-round action appear | The summary and action remain inside the same enlarged stage without extending the document height |
