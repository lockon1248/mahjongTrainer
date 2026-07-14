## Context

目前牌桌畫面仍以四塊玩家資訊卡並排呈現，雖然能顯示基本狀態，但缺少真實牌桌的空間語意：

- 玩家看不到中央四家的完整捨牌區
- 玩家手牌未依常見麻將閱讀順序排列
- 東南西北只是四張卡片，沒有「自己在下方、其餘三家環繞」的打牌視角
- 吃、碰、槓後的副露與 claimed tile 沒有完整映射到桌面，使捨牌池、手牌與副露區可能互相矛盾

主 spec 已明確要求產品體驗偏向真實對局，且 `View` 層只能映射狀態，不得重寫規則。因此這次 change 的重點是把既有 store 快照轉成更接近真實牌桌的 UI 版型，同時維持規則與回合流程不變。

這個 child change 對應主 spec `階段 4` 的 `牌桌 UI`，可視為「牌桌可讀性與桌位感」這一段主線任務。

## Goals / Non-Goals

**Goals:**

- 讓玩家永遠固定在牌桌下方，其餘三家依桌位環繞
- 讓中央桌面可一次看見四家的捨牌區，而不是只看統計數字
- 讓人類玩家手牌依 `萬 → 筒 → 條 → 風 → 三元 → 花` 排序
- 讓副露、claimed tile 與中央捨牌池在吃、碰、槓後維持一致
- 維持現有 store / core 邊界，由 view model、UI 與最小必要規則修補共同承接狀態呈現

**Non-Goals:**

- 不重寫核心規則架構、勝負判定、莊家流程或 AI 決策
- 不新增動畫、3D 桌面、牌背朝向規則或音效設計
- 不在這次 change 內定義 RWD 細節
- 不在這次 change 內新增新的操作面板或提示系統

## Decisions

### 玩家固定在下方的牌桌佈局

牌桌座位以「真人玩家永遠在下方」作為固定視角，而不是單純依資料順序左右排開。這能直接對應使用者打牌習慣，也符合主 spec 的真實對局方向。

替代方案是保留四欄資訊卡，只補標題與箭頭，但那仍然沒有桌位環繞感，無法解決「不像在打牌」的核心問題，因此不採用。

### 中央桌面完整顯示四家捨牌池

中央區域必須成為牌桌核心，四家的捨牌都在中央桌面內可見，而不是散落在各玩家卡片內只顯示數量。這讓玩家能直接閱讀場上資訊，也符合麻將桌的觀察方式。

替代方案是只在玩家卡上補更多捨牌文字或列表，但這會把桌面資訊拆散，仍不符合使用者要求，因此不採用。

### 手牌排序由顯示層負責

人類玩家手牌排序屬於閱讀體驗，不是規則判定本身，因此由 view model / selector 在顯示前排序，而不是重寫 store 內部牌序。這可以降低對既有流程與測試的衝擊。

替代方案是直接改 store 內所有 concealed tiles 的保存順序，但那會把 UI 偏好的排序滲入規則狀態，增加回歸風險，因此不採用。

### 不改動規則層，只調整 view model 與 layout

這次 change 的 contract 是「同一局面用更像麻將桌的方式呈現」，不是改牌局邏輯。所有合法動作、回合推進、宣告裁決與結算資料仍以既有 core / store 為唯一來源。

替代方案是趁機一起重構 table state shape，但這會把 UI 版面調整變成資料模型改造，scope 過大，因此不採用。

### 副露與 claimed tile 必須直接映射已裁決牌局狀態

當 `claim-window` 裁決為 `chi`、`pon`、`kan-exposed` 時，畫面不能只顯示「宣告發生過」，而必須反映裁決後的實際牌局結果：被吃碰槓的牌要離開觸發者捨牌池、消耗的手牌要離開宣告者暗手、形成的組合要出現在宣告者副露區。

替代方案是只在 UI 端臨時隱藏最後一張捨牌或硬塞副露顯示，但那會讓 View 自己發明狀態，違反 `core / store` 為唯一來源的邊界，因此不採用。

## Implementation Contract

### Observable behavior

