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

The table UI SHALL render a compact terminal result row only after the round has ended. A win row SHALL render the authoritative winner, discarder when present, and total tai. A draw row SHALL render the authoritative draw reason. The row MUST NOT render result type, ended status, or a separate scoring trigger.

#### Scenario: Only completed rounds render the result summary

- **WHEN** the round outcome is `in-progress`
- **THEN** the UI MUST NOT render a terminal result row or settlement dialog

##### Example: Draw result shows only required result information

- **GIVEN** a `draw` outcome with `drawReason = wall-exhausted`
- **WHEN** the table view renders the terminal result
- **THEN** the UI MUST show the draw reason, MUST NOT show result type or ended status, and MUST open the unified settlement dialog


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

---
### Requirement: Product-facing game table copy defaults to Traditional Chinese

前端遊戲桌 SHALL 以繁體中文作為預設產品文案語言，且不得直接向玩家暴露 route 路徑、raw enum、內部欄位名或 debug 字樣。

#### Scenario: Game view renders Traditional Chinese page copy

- **WHEN** 使用者開啟牌局頁面
- **THEN** 遊戲頁標題、摘要標籤、玩家欄位與操作按鈕 MUST 顯示繁體中文產品文案，而不是 `/game`、`dealer`、`phase` 這類工程字樣

##### Example: route path is not shown as the page title

- **GIVEN** 使用者進入牌局頁面
- **WHEN** 畫面完成渲染
- **THEN** 頁首 MUST 顯示中文標題，且 MUST NOT 將 `/game` 當成產品標題顯示

#### Scenario: Table values are formatted into player-readable Chinese text

- **WHEN** 遊戲桌渲染座位、階段、宣告、結果與牌張資訊
- **THEN** 畫面 MUST 將這些值格式化為玩家可讀的中文文字，而不是直接輸出 raw domain 值

##### Example: tile id is converted into a readable tile name

- **GIVEN** 人類玩家手牌包含 characters suit 與數字 rank 的牌張
- **WHEN** 手牌按鈕渲染該牌張
- **THEN** 畫面 MUST 顯示對應中文牌名，且 MUST NOT 顯示 `characters-1` 這類內部識別字串

<!-- @trace
source: taiwan-mahjong-ui-zh-tw-default
updated: 2026-07-14
code:
  - src/views/game/GameView.vue
  - src/views/game/components/GameTableView.vue
  - AGENTS.md
tests:
  - tests/ui/game-table-view.test.ts
  - tests/ui/human-claim-window.test.ts
  - tests/ui/round-result-sync.test.ts
  - tests/ui/interactive-turn-loop.test.ts
  - tests/ui/human-self-turn-actions.test.ts
-->

---
### Requirement: 依桌位相對位置呈現牌桌

牌桌 SHALL 將真人玩家固定渲染在桌面下方，其餘三家依桌位相對位置環繞中央桌面，而不是只以資料順序平面排列。

#### Scenario: 真人玩家固定在下方

- **WHEN** 牌桌渲染一個已初始化的牌局
- **THEN** 真人玩家座位 MUST 出現在下方玩家區域，其餘三家 MUST 出現在其餘環繞位置

##### Example: 東家真人玩家維持在下方

- **GIVEN** 真人控制座位為 `east`
- **WHEN** 牌桌渲染目前牌局快照
- **THEN** `east` 玩家 MUST 出現在下方區域，`north` 與 `south` MUST 出現在左右側區域，`west` MUST 出現在上方對家區域


<!-- @trace
source: taiwan-mahjong-table-layout-and-discards
updated: 2026-07-14
code:
  - AGENTS.md
  - src/views/game/types.ts
  - src/core/rules/roundFlow.ts
  - src/views/game/selectors.ts
  - src/views/game/components/GameTableView.vue
tests:
  - tests/ui/game-session.store.test.ts
  - tests/core/round-flow-claims.test.ts
  - tests/ui/game-table-view.test.ts
  - tests/ui/game-table-layout.test.ts
  - tests/ui/human-self-turn-actions.test.ts
  - tests/ui/interactive-turn-loop.test.ts
  - tests/ui/human-claim-window.test.ts
  - tests/ui/repro-next-round-state.test.ts
  - tests/ui/round-result-sync.test.ts
  - tests/ui/next-round-flow.test.ts
-->

---
### Requirement: 中央桌面完整顯示四家捨牌池

The table UI SHALL render one shared central discard pool containing every currently visible unclaimed discard in authoritative chronological order. It MUST NOT render seat headings, per-seat discard counts, or seat markers on discard tiles. The pool SHALL use a fixed-height grid that fits up to 72 visible discards without internal scrolling or increasing the scaled stage height.

#### Scenario: Mixed-seat discards render as one chronological sequence

- **GIVEN** the authoritative discard sequence is [`1-character`, `5-dot`, `red-dragon`]
- **WHEN** the table renders the central discard pool
- **THEN** it MUST show those three tiles from left to right in that order without seat labels or separate seat pools

#### Scenario: Late-round discard accumulation does not shrink the table

- **GIVEN** a reachable round at a fixed desktop viewport progresses from an empty discard sequence to 72 visible tiles
- **WHEN** the fixed central grid renders both states
- **THEN** the stage scale MUST remain unchanged and the pool MUST NOT expose an internal scrollbar


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

---
### Requirement: 真人暗手依台灣麻將順序顯示

牌桌 SHALL 以 `萬 -> 筒 -> 條 -> 風 -> 三元 -> 花` 的順序顯示真人玩家暗手。

#### Scenario: 混合暗手會先分組再顯示

- **WHEN** 真人玩家暗手同時包含數牌、字牌與花牌
- **THEN** 顯示順序 MUST 依序為 `萬`、`筒`、`條`、`風`、`三元`、`花`

##### Example: 混合手牌先依顯示順序整理

- **GIVEN** 真人暗手包含 `7-bamboo`、`east-wind`、`3-character`、`red-dragon`、`2-dot`、`orchid`
- **WHEN** 牌桌渲染這手牌
- **THEN** 顯示順序 MUST 為 `3-character`、`2-dot`、`7-bamboo`、`east-wind`、`red-dragon`、`orchid`


