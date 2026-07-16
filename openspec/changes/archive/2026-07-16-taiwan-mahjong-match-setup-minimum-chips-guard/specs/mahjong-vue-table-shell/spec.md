## ADDED Requirements

### Requirement: Match setup modal blocks chips below 100

The frontend SHALL block setup submission when the initial chip input is below `100`, so the user cannot accidentally start an unsafe low-chip match from the UI.

#### Scenario: Modal does not submit an unsafe chip value

- **WHEN** the user enters an initial chip amount below `100`
- **THEN** the setup modal MUST NOT emit a submit event

##### Example: 10 chips cannot start a match

- **GIVEN** the setup modal is visible
- **WHEN** the user enters `10` as initial chips and clicks submit
- **THEN** no submit event MUST be emitted

