## 1. 型別回歸

- [x] 1.1 以 `E2E-TYPE-001` 為 **Compiler-checked browser test bridge** 建立 RED：契約測試必須偵測 `e2e/game-table.smoke.spec.ts` 仍含 required Window intersection assertions、`src/env.d.ts` 未引用共享 contract、`tsconfig.json` 未涵蓋 `e2e/**/*.ts`；執行 `npm test -- tests/docs/e2e-window-typing.test.ts` 必須先以非零 exit 證明警告來源仍存在。

## 2. 單一型別來源與驗證

- [x] 2.1 匯出唯一 `GameE2EBridge` contract、讓 Window augmentation 與 Playwright helper 共用該 contract，並把 E2E 納入正式 TypeScript project；`npm test -- tests/docs/e2e-window-typing.test.ts`、`npm run typecheck` 與受影響 Playwright journeys 必須 exit 0，且 E2E 檔案不得保留 `window as Window &` 或 `as unknown` 規避診斷。

## 3. Vue 瀏覽器計時器型別

- [x] 3.1 以 `E2E-TYPE-002` 覆蓋 **Browser timer state is checked with Node ambient types present**：先讓契約測試因 `GameView.vue` 使用 `ReturnType<typeof window.setTimeout>` 而 RED，再將瀏覽器 timer handle 固定為 `number | null`；`npm test -- tests/docs/e2e-window-typing.test.ts`、`npm run typecheck` 與 `git diff --check` 必須 exit 0，且不得改變自動推進行為。
