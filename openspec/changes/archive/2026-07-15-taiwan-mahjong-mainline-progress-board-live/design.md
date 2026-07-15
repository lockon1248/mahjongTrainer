## Context

這個 repo 需要一份永遠存在的 current mainline board，但不代表同一個 change 必須永遠不封存。舊主線板可以是某一段期間的 current board，完成後應由 successor board 接手，然後舊板封存成歷史快照。

這樣才能同時滿足：

1. repo 內始終有一份 active 主線板
2. 完成的 change 必須封存
3. 不出現 task 全勾完卻仍留在 active 的矛盾狀態

## Goals / Non-Goals

**Goals:**

- 建立新的 live 主線板
- 封存前一份已完成的主線板
- 明確定義主線板的 successor handoff lifecycle

**Non-Goals:**

- 不改動目前產品主線內容
- 不變更 child change 的實作完成定義

## Decisions

### 主線板必須用 successor handoff 輪替

主線板不是永久不封存，而是：

1. 現任主線板存在於 `openspec/changes/`
2. 當它的建立/回填/交接任務完成後，開立 successor 主線板
3. successor 接手 current 狀態
4. predecessor 封存

### 活的主線板必須保留一個未完成的維護任務

current 主線板不能再次出現「所有 task 都完成但仍 active」。因此 live board 必須保留一個未完成的維護任務，表示它仍在當值；只有 successor 已建立並接手時，這個任務才完成。

## Implementation Contract

### Task 1: successor board 接手

- Observable behavior:
  - 新主線板成為 repo 內唯一 current board
  - 最新主線狀態與 active child change 資訊已轉移

### Task 2: predecessor board 封存

- Observable behavior:
  - 舊主線板在交接完成後正式 archive

### Task 3: lifecycle 規則落地

- Observable behavior:
  - 全域與 repo `AGENTS.md` 都明確禁止 completed-but-still-active 的主線板狀態

## Acceptance Criteria

- 新 active 主線板存在
- 舊主線板已 archive
- `AGENTS.md` 已寫明主線板交接規則

## Mainline Mapping

### 已完成

1. 基礎工程與前端殼層
   - `at-path-alias-imports`
   - `taiwan-mahjong-vue-table-shell`
2. 核心規則與 AI 基礎
   - `taiwan-mahjong-rule-config-foundation`
   - `taiwan-mahjong-core-foundation`
   - `taiwan-mahjong-round-flow-foundation`
   - `taiwan-mahjong-scoring-foundation`
   - `taiwan-mahjong-ai-decision-foundation`
3. 互動摸打與宣告主線
   - `taiwan-mahjong-interactive-turn-loop`
   - `taiwan-mahjong-human-claim-window`
   - `taiwan-mahjong-human-self-turn-actions`
   - `taiwan-mahjong-draw-outcome-and-dealer-flow`
   - `taiwan-mahjong-ui-round-result-sync`
   - `taiwan-mahjong-ai-claim-quality-pass`
4. 主線回歸驗證
   - `taiwan-mahjong-mainline-regression-pass`
   - `taiwan-mahjong-playwright-e2e-foundation`
5. UI 中文化與牌桌可讀性強化
   - `taiwan-mahjong-ui-zh-tw-default`
   - `taiwan-mahjong-table-layout-and-discards`
   - `taiwan-mahjong-table-layout-verification-pass`
6. 算台與特殊規則主線
   - `taiwan-mahjong-scoring-rules-and-tests`
7. 流局後續局 bugfix
   - `taiwan-mahjong-draw-next-round-progression`
8. 流局後續局 E2E 回歸
   - `taiwan-mahjong-draw-next-round-e2e-regression`
9. UI 規則驅動真實性稽核
   - `taiwan-mahjong-ui-rule-driven-truth-audit`

### 目前進行中

12. 和牌資訊 UI 新增與優化
   - current active child change：`taiwan-mahjong-center-discard-highlight-rules`
   - current phase：proposal / design / tasks
   - current focus：中央牌池白 / 紅 / 黃宣告高亮、紅黃共存、AI 和牌亮手證明
   - 主線 task 完成條件：本 change 完成 UI code、unit tests、browser E2E 並 archive 後回填

### 尚未開始

13. 和牌資訊 UI 下一段增強
  - 胡牌時顯示台數計算內容彈窗
  - 其他終局資訊呈現強化
  - 依賴目前中央牌池高亮與 AI 亮手證明先完成

## Completion Conditions

1. 基礎工程與前端殼層
   - Vue app、router、Pinia 與牌局入口都已可啟動
2. 核心規則與 AI 基礎
   - rules、scoring、AI foundation 與 rule config 已可被 store 使用
3. 互動摸打與宣告主線
   - 真人與 AI 能完整完成基本摸打、宣告、流局與下一局銜接
4. 主線回歸驗證
   - typecheck、core/store/UI 主線測試已形成穩定回歸基線
5. UI 中文化與牌桌可讀性強化
   - 預設介面為中文，玩家固定下方、中央牌池可見、副露與捨牌同步
6. 算台與特殊規則主線
   - `0 台起胡`、`天胡 24`、`大三元 8`、`小三元 4` 已落地於 scoring、UI 與 browser E2E
7. 流局後續局 bugfix
   - flow 結果與下一局續局邏輯已修正
8. 流局後續局 E2E 回歸
   - 流局結果畫面到下一局的瀏覽器回歸已固定
9. UI 規則驅動真實性稽核
   - 假 UI 已盤點並移除未驅動的 `聽牌` 與 `玩家分數`
10. 完整牌型台數規格
   - `classic-taiwan` / `flower-wind-bonus` 雙 profile、權威牌型目錄、測試矩陣與 E2E 契約已完成並 archive
11. 完整牌型台數實作與驗證
   - scoring code、測試與 E2E 已全部落地並 archive
12. 和牌資訊 UI 新增與優化
   - 待中央牌池宣告高亮與 AI 亮手證明完成後回填
13. 和牌資訊 UI 下一段增強
   - 待胡牌彈窗與其他終局資訊呈現完成後回填

## Update Rules

- 任何 child change 完成並 archive 後，必須同步更新本 board。
- 若 active child change 變更，本 board 必須在同一輪工作內更新 `current active child change` 與 `next planned child change`。
- 若下一步需求尚未定案，只能標記為待建立，不得自行補功能名稱與規格內容。
- 若主 spec 新增會影響主線的段落，必須先更新這份 board，再開始對應 child change。
