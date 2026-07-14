# mahjong-round-flow-core 規格

## 目的

待補：此檔由變更 `taiwan-mahjong-round-flow-foundation` 歸檔後建立，需補上正式目的說明。

## 需求

### 需求：基礎牌局初始化

round flow core SHALL 建立一個台灣 16 張麻將的基礎牌局狀態：四位玩家、由 east 起莊、莊家起手 17 張、其餘三家起手 16 張，並在第一次出牌前完成配置。

#### 情境：發出基礎起手牌

- **WHEN** 呼叫端以完整牌牆初始化一局新的基礎牌局
- **THEN** round flow core SHALL 分配 17 張起手牌給 east，並各分配 16 張起手牌給 south、west、north，且將 east 設為第一個出牌座位

##### 範例：莊家多一張起手牌

- **GIVEN** 一個包含四個座位與完整牌牆的基礎牌局初始化請求
- **WHEN** 牌局初始化完成，且尚未進行任何補花
- **THEN** east MUST 持有 17 張手牌，south MUST 持有 16 張，west MUST 持有 16 張，north MUST 持有 16 張，且目前輪到的座位 MUST 為 east


<!-- @trace
source: taiwan-mahjong-round-flow-foundation
updated: 2026-07-09
code:
  - src/core/types/result.ts
  - src/core/index.ts
  - src/core/rules/index.ts
  - src/core/rules/types.ts
  - src/core/rules/roundFlow.ts
tests:
  - tests/core/round-flow-claims.test.ts
  - tests/core/round-flow-flowers.test.ts
  - tests/core/round-flow-setup.test.ts
  - tests/core/round-flow-outcome.test.ts
-->

---
### 需求：補花處理流程

round flow core SHALL 將補花視為一條可決定的摸牌流程，不論在初始發牌或後續摸牌時皆然：只要摸到花牌，MUST 立即亮出，並從牌尾持續補牌，直到拿到非花牌為止。

#### 情境：初始化時補花

- **WHEN** 玩家在初始發牌或起手牌整理期間拿到一張花牌
- **THEN** round flow core SHALL 將該花牌移到玩家的明示花牌區，並持續從牌尾補牌，直到玩家手牌數量符合該座位的基礎要求

##### 範例：FLOWER-REPLACE-001

- **GIVEN** 一位非莊家需要 16 張手牌，且其下一張摸到的牌是花牌
- **WHEN** 牌局初始化套用補花流程
- **THEN** 該花牌 MUST 被亮出、牌尾 MUST 補上一張替代牌，且玩家最終手牌數 MUST 仍為 16 張

#### 情境：連續補花直到出現非花牌

- **WHEN** 從牌尾補到的替代牌仍然是花牌
- **THEN** round flow core SHALL 重複亮牌與補牌步驟，直到拿到非花牌為止

##### 範例：FLOWER-CHAIN-001

- **GIVEN** 一位玩家亮出一張花牌，且前兩張牌尾替代牌也都是花牌
- **WHEN** round flow core 執行補花流程
- **THEN** 所有補到的花牌 MUST 依序亮出，且補牌 MUST 持續直到玩家拿到一張可進手的非花牌


<!-- @trace
source: taiwan-mahjong-round-flow-foundation
updated: 2026-07-09
code:
  - src/core/types/result.ts
  - src/core/index.ts
  - src/core/rules/index.ts
  - src/core/rules/types.ts
  - src/core/rules/roundFlow.ts
tests:
  - tests/core/round-flow-claims.test.ts
  - tests/core/round-flow-flowers.test.ts
  - tests/core/round-flow-setup.test.ts
  - tests/core/round-flow-outcome.test.ts
-->

---
### 需求：摸牌與出牌的回合推進

round flow core SHALL 以明確的摸牌與出牌轉換來推進牌局，並維持基礎規則：一般回合由摸一張牌、打一張牌構成，除非牌局先行結束。

#### 情境：出牌後推進一般回合

- **WHEN** 當前座位打出一張牌，且沒有胡牌或宣告裁決中斷回合
- **THEN** round flow core SHALL 將回合推進到下一個座位，準備進入下一次一般摸牌

