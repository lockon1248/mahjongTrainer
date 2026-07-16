# mahjong-ai-core Specification

## Purpose

TBD - created by archiving change 'taiwan-mahjong-ai-claim-quality-pass'. Update Purpose after archive.

## Requirements

### Requirement: AI self-turn action decision

AI decision core 在自己的回合存在合法自回合動作時，必須能產生穩定決策，而不是直接略過到 discard。

#### Scenario: Self-draw win is chosen before lower-priority self-turn actions

- **WHEN** AI 在自己的回合同時存在 `win-self-draw` 與其他合法自回合候選
- **THEN** AI decision core 必須優先選擇 `win-self-draw`

##### Example: self-draw win beats concealed kan

- **GIVEN** 一組同時包含 `win-self-draw` 與 `kan-concealed` 的合法 AI 自回合候選
- **WHEN** decision core 做出選擇
- **THEN** 決策 MUST 為 `win-self-draw`

<!-- @trace
source: taiwan-mahjong-ai-claim-quality-pass
updated: 2026-07-14
code:
  - src/core/ai/decision.ts
  - src/stores/gameSession.ts
  - src/views/game/GameView.vue
  - src/core/rules/types.ts
  - src/core/ai/types.ts
  - src/views/game/components/GameTableView.vue
  - src/core/rules/roundFlow.ts
  - AGENTS.md
  - src/core/types/table.ts
  - src/views/game/selectors.ts
  - src/views/game/types.ts
tests:
  - tests/ui/interactive-turn-loop.test.ts
  - tests/ui/game-session.store.test.ts
  - tests/ui/round-result-sync.test.ts
  - tests/core/dealer-progression.test.ts
  - tests/ui/ai-self-turn-actions.test.ts
  - tests/ui/next-round-flow.test.ts
  - tests/core/human-self-turn-actions.test.ts
  - tests/ui/human-claim-window.test.ts
  - tests/ui/human-self-turn-actions.test.ts
  - tests/core/ai-decision-core.test.ts
-->

---
### Requirement: Concealed kong privacy in AI runtime context

AI runtime integrations SHALL mask another seat's concealed kong tile identities before constructing non-owning AI decision context, so AI agents cannot infer hidden tile values from runtime meld data.

#### Scenario: Non-owning AI does not receive another seat's concealed kong tiles

- **WHEN** the runtime builds an AI decision context for seat `south`, and seat `west` already has a `kan-concealed` meld
- **THEN** the context for `south` MUST preserve that `west` has a concealed kong, but MUST NOT expose the actual tile identities inside that meld

##### Example: west concealed kong stays hidden from south AI

- **GIVEN** `west` has a concealed kong of `7-bamboo`
- **WHEN** the runtime builds `south` AI context for discard or claim evaluation
- **THEN** `south` MUST NOT receive `7-bamboo` meld tiles for `west`

<!-- @trace
source: taiwan-mahjong-concealed-kong-visibility
updated: 2026-07-16
code:
  - src/views/game/components/GameTableView.vue
  - src/views/game/components/MatchSetupModal.vue
  - src/views/game/GameView.vue
  - src/views/game/types.ts
  - src/views/game/constants.ts
  - src/stores/gameSession.ts
  - src/core/rules/roundFlow.ts
  - src/views/game/selectors.ts
tests:
  - tests/ui/game-session.store.test.ts
  - tests/ui/interactive-turn-loop.test.ts
  - tests/core/ai-decision-core.test.ts
  - tests/ui/match-setup-modal.test.ts
  - tests/ui/game-table-layout.test.ts
  - tests/ui/next-round-flow.test.ts
  - tests/ui/round-result-sync.test.ts
  - tests/ui/game-table-view.test.ts
-->