<!-- @trace
source: taiwan-mahjong-table-layout-and-discards
updated: 2026-07-14
code:
  - AGENTS.md
  - src/views/game/types.ts
  - src/core/rules/roundFlow.ts
  - src/views/game/selectors.ts
  - src/views/game/components/GameTableView.vue
tests:
  - tests/ui/game-session.store.test.ts
  - tests/core/round-flow-claims.test.ts
  - tests/ui/game-table-view.test.ts
  - tests/ui/game-table-layout.test.ts
  - tests/ui/human-self-turn-actions.test.ts
  - tests/ui/interactive-turn-loop.test.ts
  - tests/ui/human-claim-window.test.ts
  - tests/ui/repro-next-round-state.test.ts
  - tests/ui/round-result-sync.test.ts
  - tests/ui/next-round-flow.test.ts
-->

---
### Requirement: 副露區與捨牌池必須反映裁決後牌局狀態

When claim resolution accepts `chi`, `pon`, or `kan-exposed`, the table SHALL render the claimant's new meld and MUST NOT retain the claimed triggering tile in the shared chronological discard pool.

#### Scenario: Accepted pon removes the final shared discard

- **GIVEN** the latest shared discard is `west-wind`
- **WHEN** east's legal `pon` is accepted
- **THEN** east's meld area MUST contain the `west-wind` pon and the shared discard pool MUST NOT retain that claimed tile


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

---
### Requirement: 和牌摘要必須顯示正確台型與總台數

The table UI SHALL render `totalTai` from scoring core in the compact win result row and SHALL render structured `scoringItems` inside the unified round-settlement dialog instead of inline within the scaled table stage.

#### Scenario: Winning result opens scoring details

- **WHEN** a legal `discard-win` or self-draw result includes structured scoring items and `totalTai`
- **THEN** the result row MUST show `totalTai` and the UI MUST automatically open the unified dialog containing scoring items and chip allocation

##### Example: Discard win details need no secondary trigger

- **GIVEN** east wins on north's discard and scoring core provides non-empty scoring items
- **WHEN** the terminal result renders
- **THEN** scoring items and total tai MUST already be visible in `本局結算` without `查看台型`


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

---
### Requirement: 流局結果畫面必須支援下一局瀏覽器續局流程

牌桌瀏覽器流程 SHALL 允許玩家在流局結果畫面按下「下一局」後，直接進入新的進行中牌局。

#### Scenario: 玩家在流局結果畫面按下一局

- **WHEN** 畫面顯示流局結果，且玩家點擊「下一局」
- **THEN** 前端 MUST 建立新局並回到進行中狀態，而不是停留在錯誤或上一局結果畫面

##### Example: 流局後下一局成功開始

- **GIVEN** 一個已流局結束的牌桌畫面
- **WHEN** 玩家點擊「下一局」
- **THEN** 畫面 MUST 回到新局進行中狀態，且 MUST NOT 顯示錯誤訊息

<!-- @trace
source: taiwan-mahjong-draw-next-round-e2e-regression
updated: 2026-07-14
code:
  - vite.config.ts
  - src/core/rules/roundFlow.ts
  - src/views/game/e2eBridge.ts
  - src/env.d.ts
  - test-results/.last-run.json
tests:
  - tests/core/ai-decision-core.test.ts
  - tests/ui/game-session.store.test.ts
  - e2e/game-table.smoke.spec.ts
  - tests/core/dealer-progression.test.ts
-->

---
### Requirement: 產品狀態型 UI 必須由明確規則或業務判定驅動

牌桌 UI 上所有會影響玩家判讀的狀態型欄位、標籤、提示與可操作訊息，SHALL 只能顯示來自明確規則、演算法、store 業務判定或已定義 UI state machine 的結果，不得直接暴露未驅動的 placeholder flag 或內部欄位。

#### Scenario: 未驅動的內部旗標不得直接顯示為產品狀態

- **WHEN** 某個畫面欄位只對應到預設值、placeholder state 或尚未接上真實規則的內部欄位
- **THEN** 前端 MUST NOT 以產品狀態文案直接顯示該欄位

##### Example: 聽牌欄位不得直接顯示未驅動的 declaredReady

- **GIVEN** `declaredReady` 目前不是由實際聽牌判定驅動
- **WHEN** 牌桌渲染玩家資訊
- **THEN** 畫面 MUST NOT 把它直接當成 `聽牌：是/否` 的產品狀態顯示

#### Scenario: 狀態型 UI 必須可追溯到規則來源

- **WHEN** 畫面顯示任一會影響玩家決策的狀態
- **THEN** 該狀態 MUST 可追溯到 core rule、scoring result、store 判定或已定義的 UI state machine

##### Example: 每個狀態欄位都有來源分類

- **GIVEN** 一個牌桌畫面上的狀態欄位清單
- **WHEN** 對其進行 UI 真實性稽核
- **THEN** 每個欄位 MUST 被標記為已驅動、未驅動需移除，或待後續規則實作

<!-- @trace
source: taiwan-mahjong-ui-rule-driven-truth-audit
updated: 2026-07-14
code:
  - src/views/game/components/GameTableView.vue
  - AGENTS.md
  - test-results/.last-run.json
tests:
  - tests/ui/game-table-view.test.ts
  - e2e/game-table.smoke.spec.ts
-->

---
### Requirement: 和牌結果摘要 MUST render structured scoring items

The Vue table shell SHALL render winning-result scoring details from structured scoring items supplied by core-derived state, instead of relying on a local string-id mapping table.

#### Scenario: winning summary shows per-item tai breakdown

- **WHEN** the game table snapshot includes a winning result with structured `scoringItems`
- **THEN** the table shell MUST render each item's display label and tai value, along with the final `totalTai`

##### Example: rendered summary shows dealer and self-draw items

- **GIVEN** a result summary containing structured scoring items for `dealer-win` and `self-draw`
- **WHEN** the game table view renders the result summary
- **THEN** the winning panel MUST show both item labels with their tai values and the correct total


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
### Requirement: Vue result summary MUST reflect profile-driven scoring differences without local rule logic

