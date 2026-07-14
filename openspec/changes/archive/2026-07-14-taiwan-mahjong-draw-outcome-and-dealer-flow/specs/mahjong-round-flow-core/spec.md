## ADDED Requirements

### Requirement: Next-round dealer progression after win

round flow core 必須提供一個穩定的下一局初始化邊界，讓已結束的胡牌結果可依 baseline 已定案莊家規則建立下一局，而不需由 store 自行計算莊家流轉。

#### Scenario: Dealer win keeps the dealership

- **WHEN** 上一局以胡牌結束，且胡牌者就是上一局莊家
- **THEN** round flow core 必須建立一個下一局 baseline round，並維持相同莊家

##### Example: dealer win continues as dealer

- **GIVEN** 一個莊家 `east` 胡牌的終局狀態
- **WHEN** 呼叫端要求建立下一局
- **THEN** 新局的 `dealerSeat` MUST 為 `east`

#### Scenario: Non-dealer win passes dealership to the next seat

- **WHEN** 上一局以胡牌結束，且胡牌者不是上一局莊家
- **THEN** round flow core 必須依 baseline 讓胡牌者下家成為下一局莊家

##### Example: south win makes west the next dealer

- **GIVEN** 一個原莊家為 `east`、胡牌者為 `south` 的終局狀態
- **WHEN** 呼叫端要求建立下一局
- **THEN** 新局的 `dealerSeat` MUST 為 `west`

### Requirement: Draw outcome stays unresolved for undecided post-draw rules

當上一局是流局，且 baseline 尚未定案流局後是否連莊或查聽時，round flow core 不得靜默推導下一局。

#### Scenario: Draw does not silently create the next round

- **WHEN** 呼叫端以流局終局狀態要求建立下一局
- **THEN** round flow core 必須回報此路徑仍待定，而不得自行建立下一局

##### Example: draw keeps dealer progression unresolved

- **GIVEN** 一個 `draw` outcome，且其 unresolved 仍包含 `dealer-continuation`
- **WHEN** 呼叫端要求建立下一局
- **THEN** round flow core MUST 明確表示此路徑目前不可決定
