## 1. Core round-flow repair

- [x] 1.1 Deliver `需求：宣告視窗裁決` by `Reuse the existing tail replacement pipeline for exposed kan`, making accepted `kan-exposed` claims return to `discard` only after a wall-tail replacement tile is resolved; verify with `tests/core/round-flow-claims.test.ts` covering replacement tile consumption and legal concealed-tile count.
- [x] 1.2 Deliver flower-chain parity by `Keep claim resolution atomic around the accepted exposed kan`, so a flower drawn from the wall tail is revealed and the draw continues until a non-flower tile enters concealed tiles; verify with a regression in `tests/core/round-flow-claims.test.ts`.

## 2. Workflow and regression closure

- [x] 2.1 Deliver updated workflow truth by keeping this child change mapped as the current active bugfix on the mainline board; verify by content review of `openspec/changes/taiwan-mahjong-mainline-progress-board-current/design.md` and `tasks.md`.
- [x] 2.2 Deliver artifact integrity by `Protect the fix at the claim-resolution harness layer`, verifying the change package and core regression path after proposal/design/spec/tasks are in place; verify with `spectra validate --changes "taiwan-mahjong-exposed-kan-replacement-draw-fix"` and `tests/core/round-flow-claims.test.ts`.
