## 1. 牌桌桌位與中央捨牌主結構

- [x] 1.1 實作 Requirement `依桌位相對位置呈現牌桌`，依設計決策「玩家固定在下方的牌桌佈局」讓真人玩家固定在下方、其餘三家依桌位環繞中央桌面，並以 `tests/ui/game-table-layout.test.ts` 或等效 UI 測試驗證桌位相對位置。
- [x] 1.2 實作 Requirement `中央桌面完整顯示四家捨牌池`，依設計決策「中央桌面完整顯示四家捨牌池」讓中央桌面同時顯示四家捨牌內容而非只顯示數量，並以 `tests/ui/game-table-view.test.ts` 驗證四家捨牌區都可見且保留座位歸屬。

## 2. 手牌排序與顯示資料邊界

- [x] 2.1 實作 Requirement `真人暗手依台灣麻將順序顯示`，依設計決策「手牌排序由顯示層負責」在 view model / selector 層輸出 `萬 → 筒 → 條 → 風 → 三元 → 花` 的顯示順序，並以 `tests/ui/game-table-view.test.ts` 驗證混合手牌的顯示順序。
- [x] 2.2 依設計決策「不改動規則層，只調整 view model 與 layout」維持既有 core / store 合法動作與回合流程不變，只調整 table view 所需資料形狀，並以 `tests/ui/interactive-turn-loop.test.ts` 驗證排序後的人類出牌流程仍可正常推進。

## 3. 回歸驗證與變更一致性

- [x] 3.1 依設計決策「副露與 claimed tile 必須直接映射已裁決牌局狀態」，補上 `claim-window` 裁決接受 `chi`、`pon`、`kan-exposed` 時的最小必要狀態修補，讓 consumed tiles 會離開暗手、claimed tile 會離開觸發者捨牌池，且新組合會寫入宣告者 `melds`，並以 `tests/core/round-flow-claims.test.ts` 驗證。
- [x] 3.2 實作 Requirement `副露區與捨牌池必須反映裁決後牌局狀態`，讓 view model 與 `GameTableView` 顯示副露區，且不再讓已被吃碰槓的牌同時出現在副露與中央捨牌池，並以 `tests/ui/game-session.store.test.ts`、`tests/ui/game-table-layout.test.ts` 驗證。
- [x] 3.3 更新既有互動 / 同步測試 fixture，確保 `claim-window` 測試資料是可實際到達的牌局狀態，而不是缺少對應捨牌的半套狀態。

## 4. 回歸驗證與變更一致性

- [x] 4.1 完成上述版面後執行 `tests/ui/game-table-layout.test.ts`、`tests/ui/game-table-view.test.ts`、`tests/ui/interactive-turn-loop.test.ts`、`tests/ui/round-result-sync.test.ts`，確認中央捨牌區、桌位環繞與結果畫面沒有互相破壞。
- [x] 4.2 執行 `spectra analyze taiwan-mahjong-table-layout-and-discards --json`，確認 `observable behavior`、`interface / data shape`、`failure modes`、`acceptance criteria`、`scope boundaries` 都已被 tasks 與 specs 覆蓋，且這個 child change 仍維持主 spec `階段 4` 牌桌 UI 的主線映射。
