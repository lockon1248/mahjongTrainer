# mahjong-vue-table-shell Specification

## Purpose

TBD - created by archiving change 'taiwan-mahjong-vue-table-shell'. Update Purpose after archive.

## Requirements

### Requirement: Vue app shell bootstrap

The frontend SHALL provide a bootable Vue application shell for the mahjong trainer.

#### Scenario: Application boots successfully

- **WHEN** the browser loads the app entrypoint
- **THEN** the Vue application shell SHALL mount successfully without requiring backend services

##### Example: local shell mounts

- **GIVEN** a local browser session with the built frontend assets
- **WHEN** the application entrypoint is loaded
- **THEN** the root application shell MUST render without a blank-screen failure


<!-- @trace
source: taiwan-mahjong-vue-table-shell
updated: 2026-07-09
code:
  - src/views/home/HomeView.vue
  - src/stores/gameSession.ts
  - src/core/config/types.ts
  - src/views/game/types.ts
  - src/main.ts
  - src/core/rules/roundFlow.ts
  - src/app.ts
  - src/env.d.ts
  - src/styles/main.css
  - src/views/game/GameView.vue
  - vitest.config.ts
  - src/core/wall.ts
  - src/views/game/components/GameTableView.vue
  - src/core/scoring/validation.ts
  - tsconfig.json
  - src/core/scoring/types.ts
  - src/core/types/result.ts
  - src/views/game/selectors.ts
  - package.json
  - src/core/config/index.ts
  - src/core/ai/context.ts
  - src/App.vue
  - src/core/index.ts
  - vite.config.ts
  - src/core/ai/index.ts
  - src/core/scoring/settlement.ts
  - src/core/rules/types.ts
  - src/core/ai/types.ts
  - src/core/ai/decision.ts
  - index.html
  - src/router/index.ts
tests:
  - tests/ui/app-shell.test.ts
  - tests/core/scoring-settlement.test.ts
  - tests/docs/scaffold-boundary.test.ts
  - tests/core/rule-config-core.test.ts
  - tests/core/scoring-exports.test.ts
  - tests/smoke/vue-workspace.test.ts
  - tests/ui/game-session.store.test.ts
  - tests/core/round-flow-claims.test.ts
  - tests/ui/game-table-view.test.ts
  - tests/core/ai-decision-core.test.ts
  - tests/core/round-flow-outcome.test.ts
-->

---
### Requirement: Router with home and game entrypoints

The frontend SHALL provide at least a home route and a game route.

#### Scenario: Navigate to the game route

- **WHEN** the user navigates to the game entrypoint
- **THEN** the router SHALL render the game view container instead of a missing-route fallback

##### Example: game route renders

- **GIVEN** the application router is active
- **WHEN** the user opens the game route
- **THEN** the game view container MUST be mounted


<!-- @trace
source: taiwan-mahjong-vue-table-shell
updated: 2026-07-09
code:
  - src/views/home/HomeView.vue
  - src/stores/gameSession.ts
  - src/core/config/types.ts
  - src/views/game/types.ts
  - src/main.ts
  - src/core/rules/roundFlow.ts
  - src/app.ts
  - src/env.d.ts
  - src/styles/main.css
  - src/views/game/GameView.vue
  - vitest.config.ts
  - src/core/wall.ts
  - src/views/game/components/GameTableView.vue
  - src/core/scoring/validation.ts
  - tsconfig.json
  - src/core/scoring/types.ts
  - src/core/types/result.ts
  - src/views/game/selectors.ts
  - package.json
  - src/core/config/index.ts
  - src/core/ai/context.ts
  - src/App.vue
  - src/core/index.ts
  - vite.config.ts
  - src/core/ai/index.ts
  - src/core/scoring/settlement.ts
  - src/core/rules/types.ts
  - src/core/ai/types.ts
  - src/core/ai/decision.ts
  - index.html
  - src/router/index.ts
tests:
  - tests/ui/app-shell.test.ts
  - tests/core/scoring-settlement.test.ts
  - tests/docs/scaffold-boundary.test.ts
  - tests/core/rule-config-core.test.ts
  - tests/core/scoring-exports.test.ts
  - tests/smoke/vue-workspace.test.ts
  - tests/ui/game-session.store.test.ts
  - tests/core/round-flow-claims.test.ts
  - tests/ui/game-table-view.test.ts
  - tests/core/ai-decision-core.test.ts
  - tests/core/round-flow-outcome.test.ts
