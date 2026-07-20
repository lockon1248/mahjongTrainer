# mahjong-scoring-core Specification

## Purpose

TBD - created by archiving change 'taiwan-mahjong-scoring-rules-and-tests'. Update Purpose after archive.

## Requirements

### Requirement: 和牌結果必須經過權威算台流程

算台核心 SHALL 將所有合法和牌結果送入同一條權威 scoring 流程，不論是 `自摸` 或 `榮和`，都 MUST 產出可供 round result 與 UI 使用的 `scoringItems` 與 `totalTai`。

#### Scenario: 榮和結果不再跳過 scoring

- **WHEN** 玩家在 `claim-window` 以他家捨牌完成合法和牌
- **THEN** 系統 MUST 先經過 scoring evaluation 與 settlement，再建立 round result，而不是直接產生沒有 `totalTai` 的和牌摘要

##### Example: 東家榮和仍會得到台數摘要

- **GIVEN** `east` 以 `north` 打出的牌完成一手合法和牌，且依現行規則至少符合一個有效台型
- **WHEN** 本局進入 `win` outcome
- **THEN** round result MUST 包含非空的 `scoringItems` 與對應 `totalTai`


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
### Requirement: scoring 規則必須來自權威台型目錄

算台核心 SHALL 以權威台型規則目錄作為唯一 scoring 來源，而不是只保留零散示範台型。

#### Scenario: 特殊胡型由同一份規則目錄驅動

- **WHEN** 規則 baseline 已明確列出 `天胡`、`大三元`、`小三元` 等特殊台型
- **THEN** scoring core MUST 依該目錄評估這些台型，並將命中的台型寫入 `scoringItems`

##### Example: 大三元被寫入 scoringItems

- **GIVEN** 一手合法和牌同時滿足 `大三元`
- **WHEN** scoring core 完成評估
- **THEN** `scoringItems` MUST 包含對應 `大三元` pattern，且 `totalTai` MUST 包含其台數


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
### Requirement: 最低胡牌台數門檻必須可被驗證

算台核心 SHALL 依 rule config 的最低胡牌台數門檻，區分「牌型成立但台數不足」與「可成立和牌結果」。

#### Scenario: 牌型成立但台數不足時不得產出可結算和牌結果

- **WHEN** 一手牌型結構成立，但其 `totalTai` 未達目前有效的 `minimumTai`
- **THEN** scoring core MUST 明確回報台數不足，而不是把該結果當成一般有效和牌結算

##### Example: 無台和牌被標記為未達門檻

- **GIVEN** 一手標準和牌結構只命中低於門檻的台型，且目前 `minimumTai` 已設為明確數值
- **WHEN** scoring core 評估該結果
- **THEN** 結果 MUST 區分為台數不足，而不是回傳可直接顯示為成功和牌的結算摘要

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
### Requirement: 完整牌型台數目錄必須成為權威 scoring 來源

scoring core SHALL 以一份完整且可追蹤的權威牌型台數目錄作為算台來源，而不是只支援少數示範牌型或在不同模組分散硬寫規則。

#### Scenario: 合法和牌由同一份牌型目錄評估

- **WHEN** 一手牌進入 scoring evaluation
- **THEN** scoring core MUST 依同一份牌型台數目錄評估一般台型、特殊胡型、門清類台型、花牌與風牌相關台型，而不是由不同呼叫端各自補規則

##### Example: 同一手牌同時命中多個台型

- **GIVEN** 一手合法和牌同時符合 `莊家`、`自摸` 與其他已啟用台型
- **WHEN** scoring core 完成評估
- **THEN** 回傳結果 MUST 來自同一份權威牌型目錄，並明確列出每個命中台型的識別、名稱與台數

---
### Requirement: 台型疊加與衝突規則必須可被明確判定

scoring core SHALL 依權威規格判定台型之間可否疊加、何時互斥、何時由高階台型覆蓋低階台型，而不是只把命中的 pattern 全部相加。

#### Scenario: 互斥或覆蓋台型不重複計台

- **WHEN** 一手牌同時命中彼此互斥或有覆蓋關係的台型
- **THEN** scoring core MUST 依權威規格保留正確組合，並排除不應重複計算的台型

##### Example: 複合門清台型覆蓋基礎台型

- **GIVEN** 一手牌同時符合 `門清` 與 `門清自摸`，且權威規格定義兩者不可重複計台
- **WHEN** scoring core 完成評估
- **THEN** `scoringItems` MUST 只保留可成立的最終組合，而不是同時計入兩個互斥台型

---
### Requirement: scoring 結果必須保留可供 UI 與 E2E 驗證的牌型說明

scoring core SHALL 在輸出中保留穩定的牌型識別、顯示名稱、台數與命中原因，讓後續 UI、紀錄與 browser E2E 可以驗證實際算台內容，而不是只得到單一總台數。

#### Scenario: 和牌結果可列出逐項台型明細

- **WHEN** 一手牌完成有效和牌結算
- **THEN** scoring core MUST 回傳可枚舉的 `scoringItems`，且每個 item MUST 包含足以對應權威台型目錄的穩定識別與台數資訊

##### Example: E2E 可驗證和牌明細

- **GIVEN** 一手和牌命中三個已啟用台型
- **WHEN** round result 顯示於 UI
- **THEN** 測試 MUST 能依 `scoringItems` 驗證這三個台型與其總台數，而不是只能比對一個模糊字串

---
### Requirement: profile 差異必須透過設定而不是散落條件分支處理

當牌型規則存在一般台數表與特殊 profile 差異時，scoring core SHALL 透過權威設定決定採用哪一組規則，而不是把 profile 判斷散落在個別 pattern 實作中。

#### Scenario: 不同 profile 的牌型規則可被一致切換

