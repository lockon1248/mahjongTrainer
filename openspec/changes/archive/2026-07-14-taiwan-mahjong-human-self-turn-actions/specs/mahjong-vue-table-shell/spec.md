## ADDED Requirements

### Requirement: Human self-turn action entry

前端牌桌在真人自己的回合中，必須顯示目前合法的自回合動作入口，讓真人可執行 `win-self-draw`、`kan-concealed`、`kan-added`，而不只限於打牌。

#### Scenario: Render only legal self-turn actions

- **WHEN** game store 暴露目前座位的自回合合法候選
- **THEN** game table view 必須只顯示這些合法動作，而不得渲染不合法按鈕

##### Example: self-draw win button appears only when legal

- **GIVEN** store 暴露一組包含 `win-self-draw` 的合法自回合候選
- **WHEN** table view 渲染真人回合操作區
- **THEN** 畫面必須顯示 `win-self-draw` 入口

### Requirement: Human self-turn action submission

當真人在自己的回合選擇合法自回合動作時，前端必須將意圖送交 store，再由 store 經由 core 套用，而不得在 component 內自行決定規則結果。

#### Scenario: Self-turn action is forwarded to the store

- **WHEN** 真人點擊一個合法的自回合按鈕
- **THEN** view 必須將該 action 與必要資料送至 store action，而不是在 component 內直接改 round state

##### Example: concealed kan click forwards the selected action

- **GIVEN** 真人目前回合存在一個合法 `kan-concealed` 候選
- **WHEN** 真人點擊該按鈕
- **THEN** view 必須將對應候選資料轉送給 store
