## 1. UnoCSS 樣式基礎導入

- [ ] 1.1 落地 design 的 `Introduce UnoCSS as the primary utility styling layer`，讓 `Frontend utility styling pipeline` 在 Vite 與 Vue SFC 中可實際產生 utility class，並以 `npm run build` 與 `tests/ui/game-table-layout.test.ts` 驗證牌桌主要版型與狀態樣式仍可渲染。
- [ ] 1.2 依 `Table shell styling remains composable under the shared utility layer` 收斂牌桌主要面板、狀態高亮與資訊區塊的樣式表達，讓新增狀態可透過 composable utility class 疊加，並以 `tests/ui/game-table-layout.test.ts` 驗證莊家、目前出牌者與 claim-window 等組合狀態可同時存在。

## 2. 共用固定展示常數整理

- [ ] 2.1 落地 design 的 `Centralize fixed presentation values into shared enum and constant modules`，讓 `Shared presentation constants authority` 成立，tile / seat / phase / outcome 等固定文案改由共享模組匯出，並以 `tests/ui/game-table-view.test.ts` 與 `tests/ui/round-result-sync.test.ts` 驗證中文輸出等價。
- [ ] 2.2 依 `Table shell reuses shared presentation labels` 改造 `GameTableView` 與必要 selector / 測試引用，讓 component 不再內嵌重複 mapping，並以 `rg -n "const (NUMBER_LABELS|WIND_LABELS|DRAGON_LABELS|FLOWER_LABELS)" src/views/game/components/GameTableView.vue` 無結果及對應 UI 測試通過驗證。

## 3. 重構回歸驗證

- [ ] 3.1 落地 design 的 `Guard the refactor with output-equivalence tests and build verification`，讓 UnoCSS 導入與展示常數重構後的 UI 行為維持等價，並以 `npm run test -- tests/ui/game-table-view.test.ts tests/ui/game-table-layout.test.ts tests/ui/round-result-sync.test.ts`、`npm run typecheck` 與 `npm run build` 驗證。
