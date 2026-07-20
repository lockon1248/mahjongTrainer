## Context

`GameView` measures the full stage content and applies one `min(widthRatio, heightRatio, 1)` transform. The settlement summary previously added enough height to make the height ratio dominant, so the whole desktop table shrank and left broad margins. The final confirmed design uses one compact status row, a compact terminal row, and one authoritative win-or-draw settlement dialog outside the scaled stage.

## Goals / Non-Goals

**Goals:**

- Keep the desktop table at its natural readable size and use the available width without page scrolling.
- Render only the six confirmed status values and the compact terminal result values.
- Automatically show one structured round settlement after every win or draw outside the stage scaler.
- Preserve narrow-screen safety scaling and all authoritative core/store-derived values.

**Non-Goals:**

- No scoring, round-flow, dealer-continuation, store shape, or result-selector changes.
- No new status meaning, result copy, scoring item, setup rule, or navigation behavior.
- No redesign of tile art, color semantics, player placement, or the home page.

## Decisions

### Use one compact status row and one terminal result row

The normal status row renders local round, dealer, prevailing wind, phase, wall count, and victory condition. Current operation, last claim, outcome, total discards, stakes, result type, and ended status are removed from product rendering. A win result row renders winner, discarder when present, and total tai; a draw result renders its authoritative reason. Round continuation actions live in the settlement dialog.

This reduces the stage's height at the source instead of hiding data with smaller typography. Keeping the current multi-grid summary and merely reducing gaps was rejected because it would retain duplicate information and continue to trigger height-driven scaling.

### Keep desktop layout unscaled and reserve proportional scaling for narrow screens

At desktop width and sufficient height the stage scaler uses scale 1. A wide but short viewport first uses compact vertical spacing and then falls back to measured proportional scaling when critical content still exceeds the frame. The scale decision therefore uses both available width and height rather than a width-only breakpoint. The page remains fixed-height and scroll-free, but critical human-hand and action regions MUST remain inside the viewport.

Always scaling the whole scene was rejected because settlement-only height changes must not alter the readable size of the entire game. A width-only forced scale of 1 was also rejected because it clips wide-but-short viewports. Allowing page scroll was rejected because the authoritative fixed-viewport requirement remains in force.

### Protect behavior with component and browser regressions

Component tests assert the removed fields are absent and verify unified win/draw settlement content. Browser E2E uses real terminal journeys to assert stage readability, chip allocation, and draw-to-next-round dealer flow.

### Render authoritative match settlement instead of a dead next-round action

When `matchSummary.status` is `ended`, the unified settlement MUST hide `下一局`, render the authoritative match winner with the final round allocation, and offer `重新開始`. The typed event calls a store reset action that returns the session to its existing setup state.

### Track dealer continuation in round flow and score it dynamically

`TableState` carries a non-negative `dealerContinuationCount`. A new match starts at zero. `createNextRoundFromCompletedRound` increments it when the same dealer continues after a dealer win or draw, and resets it to zero when dealer changes. Win evaluation receives this count through `winContext`; when the winner is the dealer and the count is positive, settlement appends one structured `dealer-continuation` item whose tai equals the count. The existing `dealer-win` item remains 1 tai.

Store-only tai mutation was rejected because it would make result metadata disagree with scoring core. Repeated static pattern IDs were rejected because the tai value is dynamic and must remain one explainable item.

### Enlarge only the human concealed-hand controls

Human concealed tiles use at least 1rem text with larger padding, hit area, and spacing. AI hidden counts, discards, and melds keep their current density. The 1489x658 visibility regression remains authoritative, so enlargement cannot reintroduce clipping.

### Preserve new store actions across Vite HMR

`gameSession.ts` registers Pinia's `acceptHMRUpdate` for `useGameSessionStore`. This lets Vite replace the setup-store definition while retaining the existing session state and updating its action surface, so a hot-updated `GameView` cannot call a stale store instance that lacks `resetMatch`. The registration is development-only through `import.meta.hot` and does not alter production session behavior.

### Use one authoritative per-round settlement dialog

`MatchState` stores the latest completed round's per-seat chip delta and post-settlement balance at the same point where `applyMatchSettlement` mutates chips. The selector exposes that immutable settlement snapshot to the table view; the component MUST NOT reproduce the base-stake, tai-value, discard-win, or self-draw payment formula.

Every terminal round automatically opens one `本局結算` dialog. Vue `Teleport` mounts it under `body`, outside `game-stage-scaler`, so settlement-specific height does not alter the table scale. A win renders winner, discarder when present, total tai, structured scoring items, and four settlement rows. A draw renders its authoritative reason instead of tai/scoring items and still renders four settlement rows with zero deltas. The separate `臺型明細` dialog, its close/reopen state, and `查看台型` trigger are removed. An in-progress match offers `下一局` inside the dialog; an ended match offers `重新開始` instead. Pinia owns settlement data while dialog visibility is derived directly from terminal result presence.

