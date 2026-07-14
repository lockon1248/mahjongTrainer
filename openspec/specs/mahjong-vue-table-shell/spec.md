# mahjong-vue-table-shell 規格

## 目的

待補：此檔由變更 `taiwan-mahjong-vue-table-shell` 歸檔後建立，需補上正式目的說明。

## 需求

### 需求：Vue 應用殼層啟動

前端 SHALL 提供一個可正常啟動的 Vue 應用殼層，作為麻將練習器的承接入口。

#### 情境：應用可成功啟動

- **WHEN** 瀏覽器載入應用入口
- **THEN** Vue 應用殼層 SHALL 能在不依賴後端服務的情況下成功掛載

##### 範例：本機殼層成功掛載

- **GIVEN** 一個已載入前端建置產物的本機瀏覽器工作階段
- **WHEN** 載入應用入口
- **THEN** 根應用殼層 MUST 成功渲染，且不得出現空白畫面失敗


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

---
### 需求：Router 提供首頁與牌局入口

前端 SHALL 至少提供首頁路由與牌局路由兩個入口。

#### 情境：導向牌局路由

- **WHEN** 使用者導向牌局入口路由
- **THEN** router SHALL 渲染牌局 view 容器，而不是 missing-route fallback

##### 範例：牌局路由成功渲染

- **GIVEN** 應用 router 已啟用
- **WHEN** 使用者開啟牌局路由
- **THEN** 牌局 view 容器 MUST 被掛載


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

---
### 需求：唯讀牌桌殼層

前端 SHALL 渲染一個唯讀的麻將牌桌殼層，將來自 core 支援的 store 牌局狀態映射到畫面。

#### 情境：渲染牌桌快照

- **WHEN** game store 持有一個已初始化的牌局快照
- **THEN** game table view SHALL 依該快照渲染可見的玩家區塊、桌面摘要、目前回合資訊與牌局結果摘要

##### 範例：初始化牌局出現在畫面上

- **GIVEN** store state 內含一個已初始化的牌局快照
- **WHEN** game table view 渲染
- **THEN** view MUST 顯示所有座位與目前牌局資訊，且不得在 component 內重新實作規則邏輯


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

---
### 需求：Pinia session 骨架

前端 SHALL 提供一個以 Pinia 為基礎的 session store，透過 core API 初始化並暴露目前的牌局快照。

#### 情境：由 store 開啟新的本機牌局

- **WHEN** store 初始化一局新牌
- **THEN** 它 SHALL 呼叫 core API 建立牌局快照，並將產生的狀態暴露給 view 層

##### 範例：store 暴露已初始化的快照

- **GIVEN** store 從空的 session state 開始
- **WHEN** 請求建立新的本機牌局
- **THEN** store MUST 為 game view 暴露一個已初始化的牌局快照

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

---
### 需求：可互動的回合推進

session store SHALL 依照 view 傳入的意圖委派 round-flow core API 來推進回合，且 SHALL NOT 在 store 或 component 中重新實作規則判定。

#### 情境：摸牌讓目前座位進入出牌階段

- **WHEN** 當前座位在牌局階段為 `draw` 時執行摸牌
- **THEN** store SHALL 呼叫 round-flow core 的摸牌 API，並暴露一個 phase 為 `discard` 的更新後快照

##### 範例：莊家摸牌後進入出牌

- **GIVEN** 一個已初始化的牌局中，莊家座位 `east` 處於 `draw` 階段
- **WHEN** store 為 `east` 推進摸牌
- **THEN** 暴露出的快照 MUST 回報 `east` 的 phase 為 `discard`，且不得由 component 自行計算任何規則結果


<!-- @trace
source: taiwan-mahjong-interactive-turn-loop
updated: 2026-07-13
code:
  - src/views/game/components/GameTableView.vue
  - src/stores/gameSession.ts
  - src/views/game/GameView.vue
  - src/views/game/selectors.ts
  - src/views/game/types.ts
tests:
  - tests/ui/game-session.store.test.ts
  - tests/ui/interactive-turn-loop.test.ts
-->

---
### 需求：人類座位出牌動作

game table view SHALL 允許人類座位打出一張手牌，並 SHALL 將該出牌意圖轉送給 store，再由 store 經由 round-flow core 套用。

#### 情境：人類打出一張手牌

