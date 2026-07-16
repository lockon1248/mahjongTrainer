## ADDED Requirements

### Requirement: Match setup enforces minimum initial chips

The local match session SHALL reject initial chip inputs below `100`, so unsafe low-chip matches cannot start even if setup is invoked outside the modal.

#### Scenario: Store rejects chips below the minimum

- **WHEN** a caller tries to start a local match with initial chips below `100`
- **THEN** the session MUST remain unstarted and MUST NOT create a match config or first round

##### Example: direct store call with 10 chips is rejected

- **GIVEN** a fresh local session
- **WHEN** `startLocalRound({ initialChips: 10, victoryMode: 'bankruptcy' })` is invoked
- **THEN** no round MUST be initialized

