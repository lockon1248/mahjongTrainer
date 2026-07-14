## ADDED Requirements

### Requirement: Interactive turn advancement

The session store SHALL advance the round by delegating to round-flow core APIs in response to view intents, and SHALL NOT re-implement rule evaluation in the store or in components.

#### Scenario: Draw advances the current seat into discard phase

- **WHEN** the current seat draws while the round phase is `draw`
- **THEN** the store SHALL call the round-flow core draw API and expose an updated snapshot whose phase is `discard`

##### Example: dealer draw moves to discard

- **GIVEN** an initialized round where the dealer seat `east` is in phase `draw`
- **WHEN** the store advances the draw for `east`
- **THEN** the exposed snapshot MUST report phase `discard` for seat `east` without the component computing any rule outcome

### Requirement: Human seat discard action

The game table view SHALL allow the human seat to discard one concealed tile and SHALL forward that discard intent to the store, which applies it through the round-flow core.

#### Scenario: Human discards a concealed tile

- **WHEN** the human seat is in phase `discard` and selects one of its concealed tiles in the table view
- **THEN** the view SHALL forward the selected tile to the store discard action, and the store SHALL apply it via core so the concealed count decreases by one and that tile appears in the seat discards

##### Example: dealer discards from 17 tiles

- **GIVEN** the human dealer seat `east` holds 17 concealed tiles in phase `discard`
- **WHEN** the human selects one concealed tile to discard
- **THEN** the exposed snapshot MUST show 16 concealed tiles for `east` and the discarded tile recorded in `east` discards

### Requirement: AI-driven opponent turns

The session store SHALL drive non-human seats using the AI decision core to choose discards and claims, and SHALL advance the round automatically until human input is required or the round ends.

#### Scenario: AI seat discards automatically

- **WHEN** the current seat is a non-human seat in phase `discard`
- **THEN** the store SHALL use the AI decision core to choose a discard and apply it via round-flow core without requiring human input

##### Example: non-dealer AI seat plays its turn

- **GIVEN** a round where control has passed to AI seat `south` in phase `draw`
- **WHEN** the store advances the turn loop
- **THEN** seat `south` MUST draw and discard automatically, and control MUST move forward through the round

### Requirement: Automatic claim-window resolution

During a claim window, the session store SHALL collect claims from AI seats using the AI decision core and SHALL resolve the window through round-flow core, treating the human seat as passing, then continue the turn loop.

#### Scenario: Claim window resolves without human claim input

- **WHEN** a discard opens a `claim-window`
- **THEN** the store SHALL collect AI claims, treat the human seat as passing, resolve the window via core, and expose the resulting snapshot with the claim window cleared

##### Example: no valid claim passes turn to next seat

- **GIVEN** a `claim-window` opened by a discard from seat `east` where no seat has a valid claim
- **WHEN** the store resolves the claim window
- **THEN** the exposed snapshot MUST clear the pending claim window and move control to the next seat in phase `draw`

### Requirement: Turn progress reflected read-only

The game table view SHALL reflect round advancement in a read-only manner, surfacing current seat, phase, last claim resolution, and outcome after each advancement, without recomputing rule outcomes in the component.

#### Scenario: View shows updated progress after advancement

- **WHEN** the round advances and the store snapshot changes
- **THEN** the table view SHALL display the updated current seat, phase, and last claim resolution derived from the snapshot

##### Example: last claim resolution appears after a pass

- **GIVEN** a claim window that resolves as a pass
- **WHEN** the table view re-renders from the updated snapshot
- **THEN** the view MUST show the current seat and phase advancing, and a last claim resolution of `pass`

### Requirement: Turn advancement failure handling

If a turn advancement fails, the session store SHALL preserve an explicit error state and SHALL NOT silently present a stale or empty table.

#### Scenario: Advancement error is surfaced

- **WHEN** a store turn-advancement action throws while applying a core operation
- **THEN** the store SHALL record an explicit error state and SHALL NOT overwrite the current snapshot with an empty table

##### Example: illegal discard preserves error state

- **GIVEN** an initialized round exposed by the store
- **WHEN** a discard is requested for a tile the current seat does not hold
- **THEN** the store MUST expose a non-null error state and MUST NOT clear the existing round snapshot into an empty table