- **WHEN** 人類座位處於 `discard` 階段，並在 table view 中選擇其中一張手牌
- **THEN** view SHALL 將所選牌張轉送至 store 的 discard action，而 store SHALL 經由 core 套用，使手牌數量減一且該牌出現在該座位的捨牌區

##### 範例：莊家從 17 張手牌中打牌

- **GIVEN** 人類莊家座位 `east` 在 `discard` 階段持有 17 張手牌
- **WHEN** 人類選擇其中一張手牌打出
- **THEN** 暴露出的快照 MUST 顯示 `east` 剩餘 16 張手牌，且該打出的牌被記錄在 `east` 的捨牌區


<!-- @trace
source: taiwan-mahjong-interactive-turn-loop
updated: 2026-07-13
code:
  - src/views/game/components/GameTableView.vue
  - src/stores/gameSession.ts
  - src/views/game/GameView.vue
  - src/views/game/selectors.ts
  - src/views/game/types.ts
tests:
  - tests/ui/game-session.store.test.ts
  - tests/ui/interactive-turn-loop.test.ts
-->

---
### 需求：AI 驅動的對手回合

session store SHALL 使用 AI decision core 來驅動非人類座位選擇出牌與宣告，並 SHALL 自動推進牌局直到需要人類輸入或牌局結束。

#### 情境：AI 座位自動出牌

- **WHEN** 目前座位為非人類座位，且處於 `discard` 階段
- **THEN** store SHALL 使用 AI decision core 選出要打的牌，並透過 round-flow core 套用，而不需要人類輸入

##### 範例：非莊家 AI 座位完成其回合

- **GIVEN** 一個牌局中控制權已交給 AI 座位 `south`，且目前處於 `draw` 階段
- **WHEN** store 推進回合迴圈
- **THEN** 座位 `south` MUST 自動完成摸牌與出牌，且控制權 MUST 繼續往後推進


<!-- @trace
source: taiwan-mahjong-interactive-turn-loop
updated: 2026-07-13
code:
  - src/views/game/components/GameTableView.vue
  - src/stores/gameSession.ts
  - src/views/game/GameView.vue
  - src/views/game/selectors.ts
  - src/views/game/types.ts
tests:
  - tests/ui/game-session.store.test.ts
  - tests/ui/interactive-turn-loop.test.ts
-->

---
### 需求：自動裁決宣告視窗

在 claim window 期間，session store SHALL 使用 AI decision core 蒐集 AI 座位的宣告，並 SHALL 透過 round-flow core 裁決該視窗；人類座位視為 pass，之後再繼續推進回合迴圈。

#### 情境：宣告視窗在無人類宣告輸入下完成裁決

- **WHEN** 一次出牌開啟了 `claim-window`
- **THEN** store SHALL 蒐集 AI 宣告，將人類座位視為 pass，透過 core 裁決該視窗，並暴露一個已清空 claim window 的結果快照

##### 範例：無有效宣告時輪到下一家

- **GIVEN** 座位 `east` 的一次出牌開啟了 `claim-window`，且沒有任何座位具備有效宣告
- **WHEN** store 裁決該 claim window
- **THEN** 暴露出的快照 MUST 清空 pending claim window，並將控制權移交給下一家且 phase 為 `draw`


<!-- @trace
source: taiwan-mahjong-interactive-turn-loop
updated: 2026-07-13
code:
  - src/views/game/components/GameTableView.vue
  - src/stores/gameSession.ts
  - src/views/game/GameView.vue
  - src/views/game/selectors.ts
  - src/views/game/types.ts
tests:
  - tests/ui/game-session.store.test.ts
  - tests/ui/interactive-turn-loop.test.ts
-->

---
### 需求：唯讀呈現回合進展

game table view SHALL 以唯讀方式反映回合推進結果，顯示 current seat、phase、last claim resolution 與 outcome，且不得在 component 中重新計算規則結果。

#### 情境：推進後的畫面顯示更新進展

- **WHEN** 牌局推進且 store 快照發生變化
- **THEN** table view SHALL 顯示從快照導出的最新 current seat、phase 與 last claim resolution

##### 範例：pass 後顯示最後一次宣告裁決

- **GIVEN** 一個 claim window 被裁決為 pass
- **WHEN** table view 依照更新後的快照重新渲染
- **THEN** view MUST 顯示 current seat 與 phase 已往前推進，且 last claim resolution 為 `pass`


