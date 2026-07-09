## Why

目前 `scoring` 與 `round flow` 已有 baseline 行為，但專案還缺少正式的 `Rule Config` 核心，導致 baseline 文件中多次強調「不得硬編碼」的規則仍無法被一致注入。若現在直接往 AI 或 UI 前進，後續一旦桌規差異進來，規則會再次散落到 core 以外的地方。

## What Changes

- 建立純 TypeScript 的 rule config core，定義台灣 16 張麻將 baseline 與可配置規則的正式資料 shape。
- 建立 baseline default config，將目前已確認的桌規預設集中到單一入口，而不是散落在 scoring 或 round flow 實作中。
- 定義 `round flow` 與 `scoring` 讀取 config 的邊界，讓宣告優先序、自摸／放槍支付責任、花牌補牌方式與流局後未定案分支能由 config 決定或保持 unresolved。
- 建立對應的 `tests/core` 測試，驗證 config 預設值、覆寫行為與未定案規則的保留策略。

## Non-Goals

- 不在本 change 內補完完整台型清單、特殊胡、最低台數、封頂或花牌計分細則。
- 不在本 change 內直接實作 AI 決策、Pinia store 或 Vue UI。
- 不在本 change 內決定尚未定案規則的最終桌規內容，只定義它們如何被表示與注入。

## Capabilities

### New Capabilities

- `mahjong-rule-config-core`: 定義台灣 16 張麻將 baseline 規則設定、預設值與 core 模組的 config 注入邊界。

### Modified Capabilities

- `mahjong-round-flow-core`: 將宣告優先序、花牌補牌方式與流局後未定案處理改為來自 rule config，而非固定依賴 baseline 常數。

## Impact

- Affected specs: `mahjong-rule-config-core`, `mahjong-round-flow-core`
- Affected code:
  - New: `openspec/changes/taiwan-mahjong-rule-config-foundation/specs/mahjong-rule-config-core/spec.md`, `src/core/config/`, `tests/core/rule-config*.test.ts`
  - Modified: `openspec/specs/mahjong-round-flow-core/spec.md`, `src/core/rules/`, `src/core/scoring/`, `src/core/index.ts`, `src/core/types/`
  - Removed: (none)
