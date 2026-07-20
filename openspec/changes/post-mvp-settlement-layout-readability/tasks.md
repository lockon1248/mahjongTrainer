## 1. 元件行為回歸

- [x] 1.1 以 RED 元件測試鎖定 **Compact authoritative table status** 與 **Use one compact status row and one terminal result row**：只保留六個狀態概念，和牌列只保留 winner、discarder、total tai、`查看台型`，流局只保留原因；執行 `nvm use 22 && npm test -- tests/ui/game-table-view.test.ts tests/ui/round-result-sync.test.ts` 必須先因現況多餘欄位而失敗。
- [x] 1.2 以 RED 元件測試鎖定 **Round result summary rendering**、**和牌摘要必須顯示正確台型與總台數** 與 **Render win scoring details in a teleported UI-only dialog**：和牌自動開啟、可關閉、可由 `查看台型` 重開且流局不開啟；同一 Vitest 命令必須先因缺少 dialog 行為而失敗。

## 2. 精簡資訊與臺型彈窗

- [x] 2.1 在 `src/views/game/components/GameTableView.vue` 實作單列狀態與終局結果列，使已拒絕欄位不再渲染、所有保留值仍來自既有 snapshot；以 1.1 的 targeted Vitest exit 0 驗證 **Compact authoritative table status** 與 **Use one compact status row and one terminal result row**。
- [x] 2.2 在 `src/views/game/components/GameTableView.vue` 實作本地 open/close state 與 `Teleport` dialog，使 win 自動開啟、close/reopen 使用相同 structured scoring data、draw 不開啟；以 1.2 的 targeted Vitest exit 0 驗證 **Render win scoring details in a teleported UI-only dialog**、**UI state and data boundaries** 與 **Failure and fallback behavior**。

## 3. 桌機可讀性與窄螢幕 fallback

- [x] 3.1 以 RED browser regression 鎖定 **Settlement readability across desktop and narrow screens**、**Keep desktop layout unscaled and reserve proportional scaling for narrow screens** 與 **Protect behavior with component and browser regressions**：2048x962 結算 stage scale 必須為 1、有效利用寬度且無 page scrollbar，窄螢幕仍可縮放；執行 `nvm use 22 && npm run test:e2e -- e2e/game-table.smoke.spec.ts` 必須先因桌機 height-driven scale 而失敗。
- [x] 3.2 調整 `src/views/game/GameView.vue` 與既有局部排版，使桌機不套用小於 1 的全舞台縮放、窄螢幕保留比例縮放且 teleported dialog 不參與測量；以 3.1 的 browser regression exit 0 驗證 **Observable behavior** 與 **Acceptance criteria**。

## 4. 整合驗證

- [x] 4.1 以 Chromium 真實流程驗證和牌 dialog 自動開啟、關閉、`查看台型` 重開，以及流局結果到下一局仍由原莊續莊；`nvm use 22 && npm run test:e2e -- e2e/game-table.smoke.spec.ts` 必須 exit 0，覆蓋 **Scope boundaries** 且不得修改 core/store/scoring。
- [x] 4.2 執行 `nvm use 22 && npm test`、`nvm use 22 && npm run typecheck`、`nvm use 22 && npm run build`、`git diff --check` 與 `spectra validate post-mvp-settlement-layout-readability --strict`，全部 exit 0 才完成 **Acceptance criteria**；本 task 不授權 archive 或修改未完成的 Harness change。

## 5. 寬但矮桌機裁切回歸

- [x] 5.1 以 `1489x658` Chromium RED 重現 **Wide but short viewport keeps the human hand visible**：檢查 `human-concealed-tiles` 與真人 action row 的 bounding box 完整位於 viewport、頁面無 scrollbar，並記錄現況因 width-only `scale = 1` 讓手牌超出底部而失敗。
- [x] 5.2 修正 **Keep desktop layout unscaled and reserve proportional scaling for narrow screens** 的 width-only 判斷，使 `2048x962` 維持 scale 1、`1489x658` 依實際可用高度進入 compact／比例 fallback，且關鍵手牌與操作區不可裁切；以 5.1 Chromium regression exit 0 驗證。
- [x] 5.3 執行完整 `e2e/game-table.smoke.spec.ts`，確認 `1489x658`、`2048x962`、窄螢幕、和牌彈窗、流局後原莊續莊與輪莊流程全部通過，且 viewport visibility assertion 不再只檢查 DOM existence 或 page scrollbar。
- [x] 5.4 執行 `nvm use 22 && npm test`、`nvm use 22 && npm run typecheck`、`nvm use 22 && npm run build`、`git diff --check` 與 `spectra validate post-mvp-settlement-layout-readability --strict`，全部 exit 0 才可重新宣告完成；本 task 不授權 archive。

## 6. 連莊累加規則

- [x] 6.1 以 core RED 驗證 **Round flow tracks cumulative dealer continuation**：初始 0、莊家胡牌 0→1→2、流局同莊 +1、換莊歸零；執行對應 round-flow regression 必須先因 table state 缺少 continuation count 而失敗。
- [x] 6.2 實作 **Track dealer continuation in round flow and score it dynamically** 的權威 `dealerContinuationCount` 及 production next-round transition，讓 6.1 GREEN，並確認所有 fixture 都明確保留或建立合法計數。
- [x] 6.3 以 scoring RED 驗證 **Dealer continuation adds cumulative tai**：count 1 產生 `連莊 1 台`、count 2 產生單一 `連莊 2 台` 並納入 `totalTai`、非莊家不計；先失敗後在 scoring core 實作動態 structured item。

