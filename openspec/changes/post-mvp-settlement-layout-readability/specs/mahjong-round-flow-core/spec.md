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

### Requirement: Round flow preserves chronological discard sequence

Round flow core SHALL preserve an authoritative sequence of currently visible, unclaimed discards in actual discard order in addition to the seat-owned discard state required by claim resolution.

#### Scenario: Discards append in actual turn order

- **GIVEN** east has discarded `1-character` and south then discards `5-dot`
- **WHEN** round flow applies both legal discard transitions
- **THEN** the chronological discard sequence MUST equal [`1-character`, `5-dot`]

#### Scenario: Accepted claim removes the triggering discard

- **GIVEN** the final chronological discard is `west-wind` and a legal `pon` claims that tile
- **WHEN** round flow resolves the accepted claim
- **THEN** `west-wind` MUST be removed from both the triggering seat's discard state and the final chronological sequence entry
