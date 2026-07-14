## 1. Store turn-advancement actions

- [x] 1.1 實作 `Interactive turn advancement` 需求（對應設計決策「store 作為回合迴圈協調層」）:在 `gameSession` store 新增 `humanSeat`（`east`）、`drawCurrentSeat()`、`discard(tile)` 與 `advanceTurn()` 協調流程,透過既有 round-flow core API 推進並以新 snapshot 取代 `round`,不自行判規則,並以 store 測試與 `npm run typecheck` 驗證。
- [x] 1.2 為 `Interactive turn advancement` 需求的 `advanceTurn()` 加入有限步數上限,確保自動推進停在「需人類輸入」或 `ended` 而不無限迴圈,並以 store 測試驗證 AI 座位會自動摸打並推進 `currentSeat`。

## 2. AI-driven opponents and claim resolution

- [x] 2.1 實作 `AI-driven opponent turns` 需求（對應設計決策「人類單家、AI 三家」）:store 在 AI 座位的 `discard` 階段以 `chooseAiDiscardDecision` 自動選牌並經 `discardTile` 套用,並以 store 測試驗證 AI 座位摸打後回合前進。
- [x] 2.2 實作 `Automatic claim-window resolution` 需求（對應設計決策「claim-window 先自動裁決」）:store 在 `claim-window` 以 `chooseAiClaimDecision` 蒐集各 AI 座位宣告、人類座位視為 pass,交 `resolveClaimWindow` 裁決,並以 store 測試驗證無有效宣告時清空 pending claim window 並換下一家 `draw`。

## 3. Error handling and exhaustive draw

- [x] 3.1 實作 `Turn advancement failure handling` 需求:store 推進 action 的錯誤分支在任一 core 操作丟錯時保存非空 `error` 且不以空桌覆蓋既有 `round`,並以 store 測試驗證非法 discard（打出手中沒有的牌）後 `error` 非 null 且 `round` 未被清空。
- [x] 3.2 為 `Interactive turn advancement` 需求補上牌牆耗盡處理:讓 `evaluateExhaustiveDraw` 的流局 outcome 反映到 snapshot 與畫面,並以測試驗證流局 outcome 正確映射。

## 4. Human discard UI and turn progress

- [x] 4.1 實作 `Human seat discard action` 需求:`GameTableView` 對人類座位手牌提供可點擊入口,將選中的 tile 送出為 discard 意圖給上層/store,其餘座位維持唯讀,並以 UI 測試驗證點選人類手牌會呼叫 store 的 discard 意圖且 component 不重算規則。
- [x] 4.2 實作 `Turn progress reflected read-only` 需求（對應設計決策「維持直接映射 core snapshot」）:讓 selector 與 `GameTableView` 呈現回合進展（`currentSeat`、`phase`、`lastClaimResolution`、`outcome`）,並以 render assertion 驗證推進後畫面更新。

## 5. Integration verification

- [x] 5.1 執行整體驗證,確認 `Interactive turn advancement`、`Human seat discard action`、`AI-driven opponent turns`、`Automatic claim-window resolution`、`Turn progress reflected read-only` 與 `Turn advancement failure handling` 可協同運作,並以 `npm test -- --run tests/ui`（含 `tests/ui/interactive-turn-loop.test.ts`）、`npm run typecheck` 與 `spectra analyze taiwan-mahjong-interactive-turn-loop --json` 驗證。
