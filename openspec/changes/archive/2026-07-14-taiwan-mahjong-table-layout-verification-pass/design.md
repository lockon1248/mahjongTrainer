## Context

`taiwan-mahjong-table-layout-and-discards` 這個 UI change 已經用 core、store、component 測試驗證了版面與狀態同步，但依最新 `Per-Change Verification Rule`，這類涉及可玩性與多步玩家流程的 change，還需要一條 E2E 或等效真實流程驗證。

目前 repo 沒有 Playwright 或其他 browser E2E 基礎設施，因此這次採用最小可重跑的等效真實流程驗證：透過 `GameView` + `Pinia store` + `core round flow` 的整合測試，從 UI 事件出發，驗證 claim resolution 後的副露、暗手與中央捨牌池狀態會一路同步到畫面。

這個 child change 對應主線 board 的目前進行中項目，屬於「下一個 UI 主線任務」中的驗證補強工作。

## Goals / Non-Goals

**Goals:**

- 讓 `taiwan-mahjong-table-layout-and-discards` 擁有一條可重跑的多步流程驗證。
- 驗證路徑必須從 UI 事件出發，而不是只改 snapshot 假資料。
- 驗證結果必須同時覆蓋副露區、暗手數量與中央捨牌池同步。

**Non-Goals:**

- 不導入新的 E2E framework。
- 不新增新的牌桌功能。
- 不改寫已存在的 archived change 內容。

## Decisions

### 以等效真實流程整合測試補足 E2E 缺口

因為 repo 目前沒有 Playwright 或 browser E2E 基礎設施，這次不為了單一驗證臨時引入整套新工具。改以 `GameView` 掛載後透過 UI 事件操作、讓 store 經過 core 轉換，再回到 view 渲染結果的整合測試，作為等效真實流程驗證。

### 驗證必須覆蓋宣告後的三個同步面

這次補的流程驗證不能只看某一個欄位。至少要同時驗證：

1. 宣告者的副露區出現新組合
2. 宣告者暗手已移除 consumed tiles
3. 觸發者中央捨牌池已移除 claimed tile

### 主線 board 只更新狀態欄位，不預先打勾主線 task

這次會把 `current active child change` 更新成這個 verification change，但不會因為 change 已開立就打勾主線 task。主線 task 仍要等這個 child change 完成、驗證、archive 後才能勾。

## Acceptance Criteria

- `tests/ui/mainline-playable-flow.test.ts` 或等效整合測試新增一條從 UI 觸發 claim 的多步流程驗證。
- 測試中能直接觀察到副露區、暗手與中央捨牌池同步。
- 與此 change 直接相關的測試命令可重跑且通過。

## Scope Boundaries

**In scope**

- 既有 UI change 的驗證稽核
- 一條等效真實流程整合測試
- 主線 board 的 active child change 狀態更新

**Out of scope**

- 新 UI spec
- 新功能實作
- Playwright / browser E2E 基建
