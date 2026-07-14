## ADDED Requirements

### Requirement: Seat-relative table layout

The game table SHALL render the human player at the bottom of the table, with the other three seats arranged around the center according to their seat-relative positions.

#### Scenario: Human player is anchored at the bottom

- **WHEN** the game table renders an initialized round
- **THEN** the human player seat MUST appear in the bottom player area, and the other three seats MUST appear in the remaining surrounding areas of the table

##### Example: East human seat remains at the bottom

- **GIVEN** the human-controlled seat is `east`
- **WHEN** the table renders the current round snapshot
- **THEN** the `east` player appears in the bottom area, `north` and `south` appear on side areas, and `west` appears on the opposite side of the table

### Requirement: Central discard pools are visible

The game table SHALL show the discard pools for all four seats in the central table area instead of limiting the view to discard counts only.

#### Scenario: All four discard pools are rendered in the center

- **WHEN** the round snapshot contains discarded tiles for one or more seats
- **THEN** the table MUST render each seat's discard tiles in the central table area with seat ownership preserved

##### Example: Mixed discard counts remain readable

| Seat | Discard tiles |
| ---- | ------------- |
| east | `1-character`, `2-character` |
| south | `5-dot` |
| west | none |
| north | `red-dragon`, `east-wind`, `plum` |

- **WHEN** the table renders this snapshot
- **THEN** the center area shows four discard pools, including an empty pool for `west`, without collapsing the view into counts only

### Requirement: Human concealed hand follows Taiwan tile ordering

The game table SHALL display the human player's concealed hand using the ordering `characters -> dots -> bamboo -> winds -> dragons -> flowers`.

#### Scenario: Human concealed hand is displayed in Taiwan tile order

- **WHEN** the human player hand contains a mix of suited tiles, honor tiles, and flower tiles
- **THEN** the displayed concealed hand MUST be ordered by `characters`, then `dots`, then `bamboo`, then `winds`, then `dragons`, and finally `flowers`

##### Example: Mixed hand is grouped before rendering

- **GIVEN** a human concealed hand containing `7-bamboo`, `east-wind`, `3-character`, `red-dragon`, `2-dot`, and `orchid`
- **WHEN** the table renders the hand
- **THEN** the displayed order is `3-character`, `2-dot`, `7-bamboo`, `east-wind`, `red-dragon`, `orchid`
