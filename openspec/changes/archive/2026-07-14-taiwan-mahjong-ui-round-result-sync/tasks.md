## 1. 結果摘要映射

- [x] 1.1 實作 Requirement `Round result summary mapping` 的 selector / view model，遵守設計決策「Selector 提供結果摘要 view model」，讓既有 `RoundResult` 映射為穩定結果摘要，並以 `tests/ui/round-result-sync.test.ts` 驗證 win / draw 結果資料都有正確欄位。

## 2. 結果摘要 UI

- [x] 2.1 實作 Requirement `Round result summary rendering`，遵守設計決策「UI 採最小結果摘要區」與「in-progress 不顯示結果摘要」：在 `GameTableView` 顯示本局結果摘要，並以 `tests/ui/round-result-sync.test.ts` 驗證 in-progress 不顯示、win / draw 顯示正確內容。
- [x] 2.2 維持 view 唯讀映射，讓 component 不重算規則，只渲染 selector 提供的結果摘要，並以既有 UI 測試與新測試驗證。

## 3. 整體驗證

- [x] 3.1 執行整體驗證：以 `npm test -- --run tests/ui/round-result-sync.test.ts tests/ui`、`npm run typecheck` 與 `spectra analyze taiwan-mahjong-ui-round-result-sync --json` 驗證結果同步成立。
