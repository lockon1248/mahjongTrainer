## Context

repo workflow 要求兩件事同時成立：

1. repo 內必須永遠有一份 active mainline board
2. 只有完成實作、完成驗證、正式 archive 的 child change 才能被主線當成完成

目前這份 board 已重新接手 active 主線，recent child changes 的 archive 已補齊，明槓補牌 bugfix 也已正式 archive。最新一輪主線需求中的 `taiwan-mahjong-concealed-kong-visibility` 與 `taiwan-mahjong-match-stakes-and-victory-setup` 也都已在 2026-07-16 完成實作、驗證與正式 archive。這份 board 必須把這兩份 child changes 回填到 completed，並清掉過時的 current / next planned mapping。

## Goals / Non-Goals

**Goals:**

- 恢復一份 active mainline board
- 讓 active board 如實反映目前已完成的最新 child changes
- 清除已失效的 current active / next planned child change 狀態
- 保持下一輪主線需求尚未定義前的 truthfulness

**Non-Goals:**

- 不在這個 change 內新增任何產品功能
- 不重寫歷史 archive 內容
- 不替下一個尚未定案的 child change 命名

## Decisions

### 先修正主線 truth，再談下一步

這份 board 的第一責任是回答「現在做到哪裡」。因此它必須先如實反映：

- `taiwan-mahjong-center-discard-highlight-rules`、`taiwan-mahjong-unocss-and-shared-enums`、`taiwan-mahjong-dealer-rotation-and-turn-pace`、`taiwan-mahjong-ai-turn-stability`、`taiwan-mahjong-ai-decision-quality` 都已在 2026-07-16 正式 archive
- 玩家回報的明槓後少一張活牌 bug 已完成 root-cause 修正、驗證與正式 archive，需立即回填 completed mainline item
- `taiwan-mahjong-concealed-kong-visibility` 與 `taiwan-mahjong-match-stakes-and-victory-setup` 都已完成 archive，主線不應再繼續把它們標示成 current active / next planned

### 已 archive 的 recent changes 要回填到 completed，不得繼續假裝待盤點

只要 child change 已完成實作、完成驗證並正式 archive，就必須同步回填到 completed 區塊；否則主線會繼續顯示過時真相。

### active board 保留一個未完成維護 task

這份 board 會保留一個未完成維護 task，直到下一份 successor board 接手。這避免再次出現「board 任務全勾完卻仍 active」的矛盾狀態。

## Implementation Contract

### Task 1: 恢復 active 主線板

- Observable behavior:
  - `openspec/changes/` 內重新存在一份 active mainline board change。
  - 這份 board 能直接回答目前 completed / in-progress / not-started 狀態。

### Task 2: 依 archive 與驗證結果回填真實狀態

- Observable behavior:
  - 已 archive 的近期 child changes 被回填到 completed mainline items。
  - board 明確揭露 `taiwan-mahjong-exposed-kan-replacement-draw-fix` 已完成並 archive。
- board 將 `taiwan-mahjong-concealed-kong-visibility` 回填為 completed mainline item。
- board 將 `taiwan-mahjong-match-stakes-and-victory-setup` 回填為 completed mainline item。
- board 明確標示目前尚無新的 active child change，等待下一份主線需求定義。

### Task 3: 維持 successor handoff lifecycle

- Observable behavior:
  - 本 board 保留一個未完成維護 task。
  - 下一個 child change 完成 archive，或下一份 successor board 建立時，這份 board 才能退役。

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
  - `taiwan-mahjong-center-discard-highlight-rules`
  - `taiwan-mahjong-unocss-and-shared-enums`
6. 算台與特殊規則主線
   - `taiwan-mahjong-scoring-rules-and-tests`
   - `taiwan-mahjong-complete-scoring-catalog`
   - `taiwan-mahjong-complete-scoring-implementation`
7. 流局後續局 bugfix 與回歸
   - `taiwan-mahjong-draw-next-round-progression`
   - `taiwan-mahjong-draw-next-round-e2e-regression`
8. UI 規則驅動真實性稽核
   - `taiwan-mahjong-ui-rule-driven-truth-audit`
9. AI 與回合節奏強化
   - `taiwan-mahjong-dealer-rotation-and-turn-pace`
   - `taiwan-mahjong-ai-turn-stability`
   - `taiwan-mahjong-ai-decision-quality`
