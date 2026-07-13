## Context

核心層目前已完成 baseline 規則、scoring、round flow、rule config 與中階 AI，已經符合先前 `vue-scaffold-boundary` 中「規則核心有可依附介面後才啟動 Vue scaffold」的條件。現在進入 `階段 4`，首要目標不是一次做完完整牌桌互動，而是建立一個穩定的 Vue app shell，證明 store 與 view 能消費 core 狀態而不反向污染 core 邊界。

目前 repo 還沒有正式的 `src/main.ts`、`App.vue`、router、Pinia store 或 `GameTableView`。這代表即使核心邏輯已完成，也沒有瀏覽器層的實際承接點。這次 change 要先把這個殼層建立起來，並刻意維持唯讀與低互動，以降低 UI 早期把規則邏輯帶偏的風險。

## Goals / Non-Goals

**Goals:**

- 建立 Vue app scaffold、router 與 Pinia session skeleton。
- 建立 `GameTableView` 的牌桌 shell，能映射 core round state 到唯讀桌面畫面。
- 明確維持 store / view 與 core 的責任邊界，避免在 Vue 層自行判定規則。
- 建立足夠的 smoke / component 測試，確保 app shell、router 與牌桌基本畫面可載入。

**Non-Goals:**

- 不做完整互動牌桌、拖曳打牌、動畫、音效、教學提示。
- 不把胡牌、吃碰槓、補花等合法性判定搬到 store 或 view。
- 不做多人同步、持久化、回放或登入系統。

## Decisions

### Start with a read-only table shell before interactive actions

先做唯讀牌桌 shell，讓使用者能看見四家、手牌區、捨牌區、局面資訊與目前輪到誰，但互動行為暫時保持最小。這能先驗證資料流與版面骨架，再逐步加入動作入口。替代方案是直接做可打牌 UI，但那會在殼層未穩時把互動複雜度一起放大。

### Keep Pinia as an orchestration layer only

Pinia store 只負責 session 狀態協調、初始化牌局、呼叫 core API 與保存目前 round snapshot。替代方案是把部分規則判定搬進 store 簡化 UI 開發，但那會直接違反既有 core 邊界。

### Route-level views first, presentational components second

先把 `home` 與 `game` 路由頁建立清楚，再從 `GameTableView` 拆出必要的顯示元件。這樣可以先確保導航、應用進入點與頁面責任清楚。替代方案是先堆很多小元件，但在沒有 route / store 骨架時容易過早碎片化。

### Surface core state directly instead of inventing UI-only mirrors

第一版 table shell 應儘量直接映射 core round state 與 player state，不先創造大量 UI-only mirror shape。替代方案是先定一套前端自有資料模型，但那會增加轉換層與 drift 風險。

## Implementation Contract

**Behavior**

- 使用者開啟應用時，必須能進入一個可載入的 Vue app shell。
- router 必須至少提供 home 與 game 兩個基本進入點。
- `GameTableView` 必須能顯示由 store 初始化的牌局唯讀狀態，包括目前座位資訊、玩家區塊、局面摘要與回合資訊。
- store 必須透過 core API 初始化牌局與保存目前 snapshot，而不是自行產生規則結果。

**Interface / data shape**

- `src/main.ts`、`src/App.vue`、`src/router/`、`src/stores/`、`src/views/home/`、`src/views/game/` 需建立明確入口。
- Pinia store 至少需暴露：建立新局、目前 round state、目前結果摘要、初始化狀態。
- `GameTableView` 至少需消費：players、table、currentSeat、phase、outcome 等唯讀狀態。
- 若 core round state 需要 UI-safe read model，必須由 core 或 thin selector 提供，不由 component 臨時重組規則資料。

**Failure modes**

- 若牌局初始化失敗，store 必須保存明確錯誤狀態，而不是靜默顯示空桌。
- 若 router 無法解析預設路徑，應用不得進入空白頁。
- component 不得在缺少規則資料時自行猜測補值來假裝一局正在進行。

**Acceptance criteria**

- smoke / component 測試可驗證 app shell、router 與 `GameTableView` 成功載入。
- `npm test -- --run tests/smoke tests/ui` 或等效測試必須通過。
- `npm run typecheck` 必須通過。
- `spectra analyze taiwan-mahjong-vue-table-shell --json` 必須通過。

**Scope boundaries**

- In scope: Vue scaffold、router、Pinia skeleton、唯讀 table shell、必要 UI 測試。
- Out of scope: 高互動牌桌、動作動畫、規則判定搬移、持久化、多人功能。

## Risks / Trade-offs

- [Risk] 唯讀 shell 可能看起來功能感較弱。 → Mitigation: 先驗證資料流與邊界，再逐步加互動。
- [Risk] store 若偷帶規則邏輯，後續會再次分層混亂。 → Mitigation: 嚴格限制 store 只做 orchestration。
- [Risk] UI 若過早創造 mirror models，會與 core state drift。 → Mitigation: 優先直接映射 core round snapshot。
- [Trade-off] 專案採 `typescript@7`（原生編譯器），而 `vue-tsc@3.3.7`（目前最新）仍以改寫 `tsc.js` 的方式運作，無法支援 TS7，導致原本的 `vue-tsc` typecheck 無法執行。 → Decision: `npm run typecheck` 暫改為純 `tsc --noEmit`，只涵蓋 `.ts`，`.vue` SFC 型別檢查暫時延後；`.vue` 匯入以 `src/env.d.ts` 的 `declare module '*.vue'` shim 解析。待 `vue-tsc` 支援 TS7 後再恢復 SFC 型別檢查。
