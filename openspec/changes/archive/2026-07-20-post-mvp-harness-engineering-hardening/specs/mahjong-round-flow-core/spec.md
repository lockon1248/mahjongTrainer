## MODIFIED Requirements

### Requirement: Next-round dealer progression after draw

The round flow core SHALL provide a stable next-round initialization rule for draw outcomes. A draw SHALL keep the same dealer so the table can continue as a multi-round session without contradicting the outcome metadata.

#### Scenario: Draw keeps the same dealer

- **WHEN** the previous round ends as `draw`
- **THEN** round flow core MUST create the next round with the same `dealerSeat`

##### Example: east remains dealer after draw

- **GIVEN** a reachable completed round with `outcome = draw` and `dealerSeat = east`
- **WHEN** the caller requests the next round
- **THEN** the new round `dealerSeat` MUST remain `east`
- **THEN** the new round `currentSeat` MUST be `east` and its phase MUST be `discard`

#### Scenario: Draw dealer metadata has one oracle

- **WHEN** the baseline rule config and exhaustive draw outcome describe dealer continuation
- **THEN** the rule config MUST contain `postDraw.dealerContinuation = { status: "configured", value: true }`
- **THEN** the draw outcome MUST NOT advertise dealer continuation as unresolved

#### Scenario: Ready-hand policies do not block next-round creation

- **WHEN** a draw outcome retains unresolved ready-hand checking or payment
- **THEN** the caller MUST still be able to create the next round with the same dealer
- **THEN** round flow core MUST NOT synthesize ready-hand settlement or penalties

## REMOVED Requirements

### Requirement: Draw outcome stays unresolved for undecided post-draw rules

**Reason**: The user-confirmed baseline now settles dealer continuation to same-dealer continuation, and the existing requirement directly contradicts the active next-round draw behavior.

**Migration**: Configure `postDraw.dealerContinuation` to `true`, remove `dealer-continuation` from exhaustive draw unresolved metadata, retain unresolved ready-hand policies, and create the next round with the previous `dealerSeat`.

#### Scenario: Removed unresolved dealer behavior is rejected

- **WHEN** an exhaustive draw is produced under the baseline rule config
- **THEN** the result MUST NOT advertise `dealer-continuation` as unresolved and next-round creation MUST NOT be blocked by dealer continuation
