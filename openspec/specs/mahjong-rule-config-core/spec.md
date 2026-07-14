# mahjong-rule-config-core 規格

## 目的

待補：此檔由變更 `taiwan-mahjong-rule-config-foundation` 歸檔後建立，需補上正式目的說明。

## 需求

### 需求：基礎 rule config 預設值

core SHALL 暴露一份基礎 rule config，集中管理權威 baseline 文件中已確認的台灣 16 張麻將預設規則。

#### 情境：建立 baseline 預設 config

- **WHEN** 呼叫端在沒有任何 override 的情況下請求預設 rule config
- **THEN** core SHALL 回傳一個完整的 baseline config 物件，而不是要求 scoring 或 round flow 模組自行補 fallback 值

##### 範例：baseline 預設值集中於單一位置

- **GIVEN** 一個尚未提供任何自訂桌規 override 的新呼叫端
- **WHEN** 它請求 baseline rule config
- **THEN** 回傳的 config MUST 包含宣告優先序、補花模式、自摸支付模式、放槍支付模式，以及尚未成為權威規則時對應的未定案 policy


<!-- @trace
source: taiwan-mahjong-rule-config-foundation
updated: 2026-07-09
code:
  - src/core/rules/index.ts
  - src/core/rules/types.ts
  - src/core/types/result.ts
  - src/core/scoring/validation.ts
  - src/core/rules/roundFlow.ts
  - src/core/scoring/settlement.ts
  - tsconfig.json
  - src/core/config/index.ts
  - src/core/config/types.ts
  - src/core/scoring/patterns.ts
  - src/core/types/action.ts
  - package.json
  - src/core/testing/ruleCase.ts
  - src/core/types/player.ts
  - src/core/index.ts
  - src/core/scoring/types.ts
  - src/core/types/table.ts
  - src/core/types/tile.ts
  - src/core/scoring/decomposition.ts
tests:
  - tests/core/round-flow-claims.test.ts
  - tests/core/round-flow-flowers.test.ts
  - tests/core/round-flow-outcome.test.ts
  - tests/core/scoring-hand-decomposition.test.ts
  - tests/core/scoring-patterns.test.ts
  - tests/core/scoring-win-validation.test.ts
  - tests/core/round-flow-setup.test.ts
  - tests/core/rule-config-core.test.ts
  - tests/core/scoring-exports.test.ts
  - tests/core/scoring-settlement.test.ts
-->

---
### 需求：明確標記未定案規則

rule config core SHALL 能區分「未定案桌規」與「已明確設定為啟用或停用的規則」。

#### 情境：保留尚未定案規則的未定案狀態

- **WHEN** 某項規則尚未由 baseline 文件定案，且呼叫端也未提供明確 override
- **THEN** rule config SHALL 將該規則暴露為 unresolved，而不是靜默地將其視為 false

##### 範例：未定案的連莊 policy

- **GIVEN** baseline 文件中尚未將流局後莊家是否連莊定為權威規則
- **WHEN** 建立 baseline config
- **THEN** 連莊 policy MUST 保持 unresolved，而不是被解讀為啟用或停用


<!-- @trace
source: taiwan-mahjong-rule-config-foundation
updated: 2026-07-09
code:
  - src/core/rules/index.ts
  - src/core/rules/types.ts
  - src/core/types/result.ts
  - src/core/scoring/validation.ts
  - src/core/rules/roundFlow.ts
  - src/core/scoring/settlement.ts
  - tsconfig.json
  - src/core/config/index.ts
  - src/core/config/types.ts
  - src/core/scoring/patterns.ts
  - src/core/types/action.ts
  - package.json
  - src/core/testing/ruleCase.ts
  - src/core/types/player.ts
  - src/core/index.ts
  - src/core/scoring/types.ts
  - src/core/types/table.ts
  - src/core/types/tile.ts
  - src/core/scoring/decomposition.ts
tests:
  - tests/core/round-flow-claims.test.ts
  - tests/core/round-flow-flowers.test.ts
  - tests/core/round-flow-outcome.test.ts
  - tests/core/scoring-hand-decomposition.test.ts
  - tests/core/scoring-patterns.test.ts
  - tests/core/scoring-win-validation.test.ts
  - tests/core/round-flow-setup.test.ts
  - tests/core/rule-config-core.test.ts
  - tests/core/scoring-exports.test.ts
  - tests/core/scoring-settlement.test.ts
-->

---
### 需求：合併 rule config override

rule config core SHALL 支援將明確的 overrides 套用在 baseline 預設 config 之上。

#### 情境：覆寫已定案的 baseline 規則

- **WHEN** 呼叫端對支援的 rule config key 提供部分 override
- **THEN** rule config core SHALL 回傳一份合併後的 config，其中 override 取代 baseline 值，而未受影響的 key 保持原樣

##### 範例：覆寫宣告優先序

- **GIVEN** 一份宣告優先序為 `win > kan-exposed > pon > chi` 的 baseline config
- **WHEN** 呼叫端以另一組合法優先序覆寫該設定
- **THEN** 合併後的 config MUST 反映新的優先序，同時保留其他無關的 baseline 預設值

#### 情境：拒絕未知的 override key

- **WHEN** 呼叫端提供一個不屬於支援 rule config schema 的 override key
- **THEN** rule config core SHALL 拒絕該 override，而不是靜默忽略它

##### 範例：未知規則 key 視為無效

- **GIVEN** 一份 override payload 包含 schema 之外的欄位
- **WHEN** merge helper 驗證該 override
- **THEN** 它 MUST 以明確的 invalid-config outcome 使合併失敗


