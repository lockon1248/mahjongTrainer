## Context

`GameView` measures the full stage content and applies one `min(widthRatio, heightRatio, 1)` transform. The settlement summary previously added enough height to make the height ratio dominant, so the whole desktop table shrank and left broad margins. The final confirmed design uses one compact status row, a compact terminal row, and one authoritative win-or-draw settlement dialog outside the scaled stage.

## Goals / Non-Goals

**Goals:**

- Keep the desktop table at its natural readable size and use the available width without page scrolling.
- Render only the six confirmed status values and the compact terminal result values.
- Automatically show one structured round settlement after every win or draw outside the stage scaler.
- Keep one chronological central discard pool at a fixed height throughout a full reachable round.
- Preserve narrow-screen safety scaling and all authoritative core/store-derived values.

**Non-Goals:**

- No scoring, dealer-continuation, payment, or match-session changes beyond the already completed scope. Round-flow and selector changes are limited to the authoritative chronological discard sequence required by the central pool.
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

### Render one fixed-height chronological central discard pool

`TableState` adds an authoritative `discardSequence` containing tiles in actual discard order. `discardTile` appends the discarded tile to both the existing seat-owned rule state and this chronological sequence. When `chi`, `pon`, or `kan-exposed` accepts the triggering discard, claim resolution removes the triggering seat's last matching tile and the final chronological entry in the same transition. This companion sequence is necessary because concatenating four seat-owned arrays cannot recover interleaved turn order.

The selector exposes only the chronological tile sequence needed by the table view. The UI renders one unlabeled central pool from left to right and top to bottom; it does not render seat headings, per-seat counts, or per-tile seat markers. The final sequence entry is the only latest discard and receives the existing claim-window highlight classes according to legal human candidates. Removed claimed tiles do not remain visible.

The central pool uses a fixed-height grid sized for the rule-derived upper bound of 72 visible discards (`136` non-flower tiles minus `64` tiles retained across four hands when no discard has been claimed into a meld). It MUST fit without internal scrolling and MUST NOT increase stage `scrollHeight` as the round progresses. Reserving four independently growing pools was rejected because their wrapped rows repeatedly change stage height. Reserving four full worst-case pools was rejected because it creates excessive empty height at round start.

### Stretch the desktop table to consume remaining stage height

At desktop viewports with sufficient height, `game-stage-scaler`, `game-stage-content`, `game-table-layout`, and `mahjong-table` form one definite-height chain. The table consumes the remaining stage height below the compact status content, and its grid tracks stretch the top, side, center, and human regions without changing the stage scale. The shared discard pool remains content-invariant: its available height is determined by the viewport layout, not by the number of rendered discards, so opening and 72-discard states keep identical geometry.

Vertical centering was rejected because it would only redistribute the unused area above and below the table. Leaving the table content-sized was rejected because it concentrates all unused height below the human panel. Narrow and wide-but-short viewports retain the existing proportional fallback and critical-content visibility behavior.

### Preserve claimed meld visibility and semantic pon color

The stretched desktop grid MUST allocate enough bottom-track height for the human player's newly added meld row as well as the concealed hand. A production pon transition may change the bottom panel's content height, so desktop track selection responds to the presence of a human meld instead of clipping it behind `overflow: hidden`. The complete meld and concealed-hand bounding boxes remain inside the human panel and viewport.

During a claim window where `pon` is legal and `win` is not legal, the final shared discard uses a red background treatment that overrides the generic yellow latest-discard background. A red border alone is insufficient because it leaves the tile visually yellow. Earlier discards remain neutral. Existing win-highlight priority is unchanged when `win` is also legal.

### Present the round outcome without an internal dialog scrollbar

The unified settlement dialog renders one outcome line before tai and chip sections. A self-draw formats the authoritative winner as `{winner} 自摸`. A discard win formats both authoritative seats as `{winner} 和牌｜{discarder} 放槍`. A draw renders only its existing authoritative draw reason and does not render a win/loss outcome line.