-->

---
### Requirement: Read-only game table shell

The frontend SHALL render a read-only mahjong table shell that maps round state from core-backed store data.

#### Scenario: Render a table snapshot

- **WHEN** the game store holds an initialized round snapshot
- **THEN** the game table view SHALL render visible player areas, table summary, current turn information, and round outcome summary from that snapshot

##### Example: initialized round appears on screen

- **GIVEN** a store state containing an initialized round snapshot
- **WHEN** the game table view renders
- **THEN** the view MUST show all seats and current round information without re-implementing rule logic in the component


<!-- @trace
source: taiwan-mahjong-vue-table-shell
updated: 2026-07-09
code:
  - src/views/home/HomeView.vue
  - src/stores/gameSession.ts
  - src/core/config/types.ts
  - src/views/game/types.ts
  - src/main.ts
  - src/core/rules/roundFlow.ts
  - src/app.ts
  - src/env.d.ts
  - src/styles/main.css
  - src/views/game/GameView.vue
  - vitest.config.ts
  - src/core/wall.ts
  - src/views/game/components/GameTableView.vue
  - src/core/scoring/validation.ts
  - tsconfig.json
  - src/core/scoring/types.ts
  - src/core/types/result.ts
  - src/views/game/selectors.ts
  - package.json
  - src/core/config/index.ts
  - src/core/ai/context.ts
  - src/App.vue
  - src/core/index.ts
  - vite.config.ts
  - src/core/ai/index.ts
  - src/core/scoring/settlement.ts
  - src/core/rules/types.ts
  - src/core/ai/types.ts
  - src/core/ai/decision.ts
  - index.html
  - src/router/index.ts
tests:
  - tests/ui/app-shell.test.ts
  - tests/core/scoring-settlement.test.ts
  - tests/docs/scaffold-boundary.test.ts
  - tests/core/rule-config-core.test.ts
  - tests/core/scoring-exports.test.ts
  - tests/smoke/vue-workspace.test.ts
  - tests/ui/game-session.store.test.ts
  - tests/core/round-flow-claims.test.ts
  - tests/ui/game-table-view.test.ts
  - tests/core/ai-decision-core.test.ts
  - tests/core/round-flow-outcome.test.ts
-->

---
### Requirement: Pinia session skeleton

The frontend SHALL provide a Pinia-backed session store that initializes and exposes the current round snapshot through core APIs.

#### Scenario: Start a new local round from the store

- **WHEN** the store initializes a new round
- **THEN** it SHALL call core APIs to create the round snapshot and expose the resulting state to the view layer

##### Example: store exposes initialized snapshot

- **GIVEN** the store starts from an empty session state
- **WHEN** a new local round is requested
- **THEN** the store MUST expose an initialized round snapshot for the game view

<!-- @trace
source: taiwan-mahjong-vue-table-shell
updated: 2026-07-09
code:
  - src/views/home/HomeView.vue
  - src/stores/gameSession.ts
  - src/core/config/types.ts
  - src/views/game/types.ts
  - src/main.ts
  - src/core/rules/roundFlow.ts
  - src/app.ts
  - src/env.d.ts
  - src/styles/main.css
  - src/views/game/GameView.vue
  - vitest.config.ts
  - src/core/wall.ts
  - src/views/game/components/GameTableView.vue
  - src/core/scoring/validation.ts
  - tsconfig.json
  - src/core/scoring/types.ts
  - src/core/types/result.ts
  - src/views/game/selectors.ts
  - package.json
  - src/core/config/index.ts
  - src/core/ai/context.ts
  - src/App.vue
  - src/core/index.ts
  - vite.config.ts
  - src/core/ai/index.ts
  - src/core/scoring/settlement.ts
  - src/core/rules/types.ts
  - src/core/ai/types.ts
  - src/core/ai/decision.ts
  - index.html
  - src/router/index.ts
tests:
  - tests/ui/app-shell.test.ts
  - tests/core/scoring-settlement.test.ts
  - tests/docs/scaffold-boundary.test.ts
  - tests/core/rule-config-core.test.ts
  - tests/core/scoring-exports.test.ts
  - tests/smoke/vue-workspace.test.ts
  - tests/ui/game-session.store.test.ts
  - tests/core/round-flow-claims.test.ts
  - tests/ui/game-table-view.test.ts
  - tests/core/ai-decision-core.test.ts
  - tests/core/round-flow-outcome.test.ts
-->