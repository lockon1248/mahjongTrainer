## Context

現在 repo 已能正確判定流局，也能在胡牌後建立下一局，但流局路徑仍停留在「結果已知、後續未定案」的中間狀態。這本來是為了避免直接猜查聽或流局後處罰規則，但副作用是本地練習模式完全無法從流局進入下一局。

這個 bugfix 的關鍵是把「下一局能否開始」與「流局後完整商業結算是否定案」拆開。前者已有權威規則依據，後者仍未定案，因此只能修前者。

## Goals / Non-Goals

**Goals:**

- 明確定義流局後可建立下一局。
- 流局後下一局必須由原莊家續莊。
- 保留 `postDraw` 未定案分支，不在這次實作中猜查聽或結算。
- 讓 core 與 store 都有可回歸的測試。

**Non-Goals:**

- 不實作查聽。
- 不實作流局分數結算。
- 不新增 UI 流局後規則摘要。

## Decisions

### 將「可建立下一局」與「流局後完整結算」拆開

流局 outcome 仍然可以保留 `postDraw` 的未定案資訊，但本地牌局要能繼續，因此 `createNextRoundFromCompletedRound()` 不該因為 draw outcome 就直接 throw。

### 流局後一律沿用原莊家開下一局

目前權威來源已確認流局時莊家續莊，因此下一局的 `dealerSeat` 與 `currentSeat` 都應維持原莊家。

### Rule config 只延續既有可延續設定，不自行補 post-draw 結果

下一局建立時仍沿用既有 `claimPriorityOrder`、`flowerReplacementMode`、`postDraw` 等 rule config；但不把 `postDraw` 視為已結算完成的商業規則。

## Implementation Contract

### Task 1: core 流局續局規則

- Observable behavior:
  - 已結束且 outcome 為 `draw` 的 round 可以建立下一局。
  - 下一局的 `dealerSeat` 必須等於上一局的 `dealerSeat`。
  - 下一局的 `currentSeat` 必須等於原莊家，且 phase 回到 `discard`。
- Failure modes:
  - 若 round 尚未結束，仍必須維持原本錯誤。
  - 不可因修這個 bug 而改壞胡牌後換莊規則。
- Verification target:
  - `tests/core/dealer-progression.test.ts`

### Task 2: store 下一局回歸

- Observable behavior:
  - store 在流局結束後呼叫 `startNextRound()` 不得留下 error。
  - store 應持有一個新的 in-progress round。
- Failure modes:
  - 不可保留舊 round 並同時清掉 error，必須真的換成新局。
- Verification target:
  - `tests/ui/game-session.store.test.ts`

## Acceptance Criteria

- `spectra` artifact 裡已明確定義流局續局規則與不做事項。
- core test 能驗證流局後續局且原莊家連莊。
- store test 能驗證本地局流局後可直接開始下一局。

## Scope Boundaries

**In scope**

- 流局後建立下一局
- 流局後原莊家續莊
- core/store 回歸測試

**Out of scope**

- 查聽
- 流局罰則
- UI 規則說明文案
