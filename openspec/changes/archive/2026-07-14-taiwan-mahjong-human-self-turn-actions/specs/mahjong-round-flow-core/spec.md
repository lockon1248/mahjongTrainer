## ADDED Requirements

### Requirement: Human self-turn action candidates

round flow core 必須提供一個穩定的自回合合法動作候選邊界，讓 store 與 UI 能讀取目前座位在自己回合可執行的 `win-self-draw`、`kan-concealed`、`kan-added`，而不需在前端重算規則。

#### Scenario: Store reads legal self-turn actions

- **WHEN** store 在真人自己的回合請求目前座位的合法自回合候選
- **THEN** round flow core 必須回傳該座位目前可執行的自回合動作集合，且不得混入不合法動作

##### Example: self-draw win is exposed as a legal action

- **GIVEN** 一個目前座位已完成合法自摸胡的回合狀態
- **WHEN** store 讀取該座位的自回合候選
- **THEN** 回傳集合必須包含 `win-self-draw`

#### Scenario: Kan-related candidates preserve concrete action data

- **WHEN** 某個自回合動作需要消耗手牌或升級既有 meld
- **THEN** round flow core 必須在候選資料中保留具體 tile 或 meld 識別資訊，讓 UI 與 store 可直接送出意圖而不重算

##### Example: concealed kan candidate keeps its four-tile identity

- **GIVEN** 一個目前座位握有合法暗槓的回合狀態
- **WHEN** store 讀取該座位的自回合候選
- **THEN** 回傳的 `kan-concealed` 候選必須包含對應的牌張資訊

### Requirement: Human self-turn action resolution

當真人送出合法自回合動作時，round flow core 必須正確套用該動作並推進後續狀態，包括結束牌局或進入槓後補牌流程。

#### Scenario: Self-draw win ends the round

- **WHEN** 真人送出合法 `win-self-draw`
- **THEN** round flow core 必須將牌局轉為 win outcome，而不得繼續停留在一般出牌流程

##### Example: self-draw win changes outcome to win

- **GIVEN** 一個目前座位已達成合法自摸胡的回合狀態
- **WHEN** 套用 `win-self-draw`
- **THEN** 牌局 outcome MUST 變成 `win`

#### Scenario: Kan action continues with replacement draw

- **WHEN** 真人送出合法 `kan-concealed` 或 `kan-added`
- **THEN** round flow core 必須套用該槓動作，並將牌局推進到後續補牌所需的合法狀態

##### Example: concealed kan enters replacement draw flow

- **GIVEN** 一個目前座位可以合法暗槓的回合狀態
- **WHEN** 套用 `kan-concealed`
- **THEN** 牌局狀態 MUST 反映該槓已成立，且 MUST 進入後續補牌所需的推進路徑
