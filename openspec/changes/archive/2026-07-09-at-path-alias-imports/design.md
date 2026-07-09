## Context

目前專案只有 TypeScript 與 Vitest 設定，尚未建立正式的 Vite app runtime 設定檔。現況下，`tests/` 到 `src/` 的引用已經出現多層 `../../src/...`，而 `src/` 內部也仍以相對路徑彼此引用。這次目標是在不改變邏輯行為的前提下，先把 `@` 指向 `src/` 的路徑別名固定下來。

## Goals / Non-Goals

**Goals:**

- 讓 TypeScript 與 Vitest 都能解析 `@/` 到 `src/`。
- 將現有 `src/` 與 `tests/` 的可替換相對匯入改成 `@/...`。
- 確保 alias 改寫不改變任何測試行為與型別結果。

**Non-Goals:**

- 不新增第二組 alias。
- 不建立 Vue app scaffold 或新的 runtime build config。
- 不改動業務邏輯與測試斷言。

## Decisions

### Single `@` alias rooted at `src`

這次只建立一組 `@`，對應 `src/` 根目錄，不再額外導入 `~`、`@core` 或其他變體。這樣最符合目前專案規模，也避免未來再做 alias 遷移。

### Use TypeScript paths and Vitest resolve alias together

只改 `tsconfig.json` 不夠，因為測試執行期仍需由 Vitest/Vite resolver 解析 alias。這次同步在 TypeScript 與 Vitest 設定中定義同一個 alias，避免編譯器與測試器認知不一致。

### Migrate imports in-place instead of mixed style

既然目標是統一，就不保留新舊寫法混用。這次直接把現有 `src/` 與 `tests/` 內可轉換的匯入改成 `@/...`，讓後續檔案不再跟著舊相對路徑風格擴散。

## Implementation Contract

- Behavior: 專案中的 `src/` 與 `tests/` 模組可使用 `@/...` 引用 `src/` 下檔案，且既有功能與測試結果不變。
- Interface / data shape: `tsconfig.json` 需定義 `baseUrl` 與 `paths`，`vitest.config.ts` 需定義對應 `resolve.alias`。
- Failure modes: 若 alias 僅在單一工具層啟用，則 `npm run typecheck` 或 `npm test` 會失敗；這次必須避免該不一致。
- Acceptance criteria: `npm run typecheck` 通過，且 `npm test -- --run tests/core tests/smoke` 通過。
- Scope boundaries: in scope 為 alias 設定與匯入改寫；out of scope 為任何邏輯行為調整、Vue runtime 設定、或多組 alias 設計。

## Risks / Trade-offs

- [Risk] 未來若新增正式 `vite.config.ts`，alias 需要再同步一次。 → Mitigation: 先把目前唯一有效的 Vitest/Vite resolver 配好，後續 Vue scaffold 時沿用同一規則。
- [Risk] 大量改 import 容易漏改。 → Mitigation: 用搜尋結果完整覆蓋現有相對匯入，並用 `typecheck` 與測試驗證。