The Vue table shell SHALL reflect profile-driven scoring differences only from the snapshot data it receives, and SHALL NOT re-implement scoring-profile decisions inside selectors or components.

#### Scenario: profile-specific summary is rendered from snapshot data

- **WHEN** two otherwise similar winning snapshots differ only because they were scored under different profiles
- **THEN** the rendered scoring breakdown MUST differ accordingly, while the component continues to use the snapshot data as-is

##### Example: same hand displays different flower scoring by profile

- **GIVEN** two winning result summaries for the same hand with different structured scoring items produced by different scoring profiles
- **WHEN** the table shell renders both snapshots
- **THEN** the visible scoring breakdown MUST follow the provided scoring items without any extra component-side rule branching

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
### Requirement: 中央牌池 claim highlight semantics

牌桌前端在 `claim-window` 期間 SHALL 以合法宣告候選驅動中央牌池高亮語意，明確區分吃牌判讀、碰／明槓插隊判讀與放槍胡牌判讀，而不得再以單一「最新捨牌」樣式混用所有情境。

#### Scenario: 白色高亮只標示可吃的上一手最後一張

- **WHEN** 畫面處於 `claim-window`，且人類合法候選中存在 `chi`
- **THEN** 前端 MUST 只在目前出牌者 discard pool 的最後一張捨牌顯示白色高亮，且不得將其他歷史捨牌標示為可吃目標

##### Example: human can chi the current discard

- **GIVEN** 目前出牌者為 `north`，其 discard pool 最後一張為 `三萬`，且人類合法候選為 `pass` 與 `chi`
- **WHEN** 中央牌池渲染 `north` 的 discard pool
- **THEN** 只有 `三萬` MUST 顯示白色吃牌高亮

#### Scenario: 紅色與黃色高亮依合法插隊候選疊加

- **WHEN** 畫面處於 `claim-window`，且人類合法候選中存在 `pon`、`kan-exposed` 或 `win`
- **THEN** 前端 MUST 將目前出牌者 discard pool 的最後一張捨牌標示為紅色插隊高亮、黃色放槍高亮，或兩者同時存在，且不得互相覆蓋

##### Example: same discard can both interrupt and win

| Legal claim candidates | Expected highlight on current discard |
| ----- | ----- |
| `pass`, `pon` | red |
| `pass`, `win` | yellow |
| `pass`, `pon`, `win` | red + yellow |

#### Scenario: 非 claim-window 或無合法宣告時不得顯示宣告高亮

- **WHEN** 畫面不在 `claim-window`，或人類候選只有 `pass`
- **THEN** 中央牌池 MUST NOT 顯示這次新增的白色、紅色或黃色宣告高亮


<!-- @trace
source: taiwan-mahjong-center-discard-highlight-rules
updated: 2026-07-16
code:
  - test-results/.last-run.json
  - uno.config.ts
  - src/ui/constants/tiles.ts
  - src/views/game/GameView.vue
  - src/stores/gameSession.ts
  - src/views/game/components/GameTableView.vue
  - package.json
  - src/views/game/types.ts
  - src/views/game/constants.ts
  - src/main.ts
  - src/views/game/selectors.ts
  - src/ui/constants/display.ts
  - src/views/game/e2eBridge.ts
  - vite.config.ts
tests:
  - tests/ui/game-session.store.test.ts
  - tests/ui/interactive-turn-loop.test.ts
  - e2e/game-table.smoke.spec.ts
  - tests/ui/game-table-layout.test.ts
  - tests/ui/round-result-sync.test.ts
  - tests/ui/game-table-view.test.ts
-->


<!-- @trace
source: taiwan-mahjong-center-discard-highlight-rules
updated: 2026-07-16
code:
  - src/views/game/e2eBridge.ts
  - src/views/game/components/GameTableView.vue
  - test-results/.last-run.json
  - src/stores/gameSession.ts
  - uno.config.ts
  - vite.config.ts
  - src/ui/constants/display.ts
  - src/views/game/selectors.ts
  - src/ui/constants/tiles.ts
  - package.json
  - src/views/game/constants.ts
  - src/views/game/types.ts
  - src/main.ts
  - src/views/game/GameView.vue
  - AGENTS.md
tests:
  - tests/ui/game-session.store.test.ts
  - tests/ui/human-claim-window.test.ts
  - tests/ui/round-result-sync.test.ts
  - tests/ui/game-table-layout.test.ts
  - tests/ui/interactive-turn-loop.test.ts
  - tests/ui/game-table-view.test.ts
  - e2e/game-table.smoke.spec.ts
-->

---
### Requirement: AI winning proof reveal

當終局結果為 `win` 且和牌者不是人類座位時，牌桌前端 SHALL 亮出該 AI 的實際手牌與副露作為和牌證明，讓玩家可直接檢視其和牌內容，而不得只顯示台型摘要。

#### Scenario: AI discard win reveals the winner hand proof

- **WHEN** 終局結果為 AI 榮和，且 result summary 已指出和牌座位
- **THEN** 畫面 MUST 顯示該 AI 座位的暗手與副露證明區塊

##### Example: north wins on discard

- **GIVEN** 終局結果顯示 `north` 為和牌者、`east` 為放槍者，且 `north` 在當前 snapshot 中仍有暗手與副露資料
- **WHEN** table view 渲染終局結果
- **THEN** 使用者 MUST 能看到 `north` 的和牌證明牌區，而不只有文字結果摘要

#### Scenario: Human win or draw does not show AI proof reveal

- **WHEN** 終局結果不是 AI 和牌，例如人類和牌或流局
- **THEN** 畫面 MUST NOT 額外渲染 AI 和牌證明區塊

##### Example: human win keeps result summary only

| Result type | Winner seat | Expected AI proof reveal |
| ----- | ----- | ----- |
| `win` | `east`（human） | hidden |
| `draw` | none | hidden |

