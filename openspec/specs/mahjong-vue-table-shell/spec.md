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
