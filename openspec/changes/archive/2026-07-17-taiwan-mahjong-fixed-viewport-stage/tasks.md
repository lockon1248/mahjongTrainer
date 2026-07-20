## 1. 固定舞台包住整個對局畫面

- [x] 1.1 交付「固定舞台包住整個對局畫面」與「唯讀牌桌殼層」的外層容器語意，讓 `GameView` 在桌機／平板下以 `100dvh` 內的單一視窗舞台承載摘要、牌桌與玩家區，並以 `tests/ui/game-table-view.test.ts` 或新增對應 UI 測試驗證頁面不再依內容自然撐高。
- [x] 1.2 交付「用等比縮放維持單一場景閱讀順序」的舞台縮放行為與對應的 interface / data shape，讓摘要、中央牌桌、四家牌區與操作列作為同一個縮放場景同步變化，並以 component/UI 測試確認主要區塊仍可渲染、主要操作列仍可見。

## 2. 局部區塊必須先收斂自身高度責任

- [x] 2.1 交付「expanded player sections remain inside the fixed stage」行為，讓副露區、結果摘要與下一局操作在內容增加時仍留在固定舞台內，並以 `tests/ui/game-table-layout.test.ts` 驗證不再因副露或結果區成長而重新撐開頁面主高度。
- [x] 2.2 交付局部區塊吸收溢出的收斂策略與 failure modes / scope boundaries，讓最容易增高的玩家區與摘要區以內部布局處理空間壓力而不是回退成頁面捲動，且手機先維持非主目標裝置處理，並以 `tests/ui/interactive-turn-loop.test.ts` 或等效流程測試驗證主要互動仍可完成。

## 3. 驗證固定舞台回歸

- [x] 3.1 交付桌機／平板尺寸下無主頁垂直捲軸的真實流程驗證，讓「initialized round stays within a single viewport stage」與「exposed meld growth does not reintroduce page scroll」被 browser E2E 或等效整合驗證覆蓋，並以實際測試命令輸出作為完成證據。
- [x] 3.2 交付本 change 的 behavior、acceptance criteria 與規格同步收尾，讓 `spectra validate --changes taiwan-mahjong-fixed-viewport-stage --strict`、相關 Vitest 測試與必要的 browser 驗證都通過，並以命令輸出確認 artifact 與實作沒有漂移。
