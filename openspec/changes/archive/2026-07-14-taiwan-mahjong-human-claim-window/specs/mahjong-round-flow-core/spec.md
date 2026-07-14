## ADDED Requirements

### Requirement: UI-safe human claim candidates

round flow core 必須提供一個穩定的合法宣告候選邊界，讓 UI 與 store 能在 `claim-window` 中讀取指定座位可執行的宣告，而不需在前端重新判定規則。

#### Scenario: Store reads legal human claim candidates

- **WHEN** store 在 `claim-window` 中請求某個座位的合法宣告候選
- **THEN** round flow core 必須回傳該座位目前可執行的宣告集合，包括 `pass` 與所有合法的 `chi`、`pon`、`kan-exposed`、`win`

##### Example: candidate list includes pass and pon

- **GIVEN** 一個 `claim-window` 狀態，其中人類座位可對當前捨牌執行 `pon`
- **WHEN** store 讀取該座位的合法宣告候選
- **THEN** 回傳集合必須包含 `pass` 與 `pon`

#### Scenario: Candidate helper respects seat and rule boundaries

- **WHEN** 某個宣告因座位順序或既有 baseline 規則而不合法
- **THEN** round flow core 必須排除該宣告，而不得將其錯誤暴露為可選候選

##### Example: non-next seat cannot chi

- **GIVEN** 一個 `claim-window` 中，指定座位不是出牌者的下家
- **WHEN** store 讀取該座位的合法宣告候選
- **THEN** 回傳集合不得包含 `chi`
