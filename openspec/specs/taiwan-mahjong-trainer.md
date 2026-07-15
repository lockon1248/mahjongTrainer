# 台灣 16 張麻將練習器

## 摘要

建立一個純前端、桌機瀏覽器優先的台灣 16 張麻將遊戲，並保留後續做 `RWD` 的空間。第一版是完整的單機牌桌：1 位真人玩家，3 位 AI 玩家。

## 產品目標

- 在瀏覽器中提供可完整進行基本牌局流程的台灣 16 張麻將
- 規則正確性優先於 UI 完成速度
- 胡牌判定與算台邏輯必須清楚、可測試、可獨立於 Vue UI
- 體驗偏向真實對局，而不是提示導向練習器

## 非目標

- 不做後端 API
- 不做資料庫
- 不做登入／帳號系統
- 不做線上多人對戰
- `v1` 不做進度、設定、戰績保存
- `v1` 不做回放系統

## 已確認需求

- 技術棧：`Vue 3`、`Vue Router`、`Pinia`、`Vite`、`TypeScript`
- 套件管理器：`npm`
- 執行環境：`Node.js 22`
- 規則：台灣 16 張麻將
- 算台 profile：需支援 `classic-taiwan` 與 `flower-wind-bonus` 兩套可切換規則
- 模式：1 位真人玩家 + 3 位 AI
- 產品方向：偏真實對局感
- 平台：桌機瀏覽器優先，但後續需能延伸 `RWD`
- AI 目標：中階，具基本牌效判斷與主動吃碰槓能力
- 開發順序：規則引擎優先，UI 延後

## 尚未定案的規則

以下項目不得在實作時自行猜測，必須集中記錄在 rules baseline 文件中：

- 台型完整清單
- 特殊胡型是否採用
- 莊家流局是否連莊
- 搶槓規則
- 是否封頂
- 低關聯房規加成是否納入第一版練習器

## 權限與邊界

### 使用者權限

`v1` 沒有帳號系統，因此不存在 admin / member / guest 這種角色差異。

- 所有功能都對本機使用者開放
- 不存在登入後才可用的功能
- 不存在多人資料隔離問題

### 瀏覽器能力權限

`v1` 不得依賴下列瀏覽器權限：

- 相機
- 麥克風
- 定位
- 通知
- 剪貼簿寫入
- 本地檔案系統讀寫

可接受的唯一額外能力：

- 音效播放
  - 但必須在使用者互動後才啟用，避免 autoplay 限制

### 資料存取權限

`v1` 不應主動依賴：

- `localStorage`
- `sessionStorage`
- `IndexedDB`

除非後續需求明確要求保存設定或進度，否則牌局資料只存在記憶體中。

### 網路權限

`v1` 不依賴任何後端 API：

- 不呼叫外部遊戲服務
- 不同步牌局資料
- 不上傳戰績

### 程式層邊界

- `src/core` 不可依賴 Vue、Pinia、DOM API
- `src/stores` 不可自行實作胡牌與算台規則
- `src/views` 不可自行判斷動作是否合法
- `tests/docs` 只驗證文件內容
- `tests/core` 只驗證核心邏輯

## 架構

### 目錄邊界

```text
src/
  core/
    index.ts
    tiles/
    rules/
    scoring/
    ai/
    testing/
  stores/
  router/
  views/
    home/
    game/
      components/
      composables/
      dialogs/
      types.ts
    rules/
tests/
  smoke/
  core/
  docs/
```

### 核心層

`src/core` 放純 TypeScript 邏輯：

- `tiles`：牌型別、排序、牌組生成、花牌判定
- `rules`：合法動作、摸打流程、宣告窗口、補花、流局、莊家流程
- `scoring`：胡牌成立、牌型拆解、台型比對、衝突處理、結算輸出
  - 必須可依 scoring profile 切換台型目錄與計台規則
- `ai`：出牌決策、吃碰槓決策、中階牌效策略
- `testing`：共用規則案例 schema 與 builder

### Store 層

`src/stores` 負責 session 狀態協調，所有規則與算台都委派給 `src/core`。

### View 層

`src/views` 放路由頁與頁面專用 UI。它可以渲染狀態與送出動作，但不得擁有規則判定。

## 狀態模型

### `table`

- 牌牆
- 捨牌區
- 局風／圈風資訊
- 莊家資訊

### `players`

- `seat`
- `concealedTiles`
- `melds`
- `flowers`
- `score`
- `declaredReady`

### `turn`

- 當前輪到誰
- 當前階段
- 上一個動作

### `actionState`

- 目前可執行動作
- 是否存在待處理的宣告窗口

### `result`

- 胡牌或流局結果
- 胡牌家
- 放槍家
- 台型明細
- 總台數
- scoring profile

## 資料流

1. `GameTableView` 建立新牌局
2. `Pinia` 初始化牌牆、發牌、補花、莊家與回合狀態
3. 玩家或 AI 發出動作
4. `store` 將動作送入 `core/rules`
5. `core/rules` 回傳新的合法局面
6. 若需要結算，再由 `core/scoring` 處理
7. `store` 更新狀態
8. Vue 僅負責顯示狀態

## 必要規則文件

在開始實作算台前，必須先定義：

1. 基本桌規
2. 合法動作規則
3. 胡牌成立條件
4. 台型清單
5. 結算規則
6. 待確認／爭議規則
7. 規則對應測試案例

## 交付階段

### 階段 1

- design / spec 對齊
- rules baseline
- rule test matrix
- domain model
- rule-case schema

### 階段 2

- 牌型拆解
- 胡牌成立判定
- 台型比對
- 結算輸出
- 完整牌型台數規格
  - 補齊所有牌型、台數值、可否疊加、特殊胡型成立條件與測試矩陣
  - 補齊 `classic-taiwan` 與 `flower-wind-bonus` 兩套 profile 的差異規則

### 階段 3

- 發牌
- 補花
- 摸打循環
- 宣告流程
- 流局／莊家處理
- 中階 AI

### 階段 4

- Vue app scaffold
- router
- pinia
- 牌桌 UI
- 和牌資訊 UI
  - 玩家胡牌時顯示台數計算內容彈窗
  - AI 和牌時顯示其和牌牌型

## 驗證策略

- 程式碼變更採 test-first
- `core/scoring` 測試優先
- `core/rules` 次之
- UI 測試延後

## 風險

- 台灣 16 張桌規差異大
- AI 範圍容易膨脹
- 多人宣告時機容易讓狀態協調變脆弱
