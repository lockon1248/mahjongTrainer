## ADDED Requirements

### Requirement: Concealed kong privacy in AI runtime context

AI runtime integrations SHALL mask another seat's concealed kong tile identities before constructing non-owning AI decision context, so AI agents cannot infer hidden tile values from runtime meld data.

#### Scenario: Non-owning AI does not receive another seat's concealed kong tiles

- **WHEN** the runtime builds an AI decision context for seat `south`, and seat `west` already has a `kan-concealed` meld
- **THEN** the context for `south` MUST preserve that `west` has a concealed kong, but MUST NOT expose the actual tile identities inside that meld

##### Example: west concealed kong stays hidden from south AI

- **GIVEN** `west` has a concealed kong of `7-bamboo`
- **WHEN** the runtime builds `south` AI context for discard or claim evaluation
- **THEN** `south` MUST NOT receive `7-bamboo` meld tiles for `west`
