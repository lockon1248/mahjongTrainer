## ADDED Requirements

### Requirement: scoring catalog 設定必須集中於 rule config

rule config core SHALL 提供一份集中且可驗證的 scoring catalog 設定，供 scoring core 讀取已啟用台型、最低胡牌門檻、特殊胡型開關與相關計台政策。

#### Scenario: scoring core 從單一設定來源取得算台規則

- **WHEN** scoring core 準備評估一手合法和牌
- **THEN** 它 MUST 從 rule config 取得完整 scoring 設定，而不是自行補預設值或從 UI 狀態推導規則

##### Example: 最低門檻與台型開關來自同一份設定

- **GIVEN** 一份 rule config 同時定義 `minimumTai`、`enabledPatterns` 與特殊胡型開關
- **WHEN** scoring core 執行評估
- **THEN** 結果 MUST 完全依該設定決定是否可胡與可命中的牌型

### Requirement: rule config 必須能表達 scoring profile 與 profile 差異

rule config core SHALL 能表達不同 scoring profile 的選擇，並集中描述 profile 對花牌、風牌、字牌、槓牌與其他衍生台型的影響。

#### Scenario: 不同 profile 產生不同有效設定切片

- **WHEN** 呼叫端建立不同 scoring profile 的 rule config
- **THEN** rule config core MUST 產生對應的 scoring config 切片，讓 scoring core 不需知道 profile 來源細節也能正確計算

##### Example: profile 切換不改 scoring 介面

- **GIVEN** 兩份僅 scoring profile 不同的 root config
- **WHEN** 取得 scoring config 切片
- **THEN** 兩者 MUST 具有相同結構，但其中台型啟用與計台規則內容可不同

### Requirement: 未定案牌型與未定案 policy 必須可被顯式標記

若某些牌型或計台 policy 尚未由權威 spec 定案，rule config core SHALL 能顯式保留未定案狀態，而不是靜默地把它當成停用或套用任意預設值。

#### Scenario: 未定案牌型不被誤當成正式規則

- **WHEN** 某個台型名稱已被列入 catalog 工作清單，但尚未完成台數、衝突規則或 profile 定義
- **THEN** rule config core MUST 以可識別的未定案狀態暴露該項目，避免 scoring core 直接把它納入正式計算

##### Example: 未完成定義的特殊胡型保持未定案

- **GIVEN** 一個尚未完成完整定值的特殊胡型項目
- **WHEN** 建立 baseline rule config
- **THEN** 該項目 MUST 保持未定案，而不是被直接視為啟用或停用

### Requirement: rule config 必須支援封頂與疊加限制設定

rule config core SHALL 能表達總台數封頂、特定台型不可疊加與高階台型覆蓋低階台型等 scoring 限制，讓 scoring core 可以用同一份設定完成最終組合判定。

#### Scenario: scoring 限制隨設定切換

- **WHEN** 某份 rule config 定義封頂值或指定特定台型間的衝突規則
- **THEN** scoring config 切片 MUST 將這些限制明確提供給 scoring core，而不是要求各 pattern 自行判讀

##### Example: 封頂與衝突規則進入 scoring config

- **GIVEN** 一份 rule config 定義 `maxTai` 與若干台型衝突關係
- **WHEN** scoring core 讀取 scoring config 切片
- **THEN** 它 MUST 能直接取得這些限制資料並套用在總台數與台型組合判定上
