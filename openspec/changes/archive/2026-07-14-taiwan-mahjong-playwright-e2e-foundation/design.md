## Context

這個 repo 已經有大量 core / store / component 測試，但缺少真正的 browser E2E。對麻將牌桌這種多步可玩性產品來說，少了真實瀏覽器驗證，就無法有效防止「測試綠但實際玩壞掉」的問題重演。

目前技術環境為 Vite + Vue 3 + Pinia，適合以 Playwright 建立最小 smoke E2E。因為現有 fresh round 是隨機起局，若要穩定驗證宣告後副露同步，需要一個最小測試橋接把畫面帶到可重現的 `claim-window` 場景。

這個 child change 對應主線 board 的目前進行中主線項目，屬於下一個 UI 主線任務的驗證基建。

## Goals / Non-Goals

**Goals:**

- 建立可在本 repo 重跑的 Playwright 基建。
- 補上第一批牌桌 smoke E2E。
- 用真實瀏覽器驗證至少一條人類宣告後的副露同步路徑。

**Non-Goals:**

- 不在這次 change 內做全量 regression suite。
- 不為了 E2E 重構整個 store / route 架構。
- 不把測試橋接暴露成正式產品功能。

## Decisions

### 使用 Playwright 作為標準 browser E2E

這個 repo 的 browser E2E 直接採用 Playwright，不再用 jsdom 整合測試替代真實瀏覽器驗證。Playwright 能直接控制真實瀏覽器，符合你剛加進 AGENTS 的標準。

### 先做 smoke E2E，再擴大覆蓋

第一批只做 2 到 3 條 smoke E2E，避免一次鋪太大：

1. 首頁 / 牌局頁能正常載入
2. fresh round 的真人出牌流程
3. 人類宣告後副露 / 暗手 / 捨牌同步

### 用最小測試橋接穩定重現 claim-window 場景

由於正常隨機起局不保證短時間內遇到特定 `pon` 場景，E2E 需要最小測試橋接來 seed 特定 round 狀態。這個橋接只在明確的 E2E 模式下啟用，不作為正式產品功能。

### 主線 board 只更新 active child change 狀態，不預先打勾主線 task

這個 change 開立後，只更新 `current active child change`。等實作、驗證、archive 完成後，才更新主線 task 為完成。

## Acceptance Criteria

- `npm run test:e2e` 可執行 Playwright 測試。
- 至少一條 E2E 直接從真實瀏覽器驗證牌局頁與真人出牌。
- 至少一條 E2E 驗證人類宣告後副露、暗手與中央捨牌池同步。
- 與這次 change 直接相關的 Spectra analyze / validate 通過。

## Scope Boundaries

**In scope**

- Playwright 安裝與設定
- 最小 E2E script
- 牌桌 smoke E2E
- 測試專用最小橋接

**Out of scope**

- CI workflow
- 全瀏覽器矩陣
- 大量非牌桌頁面 E2E
