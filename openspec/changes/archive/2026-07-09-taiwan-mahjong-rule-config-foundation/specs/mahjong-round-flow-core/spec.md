## MODIFIED Requirements

### Requirement: Claim window resolution

The round flow core SHALL resolve competing claim candidates through a single pending claim window and SHALL derive the effective claim priority order from rule config instead of assuming a fixed global constant.

#### Scenario: Prefer a winning claim over lower-priority claims

- **WHEN** multiple seats declare claims against the same discard and the effective rule config places winning claims above other valid claims
- **THEN** the round flow core SHALL resolve the claim window as a winning claim instead of exposed kan, pon, or chi

##### Example: CLAIM-PRIORITY-001 win beats pon

- **GIVEN** one discard that allows north to win and south to pon
- **WHEN** both claims are submitted into the same pending claim window under a rule config whose priority order is `win > kan-exposed > pon > chi`
- **THEN** the resolved claim MUST be north's winning claim

#### Scenario: Prefer exposed kan over pon and chi when no win exists

- **WHEN** the pending claim window contains no winning claim and the effective rule config places exposed kan above lower-priority claims
- **THEN** the round flow core SHALL resolve the claim window as the exposed kan

##### Example: exposed kan beats chi

- **GIVEN** one discard that allows west to form an exposed kan and south to chi
- **WHEN** both claims are submitted and no valid winning claim exists under a rule config whose priority order is `win > kan-exposed > pon > chi`
- **THEN** the resolved claim MUST be west's exposed kan claim

#### Scenario: Advance the round when every eligible claimant passes

- **WHEN** the pending claim window closes without any accepted claim
- **THEN** the round flow core SHALL resolve the discard as pass and continue the round with the next seat's normal draw transition

##### Example: all claims pass

- **GIVEN** a discard with no accepted chi, pon, kan, or win claim
- **WHEN** the claim window closes
- **THEN** the resolution MUST be pass and the next seat in order MUST receive the next normal draw opportunity

### Requirement: Exhaustive draw outcome

The round flow core SHALL produce an explicit exhaustive draw outcome when the wall can no longer support another normal draw and no player has already won, and SHALL represent unresolved post-draw branches through rule config policy instead of inventing final business outcomes.

#### Scenario: End the round when the wall is exhausted

- **WHEN** the round reaches a state where no further normal draw can be performed and no winning result has been accepted
- **THEN** the round flow core SHALL return an exhaustive draw outcome

##### Example: DRAW-DEALER-001

- **GIVEN** a round state with no remaining legal normal draw from the wall and no accepted winning claim
- **WHEN** the round flow core evaluates whether play can continue
- **THEN** the result MUST be an exhaustive draw outcome

#### Scenario: Do not invent unresolved post-draw rules

- **WHEN** the round ends as an exhaustive draw and the effective rule config leaves dealer continuation, ready-hand penalties, or listening checks unresolved
- **THEN** the round flow core SHALL NOT assign those outcomes as settled business logic

##### Example: unresolved dealer continuation stays unset

- **GIVEN** an exhaustive draw outcome under a rule config whose post-draw policies remain unresolved
- **WHEN** the result is returned to the caller
- **THEN** the outcome MUST identify the round as drawn and MUST leave dealer continuation or ready-hand settlement unresolved
