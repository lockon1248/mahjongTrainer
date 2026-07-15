# 台灣 16 張麻將規則測試矩陣

本文件定義目前規則 baseline 對應的測試案例矩陣。
目的不是直接補齊所有算台規則，而是先把後續 `tests/core` 與規則案例 schema 需要覆蓋的案例類型固定下來。

## 使用原則

- 每個案例 ID 必須穩定，不可因實作細節改名。
- 若案例涉及未定案規則，案例可先保留，但不得自行補出固定結論。
- 案例輸入與預期結果後續應落在 `RuleCase` schema，而不是散落於 UI 或 store 測試。

## 案例分類

- 一般胡牌
- 副露胡牌
- 補花
- 連續補花
- 宣告優先序
- 流局
- 台型組合
- 榮和結果接線
- 最低台數門檻
- profile 切換
- 衝突與覆蓋規則
- 特殊胡型
- 花牌 / 風牌 / 槓牌差異
- UI 和牌明細顯示

## 案例矩陣

| Case ID | Category | 驗證重點 | 依據規則 | 備註 |
| --- | --- | --- | --- | --- |
| WIN-STANDARD-001 | 一般胡牌 | 驗證五組面子加一組將眼的標準胡牌成立 | rules baseline：胡牌成立條件 | 只驗證標準胡型，不含特殊胡 |
| WIN-MELD-001 | 副露胡牌 | 驗證玩家已有吃／碰／槓副露時，仍可依標準結構胡牌 | rules baseline：合法動作規則、胡牌成立條件 | 需覆蓋至少一組明面副露 |
| FLOWER-REPLACE-001 | 補花 | 驗證摸到花牌後立即亮出並從牌尾補 1 張 | rules baseline：花牌補牌 | 補牌結果為非花牌 |
| FLOWER-CHAIN-001 | 連續補花 | 驗證補牌後若再次摸到花牌，需持續補到非花牌為止 | rules baseline：花牌補牌 | 需覆蓋連續至少 2 次補花 |
| CLAIM-PRIORITY-001 | 宣告優先序 | 驗證多人同時宣告時依 `胡 > 槓 > 碰 > 吃` 處理 | rules baseline：宣告優先序 | 若未來優先序可配置，應改由 rule config 驗證 |
| DRAW-DEALER-001 | 流局 | 驗證牌摸完無人胡牌時流局，且莊家相關後續流程仍留待設定 | rules baseline：基本桌規、待確認／爭議規則 | 不在此案例中假設流局連莊或查聽 |
| SCORE-STACK-001 | 台型組合 | 驗證結算流程可承接多個台型／支付責任來源，而非把結果寫死 | rules baseline：結算規則、可配置規則 | 具體台數與台型清單待後續 spec 補齊 |
| SCORE-DISCARD-WIN-001 | 榮和結果接線 | 驗證榮和結果不會跳過 scoring evaluation 與 settlement，並能回傳 `scoringItems` 與 `totalTai` | scoring core：和牌結果必須經過權威算台流程 | 至少覆蓋一條 discard-win |
| SCORE-MINIMUM-TAI-001 | 最低台數門檻 | 驗證牌型成立但 `totalTai` 未達 `minimumTai` 時，不得當成可結算和牌 | scoring core：最低胡牌台數門檻必須可被驗證 | 需覆蓋明確門檻值 config |
| SCORE-MINIMUM-TAI-002 | 最低台數門檻 | 驗證牌型成立且 `totalTai` 達到 `minimumTai` 時，可正常回傳 settlement | scoring core：最低胡牌台數門檻必須可被驗證 | 與上一案成對 |
| SCORE-PROFILE-001 | profile 切換 | 驗證同一手含花牌與風牌相關台型的和牌，在 `classic-taiwan` 與 `flower-wind-bonus` 下會得到不同 `scoringItems` | rules baseline：scoring profile、花牌計分、風牌計分 | 需驗證輸出 shape 穩定 |
| SCORE-CONFLICT-001 | 衝突與覆蓋規則 | 驗證 `concealed-self-draw` 會覆蓋 `concealed-hand` 與 `self-draw` | rules baseline：門清相關台型 | 驗證不重複計台 |
| SCORE-CONFLICT-002 | 衝突與覆蓋規則 | 驗證 `all-sequences` 不得與 `self-draw`、`single-wait`、字牌或花牌條件並存 | rules baseline：平胡限制條件 | 驗證限制條件完整 |
| SCORE-CONFLICT-003 | 衝突與覆蓋規則 | 驗證 `five-concealed-triplets` 會覆蓋 `three-concealed-triplets`、`four-concealed-triplets` | rules baseline：暗刻台型擇高 | 驗證擇高不累計 |
| SCORE-CONFLICT-004 | 衝突與覆蓋規則 | 驗證 `flower-wind-bonus` profile 下同一組暗槓只計 `concealed-kong-bonus` 不計 `exposed-kong-bonus` | rules baseline：槓牌差異 | 驗證 profile 專屬覆蓋規則 |
| PATTERN-HEAVEN-WIN-001 | 特殊胡型 | 驗證莊家起手即和時，可依啟用中的規則命中 `天胡` 台型 | scoring core：scoring 規則必須來自權威台型目錄 | 台數值需由權威規格定值後落地 |
| PATTERN-EARTH-WIN-001 | 特殊胡型 | 驗證閒家第一次自摸即胡時，可依啟用中的規則命中 `地胡` 台型 | scoring core：scoring 規則必須來自權威台型目錄 | 台數值需由權威規格定值後落地 |
| PATTERN-BIG-THREE-DRAGONS-001 | 特殊胡型 | 驗證三組三元刻子成立時，可命中 `大三元` | scoring core：scoring 規則必須來自權威台型目錄 | 台數值需由權威規格定值後落地 |
| PATTERN-LITTLE-THREE-DRAGONS-001 | 特殊胡型 | 驗證兩組三元刻子加一組三元將眼時，可命中 `小三元` | scoring core：scoring 規則必須來自權威台型目錄 | 台數值需由權威規格定值後落地 |
| PATTERN-DRAGON-TRIPLET-001 | 特殊胡型 | 驗證任一組三元刻子可命中 `dragon-triplet`，多組可累加 | rules baseline：三元牌 | 至少覆蓋 2 組刻子 |
| PATTERN-WIND-FLOWER-001 | 花牌 / 風牌 / 槓牌差異 | 驗證 `classic-taiwan` profile 只計對位花與圈風／門風 | rules baseline：`classic-taiwan` profile | 需帶 seat / round wind context |
| PATTERN-WIND-FLOWER-002 | 花牌 / 風牌 / 槓牌差異 | 驗證 `flower-wind-bonus` profile 對任一花牌與任一風刻子計台 | rules baseline：`flower-wind-bonus` profile | 需驗證與 `classic-taiwan` 結果不同 |
| PATTERN-KONG-BONUS-001 | 花牌 / 風牌 / 槓牌差異 | 驗證 `flower-wind-bonus` profile 下明槓 / 加槓每組 1 台，暗槓每組 2 台 | rules baseline：槓牌差異 | 需驗證同組不重複計 |
| UI-SCORING-RESULT-001 | UI 和牌明細顯示 | 驗證和牌畫面能顯示 `scoringItems` 逐項台型與 `totalTai` | scoring core / vue table shell：台型說明輸出 | browser E2E 必做 |
| UI-SCORING-RESULT-002 | UI 和牌明細顯示 | 驗證不同 scoring profile 下，UI 顯示的台型明細會隨 `scoringItems` 改變 | scoring core / vue table shell：profile 差異輸出 | browser E2E 必做 |