<!-- @trace
source: taiwan-mahjong-center-discard-highlight-rules
updated: 2026-07-16
code:
  - test-results/.last-run.json
  - uno.config.ts
  - src/ui/constants/tiles.ts
  - src/views/game/GameView.vue
  - src/stores/gameSession.ts
  - src/views/game/components/GameTableView.vue
  - package.json
  - src/views/game/types.ts
  - src/views/game/constants.ts
  - src/main.ts
  - src/views/game/selectors.ts
  - src/ui/constants/display.ts
  - src/views/game/e2eBridge.ts
  - vite.config.ts
tests:
  - tests/ui/game-session.store.test.ts
  - tests/ui/interactive-turn-loop.test.ts
  - e2e/game-table.smoke.spec.ts
  - tests/ui/game-table-layout.test.ts
  - tests/ui/round-result-sync.test.ts
  - tests/ui/game-table-view.test.ts
-->


<!-- @trace
source: taiwan-mahjong-center-discard-highlight-rules
updated: 2026-07-16
code:
  - src/views/game/e2eBridge.ts
  - src/views/game/components/GameTableView.vue
  - test-results/.last-run.json
  - src/stores/gameSession.ts
  - uno.config.ts
  - vite.config.ts
  - src/ui/constants/display.ts
  - src/views/game/selectors.ts
  - src/ui/constants/tiles.ts
  - package.json
  - src/views/game/constants.ts
  - src/views/game/types.ts
  - src/main.ts
  - src/views/game/GameView.vue
  - AGENTS.md
tests:
  - tests/ui/game-session.store.test.ts
  - tests/ui/human-claim-window.test.ts
  - tests/ui/round-result-sync.test.ts
  - tests/ui/game-table-layout.test.ts
  - tests/ui/interactive-turn-loop.test.ts
  - tests/ui/game-table-view.test.ts
  - e2e/game-table.smoke.spec.ts
-->

---
### Requirement: Table shell reuses shared presentation labels

The table view SHALL resolve fixed presentation labels through the shared frontend presentation constants so the rendered Chinese copy for tiles, seats, phases, and outcomes stays consistent across the product.

#### Scenario: Game table output remains equivalent after label refactor

- **WHEN** the game table renders a round snapshot that includes tiles, seats, phase text, and result text
- **THEN** the visible Chinese labels MUST match the existing product output even though the mappings are provided by shared constant or enum modules

##### Example: existing table labels remain unchanged

- **GIVEN** a snapshot that includes `east` as dealer, `discard` as phase, `win` as outcome, and tile labels such as `5 dots` and `green dragon`
- **WHEN** the table view renders the snapshot
- **THEN** the UI MUST still display `東家`, `出牌`, `和牌`, `五筒`, and `青發`


<!-- @trace
source: taiwan-mahjong-unocss-and-shared-enums
updated: 2026-07-16
code:
  - src/views/game/e2eBridge.ts
  - package.json
  - src/views/game/components/GameTableView.vue
  - vite.config.ts
  - src/ui/constants/display.ts
  - src/views/game/GameView.vue
  - src/main.ts
  - src/ui/constants/tiles.ts
  - src/views/game/constants.ts
  - uno.config.ts
  - src/views/game/types.ts
  - src/stores/gameSession.ts
  - test-results/.last-run.json
  - src/views/game/selectors.ts
tests:
  - tests/ui/round-result-sync.test.ts
  - tests/ui/interactive-turn-loop.test.ts
  - tests/ui/game-table-layout.test.ts
  - tests/ui/game-session.store.test.ts
  - tests/ui/game-table-view.test.ts
  - e2e/game-table.smoke.spec.ts
-->


<!-- @trace
source: taiwan-mahjong-unocss-and-shared-enums
updated: 2026-07-16
code:
  - src/views/game/components/GameTableView.vue
  - src/views/game/constants.ts
  - package.json
  - uno.config.ts
  - src/ui/constants/display.ts
  - src/main.ts
  - src/views/game/types.ts
  - src/stores/gameSession.ts
  - src/views/game/e2eBridge.ts
  - src/views/game/GameView.vue
  - src/views/game/selectors.ts
  - src/ui/constants/tiles.ts
  - vite.config.ts
  - AGENTS.md
  - test-results/.last-run.json
tests:
  - e2e/game-table.smoke.spec.ts
  - tests/ui/interactive-turn-loop.test.ts
  - tests/ui/game-table-view.test.ts
  - tests/ui/round-result-sync.test.ts
  - tests/ui/game-session.store.test.ts
  - tests/ui/human-claim-window.test.ts
  - tests/ui/game-table-layout.test.ts
-->

---
### Requirement: Table shell styling remains composable under the shared utility layer

The table view SHALL express primary layout, spacing, and state highlight styling through the shared utility styling layer so ongoing UI changes do not require duplicating large page-specific CSS blocks for each new panel state.

#### Scenario: Player panel states can be composed through utility classes

- **WHEN** the table view renders combinations such as dealer badge, active turn highlight, claim-window emphasis, or winning proof sections
- **THEN** those visual states MUST be representable through composable utility classes with only minimal global structural CSS support

##### Example: active and dealer states coexist on one player panel

- **GIVEN** a player panel that is both the dealer and the current acting seat
- **WHEN** the table view renders that panel
- **THEN** the panel MUST preserve both visible states without requiring a separate one-off page CSS variant for that exact combination

<!-- @trace
source: taiwan-mahjong-unocss-and-shared-enums
updated: 2026-07-16
code:
  - src/views/game/e2eBridge.ts
  - package.json
  - src/views/game/components/GameTableView.vue
  - vite.config.ts
  - src/ui/constants/display.ts
  - src/views/game/GameView.vue
  - src/main.ts
  - src/ui/constants/tiles.ts
  - src/views/game/constants.ts
  - uno.config.ts
  - src/views/game/types.ts
  - src/stores/gameSession.ts
  - test-results/.last-run.json
  - src/views/game/selectors.ts
tests:
  - tests/ui/round-result-sync.test.ts
  - tests/ui/interactive-turn-loop.test.ts
  - tests/ui/game-table-layout.test.ts
  - tests/ui/game-session.store.test.ts
  - tests/ui/game-table-view.test.ts
  - e2e/game-table.smoke.spec.ts
-->

