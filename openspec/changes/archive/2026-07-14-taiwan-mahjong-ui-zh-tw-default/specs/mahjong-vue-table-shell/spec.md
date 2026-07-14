## ADDED Requirements

### Requirement: Product-facing game table copy defaults to Traditional Chinese

前端遊戲桌 SHALL 以繁體中文作為預設產品文案語言，且不得直接向玩家暴露 route 路徑、raw enum、內部欄位名或 debug 字樣。

#### Scenario: Game view renders Traditional Chinese page copy

- **WHEN** 使用者開啟牌局頁面
- **THEN** 遊戲頁標題、摘要標籤、玩家欄位與操作按鈕 MUST 顯示繁體中文產品文案，而不是 `/game`、`dealer`、`phase` 這類工程字樣

##### Example: route path is not shown as the page title

- **GIVEN** 使用者進入牌局頁面
- **WHEN** 畫面完成渲染
- **THEN** 頁首 MUST 顯示中文標題，且 MUST NOT 將 `/game` 當成產品標題顯示

#### Scenario: Table values are formatted into player-readable Chinese text

- **WHEN** 遊戲桌渲染座位、階段、宣告、結果與牌張資訊
- **THEN** 畫面 MUST 將這些值格式化為玩家可讀的中文文字，而不是直接輸出 raw domain 值

##### Example: tile id is converted into a readable tile name

- **GIVEN** 人類玩家手牌包含 characters suit 與數字 rank 的牌張
- **WHEN** 手牌按鈕渲染該牌張
- **THEN** 畫面 MUST 顯示對應中文牌名，且 MUST NOT 顯示 `characters-1` 這類內部識別字串
