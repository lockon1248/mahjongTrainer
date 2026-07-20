## MODIFIED Requirements

### Requirement: 中央桌面完整顯示四家捨牌池

The table UI SHALL render one shared central discard pool containing every currently visible unclaimed discard in authoritative chronological order. It MUST NOT render seat headings, per-seat discard counts, or seat markers on discard tiles. The pool SHALL use a fixed-height grid that fits up to 72 visible discards without internal scrolling or increasing the scaled stage height.

#### Scenario: Mixed-seat discards render as one chronological sequence

- **GIVEN** the authoritative discard sequence is [`1-character`, `5-dot`, `red-dragon`]
- **WHEN** the table renders the central discard pool
- **THEN** it MUST show those three tiles from left to right in that order without seat labels or separate seat pools

#### Scenario: Late-round discard accumulation does not shrink the table

- **GIVEN** a reachable round at a fixed desktop viewport progresses from an empty discard sequence to 72 visible tiles
- **WHEN** the fixed central grid renders both states
- **THEN** the stage scale MUST remain unchanged and the pool MUST NOT expose an internal scrollbar

### Requirement: 副露區與捨牌池必須反映裁決後牌局狀態

When claim resolution accepts `chi`, `pon`, or `kan-exposed`, the table SHALL render the claimant's new meld and MUST NOT retain the claimed triggering tile in the shared chronological discard pool.

#### Scenario: Accepted pon removes the final shared discard

- **GIVEN** the latest shared discard is `west-wind`
- **WHEN** east's legal `pon` is accepted
- **THEN** east's meld area MUST contain the `west-wind` pon and the shared discard pool MUST NOT retain that claimed tile

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

### Requirement: Shared discard pool preserves latest-action highlighting

The table UI SHALL treat the final tile in the authoritative shared discard sequence as the only latest discard. During a human claim window, that tile SHALL receive the existing legal-action highlight semantics and all earlier tiles MUST remain unhighlighted.

#### Scenario: Latest discard carries legal claim highlights

- **WHEN** the human has legal `chi`, `pon`, `kan-exposed`, or `win` candidates for the triggering discard
- **THEN** only the final shared discard tile MUST render the corresponding existing white, red, or yellow highlight combination

#### Scenario: Pon-only latest discard uses a red background

- **GIVEN** the human claim window offers `pon` but does not offer `win`
- **WHEN** the shared discard pool renders the triggering final tile
- **THEN** that tile MUST use a red background instead of the generic yellow latest-discard background, and every earlier discard MUST remain neutral

### Requirement: Human meld remains visible after a claim

The desktop table SHALL keep a newly accepted human meld and the remaining concealed hand completely visible inside the human player panel. Fixed-height desktop track allocation MUST NOT clip or overlap the meld row.

#### Scenario: Accepted pon does not clip the new meld

- **WHEN** the human accepts a legal `pon` at a 2048 by 962 desktop viewport
- **THEN** the complete pon meld and concealed hand MUST remain inside the human panel and viewport without page scrolling

### Requirement: Compact authoritative table status

The table UI SHALL render one compact status row containing local round, dealer, prevailing wind, phase, remaining wall, and victory condition. It MUST NOT render current operation, last claim, outcome, total discard count, or match stakes in that status area.

#### Scenario: Gameplay status uses the confirmed field set

- **WHEN** the table view renders an active or completed round
- **THEN** exactly the confirmed status concepts MUST remain above the table and the rejected concepts MUST be absent

### Requirement: Settlement readability across desktop and narrow screens

The game view SHALL keep the table stage at scale 1 when a desktop viewport has sufficient width and height. At those desktop viewports, the table SHALL stretch through the remaining stage height so its bottom edge aligns with the available stage content bottom instead of leaving an unused block below the human player panel. Wide-but-short and narrow viewports SHALL use compact vertical layout and proportional whole-stage fallback scaling when required to keep critical human-hand and action content visible. A teleported settlement dialog MUST NOT contribute to stage measurement. The page MUST remain free of page-level scrolling.

