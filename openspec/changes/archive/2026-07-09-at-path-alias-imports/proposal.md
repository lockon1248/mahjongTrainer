## Why

目前專案中的 `src/` 與 `tests/` 匯入大量依賴相對路徑，像 `../../src/core/index` 這類寫法已經開始拉長，後續模組變多時可讀性與搬動成本都會快速變差。現在先統一導入 `@` 指向 `src/`，可以在 Vue scaffold 開始前把 TypeScript 與測試環境的匯入邊界固定下來。

## What Changes

- 建立 `@` 指向 `src/` 的 TypeScript 路徑別名設定。
- 建立 Vitest 對應的 alias 解析，讓測試與原始碼都能使用 `@/...` 匯入。
- 將現有 `src/` 與 `tests/` 內可統一的相對路徑匯入改寫為 `@/...`。
- 保持目前行為不變，這次只處理匯入路徑表示法，不改動核心邏輯。

## Non-Goals

- 不引入與 `src/` 無關的多組 alias。
- 不建立新的 Vite app runtime 設定或 Vue scaffold。
- 不改動既有 scoring、rules、domain model 的行為。

## Capabilities

### New Capabilities

- `source-import-aliasing`: 定義 `@` 指向 `src/` 的匯入別名行為與驗證邊界。

### Modified Capabilities

(none)

## Impact

- Affected specs: `source-import-aliasing`
- Affected code:
  - New: `openspec/changes/at-path-alias-imports/specs/source-import-aliasing/spec.md`, `openspec/changes/at-path-alias-imports/design.md`, `openspec/changes/at-path-alias-imports/tasks.md`
  - Modified: `tsconfig.json`, `vitest.config.ts`, `src/**/*.ts`, `tests/**/*.ts`
  - Removed: (none)
