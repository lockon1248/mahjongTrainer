## ADDED Requirements

### Requirement: UI-safe round state consumption

The round flow core SHALL expose a stable round snapshot that UI and store layers can consume without re-implementing rule evaluation.

#### Scenario: Store reads a round snapshot for rendering

- **WHEN** the frontend store requests the current round snapshot for view rendering
- **THEN** the round flow core SHALL provide a stable state shape containing table, players, current seat, phase, pending-action context, and outcome data needed by the UI shell

##### Example: game view receives renderable snapshot

- **GIVEN** a newly initialized round state in core
- **WHEN** the frontend store forwards that snapshot to the game table view
- **THEN** the UI consumer MUST be able to render current round information without recomputing legal-rule outcomes in Vue components