##### 範例：pass 後由下一家摸牌

- **GIVEN** east 打出一張牌，且所有有資格宣告的座位皆選擇 pass
- **WHEN** round flow core 完成此次出牌的裁決
- **THEN** south MUST 成為下一個可進行一般摸牌的座位

#### 情境：胡牌結果出現後停止一般推進

- **WHEN** 摸牌或出牌轉換產生有效胡牌結果
- **THEN** round flow core SHALL 以 win outcome 結束牌局，且 SHALL NOT 再繼續下一輪一般摸打循環

##### 範例：胡牌牌張直接結束牌局

- **GIVEN** south 透過吃入他家打出的牌完成合法胡牌
- **WHEN** 該胡牌宣告被接受
- **THEN** 牌局狀態 MUST 變成 win result，而不是再推進到 west 的一般摸牌


<!-- @trace
source: taiwan-mahjong-round-flow-foundation
updated: 2026-07-09
code:
  - src/core/types/result.ts
  - src/core/index.ts
  - src/core/rules/index.ts
  - src/core/rules/types.ts
  - src/core/rules/roundFlow.ts
tests:
  - tests/core/round-flow-claims.test.ts
  - tests/core/round-flow-flowers.test.ts
  - tests/core/round-flow-setup.test.ts
  - tests/core/round-flow-outcome.test.ts
-->

---
### 需求：宣告視窗裁決

round flow core SHALL 透過單一 pending claim window 來裁決互相競爭的宣告候選，且 SHALL 從 rule config 推導有效的宣告優先序，而不是假設一個固定常數。

#### 情境：胡牌宣告優先於較低優先級宣告

- **WHEN** 多個座位對同一張捨牌提出宣告，且有效 rule config 將胡牌宣告排在其他合法宣告之前
- **THEN** round flow core SHALL 將該 claim window 裁決為胡牌宣告，而不是明槓、碰或吃

##### 範例：CLAIM-PRIORITY-001 胡牌優先於碰牌

- **GIVEN** 一張捨牌同時讓 north 可以胡牌，south 可以碰牌
- **WHEN** 兩個宣告都在優先序為 `win > kan-exposed > pon > chi` 的同一 pending claim window 中送出
- **THEN** 裁決結果 MUST 為 north 的胡牌宣告

#### 情境：沒有胡牌時明槓優先於碰與吃

- **WHEN** pending claim window 中沒有胡牌宣告，且有效 rule config 將明槓排在較低優先級宣告之前
- **THEN** round flow core SHALL 將該 claim window 裁決為明槓

##### 範例：明槓優先於吃牌

- **GIVEN** 一張捨牌讓 west 可以形成明槓，south 可以吃牌
- **WHEN** 兩個宣告都被送出，且在優先序為 `win > kan-exposed > pon > chi` 的 rule config 下不存在任何有效胡牌宣告
- **THEN** 裁決結果 MUST 為 west 的明槓宣告

#### 情境：所有可宣告者皆 pass 時推進牌局

- **WHEN** pending claim window 關閉，且沒有任何被接受的宣告
- **THEN** round flow core SHALL 將此次出牌裁決為 pass，並以下一家的一般摸牌轉換繼續推進牌局

##### 範例：所有宣告皆 pass

- **GIVEN** 一張捨牌沒有任何被接受的吃、碰、槓或胡宣告
- **WHEN** claim window 關閉
- **THEN** 裁決結果 MUST 為 pass，且下一個依序座位 MUST 取得下一次一般摸牌機會


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
### 需求：流局結果

當牌牆已無法再支援下一次一般摸牌且尚無玩家胡牌時，round flow core SHALL 產生明確的流局結果，並 SHALL 透過 rule config policy 表示未定案的流局後分支，而不是自行發明最終商業結果。

#### 情境：牌牆耗盡時結束牌局

- **WHEN** 牌局進入無法再進行一般摸牌且尚未接受任何胡牌結果的狀態
- **THEN** round flow core SHALL 回傳一個明確的流局結果

##### 範例：DRAW-DEALER-001

