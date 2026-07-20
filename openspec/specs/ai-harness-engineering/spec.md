# ai-harness-engineering Specification

## Purpose

TBD - created by archiving change 'post-mvp-harness-engineering-hardening'. Update Purpose after archive.

## Requirements

### Requirement: Repository Node runtime gate

The repository SHALL derive its required Node major version from `.nvmrc`, SHALL declare the same major in package metadata, and SHALL run a fail-fast runtime preflight before every supported package entry.

#### Scenario: Wrong Node major stops package commands before tool startup

- **WHEN** an operator runs `dev`, `preview`, `build`, `test`, `test:watch`, `typecheck`, `test:e2e`, or `test:e2e:headed` under a Node major different from the value in `.nvmrc`
- **THEN** the runtime preflight MUST exit with code 1 before Vite, Vitest, TypeScript, or Playwright starts
- **THEN** the error MUST name the required major, the actual runtime version, and the `nvm use` recovery command

##### Example: Node 18 is rejected by a Node 22 repository

- **GIVEN** `.nvmrc` contains `22` and the actual runtime is `v18.20.8`
- **WHEN** the operator runs `npm test`
- **THEN** the command MUST stop with `Node 22 is required by .nvmrc; current runtime is v18.20.8. Run "nvm use".` and exit code 1

#### Scenario: Required Node major permits package commands

- **WHEN** an operator runs a supported package entry under Node major 22
- **THEN** the runtime preflight MUST exit with code 0 and the requested underlying command MUST start

#### Scenario: Dependency installation enforces the declared engine

- **WHEN** an operator installs dependencies under a Node major that does not satisfy `package.json.engines.node`
- **THEN** npm engine strict mode MUST reject the installation instead of continuing with a warning


<!-- @trace
source: post-mvp-harness-engineering-hardening
updated: 2026-07-20
code:
  - src/core/rules/roundFlow.ts
  - .npmrc
  - .superpowers/brainstorm/51439-1784519701/content/settlement-layout-options.html
  - AGENTS.md
  - src/core/testing/roundScenario.ts
  - src/stores/gameSession.ts
  - src/views/game/types.ts
  - src/core/config/index.ts
  - package.json
  - src/views/game/e2eBridge.ts
  - src/views/game/components/GameTableView.vue
  - .superpowers/brainstorm/51439-1784519701/state/server.pid
  - scripts/check-node-version.mjs
  - src/core/scoring/settlement.ts
  - src/views/game/selectors.ts
  - src/core/index.ts
  - src/core/scoring/types.ts
  - .superpowers/brainstorm/51439-1784519701/state/events
  - src/core/scoring/patterns.ts
  - src/core/scoring/catalog.ts
  - src/core/types/result.ts
  - scripts/node-version-policy.mjs
  - src/core/types/table.ts
  - scripts/node-version-policy.d.mts
  - src/core/scoring/validation.ts
  - .superpowers/brainstorm/51439-1784519701/state/server-stopped
  - src/views/game/GameView.vue
tests:
  - tests/core/rule-config-core.test.ts
  - tests/smoke/node-version-policy.test.ts
  - tests/core/domain-model.test.ts
  - tests/ui/table-layout-verification-flow.test.ts
  - tests/ui/game-table-view.test.ts
  - tests/core/dealer-progression.test.ts
  - tests/core/round-flow-outcome.test.ts
  - tests/ui/round-result-sync.test.ts
  - tests/ui/game-table-layout.test.ts
  - tests/ui/human-self-turn-actions.test.ts
  - tests/core/round-scenario-harness.test.ts
  - tests/ui/interactive-turn-loop.test.ts
  - tests/ui/game-session-hmr.test.ts
  - tests/core/round-flow-claims.test.ts
  - tests/core/scoring-settlement.test.ts
  - tests/ui/human-claim-window.test.ts
  - tests/ui/game-session.store.test.ts
  - e2e/game-table.smoke.spec.ts
  - tests/docs/agents-workflow-policy.test.ts
  - tests/ui/mainline-playable-flow.test.ts
  - tests/ui/next-round-flow.test.ts
-->

---
### Requirement: Reachable round scenario harness

The repository SHALL provide shared round scenario builders that create fixture states through production round transitions and SHALL reject states that cannot represent a reachable physical game state.

#### Scenario: Claim window originates from a production discard

