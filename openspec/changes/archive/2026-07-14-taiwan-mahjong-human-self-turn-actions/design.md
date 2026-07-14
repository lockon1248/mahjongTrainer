## Context

目前牌桌已能做到兩件事：真人可在自己的 `discard` 階段打一張牌；當他家捨牌進入 `claim-window` 時，真人也可決定 `pass / chi / pon / kan-exposed / win`。但這仍然漏掉真人自己回合最關鍵的一段：如果目前手牌已經自摸成胡，或握有合法暗槓、加槓條件，畫面與 store 都沒有入口可讓真人執行這些動作。

這個 change 的工作不是新增新的桌規，而是把「真人自回合可執行哪些合法動作」整理成 core 可提供、store 可協調、UI 可最小呈現的邊界。它要補的是自回合動作閉環，而不是整局結果 UI 或流局流程。

## Goals / Non-Goals

**Goals:**

- 讓 core 提供真人自己回合的合法動作候選。
- 讓 store 能送出真人自摸胡、暗槓、加槓等自回合 action。
- 讓槓後補牌仍由 core / store 正確推進，而不是在前端猜狀態。
- 讓 UI 只顯示目前合法的自回合按鈕，不自行判規則。

**Non-Goals:**

- 不處理搶槓、特殊胡、封頂等未定案規則。
- 不補下一局銜接、流局處理或結算詳情面板。
- 不做複雜 modal、多步精靈或動畫。

## Decisions

### Core 提供自回合合法動作候選

`round-flow core` 應直接暴露真人目前座位在自回合的合法動作，例如 `win-self-draw`、`kan-concealed`、`kan-added`。store 與 UI 不可自行掃牌型判斷。

### 槓後補牌仍走既有 round-flow 狀態機

暗槓與加槓在被接受後，後續補牌與 phase 轉換仍由 core 決定。store 只負責送意圖與同步快照，不在 Pinia 內重建補牌流程。

### UI 採最小按鈕列，而不是重型操作面板

和 claim-window 一樣，自回合操作先以最小按鈕列呈現，讓主線功能閉環先成立。若之後要做更完整的操作面板，應再拆後續 change。

### 人類自回合 action 與既有 discard turn 共存

當真人座位在自己的 `discard` 階段時，畫面同時可能出現出牌手牌與自回合按鈕。store 必須保證只有合法 action 可送出，並在 action 套用後正確更新 phase。

## Implementation Contract

**Behavior**

- 當真人座位在自己的回合且存在合法自回合動作時，store 必須暴露這些候選。
- 真人可以選擇 `win-self-draw`、`kan-concealed` 或 `kan-added` 中目前合法的動作；若動作成立，牌局必須正確更新 outcome 或進入補牌後續。
- 若真人沒有任何自回合候選，既有出牌流程必須維持原樣。
- 畫面必須在 action 套用後反映最新 `phase`、`currentSeat`、`outcome` 與必要的牌面變化。

**Interface / data shape**

- `gameSession` store 至少新增對外暴露：`availableHumanSelfTurnActions`、`submitHumanSelfTurnAction(...)`。
- `round-flow core` 至少提供一個 helper 讓 store 讀取目前座位的合法自回合候選。
- 候選資料必須保留 action 類型與必要的 consumed / promoted tile 資訊，避免 UI 需要重算。
- `GameTableView` 或子區塊透過 props / emits 呈現與送出自回合意圖。

**Failure modes**

- 若 UI 顯示的自回合 action 並不合法，store 送出後不得靜默成功，必須保留 error。
- 若槓後補牌流程沒有正確推進，必須由 store / core 測試攔下。
- 若自摸胡成立卻沒有正確結束牌局，視為主線錯誤。

**Acceptance criteria**

- `tests/core/human-self-turn-actions.test.ts` 驗證 `win-self-draw`、`kan-concealed`、`kan-added` 候選與狀態轉換。
- `tests/ui/game-session.store.test.ts` 或新 store 測試驗證真人送出自回合 action 後牌局正確更新。
- `tests/ui/human-self-turn-actions.test.ts` 驗證畫面只顯示合法自回合按鈕，點擊後會送往 store。
- `npm test -- --run tests/core/human-self-turn-actions.test.ts tests/ui/human-self-turn-actions.test.ts tests/ui/game-session.store.test.ts tests/ui`
- `npm run typecheck`
- `spectra analyze taiwan-mahjong-human-self-turn-actions --json`

**Scope boundaries**

- In scope: 真人自回合合法候選、store action、槓後補牌推進、最小 UI 入口、對應測試。
- Out of scope: 搶槓、結算詳情 UI、下一局銜接、流局規則。

## Risks / Trade-offs

- [Risk] `kan-added` 需要對既有 meld 結構做提升，若資料形狀不清楚，UI 會不知道要升級哪一組 meld。 → Mitigation: 候選需保留對應 tile / meld 資訊。
- [Risk] 槓後補牌若與既有 draw/discard phase 串接不當，容易造成回合卡死。 → Mitigation: 用 core/store 測試覆蓋槓後補牌與回到 discard 的路徑。
- [Trade-off] 先只做最小按鈕列，不做複雜操作面板。 → 好處是主線能先補齊真人自回合閉環，避免 UI scope 擴張。
