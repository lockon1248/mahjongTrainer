## ADDED Requirements

### Requirement: Mainline playable flow regression coverage

專案必須有一組主線回歸測試，覆蓋當前可玩閉環的主要路徑，而不是只依賴分散的局部測試。

#### Scenario: Mainline regression covers win or draw result sync

- **WHEN** 執行主線回歸測試
- **THEN** 測試必須覆蓋至少一條胡牌或流局終局路徑，並驗證結果摘要有同步到 UI

##### Example: human or AI action reaches a visible terminal summary

- **GIVEN** 一個主線牌局路徑會通往終局
- **WHEN** 測試跑完該路徑
- **THEN** UI 快照 MUST 反映終局結果摘要
