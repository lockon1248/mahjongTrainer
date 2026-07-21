## Summary

Reduce the initial production payload by loading the game route on demand and preventing development-only E2E scenario code from shipping in production assets.

## Motivation

The current production build emits one application JavaScript chunk because both routes are eager imports, and the compiled asset still contains E2E seed symbols even though the bridge cannot activate in production. Vercel already provides transport compression, so payload reduction should happen at the module graph instead of adding redundant gzip artifacts.

## Proposed Solution

- Convert home and game route components to Vue Router dynamic imports so Vite emits route chunks.
- Move E2E bridge loading behind a statically analyzable development guard so production builds omit the bridge and its seed fixtures.
- Add source and production-build regression checks plus browser route verification.

## Capabilities

### New Capabilities

- `frontend-delivery-performance`: Defines route-level code splitting, production exclusion of development harness code, and build-output verification.

### Modified Capabilities

(none)

## Impact

- Affected specs: `frontend-delivery-performance`
- Affected code:
  - Modified: `src/router/index.ts`
  - Modified: `src/views/game/GameView.vue`
  - Modified: `tests/ui/app-shell.test.ts`
  - Modified: `tests/ui/game-table-view.test.ts`
  - New: `tests/smoke/frontend-delivery-policy.test.ts`