## 類別到案例對照

| 分類 | 最低必要案例 |
| --- | --- |
| 一般胡牌 | `WIN-STANDARD-001` |
| 副露胡牌 | `WIN-MELD-001` |
| 補花 | `FLOWER-REPLACE-001` |
| 連續補花 | `FLOWER-CHAIN-001` |
| 宣告優先序 | `CLAIM-PRIORITY-001` |
| 流局 | `DRAW-DEALER-001` |
| 台型組合 | `SCORE-STACK-001` |
| 榮和結果接線 | `SCORE-DISCARD-WIN-001` |
| 最低台數門檻 | `SCORE-MINIMUM-TAI-001`, `SCORE-MINIMUM-TAI-002` |
| profile 切換 | `SCORE-PROFILE-001` |
| 衝突與覆蓋規則 | `SCORE-CONFLICT-001`, `SCORE-CONFLICT-002`, `SCORE-CONFLICT-003`, `SCORE-CONFLICT-004` |
| 特殊胡型 | `PATTERN-HEAVEN-WIN-001`, `PATTERN-EARTH-WIN-001`, `PATTERN-BIG-THREE-DRAGONS-001`, `PATTERN-LITTLE-THREE-DRAGONS-001`, `PATTERN-DRAGON-TRIPLET-001` |
| 花牌 / 風牌 / 槓牌差異 | `PATTERN-WIND-FLOWER-001`, `PATTERN-WIND-FLOWER-002`, `PATTERN-KONG-BONUS-001` |
| UI 和牌明細顯示 | `UI-SCORING-RESULT-001`, `UI-SCORING-RESULT-002` |

## 後續落地要求

- `tests/core` 建立規則案例時，至少要先覆蓋本文件中的最低必要案例。
- browser E2E 至少要覆蓋一條 `SCORE-DISCARD-WIN-*` 類案例與一條 `UI-SCORING-RESULT-*` 類案例，確保真實畫面能顯示台型與總台數。
- 若新增特殊胡、封頂、過水、查聽等規則，必須先補 baseline 或後續權威 spec，再擴充本矩陣。
- 若規則改成可配置，案例仍保留原 ID，但必須改寫成明確對應特定 config 或 scoring profile 的案例。