- **WHEN** a test requests a reachable claim-window scenario
- **THEN** the harness MUST create a baseline round, perform a legal discard through `discardTile`, and return a pending trigger that matches the discarding seat's last discard

#### Scenario: Exhaustive draw originates from an empty-wall transition

- **WHEN** a test requests a reachable exhaustive-draw scenario
- **THEN** the harness MUST advance a production round transition with an empty wall into `phase = ended` and `outcome.status = draw`
- **THEN** the returned draw state MUST retain an empty wall

#### Scenario: Win scenario originates from legal scoring and action resolution

- **WHEN** a test requests a reachable discard-win or self-draw-win scenario
- **THEN** the harness MUST resolve the win through the production claim or self-turn action path
- **THEN** the winner MUST have a legal effective 17-tile hand and a production scoring result

#### Scenario: Invariant checker rejects contradictory fixtures

- **WHEN** a round fixture has a phase/outcome mismatch, a claim trigger without its source discard, a draw outcome with a non-empty wall, an invalid winning effective tile count, or a physical tile multiplicity above the legal inventory
- **THEN** `assertRoundScenarioInvariants` MUST throw a diagnostic error naming the violated invariant

#### Scenario: Known high-risk fixtures use the shared harness

- **WHEN** the claim-priority competing-claims test, mainline playable claim/draw tests, draw-next-round browser seed, or AI win reveal seed creates a round fixture
- **THEN** the fixture MUST be produced by the shared reachable scenario harness and MUST pass its invariant checker


<!-- @trace
source: post-mvp-harness-engineering-hardening
updated: 2026-07-20
code:
  - src/core/rules/roundFlow.ts
  - .npmrc
  - .superpowers/brainstorm/51439-1784519701/content/settlement-layout-options.html
  - AGENTS.md
  - src/core/testing/roundScenario.ts
  - src/stores/gameSession.ts
  - src/views/game/types.ts
  - src/core/config/index.ts
  - package.json
  - src/views/game/e2eBridge.ts
  - src/views/game/components/GameTableView.vue
  - .superpowers/brainstorm/51439-1784519701/state/server.pid
  - scripts/check-node-version.mjs
  - src/core/scoring/settlement.ts
  - src/views/game/selectors.ts
  - src/core/index.ts
  - src/core/scoring/types.ts
  - .superpowers/brainstorm/51439-1784519701/state/events
  - src/core/scoring/patterns.ts
  - src/core/scoring/catalog.ts
  - src/core/types/result.ts
  - scripts/node-version-policy.mjs
  - src/core/types/table.ts
  - scripts/node-version-policy.d.mts
  - src/core/scoring/validation.ts
  - .superpowers/brainstorm/51439-1784519701/state/server-stopped
  - src/views/game/GameView.vue
tests:
  - tests/core/rule-config-core.test.ts
  - tests/smoke/node-version-policy.test.ts
  - tests/core/domain-model.test.ts
  - tests/ui/table-layout-verification-flow.test.ts
  - tests/ui/game-table-view.test.ts
  - tests/core/dealer-progression.test.ts
  - tests/core/round-flow-outcome.test.ts
  - tests/ui/round-result-sync.test.ts
  - tests/ui/game-table-layout.test.ts
  - tests/ui/human-self-turn-actions.test.ts
  - tests/core/round-scenario-harness.test.ts
  - tests/ui/interactive-turn-loop.test.ts
  - tests/ui/game-session-hmr.test.ts
  - tests/core/round-flow-claims.test.ts
  - tests/core/scoring-settlement.test.ts
  - tests/ui/human-claim-window.test.ts
  - tests/ui/game-session.store.test.ts
  - e2e/game-table.smoke.spec.ts
  - tests/docs/agents-workflow-policy.test.ts
  - tests/ui/mainline-playable-flow.test.ts
  - tests/ui/next-round-flow.test.ts
-->

---
### Requirement: Lowest-layer regression first

For every reproduced bug, regression, or test-to-real-play mismatch, the AI workflow SHALL identify the lowest incorrect layer and SHALL add a failing regression at that layer before changing implementation behavior.

#### Scenario: Reproduced behavior establishes RED before repair

- **WHEN** a user-reported behavior has a minimal reproduction
- **THEN** the change MUST assign a stable regression ID, identify the incorrect layer, and run the narrowest new regression test to an observed non-zero exit before implementation repair

#### Scenario: Root cause is repaired before higher-layer cleanup

