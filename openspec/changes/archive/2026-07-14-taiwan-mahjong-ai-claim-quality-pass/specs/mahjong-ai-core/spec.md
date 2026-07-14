## ADDED Requirements

### Requirement: AI self-turn action decision

AI decision core 在自己的回合存在合法自回合動作時，必須能產生穩定決策，而不是直接略過到 discard。

#### Scenario: Self-draw win is chosen before lower-priority self-turn actions

- **WHEN** AI 在自己的回合同時存在 `win-self-draw` 與其他合法自回合候選
- **THEN** AI decision core 必須優先選擇 `win-self-draw`

##### Example: self-draw win beats concealed kan

- **GIVEN** 一組同時包含 `win-self-draw` 與 `kan-concealed` 的合法 AI 自回合候選
- **WHEN** decision core 做出選擇
- **THEN** 決策 MUST 為 `win-self-draw`
