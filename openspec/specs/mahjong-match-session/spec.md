# mahjong-match-session Specification

## Purpose

TBD - created by archiving change 'taiwan-mahjong-match-stakes-and-victory-setup'. Update Purpose after archive.

## Requirements

### Requirement: Match setup gates the first round

The local match session SHALL require setup input before the first round starts, so the game does not create a real playable round until the user provides initial chips and a victory condition.

#### Scenario: Setup modal blocks first-round initialization

- **WHEN** the game view opens a fresh local match session
- **THEN** the session MUST remain unstarted until the user submits an initial chip amount and one of the supported victory conditions

##### Example: setup required before east opening round

- **GIVEN** a fresh visit to the local game route
- **WHEN** the user has not yet submitted match setup
- **THEN** no first round MUST be initialized


<!-- @trace
source: taiwan-mahjong-match-stakes-and-victory-setup
updated: 2026-07-16
code:
  - src/core/rules/roundFlow.ts
  - src/stores/gameSession.ts
  - src/views/game/GameView.vue
  - src/views/game/constants.ts
  - src/views/game/types.ts
  - src/views/game/components/GameTableView.vue
  - src/views/game/selectors.ts
  - src/views/game/components/MatchSetupModal.vue
tests:
  - tests/ui/game-table-view.test.ts
  - tests/ui/game-table-layout.test.ts
  - tests/core/ai-decision-core.test.ts
  - tests/ui/interactive-turn-loop.test.ts
  - tests/ui/round-result-sync.test.ts
  - tests/ui/game-session.store.test.ts
  - tests/ui/next-round-flow.test.ts
  - tests/ui/match-setup-modal.test.ts
-->

---
### Requirement: Match chips settle from round tai results

The match session SHALL convert each completed winning round into chip changes using fixed `base = 30` and `taiValue = 10`, so chip totals come from authoritative round scoring rather than placeholder numbers.

#### Scenario: Winning round applies chip transfer to match totals

- **WHEN** a round ends with a winning result that includes `totalTai`
- **THEN** the match session MUST update seat chip totals according to the configured victory mode settlement using `base = 30` and `taiValue = 10`

##### Example: discard win updates match chips

| totalTai | base | taiValue | Expected chip effect |
| ----- | ----- | ----- | ----- |
| 3 | 30 | 10 | settlement uses `30 + 3 * 10` as the transferable amount |


<!-- @trace
source: taiwan-mahjong-match-stakes-and-victory-setup
updated: 2026-07-16
code:
  - src/core/rules/roundFlow.ts
  - src/stores/gameSession.ts
  - src/views/game/GameView.vue
  - src/views/game/constants.ts
  - src/views/game/types.ts
  - src/views/game/components/GameTableView.vue
  - src/views/game/selectors.ts
  - src/views/game/components/MatchSetupModal.vue
tests:
  - tests/ui/game-table-view.test.ts
  - tests/ui/game-table-layout.test.ts
  - tests/core/ai-decision-core.test.ts
  - tests/ui/interactive-turn-loop.test.ts
  - tests/ui/round-result-sync.test.ts
  - tests/ui/game-session.store.test.ts
  - tests/ui/next-round-flow.test.ts
  - tests/ui/match-setup-modal.test.ts
-->

---
### Requirement: Bankruptcy victory ends the match immediately

The match session SHALL support a victory mode where the match ends immediately once any seat reaches zero or negative chips, and the seat with the highest chip total is declared the match winner.

#### Scenario: Bankruptcy threshold ends the match

- **WHEN** settlement causes at least one seat's chips to become `<= 0`
- **THEN** the match MUST end immediately and compute the highest-chip seat as match winner

##### Example: one seat drops below zero

- **GIVEN** the selected victory mode is bankruptcy
- **WHEN** `north` settles to `-20` chips after a round
- **THEN** the match MUST stop without creating another round


<!-- @trace
source: taiwan-mahjong-match-stakes-and-victory-setup
updated: 2026-07-16
code:
  - src/core/rules/roundFlow.ts
  - src/stores/gameSession.ts
  - src/views/game/GameView.vue
  - src/views/game/constants.ts
  - src/views/game/types.ts
  - src/views/game/components/GameTableView.vue
  - src/views/game/selectors.ts
  - src/views/game/components/MatchSetupModal.vue
tests:
  - tests/ui/game-table-view.test.ts
  - tests/ui/game-table-layout.test.ts
  - tests/core/ai-decision-core.test.ts
  - tests/ui/interactive-turn-loop.test.ts
  - tests/ui/round-result-sync.test.ts
  - tests/ui/game-session.store.test.ts
  - tests/ui/next-round-flow.test.ts
  - tests/ui/match-setup-modal.test.ts
-->

---
### Requirement: Four prevailing-wind rounds victory waits for full match completion

The match session SHALL support a victory mode where the match continues until the full east/south/west/north prevailing-wind cycle completes, then declares the highest-chip seat as match winner.

#### Scenario: Match continues until the fourth prevailing-wind cycle finishes

- **WHEN** the selected victory mode is four prevailing-wind rounds and the match has not yet completed the north prevailing-wind cycle
- **THEN** the session MUST keep allowing next-round progression even if chip totals already have a leader

##### Example: east and south rounds are not enough

- **GIVEN** the selected victory mode is four prevailing-wind rounds
- **WHEN** the session has only completed east and south prevailing-wind cycles
- **THEN** the match MUST remain in progress

<!-- @trace
source: taiwan-mahjong-match-stakes-and-victory-setup
updated: 2026-07-16
code:
  - src/core/rules/roundFlow.ts
  - src/stores/gameSession.ts
  - src/views/game/GameView.vue
  - src/views/game/constants.ts
  - src/views/game/types.ts
  - src/views/game/components/GameTableView.vue
  - src/views/game/selectors.ts
  - src/views/game/components/MatchSetupModal.vue
tests:
  - tests/ui/game-table-view.test.ts
  - tests/ui/game-table-layout.test.ts
  - tests/core/ai-decision-core.test.ts
  - tests/ui/interactive-turn-loop.test.ts
  - tests/ui/round-result-sync.test.ts
  - tests/ui/game-session.store.test.ts
  - tests/ui/next-round-flow.test.ts
  - tests/ui/match-setup-modal.test.ts
-->

---
### Requirement: Match setup enforces minimum initial chips

The local match session SHALL reject initial chip inputs below `100`, so unsafe low-chip matches cannot start even if setup is invoked outside the modal.

#### Scenario: Store rejects chips below the minimum

- **WHEN** a caller tries to start a local match with initial chips below `100`
- **THEN** the session MUST remain unstarted and MUST NOT create a match config or first round

##### Example: direct store call with 10 chips is rejected

- **GIVEN** a fresh local session
- **WHEN** `startLocalRound({ initialChips: 10, victoryMode: 'bankruptcy' })` is invoked
- **THEN** no round MUST be initialized

<!-- @trace
source: taiwan-mahjong-match-setup-minimum-chips-guard
updated: 2026-07-16
code:
  - src/views/game/matchSetup.ts
  - src/stores/gameSession.ts
  - src/views/game/components/MatchSetupModal.vue
  - src/views/game/constants.ts
tests:
  - tests/ui/game-session.store.test.ts
  - tests/ui/match-setup-modal.test.ts
-->