## ADDED Requirements

### Requirement: Vue app shell bootstrap

The frontend SHALL provide a bootable Vue application shell for the mahjong trainer.

#### Scenario: Application boots successfully

- **WHEN** the browser loads the app entrypoint
- **THEN** the Vue application shell SHALL mount successfully without requiring backend services

##### Example: local shell mounts

- **GIVEN** a local browser session with the built frontend assets
- **WHEN** the application entrypoint is loaded
- **THEN** the root application shell MUST render without a blank-screen failure

### Requirement: Router with home and game entrypoints

The frontend SHALL provide at least a home route and a game route.

#### Scenario: Navigate to the game route

- **WHEN** the user navigates to the game entrypoint
- **THEN** the router SHALL render the game view container instead of a missing-route fallback

##### Example: game route renders

- **GIVEN** the application router is active
- **WHEN** the user opens the game route
- **THEN** the game view container MUST be mounted

### Requirement: Read-only game table shell

The frontend SHALL render a read-only mahjong table shell that maps round state from core-backed store data.

#### Scenario: Render a table snapshot

- **WHEN** the game store holds an initialized round snapshot
- **THEN** the game table view SHALL render visible player areas, table summary, current turn information, and round outcome summary from that snapshot

##### Example: initialized round appears on screen

- **GIVEN** a store state containing an initialized round snapshot
- **WHEN** the game table view renders
- **THEN** the view MUST show all seats and current round information without re-implementing rule logic in the component

### Requirement: Pinia session skeleton

The frontend SHALL provide a Pinia-backed session store that initializes and exposes the current round snapshot through core APIs.

#### Scenario: Start a new local round from the store

- **WHEN** the store initializes a new round
- **THEN** it SHALL call core APIs to create the round snapshot and expose the resulting state to the view layer

##### Example: store exposes initialized snapshot

- **GIVEN** the store starts from an empty session state
- **WHEN** a new local round is requested
- **THEN** the store MUST expose an initialized round snapshot for the game view