## 7. 整場結算與重新開始

- [x] 7.1 以 store/component RED 驗證 **Ended match can restart through existing setup** 與 **Match completion renders final settlement**：ended match 顯示冠軍及四家籌碼、隱藏下一局、重新開始回 setup；targeted Vitest 必須先因 UI 缺失與無 reset action 而失敗。
- [x] 7.2 實作 **Render authoritative match settlement instead of a dead next-round action**：加入 store reset、typed emit 與 teleported match settlement，使和牌臺型關閉後顯示整場結算，`重新開始` 回到既有 setup modal；以 7.1 targeted Vitest exit 0 驗證。

## 8. 手牌放大與瀏覽器閉環

- [x] 8.1 以 `1489x658` browser RED 驗證 **Human concealed tiles use available readable space**：真人牌 computed font-size 至少 16px、點擊區放大且完整位於 viewport；先因現況 0.82rem 而失敗。
- [x] 8.2 實作 **Enlarge only the human concealed-hand controls**：放大真人手牌文字、padding 與 gap，保持其他牌區密度；以 8.1 browser regression exit 0 驗證。
- [x] 8.3 以初始 100 籌碼與 production win/settlement browser journey 驗證破產終局 → 臺型彈窗 → 整場結算 → 無下一局 → 重新開始 → setup modal，並重跑完整 E2E。
- [x] 8.4 執行完整 Vitest、typecheck、build、`git diff --check` 與 Spectra strict validation，全部 exit 0 才可宣告完成；本 task 不授權 archive。

## 9. Pinia HMR 既存分頁回歸

- [x] 9.1 以最低層 RED harness 驗證 **Preserve new store actions across Vite HMR** 與 **Development hot updates preserve the game session store contract**：`game-session` setup store 必須匯入並對 `useGameSessionStore` 註冊 `acceptHMRUpdate`；測試必須先因目前完全沒有 HMR acceptance 而失敗。
- [x] 9.2 在 `src/stores/gameSession.ts` 加入 development-only Pinia HMR acceptance，使既存 store instance 在 Vite 更新後取得 `resetMatch`，讓 9.1 GREEN；不得在 `GameView` 加 optional chaining 或 fallback 掩蓋缺失。
- [x] 9.3 重跑 targeted HMR/store/component tests、完整 Vitest、完整 Chromium E2E、typecheck、build、`git diff --check` 與 Spectra strict validation，全部 exit 0 才可重新宣告完成；本 task 不授權 archive。

## 10. 統一本局結算與籌碼分配

- [x] 10.1 以 store RED 驗證 **Every completed round renders authoritative chip allocation**：0 台放槍仍依既有底注產生 winner `+30`、discarder `-30`、其餘 `±0` 與四家結算後籌碼；自摸依既有三家支付，流局四家 `±0`。targeted store test 必須先因沒有 per-round settlement snapshot 而失敗。
- [x] 10.2 在 `MatchState` 與 `applyMatchSettlement` 建立權威 per-seat delta／balance snapshot，讓 10.1 GREEN；selector/view-model 只傳遞資料，不得重算底注、台值或支付者。
- [x] 10.3 以 component RED 驗證 **Use one authoritative per-round settlement dialog**：和牌顯示臺型及四家 `本局增減｜結算後籌碼`、流局顯示原因且不顯示總台數／臺型、移除 `查看台型`；match in-progress 顯示彈窗內 `下一局`，ended 只顯示 `重新開始`。
- [x] 10.4 實作單一 teleported `本局結算`，移除舊臺型 open/close/reopen state 與牌桌內 next-round action，使 10.3 GREEN，並保持 UI 不計算籌碼。
- [x] 10.5 更新 Chromium journey 驗證 0 台仍顯示底注分配、流局自動結算、彈窗內下一局，以及破產終局重新開始；完整 E2E 必須 exit 0。
- [x] 10.6 執行完整 Vitest、typecheck、build、`git diff --check`、Spectra analyze 與 strict validation，全部 exit 0 才可宣告完成；本 task 不授權 archive。

## 11. 終局辨識節奏

- [x] 11.1 以 fake timer 元件 RED 驗證 **Every completed round renders authoritative chip allocation** 與 **Delay terminal settlement visibility by 1.5 seconds**：win／draw 終局後前 1,500ms 不得存在 `round-settlement-dialog`，時間到才顯示既有權威結算內容；執行 `nvm use 22 && npm test -- tests/ui/round-result-sync.test.ts` 必須先因目前立即掛載彈窗而失敗。
- [x] 11.2 在 `GameTableView.vue` 實作可清理的 UI-only 1.5 秒 readiness timer，使終局牌桌先保持可見、到時才掛載同一 teleported dialog，且不得延遲或重算 store settlement；以 11.1 targeted Vitest exit 0 驗證。
- [x] 11.3 更新 Chromium 真實 win／draw journey，驗證終局後彈窗不會立即遮住牌桌、1.5 秒後自動出現，並執行完整 `e2e/game-table.smoke.spec.ts` 確認下一局與重新開始流程未回歸。
- [x] 11.4 執行完整 Vitest、typecheck、build、`git diff --check`、Spectra analyze 與 strict validation，全部 exit 0 才可宣告完成；本 task 不授權 archive 或修改未完成的 Harness change。
