## ADDED Requirements

### Requirement: 產品狀態型 UI 必須由明確規則或業務判定驅動

牌桌 UI 上所有會影響玩家判讀的狀態型欄位、標籤、提示與可操作訊息，SHALL 只能顯示來自明確規則、演算法、store 業務判定或已定義 UI state machine 的結果，不得直接暴露未驅動的 placeholder flag 或內部欄位。

#### Scenario: 未驅動的內部旗標不得直接顯示為產品狀態

- **WHEN** 某個畫面欄位只對應到預設值、placeholder state 或尚未接上真實規則的內部欄位
- **THEN** 前端 MUST NOT 以產品狀態文案直接顯示該欄位

##### Example: 聽牌欄位不得直接顯示未驅動的 declaredReady

- **GIVEN** `declaredReady` 目前不是由實際聽牌判定驅動
- **WHEN** 牌桌渲染玩家資訊
- **THEN** 畫面 MUST NOT 把它直接當成 `聽牌：是/否` 的產品狀態顯示

#### Scenario: 狀態型 UI 必須可追溯到規則來源

- **WHEN** 畫面顯示任一會影響玩家決策的狀態
- **THEN** 該狀態 MUST 可追溯到 core rule、scoring result、store 判定或已定義的 UI state machine

##### Example: 每個狀態欄位都有來源分類

- **GIVEN** 一個牌桌畫面上的狀態欄位清單
- **WHEN** 對其進行 UI 真實性稽核
- **THEN** 每個欄位 MUST 被標記為已驅動、未驅動需移除，或待後續規則實作
