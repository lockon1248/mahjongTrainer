## ADDED Requirements

### Requirement: Match setup modal explains why chips below 100 are blocked

The frontend SHALL explain inside the setup modal why an initial chip amount below `100` cannot start a match, so the user does not get stuck without feedback.

#### Scenario: Modal shows a clear validation message for unsafe chips

- **WHEN** the user enters an initial chip amount below `100` and tries to submit
- **THEN** the modal MUST keep blocking submit and MUST render a clear validation message that explains the minimum is `100`

##### Example: 10 chips shows the blocking reason

- **GIVEN** the setup modal is visible
- **WHEN** the user enters `10` as initial chips and clicks submit
- **THEN** the modal MUST show a message that initial chips cannot be lower than `100`

