## 1. Keep a single baseline default config as the only hard-coded source

- [x] 1.1 實作 `Baseline rule config default` 的 baseline default builder，讓 caller 在未提供 override 時仍可取得完整 rule config，而所有 baseline 預設只存在單一來源，並以新增的 baseline config 測試與 `npm run typecheck` 驗證。
- [x] 1.2 實作 `Config slices for core modules` 的 root config 與 module slice 入口，讓 round flow 與 scoring 都能從同一個 root config 取用有效設定，並以對應 core 測試與 `npm test -- --run tests/core` 驗證。

## 2. Model unresolved rules explicitly instead of hiding them behind partial booleans

- [x] 2.1 實作 `Explicit unresolved rule markers`，讓未定案規則在 baseline config 中能被明確表示為 unresolved 而不是 `false`，並以 unresolved policy preservation 測試驗證。
- [x] 2.2 實作 `Rule config override merge` 的 override merge helper，讓已知 key 可被正確覆寫、未知 key 會被拒絕，並以 config override / invalid override 測試驗證。

## 3. Pass rule config through narrow core interfaces rather than global mutable state

- [x] 3.1 修改 `Claim window resolution` 使其從 rule config 讀取有效 claim priority order，而不是依賴固定常數，並以 `CLAIM-PRIORITY-001` 的 config-driven 測試驗證。
- [x] 3.2 修改 `Exhaustive draw outcome` 使其透過 rule config 保留 unresolved post-draw branches，而不是在 round flow 中直接結案，並以 `DRAW-DEALER-001` 與 unresolved draw policy 測試驗證。

## 4. Update round flow first, leave scoring adoption incremental

- [x] 4.1 建立 scoring 的 config adoption 邊界，讓 scoring core 可讀取 payment responsibility 與 minimum tai 相關設定而不引入第二套 config 來源，並以新增 scoring config 測試與 `npm run typecheck` 驗證。
- [x] 4.2 執行整體驗證，確認 `Baseline rule config default`、`Explicit unresolved rule markers`、`Rule config override merge`、`Config slices for core modules`、`Claim window resolution` 與 `Exhaustive draw outcome` 的新舊 spec 能協同運作，並以 `npm test -- --run tests/core`、`npm run typecheck` 與 `spectra analyze taiwan-mahjong-rule-config-foundation --json` 驗證。
