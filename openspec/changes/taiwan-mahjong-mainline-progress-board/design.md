## Context

目前 repo 的產品主線並不是靠單一 capability spec 追蹤，而是透過 mainline change 把主 spec、已歸檔 child changes、目前 active child change 與下一步 planned child change 串成一條可讀主線。先前的 `taiwan-mahjong-mainline-playable-v1` 已經完成它在 playable v1 階段的整理工作，但在牌桌 UI 可讀性與狀態一致性補完之後，repo 內沒有新的 active 主線 progress board。

如果現在不補上這份總表，之後就只能重新翻 archive 才知道最新進度，這違反此 repo 的主線 change 規則。

## Goals / Non-Goals

**Goals:**

- 讓 repo 內始終存在一份 active 主線 progress board。
- 讓使用者可以直接從這份 board 看見已完成、進行中、尚未開始。
- 讓每個主線段落都對應回主 spec 的交付階段或產品路徑。
- 讓剛完成的 child change 在同一個工作循環內被同步到主線。

**Non-Goals:**

- 不新增產品需求或產品規格。
- 不替尚未定案的下一個 child change 補 proposal 細節。
- 不把 archived child change 的實作細節整份複製到主線板。

## Decisions

### 主線 progress board 必須維持 active，而不是只留 archived 歷史表

主線 board 的用途是回答現在進度與下一步，因此不能只靠 archived change。archived change 可以保留歷史快照，但 repo 內仍需有一份 active board 作為現在式進度表。

### 已完成項目只以已歸檔 child change 或已落地程式狀態回填

任何已勾選主線任務都必須對應到實際完成並可被追溯的 child change，不能因為「感覺差不多做過」就打勾。

### 目前進行中主線項目只保留一個

這份 board 只允許一個目前進行中主線項目，避免同時開多個模糊下一步。若下一個 child change 尚未正式建立，進行中項目就維持在「依最新 spec 開立下一個 child change」。

### 主線 task 只有在對應 child change 完成並封存後才能打勾

主線 board 的 task 代表產品主線工作完成，不代表 change 已開立。因此 `proposal / design / tasks` 建立完成只能更新狀態欄位，不能讓主線 task 打勾。只有當對應 child change 實作完成、驗證完成、正式 archive，主線 task 才能標記完成。

### 未定案的下一個 child change 不得自行命名補完

使用者已明確要求不可猜需求，因此主線 board 可以指出「下一個 child change 待開立」，但不能替它發明功能範圍或正式 change 名稱。

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

### 目前進行中

7. 目前沒有 active child change
   - current active child change：`none`
   - next planned child change：待新的主 spec child change 建立後回填
   - 主線 task 完成條件：新 child change 建立後再回填

### 尚未開始

8. 下一個 child change 實作與驗證
  - 待 proposal / design / tasks 建立後回填

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
7. 下一個 child change 實作與驗證
   - 待該 change 完成並 archive 後再回填

## Update Rules

- 任何 child change 完成並 archive 後，必須同步更新本 board。
- 若 active child change 變更，本 board 必須在同一輪工作內更新 `current active child change` 與 `next planned child change`。
- 若下一步需求尚未定案，只能標記為待建立，不得自行補功能名稱與規格內容。
- 若主 spec 新增會影響主線的段落，必須先更新這份 board，再開始對應 child change。
