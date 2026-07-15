## ADDED Requirements

### Requirement: Dealer badge on all four player panels

The table view SHALL render an explicit dealer badge on the current dealer's player panel so the user can identify the dealer without relying on summary text alone.

#### Scenario: Current dealer panel shows a dealer badge

- **WHEN** the game snapshot identifies one seat as `dealerSeat`
- **THEN** the matching player panel MUST render a dealer badge, and all non-dealer panels MUST NOT render that badge

##### Example: west dealer is visible on the west panel

- **GIVEN** a snapshot with `dealerSeat = west`
- **WHEN** the table view renders the four player panels
- **THEN** only the `west` panel MUST show the dealer badge

### Requirement: Strong active turn highlight on the current player panel

The table view SHALL render a strong panel-level highlight for the current acting seat so the user can tell at a glance which seat is currently drawing or discarding.

#### Scenario: Active player panel follows the current seat

- **WHEN** the snapshot `currentSeat` changes during normal round progression
- **THEN** the corresponding player panel MUST render the active-turn highlight and the previously active panel MUST lose it

##### Example: south active turn moves highlight to south

- **GIVEN** a snapshot with `currentSeat = south` and `phase = discard`
- **WHEN** the table view renders the player panels
- **THEN** the `south` panel MUST render the active-turn highlight

### Requirement: AI auto-turn pacing remains human-readable

The frontend session loop SHALL pace AI-driven turn advancement at an approximately two-second cadence so users can visually follow which seat is currently acting.

#### Scenario: AI discard does not resolve instantaneously

- **WHEN** the current acting seat is AI-controlled and the round is still in progress
- **THEN** the frontend MUST delay the next visible auto-turn advancement by roughly two seconds instead of immediately chaining through the next action

##### Example: south AI turn pauses before discarding

- **GIVEN** a live round where `south` is the current acting seat and no human decision is pending
- **WHEN** the session loop advances through the AI turn
- **THEN** the visible next state MUST appear only after the configured pacing delay

#### Scenario: Human claim windows are not skipped by AI pacing

- **WHEN** an AI discard opens a human-legal `claim-window`
- **THEN** the frontend MUST stop at that claim window and MUST NOT consume the pacing timer to auto-pass on behalf of the human

##### Example: human win opportunity interrupts AI pacing

- **GIVEN** an AI discard produces a `claim-window` where the human has a legal `win` candidate
- **WHEN** the session loop reaches that state
- **THEN** the UI MUST remain on the claim window until the human responds
