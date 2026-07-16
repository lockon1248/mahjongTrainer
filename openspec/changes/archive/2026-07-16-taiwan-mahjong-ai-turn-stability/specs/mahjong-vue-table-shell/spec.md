## ADDED Requirements

### Requirement: AI auto-turn progression remains phase-stable

當牌桌由 AI 自動推進回合時，前端 store 與 UI wiring 必須只沿著合法 phase continuity 前進，且不得在仍可繼續的 in-progress 狀態中無故停滯。

#### Scenario: Delayed auto-advance continues until the round requires a stop

- **WHEN** 一個 AI 驅動中的本機 round 仍處於 `in-progress`
- **THEN** 自動推進 MUST 在合法延遲後繼續前進，直到遇到 `claim-window` 人類介入或 `ended` 停止條件

##### Example: AI auto-turn does not stall after the first delayed step

- **GIVEN** 一個尚未結束、且目前不需要人類介入的 AI 自動回合
- **WHEN** 第一個延遲後的 `advanceTurn()` 已完成
- **THEN** 系統 MUST 在後續仍可前進時繼續安排下一步，而 MUST NOT 永遠停在第一個延遲步驟後

### Requirement: AI auto-turn yields to human claim intervention

當 `claim-window` 對人類座位存在合法候選時，AI 自動推進必須暫停並等待人類決定，而不是繼續略過該視窗。

#### Scenario: Human claim opportunity stops AI auto-advance

- **WHEN** AI 的上一個出牌開啟 `claim-window`，且人類座位存在合法宣告
- **THEN** 自動推進 MUST 停留在該 `claim-window` 狀態直到人類提交選擇或牌局結束

##### Example: claim-window with human win is not auto-skipped

- **GIVEN** AI 捨牌後，人類座位可合法 `win`
- **WHEN** UI / store 評估是否繼續排程自動推進
- **THEN** 系統 MUST 保持在 `claim-window`，且 MUST NOT 自動切往下一家的 `draw`

### Requirement: AI auto-turn resets cleanly across ended and next-round transitions

當本局結束後，AI 自動推進必須停止；當新的下一局開始時，系統必須以新 round state 重新建立自動推進，而不是沿用舊局殘留狀態。

#### Scenario: New round resumes clean auto-turn after the previous round ended

- **WHEN** 一個 ended round 經由下一局流程切換成新的 in-progress round
- **THEN** 新局的 AI 自動推進 MUST 以新的 round snapshot 為準重新啟動，且 MUST NOT 殘留上一局的 ended 狀態或錯誤排程

##### Example: next round does not inherit ended auto-turn state

- **GIVEN** 一局已顯示結果並允許開始下一局
- **WHEN** 玩家進入下一局
- **THEN** 新 round MUST 回到可正常自動推進的 in-progress 狀態，且 MUST NOT 看起來仍停留在上一局結束狀態
