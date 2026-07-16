## Context

目前 `mahjong-round-flow-core` 已經對 `kan-concealed` 與 `kan-added` 落地尾端補牌流程，但 claim window 接受 `kan-exposed` 時，`resolveClaimWindow()` 只會移除消耗牌、建立副露、移除被吃走的捨牌，然後直接進入 `discard`。結果是明槓玩家少了一張活牌，手牌總量與標準胡牌驗證前提脫節。

這不是 UI 或 AI heuristic 問題，而是 core round-flow state transition 少了一步規則必需的 replacement draw。修正必須落在同一條 round-flow contract，避免前端或 store 再用補丁方式掩蓋非法 state。

## Goals / Non-Goals

**Goals:**

- 讓 `kan-exposed` 與其他槓行為共用一致的槓後補牌語意。
- 保證 accepted `kan-exposed` 後，claimant 在回到 `discard` 前持有合法的活牌張數。
- 補上可重現此 bug 的回歸測試，避免之後再次把明槓做成少一張牌的 state。

**Non-Goals:**

- 不改寫胡牌拆解或 `validateStandardWin()` 規則。
- 不在這個 change 內擴充 UI 提示、AI 拆牌策略或額外桌規。
- 不順便重構整份 claim-window resolution 流程，除非是支撐本 bugfix 所需的最小抽象。

## Decisions

### Reuse the existing tail replacement pipeline for exposed kan

`kan-exposed` SHALL 走和 `kan-concealed`、`kan-added` 相同的尾端補牌流程，而不是新增另一套明槓專用補牌規則。這能保證補到花牌時的連續補牌語意一致，也避免不同槓種各自維護不同的牌尾處理。

替代方案是只在 `resolveClaimWindow()` 內手寫一次 `wall.pop()` 補一張；這會複製既有規則，並把花牌連補風險重新散落出去，因此不採用。

### Keep claim resolution atomic around the accepted exposed kan

claim window 一旦接受 `kan-exposed`，同一次 state transition 就必須完成三件事：移除觸發捨牌、建立明槓副露、補到合法 replacement tile 後才回到 `discard`。不得先返回少一張牌的中間 state，再期待 UI/store 下一層自行修補。

替代方案是讓較高層在看到 `kan-exposed` 後再補牌；這會破壞 round-flow core 的唯一真實來源，並製造跨層同步 bug，因此不採用。

### Protect the fix at the claim-resolution harness layer

主要回歸測試應落在 `tests/core/round-flow-claims.test.ts`，因為 root cause 發生在 claim-window 裁決層。測試要直接驗證 accepted `kan-exposed` 後的 concealed tile 數量、replacement tile、牌尾消耗與花牌補牌語意，而不是只檢查 UI 最後有沒有卡死。

可再視需要補一條較高層互動驗證，但不能用 UI 結果取代 core regression。

## Implementation Contract

- Behavior:
  - When `resolveClaimWindow()` accepts a `kan-exposed` claim, the claimant SHALL receive the exposed-kong meld, the claimed discard SHALL be removed from the discarder's pool, and the claimant SHALL draw a replacement tile from the wall tail before the round returns to `phase = 'discard'`.
  - If the wall-tail replacement tile is a flower, round flow SHALL reveal it into the claimant's flower area and continue drawing from the wall tail until a non-flower tile is added to concealed tiles.
- Interface / data shape:
  - The existing `BaselineRoundState` shape remains unchanged.
  - `lastClaimResolution` remains `{ type: 'kan-exposed', seat, tile }`.
  - The observable state change is in `players[seat].concealedTiles`, `players[seat].flowers`, `players[seat].melds`, and `table.wall`.
- Failure modes:
  - This change SHALL NOT introduce a UI-only fallback for illegal live-tile counts.
  - Any wall-tail exhaustion behavior remains aligned with the existing replacement-draw path used by other kong actions.
- Acceptance criteria:
  - A core regression test proves that accepted `kan-exposed` returns to `discard` with a replacement tile already in concealed tiles.
  - A core regression test proves that flower tiles drawn from the wall tail during `kan-exposed` replacement are revealed and chained until a non-flower tile is obtained.
  - `spectra validate --change "taiwan-mahjong-exposed-kan-replacement-draw-fix"` passes after artifacts are written.
- Scope boundaries:
  - In scope: `kan-exposed` claim resolution, replacement draw semantics, and core regression coverage for this path.
  - Out of scope: broader AI discard quality, UI affordances, dealer progression, and unrelated win-validation refactors.

## Risks / Trade-offs

- [Risk] `resolveClaimWindow()` gains more branching and duplicates self-turn kong semantics indirectly. → Mitigation: prefer extracting or reusing the existing tail-replacement helper instead of open-coding another path.
- [Risk] Tests could assert an unreachable fixture and give false confidence. → Mitigation: build regression rounds through valid claim-window state with an actual trigger discard and legal consumed tiles.
