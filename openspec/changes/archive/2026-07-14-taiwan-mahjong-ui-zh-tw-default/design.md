## Context

目前 `GameView` 與 `GameTableView` 已能顯示牌局狀態與操作入口，但畫面仍直接暴露 route 路徑、座位 enum、階段 enum、結果 enum 與 tile id 字串。這些資料對規則層與測試有價值，對玩家介面則屬於 raw/debug 顯示。

本 repo 已明確要求產品 UI 預設為繁體中文，因此這次變更需要在不修改 round flow、store 規則與操作流程的前提下，收斂 view model 與 component 的顯示邊界。

## Goals / Non-Goals

**Goals:**

- 將遊戲頁標題、摘要欄位、玩家欄位、結果摘要與操作按鈕改為繁體中文玩家文案。
- 將座位、階段、宣告、結果與牌張名稱格式化為玩家可讀文字。
- 保持現有 `data-testid`、事件流與互動流程，讓既有 UI 測試可最小調整後繼續驗證。

**Non-Goals:**

- 不修改麻將規則、判定邏輯、AI 決策或 store 狀態流。
- 不新增新的操作面板、動畫或資訊架構。
- 不處理完整美術化牌面，只先將 raw tile id 轉成可讀中文牌名。

## Decisions

### 由 view component 負責產品文案格式化

座位、階段、宣告、結果與牌張目前都已存在穩定資料來源，不需要為了中文化去改 core 型別。最小 diff 做法是在 `GameTableView` 內新增格式化 helper，將 enum 與 tile 物件轉為中文 UI 文案。

這樣可以保留目前 snapshot 與互動事件格式，避免為了顯示語言污染規則層。

### 保留摘要資訊，但移除 raw/debug 語氣

現有摘要區塊已提供玩家需要的桌況資訊，因此不重排整個版面。這次只將 `dealer`、`turn`、`phase`、`claim`、`outcome` 等字樣改成繁中，並把值改成中文玩家用語，而不是 route 名稱或 raw enum。

### 牌張先用中文文字，不重做圖像牌面

目前畫面最主要問題是 `characters-1` 這種 raw id，先改成 `一萬`、`九萬`、`東風` 這類中文牌名即可達成「玩家可讀」。圖像牌面屬於另一個獨立 UI change，不在本次處理。

## Implementation Contract

**Behavior**

- 遊戲頁標題不得再顯示 `/game`，而必須顯示繁體中文標題。
- 牌桌摘要中的標籤與值必須使用繁體中文玩家文案。
- 玩家區塊中的座位名稱與統計欄位必須使用繁體中文。
- 人類玩家手牌按鈕與宣告 / 自回合動作按鈕不得再顯示 raw tile id 或 raw action enum，而必須顯示中文可讀文字。
- 結果摘要中的結果類型、是否結束、胡牌者、放槍者、流局原因與台數欄位必須使用繁體中文格式。

**Interface / data shape**

- `GameTableSnapshotViewModel` 的核心資料形狀維持不變。
- `GameView` 與 `GameTableView` 的 props、emits、`data-testid` 維持不變。
- 中文化主要透過 component 內部格式化函式完成；若 selector 需要增加輔助欄位，也只能是顯示層欄位，不得改動規則語義。

**Failure modes**

- 若某個值沒有對應中文文案，畫面不得回退成 route 或原始 enum；必須提供明確的中文 fallback。
- 若牌張格式化失敗，不得顯示 `suit-rank` 原字串。

**Acceptance criteria**

- `tests/ui/game-table-view.test.ts`
- `tests/ui/human-claim-window.test.ts`
- `tests/ui/human-self-turn-actions.test.ts`
- `tests/ui/interactive-turn-loop.test.ts`
- `tests/ui/round-result-sync.test.ts`
- 必要時補跑 `tests/ui/next-round-flow.test.ts` 與 `tests/ui/mainline-playable-flow.test.ts`

**Scope boundaries**

- In scope: 中文文案、中文格式化、移除 raw/debug 顯示、更新對應 UI 測試。
- Out of scope: 視覺重設計、牌面圖像化、規則調整、AI 行為調整。

## Risks / Trade-offs

- [Risk] 測試目前綁定英文或 raw 字串 → Mitigation：同步更新受影響 UI 測試，只改文案預期，不改互動斷言。
- [Risk] 在 component 內加入過多格式化邏輯造成元件膨脹 → Mitigation：只保留純格式化 helper，不把規則判斷搬進 view。
