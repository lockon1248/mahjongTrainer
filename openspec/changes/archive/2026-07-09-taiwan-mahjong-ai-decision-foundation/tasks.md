## 1. Drive AI only from legal state snapshots instead of letting it inspect hidden workflow internals

- [x] 1.1 實作 `AI-safe round state consumption` 的 AI 可讀 decision context，讓 AI 能從 round flow 取得當前 seat、手牌、triggering discard 與 legal action candidates 而不直接操控 workflow internals，並以對應 core 測試與 `npm run typecheck` 驗證。
- [x] 1.2 建立 `mahjong-ai-decision-core` 的 decision input / output 型別，讓 discard decision 與 claim decision 共享穩定 contract，並以 AI export / shape 測試與 `npm run typecheck` 驗證。

## 2. Use deterministic heuristics before introducing expensive search

- [x] 2.1 實作 `AI discard decision` 的 baseline discard heuristic，讓 AI 在自己回合能從合法 concealed tiles 中選出一張可打牌，並以新增的 AI discard 測試與 `npm test -- --run tests/core` 驗證。
- [x] 2.2 實作 `AI heuristic claim decision` 的非胡牌 deterministic heuristic，讓 AI 在 `chi`、`pon`、`kan-exposed`、`pass` 之間做可測試的穩定選擇，並以 claim heuristic 測試驗證。

## 3. Separate discard scoring from claim scoring

- [x] 3.1 實作 `AI win-first claim decision`，讓 legal claims 中一旦存在 `win` 時 AI 必定優先選胡，並以 win-over-pon 的 AI claim 測試驗證。
- [x] 3.2 將 discard scoring 與 claim scoring evaluator 分離，讓出牌與宣告各自輸出可測 reasoning markers / score summary，並以 evaluator 單元測試與 `npm run typecheck` 驗證。

## 4. Keep unresolved rule handling conservative

- [x] 4.1 實作 `Conservative unresolved-rule handling`，讓 AI 在依賴未定案桌規時忽略該 bonus / penalty 而不是自創假設，並以 unresolved rule AI 測試驗證。
- [x] 4.2 執行整體驗證，確認 `AI discard decision`、`AI win-first claim decision`、`AI heuristic claim decision`、`Conservative unresolved-rule handling` 與 `AI-safe round state consumption` 的新舊 spec 可協同運作，並以 `npm test -- --run tests/core`、`npm run typecheck` 與 `spectra analyze taiwan-mahjong-ai-decision-foundation --json` 驗證。
