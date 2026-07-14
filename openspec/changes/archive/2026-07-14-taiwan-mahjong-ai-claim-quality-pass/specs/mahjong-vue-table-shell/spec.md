## ADDED Requirements

### Requirement: AI auto-turn applies legal self-turn actions

當 store 自動推進 AI 回合時，若 AI 座位存在合法自回合動作，必須先套用該動作，再進入後續 discard 或終局，而不是直接忽略。

#### Scenario: Auto-turn applies AI self-turn action before discard

- **WHEN** 一個 AI 座位在自己的 `discard` 階段存在合法自回合候選
- **THEN** store 必須先透過 core 套用該自回合動作

##### Example: AI self-draw win ends the auto-turn loop

- **GIVEN** 一個 AI 座位在自己的回合同時具備合法 `win-self-draw`
- **WHEN** store 自動推進該 AI 回合
- **THEN** round MUST 直接進入 `win` outcome，而不是先走 discard
