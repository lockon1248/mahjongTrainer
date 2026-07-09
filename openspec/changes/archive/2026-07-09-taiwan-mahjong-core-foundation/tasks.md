# 任務：台灣 16 張麻將核心基礎

## 任務 1：建立 rules baseline 骨架

- [x] 建立 `openspec/specs/taiwan-mahjong-rules-baseline.md`
- [x] 建立 `tests/docs/rules-baseline-structure.test.ts`
- [x] 驗證必要章節存在：基本桌規、合法動作規則、胡牌成立條件、台型清單、結算規則、待確認／爭議規則、測試案例對照
- [x] 執行 `npm test -- --run tests/docs/rules-baseline-structure.test.ts`

## 任務 2：補齊 rules baseline 內容

- [x] 補齊基本桌規、合法動作規則、宣告優先序、自摸與放槍結算說明
- [x] 合法動作規則至少涵蓋：摸、打、吃、碰、明槓、暗槓、加槓、胡、過
- [x] 建立待確認／爭議規則表格
- [x] 建立 `tests/docs/rules-baseline-content.test.ts`
- [x] 執行 `npm test -- --run tests/docs/rules-baseline-content.test.ts`

## 任務 3：建立規則測試矩陣

- [x] 建立 `openspec/specs/taiwan-mahjong-rule-test-matrix.md`
- [x] 建立案例分類：一般胡牌、副露胡牌、補花、連續補花、宣告優先序、流局、台型組合
- [x] 建立至少以下案例 ID：`WIN-STANDARD-001`、`WIN-MELD-001`、`FLOWER-REPLACE-001`、`FLOWER-CHAIN-001`、`CLAIM-PRIORITY-001`、`DRAW-DEALER-001`、`SCORE-STACK-001`
- [x] 擴充文件測試以驗證測試矩陣
- [x] 執行文件測試

## 任務 4：建立 core domain model

- [x] 新增 `src/core/types/seat.ts`、`tile.ts`、`player.ts`、`action.ts`、`table.ts`、`result.ts`、`index.ts`
- [x] 新增 `tests/core/domain-model.test.ts`
- [x] 驗證：`ALL_SEATS === ['east', 'south', 'west', 'north']`、`createEmptyPlayerState('east')` 回傳空玩家狀態、`createInitialTableState()` 預設莊家與圈風為 `east`、`isFlowerTile()` 正確判斷花牌、`createPendingActionWindow()` 具有穩定預設形狀
- [x] 執行 `npm test -- --run tests/core/domain-model.test.ts`

## 任務 5：建立 rule-case schema

- [x] 新增 `src/core/testing/ruleCase.ts`
- [x] 定義 `RuleCaseCategory`、`RuleCaseExpected`、`RuleCase`、`createRuleCase`
- [x] 新增 `tests/core/rule-case-schema.test.ts`
- [x] 驗證預設值：`category`、`concealedTiles = []`、`melds = []`、`flowers = []`、`winningTile = null`，以及 `expected` 可覆寫
- [x] 執行 `npm test -- --run tests/core/rule-case-schema.test.ts`

## 任務 6：建立 Vue scaffold 邊界決策文件

- [x] 建立 `openspec/changes/taiwan-mahjong-core-foundation/vue-scaffold-boundary.md`
- [x] 記錄：先做哪些內容、明確延後哪些內容、何時才啟動 Vue scaffold、啟動後第一批允許內容
- [x] 建立 `tests/docs/scaffold-boundary.test.ts`
- [x] 執行 `npm test -- --run tests/docs/scaffold-boundary.test.ts`

## 任務 7：統一驗證

- [x] 執行本次新增的文件測試與核心測試
- [x] 執行 `npm run typecheck`
