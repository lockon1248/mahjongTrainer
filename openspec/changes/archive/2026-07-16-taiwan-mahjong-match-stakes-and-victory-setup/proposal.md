## Why

目前牌局只支援單局 round state，沒有整場籌碼、開局設定或勝負條件，因此使用者無法在開局時設定初始籌碼，也無法依破產結束或打滿四風圈兩種條件完成整場對局。這讓規則更新後的對局體驗缺少真正的 match closure。

## What Changes

- 新增 match-level session capability，支援開局設定彈窗、初始籌碼、固定 `底 30 / 台 10` 的籌碼結算，以及整場終局判定。
- 讓使用者可在開局彈窗自由選擇兩種勝利條件：`任一家籌碼 <= 0 立即結束` 或 `打滿四風圈後總結算`。
- 將整場籌碼與勝負摘要接回既有 Vue table shell / session store，而不引入外部 UI 套件庫。

## Capabilities

### New Capabilities

- `mahjong-match-session`: match-level setup, chip tracking, victory condition selection, and full-match completion based on bankruptcy or four prevailing-wind rounds.

### Modified Capabilities

- `mahjong-vue-table-shell`: the game entry flow and table shell now include a pre-round setup modal and match-status rendering driven by real session state.

## Impact

- Affected specs: `mahjong-match-session`, `mahjong-vue-table-shell`
- Affected code:
  - New: `src/views/game/components/MatchSetupModal.vue`
  - Modified: `src/stores/gameSession.ts`
  - Modified: `src/views/game/GameView.vue`
  - Modified: `src/views/game/selectors.ts`
  - Modified: `src/views/game/types.ts`
  - Modified: `src/views/game/components/GameTableView.vue`
  - Modified: `tests/ui/game-session.store.test.ts`
  - Modified: `tests/ui/game-table-view.test.ts`
  - Modified: `tests/ui/next-round-flow.test.ts`
  - New: `tests/ui/match-setup-modal.test.ts`
