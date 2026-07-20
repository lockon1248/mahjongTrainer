## MODIFIED Requirements

### Requirement: 唯讀牌桌殼層

前端 SHALL 渲染一個唯讀的麻將牌桌殼層，將來自 core 支援的 store 牌局狀態映射到畫面，並在桌機與平板情境下維持對局畫面作為單一固定視窗舞台，而不是讓摘要、牌桌與玩家區塊把整頁撐出主捲軸。

#### Scenario: render table snapshot as a fixed-stage game screen

- **WHEN** game store 持有一個已初始化的牌局快照
- **THEN** game table view SHALL 依該快照渲染可見的玩家區塊、桌面摘要、目前回合資訊與牌局結果摘要，且桌機與平板下 MUST 維持整個對局畫面在單一視窗內可見

##### Example: initialized round stays within a single viewport stage

- **GIVEN** store state 內含一個已初始化的牌局快照，且畫面同時顯示桌面摘要、中央牌桌、四家玩家區與玩家操作列
- **WHEN** game table view 渲染
- **THEN** view MUST 顯示所有座位與目前牌局資訊，且不得在 component 內重新實作規則邏輯，也 MUST NOT 讓頁面因這些內容而出現主頁垂直捲軸

#### Scenario: expanded player sections remain inside the fixed stage

- **WHEN** 玩家副露區、操作列或結果摘要增加可見內容
- **THEN** 對局畫面 SHALL 仍維持在同一個固定舞台內，超出空間的壓力 MUST 由局部區塊吸收，而不是重新把整頁高度撐開

##### Example: exposed meld growth does not reintroduce page scroll

| Visible content increase | Expected result |
| ------------------------ | --------------- |
| Human player gains multiple exposed meld groups | The fixed-stage layout remains visible without page-level vertical scrolling |
| Round-end summary and next-round action appear | The summary and action remain inside the same stage without extending the document height |