<!-- @trace
source: taiwan-mahjong-interactive-turn-loop
updated: 2026-07-13
code:
  - src/views/game/components/GameTableView.vue
  - src/stores/gameSession.ts
  - src/views/game/GameView.vue
  - src/views/game/selectors.ts
  - src/views/game/types.ts
tests:
  - tests/ui/game-session.store.test.ts
  - tests/ui/interactive-turn-loop.test.ts
-->

---
### 需求：回合推進失敗處理

若回合推進失敗，session store SHALL 保留明確的 error state，且 SHALL NOT 靜默顯示過期或空白的牌桌。

#### 情境：推進錯誤被明確暴露

- **WHEN** store 的回合推進 action 在套用 core 操作時拋出錯誤
- **THEN** store SHALL 記錄一個明確的 error state，且 SHALL NOT 用空白牌桌覆蓋目前快照

##### 範例：非法出牌保留錯誤狀態

- **GIVEN** store 已暴露一個初始化完成的牌局
- **WHEN** 請求打一張當前座位並未持有的牌
- **THEN** store MUST 暴露一個非 null 的 error state，且 MUST NOT 將既有牌局快照清空成空桌

<!-- @trace
source: taiwan-mahjong-interactive-turn-loop
updated: 2026-07-13
code:
  - src/views/game/components/GameTableView.vue
  - src/stores/gameSession.ts
  - src/views/game/GameView.vue
  - src/views/game/selectors.ts
  - src/views/game/types.ts
tests:
  - tests/ui/game-session.store.test.ts
  - tests/ui/interactive-turn-loop.test.ts
-->

## Requirements

### Requirement: Human self-turn action entry

前端牌桌在真人自己的回合中，必須顯示目前合法的自回合動作入口，讓真人可執行 `win-self-draw`、`kan-concealed`、`kan-added`，而不只限於打牌。

#### Scenario: Render only legal self-turn actions

- **WHEN** game store 暴露目前座位的自回合合法候選
- **THEN** game table view 必須只顯示這些合法動作，而不得渲染不合法按鈕

##### Example: self-draw win button appears only when legal

- **GIVEN** store 暴露一組包含 `win-self-draw` 的合法自回合候選
- **WHEN** table view 渲染真人回合操作區
- **THEN** 畫面必須顯示 `win-self-draw` 入口


<!-- @trace
source: taiwan-mahjong-human-self-turn-actions
updated: 2026-07-14
code:
  - src/core/ai/decision.ts
  - src/core/types/action.ts
  - AGENTS.md
  - src/core/rules/types.ts
  - src/stores/gameSession.ts
  - src/views/game/GameView.vue
  - src/core/rules/roundFlow.ts
  - src/core/ai/types.ts
  - src/views/game/components/GameTableView.vue
tests:
  - tests/core/human-claim-candidates.test.ts
  - tests/core/human-self-turn-actions.test.ts
  - tests/ui/game-session.store.test.ts
  - tests/ui/interactive-turn-loop.test.ts
  - tests/ui/human-claim-window.test.ts
  - tests/ui/human-self-turn-actions.test.ts
-->

---
### Requirement: Human self-turn action submission

當真人在自己的回合選擇合法自回合動作時，前端必須將意圖送交 store，再由 store 經由 core 套用，而不得在 component 內自行決定規則結果。

#### Scenario: Self-turn action is forwarded to the store

- **WHEN** 真人點擊一個合法的自回合按鈕
- **THEN** view 必須將該 action 與必要資料送至 store action，而不是在 component 內直接改 round state

##### Example: concealed kan click forwards the selected action

- **GIVEN** 真人目前回合存在一個合法 `kan-concealed` 候選
- **WHEN** 真人點擊該按鈕
- **THEN** view 必須將對應候選資料轉送給 store

<!-- @trace
source: taiwan-mahjong-human-self-turn-actions
updated: 2026-07-14
code:
  - src/core/ai/decision.ts
  - src/core/types/action.ts
  - AGENTS.md
  - src/core/rules/types.ts
  - src/stores/gameSession.ts
  - src/views/game/GameView.vue
  - src/core/rules/roundFlow.ts
  - src/core/ai/types.ts
  - src/views/game/components/GameTableView.vue
tests:
  - tests/core/human-claim-candidates.test.ts
  - tests/core/human-self-turn-actions.test.ts
  - tests/ui/game-session.store.test.ts
  - tests/ui/interactive-turn-loop.test.ts
  - tests/ui/human-claim-window.test.ts
  - tests/ui/human-self-turn-actions.test.ts