<!-- @trace
source: taiwan-mahjong-rule-config-foundation
updated: 2026-07-09
code:
  - src/core/rules/index.ts
  - src/core/rules/types.ts
  - src/core/types/result.ts
  - src/core/scoring/validation.ts
  - src/core/rules/roundFlow.ts
  - src/core/scoring/settlement.ts
  - tsconfig.json
  - src/core/config/index.ts
  - src/core/config/types.ts
  - src/core/scoring/patterns.ts
  - src/core/types/action.ts
  - package.json
  - src/core/testing/ruleCase.ts
  - src/core/types/player.ts
  - src/core/index.ts
  - src/core/scoring/types.ts
  - src/core/types/table.ts
  - src/core/types/tile.ts
  - src/core/scoring/decomposition.ts
tests:
  - tests/core/round-flow-claims.test.ts
  - tests/core/round-flow-flowers.test.ts
  - tests/core/round-flow-outcome.test.ts
  - tests/core/scoring-hand-decomposition.test.ts
  - tests/core/scoring-patterns.test.ts
  - tests/core/scoring-win-validation.test.ts
  - tests/core/round-flow-setup.test.ts
  - tests/core/rule-config-core.test.ts
  - tests/core/scoring-exports.test.ts
  - tests/core/scoring-settlement.test.ts
-->

---
### 需求：提供給 core 模組的 config 切片

rule config core SHALL 提供穩定的 config 切片，讓 round flow 與 scoring 模組可直接消費，而不需依賴全域可變狀態。

#### 情境：讀取 round flow 的 config 切片

- **WHEN** round flow 邏輯需要宣告優先序或補花行為設定
- **THEN** rule config core SHALL 提供一份從同一個 root config 物件衍生出的 round-flow 相關 config 切片

##### 範例：round flow 讀取 config 切片

- **GIVEN** 一個含有明確 round flow override 的 root rule config
- **WHEN** round flow core 請求自己的 config 切片
- **THEN** 回傳的切片 MUST 包含 round flow 所需的有效宣告優先序、補花模式與流局 policy 欄位

#### 情境：讀取 scoring 的 config 切片

- **WHEN** scoring 邏輯需要支付責任或最低台數門檻設定
- **THEN** rule config core SHALL 提供一份從同一個 root config 物件衍生出的 scoring 相關 config 切片

##### 範例：scoring 讀取 config 切片

- **GIVEN** 一個 root rule config 已設定最低台數門檻與支付 policy
- **WHEN** scoring core 請求自己的 config 切片
- **THEN** 回傳的切片 MUST 直接暴露這些有效 scoring 設定，而不需第二份 config 來源

<!-- @trace
source: taiwan-mahjong-rule-config-foundation
updated: 2026-07-09
code:
  - src/core/rules/index.ts
  - src/core/rules/types.ts
  - src/core/types/result.ts
  - src/core/scoring/validation.ts
  - src/core/rules/roundFlow.ts
  - src/core/scoring/settlement.ts
  - tsconfig.json
  - src/core/config/index.ts
  - src/core/config/types.ts
  - src/core/scoring/patterns.ts
  - src/core/types/action.ts
  - package.json
  - src/core/testing/ruleCase.ts
  - src/core/types/player.ts
  - src/core/index.ts
  - src/core/scoring/types.ts
  - src/core/types/table.ts
  - src/core/types/tile.ts
  - src/core/scoring/decomposition.ts
tests:
  - tests/core/round-flow-claims.test.ts
  - tests/core/round-flow-flowers.test.ts
  - tests/core/round-flow-outcome.test.ts
  - tests/core/scoring-hand-decomposition.test.ts
  - tests/core/scoring-patterns.test.ts
  - tests/core/scoring-win-validation.test.ts
  - tests/core/round-flow-setup.test.ts
  - tests/core/rule-config-core.test.ts
  - tests/core/scoring-exports.test.ts
  - tests/core/scoring-settlement.test.ts
-->

## Requirements

### Requirement: 最低胡牌台數與特殊規則必須成為可配置權威設定

rule config core SHALL 將最低胡牌台數、特殊胡型開關、花牌計分與相關 scoring 桌規暴露為權威設定，而不是只保留在 baseline 的待確認文字中。

#### Scenario: scoring 讀取最低胡牌台數與特殊規則設定

- **WHEN** scoring core 需要判斷某手牌是否達到有效胡牌門檻，或是否啟用特定特殊胡型
- **THEN** 它 MUST 從 rule config 取得最低胡牌台數與相關特殊規則設定，而不是自行發明預設值

##### Example: minimumTai 與特殊胡型來自同一份設定

- **GIVEN** 一份已定案的 rule config 同時定義 `minimumTai` 與 `heavenWin`
- **WHEN** scoring core 評估某手合法和牌
- **THEN** 評估結果 MUST 依該設定決定是否成立與如何計算台數

<!-- @trace
source: taiwan-mahjong-scoring-rules-and-tests
updated: 2026-07-14
code:
  - src/core/config/index.ts
  - src/core/scoring/settlement.ts
  - package.json
  - src/core/config/types.ts
  - src/core/scoring/types.ts
  - src/views/game/e2eBridge.ts
  - src/core/scoring/validation.ts
  - src/views/game/components/GameTableView.vue
  - src/core/rules/roundFlow.ts
  - src/env.d.ts
  - src/views/game/GameView.vue
  - AGENTS.md
  - playwright.config.ts
  - src/core/scoring/patterns.ts
tests:
  - tests/core/scoring-settlement.test.ts
  - e2e/game-table.smoke.spec.ts
  - tests/core/scoring-patterns.test.ts
  - tests/core/human-self-turn-actions.test.ts
  - tests/core/rule-config-core.test.ts
  - tests/ui/table-layout-verification-flow.test.ts
  - tests/core/round-flow-claims.test.ts
  - tests/core/scoring-win-validation.test.ts
  - tests/ui/round-result-sync.test.ts
-->