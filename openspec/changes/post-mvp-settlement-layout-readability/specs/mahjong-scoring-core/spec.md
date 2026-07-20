## ADDED Requirements

### Requirement: Dealer continuation adds cumulative tai

Scoring core SHALL add one structured `dealer-continuation` scoring item when the winning seat is the dealer and the authoritative continuation count is greater than zero. The item's tai SHALL equal the continuation count and SHALL be included in `totalTai` in addition to the existing one-tai dealer item.

#### Scenario: First continuation adds one tai

- **WHEN** the dealer wins with continuation count 1
- **THEN** settlement MUST include `莊家 1 台` and `連莊 1 台`

#### Scenario: Second continuation adds two tai

- **WHEN** the dealer wins with continuation count 2
- **THEN** settlement MUST include one `連莊 2 台` item and add 2 to `totalTai`

#### Scenario: Non-dealer receives no continuation tai

- **WHEN** a non-dealer wins
- **THEN** settlement MUST NOT include a dealer-continuation scoring item

