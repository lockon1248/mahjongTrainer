## Why

目前 scoring 只完成最低門檻、天胡、大三元、小三元等起始規則，還不足以支撐這個專案作為台灣麻將台數練習器的核心目標。若沒有一份完整且可測試的權威牌型台數目錄，後續 UI 顯示、E2E 驗證與 AI 和牌說明都會持續建立在不完整規則之上。

## What Changes

- 補齊台灣 16 張麻將第一版權威牌型台數目錄，明確定義每個台型的名稱、台數、啟用狀態、可否疊加、成立條件與衝突關係。
- 將目前 baseline 中僅列為待擴充主線的花牌、風牌、門清、對對胡、混一色、清一色與其他特殊胡型整理成可落地的規格批次。
- 擴充 scoring 與 rule config 的需求，使未來程式必須從同一份權威規格與設定取得台型與算台行為。
- 補強規則測試矩陣，要求每一類牌型與關鍵衝突規則都有對應 core 測試與至少一條關鍵 E2E 驗證入口。

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `mahjong-scoring-core`: 算台核心需支援完整牌型台數目錄、疊加規則、特殊胡型與結果說明輸出。
- `mahjong-rule-config-core`: rule config 需承載完整 scoring catalog 的啟用開關、門檻、封頂與相關桌規設定。

## Impact

- Affected specs: `mahjong-scoring-core`, `mahjong-rule-config-core`
- Affected code:
  - Modified: `openspec/specs/taiwan-mahjong-rules-baseline.md`, `openspec/specs/taiwan-mahjong-rule-test-matrix.md`, `openspec/specs/taiwan-mahjong-trainer.md`, `openspec/changes/taiwan-mahjong-mainline-progress-board-live/design.md`
  - New: `openspec/changes/taiwan-mahjong-complete-scoring-catalog/proposal.md`, `openspec/changes/taiwan-mahjong-complete-scoring-catalog/design.md`, `openspec/changes/taiwan-mahjong-complete-scoring-catalog/tasks.md`, `openspec/changes/taiwan-mahjong-complete-scoring-catalog/specs/mahjong-scoring-core/spec.md`, `openspec/changes/taiwan-mahjong-complete-scoring-catalog/specs/mahjong-rule-config-core/spec.md`
  - Removed: none
