## Context

主 spec `openspec/specs/taiwan-mahjong-trainer.md` 已經定義產品目標、架構邊界、交付階段與主線流程，但它不是拿來追蹤每個實作 change 進度的工作單。repo 內真正發生的實作是散落在多個 archived change 與目前進行中的 active change 內，因此如果沒有一份總主線 change，就很難直接回答「現在做到哪裡」「下一步是哪一個 change」。

這份 design 的角色不是新增產品設計，而是定義主 spec 與子 change 的映射方式，讓主線進度可以被穩定維護。它必須做到三件事：

1. 把主 spec 的交付階段拆成可追蹤的主線段落。
2. 把每個主線段落映射到既有 archived change 或下一個 planned change。
3. 規定之後任何子 change 完成時，要如何回填主線總表。

## Goals / Non-Goals

**Goals:**

- 讓主線總表能一眼看出已完成、進行中、未開始。
- 讓每個主線段落都能對回主 spec 的交付階段或產品目標。
- 讓每個主線段落至少有一個明確的 change 名稱作為落地單位。
- 讓後續更新只需改一處，不必重新翻 archive 才知道進度。

**Non-Goals:**

- 不重新定義 capability spec。
- 不替未定案桌規做新決策。
- 不把實作細節全部複製到這份總表內。

## Decisions

### 主線總表以產品可玩路徑排序，而不是按建立日期排序

主線排序依「距離完整可玩還缺什麼」來排，而不是依 archived change 建立順序。原因是使用者要看的是下一步要做什麼，不是歷史時間線。

### 主線段落直接對應主 spec 的交付階段與核心流程

總表中的「基礎工程與前端殼層」「核心規則與 AI 基礎」「互動摸打第一段」「真人 claim-window 宣告」等段落，都是從主 spec 的 `交付階段`、`資料流`、`核心層 / Store 層 / View 層` 抽出的主線節點，而不是臨時命名的任務堆。

### 已完成項目只能用 archived change 或已完成 active change 回填

主線總表的打勾依據只能來自：

- `openspec/changes/archive/*`
- 已存在且已完成的 active change
- 已經落在程式碼與測試中的能力

不能因為「看起來差不多有了」就自行打勾。

### 主線 change 只記錄總控資訊，子 change 仍保留實作細節

主線 change 負責回答：

- 做到哪裡
- 下一步是哪個 change
- 完成某段主線的標準是什麼

子 change 負責回答：

- 這一步怎麼做
- 會改哪些 spec / 檔案
- 測試怎麼驗證

## Mainline Mapping

### 已完成主線段落

1. 基礎工程與前端殼層
   - `at-path-alias-imports`
   - `taiwan-mahjong-vue-table-shell`
2. 核心規則與 AI 基礎
   - `taiwan-mahjong-rule-config-foundation`
   - `taiwan-mahjong-core-foundation`
   - `taiwan-mahjong-round-flow-foundation`
   - `taiwan-mahjong-scoring-foundation`
   - `taiwan-mahjong-ai-decision-foundation`
3. 互動摸打主線第一段
   - `taiwan-mahjong-interactive-turn-loop`

### 目前進行中主線段落

4. 真人 `claim-window` 宣告
   - `taiwan-mahjong-human-claim-window`

### 後續預定主線段落

5. 真人自回合動作完整化
   - 預定 change：`taiwan-mahjong-human-self-turn-actions`
6. 流局與莊家流程
   - 預定 change：`taiwan-mahjong-draw-outcome-and-dealer-flow`
7. 結算結果接回 UI
   - 預定 change：`taiwan-mahjong-ui-round-result-sync`
8. AI 主線補強
   - 預定 change：`taiwan-mahjong-ai-claim-quality-pass`
9. 主線回歸驗證
   - 可能拆成總整合驗證 change，或在最後一個主線 change 內完成

## Update Rules

- 任何 active 子 change 完成並 archive 後，必須同步更新 `tasks.md` 的勾選狀態。
- 若主線順序改動，必須同時更新本檔 `Mainline Mapping` 與 `tasks.md`。
- 若某個預定 change 因為 scope 過大被拆分，主線總表必須把原項目改成多個明確子項，不可保留模糊名稱。
- 若主 spec 新增一個會影響可玩主線的段落，必須先更新這份總表，再開始實作。

## Acceptance Criteria

- 使用者只看這個 change，就能知道主線已完成到哪裡。
- 每個已打勾項目都能對應到實際 archived change。
- 下一個要做的 change 在總表中是明確且唯一的。
- 完成任何一個主線子 change 後，都能無歧義地回來更新本 change。
