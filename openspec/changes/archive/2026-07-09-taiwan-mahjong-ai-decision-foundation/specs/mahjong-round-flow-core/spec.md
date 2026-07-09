## ADDED Requirements

### Requirement: AI-safe round state consumption

The round flow core SHALL expose a stable state shape that an AI consumer can read to choose among legal actions without bypassing the rules engine.

#### Scenario: AI reads legal decision context

- **WHEN** an AI player needs to make a discard or claim decision
- **THEN** the round flow core SHALL provide enough legal state context for AI evaluation, including current seat, hand state, triggering discard if any, and legal action candidates

##### Example: AI consumes legal claim context

- **GIVEN** a claim window state produced by round flow
- **WHEN** the AI reads that state to choose an action
- **THEN** the AI consumer MUST be able to inspect the triggering discard and candidate claim actions without mutating workflow internals directly