- **WHEN** the lowest-layer regression fails
- **THEN** implementation MUST repair the root cause at that layer and make the same regression pass before any UI semantic or readability cleanup is treated as complete

#### Scenario: Competing claim regression proves every candidate is legal

- **WHEN** a regression asserts that a winning claim outranks pon
- **THEN** the fixture MUST expose both win and pon as legal candidates before claim resolution
- **THEN** the resolved result MUST select the winning claim through configured priority


<!-- @trace
source: post-mvp-harness-engineering-hardening
updated: 2026-07-20
code:
  - src/core/rules/roundFlow.ts
  - .npmrc
  - .superpowers/brainstorm/51439-1784519701/content/settlement-layout-options.html
  - AGENTS.md
  - src/core/testing/roundScenario.ts
  - src/stores/gameSession.ts
  - src/views/game/types.ts
  - src/core/config/index.ts
  - package.json
  - src/views/game/e2eBridge.ts
  - src/views/game/components/GameTableView.vue
  - .superpowers/brainstorm/51439-1784519701/state/server.pid
  - scripts/check-node-version.mjs
  - src/core/scoring/settlement.ts
  - src/views/game/selectors.ts
  - src/core/index.ts
  - src/core/scoring/types.ts
  - .superpowers/brainstorm/51439-1784519701/state/events
  - src/core/scoring/patterns.ts
  - src/core/scoring/catalog.ts
  - src/core/types/result.ts
  - scripts/node-version-policy.mjs
  - src/core/types/table.ts
  - scripts/node-version-policy.d.mts
  - src/core/scoring/validation.ts
  - .superpowers/brainstorm/51439-1784519701/state/server-stopped
  - src/views/game/GameView.vue
tests:
  - tests/core/rule-config-core.test.ts
  - tests/smoke/node-version-policy.test.ts
  - tests/core/domain-model.test.ts
  - tests/ui/table-layout-verification-flow.test.ts
  - tests/ui/game-table-view.test.ts
  - tests/core/dealer-progression.test.ts
  - tests/core/round-flow-outcome.test.ts
  - tests/ui/round-result-sync.test.ts
  - tests/ui/game-table-layout.test.ts
  - tests/ui/human-self-turn-actions.test.ts
  - tests/core/round-scenario-harness.test.ts
  - tests/ui/interactive-turn-loop.test.ts
  - tests/ui/game-session-hmr.test.ts
  - tests/core/round-flow-claims.test.ts
  - tests/core/scoring-settlement.test.ts
  - tests/ui/human-claim-window.test.ts
  - tests/ui/game-session.store.test.ts
  - e2e/game-table.smoke.spec.ts
  - tests/docs/agents-workflow-policy.test.ts
  - tests/ui/mainline-playable-flow.test.ts
  - tests/ui/next-round-flow.test.ts
-->

---
### Requirement: Interactive regression closure

The AI workflow SHALL supplement lower-layer regression tests with browser E2E whenever a defect affects multi-step interaction, state continuity, or player-visible interpretation across phases.

#### Scenario: Cross-phase behavior receives browser verification

- **WHEN** a repair changes or validates behavior across discard, claim, round-end, result, or next-round phases
- **THEN** the change MUST run a browser E2E journey that reproduces the affected path after the lower-layer regression passes

#### Scenario: Infrastructure blocker is recorded before weaker substitution

- **WHEN** browser E2E cannot run because of a demonstrated infrastructure or environment blocker
- **THEN** the change MUST record the exact blocker command, path or service, and exit result before using an equivalent integration test
- **THEN** the change MUST retain the missing browser verification as an explicit unclosed gap


<!-- @trace
source: post-mvp-harness-engineering-hardening
updated: 2026-07-20
code:
  - src/core/rules/roundFlow.ts
  - .npmrc
  - .superpowers/brainstorm/51439-1784519701/content/settlement-layout-options.html
  - AGENTS.md
  - src/core/testing/roundScenario.ts
  - src/stores/gameSession.ts
  - src/views/game/types.ts
  - src/core/config/index.ts
  - package.json
  - src/views/game/e2eBridge.ts
  - src/views/game/components/GameTableView.vue
  - .superpowers/brainstorm/51439-1784519701/state/server.pid
  - scripts/check-node-version.mjs
  - src/core/scoring/settlement.ts
  - src/views/game/selectors.ts
  - src/core/index.ts
  - src/core/scoring/types.ts
  - .superpowers/brainstorm/51439-1784519701/state/events
  - src/core/scoring/patterns.ts
  - src/core/scoring/catalog.ts
  - src/core/types/result.ts
  - scripts/node-version-policy.mjs
  - src/core/types/table.ts
  - scripts/node-version-policy.d.mts
  - src/core/scoring/validation.ts
  - .superpowers/brainstorm/51439-1784519701/state/server-stopped
  - src/views/game/GameView.vue