#### Scenario: Desktop settlement remains readable

- **WHEN** a completed win is rendered at a 2048 by 962 desktop viewport
- **THEN** the stage MUST remain unscaled, use the available game width without excessive side margins, and keep the page free of scrollbars

#### Scenario: Desktop table consumes lower whitespace

- **WHEN** an active round is rendered at a 2048 by 962 desktop viewport
- **THEN** the table bottom MUST align with the available stage content bottom while the stage remains at scale 1 and the page remains free of scrollbars

#### Scenario: Narrow viewport retains safe scaling

- **WHEN** the natural stage does not fit a narrow viewport
- **THEN** the game view MUST apply one proportional scale to the stage while keeping the settlement dialog outside that transform

#### Scenario: Wide but short viewport keeps the human hand visible

- **WHEN** an active round is rendered at a 1489 by 658 viewport
- **THEN** the complete human concealed-hand region and action row MUST remain inside the viewport, the page MUST remain free of page-level scrolling, and the layout MUST NOT rely on a width-only forced scale of 1

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

The table shell SHALL automatically render one `本局結算` dialog 1,500 milliseconds after every completed win or draw. Before the delay elapses, the terminal table state SHALL remain visible without the settlement overlay. The dialog SHALL show each seat's signed round delta and post-settlement chips from the session store. A self-draw SHALL show `{winner} 自摸`; a discard win SHALL show `{winner} 和牌｜{discarder} 放槍`; a draw SHALL show only its authoritative draw reason and MUST NOT show a win/loss outcome line. At a 1489 by 658 desktop viewport, the complete dialog content SHALL be visible at once without internal or page-level scrolling. The dialog MUST NOT calculate payment amounts in the component and MUST NOT expose a separate `查看台型` action.

#### Scenario: Settlement waits before covering the terminal table

- **WHEN** a win or draw result becomes terminal
- **THEN** the settlement dialog MUST remain absent for the first 1,500 milliseconds and MUST become visible after that delay

#### Scenario: Zero-tai discard win still transfers the base stake

- **GIVEN** a discard win has `totalTai = 0`, base stake 30, winner south, and discarder west
- **WHEN** the store settles the round
- **THEN** the dialog MUST show `南家 和牌｜西家 放槍`, south `+30`, west `-30`, east and north `±0`, together with all four post-settlement balances

#### Scenario: Self-draw identifies the winner without a discarder

- **GIVEN** a self-draw result whose winner is north and whose discarder is absent
- **WHEN** the settlement dialog becomes visible
- **THEN** the dialog MUST show `北家 自摸` and MUST NOT show `放槍`

#### Scenario: Draw shows balances without tai details

- **WHEN** a draw completes without chip transfer
- **THEN** the dialog MUST show the draw reason, MUST NOT show a win/loss outcome line, MUST NOT show total tai or scoring items, and MUST show all four seats with `±0` and unchanged balances

#### Scenario: Short desktop shows the complete dialog without scrolling

- **GIVEN** a completed win with outcome text, tai details, four chip settlement rows, and a next or restart action
- **WHEN** the settlement dialog is rendered in a 1489 by 658 desktop viewport
- **THEN** every dialog section and action MUST be inside the viewport, the dialog content MUST NOT have vertical overflow, and the page MUST NOT have a scrollbar

#### Scenario: Settlement action follows match status

- **WHEN** the completed round leaves the match in progress
- **THEN** the dialog MUST offer `下一局`
- **WHEN** the completed round ends the match
- **THEN** the dialog MUST offer `重新開始` and MUST NOT offer `下一局`

## RENAMED Requirements

- FROM: `中央桌面完整顯示四家捨牌池`
- TO: `中央桌面依時間序顯示共同棄牌池`
- FROM: `副露區與捨牌池必須反映裁決後牌局狀態`
- TO: `副露區與共同棄牌池必須反映裁決後牌局狀態`
