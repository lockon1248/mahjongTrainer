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