## 1. Visibility projection

- [x] 1.1 Deliver `Concealed kong privacy in table snapshots` by `Project concealed kong melds into viewer-safe data`, so in-progress AI concealed kongs render as hidden placeholders for the human viewer; verify with `tests/ui/game-table-view.test.ts` and `tests/ui/round-result-sync.test.ts`.
- [x] 1.2 Deliver owner-safe reveal behavior by `Keep owner and winning-proof access to real concealed tiles`, so the human owner and winner proof path still use true concealed-kong tiles where allowed; verify with `tests/ui/game-table-view.test.ts` and `tests/ui/round-result-sync.test.ts`.

## 2. AI context privacy

- [x] 2.1 Deliver `Concealed kong privacy in AI runtime context` by `Mask concealed kong inputs before AI decision context leaves the store boundary`, so non-owning AI contexts no longer receive another seat's concealed-kong tile identities; verify with `tests/core/ai-decision-core.test.ts` and `tests/ui/game-session.store.test.ts`.
- [x] 2.2 Deliver artifact integrity for this privacy change by validating the change package after proposal, specs, design, and tasks are in place; verify with `spectra validate --changes "taiwan-mahjong-concealed-kong-visibility"`.
