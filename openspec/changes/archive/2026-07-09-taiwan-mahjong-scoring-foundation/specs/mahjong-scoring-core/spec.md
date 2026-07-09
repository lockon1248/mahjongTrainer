## ADDED Requirements

### Requirement: 標準手牌拆解

Scoring core SHALL 為台灣 16 張標準胡牌提供 deterministic hand decomposition result，將候選胡牌手牌拆成五組 meld groups 與一組 pair group。

#### Scenario: 拆解純暗手標準胡牌

- **WHEN** 呼叫端評估一副沒有 exposed melds 的 concealed winning hand
- **THEN** scoring core SHALL 回傳一組 pair group 與五組 meld groups，且 winning hand 的所有 tiles 恰好只被覆蓋一次

##### Example: 純暗手標準胡牌

- **GIVEN** 一副由 `123 characters`、`123 dots`、`123 bamboo`、`111 winds-east`、`999 dots` 與 pair `red dragons` 組成的 winning hand
- **WHEN** 這副手牌被拿去做 scoring decomposition
- **THEN** 結果 MUST 包含剛好五組 meld groups 與一組 pair group，且沒有 leftover tiles

#### Scenario: 拒絕非標準拆解

- **WHEN** 呼叫端評估一組無法拆成五組 meld groups 加一組 pair group 的 tile set
- **THEN** scoring core SHALL 回傳 non-winning decomposition result，而不是 fabricating a grouping

##### Example: 不可能的標準組合

- **GIVEN** 一組包含五張 singles 與四組互不相關 pairs，且不存在五組 meld groups 加一組 pair group 排列的 tiles
- **WHEN** 這副手牌被拿去做 scoring decomposition
- **THEN** 結果 MUST 是 non-winning，且不得回傳 canonical breakdown

### Requirement: 標準胡牌判定

Scoring core SHALL 使用 concealed tiles、exposed melds、flowers 與 winning tile 判定候選手牌是否滿足 baseline Taiwan 16-tile winning structure。

#### Scenario: 判定純暗手標準胡牌

- **WHEN** 呼叫端評估一副搭配 winning tile 後符合 baseline 五組面子加一組將眼結構的手牌
- **THEN** scoring core SHALL 將這副手牌判定為 valid standard win

##### Example: WIN-STANDARD-001

- **GIVEN** 一組在套用 winning tile 前已形成四組 melds 與一組 pair 的 concealed tiles
- **WHEN** winning tile 在 baseline rules 下補成第五組 meld
- **THEN** 結果 MUST 為 `isWinning = true`，且附帶 standard decomposition result

#### Scenario: 判定副露後標準胡牌

- **WHEN** 呼叫端評估一副包含 exposed melds 且完整 tile set 仍滿足 baseline winning structure 的手牌
- **THEN** scoring core SHALL 將這副手牌判定為 valid standard win

##### Example: WIN-MELD-001

- **GIVEN** player state 上已存在至少一組 exposed meld
- **WHEN** 剩餘 concealed tiles 與 winning tile 補足其餘五組 melds 與一組 pair 結構
- **THEN** 結果 MUST 為 `isWinning = true`，且 exposed melds 仍是 returned winning breakdown 的一部分

### Requirement: 台型比對介面

Scoring core SHALL 透過 extensible interface 評估 scoring patterns，並在不 hard-code undefined special hands 或 undefined table values 的前提下回傳 matched pattern identifiers。

#### Scenario: 回傳 baseline 台型識別碼

- **WHEN** 呼叫端用目前已支援的 baseline scoring patterns 評估一副 winning hand
- **THEN** scoring core SHALL 以 stable array order 回傳零個或多個 matched scoring pattern identifiers

##### Example: baseline 識別碼順序

- **GIVEN** 一副同時命中 `dealer-win` 與 `self-draw` 的 winning hand
- **WHEN** pattern evaluation 完成
- **THEN** 結果 MUST 依 scoring core 的 stable output order 回傳這些 identifiers

#### Scenario: 保留未支援台型缺口

- **WHEN** 某個 requested scoring pattern 依賴 baseline 文件中仍 unresolved 的 rules
- **THEN** scoring core SHALL 將該 pattern 從 matched result 中省略，而不是 inventing a rule outcome

##### Example: 省略未定案特殊胡

- **GIVEN** 一副在某些 table rules 下可能符合 unresolved special hand 的 winning hand
- **WHEN** 該 unresolved pattern 尚未在 baseline documents 中定義
- **THEN** matched results MUST 不包含該 pattern identifier

### Requirement: 結算輸出契約

Scoring core SHALL 回傳一個 settlement result shape，將 winning validity、matched scoring patterns、total tai 與 payment responsibility 明確分開表達。

#### Scenario: 建立自摸結算結果

- **WHEN** 一副 valid self-draw hand 依 baseline self-draw rule 被評估
- **THEN** scoring core SHALL 回傳 settlement result，記錄 winning seat、self-draw payment responsibility 與 computed total tai field

##### Example: SCORE-STACK-001 自摸結算

- **GIVEN** 一個包含多個 matched scoring pattern identifiers 的 winning result
- **WHEN** scoring core 建立 settlement output
- **THEN** output MUST 包含 pattern identifier list、numeric `totalTai`，以及來自 rule configuration 而不是 UI logic 的 payment responsibility structure

#### Scenario: 建立放槍結算結果

- **WHEN** 一副 valid discard win 依 baseline discard rule 被評估
- **THEN** scoring core SHALL 回傳 settlement result，將 winner seat、discarder seat 與 discard payment responsibility 與 pattern matching 分開記錄

##### Example: 放槍結算輸出

- **GIVEN** 一個由 south 胡牌、west 放槍的 valid discard win
- **WHEN** scoring core 建立 settlement output
- **THEN** settlement MUST 記錄 `winnerSeat = south`、`discarderSeat = west`，且在不改動 matched pattern identifiers 的前提下表達 discard payment responsibility