-->

---
### Requirement: Human claim-window action

牌桌前端必須允許人類座位在 `claim-window` 中選擇目前合法的宣告動作，並將該意圖交給 store 套用。

#### Scenario: Human sees only legal claim actions

- **WHEN** 人類座位在當前 `claim-window` 中擁有一個以上合法宣告
- **THEN** 前端必須只顯示那些合法的宣告動作，而不得顯示不合法或未支援的按鈕

##### Example: human can pon but cannot chi

- **GIVEN** 人類座位對目前捨牌只具備 `pon` 與 `pass` 的合法候選
- **WHEN** 畫面渲染 claim action 區塊
- **THEN** 使用者必須看到 `pon` 與 `pass`，且不得看到 `chi`

#### Scenario: Human submits a selected claim action

- **WHEN** 人類點擊某一個合法宣告動作
- **THEN** 前端必須將該宣告意圖送給 session store，而不得在 component 內自行裁決 claim window

##### Example: human chooses pass

- **GIVEN** 人類座位有 `pass` 與其他合法宣告可選
- **WHEN** 人類點擊 `pass`
- **THEN** 前端必須將 `pass` 意圖送往 store，並等待 store 與 core 完成後續裁決


<!-- @trace
source: taiwan-mahjong-human-claim-window
updated: 2026-07-14
code:
  - AGENTS.md
  - src/core/ai/decision.ts
  - src/core/rules/types.ts
  - src/views/game/selectors.ts
  - src/core/types/action.ts
  - src/core/rules/roundFlow.ts
  - src/core/ai/types.ts
  - src/views/game/components/GameTableView.vue
  - src/views/game/types.ts
  - src/stores/gameSession.ts
  - src/views/game/GameView.vue
tests:
  - tests/core/human-claim-candidates.test.ts
  - tests/core/human-self-turn-actions.test.ts
  - tests/ui/human-self-turn-actions.test.ts
  - tests/ui/human-claim-window.test.ts
  - tests/ui/game-session.store.test.ts
  - tests/ui/interactive-turn-loop.test.ts
-->

---
### Requirement: Claim-window pause before auto-advancement

當前端牌桌由 store 驅動回合推進時，若 `claim-window` 需要人類決定，畫面必須停在可互動狀態，而不是繼續自動推進。

#### Scenario: Human decision blocks auto-advance

- **WHEN** `claim-window` 對人類座位存在合法宣告候選
- **THEN** 前端必須維持在可操作的 claim 狀態，直到人類提交選擇或牌局結束

##### Example: claim window waits for human

- **GIVEN** 一次出牌已開啟 `claim-window`，且人類座位可合法 `win`
- **WHEN** store 更新快照到 view
- **THEN** 畫面必須停留在 `claim-window` 狀態並顯示 `win` 選項，而不是自動切換到下一家 `draw`

<!-- @trace
source: taiwan-mahjong-human-claim-window
updated: 2026-07-14
code:
  - AGENTS.md
  - src/core/ai/decision.ts
  - src/core/rules/types.ts
  - src/views/game/selectors.ts
  - src/core/types/action.ts
  - src/core/rules/roundFlow.ts
  - src/core/ai/types.ts
  - src/views/game/components/GameTableView.vue
  - src/views/game/types.ts
  - src/stores/gameSession.ts
  - src/views/game/GameView.vue
tests:
  - tests/core/human-claim-candidates.test.ts
  - tests/core/human-self-turn-actions.test.ts
  - tests/ui/human-self-turn-actions.test.ts
  - tests/ui/human-claim-window.test.ts
  - tests/ui/game-session.store.test.ts
  - tests/ui/interactive-turn-loop.test.ts
-->

---
### Requirement: Next-round action entry after round end

前端牌桌在單局已結束時，必須提供下一局操作入口；但在單局尚未結束時，不得顯示該入口。

#### Scenario: Show next-round entry only after the round ends

- **WHEN** game store 暴露的牌局 outcome 已不是 `in-progress`
- **THEN** game table view 必須顯示下一局入口

##### Example: next-round button appears after win

- **GIVEN** store 暴露一個 `win` outcome 的終局快照
- **WHEN** table view 渲染結果區
- **THEN** 畫面必須顯示「下一局」入口


