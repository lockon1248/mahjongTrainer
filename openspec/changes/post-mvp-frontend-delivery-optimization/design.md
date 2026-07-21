## Context

Vue Router currently imports both route components eagerly, producing one application chunk. `GameView.vue` also imports the E2E bridge statically; its runtime DEV guard prevents activation but does not prevent seed code from appearing in production assets. Vercel supplies transport compression, so this change optimizes module delivery rather than emitting precompressed files.

## Goals / Non-Goals

**Goals:**

- Load the game feature only when `/game` is requested.
- Preserve home and game navigation behavior.
- Keep the E2E bridge available in development E2E mode.
- Exclude E2E seed symbols from production JavaScript assets.

**Non-Goals:**

- No gzip/Brotli build plugin.
- No manual vendor chunk configuration.
- No UI, game rule, or E2E scenario behavior changes.

## Decisions

### Route components use native dynamic imports

Both route records use `() => import(...)`, allowing Vite and Vue Router to create route-level chunks without manual chunk names. This follows the existing router structure and avoids bundler-specific configuration.

### E2E bridge loads only in development

`GameView.vue` invokes a small async bootstrap guarded by `import.meta.env.DEV`; the bridge module is imported inside that guard. Vite can remove the import edge from production output while development and Playwright retain the same attachment behavior.

### Production output is verified by symbols and chunks

A smoke regression checks source contracts before implementation. The production build is then inspected for multiple JavaScript assets and absence of known bridge seed symbols. Browser E2E verifies development-mode behavior remains reachable.

## Implementation Contract

Behavior: visiting `/` renders the existing home view; navigating to `/game` asynchronously loads and renders the existing game view. E2E mode continues to expose every `GameE2EBridge` method after `waitForBridge`. Production JavaScript assets contain no `seedPonClaimScenario` or `seedExhaustedSharedDiscardScenario` symbols.

Interface/data shape: route records retain `/` and `/game`; `attachGameE2EBridge` and `GameE2EBridge` remain the bridge contract. No new runtime dependency or public UI API is introduced.

Failure modes: a failed route chunk follows Vue Router's normal navigation failure behavior. A development bridge import failure remains visible through the rejected module load rather than being silently replaced. Production must not attempt to load the bridge.

Acceptance: the narrow source-contract regression observes RED before implementation and GREEN after it; full typecheck and build exit 0; production asset inspection confirms route chunks and seed exclusion; affected Playwright navigation and bridge journeys pass.

Scope: only route loading and development harness delivery are in scope. Compression, caching headers, manual vendor splitting, UI, rules, and scoring are out of scope.

## Risks / Trade-offs

- [Risk] First navigation to `/game` adds one network request → Vite emits hashed assets suitable for Vercel CDN caching, while the smaller homepage chunk improves initial delivery.
- [Risk] Async bridge initialization races E2E setup → existing `waitForBridge` remains the synchronization boundary and is verified by Playwright.
