## ADDED Requirements

### Requirement: Next-round action entry after round end

前端牌桌在單局已結束時，必須提供下一局操作入口；但在單局尚未結束時，不得顯示該入口。

#### Scenario: Show next-round entry only after the round ends

- **WHEN** game store 暴露的牌局 outcome 已不是 `in-progress`
- **THEN** game table view 必須顯示下一局入口

##### Example: next-round button appears after win

- **GIVEN** store 暴露一個 `win` outcome 的終局快照
- **WHEN** table view 渲染結果區
- **THEN** 畫面必須顯示「下一局」入口

### Requirement: Next-round action submission

當使用者在終局畫面選擇開始下一局時，前端必須把意圖送交 store，再由 store 透過 core 決定是否能建立下一局，而不得在 component 內自行改 round state。

#### Scenario: Next-round action is forwarded to the store

- **WHEN** 使用者點擊下一局入口
- **THEN** view 必須將該意圖送至 store action，而不是在 component 內直接建立下一局

##### Example: next-round click forwards intent

- **GIVEN** 一個已結束的牌局畫面
- **WHEN** 使用者點擊「下一局」
- **THEN** view 必須呼叫對應的 store action
