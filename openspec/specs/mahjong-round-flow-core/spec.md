# mahjong-round-flow-core Specification

## Purpose

TBD - created by archiving change 'taiwan-mahjong-round-flow-foundation'. Update Purpose after archive.

## Requirements

### Requirement: Baseline round setup

The round flow core SHALL create a baseline Taiwan 16-tile round state with four players, east as the starting dealer, dealer receiving 17 starting tiles, and each non-dealer receiving 16 starting tiles before the first discard.

#### Scenario: Deal baseline starting hands

- **WHEN** the caller initializes a new baseline round with a complete wall
- **THEN** the round flow core SHALL assign 17 starting tiles to east, 16 starting tiles to south, west, and north, and set east as the next seat to discard first

##### Example: dealer starts with one extra tile

- **GIVEN** a baseline round setup request with four seats and a complete wall
- **WHEN** the round setup completes before any flower replacement is applied
- **THEN** east MUST hold 17 in-hand tiles, south MUST hold 16, west MUST hold 16, north MUST hold 16, and the turn owner MUST be east


<!-- @trace
source: taiwan-mahjong-round-flow-foundation
updated: 2026-07-09
code:
  - src/core/types/result.ts
  - src/core/index.ts
  - src/core/rules/index.ts
  - src/core/rules/types.ts
  - src/core/rules/roundFlow.ts
tests:
  - tests/core/round-flow-claims.test.ts
  - tests/core/round-flow-flowers.test.ts
  - tests/core/round-flow-setup.test.ts
  - tests/core/round-flow-outcome.test.ts
-->

---
### Requirement: Flower replacement pipeline

The round flow core SHALL treat flower replacement as a deterministic draw pipeline during both initial dealing and later draw actions: any drawn flower tile MUST be revealed immediately and replaced from the tail of the wall until a non-flower tile is obtained.

#### Scenario: Replace a flower during round setup

- **WHEN** a player receives a flower tile during initial dealing or initial hand normalization
- **THEN** the round flow core SHALL move that flower to the player's revealed flower area and continue drawing replacement tiles from the tail until the player's in-hand tile count matches the baseline requirement for that seat

##### Example: FLOWER-REPLACE-001

- **GIVEN** a non-dealer who needs 16 in-hand tiles and whose next drawn tile is a flower
- **WHEN** the round setup applies flower replacement
- **THEN** the flower MUST be revealed, one replacement tile MUST be drawn from the tail, and the player MUST still end with 16 in-hand tiles

#### Scenario: Chain flower replacements until a non-flower appears

- **WHEN** a replacement tile drawn from the tail is also a flower tile
- **THEN** the round flow core SHALL repeat reveal-and-replace steps until a non-flower tile is obtained

##### Example: FLOWER-CHAIN-001

- **GIVEN** a player reveals a flower and the first two tail replacement tiles are also flowers
- **WHEN** the round flow core processes flower replacement
- **THEN** all drawn flowers MUST be revealed in order and replacement MUST continue until the player receives a non-flower tile for the hand


<!-- @trace
source: taiwan-mahjong-round-flow-foundation
updated: 2026-07-09
code:
  - src/core/types/result.ts
  - src/core/index.ts
  - src/core/rules/index.ts
  - src/core/rules/types.ts
  - src/core/rules/roundFlow.ts
tests:
  - tests/core/round-flow-claims.test.ts
  - tests/core/round-flow-flowers.test.ts
  - tests/core/round-flow-setup.test.ts
  - tests/core/round-flow-outcome.test.ts
-->

---
### Requirement: Turn progression for draw and discard

The round flow core SHALL advance the round through explicit draw and discard transitions, preserving the baseline rule that a normal turn consists of drawing one tile and discarding one tile unless the round ends first.

#### Scenario: Advance a normal turn after a discard

- **WHEN** the active seat discards a tile and no winning or claim resolution interrupts the turn
- **THEN** the round flow core SHALL advance the turn to the next seat for the next normal draw transition

##### Example: next seat draws after pass

- **GIVEN** east discards a tile and every eligible claimant passes
- **WHEN** the round flow core finalizes the discard resolution
- **THEN** south MUST become the next seat allowed to perform a normal draw