tests:
  - tests/core/rule-config-core.test.ts
  - tests/smoke/node-version-policy.test.ts
  - tests/core/domain-model.test.ts
  - tests/ui/table-layout-verification-flow.test.ts
  - tests/ui/game-table-view.test.ts
  - tests/core/dealer-progression.test.ts
  - tests/core/round-flow-outcome.test.ts
  - tests/ui/round-result-sync.test.ts
  - tests/ui/game-table-layout.test.ts
  - tests/ui/human-self-turn-actions.test.ts
  - tests/core/round-scenario-harness.test.ts
  - tests/ui/interactive-turn-loop.test.ts
  - tests/ui/game-session-hmr.test.ts
  - tests/core/round-flow-claims.test.ts
  - tests/core/scoring-settlement.test.ts
  - tests/ui/human-claim-window.test.ts
  - tests/ui/game-session.store.test.ts
  - e2e/game-table.smoke.spec.ts
  - tests/docs/agents-workflow-policy.test.ts
  - tests/ui/mainline-playable-flow.test.ts
  - tests/ui/next-round-flow.test.ts
-->

---
### Requirement: Verification evidence ledger

Every implementation change SHALL keep execution evidence in its authoritative Spectra tasks artifact and SHALL NOT treat task checkboxes, typecheck, lint, build, or existing green tests as sufficient bug-closure proof.

#### Scenario: Regression evidence records RED and GREEN

- **WHEN** a regression task moves from failing to passing
- **THEN** the tasks evidence ledger MUST record the regression ID, reproduction, incorrect layer, exact RED command and non-zero exit code, exact GREEN command and exit code 0, and concise observed summaries

#### Scenario: Interactive evidence records browser closure

- **WHEN** the repaired behavior spans an interactive player journey
- **THEN** the evidence ledger MUST record the exact browser E2E command, exit code, and covered journey

#### Scenario: Missing evidence prevents completion claim

- **WHEN** any required RED, GREEN, layer-specific, or browser evidence entry is absent
- **THEN** the AI MUST NOT describe the change as fully verified, closed, or ready to archive


<!-- @trace
source: post-mvp-harness-engineering-hardening
updated: 2026-07-20
code:
  - src/core/rules/roundFlow.ts
  - .npmrc
  - .superpowers/brainstorm/51439-1784519701/content/settlement-layout-options.html
  - AGENTS.md
  - src/core/testing/roundScenario.ts
  - src/stores/gameSession.ts
  - src/views/game/types.ts
  - src/core/config/index.ts
  - package.json
  - src/views/game/e2eBridge.ts
  - src/views/game/components/GameTableView.vue
  - .superpowers/brainstorm/51439-1784519701/state/server.pid
  - scripts/check-node-version.mjs
  - src/core/scoring/settlement.ts
  - src/views/game/selectors.ts
  - src/core/index.ts
  - src/core/scoring/types.ts
  - .superpowers/brainstorm/51439-1784519701/state/events
  - src/core/scoring/patterns.ts
  - src/core/scoring/catalog.ts
  - src/core/types/result.ts
  - scripts/node-version-policy.mjs
  - src/core/types/table.ts
  - scripts/node-version-policy.d.mts
  - src/core/scoring/validation.ts
  - .superpowers/brainstorm/51439-1784519701/state/server-stopped
  - src/views/game/GameView.vue
tests:
  - tests/core/rule-config-core.test.ts
  - tests/smoke/node-version-policy.test.ts
  - tests/core/domain-model.test.ts
  - tests/ui/table-layout-verification-flow.test.ts
  - tests/ui/game-table-view.test.ts
  - tests/core/dealer-progression.test.ts
  - tests/core/round-flow-outcome.test.ts
  - tests/ui/round-result-sync.test.ts
  - tests/ui/game-table-layout.test.ts
  - tests/ui/human-self-turn-actions.test.ts
  - tests/core/round-scenario-harness.test.ts
  - tests/ui/interactive-turn-loop.test.ts
  - tests/ui/game-session-hmr.test.ts
  - tests/core/round-flow-claims.test.ts
  - tests/core/scoring-settlement.test.ts
  - tests/ui/human-claim-window.test.ts
  - tests/ui/game-session.store.test.ts
  - e2e/game-table.smoke.spec.ts
  - tests/docs/agents-workflow-policy.test.ts
  - tests/ui/mainline-playable-flow.test.ts
  - tests/ui/next-round-flow.test.ts
