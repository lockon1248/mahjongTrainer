## ADDED Requirements

### Requirement: Round flow tracks cumulative dealer continuation

Round flow core SHALL store a non-negative dealer-continuation count in authoritative table state. The count SHALL start at zero, increment by one whenever the same dealer continues into the next round after a dealer win or draw, and reset to zero whenever dealer changes.

#### Scenario: Dealer win increments continuation

- **WHEN** a dealer wins with continuation count 0 and the next round is created with the same dealer
- **THEN** the next round MUST have continuation count 1

#### Scenario: Repeated dealer win accumulates continuation

- **WHEN** a dealer wins with continuation count 1 and continues into the next round
- **THEN** the next round MUST have continuation count 2

#### Scenario: Dealer change resets continuation

- **WHEN** a non-dealer win causes dealer rotation
- **THEN** the next round MUST have continuation count 0

#### Scenario: Draw continuation increments count

- **WHEN** a draw creates the next round with the same dealer
- **THEN** the next round MUST increment the continuation count by one

