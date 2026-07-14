## Context

目前 `round flow core` 會在胡牌或流局時產生 `RoundResult`，其中已包含 `winnerSeat`、`discarderSeat` 與流局 unresolved 標記；但 `table.dealerSeat`、`table.prevailingWind` 仍只在單一局內存在，沒有「上一局結束後如何推到下一局」的明確 API。`gameSession` 也只知道如何 `startLocalRound()`，不知道如何從既有終局狀態建立下一局。

baseline 已定案的莊家規則只有兩條：

- 莊家胡牌時可連莊
- 閒家胡牌時，下家坐莊

流局是否連莊與查聽仍未定案，因此這個 change 不能把流局後莊家流程寫死。它只能讓流局維持明確終局，並保留 unresolved 邊界。

## Goals / Non-Goals

**Goals**

- 提供由終局狀態建立下一局 baseline round 的 core 入口
- 將已定案的莊家規則接進下一局初始化
- 讓 store / UI 能在終局後建立下一局
- 流局時不猜測未定案規則，僅維持終局並保留 unresolved

**Non-Goals**

- 不實作流局後是否連莊
- 不實作 ready-hand check / payment
- 不實作完整圈風輪替賽制
- 不補結果詳情面板

## Decisions

### Core 提供下一局初始化入口

下一局的莊家 / 圈風推導必須由 core 提供，store 不得直接自己算 seat 流轉。

### 只實作已定案的 win 後莊家流程

當上一局是 `win`：

- 若 `winnerSeat === dealerSeat`，下一局維持原莊家
- 若 `winnerSeat !== dealerSeat`，下一局由贏家下家坐莊

這裡直接遵守 baseline，不額外推論其他桌規。

### 流局只保留終局，不推導下一局莊家

當上一局是 `draw`，因為 baseline 未定案流局是否連莊與查聽，所以 session 只能保留終局；若 UI 顯示下一局入口，也必須由 store 依 core 回報為不可建立或回傳明確 error，而不是自動建立下一局。

### UI 採最小結果操作入口

這次只需要最小的「下一局」按鈕或等價入口，條件是目前牌局已結束。是否可建立下一局由 store 決定，而不是 view 自行判斷規則。

## Implementation Contract

**Behavior**

- 當上一局為胡牌終局時，呼叫端可透過 core 建立下一局 baseline round，並套用已定案的莊家規則。
- 當上一局為流局終局時，core / store 不得猜測連莊或查聽結果；若嘗試建立下一局，必須保留明確不可決定的邊界。
- store 必須暴露一個由終局建立下一局的入口。
- UI 必須只送出「開始下一局」意圖，不在 component 內直接改 round state。

**Interface / data shape**

- `round-flow core` 至少新增一個由已結束牌局建立下一局的 helper
- `gameSession` 至少新增 `startNextRound()` 或等價 action
- snapshot / view model 若需要顯示結果後操作狀態，必須由 selector 映射，不在 view 內推導

**Failure modes**

- 若上一局為流局且後續規則未定案，建立下一局不得靜默成功
- 若閒家胡牌後下一局莊家不是贏家下家，視為主線錯誤
- 若莊家胡牌後未連莊，視為主線錯誤

**Acceptance criteria**

- `tests/core/dealer-progression.test.ts` 驗證莊家胡牌連莊與閒家胡牌下家坐莊
- `tests/ui/game-session.store.test.ts` 或新 store 測試驗證終局後可建立下一局，且流局路徑不猜測後續規則
- `tests/ui/next-round-flow.test.ts` 驗證畫面只在終局時顯示下一局入口，且點擊後把意圖送往 store
- `npm test -- --run tests/core/dealer-progression.test.ts tests/ui/next-round-flow.test.ts tests/ui/game-session.store.test.ts tests/ui`
- `npm run typecheck`
- `spectra analyze taiwan-mahjong-draw-outcome-and-dealer-flow --json`

**Scope boundaries**

- In scope: 已定案 win 後莊家流程、下一局初始化入口、store action、最小 UI 入口、對應測試
- Out of scope: 流局後是否連莊、ready-hand check/payment、整場賽制

## Risks / Trade-offs

- [Risk] 若直接在 store 內算下一局莊家，之後桌規一變就會產生 core / store 漂移。 → Mitigation: 莊家推導必須在 core。
- [Risk] 流局後若錯把 unresolved 當成可建立下一局，會把未定案桌規寫死。 → Mitigation: draw 路徑明確回報不可決定。
- [Trade-off] 這次只做最小結果操作入口，不做完整結果畫面。 → 好處是先補主線流程閉環，不把 UI scope 膨脹到第 7 段。
