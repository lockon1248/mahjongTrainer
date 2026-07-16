## 1. Match setup minimum chips guard

- [x] 1.1 Deliver `Match setup modal blocks chips below 100` by `Keep modal validation consistent with store validation`, so UI cannot start a match with unsafe chip counts; verify with `tests/ui/match-setup-modal.test.ts`.
- [ ] 1.2 Deliver `Match setup enforces minimum initial chips` by `Use one shared minimum at the store boundary`, so non-UI callers cannot bypass the same guard; verify with `tests/ui/game-session.store.test.ts`.
- [x] 1.3 Deliver artifact integrity for this minimum chips guard change; verify with `spectra validate --changes "taiwan-mahjong-match-setup-minimum-chips-guard"`.