<!-- @trace
source: taiwan-mahjong-draw-outcome-and-dealer-flow
updated: 2026-07-14
code:
  - AGENTS.md
  - src/core/types/table.ts
  - src/stores/gameSession.ts
  - src/core/rules/types.ts
  - src/views/game/components/GameTableView.vue
  - src/views/game/GameView.vue
  - src/core/rules/roundFlow.ts
tests:
  - tests/ui/game-session.store.test.ts
  - tests/ui/interactive-turn-loop.test.ts
  - tests/ui/next-round-flow.test.ts
  - tests/ui/human-claim-window.test.ts
  - tests/ui/human-self-turn-actions.test.ts
  - tests/core/dealer-progression.test.ts
  - tests/core/human-self-turn-actions.test.ts
-->

---
### Requirement: Next-round action submission

當使用者在終局畫面選擇開始下一局時，前端必須把意圖送交 store，再由 store 透過 core 決定是否能建立下一局，而不得在 component 內自行改 round state。

#### Scenario: Next-round action is forwarded to the store

- **WHEN** 使用者點擊下一局入口
- **THEN** view 必須將該意圖送至 store action，而不是在 component 內直接建立下一局

##### Example: next-round click forwards intent

- **GIVEN** 一個已結束的牌局畫面
- **WHEN** 使用者點擊「下一局」
- **THEN** view 必須呼叫對應的 store action

<!-- @trace
source: taiwan-mahjong-draw-outcome-and-dealer-flow
updated: 2026-07-14
code:
  - AGENTS.md
  - src/core/types/table.ts
  - src/stores/gameSession.ts
  - src/core/rules/types.ts
  - src/views/game/components/GameTableView.vue
  - src/views/game/GameView.vue
  - src/core/rules/roundFlow.ts
tests:
  - tests/ui/game-session.store.test.ts
  - tests/ui/interactive-turn-loop.test.ts
  - tests/ui/next-round-flow.test.ts
  - tests/ui/human-claim-window.test.ts
  - tests/ui/human-self-turn-actions.test.ts
  - tests/core/dealer-progression.test.ts
  - tests/core/human-self-turn-actions.test.ts
-->

---
### Requirement: Round result summary mapping

前端 selector 必須將 core 已有的 `RoundResult` 映射為穩定的結果摘要資料，供牌桌 UI 唯讀顯示。

#### Scenario: Win result is mapped into a readable summary

- **WHEN** store 持有一個 `win` outcome 的牌局
- **THEN** selector 必須映射出包含 `winnerSeat`、`discarderSeat`、`totalTai` 與結果類型的摘要資料

##### Example: discard win exposes winner and discarder

- **GIVEN** 一個 `winnerSeat = south`、`discarderSeat = west` 的胡牌結果
- **WHEN** selector 建立牌桌快照
- **THEN** 結果摘要 MUST 包含 `south` 與 `west`


<!-- @trace
source: taiwan-mahjong-ui-round-result-sync
updated: 2026-07-14
code:
  - src/views/game/GameView.vue
  - src/core/rules/types.ts
  - src/views/game/selectors.ts
  - src/stores/gameSession.ts
  - src/views/game/types.ts
  - AGENTS.md
  - src/core/types/table.ts
  - src/views/game/components/GameTableView.vue
  - src/core/rules/roundFlow.ts
tests:
  - tests/ui/game-session.store.test.ts
  - tests/core/dealer-progression.test.ts
  - tests/ui/interactive-turn-loop.test.ts
  - tests/ui/round-result-sync.test.ts
  - tests/core/human-self-turn-actions.test.ts
  - tests/ui/human-claim-window.test.ts
  - tests/ui/next-round-flow.test.ts
  - tests/ui/human-self-turn-actions.test.ts
-->

---
### Requirement: Round result summary rendering

牌桌 UI 在本局結束時，必須顯示結果摘要；在本局尚未結束時，不得渲染該摘要。

#### Scenario: Only completed rounds render the result summary

- **WHEN** 牌局 outcome 為 `in-progress`
- **THEN** 畫面不得顯示結果摘要

##### Example: draw result shows draw reason

- **GIVEN** 一個 `draw` outcome，且 `drawReason = wall-exhausted`
- **WHEN** table view 渲染結果區
- **THEN** 畫面必須顯示該流局原因

