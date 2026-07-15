## ADDED Requirements

### Requirement: 結構化 scoring item 必須成為 runtime 結果輸出

The scoring runtime SHALL return structured scoring items instead of plain pattern-id strings, so downstream UI and tests can render and verify the exact tai breakdown without reverse-mapping from ad-hoc labels.

#### Scenario: settlement returns structured scoring items

- **WHEN** a winning hand completes scoring evaluation and settlement
- **THEN** each item in `scoringItems` MUST include a stable `patternId`, display `label`, numeric `tai`, and a machine-stable reason or source summary

##### Example: dealer self-draw result keeps item metadata

- **GIVEN** a winning hand that matches `dealer-win` and `self-draw`
- **WHEN** the runtime builds the settlement result
- **THEN** `scoringItems` MUST contain two structured items rather than two raw strings, and `totalTai` MUST equal the sum of their `tai`

### Requirement: profile-aware scoring catalog MUST drive runtime evaluation

The scoring runtime SHALL evaluate patterns from a profile-aware scoring catalog, so `classic-taiwan` and `flower-wind-bonus` can produce different valid results for the same hand while sharing one evaluation pipeline.

#### Scenario: same hand produces profile-specific scoring items

- **WHEN** the same legal winning hand is evaluated once under `classic-taiwan` and once under `flower-wind-bonus`
- **THEN** the runtime MUST allow the resulting `scoringItems` to differ according to the active profile, while preserving the same result shape

##### Example: flower and wind scoring differs by profile

- **GIVEN** a winning hand that includes flower tiles and a wind triplet
- **WHEN** scoring runs under both supported profiles
- **THEN** the two results MUST expose different scoring items if the profiles define different flower or wind behavior

### Requirement: conflict and override rules MUST be enforced before totalTai is finalized

The scoring runtime SHALL resolve mutual exclusion, override, and replacement rules before computing the final tai total, rather than summing every matched candidate blindly.

#### Scenario: override rule removes lower-priority items

- **WHEN** a hand matches both an overriding pattern and the lower-priority patterns it replaces
- **THEN** the final `scoringItems` MUST exclude the replaced items before `totalTai` is calculated

##### Example: concealed self-draw replaces concealed-hand and self-draw

- **GIVEN** a hand that satisfies `concealed-hand`, `self-draw`, and `concealed-self-draw`
- **WHEN** the runtime resolves scoring conflicts
- **THEN** the final result MUST keep `concealed-self-draw` and MUST NOT keep the replaced lower-priority items
