## Why

目前前端樣式仍以集中式 CSS 與 component 內部硬編碼文案常數混用，導致牌桌畫面在持續追加高亮、座位狀態、和牌資訊與結果面板時，樣式調整成本偏高，固定對照值也分散在單一 component 內。這種結構會放大後續 UI 擴充與規則文案同步時的維護風險。

## What Changes

- 導入 UnoCSS 作為前端 utility-first 樣式基礎，讓牌桌殼層與共用 UI 可逐步由可組合的 utility class 驅動。
- 盤點目前散落在 component 內的固定對照值，包含數字牌文字、風牌文字、三元牌文字、花牌文字、座位與階段文案，收斂到共用 enum / 常數模組統一管理。
- 建立前端對固定展示值的單一權威來源，讓 table view、selector、測試與後續新 UI 都復用同一份定義，而不是各自重寫。
- 補齊樣式系統初始化、共用常數匯出與既有牌桌畫面的測試契約，確保重構後行為與文案輸出保持一致。

## Capabilities

### New Capabilities

- `mahjong-frontend-style-foundation`: 定義前端 utility 樣式系統與固定展示常數的共用權威來源，作為牌桌 UI 與後續畫面擴充的基礎。

### Modified Capabilities

- `mahjong-vue-table-shell`: 牌桌殼層需改為依賴共用展示常數與 utility class 組裝，避免在 view 內重新宣告固定文案映射與大量專屬樣式耦合。

## Impact

- Affected specs: `mahjong-frontend-style-foundation`, `mahjong-vue-table-shell`
- Affected code:
  - Modified: `package.json`, `src/styles/main.css`, `src/views/game/components/GameTableView.vue`, `src/views/game/selectors.ts`, `tests/ui/game-table-view.test.ts`, `tests/ui/game-table-layout.test.ts`, `vite.config.ts`
  - New: `uno.config.ts`, `src/ui/constants/display.ts`, `src/ui/constants/tiles.ts`
  - Removed: none