#### Scenario: Stop normal turn progression after a winning result

- **WHEN** a draw or discard transition produces a valid winning result
- **THEN** the round flow core SHALL end the round as a win outcome and SHALL NOT continue with another normal draw-discard cycle

##### Example: winning tile ends the round

- **GIVEN** south completes a valid winning hand on a claimed discard
- **WHEN** the winning claim is accepted
- **THEN** the round state MUST become a win result instead of advancing to west's normal draw


<!-- @trace
source: taiwan-mahjong-round-flow-foundation
updated: 2026-07-09
code:
  - src/core/types/result.ts
  - src/core/index.ts
  - src/core/rules/index.ts
  - src/core/rules/types.ts
  - src/core/rules/roundFlow.ts
tests:
  - tests/core/round-flow-claims.test.ts
  - tests/core/round-flow-flowers.test.ts
  - tests/core/round-flow-setup.test.ts
  - tests/core/round-flow-outcome.test.ts
-->

---
### Requirement: Claim window resolution

The round flow core SHALL resolve competing claim candidates through a single pending claim window and SHALL derive the effective claim priority order from rule config instead of assuming a fixed global constant.

#### Scenario: Prefer a winning claim over lower-priority claims

- **WHEN** multiple seats declare claims against the same discard and the effective rule config places winning claims above other valid claims
- **THEN** the round flow core SHALL resolve the claim window as a winning claim instead of exposed kan, pon, or chi

##### Example: CLAIM-PRIORITY-001 win beats pon

- **GIVEN** one discard that allows north to win and south to pon
- **WHEN** both claims are submitted into the same pending claim window under a rule config whose priority order is `win > kan-exposed > pon > chi`
- **THEN** the resolved claim MUST be north's winning claim

#### Scenario: Prefer exposed kan over pon and chi when no win exists

- **WHEN** the pending claim window contains no winning claim and the effective rule config places exposed kan above lower-priority claims
- **THEN** the round flow core SHALL resolve the claim window as the exposed kan

##### Example: exposed kan beats chi

- **GIVEN** one discard that allows west to form an exposed kan and south to chi
- **WHEN** both claims are submitted and no valid winning claim exists under a rule config whose priority order is `win > kan-exposed > pon > chi`
- **THEN** the resolved claim MUST be west's exposed kan claim

#### Scenario: Advance the round when every eligible claimant passes

- **WHEN** the pending claim window closes without any accepted claim
- **THEN** the round flow core SHALL resolve the discard as pass and continue the round with the next seat's normal draw transition

##### Example: all claims pass

- **GIVEN** a discard with no accepted chi, pon, kan, or win claim
- **WHEN** the claim window closes
- **THEN** the resolution MUST be pass and the next seat in order MUST receive the next normal draw opportunity


<!-- @trace
source: taiwan-mahjong-rule-config-foundation
updated: 2026-07-09
code:
  - src/core/rules/index.ts
  - src/core/rules/types.ts
  - src/core/types/result.ts
  - src/core/scoring/validation.ts
  - src/core/rules/roundFlow.ts
  - src/core/scoring/settlement.ts
  - tsconfig.json
  - src/core/config/index.ts
  - src/core/config/types.ts
  - src/core/scoring/patterns.ts
  - src/core/types/action.ts
  - package.json
  - src/core/testing/ruleCase.ts
  - src/core/types/player.ts
  - src/core/index.ts
  - src/core/scoring/types.ts
  - src/core/types/table.ts
  - src/core/types/tile.ts
  - src/core/scoring/decomposition.ts
tests:
  - tests/core/round-flow-claims.test.ts
  - tests/core/round-flow-flowers.test.ts
  - tests/core/round-flow-outcome.test.ts
  - tests/core/scoring-hand-decomposition.test.ts
  - tests/core/scoring-patterns.test.ts
  - tests/core/scoring-win-validation.test.ts
  - tests/core/round-flow-setup.test.ts
  - tests/core/rule-config-core.test.ts
  - tests/core/scoring-exports.test.ts
  - tests/core/scoring-settlement.test.ts
-->

---
### Requirement: Exhaustive draw outcome

