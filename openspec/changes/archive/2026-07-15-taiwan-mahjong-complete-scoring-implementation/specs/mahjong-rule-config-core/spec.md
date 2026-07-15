## ADDED Requirements

### Requirement: rule config MUST expose scoringProfile as a first-class setting

The rule-config runtime SHALL expose `scoringProfile` as a first-class scoring setting, so callers can select `classic-taiwan` or `flower-wind-bonus` without patching pattern logic directly.

#### Scenario: scoring config slice preserves active profile

- **WHEN** a caller requests the scoring slice from a root rule config
- **THEN** the returned scoring config MUST include the active `scoringProfile` in a machine-stable form

##### Example: scoring slice includes flower-wind-bonus profile

- **GIVEN** a root rule config configured with `flower-wind-bonus`
- **WHEN** the scoring slice is requested
- **THEN** the slice MUST expose `flower-wind-bonus` as the active profile

### Requirement: rule config MUST provide profile-aware scoring catalog inputs

The rule-config runtime SHALL provide the scoring layer with profile-aware catalog inputs, including configurable pattern enablement, minimum tai, and optional max-tai limits, from one authoritative source.

#### Scenario: scoring slice includes profile-specific scoring controls

- **WHEN** the scoring layer reads the scoring config slice
- **THEN** it MUST receive the active profile, minimum tai threshold, and any configured max-tai or pattern settings needed to evaluate the catalog

##### Example: classic profile with minimumTai and maxTai

- **GIVEN** a root rule config configured with `classic-taiwan`, `minimumTai = 0`, and a configured max-tai limit
- **WHEN** the scoring slice is requested
- **THEN** the scoring slice MUST expose all three values without needing fallback logic from the scoring layer
