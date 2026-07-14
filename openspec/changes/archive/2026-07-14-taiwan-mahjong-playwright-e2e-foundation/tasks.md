## 1. 主線與測試基建對齊

- [x] 1.1 依設計決策「主線 board 只更新 active child change 狀態，不預先打勾主線 task」，將 `taiwan-mahjong-playwright-e2e-foundation` 掛回主線 board 的 `current active child change`。

## 2. Playwright 基建

- [x] 2.1 依設計決策「使用 Playwright 作為標準 browser E2E」，新增 Playwright 依賴、設定檔與 npm scripts。
- [x] 2.2 先寫一條會失敗的 Playwright smoke test，確認目前 repo 尚未具備 browser E2E 驗證能力。

## 3. 牌桌 smoke E2E

- [x] 3.1 依設計決策「先做 smoke E2E，再擴大覆蓋」，補上首頁 / 牌局頁載入與真人 fresh round 出牌的 browser E2E。
- [x] 3.2 依設計決策「用最小測試橋接穩定重現 claim-window 場景」，補上人類宣告後副露 / 暗手 / 中央捨牌池同步的 browser E2E。

## 4. 變更驗證

- [x] 4.1 執行 `npm run test:e2e` 或等效 Playwright 命令，確認新 E2E 可在本 repo 重跑。
- [x] 4.2 執行 `spectra analyze taiwan-mahjong-playwright-e2e-foundation --json` 與 `spectra validate taiwan-mahjong-playwright-e2e-foundation`。