The round flow core SHALL produce an explicit exhaustive draw outcome when the wall can no longer support another normal draw and no player has already won, and SHALL represent unresolved post-draw branches through rule config policy instead of inventing final business outcomes.

#### Scenario: End the round when the wall is exhausted

- **WHEN** the round reaches a state where no further normal draw can be performed and no winning result has been accepted
- **THEN** the round flow core SHALL return an exhaustive draw outcome

##### Example: DRAW-DEALER-001

- **GIVEN** a round state with no remaining legal normal draw from the wall and no accepted winning claim
- **WHEN** the round flow core evaluates whether play can continue
- **THEN** the result MUST be an exhaustive draw outcome

#### Scenario: Do not invent unresolved post-draw rules

- **WHEN** the round ends as an exhaustive draw and the effective rule config leaves dealer continuation, ready-hand penalties, or listening checks unresolved
- **THEN** the round flow core SHALL NOT assign those outcomes as settled business logic

##### Example: unresolved dealer continuation stays unset

- **GIVEN** an exhaustive draw outcome under a rule config whose post-draw policies remain unresolved
- **WHEN** the result is returned to the caller
- **THEN** the outcome MUST identify the round as drawn and MUST leave dealer continuation or ready-hand settlement unresolved

<!-- @trace
source: taiwan-mahjong-rule-config-foundation
updated: 2026-07-09
code:
  - src/core/rules/index.ts
  - src/core/rules/types.ts
  - src/core/types/result.ts
  - src/core/scoring/validation.ts
  - src/core/rules/roundFlow.ts
  - src/core/scoring/settlement.ts
  - tsconfig.json
  - src/core/config/index.ts
  - src/core/config/types.ts
  - src/core/scoring/patterns.ts
  - src/core/types/action.ts
  - package.json
  - src/core/testing/ruleCase.ts
  - src/core/types/player.ts
  - src/core/index.ts
  - src/core/scoring/types.ts
  - src/core/types/table.ts
  - src/core/types/tile.ts
  - src/core/scoring/decomposition.ts
tests:
  - tests/core/round-flow-claims.test.ts
  - tests/core/round-flow-flowers.test.ts
  - tests/core/round-flow-outcome.test.ts
  - tests/core/scoring-hand-decomposition.test.ts
  - tests/core/scoring-patterns.test.ts
  - tests/core/scoring-win-validation.test.ts
  - tests/core/round-flow-setup.test.ts
  - tests/core/rule-config-core.test.ts
  - tests/core/scoring-exports.test.ts
  - tests/core/scoring-settlement.test.ts
-->

---
### Requirement: AI-safe round state consumption

The round flow core SHALL expose a stable state shape that an AI consumer can read to choose among legal actions without bypassing the rules engine.

#### Scenario: AI reads legal decision context

- **WHEN** an AI player needs to make a discard or claim decision
- **THEN** the round flow core SHALL provide enough legal state context for AI evaluation, including current seat, hand state, triggering discard if any, and legal action candidates

##### Example: AI consumes legal claim context

- **GIVEN** a claim window state produced by round flow
- **WHEN** the AI reads that state to choose an action
- **THEN** the AI consumer MUST be able to inspect the triggering discard and candidate claim actions without mutating workflow internals directly

<!-- @trace
source: taiwan-mahjong-ai-decision-foundation
updated: 2026-07-09
code:
  - src/core/ai/index.ts
  - src/core/scoring/settlement.ts
  - src/core/types/result.ts
  - src/core/index.ts
  - src/core/scoring/validation.ts
  - src/core/scoring/types.ts
  - src/core/config/index.ts
  - src/core/rules/types.ts
  - src/core/config/types.ts
  - src/core/ai/decision.ts
  - src/core/ai/types.ts
  - src/core/ai/context.ts
  - src/core/rules/roundFlow.ts
tests:
  - tests/core/round-flow-outcome.test.ts
  - tests/core/scoring-settlement.test.ts
  - tests/core/ai-decision-core.test.ts
  - tests/core/round-flow-claims.test.ts
  - tests/core/scoring-exports.test.ts
  - tests/core/rule-config-core.test.ts
  - tests/docs/scaffold-boundary.test.ts
-->