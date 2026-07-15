## ADDED Requirements

### Requirement: 完整牌型台數目錄必須成為權威 scoring 來源

scoring core SHALL 以一份完整且可追蹤的權威牌型台數目錄作為算台來源，而不是只支援少數示範牌型或在不同模組分散硬寫規則。

#### Scenario: 合法和牌由同一份牌型目錄評估

- **WHEN** 一手牌進入 scoring evaluation
- **THEN** scoring core MUST 依同一份牌型台數目錄評估一般台型、特殊胡型、門清類台型、花牌與風牌相關台型，而不是由不同呼叫端各自補規則

##### Example: 同一手牌同時命中多個台型

- **GIVEN** 一手合法和牌同時符合 `莊家`、`自摸` 與其他已啟用台型
- **WHEN** scoring core 完成評估
- **THEN** 回傳結果 MUST 來自同一份權威牌型目錄，並明確列出每個命中台型的識別、名稱與台數

### Requirement: 台型疊加與衝突規則必須可被明確判定

scoring core SHALL 依權威規格判定台型之間可否疊加、何時互斥、何時由高階台型覆蓋低階台型，而不是只把命中的 pattern 全部相加。

#### Scenario: 互斥或覆蓋台型不重複計台

- **WHEN** 一手牌同時命中彼此互斥或有覆蓋關係的台型
- **THEN** scoring core MUST 依權威規格保留正確組合，並排除不應重複計算的台型

##### Example: 複合門清台型覆蓋基礎台型

- **GIVEN** 一手牌同時符合 `門清` 與 `門清自摸`，且權威規格定義兩者不可重複計台
- **WHEN** scoring core 完成評估
- **THEN** `scoringItems` MUST 只保留可成立的最終組合，而不是同時計入兩個互斥台型

### Requirement: scoring 結果必須保留可供 UI 與 E2E 驗證的牌型說明

scoring core SHALL 在輸出中保留穩定的牌型識別、顯示名稱、台數與命中原因，讓後續 UI、紀錄與 browser E2E 可以驗證實際算台內容，而不是只得到單一總台數。

#### Scenario: 和牌結果可列出逐項台型明細

- **WHEN** 一手牌完成有效和牌結算
- **THEN** scoring core MUST 回傳可枚舉的 `scoringItems`，且每個 item MUST 包含足以對應權威台型目錄的穩定識別與台數資訊

##### Example: E2E 可驗證和牌明細

- **GIVEN** 一手和牌命中三個已啟用台型
- **WHEN** round result 顯示於 UI
- **THEN** 測試 MUST 能依 `scoringItems` 驗證這三個台型與其總台數，而不是只能比對一個模糊字串

### Requirement: profile 差異必須透過設定而不是散落條件分支處理

當牌型規則存在一般台數表與特殊 profile 差異時，scoring core SHALL 透過權威設定決定採用哪一組規則，而不是把 profile 判斷散落在個別 pattern 實作中。

#### Scenario: 不同 profile 的牌型規則可被一致切換

- **WHEN** rule config 指定不同 scoring profile
- **THEN** scoring core MUST 依該 profile 採用對應的牌型台數與衝突規則，並維持相同的輸出資料形狀

##### Example: 花牌與風牌計法受 profile 影響

- **GIVEN** 兩份 rule config 分別代表一般台數表與特殊 profile
- **WHEN** scoring core 評估同一手含花牌與風牌相關台型的和牌
- **THEN** 兩次評估 SHALL 允許得到不同台型組合，但輸出格式 MUST 保持一致且能指出差異來自 profile 規則
