## Context

上一份固定舞台調整已經把整頁捲軸問題壓住，但使用者實際檢視後指出真正還沒解掉的地方：在寬螢幕下，遊戲區左右仍保留大量空白，而核心原因不是上方資訊列，而是 `game-stage-frame` / `game-stage-scaler` 的寬度上限過窄，加上牌桌三欄比例偏保守，導致整體仍像縮在中央。

這次需求已經明確收斂：上方資訊列不要動，header 也不要動，只做橫向放寬，讓遊戲區在桌機寬螢幕下真正把主視覺區域吃滿。

## Goals / Non-Goals

**Goals:**

- 放寬固定舞台的橫向寬度上限，減少寬螢幕下的左右留白。
- 讓牌桌三欄比例與舞台寬度同步放大，避免只放大外框卻讓內容仍顯得縮在中間。
- 保留全站 header 與上方資訊列內容／樣式不變。
- 維持固定舞台與無主頁垂直捲軸行為。

**Non-Goals:**

- 不修改 header 文案、導覽或樣式。
- 不修改上方資訊列的欄位、資訊分組或卡片樣式。
- 不重做手機版資訊架構或整個牌桌視覺主題。
- 不在本 change 內移除縮放機制或重寫整個固定舞台演算法。

## Decisions

### 直接放寬 `game-stage-scaler`，而不是再修外層留白

上一輪的錯誤在於只調外框留白，沒有動到真正限制寬度的 `game-stage-frame` / `game-stage-scaler`。這次直接從這兩層下手，放寬最大寬度與橫向使用率，讓寬螢幕下的遊戲舞台先拿回主視覺空間。

### 牌桌內部三欄也要一起放寬

如果只把外層 scaler 拉寬，但 `mahjong-table` 仍維持偏保守的 `0.85fr / 1.3fr / 0.85fr` 分配，畫面仍會顯得中央擁擠、兩側保守。因此這次要同步調整三欄比例，讓左右玩家區與中央牌池一起跟著吃寬度。

### 保持固定舞台與上方資訊列不動

使用者已明確指定上方資訊列不要動，因此這次不能再用壓縮資訊列高度的方式偷拿空間。所有放大都必須來自橫向寬度策略與牌桌欄位分配。

## Implementation Contract

### Behavior

- 遊戲頁在桌機寬螢幕下 MUST 讓 `game-stage-frame` / `game-stage-scaler` 比前一版使用更高比例的可用寬度，顯著減少左右留白。
- 放寬後的牌桌內容 MUST 同步放大，不能只出現更寬的外框但內部玩家區與中央牌池仍維持舊版保守寬度感。
- 全站 header 與上方資訊列內容／樣式 MUST 保持不變。
- 放寬橫向寬度後 MUST 仍維持固定舞台與無主頁垂直捲軸。

### Interface / data shape

- 不新增任何 domain state。
- 只允許修改 `GameView.vue` 的 stage width strategy、`GameTableView.vue` 的桌面 grid 配置與對應驗證。
- 驗證需能指出新的 stage class / layout 語意，避免 reviewer 無法分辨這次是否真的改到橫向佔比。

### Failure modes

- 若寬螢幕下左右留白仍接近前一版，視為失敗。
- 若為了放大而動到 header 或上方資訊列內容／樣式，視為超出 scope。
- 若放寬後重新出現主頁捲軸，也視為失敗。
- 若只拉大外框，內部牌桌欄位比例沒有跟著放寬，導致視覺上仍不明顯，視為未達標。

### Acceptance criteria

- UI 測試能辨認遊戲舞台採用新的橫向放寬語意。
- UI 或 layout 測試能辨認牌桌採用新的較寬三欄配置，而不是沿用前一版保守比例。
- Browser 驗證需再次確認首頁進牌局後仍無主頁垂直捲軸，且遊戲舞台在桌機寬度下佔用更高比例的 viewport width。

### Scope boundaries

- In scope：`src/views/game/GameView.vue`、`src/views/game/components/GameTableView.vue`、對應 UI tests、對應 e2e smoke 驗證、主線 board 同步。
- Out of scope：上方資訊列重排、header 改版、固定舞台演算法全面重寫、手機專用版。

## Risks / Trade-offs

- [寬度拉大後中央與左右欄比例失衡] → 一起調整 `mahjong-table` 三欄比例，避免只放大外框。
- [寬度變大後觸發新的高度縮放] → 仍用 browser 驗證鎖住無主頁捲軸與固定舞台語意。
- [scope drift 回到資訊列或 header] → design 與 tasks 明確寫死「上方資訊列不動」。
