## Context

目前 round flow 已支援胡牌後下一局初始化，但規格還停留在單局 MVP 視角：它只明確寫出莊家胡牌連莊與閒家胡牌下家接莊，沒有把「玩家不再永恆停在東風第一局」這件事提升成完整持續賽局語意。UI 也雖然有 active panel 與摘要欄位，但玩家仍容易只看到四家面板而搞不清楚現在的莊家是誰、輪到哪一家出牌；而 AI 的自動出牌節奏太快，使這個辨識問題被放大。

這次 change 橫跨 core 賽局規則與 Vue 殼層互動節奏，因此需要用同一份 design 把「規則如何定義」與「畫面如何明確表達」綁在一起。

## Goals / Non-Goals

**Goals:**

- 讓輪莊 / 連莊成為權威規格中的持續賽局行為，而不是單局偶然結果。
- 讓四家牌框中能穩定顯示莊家旗標。
- 讓當前出牌者的牌框具備更強的高亮辨識。
- 讓 AI 自動推進維持約兩秒的可閱讀節奏。

**Non-Goals:**

- 不在這一輪引入圈數結束、南風局 / 西風局整場結束條件。
- 不新增 AI 思考動畫、倒數計時器或音效。
- 不改動吃碰槓胡的合法性規則。
- 不重做整個牌桌版型。

## Decisions

### 以局間輪莊規則作為持續賽局最小閉環

本輪只把已在 baseline 可定義的最小賽局閉環落地：莊家胡牌連莊、閒家胡牌下家接莊、流局原莊續莊。暫不擴大到圈數輪轉與整場結束條件，避免一次把整個 match engine 也做進來。

### 莊家旗標與當前出牌者高亮都直接由 snapshot 驅動

UI 不自行推算莊家或目前輪到誰，而是完全依據 snapshot 內既有的 `dealerSeat`、`currentSeat`、`phase` 與玩家相對位置決定展示。這樣視覺強化仍屬 view-only 映射，而不是第二套規則來源。

### AI 出牌節奏由 store 推進層節流，而不是 core 改成 async 規則

AI 兩秒節奏屬互動層需求，不應污染 core 的純函式 round flow。因此節流應落在 `gameSession` 或等價前端推進層：core 繼續同步回傳下一狀態，store 決定何時再呼叫下一步推進。

## Implementation Contract

### Task 1: 持續賽局的輪莊 / 連莊規格

- Observable behavior:
  - 胡牌或流局後建立下一局時，不會永遠停留在初始東家局；莊家胡牌連莊、閒家胡牌下家接莊、流局原莊續莊都成為可驗證行為。
- Interface / data shape:
  - round flow next-round 邊界必須明確消費上一局 outcome、winnerSeat 與 dealerSeat，輸出下一局 `dealerSeat`。
- Failure modes:
  - 若未來圈數規則仍未納入，本 change 不得自行發明整場結束條件。
- Acceptance criteria:
  - `tests/core/dealer-progression.test.ts` 與 `tests/ui/next-round-flow.test.ts` 能覆蓋三種局間流轉。
- Scope boundaries:
  - 只處理莊家流轉，不處理圈風前進與半莊 / 一將結束。

### Task 2: 莊家旗標與當前出牌者強高亮

- Observable behavior:
  - 四家牌框中可直接看見目前莊家，且當前出牌者的牌框高亮強度足以不靠上方摘要辨識。
- Interface / data shape:
  - `GameTableView` 或其 view model 必須能穩定判斷每個 seat 是否為 dealer、是否為目前 active discarder / turn owner，並對應到穩定的 DOM class 或 data attribute。
- Failure modes:
  - 不得把「莊家」與「目前輪到」混成同一個標記，也不得在人類非當前回合時仍錯標人類面板為 active。
- Acceptance criteria:
  - `tests/ui/game-table-view.test.ts` 能驗證莊家旗標與 active panel state。
- Scope boundaries:
  - 只做牌框層級的可視提示，不新增全局浮層。

### Task 3: AI 約兩秒出牌節奏

- Observable behavior:
  - 當輪到 AI 連續摸打或宣告後續推進時，畫面不會瞬間跳過，而是以約兩秒節奏前進到下一個 AI 動作。
- Interface / data shape:
  - store 推進 API 必須允許下一步推進以 timer / scheduler 方式延後，而不更改 core round flow 的同步介面。
- Failure modes:
  - 不得因節流而讓人類 claim-window 被跳過，或讓已結束局面繼續排入下一步 AI 推進。
- Acceptance criteria:
  - `tests/ui/interactive-turn-loop.test.ts` 與 `e2e/game-table.smoke.spec.ts` 能驗證 AI 節奏與人類可讀性。
- Scope boundaries:
  - 只控制前端自動推進節奏，不新增可配置速度選單。

## Risks / Trade-offs

- [只做輪莊不做整場圈數，可能讓賽局仍沒有完整終點] → 先把 MVP 後最小閉環補齊，將圈風輪轉留給下一個更大 change。
- [AI 節奏變慢會讓 smoke e2e 變長] → 測試層用 fake timers 或穩定等待策略驗證節流契約，不把真實 2 秒全部硬等進 unit tests。
- [莊家旗標與 active 高亮若樣式太接近會混淆] → 將兩者視為不同語意：莊家是持續狀態，active 是當前輪次狀態。

## Open Questions

- 目前沒有；AI 節奏需求已定為約兩秒級。
