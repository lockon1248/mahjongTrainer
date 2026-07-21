## 1. Delivery regression

- [x] 1.1 以 `DELIVERY-001` 建立 RED，覆蓋 **Route-level application delivery**、**Development harness exclusion from production** 與 **Platform-managed transport compression**：`tests/smoke/frontend-delivery-policy.test.ts` 必須先因 route eager imports、`GameView.vue` static bridge import 與 production asset seed symbols 而以非零 exit code 失敗。

## 2. Module graph implementation

- [x] 2.1 依 **Route components use native dynamic imports** 將 `/` 與 `/game` 保持原路徑但改為 native dynamic imports，並依 **E2E bridge loads only in development** 讓 bridge 僅由 DEV async bootstrap 載入；同一 `DELIVERY-001` regression、`npm run typecheck` 與既有 router/component tests 必須 exit 0。

## 3. Production and browser closure

- [x] 3.1 依 **Production output is verified by symbols and chunks** 執行 `npm run build`，確認至少兩個 hashed JavaScript assets、所有 JS 不含兩個已知 seed symbols、dist 不含 `.gz`/`.br`；再以 Playwright 驗證首頁導航、`/game` 呈現與 dev E2E bridge journey，最後執行完整 `npm test`、`git diff --check` 與 Spectra strict validation，所有命令必須 exit 0。
