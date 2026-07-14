## ADDED Requirements

### Requirement: Human claim-window action

牌桌前端必須允許人類座位在 `claim-window` 中選擇目前合法的宣告動作，並將該意圖交給 store 套用。

#### Scenario: Human sees only legal claim actions

- **WHEN** 人類座位在當前 `claim-window` 中擁有一個以上合法宣告
- **THEN** 前端必須只顯示那些合法的宣告動作，而不得顯示不合法或未支援的按鈕

##### Example: human can pon but cannot chi

- **GIVEN** 人類座位對目前捨牌只具備 `pon` 與 `pass` 的合法候選
- **WHEN** 畫面渲染 claim action 區塊
- **THEN** 使用者必須看到 `pon` 與 `pass`，且不得看到 `chi`

#### Scenario: Human submits a selected claim action

- **WHEN** 人類點擊某一個合法宣告動作
- **THEN** 前端必須將該宣告意圖送給 session store，而不得在 component 內自行裁決 claim window

##### Example: human chooses pass

- **GIVEN** 人類座位有 `pass` 與其他合法宣告可選
- **WHEN** 人類點擊 `pass`
- **THEN** 前端必須將 `pass` 意圖送往 store，並等待 store 與 core 完成後續裁決

### Requirement: Claim-window pause before auto-advancement

當前端牌桌由 store 驅動回合推進時，若 `claim-window` 需要人類決定，畫面必須停在可互動狀態，而不是繼續自動推進。

#### Scenario: Human decision blocks auto-advance

- **WHEN** `claim-window` 對人類座位存在合法宣告候選
- **THEN** 前端必須維持在可操作的 claim 狀態，直到人類提交選擇或牌局結束

##### Example: claim window waits for human

- **GIVEN** 一次出牌已開啟 `claim-window`，且人類座位可合法 `win`
- **WHEN** store 更新快照到 view
- **THEN** 畫面必須停留在 `claim-window` 狀態並顯示 `win` 選項，而不是自動切換到下一家 `draw`
