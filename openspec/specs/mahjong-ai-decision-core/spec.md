# mahjong-ai-decision-core Specification

## Purpose

TBD - created by archiving change 'taiwan-mahjong-ai-decision-foundation'. Update Purpose after archive.

## Requirements

### Requirement: AI discard decision

The AI decision core SHALL choose one discard tile from a legal in-hand position during its own discard turn.

#### Scenario: Choose a discard from legal concealed tiles

- **WHEN** the AI receives a legal discard-turn state with one or more discardable concealed tiles
- **THEN** the AI decision core SHALL return exactly one discard decision that references a tile currently present in the AI player's concealed hand

##### Example: choose one legal discard

- **GIVEN** an AI hand with several legal discard candidates and no winning action already available
- **WHEN** discard evaluation runs
- **THEN** the returned decision MUST reference one tile from that concealed hand and MUST NOT invent a tile outside the current hand


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

---
### Requirement: AI win-first claim decision

The AI decision core SHALL prioritize winning when a legal winning claim exists.

#### Scenario: Prefer win over lower-priority claim actions

- **WHEN** the AI receives candidate claims that include a legal `win` action
- **THEN** the AI decision core SHALL choose the winning claim instead of `kan-exposed`, `pon`, `chi`, or `pass`

##### Example: legal win beats pon

- **GIVEN** an AI candidate claim set containing both `win` and `pon`
- **WHEN** the AI claim evaluator runs
- **THEN** the selected action MUST be `win`


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

---
### Requirement: AI heuristic claim decision

The AI decision core SHALL use deterministic heuristics to choose between legal `kan-exposed`, `pon`, `chi`, and `pass` when no winning claim is available.

#### Scenario: Choose a beneficial meld claim

- **WHEN** the AI receives only non-winning candidate claims and at least one claim improves its hand progression according to the supported heuristic
- **THEN** the AI decision core SHALL choose the highest-scoring supported claim

##### Example: choose chi over pass

- **GIVEN** a candidate claim set where `chi` creates a stronger hand progression than `pass`
- **WHEN** the AI claim evaluator runs
- **THEN** the selected action MUST be `chi`

#### Scenario: Pass when no supported claim is worthwhile

- **WHEN** the AI receives non-winning candidate claims that do not improve supported hand progression compared with passing
- **THEN** the AI decision core SHALL choose `pass`

##### Example: conservative pass

- **GIVEN** a candidate claim set whose available melds break useful structure without immediate supported benefit
- **WHEN** the AI claim evaluator runs
- **THEN** the selected action MUST be `pass`


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

---
### Requirement: Conservative unresolved-rule handling

The AI decision core SHALL remain conservative when a potential decision depends on unresolved table rules.

#### Scenario: Ignore unresolved bonus assumptions

- **WHEN** a heuristic branch would require unresolved table-rule details that are not configured in rule config
- **THEN** the AI decision core SHALL ignore that unresolved bonus or penalty instead of inventing a hidden assumption

##### Example: unresolved special hand bonus is ignored

- **GIVEN** an AI hand that could be valued differently only if an unresolved special hand rule were assumed
- **WHEN** the AI decision core evaluates the decision under unresolved rule config
- **THEN** the decision score MUST be computed without adding that unresolved rule bonus

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