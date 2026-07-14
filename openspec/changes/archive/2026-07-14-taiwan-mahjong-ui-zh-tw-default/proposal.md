## Why

目前遊戲頁仍直接顯示 `/game`、`east`、`claim`、`characters-1` 這類工程或原始領域字樣，對一般玩家不可讀，也不符合本 repo 已確立的「產品 UI 預設為繁體中文」規則。

## What Changes

- 將遊戲頁標題、桌面摘要、玩家欄位、結果摘要與可操作按鈕改為繁體中文產品文案。
- 將座位、階段、宣告、結果與牌張顯示從原始 enum / route / tile id 轉為玩家可理解的中文格式。
- 保留現有規則與互動流程，只調整 view model 與 UI 顯示邊界，不在畫面層重寫規則。

## Capabilities

### New Capabilities

- (none)

### Modified Capabilities

- `mahjong-vue-table-shell`: 將遊戲桌 UI 從 debug/raw domain 文案提升為預設繁體中文的玩家可讀介面。

## Impact

- Affected specs: `mahjong-vue-table-shell`
- Affected code:
  - Modified: `src/views/game/GameView.vue`
  - Modified: `src/views/game/components/GameTableView.vue`
  - Modified: `src/views/game/selectors.ts`
  - Modified: `src/views/game/types.ts`
  - Modified: `tests/ui/game-table-view.test.ts`
  - Modified: `tests/ui/human-claim-window.test.ts`
  - Modified: `tests/ui/human-self-turn-actions.test.ts`
  - Modified: `tests/ui/interactive-turn-loop.test.ts`
  - Modified: `tests/ui/round-result-sync.test.ts`
