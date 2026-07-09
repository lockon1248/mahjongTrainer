## Context

上一個 change 已經完成 rules baseline、rule test matrix、core domain model、rule-case schema，現在專案具備開始實作 `core/scoring` 的最低條件。產品 spec 已經明定規則引擎優先、Vue 延後，因此這個 change 的責任不是做牌桌流程，而是先把胡牌與算台核心的可測邊界建立起來。

目前仍有數個重要規則未定案，例如完整台型清單、特殊胡、封頂、最低胡牌台數、查聽與搶槓。這代表本次 scoring foundation 只能先針對 baseline 已確認的標準胡牌與可擴充結算 shape 建立穩定介面，不能偷補任何未定案桌規。

## Goals / Non-Goals

**Goals:**

- 建立可重用的標準胡牌拆解模型，讓後續 scoring 與 rules 可以共享同一份 winning breakdown。
- 建立可驗證的標準胡牌判定，直接覆蓋 `WIN-STANDARD-001` 與 `WIN-MELD-001`。
- 建立可擴充的台型比對與結算輸出介面，讓 `SCORE-STACK-001` 可以落成 core test。
- 將 scoring logic 侷限在 `src/core/scoring`，不讓 store 或 UI 反向定義核心型別。

**Non-Goals:**

- 不處理發牌、摸打循環、宣告優先序、補花流程或流局流程。
- 不定義完整台型清單，也不實作未定案特殊胡。
- 不建立 Vue app scaffold、router、pinia 或任何牌桌畫面。
- 不在本 change 內處理 AI 決策。

## Decisions

### Standard hand decomposition as the canonical winning breakdown

胡牌判定與算台比對不應各自做一套拆解。這次以「五組面子加一組將眼」作為 baseline canonical form，先建立一個可重用的 winning breakdown 結果。這樣後續 pattern matching 只需依賴 breakdown，不必重新掃描整副手牌。替代方案是每個 scoring pattern 自己看 raw tiles，但那會讓判定重複且難以驗證。

### Separate win validation from scoring pattern evaluation

先分成兩層：第一層只回答「是否為 baseline 合法胡牌」，第二層才回答「命中了哪些 scoring patterns」。這樣可以明確避免未定案台型反過來污染胡牌成立邏輯。替代方案是一次回傳完整結算，但那會把尚未確認的 pattern 規則綁死在第一批核心介面裡。

### Keep settlement output explicit about payment responsibility

結算輸出必須把 `winnerSeat`、`discarderSeat`、`payment responsibility`、`matched patterns`、`totalTai` 分開表達，而不是只回傳一個總分數字。原因是 baseline 已經確定自摸與放槍的責任來源不同，但金額和進階包牌規則仍可配置。替代方案是只回傳 `totalTai`，但那會讓 store 或 UI 補上責任判定，違反 core 邊界。

### Extend rule-case schema only when scoring tests need it

目前 `RuleCase` 已足夠承接基本 hand input 與 expected overrides。本 change 只在 scoring test 真正需要時才擴充 expected shape，避免過早把未定案規則做成 schema 欄位。替代方案是一次塞滿所有可能的 scoring 欄位，但那會把 spec gap 假裝成正式 contract。

## Implementation Contract

**Behavior**

- 呼叫 scoring core 時，系統必須能對 baseline 標準胡牌輸入回覆 `isWinning` 結果。
- 對於成立的標準胡牌，系統必須回傳穩定的 winning breakdown，至少能表達五組面子、一組將眼，以及哪些部分來自既有副露。
- 對於成立的胡牌，系統必須回傳 matched scoring pattern identifiers、`totalTai` 欄位與 payment responsibility shape。
- 對於未定案規則相關 pattern，系統必須保留空缺，不得自動推論結果。

**Interface / data shape**

- `src/core/scoring/` 需提供 hand decomposition、win validation、pattern evaluation、settlement builder 的明確匯出入口。
- winning result 需至少包含：`isWinning`、`breakdown | null`、`matchedPatterns`、`totalTai | null`、`settlement | null`。
- settlement result 需至少包含：`winnerSeat`、`discarderSeat | null`、`payment responsibility`、`scoringItems`、`totalTai`。
- `RuleCaseExpected` 若需擴充，必須只加入本 change 直接驗證會用到的欄位，例如 `isWinning`、`matchedPatterns`、`totalTai`、`settlementType`。

**Failure modes**

- 無法拆成標準胡牌時，回傳 `isWinning = false` 與 `breakdown = null`，不得偽造拆解結果。
- 若 scoring pattern 依賴未定案規則，該 pattern 不得出現在 matched results。
- 若 settlement builder 收到非 winning result，必須回傳空 settlement，而不是產生假結算。

**Acceptance criteria**

- `tests/core` 中至少新增並通過 `WIN-STANDARD-001`、`WIN-MELD-001`、`SCORE-STACK-001` 對應測試。
- `npm test -- --run tests/core` 必須通過。
- `npm run typecheck` 必須通過。
- reviewer 可從 `src/core/scoring` 匯出接口與測試名稱直接對照 requirement，不需依賴 UI 檔案判讀。

**Scope boundaries**

- In scope: baseline 標準胡牌拆解、baseline 標準胡牌判定、基礎 matched pattern interface、基礎 settlement output shape、必要 schema 調整與 core tests。
- Out of scope: 特殊胡、完整台型清單、發牌流程、宣告流程、補花流程、AI、Vue UI、持久化。

## Risks / Trade-offs

- [Risk] 標準胡牌拆解若一次做得太通用，容易把未定案特殊胡混進來。 → Mitigation: 本 change 僅接受五組面子加一組將眼的 baseline 結構。
- [Risk] settlement shape 若過度簡化，後續會逼 store/UI 補邏輯。 → Mitigation: 先把 payment responsibility 明確列為 core 輸出的一部分。
- [Risk] 太早定義過多 scoring pattern schema 欄位，會把 spec gap 寫死。 → Mitigation: 只對應目前 rule test matrix 已要求的案例與欄位。
