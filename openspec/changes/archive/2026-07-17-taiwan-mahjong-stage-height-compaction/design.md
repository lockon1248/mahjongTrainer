## Context

實際 Playwright 量測已經證明，當前桌機畫面下 `game-stage-frame` 可用高度約為 `580px`，但 `game-stage-content` 的原始內容高度約為 `1100px`，導致固定舞台最終被縮到約 `scale(0.527)`。這就是為什麼即使放寬了寬度上限，玩家實際看到的牌桌仍舊很小。

使用者限制也已明確：上方資訊列不要動。因此這次不能再去動 header 或摘要列，而是必須直接壓縮牌桌本體的基底高度，把縮放壓力從牌桌內部拿掉。

## Goals / Non-Goals

**Goals:**

- 降低牌桌本體的原始高度，讓固定舞台的縮放倍率顯著回升。
- 在不修改 header 與上方資訊列內容／樣式的前提下，讓寬螢幕下的遊戲區肉眼可見變大。
- 維持固定舞台與無主頁垂直捲軸行為。
- 用實際畫面檢查與 browser 驗證保護這次成果。

**Non-Goals:**

- 不修改 header 內容、導覽或樣式。
- 不修改上方資訊列欄位內容、分組或卡片樣式。
- 不全面重寫 fixed-stage 演算法。
- 不在本 change 內重做手機版資訊架構。

## Decisions

### 問題核心是高度，不是寬度

上一輪已經放寬 `stageFrame` / `stageScaler` 寬度，但只要 `game-stage-content` 原始高度遠大於可用高度，整個舞台仍會被高度主導的 `scale` 壓縮。這次的主軸 therefore 是壓低未縮放內容高度，而不是再加大寬度上限。

### 優先壓縮中央牌池與玩家面板的空狀態高度

實際量測顯示桌面本體是最大高度來源，而在當前畫面下，中央四格捨牌池與玩家面板在空狀態仍保留過高的基底高度。這些區塊是最先要壓縮的目標，因為它們能在不動上方資訊列的情況下直接回收舞台高度。

### 保留資訊不變，改密度而不是改資訊架構

這次允許調整的是密度、padding、gap、最小高度、統計格局與牌桌內部排版緊湊度；不允許改變產品資訊內容或把上方資訊列搬動。也就是說，這次是視覺密度調整，不是資訊重構。

## Implementation Contract

### Behavior

- 遊戲頁在桌機寬螢幕下 MUST 讓牌桌本體的原始高度低於前一版，從而顯著提高固定舞台的實際縮放倍率。
- 提高縮放倍率後，玩家區、中央牌池與人類手牌區 MUST 肉眼可見比前一版更大。
- header 與上方資訊列內容／樣式 MUST 保持不變。
- 調整後 MUST 繼續維持無主頁垂直捲軸。

### Interface / data shape

- 不新增 domain state。
- 只允許修改 `GameView.vue` 的舞台縮放相關驗證、`GameTableView.vue` 的牌桌密度與緊湊版型，以及對應 UI / browser 驗證。
- 驗證需能指出這次改的是更高縮放倍率或更緊湊的牌桌語意，而不是單純寬度 token 變更。

### Failure modes

- 若實際畫面仍明顯縮在中間，視為失敗。
- 若為了放大而動到 header 或上方資訊列內容／樣式，視為超出 scope。
- 若只有 code 變更但實際縮放倍率沒有明顯回升，視為失敗。
- 若調整後重新出現主頁捲軸，也視為失敗。

### Acceptance criteria

- UI 測試能辨認牌桌採用更緊湊的面板 / 中央牌池語意。
- Browser 驗證需再次確認無主頁捲軸，並確認桌機寬螢幕下實際縮放倍率或可視牌桌寬度明顯高於前一版。
- 完成後需直接檢查實際截圖；若截圖仍顯示大量左右留白與縮小感，不得宣稱完成。

### Scope boundaries

- In scope：`src/views/game/GameView.vue`、`src/views/game/components/GameTableView.vue`、對應 Vitest、對應 Playwright smoke、主線 board 同步。
- Out of scope：上方資訊列重排、header 改版、手機版資訊架構重設、整個 stage engine 重寫。

## Risks / Trade-offs

- [牌桌過度緊縮導致資訊擁擠] → 優先壓縮空狀態高度與 gap，不先犧牲關鍵文字可讀性。
- [只改善高度但寬度仍不夠] → 這次以實際縮放倍率與畫面截圖為最終裁決，不再只看 token。
- [scope drift 回到 summary/header] → design 與 tasks 明確限制不可碰上方資訊列。