10. 明槓補牌 bugfix
   - `taiwan-mahjong-exposed-kan-replacement-draw-fix`
11. 固定視窗舞台
   - `taiwan-mahjong-fixed-viewport-stage`
12. 暗槓資訊保密
   - `taiwan-mahjong-concealed-kong-visibility`
13. 開局籌碼與勝負條件設定
   - `taiwan-mahjong-match-stakes-and-victory-setup`
   - `taiwan-mahjong-match-setup-minimum-chips-guard`
   - `taiwan-mahjong-match-setup-validation-feedback`
14. 固定舞台視覺尺度調整
   - `taiwan-mahjong-game-stage-scale-tuning`
15. 固定舞台橫向寬度放大
   - `taiwan-mahjong-stage-width-expansion`
16. 固定舞台高度緊縮
   - `taiwan-mahjong-stage-height-compaction`
17. 固定舞台桌機比例平衡
   - `taiwan-mahjong-stage-desktop-balance`
18. 固定舞台面積再平衡
   - `taiwan-mahjong-stage-area-rebalance`

### 目前進行中

- 目前 active child change：`taiwan-mahjong-stage-area-rebalance`
- next planned child change：待本次桌機舞台比例修正完成後再定義

目前正修正桌機下遊戲區面積分配：在不改 header 與上方資訊列的前提下，進一步減少左右留白、放大中央牌桌存在感，並壓縮底部玩家區的空洞感。

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
   - 預設介面為中文，玩家固定下方、中央牌池可見、副露與捨牌同步，且共用展示常數 / utility style foundation 已落地
6. 算台與特殊規則主線
   - `classic-taiwan` / `flower-wind-bonus` profile、scoring code、UI 與 browser E2E 已落地
7. 流局後續局 bugfix 與回歸
   - 流局結果畫面到下一局的流程與 browser 回歸已固定
8. UI 規則驅動真實性稽核
   - 假 UI 已盤點並移除未驅動欄位
9. AI 與回合節奏強化
   - AI 自動推進具備穩定 phase continuity、約兩秒節奏與較佳出牌 / 宣告 heuristic，且三份 child changes 已正式 archive
10. 明槓補牌 bugfix
   - `kan-exposed` 已完成槓後補牌、花牌連補與對應 core regression，並正式 archive
11. 固定視窗舞台
   - 對局畫面已可在桌機／平板維持單一固定視窗舞台，並有 browser 驗證保護無主頁捲軸回歸
12. 暗槓資訊保密
   - 非擁有者看不到 AI 暗槓牌值，且 AI 也不會從 runtime context 讀到其他座位的暗槓牌值
13. 開局籌碼與勝負條件設定
   - 開局前可設定初始籌碼與勝利條件，並支援破產結束或四風圈結算的整場 closure，且初始籌碼最低值已收斂為 `100`，不合法值會在 setup modal 內直接提示原因
14. 固定舞台視覺尺度調整
   - 在保留全站 header 與現有資訊列樣式的前提下，遊戲主舞台需進一步放大，減少縮放後多餘留白，讓牌桌與玩家區佔據更高比例的可用視窗空間
15. 固定舞台橫向寬度放大
   - 在保留全站 header 與上方資訊列內容／樣式不變的前提下，固定舞台需進一步擴大 `game-stage-scaler` 與牌桌三欄的橫向佔比，減少寬螢幕下過量左右留白
16. 固定舞台高度緊縮
   - 在保留全站 header 與上方資訊列內容／樣式不變的前提下，固定舞台需進一步壓縮牌桌本體原始高度，提升實際縮放倍率，讓牌桌不再因內容過高而縮在中央
17. 固定舞台桌機比例平衡
   - 在大桌機 viewport 下，固定舞台需維持放大後但不過度攤平的桌面比例，避免 `scale = 1` 時牌桌變成不自然的滿寬布局
18. 固定舞台面積再平衡
   - 在保留全站 header 與上方資訊列內容／樣式不變的前提下，固定舞台需進一步提升遊戲區對桌機可用寬度的利用率，減少左右留白，讓中央牌桌與底部玩家區回到更正常的桌面密度

## Update Rules

- 任何 child change 完成並 archive 後，必須同步更新本 board。
- 若 `current active child change` 變更，本 board 必須在同一輪工作內更新。
- 若下一步需求尚未定案，只能保留為待開立，不得自行補正式功能名稱。
- 若建立 successor board，必須在同一輪封存本 board。
