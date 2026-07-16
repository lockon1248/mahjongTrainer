## 1. Match setup flow

- [x] 1.1 Deliver `Match setup modal uses real session state` by `Gate the first round behind a native project modal`, so the first round cannot start until the user submits initial chips and a victory condition; verify with `tests/ui/match-setup-modal.test.ts` and `tests/ui/game-session.store.test.ts`.
- [x] 1.2 Deliver `Match setup gates the first round` and `Table shell renders real match chip status` by `Add an explicit match-session state above round state`, so the store keeps match config separate from round state and no placeholder chips render before setup; verify with `tests/ui/game-session.store.test.ts` and `tests/ui/game-table-view.test.ts`.

## 2. Match settlement and completion

- [x] 2.1 Deliver `Match chips settle from round tai results` by `Resolve chips from round result using fixed base and tai multiplier`, so completed wins update match chips from `base = 30` and `taiValue = 10`; verify with `tests/ui/game-session.store.test.ts`.
- [x] 2.2 Deliver `Bankruptcy victory ends the match immediately` and `Four prevailing-wind rounds victory waits for full match completion` by `Track four prevailing-wind rounds at the match boundary`, so the selected victory mode ends the match at the correct time and declares the chip leader; verify with `tests/ui/game-session.store.test.ts` and `tests/ui/next-round-flow.test.ts`.
- [x] 2.3 Deliver artifact integrity for this match setup change after proposal, specs, design, and tasks are in place; verify with `spectra validate --changes "taiwan-mahjong-match-stakes-and-victory-setup"`.
