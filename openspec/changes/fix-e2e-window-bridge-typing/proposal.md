## Problem

Playwright E2E tests repeatedly cast `window` to required one-off bridge shapes, while the repository Window augmentation is incomplete and the main TypeScript project excludes `e2e/`; VS Code therefore reports `ts(2352)` warnings that the asserted types do not sufficiently overlap.

## Root Cause

The E2E bridge contract has multiple partial declarations instead of one exported source of truth, and `tsconfig.json` does not typecheck Playwright files together with the global declaration.

## Proposed Solution

Export one bridge contract, augment Window with that contract, include E2E sources in the TypeScript project, and replace required intersection casts with a checked helper that narrows the optional runtime bridge.
Use the browser timer's explicit numeric handle type in Vue SFC state so Node ambient timer declarations cannot change the assignment type seen by the Vue language service.

## Non-Goals

- Do not change game behavior, E2E seed behavior, or product UI.
- Do not add new bridge methods.

## Success Criteria

- No `window as Window & { __MAHJONG_E2E__: ... }` assertions remain in the E2E test.
- VS Code and `npm run typecheck` resolve every bridge method from the shared contract without `ts(2352)`.
- The affected Playwright journeys continue to pass.

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `ai-harness-engineering`: Require E2E bridge access to use one compiler-checked contract covered by the repository TypeScript project.

## Impact

- Affected code:
  - Modified: `src/views/game/e2eBridge.ts`
  - Modified: `src/env.d.ts`
  - Modified: `e2e/game-table.smoke.spec.ts`
  - Modified: `tsconfig.json`
  - Modified: `src/views/game/GameView.vue`
  - New: `tests/docs/e2e-window-typing.test.ts`