<!-- @trace
source: taiwan-mahjong-unocss-and-shared-enums
updated: 2026-07-16
code:
  - src/views/game/components/GameTableView.vue
  - src/views/game/constants.ts
  - package.json
  - uno.config.ts
  - src/ui/constants/display.ts
  - src/main.ts
  - src/views/game/types.ts
  - src/stores/gameSession.ts
  - src/views/game/e2eBridge.ts
  - src/views/game/GameView.vue
  - src/views/game/selectors.ts
  - src/ui/constants/tiles.ts
  - vite.config.ts
  - AGENTS.md
  - test-results/.last-run.json
tests:
  - e2e/game-table.smoke.spec.ts
  - tests/ui/interactive-turn-loop.test.ts
  - tests/ui/game-table-view.test.ts
  - tests/ui/round-result-sync.test.ts
  - tests/ui/game-session.store.test.ts
  - tests/ui/human-claim-window.test.ts
  - tests/ui/game-table-layout.test.ts
-->

---
### Requirement: Dealer badge on all four player panels

The table view SHALL render an explicit dealer badge on the current dealer's player panel so the user can identify the dealer without relying on summary text alone.

#### Scenario: Current dealer panel shows a dealer badge

- **WHEN** the game snapshot identifies one seat as `dealerSeat`
- **THEN** the matching player panel MUST render a dealer badge, and all non-dealer panels MUST NOT render that badge

##### Example: west dealer is visible on the west panel

- **GIVEN** a snapshot with `dealerSeat = west`
- **WHEN** the table view renders the four player panels
- **THEN** only the `west` panel MUST show the dealer badge


<!-- @trace
source: taiwan-mahjong-dealer-rotation-and-turn-pace
updated: 2026-07-16
code:
  - AGENTS.md
  - src/main.ts
  - src/views/game/types.ts
  - src/views/game/GameView.vue
  - src/views/game/selectors.ts
  - vite.config.ts
  - src/views/game/constants.ts
  - uno.config.ts
  - test-results/.last-run.json
  - src/views/game/e2eBridge.ts
  - src/ui/constants/tiles.ts
  - package.json
  - src/views/game/components/GameTableView.vue
  - src/stores/gameSession.ts
  - src/ui/constants/display.ts
tests:
  - e2e/game-table.smoke.spec.ts
  - tests/ui/game-table-layout.test.ts
  - tests/ui/round-result-sync.test.ts
  - tests/ui/game-table-view.test.ts
  - tests/ui/game-session.store.test.ts
  - tests/ui/human-claim-window.test.ts
  - tests/ui/interactive-turn-loop.test.ts
-->

---
### Requirement: Strong active turn highlight on the current player panel

The table view SHALL render a strong panel-level highlight for the current acting seat so the user can tell at a glance which seat is currently drawing or discarding.

#### Scenario: Active player panel follows the current seat

- **WHEN** the snapshot `currentSeat` changes during normal round progression
- **THEN** the corresponding player panel MUST render the active-turn highlight and the previously active panel MUST lose it

##### Example: south active turn moves highlight to south

- **GIVEN** a snapshot with `currentSeat = south` and `phase = discard`
- **WHEN** the table view renders the player panels
- **THEN** the `south` panel MUST render the active-turn highlight


<!-- @trace
source: taiwan-mahjong-dealer-rotation-and-turn-pace
updated: 2026-07-16
code:
  - AGENTS.md
  - src/main.ts
  - src/views/game/types.ts
  - src/views/game/GameView.vue
  - src/views/game/selectors.ts
  - vite.config.ts
  - src/views/game/constants.ts
  - uno.config.ts
  - test-results/.last-run.json
  - src/views/game/e2eBridge.ts
  - src/ui/constants/tiles.ts
  - package.json
  - src/views/game/components/GameTableView.vue
  - src/stores/gameSession.ts
  - src/ui/constants/display.ts
tests:
  - e2e/game-table.smoke.spec.ts
  - tests/ui/game-table-layout.test.ts
  - tests/ui/round-result-sync.test.ts
  - tests/ui/game-table-view.test.ts
  - tests/ui/game-session.store.test.ts
  - tests/ui/human-claim-window.test.ts
  - tests/ui/interactive-turn-loop.test.ts
-->

---
### Requirement: AI auto-turn pacing remains human-readable

The frontend session loop SHALL pace AI-driven turn advancement at an approximately two-second cadence so users can visually follow which seat is currently acting.

#### Scenario: AI discard does not resolve instantaneously

- **WHEN** the current acting seat is AI-controlled and the round is still in progress
- **THEN** the frontend MUST delay the next visible auto-turn advancement by roughly two seconds instead of immediately chaining through the next action

##### Example: south AI turn pauses before discarding

- **GIVEN** a live round where `south` is the current acting seat and no human decision is pending
- **WHEN** the session loop advances through the AI turn
- **THEN** the visible next state MUST appear only after the configured pacing delay

#### Scenario: Human claim windows are not skipped by AI pacing

- **WHEN** an AI discard opens a human-legal `claim-window`
- **THEN** the frontend MUST stop at that claim window and MUST NOT consume the pacing timer to auto-pass on behalf of the human

##### Example: human win opportunity interrupts AI pacing

- **GIVEN** an AI discard produces a `claim-window` where the human has a legal `win` candidate
- **WHEN** the session loop reaches that state
- **THEN** the UI MUST remain on the claim window until the human responds

<!-- @trace
source: taiwan-mahjong-dealer-rotation-and-turn-pace
updated: 2026-07-16
code:
  - AGENTS.md
  - src/main.ts
  - src/views/game/types.ts
  - src/views/game/GameView.vue
  - src/views/game/selectors.ts
  - vite.config.ts
  - src/views/game/constants.ts
  - uno.config.ts
  - test-results/.last-run.json
  - src/views/game/e2eBridge.ts
  - src/ui/constants/tiles.ts
  - package.json
  - src/views/game/components/GameTableView.vue
  - src/stores/gameSession.ts
  - src/ui/constants/display.ts
