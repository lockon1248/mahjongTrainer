## Context

`mahjong-vue-table-shell` 已建立可載入的 Vue app shell、router、Pinia session skeleton 與唯讀 `GameTableView`,但 store 只呼叫 `createBaselineRound`,回合無法前進。核心 `src/core/rules/roundFlow.ts` 已提供純函式、不可變的回合狀態機:`drawForCurrentSeat`、`discardTile`、`resolveClaimWindow`、`evaluateExhaustiveDraw`;`src/core/ai` 已提供 `createAiDecisionContext`、`chooseAiDiscardDecision`、`chooseAiClaimDecision`。本 change 的本質是「把回合迴圈接到 store 與 UI」,不新增規則。

回合階段機為 `draw → discard → claim-window →（draw | discard | ended）`。`discardTile` 打出後進入 `claim-window` 並帶 `pendingActionWindow`;`resolveClaimWindow` 依 `claimPriorityOrder` 裁決,無有效宣告則換下一家 `draw`,牌牆耗盡則走 `evaluateExhaustiveDraw` 流局。

## Goals / Non-Goals

**Goals:**

- 讓 store 透過既有 core API 推進回合,涵蓋摸牌、人類打牌、AI 自動出牌、claim-window 自動裁決與流局。
- 讓人類操作單一座位（莊家 `east`）打牌,其餘三家由 AI 自動走。
- 讓 `GameTableView` 提供最小人類打牌入口,並以唯讀方式呈現回合進展。
- 補齊 store 回合推進、錯誤分支與 UI 動作意圖的測試。

**Non-Goals:**

- 不做人類互動式吃碰槓胡宣告 UI;claim-window 一律自動裁決,人類座位視為 pass。
- 不做拖曳、動畫、音效、教學提示。
- 不把任何合法性判定搬進 store 或 component。
- 不做持久化、多人、回放、登入。

## Decisions

### Store 作為回合迴圈協調層

store 新增 `drawCurrentSeat()`、`discard(tile)`、`resolveClaims()` 與一個對外的 `advanceTurn()` 協調流程,內部只呼叫 core 函式並以新 snapshot 取代 `round`。替代方案是把推進邏輯放進 component,但會讓 view 需要理解階段機,違反既有邊界。

### 人類單家、AI 三家

人類固定操作 `east`,其餘座位輪到時由 store 用 AI 決策自動出牌與宣告。替代方案是全 AI 觀戰或多位人類,但會放大輸入協調複雜度,超出本階段範圍。

### claim-window 先自動裁決

human 座位在 claim-window 一律視為 pass,store 蒐集 AI 宣告後交 `resolveClaimWindow`。替代方案是本刀就做人類互動宣告,但風險文件指出宣告時機最易讓狀態協調變脆弱,故先自動化。

### 維持直接映射 core snapshot

新增的回合進展資訊（`lastClaimResolution`、`phase`、`currentSeat`、`outcome`）沿用 selector 直接映射 core round,不建立 UI-only mirror。替代方案是前端自有回合模型,但會增加轉換層與 drift 風險。

## Implementation Contract

**Behavior**

- store 提供推進 action:輪到人類 `east` 且 phase 為 `discard` 時,等待人類選牌;其餘情況（`draw`、AI 座位、`claim-window`）由 store 自動推進至「需要人類輸入」或 `ended`。
- 人類在 `GameTableView` 點選 `east` 的一張手牌 → 送出 discard 意圖 → store 以 `discardTile` 套用。
- AI 座位在 `discard` 由 `chooseAiDiscardDecision` 決定出牌;`claim-window` 由 `chooseAiClaimDecision` 蒐集各 AI 座位宣告後 `resolveClaimWindow`。
- 牌牆耗盡時經 `evaluateExhaustiveDraw` 得到流局 outcome,並反映到畫面。

**Interface / data shape**

- `gameSession` store 至少對外暴露:`round`（snapshot）、`error`、`isInitialized`、`humanSeat`、`startLocalRound()`、`discard(tile)`、`advanceTurn()`。
- `discard(tile)` 只接受目前人類座位、phase 為 `discard` 時的合法呼叫;違規時交由 core 丟錯並轉為 error 狀態。
- `GameTableView` 對人類座位手牌提供可點擊入口,送出 tile 給上層;其餘座位維持唯讀。
- 回合進展欄位（`currentSeat`、`phase`、`lastClaimResolution`、`outcome`）經 `createGameTableSnapshot` 或 thin selector 映射,不在 component 內重算。

**Failure modes**

- 任一推進 action 丟錯時,store 必須保存非空 `error`,且不得以空桌覆蓋既有 `round`。
- 人類點選非法牌（不在手牌中）時,不得靜默略過,必須反映錯誤或阻擋。
- AI 推進不得進入無限迴圈:每次 `advanceTurn()` 必須在有限步數內停在「需人類輸入」或 `ended`。

**Acceptance criteria**

- `npm test -- --run tests/ui`（含新增 `tests/ui/interactive-turn-loop.test.ts`）必須通過,涵蓋:
  1. `discard` 後 phase 轉 `claim-window`、人類手牌 -1、捨牌 +1。
  2. AI 座位在 `advanceTurn()` 後自動摸打並推進 `currentSeat`。
  3. 無有效宣告時 claim-window 清空並換下一家 `draw`。
  4. 非法 discard 後 `error` 非 null 且 `round` 未被清空。
  5. 點選人類手牌會呼叫 store 的 discard 意圖（component 不重算規則）。
  6. 牌牆耗盡的流局 outcome 反映到畫面。
- `npm run typecheck` 必須通過。
- `spectra analyze taiwan-mahjong-interactive-turn-loop --json` 必須通過。

**Scope boundaries**

- In scope: store 回合推進 actions、AI 三家自動、claim-window 自動裁決、人類打牌入口、回合進展唯讀映射、對應測試。
- Out of scope: 人類互動宣告 UI、拖曳/動畫/音效、規則判定搬移、持久化、多人。

## Risks / Trade-offs

- [Risk] AI 自動推進可能形成無限迴圈或卡住。 → Mitigation: `advanceTurn()` 設有限步數上限並在 `ended`/需人類輸入時停止,並以測試驗證會推進。
- [Risk] claim-window 自動化讓人類此階段無法主動吃碰槓胡,功能感受限。 → Mitigation: 先跑通資料流,人類互動宣告留待後續 change。
- [Risk] store 若偷帶規則判定,分層會再次混亂。 → Mitigation: 嚴格限制 store 只呼叫 core、只協調 snapshot。
- [Trade-off] 沿用唯讀映射不建 UI mirror,短期彈性較低,但避免與 core state drift。
