## ADDED Requirements

### Requirement: Ended match can restart through existing setup

The match session SHALL provide an explicit reset action that clears the completed match and round and returns the session to its existing setup state without inventing a new default match.

#### Scenario: Restart returns to setup

- **WHEN** the user activates `重新開始` from an ended match settlement
- **THEN** the session MUST clear the completed round, expose setup state, and require the existing setup submission before a new round begins

