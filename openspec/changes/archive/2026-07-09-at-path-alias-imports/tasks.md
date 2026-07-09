## 1. Alias 設定

- [x] 1.1 實作 `@` source import alias，讓 Single `@` alias rooted at `src` 在 `tsconfig.json` 中將 `@/` 解析到 `src/`，並以 `npm run typecheck` 驗證 TypeScript 解析成功。
- [x] 1.2 實作 `@` source import alias，讓 Use TypeScript paths and Vitest resolve alias together 在 `vitest.config.ts` 中同步生效，並以 `npm test -- --run tests/core tests/smoke` 驗證測試執行成功。

## 2. 匯入改寫

- [x] 2.1 實作 alias-backed import normalization，讓 Migrate imports in-place instead of mixed style 成立，將 `src/` 內可替換的相對匯入改為 `@/...`，並以 `npm run typecheck` 驗證匯入符號與型別結果未改變。
- [x] 2.2 實作 alias-backed import normalization，讓 Migrate imports in-place instead of mixed style 成立，將 `tests/` 內指向 `src/` 的相對匯入改為 `@/...`，並以 `npm test -- --run tests/core tests/smoke` 驗證測試仍指向相同模組。

## 3. 整體驗證

- [x] 3.1 執行 `npm run typecheck`，驗證 `@` source import alias 與 alias-backed import normalization 在整個專案中可被型別系統一致解析。
- [x] 3.2 執行 `npm test -- --run tests/core tests/smoke`，驗證 alias 改寫未改變既有核心與 smoke 測試行為。
