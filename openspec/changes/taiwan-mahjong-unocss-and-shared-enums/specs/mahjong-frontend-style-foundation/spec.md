## ADDED Requirements

### Requirement: Frontend utility styling pipeline

The frontend SHALL provide a utility-first styling pipeline backed by UnoCSS so Vue application views can express most visual styling through composable utility classes instead of page-local monolithic CSS alone.

#### Scenario: Vite build resolves UnoCSS utilities from Vue views

- **WHEN** the frontend build processes Vue single-file components that contain UnoCSS utility classes
- **THEN** the generated application CSS MUST include those utilities without requiring each view to define duplicate page-local style rules

##### Example: game table utility classes are emitted during build

- **GIVEN** the game table view uses utility classes for panel spacing, typography, and highlight states
- **WHEN** `npm run build` compiles the frontend
- **THEN** the build output MUST contain the required utility styles and MUST NOT fail because of missing UnoCSS integration

### Requirement: Shared presentation constants authority

The frontend SHALL define fixed presentation values through shared constant or enum modules so views, selectors, and tests reuse one authoritative mapping for tile labels, seat labels, phase labels, and result labels.

#### Scenario: Shared label modules drive multiple frontend consumers

- **WHEN** a view, selector, or UI test needs a fixed presentation label for a tile, seat, phase, or result state
- **THEN** it MUST import the shared constant or enum module instead of redeclaring the same mapping locally

##### Example: tile and seat labels come from one source

- **GIVEN** the frontend needs to render `east`, `red`, and `7 bamboo`
- **WHEN** the game table view and its related tests resolve those labels
- **THEN** both consumers MUST reuse the same shared exports for `東家`, `紅中`, and `七條`
