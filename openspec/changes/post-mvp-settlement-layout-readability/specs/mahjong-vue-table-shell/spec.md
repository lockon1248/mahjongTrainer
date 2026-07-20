## MODIFIED Requirements

### Requirement: Round result summary rendering

The table UI SHALL render a compact terminal result row only after the round has ended. A win row SHALL render the authoritative winner, discarder when present, and total tai. A draw row SHALL render the authoritative draw reason. The row MUST NOT render result type, ended status, or a separate scoring trigger.

#### Scenario: Only completed rounds render the result summary

- **WHEN** the round outcome is `in-progress`
- **THEN** the UI MUST NOT render a terminal result row or settlement dialog

##### Example: Draw result shows only required result information

- **GIVEN** a `draw` outcome with `drawReason = wall-exhausted`
- **WHEN** the table view renders the terminal result
- **THEN** the UI MUST show the draw reason, MUST NOT show result type or ended status, and MUST open the unified settlement dialog

### Requirement: 和牌摘要必須顯示正確台型與總台數

The table UI SHALL render `totalTai` from scoring core in the compact win result row and SHALL render structured `scoringItems` inside the unified round-settlement dialog instead of inline within the scaled table stage.

#### Scenario: Winning result opens scoring details

- **WHEN** a legal `discard-win` or self-draw result includes structured scoring items and `totalTai`
- **THEN** the result row MUST show `totalTai` and the UI MUST automatically open the unified dialog containing scoring items and chip allocation

##### Example: Discard win details need no secondary trigger

- **GIVEN** east wins on north's discard and scoring core provides non-empty scoring items
- **WHEN** the terminal result renders
- **THEN** scoring items and total tai MUST already be visible in `本局結算` without `查看台型`

## ADDED Requirements

### Requirement: Compact authoritative table status

The table UI SHALL render one compact status row containing local round, dealer, prevailing wind, phase, remaining wall, and victory condition. It MUST NOT render current operation, last claim, outcome, total discard count, or match stakes in that status area.

#### Scenario: Gameplay status uses the confirmed field set

- **WHEN** the table view renders an active or completed round
- **THEN** exactly the confirmed status concepts MUST remain above the table and the rejected concepts MUST be absent

### Requirement: Settlement readability across desktop and narrow screens

The game view SHALL keep the table stage at scale 1 when a desktop viewport has sufficient width and height. Wide-but-short and narrow viewports SHALL use compact vertical layout and proportional whole-stage fallback scaling when required to keep critical human-hand and action content visible. A teleported settlement dialog MUST NOT contribute to stage measurement. The page MUST remain free of page-level scrolling.

#### Scenario: Desktop settlement remains readable

- **WHEN** a completed win is rendered at a 2048 by 962 desktop viewport
- **THEN** the stage MUST remain unscaled, use the available game width without excessive side margins, and keep the page free of scrollbars

#### Scenario: Narrow viewport retains safe scaling

- **WHEN** the natural stage does not fit a narrow viewport
- **THEN** the game view MUST apply one proportional scale to the stage while keeping the settlement dialog outside that transform

#### Scenario: Wide but short viewport keeps the human hand visible

- **WHEN** an active round is rendered at a 1489 by 658 viewport
- **THEN** the complete human concealed-hand region and action row MUST remain inside the viewport, the page MUST remain free of page-level scrolling, and the layout MUST NOT rely on a width-only forced scale of 1

## ADDED Requirements

### Requirement: Match completion renders final settlement

The table shell SHALL render a full-screen final settlement from authoritative ended match state. It SHALL show the match winner and final chips for all four seats, SHALL hide the round-level next-round action, and SHALL provide `重新開始` to return to existing match setup.

#### Scenario: Bankruptcy completion replaces next round

- **WHEN** bankruptcy settlement changes match status to `ended`
- **THEN** the UI MUST show final settlement, MUST NOT show `下一局`, and MUST allow `重新開始`

### Requirement: Human concealed tiles use available readable space

The table shell SHALL render human concealed-tile controls with a computed font size of at least 16 pixels and an enlarged hit area while keeping the complete hand inside a 1489 by 658 viewport.

#### Scenario: Enlarged hand remains visible

- **WHEN** a human hand is rendered at 1489 by 658
- **THEN** every concealed-tile control MUST remain inside the viewport and its computed font size MUST be at least 16 pixels

### Requirement: Development hot updates preserve the game session store contract

The game-session Pinia setup store SHALL accept Vite hot module updates so that an already-created store instance receives newly defined actions without losing the current session state.

#### Scenario: Restart action is added during an active development session

- **GIVEN** the game page already owns a live `game-session` store instance
- **WHEN** Vite hot-replaces the store module with a definition containing `resetMatch`
- **THEN** the existing instance MUST expose `resetMatch` and the hot-updated `GameView` MUST NOT throw a missing-action runtime error

### Requirement: Every completed round renders authoritative chip allocation

The table shell SHALL automatically render one `本局結算` dialog 1,500 milliseconds after every completed win or draw. Before the delay elapses, the terminal table state SHALL remain visible without the settlement overlay. The dialog SHALL show each seat's signed round delta and post-settlement chips from the session store. It MUST NOT calculate payment amounts in the component and MUST NOT expose a separate `查看台型` action.

#### Scenario: Settlement waits before covering the terminal table

- **WHEN** a win or draw result becomes terminal
- **THEN** the settlement dialog MUST remain absent for the first 1,500 milliseconds and MUST become visible after that delay

#### Scenario: Zero-tai discard win still transfers the base stake

- **GIVEN** a discard win has `totalTai = 0`, base stake 30, winner south, and discarder west
- **WHEN** the store settles the round
- **THEN** the dialog MUST show south `+30`, west `-30`, east and north `±0`, together with all four post-settlement balances

#### Scenario: Draw shows balances without tai details

- **WHEN** a draw completes without chip transfer
- **THEN** the dialog MUST show the draw reason, MUST NOT show total tai or scoring items, and MUST show all four seats with `±0` and unchanged balances

#### Scenario: Settlement action follows match status

- **WHEN** the completed round leaves the match in progress
- **THEN** the dialog MUST offer `下一局`
- **WHEN** the completed round ends the match
- **THEN** the dialog MUST offer `重新開始` and MUST NOT offer `下一局`
