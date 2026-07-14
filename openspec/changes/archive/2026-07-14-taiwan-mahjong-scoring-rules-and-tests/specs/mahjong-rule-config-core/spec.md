## ADDED Requirements

### Requirement: 最低胡牌台數與特殊規則必須成為可配置權威設定

rule config core SHALL 將最低胡牌台數、特殊胡型開關、花牌計分與相關 scoring 桌規暴露為權威設定，而不是只保留在 baseline 的待確認文字中。

#### Scenario: scoring 讀取最低胡牌台數與特殊規則設定

- **WHEN** scoring core 需要判斷某手牌是否達到有效胡牌門檻，或是否啟用特定特殊胡型
- **THEN** 它 MUST 從 rule config 取得最低胡牌台數與相關特殊規則設定，而不是自行發明預設值

##### Example: minimumTai 與特殊胡型來自同一份設定

- **GIVEN** 一份已定案的 rule config 同時定義 `minimumTai` 與 `heavenWin`
- **WHEN** scoring core 評估某手合法和牌
- **THEN** 評估結果 MUST 依該設定決定是否成立與如何計算台數
