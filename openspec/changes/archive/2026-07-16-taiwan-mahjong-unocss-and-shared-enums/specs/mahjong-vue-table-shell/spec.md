## ADDED Requirements

### Requirement: Table shell reuses shared presentation labels

The table view SHALL resolve fixed presentation labels through the shared frontend presentation constants so the rendered Chinese copy for tiles, seats, phases, and outcomes stays consistent across the product.

#### Scenario: Game table output remains equivalent after label refactor

- **WHEN** the game table renders a round snapshot that includes tiles, seats, phase text, and result text
- **THEN** the visible Chinese labels MUST match the existing product output even though the mappings are provided by shared constant or enum modules

##### Example: existing table labels remain unchanged

- **GIVEN** a snapshot that includes `east` as dealer, `discard` as phase, `win` as outcome, and tile labels such as `5 dots` and `green dragon`
- **WHEN** the table view renders the snapshot
- **THEN** the UI MUST still display `東家`, `出牌`, `和牌`, `五筒`, and `青發`

### Requirement: Table shell styling remains composable under the shared utility layer

The table view SHALL express primary layout, spacing, and state highlight styling through the shared utility styling layer so ongoing UI changes do not require duplicating large page-specific CSS blocks for each new panel state.

#### Scenario: Player panel states can be composed through utility classes

- **WHEN** the table view renders combinations such as dealer badge, active turn highlight, claim-window emphasis, or winning proof sections
- **THEN** those visual states MUST be representable through composable utility classes with only minimal global structural CSS support

##### Example: active and dealer states coexist on one player panel

- **GIVEN** a player panel that is both the dealer and the current acting seat
- **WHEN** the table view renders that panel
- **THEN** the panel MUST preserve both visible states without requiring a separate one-off page CSS variant for that exact combination
