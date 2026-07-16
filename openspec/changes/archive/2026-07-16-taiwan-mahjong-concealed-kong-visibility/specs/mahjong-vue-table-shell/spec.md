## ADDED Requirements

### Requirement: Concealed kong privacy in table snapshots

The frontend table snapshot SHALL hide another seat's concealed kong tile identities during in-progress play, so the human viewer can see that a concealed kong exists without learning which tile was used.

#### Scenario: Human viewer sees hidden tiles for AI concealed kong

- **WHEN** an AI seat has a concealed kong and the round is still in progress
- **THEN** the table snapshot shown to the human viewer MUST render that meld as hidden tiles or placeholders instead of concrete tile labels

##### Example: south AI concealed kong is masked on the board

- **GIVEN** `south` has a concealed kong of `red-dragon` and the human seat is `east`
- **WHEN** the table view renders an in-progress round snapshot
- **THEN** the `south` meld area MUST indicate a concealed kong exists, but MUST NOT show `red-dragon`

#### Scenario: Owning human seat keeps access to its own concealed kong tiles

- **WHEN** the human seat itself forms a concealed kong
- **THEN** the human-facing snapshot MUST continue to show the real concealed kong tile identities for that seat

##### Example: east human concealed kong stays visible to east

- **GIVEN** `east` is the human seat and has a concealed kong of `5-dot`
- **WHEN** the table view renders the human player's meld area
- **THEN** the meld display MUST still show `5-dot` for `east`
