## ADDED Requirements

### Requirement: Compiler-checked browser test bridge

The repository SHALL define the Mahjong E2E browser bridge through one exported TypeScript contract, SHALL expose the optional runtime bridge on the global Window type, and SHALL include Playwright sources in the repository TypeScript project.

#### Scenario: E2E test accesses a seeded bridge method

- **WHEN** a Playwright callback accesses `window.__MAHJONG_E2E__` after runtime availability has been checked
- **THEN** TypeScript MUST resolve every seed method from the shared bridge contract without a required intersection assertion or `ts(2352)` diagnostic

#### Scenario: Bridge contract drifts

- **WHEN** a seed method is added to or removed from the runtime bridge implementation
- **THEN** the global Window augmentation and Playwright use sites MUST be checked against the same exported contract by `npm run typecheck`

#### Scenario: Browser timer state is checked with Node ambient types present

- **WHEN** a Vue SFC stores the result of `window.setTimeout`
- **THEN** the timer state MUST use the browser's numeric handle type and MUST NOT derive a Node `Timeout` type from ambient overloads
