## ADDED Requirements

### Requirement: Match setup modal uses real session state

The frontend SHALL render a match setup modal driven by session state, so the user can configure initial chips and victory condition before the first round begins.

#### Scenario: User can submit initial chips and victory mode from the modal

- **WHEN** the local game view is opened before a match has started
- **THEN** the frontend MUST show a setup modal that accepts an initial chip amount and exactly one supported victory condition choice

##### Example: user configures bankruptcy mode

- **GIVEN** the setup modal is visible
- **WHEN** the user enters `500` as initial chips and selects bankruptcy victory
- **THEN** submitting the modal MUST start the first round with those match settings

### Requirement: Table shell renders real match chip status

The frontend SHALL render match chip status and match-ending summary from authoritative session state, and SHALL NOT expose placeholder chip UI before setup exists.

#### Scenario: Chip status appears only after setup initializes a match

- **WHEN** the user has completed match setup and the session has started
- **THEN** the table shell MUST render chip totals and active match victory mode from real session state

##### Example: configured chips appear on the board

- **GIVEN** the user started a match with `1000` initial chips
- **WHEN** the first round snapshot renders
- **THEN** each seat chip display MUST come from the initialized match state instead of placeholder score text
