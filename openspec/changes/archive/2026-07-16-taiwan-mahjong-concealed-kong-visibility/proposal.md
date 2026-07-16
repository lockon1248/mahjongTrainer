## Why

目前牌桌快照與 AI decision context 會直接帶出完整 meld tiles，導致 AI 暗槓後，使用者與其他 AI 都能立即知道槓的是哪張牌。這違反暗槓應保密的牌桌語意，也讓對局資訊比實際桌面多。

## What Changes

- 將 AI 與 UI 使用的可見副露資料從內部真實 meld state 分離，讓非擁有者只看到「有一組暗槓」而不是具體牌張。
- 保留擁有者本人與終局和牌證明所需的真實牌張資料，不讓保密需求破壞自家操作或終局驗證。
- 補上 UI 與 AI regression，確保非擁有者看不到 AI 暗槓牌值。

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `mahjong-ai-core`: AI runtime inputs for non-owning seats MUST NOT expose the tile identities of another seat's concealed kong meld.
- `mahjong-vue-table-shell`: table snapshots shown to the human player MUST mask AI concealed kong tiles while the round is in progress.

## Impact

- Affected specs: `mahjong-ai-core`, `mahjong-vue-table-shell`
- Affected code:
  - Modified: `src/views/game/selectors.ts`
  - Modified: `src/views/game/types.ts`
  - Modified: `src/views/game/components/GameTableView.vue`
  - Modified: `src/stores/gameSession.ts`
  - Modified: `src/core/ai/context.ts`
  - Modified: `src/core/ai/types.ts`
  - Modified: `tests/ui/game-table-view.test.ts`
  - Modified: `tests/ui/round-result-sync.test.ts`
  - Modified: `tests/ui/game-session.store.test.ts`
  - Modified: `tests/core/ai-decision-core.test.ts`
