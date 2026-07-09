## Why

核心規則、結算與 rule config 已經具備可重用邊界，但產品 spec 的 `階段 3` 仍缺少「中階 AI」。若現在直接做 UI，牌桌仍只能停在人類手動驅動或假資料展示，無法符合 `1 位真人玩家 + 3 位 AI` 的既定產品目標。

## What Changes

- 建立純 TypeScript 的 AI decision core，定義出牌決策、吃碰槓胡決策與必要的評估輸出。
- 建立 baseline 可用的中階牌效 heuristics，讓 AI 能優先維持聽牌前進、保留較高完成度的搭子與合理副露。
- 定義 AI 與 `round flow`、`scoring`、`rule config` 的邊界，讓 AI 只讀取合法局面與可配置規則，不自行發明桌規。
- 建立對應的 `tests/core` 測試，驗證基礎出牌、宣告與不越權處理未定案規則的行為。

## Non-Goals

- 不實作高成本搜尋式 AI、Monte Carlo 模擬或長深度前瞻。
- 不在本 change 內建立 Pinia、Vue UI、動畫節奏或互動提示。
- 不補完完整台型清單、特殊胡、封頂或未定案桌規內容。
- 不在本 change 內處理多人網路同步、玩家設定保存或回放系統。

## Capabilities

### New Capabilities

- `mahjong-ai-decision-core`: 定義台灣 16 張麻將中階 AI 的出牌與宣告決策核心。

### Modified Capabilities

- `mahjong-round-flow-core`: 增加 AI 可安全讀取的 round state / legal action consumption 邊界，讓 AI 能消費核心局面而不繞過規則入口。

## Impact

- Affected specs: `mahjong-ai-decision-core`, `mahjong-round-flow-core`
- Affected code:
  - New: `openspec/changes/taiwan-mahjong-ai-decision-foundation/specs/mahjong-ai-decision-core/spec.md`, `src/core/ai/`, `tests/core/ai-*.test.ts`
  - Modified: `src/core/index.ts`, `src/core/rules/`, `src/core/testing/`, `openspec/specs/mahjong-round-flow-core/spec.md`
  - Removed: (none)