### Delay terminal settlement visibility by 1.5 seconds

When a terminal `resultSummary` first becomes available, the table renders that terminal state without mounting the settlement overlay. A UI-only timer makes the same authoritative dialog visible after 1,500 milliseconds. The delay applies equally to wins and draws so the player can inspect the revealed winning hand or final table state before the overlay covers it. The timer controls visibility only; store settlement, scoring, match completion, and chip balances remain immediate and authoritative. The component clears the pending timer when the terminal result changes or the component unmounts.

Immediate mounting was rejected because it obscures the exact terminal state the user needs time to recognize. A two-second delay was rejected as slower than the confirmed pacing; one second was rejected as still too abrupt.

## Implementation Contract

### Observable behavior

- During a round, exactly the confirmed status concepts remain above the table: local round, dealer, prevailing wind, phase, remaining wall, and victory condition.
- A completed win shows winner, discarder when applicable, and total tai; it does not show result type, ended status, or a separate scoring trigger.
- A win keeps the terminal table visible for 1.5 seconds, then automatically opens `本局結算` with tai details and authoritative four-seat chip allocation; total tai zero still shows the base-stake transfer.
- A draw keeps the terminal table visible for 1.5 seconds, then automatically opens the same dialog with its reason, no tai section, and zero-delta four-seat balances.
- A 2048x962 desktop keeps scale 1. A 1489x658 wide-but-short desktop uses the minimum required compact/fallback behavior while keeping the human hand and action row completely inside the viewport. Narrow screens retain proportional fallback scaling.
- Match-ended state shows winner and final chip totals in a full-screen settlement dialog, hides next round, and `重新開始` returns to match setup.
- Dealer continuation count starts at 0, increments on each same-dealer next round, resets on dealer change, and adds one dynamic `連莊 N 台` scoring item to dealer wins.
- Human concealed tile controls render at a computed font size of at least 16px and remain fully visible at 1489x658.
- A Vite hot update to the game-session store preserves the live match state while updating the existing store instance with newly defined actions such as `resetMatch`.

### UI state and data boundaries

The dialog consumes `resultSummary.scoringItems`, `resultSummary.totalTai`, and store-derived chip settlements. Visibility is derived from terminal result presence plus a UI-only 1.5-second readiness timer; there is no user-controlled local open/close state. No component calculates scoring, payments, or round outcomes.

Per-seat chip deltas and balances come from the store's latest settlement snapshot. The component only formats signed deltas and MUST NOT derive payment amounts.

### Failure and fallback behavior

An in-progress round has no terminal result row or dialog. A terminal result whose 1.5-second delay has not elapsed renders no overlay. A win with an empty structured scoring item list still opens the dialog after the delay and renders the existing empty-state value already used by the result view; no synthetic scoring item is created. If the viewport is narrow, measured scaling may reduce the stage while preserving its proportions.

### Acceptance criteria

- Targeted Vitest component/UI regressions pass under Node 22.
- Desktop Chromium E2E proves automatic unified settlement, 2048x962 scale 1, 1489x658 critical-content visibility, width utilization, and no page scrolling.
- Existing draw-next-round E2E still proves the original dealer continues after a draw.
- Typecheck, build, and strict Spectra validation pass in addition to behavioral tests.
- A regression test proves the game-session module contains active Pinia HMR acceptance for `useGameSessionStore`.
- Store, selector, component, and browser regressions prove zero-tai base-stake transfer, self-draw/discard allocation, draw zero deltas, and next/restart actions in the unified dialog.
- Fake-timer component regressions and Chromium E2E prove the dialog is absent before 1,500 milliseconds and visible after the delay for terminal results.

### Scope boundaries

Table presentation, match reset, dealer-continuation round state, dynamic continuation scoring, and corresponding tests are in scope. Other scoring rules, payment modes, setup validation, and the unfinished Harness change remain untouched.

## Risks / Trade-offs

- [Risk] Disabling desktop scaling exposes unusually tall content → Scale 1 is conditional on both width and height fit; 1489x658 browser E2E asserts the hand and actions are not clipped.
- [Risk] Teleported content complicates component queries → Tests query `document.body` and clean up mounted wrappers after each case.
- [Risk] Result changes could weaken authoritative state visibility → Winner, discarder, total tai, draw reason, and scoring items remain driven by the existing result summary; only explicitly rejected duplicate fields are removed.
