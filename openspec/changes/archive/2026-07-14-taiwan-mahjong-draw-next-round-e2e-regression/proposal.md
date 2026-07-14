## Why

前一個 `taiwan-mahjong-draw-next-round-progression` 雖然已修正 core 與 store 的流局續局行為，但當時沒有把「流局後按下一局」補成瀏覽器 E2E 回歸，導致流程驗證標準不完整。這次要補的是使用者真正在畫面上完成流局、看到結果、按下「下一局」後成功回到新局的回歸保障。

## What Changes

- 補一個針對流局後續局的 E2E regression change。
- 擴充 E2E bridge，提供可重現流局完成狀態的測試場景。
- 新增 Playwright 測試，驗證流局結果畫面可按「下一局」回到新局且不顯示錯誤。
- 跑完整回歸，補上這次 bugfix 缺的瀏覽器驗證。

## Non-Goals

- 不重新修改流局後 core 規則。
- 不新增流局查聽、罰則或其他商業規則。
- 不做新的 UI 視覺設計。

## Capabilities

### Modified Capabilities

- `mahjong-vue-table-shell`: 牌桌瀏覽器流程必須覆蓋流局後按下一局的真實使用者續局行為。

## Impact

- Affected specs: `mahjong-vue-table-shell`
- Affected code:
  - Modified: `openspec/changes/taiwan-mahjong-mainline-progress-board/design.md`
  - Modified: `src/views/game/e2eBridge.ts`
  - Modified: `src/env.d.ts`
  - Modified: `e2e/game-table.smoke.spec.ts`
