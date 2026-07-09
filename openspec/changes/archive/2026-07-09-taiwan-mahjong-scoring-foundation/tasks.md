## 1. Schema 與 scoring 入口

- [x] 1.1 擴充 `RuleCaseExpected` 與相關匯出，讓「Extend rule-case schema only when scoring tests need it」決策成立，並可表達 Standard win validation contract 所需的 `isWinning`、matched pattern identifiers 與 settlement summary fields，完成後以 `npm test -- --run tests/core/rule-case-schema.test.ts` 驗證。
- [x] 1.2 建立 `src/core/scoring` 入口，使「標準手牌拆解」與「結算輸出契約」所需的命名匯出可從 `src/core/index.ts` 取得，並維持 Standard hand decomposition as the canonical winning breakdown 與 Settlement output contract 的入口邊界，完成後以 `npm run typecheck` 驗證。

## 2. 標準手牌拆解與胡牌判定

- [x] 2.1 實作「標準手牌拆解」與 Standard hand decomposition as the canonical winning breakdown，讓 baseline 五組面子加一組將眼的手牌能產生穩定拆解結果，完成後以新增的 `tests/core/scoring-hand-decomposition.test.ts` 覆蓋 `WIN-STANDARD-001` 驗證。
- [x] 2.2 實作「標準胡牌判定」與 Separate win validation from scoring pattern evaluation，讓 Standard win validation 在 pattern matching 前就能正確回傳暗手與副露手的胡牌結果，完成後以 `npm test -- --run tests/core/scoring-win-validation.test.ts` 驗證 `WIN-STANDARD-001` 與 `WIN-MELD-001`。
- [x] 2.3 實作「標準胡牌判定」的失敗路徑，讓非標準結構手牌回傳 `isWinning = false` 且不偽造 breakdown，完成後以 `tests/core/scoring-win-validation.test.ts` 中的非胡牌案例驗證。

## 3. 台型比對介面與結算輸出

- [x] 3.1 實作「台型比對介面」與 Scoring pattern evaluation interface，讓已支援的 baseline 台型回傳穩定 pattern identifiers，且未定案規則對應的 patterns 會被省略，完成後以 `npm test -- --run tests/core/scoring-patterns.test.ts` 驗證。
- [x] 3.2 實作「結算輸出契約」與 Keep settlement output explicit about payment responsibility，讓 Settlement output contract 將 winner、discarder、payment responsibility、scoring items 與 `totalTai` 明確分離，完成後以 `npm test -- --run tests/core/scoring-settlement.test.ts` 驗證。
- [x] 3.3 補上 `SCORE-STACK-001` 的 core test，證明「結算輸出契約」中的 settlement output 會從 scoring core 推導 matched scoring items 與 payment responsibility，而不是 UI 邏輯，完成後以 `npm test -- --run tests/core/scoring-settlement.test.ts` 驗證。

## 4. 整體驗證

- [x] 4.1 執行 `npm test -- --run tests/core`，驗證 Standard hand decomposition、Standard win validation、Scoring pattern evaluation interface 與 Settlement output contract 能在 scoring foundation 中協同運作。
- [x] 4.2 執行 `npm run typecheck`，驗證新的 scoring foundation 匯出與 schema 調整對下游 core 使用仍維持型別安全。