<!-- @trace
source: taiwan-mahjong-ui-round-result-sync
updated: 2026-07-14
code:
  - src/views/game/GameView.vue
  - src/core/rules/types.ts
  - src/views/game/selectors.ts
  - src/stores/gameSession.ts
  - src/views/game/types.ts
  - AGENTS.md
  - src/core/types/table.ts
  - src/views/game/components/GameTableView.vue
  - src/core/rules/roundFlow.ts
tests:
  - tests/ui/game-session.store.test.ts
  - tests/core/dealer-progression.test.ts
  - tests/ui/interactive-turn-loop.test.ts
  - tests/ui/round-result-sync.test.ts
  - tests/core/human-self-turn-actions.test.ts
  - tests/ui/human-claim-window.test.ts
  - tests/ui/next-round-flow.test.ts
  - tests/ui/human-self-turn-actions.test.ts
-->

---
### Requirement: AI auto-turn applies legal self-turn actions

當 store 自動推進 AI 回合時，若 AI 座位存在合法自回合動作，必須先套用該動作，再進入後續 discard 或終局，而不是直接忽略。

#### Scenario: Auto-turn applies AI self-turn action before discard

- **WHEN** 一個 AI 座位在自己的 `discard` 階段存在合法自回合候選
- **THEN** store 必須先透過 core 套用該自回合動作

##### Example: AI self-draw win ends the auto-turn loop

- **GIVEN** 一個 AI 座位在自己的回合同時具備合法 `win-self-draw`
- **WHEN** store 自動推進該 AI 回合
- **THEN** round MUST 直接進入 `win` outcome，而不是先走 discard

<!-- @trace
source: taiwan-mahjong-ai-claim-quality-pass
updated: 2026-07-14
code:
  - src/core/ai/decision.ts
  - src/stores/gameSession.ts
  - src/views/game/GameView.vue
  - src/core/rules/types.ts
  - src/core/ai/types.ts
  - src/views/game/components/GameTableView.vue
  - src/core/rules/roundFlow.ts
  - AGENTS.md
  - src/core/types/table.ts
  - src/views/game/selectors.ts
  - src/views/game/types.ts
tests:
  - tests/ui/interactive-turn-loop.test.ts
  - tests/ui/game-session.store.test.ts
  - tests/ui/round-result-sync.test.ts
  - tests/core/dealer-progression.test.ts
  - tests/ui/ai-self-turn-actions.test.ts
  - tests/ui/next-round-flow.test.ts
  - tests/core/human-self-turn-actions.test.ts
  - tests/ui/human-claim-window.test.ts
  - tests/ui/human-self-turn-actions.test.ts
  - tests/core/ai-decision-core.test.ts
-->

---
### Requirement: Mainline playable flow regression coverage

專案必須有一組主線回歸測試，覆蓋當前可玩閉環的主要路徑，而不是只依賴分散的局部測試。

#### Scenario: Mainline regression covers win or draw result sync

- **WHEN** 執行主線回歸測試
- **THEN** 測試必須覆蓋至少一條胡牌或流局終局路徑，並驗證結果摘要有同步到 UI

##### Example: human or AI action reaches a visible terminal summary

- **GIVEN** 一個主線牌局路徑會通往終局
- **WHEN** 測試跑完該路徑
- **THEN** UI 快照 MUST 反映終局結果摘要

<!-- @trace
source: taiwan-mahjong-mainline-regression-pass
updated: 2026-07-14
code:
  - src/views/game/types.ts
  - src/views/game/selectors.ts
  - src/views/game/GameView.vue
  - src/views/game/components/GameTableView.vue
  - src/core/ai/decision.ts
  - src/stores/gameSession.ts
  - src/core/types/table.ts
  - src/core/ai/types.ts
  - src/core/rules/roundFlow.ts
  - src/core/rules/types.ts
  - AGENTS.md
tests:
  - tests/ui/game-session.store.test.ts
  - tests/core/dealer-progression.test.ts
  - tests/core/human-self-turn-actions.test.ts
  - tests/core/ai-decision-core.test.ts
  - tests/core/round-flow-claims.test.ts
  - tests/ui/human-claim-window.test.ts
  - tests/ui/next-round-flow.test.ts
  - tests/ui/mainline-playable-flow.test.ts
  - tests/ui/round-result-sync.test.ts
  - tests/ui/human-self-turn-actions.test.ts
  - tests/ui/interactive-turn-loop.test.ts
  - tests/ui/ai-self-turn-actions.test.ts
-->