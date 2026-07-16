## ADDED Requirements

### Requirement: AI discard heuristic preserves stronger hand progress

AI decision core 在多個合法棄牌皆可行時，必須優先保留較高完成度與較佳前進性的手牌結構，而不是只要合法就任意棄一張。

#### Scenario: Keep useful structure instead of discarding randomly

- **WHEN** AI 的合法棄牌候選中，同時存在會破壞有效搭子與不會破壞有效搭子的選項
- **THEN** AI decision core MUST 優先選擇不會破壞較強手牌進展的棄牌

##### Example: isolate a weak tile instead of breaking a two-sided wait

- **GIVEN** 一手同時包含一組明顯較有價值的兩面搭子與一張低連結價值孤張
- **WHEN** AI 評估本回合的棄牌
- **THEN** 被選中的棄牌 MUST 優先為該低價值孤張，而 MUST NOT 為拆掉該兩面搭子的其中一張

### Requirement: AI claim heuristic prefers meaningful improvement over blind melding

當不存在胡牌時，AI 的宣告 heuristic 必須比較副露是否真的改善手牌進展；若沒有明確收益，AI 應可保守選擇 `pass`。

#### Scenario: Pass when a legal meld does not improve the hand enough

- **WHEN** AI 面對一個合法 `chi`、`pon` 或 `kan-exposed` 候選，但該副露無法提供明確前進收益
- **THEN** AI decision core MUST 可以選擇 `pass`

##### Example: decline a low-value chi

- **GIVEN** 一次合法 `chi` 會破壞較佳手牌結構，且相較於 `pass` 沒有明顯改善完成度
- **WHEN** AI 評估該組宣告候選
- **THEN** 被選中的動作 MUST 為 `pass`

#### Scenario: Meld when the legal claim clearly improves the hand

- **WHEN** 一個合法副露能明確提升手牌完成度，且不存在更高優先級的 `win`
- **THEN** AI decision core MUST 選擇該改善最大的宣告，而不是無條件 `pass`

##### Example: choose pon when it clearly advances the hand

- **GIVEN** 一組候選中 `pon` 能讓手牌結構明顯前進，而 `pass` 只保留較差進展
- **WHEN** AI 評估宣告候選
- **THEN** 被選中的動作 MUST 為該 `pon`
