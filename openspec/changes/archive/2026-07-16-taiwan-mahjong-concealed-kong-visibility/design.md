## Context

目前 core round state 的 `melds` 會保留真實牌張，這本來是正確的內部規則資料；但前端 snapshot selector 與 AI context 直接透傳這份資料，導致暗槓牌值在不該可見的層被揭露。這不是規則錯誤，而是 visibility boundary 不存在。

暗槓保密同時跨兩層：
- 人類看到的牌桌 UI
- 其他 AI 取得的對局決策輸入

因此需要在不破壞 core 真實 state 的前提下，加上一層「對外可見的 meld projection」。

## Goals / Non-Goals

**Goals:**

- 讓非擁有者無法從 UI snapshot 或 AI context 得知 AI 暗槓的具體牌值。
- 保留擁有者本人與終局和牌證明可使用的真實牌張資料。
- 用最小改動把保密邊界集中在 projection / context layer，而不是污染 core round-flow。

**Non-Goals:**

- 不改寫暗槓合法性、補牌流程或 scoring 規則。
- 不改變明槓、加槓、碰、吃的公開資訊語意。
- 不在本 change 內重做整個 AI heuristic，只修正其可見輸入邊界。

## Decisions

### Project concealed kong melds into viewer-safe data

前端與 AI 不應直接共享 core `Meld`；它們 SHALL 使用帶有 visibility metadata 的 projection。對非擁有者而言，`kan-concealed` 的 tiles 只保留張數與類型，不保留真實 tile identity。

替代方案是直接在 core state 裡把暗槓 tiles 改成 placeholder。這會破壞 scoring、終局證明與內部一致性，因此不採用。

### Keep owner and winning-proof access to real concealed tiles

暗槓保密只適用於非擁有者的運行中資訊。人類自己的暗槓仍要能顯示真實牌張；若 AI 成為和牌者且 UI 已進入和牌證明顯示，也可使用真實牌張。

替代方案是所有暗槓一律匿名。這會讓使用者連自己的暗槓都看不到，也會破壞已存在的和牌證明需求，因此不採用。

### Mask concealed kong inputs before AI decision context leaves the store boundary

AI 不得直接收到其他座位的真實 `kan-concealed` tile identities。store / context builder 產生 AI decision context 時 SHALL 先完成 masking，而不是期待 decision core 自己判斷哪些 tiles 不該看。

替代方案是把真實 tiles 傳入 decision core，再靠每個 heuristic 自行忽略。這會讓保密邊界分散且容易漏掉，因此不採用。

## Implementation Contract

- Behavior:
  - While a round is in progress, a human viewer SHALL see another seat's concealed kong as a hidden meld placeholder rather than concrete tile labels.
  - The owning human seat SHALL still see its own concealed kong tiles.
  - AI decision inputs for non-owning seats SHALL NOT include another seat's concealed-kong tile identities.
  - Existing end-of-round winner proof behavior MAY still reveal real concealed tiles for the winner proof panel.
- Interface / data shape:
  - `GameTableSnapshotViewModel` player meld entries will need visibility-safe shape for hidden concealed kongs.
  - AI context / types will distinguish between internally-owned meld data and opponent-visible meld data.
- Failure modes:
  - This change SHALL NOT replace internal core meld tiles with placeholders.
  - Hidden meld rendering SHALL NOT leak tile labels through badge text, joined tile text, or debug fallbacks.
- Acceptance criteria:
  - UI tests prove AI concealed kong tiles are masked for the human viewer during an in-progress round.
  - Store / AI tests prove non-owning AI contexts do not receive another seat's concealed-kong tile identities.
  - `spectra validate --changes "taiwan-mahjong-concealed-kong-visibility"` passes.
- Scope boundaries:
  - In scope: UI snapshot projection, AI context projection, concealed-kong masking tests.
  - Out of scope: new scoring rules, hidden-hand redesign, unrelated meld rendering restyles.

## Risks / Trade-offs

- [Risk] View-model shape changes may force many snapshot fixtures to update. → Mitigation: add a small, explicit hidden-meld projection shape instead of rewriting all player fields.
- [Risk] Winner-proof reveal and in-progress masking could conflict. → Mitigation: derive reveal policy from round outcome and viewer ownership in one selector path.
