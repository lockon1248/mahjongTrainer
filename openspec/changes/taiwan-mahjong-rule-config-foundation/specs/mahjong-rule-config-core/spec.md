## ADDED Requirements

### Requirement: Baseline rule config default

The core SHALL expose a baseline rule config that centralizes the default Taiwan 16-tile rules already confirmed by the authoritative baseline documents.

#### Scenario: Build the baseline default config

- **WHEN** the caller requests the default rule config without overrides
- **THEN** the core SHALL return a complete baseline config object instead of requiring scoring or round flow modules to fill their own fallback values

##### Example: baseline defaults exist in one place

- **GIVEN** a new caller that has not provided any custom table rule overrides
- **WHEN** it asks for the baseline rule config
- **THEN** the returned config MUST include claim priority order, flower replacement mode, self-draw payment mode, discard-win payment mode, and unresolved policies for rules that are not yet authoritative

### Requirement: Explicit unresolved rule markers

The rule config core SHALL distinguish unresolved table rules from explicitly configured enabled or disabled rules.

#### Scenario: Preserve unresolved status for not-yet-authoritative rules

- **WHEN** a rule is not settled by the baseline documents and the caller does not provide an explicit override
- **THEN** the rule config SHALL expose that rule as unresolved rather than silently treating it as false

##### Example: unresolved dealer continuation policy

- **GIVEN** dealer continuation after exhaustive draw is not authoritative in the baseline docs
- **WHEN** the baseline config is created
- **THEN** the dealer continuation policy MUST remain unresolved instead of being interpreted as enabled or disabled

### Requirement: Rule config override merge

The rule config core SHALL support applying explicit overrides on top of the baseline default config.

#### Scenario: Override a settled baseline rule

- **WHEN** the caller provides a partial override for a supported rule config key
- **THEN** the rule config core SHALL return a merged config where the override replaces the baseline value and unaffected keys remain intact

##### Example: override claim priority order

- **GIVEN** a baseline config whose claim priority order is `win > kan-exposed > pon > chi`
- **WHEN** the caller overrides the order with another valid priority list
- **THEN** the merged config MUST reflect the new priority list while preserving unrelated baseline defaults

#### Scenario: Reject unknown override keys

- **WHEN** the caller provides an override key that is not part of the supported rule config schema
- **THEN** the rule config core SHALL reject that override instead of silently ignoring it

##### Example: unknown rule key is invalid

- **GIVEN** an override payload containing a non-schema field
- **WHEN** the merge helper validates the override
- **THEN** it MUST fail the merge attempt with an explicit invalid-config outcome

### Requirement: Config slices for core modules

The rule config core SHALL provide stable config slices that can be consumed by round flow and scoring modules without relying on global mutable state.

#### Scenario: Read a round flow config slice

- **WHEN** round flow logic needs claim priority or flower replacement behavior
- **THEN** the rule config core SHALL provide a round-flow-relevant config slice derived from the same root config object

##### Example: round flow reads config slice

- **GIVEN** a root rule config with explicit round flow overrides
- **WHEN** the round flow core requests its config slice
- **THEN** the returned slice MUST contain the effective claim priority order, flower replacement mode, and exhaustive-draw policy fields needed by round flow

#### Scenario: Read a scoring config slice

- **WHEN** scoring logic needs payment responsibility or minimum tai gating behavior
- **THEN** the rule config core SHALL provide a scoring-relevant config slice derived from the same root config object

##### Example: scoring reads config slice

- **GIVEN** a root rule config with a configured minimum tai threshold and payment policy
- **WHEN** the scoring core requests its config slice
- **THEN** the returned slice MUST expose those effective scoring settings without requiring a second config source