tests:
  - e2e/game-table.smoke.spec.ts
  - tests/ui/game-table-layout.test.ts
  - tests/ui/round-result-sync.test.ts
  - tests/ui/game-table-view.test.ts
  - tests/ui/game-session.store.test.ts
  - tests/ui/human-claim-window.test.ts
  - tests/ui/interactive-turn-loop.test.ts
-->

---
### Requirement: AI auto-turn progression remains phase-stable

當牌桌由 AI 自動推進回合時，前端 store 與 UI wiring 必須只沿著合法 phase continuity 前進，且不得在仍可繼續的 in-progress 狀態中無故停滯。

#### Scenario: Delayed auto-advance continues until the round requires a stop

- **WHEN** 一個 AI 驅動中的本機 round 仍處於 `in-progress`
- **THEN** 自動推進 MUST 在合法延遲後繼續前進，直到遇到 `claim-window` 人類介入或 `ended` 停止條件

##### Example: AI auto-turn does not stall after the first delayed step

- **GIVEN** 一個尚未結束、且目前不需要人類介入的 AI 自動回合
- **WHEN** 第一個延遲後的 `advanceTurn()` 已完成
- **THEN** 系統 MUST 在後續仍可前進時繼續安排下一步，而 MUST NOT 永遠停在第一個延遲步驟後


<!-- @trace
source: taiwan-mahjong-ai-turn-stability
updated: 2026-07-16
code:
  - src/core/ai/decision.ts
  - src/views/game/constants.ts
tests:
  - tests/ui/interactive-turn-loop.test.ts
  - tests/core/ai-decision-core.test.ts
-->

---
### Requirement: AI auto-turn yields to human claim intervention

當 `claim-window` 對人類座位存在合法候選時，AI 自動推進必須暫停並等待人類決定，而不是繼續略過該視窗。

#### Scenario: Human claim opportunity stops AI auto-advance

- **WHEN** AI 的上一個出牌開啟 `claim-window`，且人類座位存在合法宣告
- **THEN** 自動推進 MUST 停留在該 `claim-window` 狀態直到人類提交選擇或牌局結束

##### Example: claim-window with human win is not auto-skipped

- **GIVEN** AI 捨牌後，人類座位可合法 `win`
- **WHEN** UI / store 評估是否繼續排程自動推進
- **THEN** 系統 MUST 保持在 `claim-window`，且 MUST NOT 自動切往下一家的 `draw`


<!-- @trace
source: taiwan-mahjong-ai-turn-stability
updated: 2026-07-16
code:
  - src/core/ai/decision.ts
  - src/views/game/constants.ts
tests:
  - tests/ui/interactive-turn-loop.test.ts
  - tests/core/ai-decision-core.test.ts
-->

---
### Requirement: AI auto-turn resets cleanly across ended and next-round transitions

當本局結束後，AI 自動推進必須停止；當新的下一局開始時，系統必須以新 round state 重新建立自動推進，而不是沿用舊局殘留狀態。

#### Scenario: New round resumes clean auto-turn after the previous round ended

- **WHEN** 一個 ended round 經由下一局流程切換成新的 in-progress round
- **THEN** 新局的 AI 自動推進 MUST 以新的 round snapshot 為準重新啟動，且 MUST NOT 殘留上一局的 ended 狀態或錯誤排程

##### Example: next round does not inherit ended auto-turn state

- **GIVEN** 一局已顯示結果並允許開始下一局
- **WHEN** 玩家進入下一局
- **THEN** 新 round MUST 回到可正常自動推進的 in-progress 狀態，且 MUST NOT 看起來仍停留在上一局結束狀態

<!-- @trace
source: taiwan-mahjong-ai-turn-stability
updated: 2026-07-16
code:
  - src/core/ai/decision.ts
  - src/views/game/constants.ts
tests:
  - tests/ui/interactive-turn-loop.test.ts
  - tests/core/ai-decision-core.test.ts
-->

---
### Requirement: Concealed kong privacy in table snapshots

The frontend table snapshot SHALL hide another seat's concealed kong tile identities during in-progress play, so the human viewer can see that a concealed kong exists without learning which tile was used.

#### Scenario: Human viewer sees hidden tiles for AI concealed kong

- **WHEN** an AI seat has a concealed kong and the round is still in progress
- **THEN** the table snapshot shown to the human viewer MUST render that meld as hidden tiles or placeholders instead of concrete tile labels

##### Example: south AI concealed kong is masked on the board

- **GIVEN** `south` has a concealed kong of `red-dragon` and the human seat is `east`
- **WHEN** the table view renders an in-progress round snapshot
- **THEN** the `south` meld area MUST indicate a concealed kong exists, but MUST NOT show `red-dragon`

#### Scenario: Owning human seat keeps access to its own concealed kong tiles

- **WHEN** the human seat itself forms a concealed kong
- **THEN** the human-facing snapshot MUST continue to show the real concealed kong tile identities for that seat

##### Example: east human concealed kong stays visible to east

- **GIVEN** `east` is the human seat and has a concealed kong of `5-dot`
- **WHEN** the table view renders the human player's meld area
- **THEN** the meld display MUST still show `5-dot` for `east`

<!-- @trace
source: taiwan-mahjong-concealed-kong-visibility
updated: 2026-07-16
code:
  - src/views/game/components/GameTableView.vue
  - src/views/game/components/MatchSetupModal.vue
  - src/views/game/GameView.vue
  - src/views/game/types.ts
  - src/views/game/constants.ts
  - src/stores/gameSession.ts
  - src/core/rules/roundFlow.ts
  - src/views/game/selectors.ts
tests:
  - tests/ui/game-session.store.test.ts
  - tests/ui/interactive-turn-loop.test.ts
  - tests/core/ai-decision-core.test.ts
  - tests/ui/match-setup-modal.test.ts
  - tests/ui/game-table-layout.test.ts
  - tests/ui/next-round-flow.test.ts
  - tests/ui/round-result-sync.test.ts
  - tests/ui/game-table-view.test.ts
-->

---
### Requirement: Match setup modal uses real session state

The frontend SHALL render a match setup modal driven by session state, so the user can configure initial chips and victory condition before the first round begins.

#### Scenario: User can submit initial chips and victory mode from the modal

