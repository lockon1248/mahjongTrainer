# mahjong-frontend-style-foundation Specification

## Purpose

TBD - created by archiving change 'taiwan-mahjong-unocss-and-shared-enums'. Update Purpose after archive.

## Requirements

### Requirement: Frontend utility styling pipeline

The frontend SHALL provide a utility-first styling pipeline backed by UnoCSS so Vue application views can express most visual styling through composable utility classes instead of page-local monolithic CSS alone.

#### Scenario: Vite build resolves UnoCSS utilities from Vue views

- **WHEN** the frontend build processes Vue single-file components that contain UnoCSS utility classes
- **THEN** the generated application CSS MUST include those utilities without requiring each view to define duplicate page-local style rules

##### Example: game table utility classes are emitted during build

- **GIVEN** the game table view uses utility classes for panel spacing, typography, and highlight states
- **WHEN** `npm run build` compiles the frontend
- **THEN** the build output MUST contain the required utility styles and MUST NOT fail because of missing UnoCSS integration


<!-- @trace
source: taiwan-mahjong-unocss-and-shared-enums
updated: 2026-07-16
code:
  - src/views/game/e2eBridge.ts
  - package.json
  - src/views/game/components/GameTableView.vue
  - vite.config.ts
  - src/ui/constants/display.ts
  - src/views/game/GameView.vue
  - src/main.ts
  - src/ui/constants/tiles.ts
  - src/views/game/constants.ts
  - uno.config.ts
  - src/views/game/types.ts
  - src/stores/gameSession.ts
  - test-results/.last-run.json
  - src/views/game/selectors.ts
tests:
  - tests/ui/round-result-sync.test.ts
  - tests/ui/interactive-turn-loop.test.ts
  - tests/ui/game-table-layout.test.ts
  - tests/ui/game-session.store.test.ts
  - tests/ui/game-table-view.test.ts
  - e2e/game-table.smoke.spec.ts
-->

---
### Requirement: Shared presentation constants authority

The frontend SHALL define fixed presentation values through shared constant or enum modules so views, selectors, and tests reuse one authoritative mapping for tile labels, seat labels, phase labels, and result labels.

#### Scenario: Shared label modules drive multiple frontend consumers

- **WHEN** a view, selector, or UI test needs a fixed presentation label for a tile, seat, phase, or result state
- **THEN** it MUST import the shared constant or enum module instead of redeclaring the same mapping locally

##### Example: tile and seat labels come from one source

- **GIVEN** the frontend needs to render `east`, `red`, and `7 bamboo`
- **WHEN** the game table view and its related tests resolve those labels
- **THEN** both consumers MUST reuse the same shared exports for `東家`, `紅中`, and `七條`

<!-- @trace
source: taiwan-mahjong-unocss-and-shared-enums
updated: 2026-07-16
code:
  - src/views/game/e2eBridge.ts
  - package.json
  - src/views/game/components/GameTableView.vue
  - vite.config.ts
  - src/ui/constants/display.ts
  - src/views/game/GameView.vue
  - src/main.ts
  - src/ui/constants/tiles.ts
  - src/views/game/constants.ts
  - uno.config.ts
  - src/views/game/types.ts
  - src/stores/gameSession.ts
  - test-results/.last-run.json
  - src/views/game/selectors.ts
tests:
  - tests/ui/round-result-sync.test.ts
  - tests/ui/interactive-turn-loop.test.ts
  - tests/ui/game-table-layout.test.ts
  - tests/ui/game-session.store.test.ts
  - tests/ui/game-table-view.test.ts
  - e2e/game-table.smoke.spec.ts
-->