At the supported 1489x658 desktop viewport, the dialog uses the available viewport dimensions and compact section spacing so the complete heading, outcome, tai details, four chip rows, and action remain visible at once. The dialog content MUST NOT use `overflow-y: auto` or `overflow-y: scroll`. Merely hiding overflow while clipping content was rejected because it would remove access to settlement information; increasing the page height or introducing page scrolling was rejected because the fixed-viewport contract remains authoritative.

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
- Every visible unclaimed discard appears once in one chronological central pool without seat labels; the latest discard is the final grid item and carries any legal claim highlight.
- At a fixed desktop viewport, the stage scale after a reachable round with 72 visible discards matches its opening scale.
- At a 2048 by 962 desktop viewport, the table bottom aligns with the available stage content bottom instead of leaving an unused block below the human panel.
- After a legal human pon at a 2048 by 962 desktop viewport, the complete new meld and concealed hand remain visible inside the human panel.
- During a pon-only human claim window, the final shared discard has a red background and earlier discards do not.
- A self-draw settlement identifies `{winner} 自摸`; a discard win identifies `{winner} 和牌｜{discarder} 放槍`; a draw retains only its draw reason.
- At 1489x658, the complete round settlement dialog is visible at once without an internal or page-level scrollbar.

### UI state and data boundaries

The dialog consumes `resultSummary.type`, `resultSummary.winnerSeat`, `resultSummary.discarderSeat`, `resultSummary.scoringItems`, `resultSummary.totalTai`, and store-derived chip settlements. Visibility is derived from terminal result presence plus a UI-only 1.5-second readiness timer; there is no user-controlled local open/close state. No component calculates scoring, payments, or round outcomes.

Per-seat chip deltas and balances come from the store's latest settlement snapshot. The component only formats signed deltas and MUST NOT derive payment amounts.

Chronological discard order comes from `TableState.discardSequence` through the selector. The component MUST NOT concatenate or sort per-seat pools to infer time order.

### Failure and fallback behavior

An in-progress round has no terminal result row or dialog. A terminal result whose 1.5-second delay has not elapsed renders no overlay. A win with an empty structured scoring item list still opens the dialog after the delay and renders the existing empty-state value already used by the result view; no synthetic scoring item is created. A draw does not infer or render winner/loser copy. If the viewport is narrow, measured scaling may reduce the stage while preserving its proportions.

An empty discard sequence renders one empty central pool. A claim transition removes only the final triggering discard from the chronological pool. The fixed-height grid does not scroll or expand when more discard rows are populated.

### Acceptance criteria

- Targeted Vitest component/UI regressions pass under Node 22.
- Desktop Chromium E2E proves automatic unified settlement, 2048x962 scale 1, 1489x658 critical-content visibility, width utilization, and no page scrolling.
- Existing draw-next-round E2E still proves the original dealer continues after a draw.
- Typecheck, build, and strict Spectra validation pass in addition to behavioral tests.
- A regression test proves the game-session module contains active Pinia HMR acceptance for `useGameSessionStore`.
- Store, selector, component, and browser regressions prove zero-tai base-stake transfer, self-draw/discard allocation, draw zero deltas, and next/restart actions in the unified dialog.
- Fake-timer component regressions and Chromium E2E prove the dialog is absent before 1,500 milliseconds and visible after the delay for terminal results.
- Component regressions prove exact self-draw, discard-win, and draw outcome copy. Chromium at 1489x658 proves the entire dialog content fits and neither the dialog nor page has a scrollbar.
- Core and selector regressions prove chronological append and claimed-discard removal. Component and Chromium long-round regressions prove one unlabeled pool, latest-discard highlighting, capacity near 72 tiles, and stable opening-versus-late stage scale.

### Scope boundaries

Table presentation, chronological discard state, match reset, dealer-continuation round state, dynamic continuation scoring, and corresponding tests are in scope. Other scoring rules, payment modes, result data shapes, setup validation, and the unfinished Harness change remain untouched.

## Risks / Trade-offs

- [Risk] Disabling desktop scaling exposes unusually tall content → Scale 1 is conditional on both width and height fit; 1489x658 browser E2E asserts the hand and actions are not clipped.
- [Risk] Teleported content complicates component queries → Tests query `document.body` and clean up mounted wrappers after each case.
- [Risk] Result changes could weaken authoritative state visibility → Winner, discarder, total tai, draw reason, and scoring items remain driven by the existing result summary; only explicitly rejected duplicate fields are removed.
- [Risk] A second discard projection can drift from seat-owned pools → Only round-flow transitions mutate both structures, and core regressions assert append/removal invariants for discard and accepted claims.
- [Risk] A late round can exceed the layout assumed by early-game tests → A reachable near-exhaustive browser fixture populates the central grid and compares its stage scale against the opening scale.
- [Risk] Stretching the table can break short-screen visibility → The stretch applies through the existing measured stage and the 1489x658 and narrow-viewport browser regressions remain mandatory.
- [Risk] Content-dependent bottom tracks can reintroduce unstable stage geometry → Only authoritative meld/win regions select predefined desktop track ratios; discard accumulation never changes them.