- **WHEN** the local game view is opened before a match has started
- **THEN** the frontend MUST show a setup modal that accepts an initial chip amount and exactly one supported victory condition choice

##### Example: user configures bankruptcy mode

- **GIVEN** the setup modal is visible
- **WHEN** the user enters `500` as initial chips and selects bankruptcy victory
- **THEN** submitting the modal MUST start the first round with those match settings


<!-- @trace
source: taiwan-mahjong-match-stakes-and-victory-setup
updated: 2026-07-16
code:
  - src/core/rules/roundFlow.ts
  - src/stores/gameSession.ts
  - src/views/game/GameView.vue
  - src/views/game/constants.ts
  - src/views/game/types.ts
  - src/views/game/components/GameTableView.vue
  - src/views/game/selectors.ts
  - src/views/game/components/MatchSetupModal.vue
tests:
  - tests/ui/game-table-view.test.ts
  - tests/ui/game-table-layout.test.ts
  - tests/core/ai-decision-core.test.ts
  - tests/ui/interactive-turn-loop.test.ts
  - tests/ui/round-result-sync.test.ts
  - tests/ui/game-session.store.test.ts
  - tests/ui/next-round-flow.test.ts
  - tests/ui/match-setup-modal.test.ts
-->

---
### Requirement: Table shell renders real match chip status

The frontend SHALL render match chip status and match-ending summary from authoritative session state, and SHALL NOT expose placeholder chip UI before setup exists.

#### Scenario: Chip status appears only after setup initializes a match

- **WHEN** the user has completed match setup and the session has started
- **THEN** the table shell MUST render chip totals and active match victory mode from real session state

##### Example: configured chips appear on the board

- **GIVEN** the user started a match with `1000` initial chips
- **WHEN** the first round snapshot renders
- **THEN** each seat chip display MUST come from the initialized match state instead of placeholder score text

<!-- @trace
source: taiwan-mahjong-match-stakes-and-victory-setup
updated: 2026-07-16
code:
  - src/core/rules/roundFlow.ts
  - src/stores/gameSession.ts
  - src/views/game/GameView.vue
  - src/views/game/constants.ts
  - src/views/game/types.ts
  - src/views/game/components/GameTableView.vue
  - src/views/game/selectors.ts
  - src/views/game/components/MatchSetupModal.vue
tests:
  - tests/ui/game-table-view.test.ts
  - tests/ui/game-table-layout.test.ts
  - tests/core/ai-decision-core.test.ts
  - tests/ui/interactive-turn-loop.test.ts
  - tests/ui/round-result-sync.test.ts
  - tests/ui/game-session.store.test.ts
  - tests/ui/next-round-flow.test.ts
  - tests/ui/match-setup-modal.test.ts
-->

---
### Requirement: Match setup modal blocks chips below 100

The frontend SHALL block setup submission when the initial chip input is below `100`, so the user cannot accidentally start an unsafe low-chip match from the UI.

#### Scenario: Modal does not submit an unsafe chip value

- **WHEN** the user enters an initial chip amount below `100`
- **THEN** the setup modal MUST NOT emit a submit event

##### Example: 10 chips cannot start a match

- **GIVEN** the setup modal is visible
- **WHEN** the user enters `10` as initial chips and clicks submit
- **THEN** no submit event MUST be emitted

<!-- @trace
source: taiwan-mahjong-match-setup-minimum-chips-guard
updated: 2026-07-16
code:
  - src/views/game/matchSetup.ts
  - src/stores/gameSession.ts
  - src/views/game/components/MatchSetupModal.vue
  - src/views/game/constants.ts
tests:
  - tests/ui/game-session.store.test.ts
  - tests/ui/match-setup-modal.test.ts
-->

---
### Requirement: Match setup modal explains why chips below 100 are blocked

The frontend SHALL explain inside the setup modal why an initial chip amount below `100` cannot start a match, so the user does not get stuck without feedback.

#### Scenario: Modal shows a clear validation message for unsafe chips

- **WHEN** the user enters an initial chip amount below `100` and tries to submit
- **THEN** the modal MUST keep blocking submit and MUST render a clear validation message that explains the minimum is `100`

##### Example: 10 chips shows the blocking reason

- **GIVEN** the setup modal is visible
- **WHEN** the user enters `10` as initial chips and clicks submit
- **THEN** the modal MUST show a message that initial chips cannot be lower than `100`

<!-- @trace
source: taiwan-mahjong-match-setup-validation-feedback
updated: 2026-07-16
code:
  - src/stores/gameSession.ts
  - src/views/game/components/MatchSetupModal.vue
  - src/views/game/matchSetup.ts
  - src/views/game/constants.ts
tests:
  - tests/ui/game-session.store.test.ts
  - tests/ui/match-setup-modal.test.ts
-->

---
### Requirement: Shared discard pool preserves latest-action highlighting

The table UI SHALL treat the final tile in the authoritative shared discard sequence as the only latest discard. During a human claim window, that tile SHALL receive the existing legal-action highlight semantics and all earlier tiles MUST remain unhighlighted.

#### Scenario: Latest discard carries legal claim highlights

- **WHEN** the human has legal `chi`, `pon`, `kan-exposed`, or `win` candidates for the triggering discard
- **THEN** only the final shared discard tile MUST render the corresponding existing white, red, or yellow highlight combination

#### Scenario: Pon-only latest discard uses a red background

- **GIVEN** the human claim window offers `pon` but does not offer `win`
- **WHEN** the shared discard pool renders the triggering final tile
- **THEN** that tile MUST use a red background instead of the generic yellow latest-discard background, and every earlier discard MUST remain neutral


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

---
### Requirement: Human meld remains visible after a claim

The desktop table SHALL keep a newly accepted human meld and the remaining concealed hand completely visible inside the human player panel. Fixed-height desktop track allocation MUST NOT clip or overlap the meld row.

#### Scenario: Accepted pon does not clip the new meld

- **WHEN** the human accepts a legal `pon` at a 2048 by 962 desktop viewport
- **THEN** the complete pon meld and concealed hand MUST remain inside the human panel and viewport without page scrolling


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

