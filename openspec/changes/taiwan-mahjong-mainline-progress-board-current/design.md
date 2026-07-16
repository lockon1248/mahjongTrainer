## Context

repo workflow 要求兩件事同時成立：

1. repo 內必須永遠有一份 active mainline board
2. 只有完成實作、完成驗證、正式 archive 的 child change 才能被主線當成完成

目前這份 board 已重新接手 active 主線，但 recent child changes 的狀態在前一輪曾發生誤封存與未驗證先勾選，因此必須先回到「現在式真相」：哪些 child change 已正式 archive、哪一份仍未完成、下一份 change 會接哪個主線缺口。

## Goals / Non-Goals

**Goals:**

- 恢復一份 active mainline board
- 讓 active board 如實反映目前唯一未完成 child change
- 明確標示下一份 planned child change
- 把已知驗證失敗的 `taiwan-mahjong-dealer-rotation-and-turn-pace` 保持未完成

**Non-Goals:**

- 不在這個 change 內新增任何產品功能
- 不重寫歷史 archive 內容
- 不替下一個尚未定案的 child change 命名

## Decisions

### 先修正主線 truth，再談下一步

這份 board 的第一責任是回答「現在做到哪裡」。因此它必須先如實反映：

- `taiwan-mahjong-center-discard-highlight-rules` 已在 2026-07-16 正式 archive
- `taiwan-mahjong-unocss-and-shared-enums` 已在 2026-07-16 正式 archive
- `taiwan-mahjong-dealer-rotation-and-turn-pace` 因 `tests/ui/interactive-turn-loop.test.ts` 失敗，明確不能視為完成
- 下一份 child change 先拆成 `taiwan-mahjong-ai-turn-stability` 與 `taiwan-mahjong-ai-decision-quality` 兩份，且只能作為 planned child changes，不能覆蓋仍未完成的 current active child change

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
  - `taiwan-mahjong-center-discard-highlight-rules` 與 `taiwan-mahjong-unocss-and-shared-enums` 被回填到 completed mainline items。
  - board 明確揭露目前唯一未完成的 child change 是 `taiwan-mahjong-dealer-rotation-and-turn-pace`。
  - board 明確標示下一份 planned child changes 依序是 `taiwan-mahjong-ai-turn-stability`、`taiwan-mahjong-ai-decision-quality`。
  - `taiwan-mahjong-dealer-rotation-and-turn-pace` 的完成條件明確包含補齊失敗測試與重跑驗證。

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

### 目前進行中

9. 輪莊 / 節奏 change 收尾
   - `taiwan-mahjong-dealer-rotation-and-turn-pace`
   - completion condition：已補齊約兩秒 AI 節奏與對應驗證，並完成正式 archive

### 尚未開始

10. 下一個 child change 待定
   - current active child change：none
   - next planned child change：待使用者下一步需求
   - completion condition：新的主線缺口被識別並開立對應 child change

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
9. 輪莊 / 節奏 change 收尾
   - `taiwan-mahjong-dealer-rotation-and-turn-pace` 已完成實作、補齊驗證並正式 archive
10. AI 自動推進穩定性強化
   - AI 自動推進具備穩定的 phase continuity、claim-window 人類介入停頓與終局到下一局重置保護
11. AI 決策品質強化
   - AI 的出牌與宣告 heuristic 已補強到符合中階練習對局的基本品質要求

## Update Rules

- 任何 child change 完成並 archive 後，必須同步更新本 board。
- 若 `current active child change` 變更，本 board 必須在同一輪工作內更新。
- 若下一步需求尚未定案，只能保留為待開立，不得自行補正式功能名稱。
- 若建立 successor board，必須在同一輪封存本 board。