- **WHEN** rule config 指定不同 scoring profile
- **THEN** scoring core MUST 依該 profile 採用對應的牌型台數與衝突規則，並維持相同的輸出資料形狀

##### Example: 花牌與風牌計法受 profile 影響

- **GIVEN** 兩份 rule config 分別代表一般台數表與特殊 profile
- **WHEN** scoring core 評估同一手含花牌與風牌相關台型的和牌
- **THEN** 兩次評估 SHALL 允許得到不同台型組合，但輸出格式 MUST 保持一致且能指出差異來自 profile 規則

---
### Requirement: 結構化 scoring item 必須成為 runtime 結果輸出

The scoring runtime SHALL return structured scoring items instead of plain pattern-id strings, so downstream UI and tests can render and verify the exact tai breakdown without reverse-mapping from ad-hoc labels.

#### Scenario: settlement returns structured scoring items

- **WHEN** a winning hand completes scoring evaluation and settlement
- **THEN** each item in `scoringItems` MUST include a stable `patternId`, display `label`, numeric `tai`, and a machine-stable reason or source summary

##### Example: dealer self-draw result keeps item metadata

- **GIVEN** a winning hand that matches `dealer-win` and `self-draw`
- **WHEN** the runtime builds the settlement result
- **THEN** `scoringItems` MUST contain two structured items rather than two raw strings, and `totalTai` MUST equal the sum of their `tai`


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
### Requirement: profile-aware scoring catalog MUST drive runtime evaluation

The scoring runtime SHALL evaluate patterns from a profile-aware scoring catalog, so `classic-taiwan` and `flower-wind-bonus` can produce different valid results for the same hand while sharing one evaluation pipeline.

#### Scenario: same hand produces profile-specific scoring items

- **WHEN** the same legal winning hand is evaluated once under `classic-taiwan` and once under `flower-wind-bonus`
- **THEN** the runtime MUST allow the resulting `scoringItems` to differ according to the active profile, while preserving the same result shape

##### Example: flower and wind scoring differs by profile

- **GIVEN** a winning hand that includes flower tiles and a wind triplet
- **WHEN** scoring runs under both supported profiles
- **THEN** the two results MUST expose different scoring items if the profiles define different flower or wind behavior


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
### Requirement: conflict and override rules MUST be enforced before totalTai is finalized

The scoring runtime SHALL resolve mutual exclusion, override, and replacement rules before computing the final tai total, rather than summing every matched candidate blindly.

#### Scenario: override rule removes lower-priority items

- **WHEN** a hand matches both an overriding pattern and the lower-priority patterns it replaces
- **THEN** the final `scoringItems` MUST exclude the replaced items before `totalTai` is calculated

##### Example: concealed self-draw replaces concealed-hand and self-draw

- **GIVEN** a hand that satisfies `concealed-hand`, `self-draw`, and `concealed-self-draw`
- **WHEN** the runtime resolves scoring conflicts
- **THEN** the final result MUST keep `concealed-self-draw` and MUST NOT keep the replaced lower-priority items

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
### Requirement: Dealer continuation adds cumulative tai

Scoring core SHALL add one structured `dealer-continuation` scoring item when the winning seat is the dealer and the authoritative continuation count is greater than zero. The item's tai SHALL equal the continuation count and SHALL be included in `totalTai` in addition to the existing one-tai dealer item.

#### Scenario: First continuation adds one tai

- **WHEN** the dealer wins with continuation count 1
- **THEN** settlement MUST include `莊家 1 台` and `連莊 1 台`

#### Scenario: Second continuation adds two tai

- **WHEN** the dealer wins with continuation count 2
- **THEN** settlement MUST include one `連莊 2 台` item and add 2 to `totalTai`

#### Scenario: Non-dealer receives no continuation tai

- **WHEN** a non-dealer wins
- **THEN** settlement MUST NOT include a dealer-continuation scoring item

<!-- @trace
source: post-mvp-settlement-layout-readability
updated: 2026-07-20
code:
  - src/views/game/e2eBridge.ts
  - .superpowers/brainstorm/51439-1784519701/state/events
  - src/core/types/result.ts
  - src/core/scoring/catalog.ts
  - .superpowers/brainstorm/51439-1784519701/state/server-stopped
  - src/core/scoring/validation.ts
  - src/core/scoring/settlement.ts
  - src/core/scoring/types.ts
  - src/core/types/table.ts
  - src/views/game/GameView.vue
  - src/views/game/selectors.ts
  - .superpowers/brainstorm/51439-1784519701/content/settlement-layout-options.html
  - .superpowers/brainstorm/51439-1784519701/state/server.pid
  - src/core/rules/roundFlow.ts
  - src/stores/gameSession.ts
  - src/views/game/types.ts
  - src/core/config/index.ts
  - src/views/game/components/GameTableView.vue
  - src/core/scoring/patterns.ts
tests:
  - tests/core/rule-config-core.test.ts
  - tests/core/dealer-progression.test.ts
  - tests/core/scoring-settlement.test.ts
  - tests/core/domain-model.test.ts
  - tests/ui/game-session-hmr.test.ts
  - tests/ui/game-session.store.test.ts
  - tests/ui/game-table-view.test.ts
  - tests/ui/interactive-turn-loop.test.ts
  - tests/ui/mainline-playable-flow.test.ts
  - tests/ui/round-result-sync.test.ts
  - tests/ui/next-round-flow.test.ts
  - e2e/game-table.smoke.spec.ts
  - tests/core/round-flow-outcome.test.ts
  - tests/core/round-flow-claims.test.ts
  - tests/ui/game-table-layout.test.ts
  - tests/ui/table-layout-verification-flow.test.ts
  - tests/ui/human-claim-window.test.ts
  - tests/ui/human-self-turn-actions.test.ts
-->