---
### Requirement: Compact authoritative table status

The table UI SHALL render one compact status row containing local round, dealer, prevailing wind, phase, remaining wall, and victory condition. It MUST NOT render current operation, last claim, outcome, total discard count, or match stakes in that status area.

#### Scenario: Gameplay status uses the confirmed field set

- **WHEN** the table view renders an active or completed round
- **THEN** exactly the confirmed status concepts MUST remain above the table and the rejected concepts MUST be absent


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

---
### Requirement: Settlement readability across desktop and narrow screens

The game view SHALL keep the table stage at scale 1 when a desktop viewport has sufficient width and height. At those desktop viewports, the table SHALL stretch through the remaining stage height so its bottom edge aligns with the available stage content bottom instead of leaving an unused block below the human player panel. Wide-but-short and narrow viewports SHALL use compact vertical layout and proportional whole-stage fallback scaling when required to keep critical human-hand and action content visible. A teleported settlement dialog MUST NOT contribute to stage measurement. The page MUST remain free of page-level scrolling.

#### Scenario: Desktop settlement remains readable

- **WHEN** a completed win is rendered at a 2048 by 962 desktop viewport
- **THEN** the stage MUST remain unscaled, use the available game width without excessive side margins, and keep the page free of scrollbars

#### Scenario: Desktop table consumes lower whitespace

- **WHEN** an active round is rendered at a 2048 by 962 desktop viewport
- **THEN** the table bottom MUST align with the available stage content bottom while the stage remains at scale 1 and the page remains free of scrollbars

#### Scenario: Narrow viewport retains safe scaling

- **WHEN** the natural stage does not fit a narrow viewport
- **THEN** the game view MUST apply one proportional scale to the stage while keeping the settlement dialog outside that transform

#### Scenario: Wide but short viewport keeps the human hand visible

- **WHEN** an active round is rendered at a 1489 by 658 viewport
- **THEN** the complete human concealed-hand region and action row MUST remain inside the viewport, the page MUST remain free of page-level scrolling, and the layout MUST NOT rely on a width-only forced scale of 1


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

---
### Requirement: Match completion renders final settlement

The table shell SHALL render a full-screen final settlement from authoritative ended match state. It SHALL show the match winner and final chips for all four seats, SHALL hide the round-level next-round action, and SHALL provide `重新開始` to return to existing match setup.

#### Scenario: Bankruptcy completion replaces next round

- **WHEN** bankruptcy settlement changes match status to `ended`
- **THEN** the UI MUST show final settlement, MUST NOT show `下一局`, and MUST allow `重新開始`


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

---
### Requirement: Human concealed tiles use available readable space

The table shell SHALL render human concealed-tile controls with a computed font size of at least 16 pixels and an enlarged hit area while keeping the complete hand inside a 1489 by 658 viewport.

#### Scenario: Enlarged hand remains visible

- **WHEN** a human hand is rendered at 1489 by 658
- **THEN** every concealed-tile control MUST remain inside the viewport and its computed font size MUST be at least 16 pixels


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

---
### Requirement: Development hot updates preserve the game session store contract

The game-session Pinia setup store SHALL accept Vite hot module updates so that an already-created store instance receives newly defined actions without losing the current session state.

#### Scenario: Restart action is added during an active development session

- **GIVEN** the game page already owns a live `game-session` store instance
- **WHEN** Vite hot-replaces the store module with a definition containing `resetMatch`
- **THEN** the existing instance MUST expose `resetMatch` and the hot-updated `GameView` MUST NOT throw a missing-action runtime error


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

---
### Requirement: Every completed round renders authoritative chip allocation

The table shell SHALL automatically render one `本局結算` dialog 1,500 milliseconds after every completed win or draw. Before the delay elapses, the terminal table state SHALL remain visible without the settlement overlay. The dialog SHALL show each seat's signed round delta and post-settlement chips from the session store. A self-draw SHALL show `{winner} 自摸`; a discard win SHALL show `{winner} 和牌｜{discarder} 放槍`; a draw SHALL show only its authoritative draw reason and MUST NOT show a win/loss outcome line. At a 1489 by 658 desktop viewport, the complete dialog content SHALL be visible at once without internal or page-level scrolling. The dialog MUST NOT calculate payment amounts in the component and MUST NOT expose a separate `查看台型` action.

#### Scenario: Settlement waits before covering the terminal table

- **WHEN** a win or draw result becomes terminal
- **THEN** the settlement dialog MUST remain absent for the first 1,500 milliseconds and MUST become visible after that delay

#### Scenario: Zero-tai discard win still transfers the base stake

- **GIVEN** a discard win has `totalTai = 0`, base stake 30, winner south, and discarder west
- **WHEN** the store settles the round
- **THEN** the dialog MUST show `南家 和牌｜西家 放槍`, south `+30`, west `-30`, east and north `±0`, together with all four post-settlement balances

#### Scenario: Self-draw identifies the winner without a discarder

- **GIVEN** a self-draw result whose winner is north and whose discarder is absent
- **WHEN** the settlement dialog becomes visible
- **THEN** the dialog MUST show `北家 自摸` and MUST NOT show `放槍`

#### Scenario: Draw shows balances without tai details

- **WHEN** a draw completes without chip transfer
- **THEN** the dialog MUST show the draw reason, MUST NOT show a win/loss outcome line, MUST NOT show total tai or scoring items, and MUST show all four seats with `±0` and unchanged balances

#### Scenario: Short desktop shows the complete dialog without scrolling

- **GIVEN** a completed win with outcome text, tai details, four chip settlement rows, and a next or restart action
- **WHEN** the settlement dialog is rendered in a 1489 by 658 desktop viewport
- **THEN** every dialog section and action MUST be inside the viewport, the dialog content MUST NOT have vertical overflow, and the page MUST NOT have a scrollbar

#### Scenario: Settlement action follows match status

- **WHEN** the completed round leaves the match in progress
- **THEN** the dialog MUST offer `下一局`
- **WHEN** the completed round ends the match
- **THEN** the dialog MUST offer `重新開始` and MUST NOT offer `下一局`

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