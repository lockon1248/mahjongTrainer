## ADDED Requirements

### Requirement: 和牌結果摘要 MUST render structured scoring items

The Vue table shell SHALL render winning-result scoring details from structured scoring items supplied by core-derived state, instead of relying on a local string-id mapping table.

#### Scenario: winning summary shows per-item tai breakdown

- **WHEN** the game table snapshot includes a winning result with structured `scoringItems`
- **THEN** the table shell MUST render each item's display label and tai value, along with the final `totalTai`

##### Example: rendered summary shows dealer and self-draw items

- **GIVEN** a result summary containing structured scoring items for `dealer-win` and `self-draw`
- **WHEN** the game table view renders the result summary
- **THEN** the winning panel MUST show both item labels with their tai values and the correct total

### Requirement: Vue result summary MUST reflect profile-driven scoring differences without local rule logic

The Vue table shell SHALL reflect profile-driven scoring differences only from the snapshot data it receives, and SHALL NOT re-implement scoring-profile decisions inside selectors or components.

#### Scenario: profile-specific summary is rendered from snapshot data

- **WHEN** two otherwise similar winning snapshots differ only because they were scored under different profiles
- **THEN** the rendered scoring breakdown MUST differ accordingly, while the component continues to use the snapshot data as-is

##### Example: same hand displays different flower scoring by profile

- **GIVEN** two winning result summaries for the same hand with different structured scoring items produced by different scoring profiles
- **WHEN** the table shell renders both snapshots
- **THEN** the visible scoring breakdown MUST follow the provided scoring items without any extra component-side rule branching