- 進入牌局畫面後，真人玩家區塊固定在桌面下方
- 其餘三家依桌位分布在上、左、右，形成環繞桌面的相對位置
- 中央桌面可同時看到四家的捨牌內容
- 真人玩家手牌顯示順序固定為 `萬 → 筒 → 條 → 風 → 三元 → 花`
- 玩家在吃、碰、槓後，副露區會立即顯示新組合，且 claimed tile 不再留在中央捨牌池

### Interface / data shape

- `GameTableView` 需要一組可描述桌位相對位置的 view model，而不是只輸出平面卡片列表
- selector / view types 需要提供：
  - 玩家相對位置資訊
  - 各座位捨牌列表的顯示資料
  - 人類玩家已排序的 concealed hand 顯示資料
-  各玩家副露顯示資料
- `roundFlow` 需在 `claim-window` 裁決接受 `chi`、`pon`、`kan-exposed` 時同步更新捨牌池、暗手與 `melds`
- store state 與 core state shape 不因本次 change 整體改名或重構，只做最小必要狀態修補

### Failure modes

- 若真人玩家未固定在下方，視為版面 contract 失敗
- 若中央區域看不到任一家的捨牌內容，視為桌面資訊失敗
- 若人類玩家手牌仍以原始發牌順序或其他任意順序顯示，視為排序 contract 失敗
- 若玩家在吃、碰、槓後，claimed tile 仍留在捨牌池或消耗牌仍留在暗手，視為狀態同步失敗
- 若副露區未能顯示已形成的 `melds`，視為桌面狀態映射失敗
- 若 view 層自行推導規則合法性或改寫 store 流程，視為越界實作

### Acceptance criteria

- `tests/ui/game-table-view.test.ts` 驗證四家捨牌與桌位資訊可被渲染
- 新增 `tests/ui/game-table-layout.test.ts` 驗證玩家位於下方、其餘三家環繞中央桌面
- 既有互動測試至少保留一條驗證排序後手牌仍可正常出牌
- `tests/core/round-flow-claims.test.ts` 驗證 `chi`、`pon`、`kan-exposed` 裁決後會同步更新暗手、捨牌池與 `melds`
- `tests/ui/game-session.store.test.ts` 與 `tests/ui/game-table-layout.test.ts` 驗證副露與中央捨牌區在 UI 快照中保持一致
- `spectra analyze taiwan-mahjong-table-layout-and-discards --json` 通過

### Scope boundaries

**In scope**

- 桌位佈局
- 中央捨牌區呈現
- 人類手牌排序顯示
- 吃、碰、槓後副露與捨牌同步的最小必要規則修補
- 與上述需求直接相關的 selector / view type 調整

**Out of scope**

- 規則重寫
- AI 策略變更
- 新牌面素材
- 動畫與音效
- 手機版專用版型

## Risks / Trade-offs

- [Risk] 中央桌面與四個玩家區塊同時存在，容易讓 DOM 結構與樣式複雜化。 → Mitigation：先以明確的 seat-relative view model 切開桌位資料與版面資料，避免 template 內臨時拼接。
- [Risk] 手牌排序若直接改動 store state，可能影響既有互動測試。 → Mitigation：排序只放在 selector / display layer。
- [Risk] 捨牌區完整顯示後，現有測試可能大量依賴舊文案或舊結構。 → Mitigation：新增專門 layout test，並只更新必要的 UI assertions。
- [Risk] 把副露同步缺陷留在 core 會使 UI 永遠只能顯示錯誤狀態。 → Mitigation：先在 core 補上最小必要 state transition，再讓 selector / UI 直接映射。

## Migration Plan

1. 先補 selector / type contract，定義座位相對位置、顯示排序與副露顯示資料。
2. 再調整 `GameTableView` 結構，把中央捨牌區、四方座位佈局與副露區落地。
3. 補上 `claim-window` 裁決後的最小必要狀態同步修補，讓捨牌池、暗手與 `melds` 一致。
4. 最後補 core / store / UI 回歸測試與 Spectra 分析，確認 change 可進入 archive。

## Open Questions

- 本次沒有新增會阻擋實作的規格缺口；牌尺寸、每列捨牌張數與進階視覺細節保留到後續 change。
