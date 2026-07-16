## 1. Match setup validation feedback

- [x] 1.1 Deliver `Match setup modal explains why chips below 100 are blocked` by `Keep the validation feedback inside the existing setup modal` and `Clear the message as soon as the input becomes valid`, so the user knows why the match cannot start without stale error text; verify with `tests/ui/match-setup-modal.test.ts`.
- [x] 1.2 Deliver artifact integrity for this validation feedback change; verify with `spectra validate --changes "taiwan-mahjong-match-setup-validation-feedback"`.
