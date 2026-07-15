## Context

目前中央牌池已經能正確顯示四家捨牌區，也會把各池最後一張捨牌用同一種樣式高亮。但在真人 `claim-window` 決策時，這個訊號不足以表達「只有上一家最後一張可吃」、「當前捨牌可碰或明槓」、「當前捨牌可放槍胡牌」三種不同決策語意。另一方面，終局結果雖然已有台型與總台數摘要，但當 AI 和牌時，畫面仍看不到它最終公開的手牌與副露，缺少玩家核對結果的證明資訊。既有 core 與 store 已經提供 `claimCandidates`、`currentSeat`、`phase`、各家 discard pool、終局結果與玩家手牌 / 副露快照，因此這次不需要再新增規則邊界，而是要把這些既有輸入整理成更精確的中央牌池與終局呈現規則。

## Goals / Non-Goals

**Goals:**

- 讓中央牌池在 `claim-window` 期間清楚區分吃牌、碰／明槓與放槍胡牌三種判讀語意。
- 將白色高亮嚴格限制在「目前出牌者的最後一張」且只在真人合法可吃時出現。
- 讓同一張牌可同時顯示紅色與黃色高亮，保留玩家判斷做大牌或直接胡牌的資訊。
- 當 AI 和牌時，終局畫面要亮出它的手牌與副露，讓玩家可檢視和牌證明。
- 以現有 UI / E2E 測試補齊這組高亮規則，避免再次出現假 UI。

**Non-Goals:**

- 不新增新的 round-flow core 規則或宣告候選 API。
- 不改動人類宣告按鈕列的內容與優先序。
- 不重做中央牌池版型或改動四家相對位置。
- 不做新的彈窗互動，只在現有終局資訊區塊內補足 AI 和牌證明。

## Decisions

### 使用合法宣告候選導出中央牌池高亮狀態

中央牌池高亮只讀取既有 `claimCandidates`、`snapshot.phase`、`snapshot.currentSeat` 與各座位 discard pool。元件不得重新判斷能不能吃、碰、槓、胡，只能把 core 已給出的合法候選翻譯為視覺狀態。這樣可以保持規則權威仍在 core / store，而不是回流到 Vue component。

### 最後一張捨牌限定白色吃牌高亮

白色高亮不是「每家最新捨牌」的通用樣式，而是 `claim-window` 中供真人判讀吃牌的特別語意。因此白色高亮只允許套在目前出牌者 discard pool 的最後一張，且只有當真人合法候選中存在 `chi` 時才顯示。若沒有 `chi`，即使是最後一張也不得出現白色高亮。

### 紅色與黃色高亮都只標示當前可宣告目標牌

紅色與黃色都只作用於目前出牌者的最後一張捨牌，因為碰、明槓與放槍胡牌的目標都只能是當前觸發 `claim-window` 的那張牌。紅色代表合法候選中存在 `pon` 或 `kan-exposed`，黃色代表合法候選中存在 `win`。這避免把其他歷史捨牌誤畫成可宣告目標。

### 紅黃高亮共存而不互相覆蓋

同一張牌若同時可 `pon` / `kan-exposed` 與 `win`，畫面必須同時保留紅色與黃色訊號，不得只留其一。實作上以可疊加的 class 或 decoration 狀態處理，而不是單一 enum 覆蓋，避免產品替玩家做策略裁決。

### AI 和牌證明直接復用終局快照

AI 和牌時不新增第二套結果資料來源，而是直接使用終局時 round snapshot 內既有的玩家 concealed tiles、winning tile、melds 與 flowers 來組出公開證明區塊。這能避免在 view 層重建胡牌內容，也避免為了展示再新增一份不一致的「結果手牌」結構。若和牌者是人類，維持現況即可，不強制新增另一個重複展示區。

## Implementation Contract

### Task 1: 中央牌池高亮資料 contract

- Observable behavior:
  - 當畫面處於 `claim-window` 且有人類合法宣告候選時，中央牌池可從目前快照與 `claimCandidates` 導出當前目標牌的高亮狀態。
- Interface / data shape:
  - `GameTableView` 或其 view-only helper 必須能判斷單張 discard tile 是否命中 `chi-highlight`、`interrupt-highlight`、`win-highlight` 三種狀態，且三者可同時為布林組合而不是互斥單值。
- Failure modes:
  - 若不在 `claim-window`、沒有合法非 `pass` 候選，或 tile 不是目前出牌者的最後一張捨牌，則不得顯示任何這次新增的宣告高亮。
- Acceptance criteria:
  - `tests/ui/human-claim-window.test.ts` 與 `tests/ui/game-table-layout.test.ts` 能驗證三種高亮條件與共存規則。
- Scope boundaries:
  - 只處理畫面高亮導出，不更改 claim 候選來源。

### Task 2: 中央牌池高亮樣式與語意

- Observable behavior:
  - 白色高亮只表示可吃的上一手最後一張；紅色表示可碰或明槓；黃色表示可放槍胡牌；紅黃可共存。
- Interface / data shape:
  - 中央牌池每張 tile 的 DOM 必須暴露穩定的 class 或 data attribute，供 Vitest 與 Playwright 斷言白 / 紅 / 黃 / 紅黃共存。
- Failure modes:
  - 不得再以舊的「每池最後一張固定高亮」冒充宣告語意。
- Acceptance criteria:
  - 至少一條 browser smoke scenario 能看到不同宣告能力下的中央牌池高亮差異。
- Scope boundaries:
  - 不改變牌池排序、牌張文案或按鈕區內容。

### Task 3: AI 和牌證明展示

- Observable behavior:
  - 當終局結果為 `win` 且和牌者不是人類座位時，畫面必須顯示該 AI 的手牌證明區，至少包含其暗手、winning tile（若有）、副露與花牌數據所對應的可視內容。
- Interface / data shape:
  - 終局摘要相關 view model 必須能讓 `GameTableView` 在不重算規則的前提下取得和牌者 seat，並從當前 snapshot.players 對應到該座位的牌張與副露資料。
- Failure modes:
  - 若終局不是 `win`，或和牌者就是人類座位，則不得錯誤顯示 AI 和牌證明區。
- Acceptance criteria:
  - `tests/ui/round-result-sync.test.ts` 與至少一條 `e2e/game-table.smoke.spec.ts` 能驗證 AI 和牌時有公開牌證明。
- Scope boundaries:
  - 只做公開證明展示，不新增互動彈窗或額外算台邏輯。

## Risks / Trade-offs

- [高亮語意若直接寫死在 template 中會快速失真] → 先集中成 view-only 判斷 helper 或 computed，讓測試可直接覆蓋條件組合。
- [舊有 `discard-tile--latest` 樣式可能和新語意混淆] → 將「最後一張」與「宣告語意高亮」拆開，不再把 latest 視為唯一訊號。
- [同一張牌紅黃共存容易造成視覺衝突] → 規格只要求雙重可見，不在這個 change 內擴大成全面視覺重設。
- [AI 和牌證明若直接讀目前玩家快照，需確認終局時牌張仍保留] → 用 UI 測試與 smoke e2e 鎖住 AI 和牌後玩家牌區仍可公開顯示。

## Open Questions

- 目前沒有；紅黃共存規則已定案。
