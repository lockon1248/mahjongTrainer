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

牌桌 SHALL 在中央桌面同時顯示四家的捨牌池，而不是只顯示捨牌數量。

#### Scenario: 四家捨牌池都可在中央區讀取

- **WHEN** 牌局快照中有一位以上玩家已經捨牌
- **THEN** 牌桌 MUST 在中央桌面渲染每一家的捨牌內容，並保留座位歸屬

##### Example: 混合捨牌張數仍可讀取

| Seat | Discard tiles |
| ---- | ------------- |
| east | `1-character`, `2-character` |
| south | `5-dot` |
| west | none |
| north | `red-dragon`, `east-wind`, `plum` |

- **WHEN** 牌桌渲染這個快照
- **THEN** 中央區域 MUST 顯示四個捨牌池，包含 `west` 的空捨牌池，而不是把資訊折疊成數字統計


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

當 `claim-window` 裁決接受 `chi`、`pon`、`kan-exposed` 時，牌桌 SHALL 顯示宣告者的新副露，且 claimed tile MUST 不再留在觸發者的中央捨牌池中。

#### Scenario: 碰牌後副露與捨牌池同步

- **WHEN** 某位玩家對他家捨牌宣告 `pon` 並被裁決接受
- **THEN** 宣告者的副露區 MUST 顯示新的 `pon` 組合，且被碰的那張牌 MUST 從觸發者捨牌池移除

##### Example: 西風碰牌不再同時留在兩處

- **GIVEN** `east` 對 `north` 打出的 `west-wind` 成功宣告 `pon`
- **WHEN** 牌桌渲染裁決後快照
- **THEN** `east` 的副露區 MUST 顯示包含 `west-wind` 的碰組，且 `north` 的中央捨牌池 MUST NOT 再保留同一張被碰走的 `west-wind`

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
### Requirement: 和牌摘要必須顯示正確台型與總台數

牌桌 UI SHALL 在和牌結果摘要中顯示來自 scoring core 的 `scoringItems` 與 `totalTai`，而不是只顯示和牌座位與結束狀態。

#### Scenario: 榮和結果摘要顯示台數

- **WHEN** 玩家以 `discard-win` 完成合法和牌，且 scoring core 已產生台型與總台數
- **THEN** 結果摘要 MUST 顯示對應的台型明細與 `totalTai`

##### Example: 榮和後顯示實際台數

- **GIVEN** `east` 對 `north` 的捨牌完成和牌，且 scoring core 產生至少一個台型與對應 `totalTai`
- **WHEN** 牌桌渲染本局結果摘要
- **THEN** 玩家 MUST 看得到非空的台型明細與總台數，而不是 `無`

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