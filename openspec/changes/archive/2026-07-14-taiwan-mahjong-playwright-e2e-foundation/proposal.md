## Why

依最新 workflow，影響可玩性、多步玩家流程與真實瀏覽器互動的牌桌 change，預設驗證標準必須是 browser E2E。這個 repo 目前只有 Vitest / jsdom 測試與等效整合測試，還沒有真正的 Playwright E2E 基建，因此無法用真實瀏覽器重跑牌桌主線。

這個 change 的目的，是為本專案建立最小可用的 Playwright E2E 基礎設施，並先覆蓋牌桌主線中最常出問題的真實玩家流程。

## What Changes

- 新增 Playwright 依賴、設定與 npm scripts。
- 建立最小可用的 E2E 測試目錄與執行流程。
- 為牌桌建立第一批 smoke E2E，至少覆蓋：
  - 應用啟動與牌局頁載入
  - 真人從 fresh round 出牌
  - 真人宣告後副露 / 暗手 / 中央捨牌池同步
- 在必要時加入最小測試專用橋接，讓 Playwright 能把牌局帶到可穩定重現的宣告場景。

## Non-Goals

- 不一次補齊所有牌局回合的完整 E2E 覆蓋。
- 不在這次 change 內新增與 E2E 無關的產品功能。
- 不導入第二套測試框架。

## Capabilities

### New Capabilities

- (none)

### Modified Capabilities

- (none)

## Impact

- Affected specs: (none)
- Affected code:
  - Modified: `package.json`
  - Modified: `package-lock.json`
  - Modified: `openspec/changes/taiwan-mahjong-mainline-progress-board/design.md`
  - Modified: `openspec/changes/taiwan-mahjong-mainline-progress-board/tasks.md`
  - Modified: `src/env.d.ts`
  - Modified: `src/views/game/GameView.vue`
  - New: `src/views/game/e2eBridge.ts`
  - New: `playwright.config.ts`
  - New: `e2e/game-table.smoke.spec.ts`