-->

---
### Requirement: Machine-checkable workflow authority

The project instruction file SHALL expose one unambiguous workflow authority structure that can be checked by an automated test.

#### Scenario: Numbered hard-gate headings are unique

- **WHEN** the workflow policy test parses numbered level-two headings in `AGENTS.md`
- **THEN** every heading identifier MUST be unique
- **THEN** audit, implementation, verification, closure, environment, mainline, post-MVP, and Harness Engineering authority MUST each have an explicit section

#### Scenario: Audit remains read-only until repair authority

- **WHEN** the user's request is an audit, review, inventory, reconciliation, or accountability request
- **THEN** the AI MUST only read, compare, and present traceable evidence until the user explicitly authorizes repair or implementation

#### Scenario: Repair authority does not imply closure authority

- **WHEN** the user authorizes repair or implementation without authorizing archive, workflow cleanup, or mainline synchronization
- **THEN** the AI MUST implement and verify the repair but MUST NOT archive the change or update mainline closure state
- **THEN** the AI MUST stop before opening the next change if the verified change still awaits closure authority

#### Scenario: Standalone post-MVP maintenance does not recreate the MVP board

- **WHEN** the MVP mainline is archived and the user authorizes a standalone maintenance change without establishing a new versioned mainline
- **THEN** the maintenance change MUST remain self-contained and MUST NOT be labeled as a continuation of the MVP current mainline

#### Scenario: Active boards exist only for explicit unfinished versioned mainlines

- **WHEN** no explicit post-MVP, incremental, maintenance, or versioned mainline has been established
- **THEN** the repository MUST NOT create a synthetic active board solely to satisfy a board-presence rule

<!-- @trace
source: post-mvp-harness-engineering-hardening
updated: 2026-07-20
code:
  - src/core/rules/roundFlow.ts
  - .npmrc
  - .superpowers/brainstorm/51439-1784519701/content/settlement-layout-options.html
  - AGENTS.md
  - src/core/testing/roundScenario.ts
  - src/stores/gameSession.ts
  - src/views/game/types.ts
  - src/core/config/index.ts
  - package.json
  - src/views/game/e2eBridge.ts
  - src/views/game/components/GameTableView.vue
  - .superpowers/brainstorm/51439-1784519701/state/server.pid
  - scripts/check-node-version.mjs
  - src/core/scoring/settlement.ts
  - src/views/game/selectors.ts
  - src/core/index.ts
  - src/core/scoring/types.ts
  - .superpowers/brainstorm/51439-1784519701/state/events
  - src/core/scoring/patterns.ts
  - src/core/scoring/catalog.ts
  - src/core/types/result.ts
  - scripts/node-version-policy.mjs
  - src/core/types/table.ts
  - scripts/node-version-policy.d.mts
  - src/core/scoring/validation.ts
  - .superpowers/brainstorm/51439-1784519701/state/server-stopped
  - src/views/game/GameView.vue
tests:
  - tests/core/rule-config-core.test.ts
  - tests/smoke/node-version-policy.test.ts
  - tests/core/domain-model.test.ts
  - tests/ui/table-layout-verification-flow.test.ts
  - tests/ui/game-table-view.test.ts
  - tests/core/dealer-progression.test.ts
  - tests/core/round-flow-outcome.test.ts
  - tests/ui/round-result-sync.test.ts
  - tests/ui/game-table-layout.test.ts
  - tests/ui/human-self-turn-actions.test.ts
  - tests/core/round-scenario-harness.test.ts
  - tests/ui/interactive-turn-loop.test.ts
  - tests/ui/game-session-hmr.test.ts
  - tests/core/round-flow-claims.test.ts
  - tests/core/scoring-settlement.test.ts
  - tests/ui/human-claim-window.test.ts
  - tests/ui/game-session.store.test.ts
  - e2e/game-table.smoke.spec.ts
  - tests/docs/agents-workflow-policy.test.ts
  - tests/ui/mainline-playable-flow.test.ts
  - tests/ui/next-round-flow.test.ts
-->