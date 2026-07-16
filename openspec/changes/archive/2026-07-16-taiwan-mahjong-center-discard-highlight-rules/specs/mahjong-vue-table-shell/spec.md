## ADDED Requirements

### Requirement: 中央牌池 claim highlight semantics

牌桌前端在 `claim-window` 期間 SHALL 以合法宣告候選驅動中央牌池高亮語意，明確區分吃牌判讀、碰／明槓插隊判讀與放槍胡牌判讀，而不得再以單一「最新捨牌」樣式混用所有情境。

#### Scenario: 白色高亮只標示可吃的上一手最後一張

- **WHEN** 畫面處於 `claim-window`，且人類合法候選中存在 `chi`
- **THEN** 前端 MUST 只在目前出牌者 discard pool 的最後一張捨牌顯示白色高亮，且不得將其他歷史捨牌標示為可吃目標

##### Example: human can chi the current discard

- **GIVEN** 目前出牌者為 `north`，其 discard pool 最後一張為 `三萬`，且人類合法候選為 `pass` 與 `chi`
- **WHEN** 中央牌池渲染 `north` 的 discard pool
- **THEN** 只有 `三萬` MUST 顯示白色吃牌高亮

#### Scenario: 紅色與黃色高亮依合法插隊候選疊加

- **WHEN** 畫面處於 `claim-window`，且人類合法候選中存在 `pon`、`kan-exposed` 或 `win`
- **THEN** 前端 MUST 將目前出牌者 discard pool 的最後一張捨牌標示為紅色插隊高亮、黃色放槍高亮，或兩者同時存在，且不得互相覆蓋

##### Example: same discard can both interrupt and win

| Legal claim candidates | Expected highlight on current discard |
| ----- | ----- |
| `pass`, `pon` | red |
| `pass`, `win` | yellow |
| `pass`, `pon`, `win` | red + yellow |

#### Scenario: 非 claim-window 或無合法宣告時不得顯示宣告高亮

- **WHEN** 畫面不在 `claim-window`，或人類候選只有 `pass`
- **THEN** 中央牌池 MUST NOT 顯示這次新增的白色、紅色或黃色宣告高亮

### Requirement: AI winning proof reveal

當終局結果為 `win` 且和牌者不是人類座位時，牌桌前端 SHALL 亮出該 AI 的實際手牌與副露作為和牌證明，讓玩家可直接檢視其和牌內容，而不得只顯示台型摘要。

#### Scenario: AI discard win reveals the winner hand proof

- **WHEN** 終局結果為 AI 榮和，且 result summary 已指出和牌座位
- **THEN** 畫面 MUST 顯示該 AI 座位的暗手與副露證明區塊

##### Example: north wins on discard

- **GIVEN** 終局結果顯示 `north` 為和牌者、`east` 為放槍者，且 `north` 在當前 snapshot 中仍有暗手與副露資料
- **WHEN** table view 渲染終局結果
- **THEN** 使用者 MUST 能看到 `north` 的和牌證明牌區，而不只有文字結果摘要

#### Scenario: Human win or draw does not show AI proof reveal

- **WHEN** 終局結果不是 AI 和牌，例如人類和牌或流局
- **THEN** 畫面 MUST NOT 額外渲染 AI 和牌證明區塊

##### Example: human win keeps result summary only

| Result type | Winner seat | Expected AI proof reveal |
| ----- | ----- | ----- |
| `win` | `east`（human） | hidden |
| `draw` | none | hidden |
