## ADDED Requirements

### Requirement: Route-level application delivery

The application SHALL load route views through route-level dynamic imports so the home route does not require the game feature chunk before navigation to `/game`.

#### Scenario: Home route loads without the game route chunk

- **WHEN** Vite builds the production application
- **THEN** the output MUST contain separate JavaScript assets for the application entry and lazily loaded route views
- **THEN** visiting `/` MUST render the existing home view

#### Scenario: Game route loads on navigation

- **WHEN** a user navigates to `/game`
- **THEN** Vue Router MUST load and render the existing game view without changing its route path or gameplay behavior

### Requirement: Development harness exclusion from production

The application SHALL load the Mahjong E2E bridge only in development and SHALL exclude E2E seed fixtures from production JavaScript assets.

#### Scenario: Development E2E bridge remains available

- **WHEN** Playwright opens `/game?e2e=1` through the development server
- **THEN** `window.__MAHJONG_E2E__` MUST expose the existing bridge methods after the test waits for bridge readiness

#### Scenario: Production assets exclude bridge seeds

- **WHEN** Vite builds with production environment constants
- **THEN** no emitted JavaScript asset MUST contain `seedPonClaimScenario` or `seedExhaustedSharedDiscardScenario`

### Requirement: Platform-managed transport compression

The project SHALL rely on Vercel CDN transport compression and SHALL NOT add a Vite plugin that emits redundant gzip or Brotli build artifacts.

#### Scenario: Production build completes without precompression artifacts

- **WHEN** the project executes its production build
- **THEN** the build MUST emit normal hashed JavaScript and CSS assets without `.gz` or `.br` siblings
