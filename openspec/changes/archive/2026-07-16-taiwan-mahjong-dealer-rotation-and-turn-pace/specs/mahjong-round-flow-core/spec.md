## ADDED Requirements

### Requirement: Next-round dealer progression after draw

round flow core SHALL provide a stable next-round initialization rule for draw outcomes so that the table can continue as a multi-round session instead of behaving like a perpetual first-hand east opening.

#### Scenario: Draw keeps the same dealer

- **WHEN** the previous round ends as `draw`
- **THEN** round flow core MUST create the next round with the same `dealerSeat`

##### Example: east remains dealer after draw

- **GIVEN** a completed round with `outcome = draw` and `dealerSeat = east`
- **WHEN** the caller requests the next round
- **THEN** the new round `dealerSeat` MUST remain `east`

### Requirement: Next-round dealer progression forms a continuous session loop

round flow core SHALL expose next-round dealer progression as a continuous session behavior, so the caller can keep advancing rounds without resetting to the original east-opening state every time a new round is created.

#### Scenario: Repeated next-round creation does not reset to the initial dealer

- **WHEN** the caller creates a next round from a previously completed round
- **THEN** the resulting `dealerSeat` MUST come from the prior round result and dealer progression rule, not from the hard-coded initial east-opening setup

##### Example: non-dealer win does not restart at east

- **GIVEN** a completed round whose prior dealer was `east` and whose winner was `south`
- **WHEN** the caller creates the next round
- **THEN** the new round `dealerSeat` MUST be `west`, not `east`
