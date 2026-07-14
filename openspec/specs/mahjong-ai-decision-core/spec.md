# mahjong-ai-decision-core 規格

## 目的

待補：此檔由變更 `taiwan-mahjong-ai-decision-foundation` 歸檔後建立，需補上正式目的說明。

## 需求

### 需求：AI 出牌決策

AI decision core SHALL 在自己的出牌回合中，從合法手牌位置選出一張要打出的牌。

#### 情境：從合法手牌中選擇一張要打的牌

- **WHEN** AI 收到一個合法的出牌回合狀態，且存在一張以上可打出的手牌
- **THEN** AI decision core SHALL 回傳一個且僅一個出牌決策，且該決策所指向的牌 MUST 實際存在於 AI 玩家目前的手牌中

##### 範例：選出一張合法可打的牌

- **GIVEN** AI 手牌中有多張合法可打的候選牌，且目前沒有可直接胡牌的動作
- **WHEN** 執行出牌評估
- **THEN** 回傳的決策 MUST 指向該手牌中的其中一張牌，且 MUST NOT 虛構出目前手牌外的牌


<!-- @trace
source: taiwan-mahjong-ai-decision-foundation
updated: 2026-07-09
code:
  - src/core/ai/index.ts
  - src/core/scoring/settlement.ts
  - src/core/types/result.ts
  - src/core/index.ts
  - src/core/scoring/validation.ts
  - src/core/scoring/types.ts
  - src/core/config/index.ts
  - src/core/rules/types.ts
  - src/core/config/types.ts
  - src/core/ai/decision.ts
  - src/core/ai/types.ts
  - src/core/ai/context.ts
  - src/core/rules/roundFlow.ts
tests:
  - tests/core/round-flow-outcome.test.ts
  - tests/core/scoring-settlement.test.ts
  - tests/core/ai-decision-core.test.ts
  - tests/core/round-flow-claims.test.ts
  - tests/core/scoring-exports.test.ts
  - tests/core/rule-config-core.test.ts
  - tests/docs/scaffold-boundary.test.ts
-->

---
### 需求：AI 以胡牌優先的宣告決策

當存在合法胡牌宣告時，AI decision core SHALL 優先選擇胡牌。

#### 情境：胡牌優先於較低優先級宣告

- **WHEN** AI 收到的宣告候選中包含合法的 `win` 動作
- **THEN** AI decision core SHALL 選擇胡牌宣告，而不是 `kan-exposed`、`pon`、`chi` 或 `pass`

##### 範例：合法胡牌優先於碰牌

- **GIVEN** AI 的宣告候選集合中同時包含 `win` 與 `pon`
- **WHEN** 執行 AI 宣告評估
- **THEN** 被選中的動作 MUST 為 `win`


<!-- @trace
source: taiwan-mahjong-ai-decision-foundation
updated: 2026-07-09
code:
  - src/core/ai/index.ts
  - src/core/scoring/settlement.ts
  - src/core/types/result.ts
  - src/core/index.ts
  - src/core/scoring/validation.ts
  - src/core/scoring/types.ts
  - src/core/config/index.ts
  - src/core/rules/types.ts
  - src/core/config/types.ts
  - src/core/ai/decision.ts
  - src/core/ai/types.ts
  - src/core/ai/context.ts
  - src/core/rules/roundFlow.ts
tests:
  - tests/core/round-flow-outcome.test.ts
  - tests/core/scoring-settlement.test.ts
  - tests/core/ai-decision-core.test.ts
  - tests/core/round-flow-claims.test.ts
  - tests/core/scoring-exports.test.ts
  - tests/core/rule-config-core.test.ts
  - tests/docs/scaffold-boundary.test.ts
-->

---
### 需求：AI 啟發式宣告決策

當不存在胡牌宣告時，AI decision core SHALL 使用可決定的啟發式方法，在合法的 `kan-exposed`、`pon`、`chi` 與 `pass` 之間做出選擇。

#### 情境：選擇對牌型進展有利的副露宣告

- **WHEN** AI 收到的候選宣告都不是胡牌，且依據支援的啟發式至少有一個宣告能改善其牌型進展
- **THEN** AI decision core SHALL 選擇分數最高的支援宣告

##### 範例：選擇吃牌而不是 pass

- **GIVEN** 一組宣告候選中，`chi` 比 `pass` 更能改善牌型進展
- **WHEN** 執行 AI 宣告評估
- **THEN** 被選中的動作 MUST 為 `chi`

#### 情境：沒有值得執行的宣告時選擇 pass

- **WHEN** AI 收到的非胡牌宣告候選，相較於 pass 並無法改善支援範圍內的牌型進展
- **THEN** AI decision core SHALL 選擇 `pass`

##### 範例：保守地選擇 pass

- **GIVEN** 一組宣告候選中，可執行的副露會破壞有用的牌型結構，且沒有立即可支援的收益
- **WHEN** 執行 AI 宣告評估
- **THEN** 被選中的動作 MUST 為 `pass`


<!-- @trace
source: taiwan-mahjong-ai-decision-foundation
updated: 2026-07-09
code:
  - src/core/ai/index.ts
  - src/core/scoring/settlement.ts
  - src/core/types/result.ts
  - src/core/index.ts
  - src/core/scoring/validation.ts
  - src/core/scoring/types.ts
  - src/core/config/index.ts
  - src/core/rules/types.ts
  - src/core/config/types.ts
  - src/core/ai/decision.ts
  - src/core/ai/types.ts
  - src/core/ai/context.ts
  - src/core/rules/roundFlow.ts
tests:
  - tests/core/round-flow-outcome.test.ts
  - tests/core/scoring-settlement.test.ts
  - tests/core/ai-decision-core.test.ts
  - tests/core/round-flow-claims.test.ts
  - tests/core/scoring-exports.test.ts
  - tests/core/rule-config-core.test.ts
  - tests/docs/scaffold-boundary.test.ts
-->

---
### 需求：保守處理未定案規則

當潛在決策依賴未定案桌規時，AI decision core SHALL 採取保守策略。

#### 情境：忽略未定案加成假設

- **WHEN** 某個啟發式分支需要依賴 rule config 中尚未設定的未定案桌規細節
- **THEN** AI decision core SHALL 忽略該未定案加成或懲罰，而不是自行發明隱含假設

##### 範例：忽略未定案特殊胡加成

- **GIVEN** 一手 AI 手牌只有在假設某項未定案特殊胡規則成立時才會有不同估值
- **WHEN** AI decision core 在未定案的 rule config 下評估該決策
- **THEN** 決策分數 MUST 在不加入該未定案規則加成的情況下完成計算

<!-- @trace
source: taiwan-mahjong-ai-decision-foundation
updated: 2026-07-09
code:
  - src/core/ai/index.ts
  - src/core/scoring/settlement.ts
  - src/core/types/result.ts
  - src/core/index.ts
  - src/core/scoring/validation.ts
  - src/core/scoring/types.ts
  - src/core/config/index.ts
  - src/core/rules/types.ts
  - src/core/config/types.ts
  - src/core/ai/decision.ts
  - src/core/ai/types.ts
  - src/core/ai/context.ts
  - src/core/rules/roundFlow.ts
tests:
  - tests/core/round-flow-outcome.test.ts
  - tests/core/scoring-settlement.test.ts
  - tests/core/ai-decision-core.test.ts
  - tests/core/round-flow-claims.test.ts
  - tests/core/scoring-exports.test.ts
  - tests/core/rule-config-core.test.ts
  - tests/docs/scaffold-boundary.test.ts
-->