- **GIVEN** 一個牌局狀態中，牌牆已無合法的一般摸牌，且沒有任何已接受的胡牌宣告
- **WHEN** round flow core 評估牌局是否還能繼續
- **THEN** 結果 MUST 為流局 outcome

#### 情境：不得自行補出未定案的流局後規則

- **WHEN** 牌局以流局結束，且有效 rule config 對連莊、聽牌懲罰或查聽檢查仍標記為未定案
- **THEN** round flow core SHALL NOT 將這些結果視為已確定的商業邏輯

##### 範例：未定案的連莊規則保持未設定

- **GIVEN** 一個流局 outcome 所依據的 rule config 中，流局後 policy 仍為未定案
- **WHEN** 該結果回傳給呼叫端
- **THEN** outcome MUST 明確表示本局為流局，且 MUST 保持連莊或聽牌結算為未定案狀態

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
### 需求：供 AI 安全讀取的牌局狀態

round flow core SHALL 暴露一個穩定的狀態形狀，使 AI 使用者能在不繞過規則引擎的前提下，讀取並選擇合法動作。

#### 情境：AI 讀取合法決策上下文

- **WHEN** AI 玩家需要做出出牌或宣告決策
- **THEN** round flow core SHALL 提供足夠的合法狀態上下文供 AI 評估，包括目前座位、手牌狀態、若有則包含觸發捨牌，以及合法動作候選

##### 範例：AI 讀取合法宣告上下文

- **GIVEN** 一個由 round flow 產生的 claim window 狀態
- **WHEN** AI 讀取該狀態以選擇動作
- **THEN** AI 使用端 MUST 能檢視觸發的捨牌與候選宣告動作，而不需要直接修改流程內部狀態

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
### 需求：供 UI 安全讀取的牌局狀態

round flow core SHALL 暴露一個穩定的牌局快照，讓 UI 與 store 層能直接消費，而不需重新實作規則判定。

#### 情境：store 讀取牌局快照以供渲染

- **WHEN** 前端 store 請求目前牌局快照以供 view 渲染
- **THEN** round flow core SHALL 提供一個穩定的狀態形狀，包含 UI 殼層所需的 table、players、current seat、phase、pending-action context 與 outcome 資料

##### 範例：game view 收到可渲染的快照

- **GIVEN** core 中一個新初始化完成的牌局狀態
- **WHEN** 前端 store 將該快照轉交給 game table view
- **THEN** UI 使用端 MUST 能渲染目前牌局資訊，而不需在 Vue component 中重新計算合法規則結果

<!-- @trace
source: taiwan-mahjong-vue-table-shell
updated: 2026-07-09
code:
  - src/views/home/HomeView.vue
  - src/stores/gameSession.ts
  - src/core/config/types.ts
  - src/views/game/types.ts
  - src/main.ts
  - src/core/rules/roundFlow.ts
  - src/app.ts
  - src/env.d.ts
  - src/styles/main.css
  - src/views/game/GameView.vue
  - vitest.config.ts
  - src/core/wall.ts
  - src/views/game/components/GameTableView.vue
  - src/core/scoring/validation.ts
  - tsconfig.json
  - src/core/scoring/types.ts
  - src/core/types/result.ts
  - src/views/game/selectors.ts
  - package.json
  - src/core/config/index.ts
  - src/core/ai/context.ts
  - src/App.vue
  - src/core/index.ts
  - vite.config.ts
  - src/core/ai/index.ts
  - src/core/scoring/settlement.ts
  - src/core/rules/types.ts
  - src/core/ai/types.ts
  - src/core/ai/decision.ts
  - index.html
  - src/router/index.ts
tests:
  - tests/ui/app-shell.test.ts
  - tests/core/scoring-settlement.test.ts
  - tests/docs/scaffold-boundary.test.ts
  - tests/core/rule-config-core.test.ts
  - tests/core/scoring-exports.test.ts
  - tests/smoke/vue-workspace.test.ts
  - tests/ui/game-session.store.test.ts
  - tests/core/round-flow-claims.test.ts
  - tests/ui/game-table-view.test.ts
  - tests/core/ai-decision-core.test.ts
  - tests/core/round-flow-outcome.test.ts
-->
