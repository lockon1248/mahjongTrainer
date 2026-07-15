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

---
### Requirement: scoring catalog 設定必須集中於 rule config

rule config core SHALL 提供一份集中且可驗證的 scoring catalog 設定，供 scoring core 讀取已啟用台型、最低胡牌門檻、特殊胡型開關與相關計台政策。

#### Scenario: scoring core 從單一設定來源取得算台規則

- **WHEN** scoring core 準備評估一手合法和牌
- **THEN** 它 MUST 從 rule config 取得完整 scoring 設定，而不是自行補預設值或從 UI 狀態推導規則

##### Example: 最低門檻與台型開關來自同一份設定

- **GIVEN** 一份 rule config 同時定義 `minimumTai`、`enabledPatterns` 與特殊胡型開關
- **WHEN** scoring core 執行評估
- **THEN** 結果 MUST 完全依該設定決定是否可胡與可命中的牌型

---
### Requirement: rule config 必須能表達 scoring profile 與 profile 差異

rule config core SHALL 能表達不同 scoring profile 的選擇，並集中描述 profile 對花牌、風牌、字牌、槓牌與其他衍生台型的影響。

#### Scenario: 不同 profile 產生不同有效設定切片

- **WHEN** 呼叫端建立不同 scoring profile 的 rule config
- **THEN** rule config core MUST 產生對應的 scoring config 切片，讓 scoring core 不需知道 profile 來源細節也能正確計算

##### Example: profile 切換不改 scoring 介面

- **GIVEN** 兩份僅 scoring profile 不同的 root config
- **WHEN** 取得 scoring config 切片
- **THEN** 兩者 MUST 具有相同結構，但其中台型啟用與計台規則內容可不同

---
### Requirement: 未定案牌型與未定案 policy 必須可被顯式標記

若某些牌型或計台 policy 尚未由權威 spec 定案，rule config core SHALL 能顯式保留未定案狀態，而不是靜默地把它當成停用或套用任意預設值。

#### Scenario: 未定案牌型不被誤當成正式規則

- **WHEN** 某個台型名稱已被列入 catalog 工作清單，但尚未完成台數、衝突規則或 profile 定義
- **THEN** rule config core MUST 以可識別的未定案狀態暴露該項目，避免 scoring core 直接把它納入正式計算

##### Example: 未完成定義的特殊胡型保持未定案

- **GIVEN** 一個尚未完成完整定值的特殊胡型項目
- **WHEN** 建立 baseline rule config
- **THEN** 該項目 MUST 保持未定案，而不是被直接視為啟用或停用

---
### Requirement: rule config 必須支援封頂與疊加限制設定

rule config core SHALL 能表達總台數封頂、特定台型不可疊加與高階台型覆蓋低階台型等 scoring 限制，讓 scoring core 可以用同一份設定完成最終組合判定。

#### Scenario: scoring 限制隨設定切換

- **WHEN** 某份 rule config 定義封頂值或指定特定台型間的衝突規則
- **THEN** scoring config 切片 MUST 將這些限制明確提供給 scoring core，而不是要求各 pattern 自行判讀

##### Example: 封頂與衝突規則進入 scoring config

- **GIVEN** 一份 rule config 定義 `maxTai` 與若干台型衝突關係
- **WHEN** scoring core 讀取 scoring config 切片
- **THEN** 它 MUST 能直接取得這些限制資料並套用在總台數與台型組合判定上

---
### Requirement: rule config MUST expose scoringProfile as a first-class setting

The rule-config runtime SHALL expose `scoringProfile` as a first-class scoring setting, so callers can select `classic-taiwan` or `flower-wind-bonus` without patching pattern logic directly.

#### Scenario: scoring config slice preserves active profile

- **WHEN** a caller requests the scoring slice from a root rule config
- **THEN** the returned scoring config MUST include the active `scoringProfile` in a machine-stable form

##### Example: scoring slice includes flower-wind-bonus profile

- **GIVEN** a root rule config configured with `flower-wind-bonus`
- **WHEN** the scoring slice is requested
- **THEN** the slice MUST expose `flower-wind-bonus` as the active profile


<!-- @trace
source: taiwan-mahjong-complete-scoring-implementation
updated: 2026-07-15
code:
  - src/views/game/components/GameTableView.vue
  - src/core/scoring/catalog.ts
  - src/core/scoring/validation.ts
  - src/core/scoring/patterns.ts
  - test-results/.last-run.json
  - src/core/config/types.ts
  - src/core/types/result.ts
  - src/core/rules/roundFlow.ts
  - src/views/game/types.ts
  - src/core/scoring/types.ts
  - src/core/config/index.ts
  - src/views/game/e2eBridge.ts
  - src/core/scoring/settlement.ts
  - src/env.d.ts
  - src/core/scoring/index.ts
tests:
  - tests/core/round-flow-claims.test.ts
  - tests/core/scoring-patterns.test.ts
  - tests/core/human-self-turn-actions.test.ts
  - tests/core/scoring-settlement.test.ts
  - e2e/game-table.smoke.spec.ts
  - tests/core/scoring-win-validation.test.ts
  - tests/ui/round-result-sync.test.ts
  - tests/core/rule-config-core.test.ts
-->

---
### Requirement: rule config MUST provide profile-aware scoring catalog inputs

The rule-config runtime SHALL provide the scoring layer with profile-aware catalog inputs, including configurable pattern enablement, minimum tai, and optional max-tai limits, from one authoritative source.

#### Scenario: scoring slice includes profile-specific scoring controls

- **WHEN** the scoring layer reads the scoring config slice
- **THEN** it MUST receive the active profile, minimum tai threshold, and any configured max-tai or pattern settings needed to evaluate the catalog

##### Example: classic profile with minimumTai and maxTai

- **GIVEN** a root rule config configured with `classic-taiwan`, `minimumTai = 0`, and a configured max-tai limit
- **WHEN** the scoring slice is requested
- **THEN** the scoring slice MUST expose all three values without needing fallback logic from the scoring layer

<!-- @trace
source: taiwan-mahjong-complete-scoring-implementation
updated: 2026-07-15
code:
  - src/views/game/components/GameTableView.vue
  - src/core/scoring/catalog.ts
  - src/core/scoring/validation.ts
  - src/core/scoring/patterns.ts
  - test-results/.last-run.json
  - src/core/config/types.ts
  - src/core/types/result.ts
  - src/core/rules/roundFlow.ts
  - src/views/game/types.ts
  - src/core/scoring/types.ts
  - src/core/config/index.ts
  - src/views/game/e2eBridge.ts
  - src/core/scoring/settlement.ts
  - src/env.d.ts
  - src/core/scoring/index.ts
tests:
  - tests/core/round-flow-claims.test.ts
  - tests/core/scoring-patterns.test.ts
  - tests/core/human-self-turn-actions.test.ts
  - tests/core/scoring-settlement.test.ts
  - e2e/game-table.smoke.spec.ts
  - tests/core/scoring-win-validation.test.ts
  - tests/ui/round-result-sync.test.ts
  - tests/core/rule-config-core.test.ts
-->