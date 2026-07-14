## Context

目前主線牌桌已經能做到：人類固定操作 `east` 打牌，AI 三家會自動摸打，`claim-window` 會由 store 自動蒐集 AI 決策後裁決。這讓牌局能順利推進，但也帶來一個主線缺口：當人類本來就有合法的 `chi`、`pon`、`kan-exposed`、`win` 機會時，系統會直接把人類視為 `pass`，使產品仍不符合「可完整進行基本牌局流程」。

現有 `round-flow core` 只提供 `discardTile()`、`resolveClaimWindow()` 等狀態轉換函式，尚未提供「某一座位在當前 `claim-window` 下有哪些合法宣告候選」的邊界。若直接在 store 或 component 內自行推導這些候選，會違反既有分層要求。因此這個 change 的關鍵不是新增新規則，而是把「合法宣告候選」整理成可供 UI / store 消費的 core 邊界，並讓 store 在需要人類宣告時暫停自動推進。

## Goals / Non-Goals

**Goals:**

- 讓 core 提供可供人類 UI 消費的合法宣告候選。
- 讓 store 在人類擁有合法宣告時停在 `claim-window`，等待人類選擇而不是自動 `pass`。
- 讓牌桌畫面提供最小宣告入口，支援 `pass`、`chi`、`pon`、`kan-exposed`、`win`。
- 維持 AI 自動宣告與既有回合迴圈，不把規則判定搬進前端層。

**Non-Goals:**

- 不做人類自回合的暗槓、加槓、自摸胡操作入口。
- 不做複雜宣告動畫、計時器、快捷鍵或多層 modal。
- 不處理未定案規則，如搶槓、特殊胡、封頂、流局查聽。

## Decisions

### Core 提供可直接消費的人類宣告候選

合法宣告候選由 `src/core/rules` 提供，輸出對應當前 `pendingActionWindow` 與指定座位的可選動作集合。這樣 store 與 UI 只讀取候選，不自行判斷牌型。替代方案是讓 store 直接分析手牌與捨牌，但那會讓規則邊界再次漂移到 Pinia。

### Store 在 claim-window 對人類暫停自動推進

`advanceTurn()` 在 `claim-window` 若發現人類有合法候選，必須停下並暴露 `availableHumanClaims`。替代方案是讓 UI 自己輪詢 `round` 來猜何時該停，但那會讓 view 必須理解階段機。

### 人類宣告 UI 採最小按鈕列

牌桌只顯示目前合法候選的按鈕列或區塊，不建立新 route，也不導入複雜 dialog 流。替代方案是做完整宣告面板，但這會把這個主線 change 擴得太大。

### AI 與人類宣告在 store 內一次合併裁決

當人類選擇某個宣告後，store 仍然同一次蒐集 AI 宣告，再將所有宣告交給 `resolveClaimWindow()`。替代方案是先裁人類、再裁 AI，但那會偏離 core 既有的單一 claim window 模型。

## Implementation Contract

**Behavior**

- 當牌局進入 `claim-window` 且人類座位存在合法宣告時，store 必須停止自動推進並暴露人類可選的宣告候選。
- 人類可在牌桌畫面中選擇 `pass`、`chi`、`pon`、`kan-exposed` 或 `win` 中目前合法的動作；點擊後由 store 與 AI 宣告一併交 core 裁決。
- 若人類沒有任何合法宣告，既有 AI 自動裁決路徑必須維持原樣，不可卡住。
- 畫面必須反映宣告結果與回合進展，包括 `phase`、`currentSeat`、`lastClaimResolution` 與 `outcome`。

**Interface / data shape**

- `gameSession` store 至少新增對外暴露：`availableHumanClaims`、`submitHumanClaim(actionType)`。
- `availableHumanClaims` 為來自 core 的候選資料，不得由 component 自組規則。
- `GameTableView` 或其子區塊必須透過 props / emits 接收候選並送出宣告意圖，維持 props down / events up。
- `round-flow core` 至少需提供一個可由 store 呼叫的 helper，用來取得指定座位在當前 `claim-window` 下的合法候選。

**Failure modes**

- 若 claim candidate helper 與 `resolveClaimWindow()` 對合法性判斷不一致，必須以測試擋下，避免 UI 顯示可按卻在送出時丟錯。
- 若 store 在人類有候選時仍繼續自動推進，視為主線錯誤，必須被 store 測試覆蓋。
- 若人類送出非法宣告，store 必須保存 error 且不得清空既有 `round`。

**Acceptance criteria**

- `tests/core/human-claim-candidates.test.ts` 驗證 `chi`、`pon`、`kan-exposed`、`win`、`pass` 候選產生。
- `tests/ui/game-session.store.test.ts` 驗證人類有合法候選時 `advanceTurn()` 會停在 `claim-window`，以及送出 `submitHumanClaim()` 後牌局繼續推進。
- `tests/ui/human-claim-window.test.ts` 驗證畫面只顯示合法宣告按鈕，點擊後會把宣告意圖送往 store。
- `npm test -- --run tests/core/human-claim-candidates.test.ts tests/ui/game-session.store.test.ts tests/ui/human-claim-window.test.ts tests/ui`
- `npm run typecheck`
- `spectra analyze taiwan-mahjong-human-claim-window --json`

**Scope boundaries**

- In scope: 人類 `claim-window` 宣告候選、store 暫停 / 送出邏輯、最小宣告 UI、對應 core/store/UI 測試。
- Out of scope: 暗槓 / 加槓 / 自摸胡的自回合 UI、結算詳情面板、規則定案擴充、動畫音效。

## Risks / Trade-offs

- [Risk] `chi` 的候選組合可能不只一種，若資料形狀設計過於簡化，UI 會無法選擇具體組合。 → Mitigation: 候選資料需保留 `consumedTiles` 或等價資訊。
- [Risk] store 暫停條件若寫錯，會造成回合卡死或跳過人類。 → Mitigation: 用 store 測試覆蓋「有人類候選」與「無人類候選」兩條路徑。
- [Trade-off] 先只補 `claim-window`，不補自回合的暗槓 / 自摸 UI。 → 好處是主線能先補齊最明確缺口，避免把下一個 change 做成過大雜燴。
