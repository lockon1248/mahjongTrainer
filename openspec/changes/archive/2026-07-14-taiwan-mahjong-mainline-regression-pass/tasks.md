## 1. 主線整合測試

- [x] 1.1 實作 Requirement `Mainline playable flow regression coverage` 的主線整合測試，遵守設計決策「主線整合測試以既有能力組合，不重寫規則」與「至少覆蓋兩條主線終局」，覆蓋開局、摸打、宣告、胡牌或流局、結果同步，並以 `tests/ui/mainline-playable-flow.test.ts` 驗證。

## 2. 總驗證

- [x] 2.1 執行主線總驗證：以 `npm test -- --run tests/core tests/ui`、`npm run typecheck` 與 `spectra analyze taiwan-mahjong-mainline-regression-pass --json` 驗證主線閉環成立。
