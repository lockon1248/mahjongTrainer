## 1. Separate round setup from per-turn actions

- [x] 1.1 實作 `Baseline round setup` 的 round setup 入口，讓新局初始化後可觀察到 east 起手 17 張、其餘三家 16 張且 east 先出，並以 `tests/core` 的 round setup 測試與 `npm test -- --run tests/core` 驗證。
- [x] 1.2 實作 `Turn progression for draw and discard` 的正常摸打一輪轉換，讓無人宣告時出牌後能穩定切到下一家正常摸牌，並以對應的 turn progression 測試與 `npm run typecheck` 驗證。
- [x] 1.3 補齊 round result / action state 型別，讓正常進行中、胡牌終局與流局終局可被明確區分而不依賴 UI 推斷，並以 `tests/core` 的 flow outcome 測試與 `npm run typecheck` 驗證。

## 2. Model flower replacement as a deterministic draw pipeline

- [x] 2.1 實作 `Flower replacement pipeline` 的起手補花流程，讓玩家起手摸到花時會立即亮花並從牌尾補到手牌張數恢復正確，並以 `FLOWER-REPLACE-001` 測試驗證。
- [x] 2.2 實作 `Flower replacement pipeline` 的連續補花流程，讓尾端補牌若再次摸到花仍會持續補到非花牌為止，並以 `FLOWER-CHAIN-001` 測試驗證。
- [x] 2.3 實作摸牌路徑共用同一套補花 pipeline，讓回合中摸到花牌時與起手補花遵循同一 contract，並以新增的 draw-flower core 測試與 `npm test -- --run tests/core` 驗證。

## 3. Resolve claims through an explicit pending claim window

- [x] 3.1 實作 `Claim window resolution` 的 pending claim window 蒐集與驗證入口，讓同一張 discard 的候選宣告能集中進入單一 resolution step，並以 claim window schema/core 測試與 `npm run typecheck` 驗證。
- [x] 3.2 實作 `Claim window resolution` 的 baseline 優先序 `win > kan-exposed > pon > chi`，讓多人同時宣告時會選出唯一最終結果，並以 `CLAIM-PRIORITY-001` 測試驗證。
- [x] 3.3 串接 claim resolution 與 `Turn progression for draw and discard`，讓全員 pass 時 round flow 會回到下一家的正常摸牌而非卡在待處理狀態，並以對應 core 測試與 `npm test -- --run tests/core` 驗證。

## 4. Keep exhaustive draw result separate from dealer progression rules

- [x] 4.1 實作 `Exhaustive draw outcome` 判定，讓牌牆無法再進行正常摸牌且尚未有人胡牌時會回傳明確流局結果，並以 `DRAW-DEALER-001` 測試驗證。
- [x] 4.2 實作 `Exhaustive draw outcome` 的未定案規則隔離，讓流局結果不會自動夾帶連莊、查聽或 ready-hand penalty 結論，並以流局結果 shape 測試與內容斷言驗證。
- [x] 4.3 執行整體 round flow 驗證，確認 `Baseline round setup`、`Flower replacement pipeline`、`Turn progression for draw and discard`、`Claim window resolution` 與 `Exhaustive draw outcome` 可在同一批 core 測試中協同運作，並以 `npm test -- --run tests/core` 與 `npm run typecheck` 驗證。
