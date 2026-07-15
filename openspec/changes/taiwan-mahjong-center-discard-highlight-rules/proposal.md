## Why

目前中央牌池只會把各家最後一張捨牌做同一種高亮，無法區分「下家可吃的上一手最後一張」、「可碰或明槓的插隊宣告」，以及「可放槍胡牌」這三種不同決策訊號；同時，當 AI 和牌時，畫面也尚未亮出它的實際胡牌手牌作為證明。對台灣麻將練習器來說，這會讓玩家在 `claim-window` 與終局判讀時都缺少足夠資訊。

## What Changes

- 重新定義中央牌池的高亮語意，將白色、紅色、黃色分別對應到吃牌判讀、碰／明槓插隊判讀與放槍胡牌判讀。
- 明確限制白色高亮只可作用於目前出牌者的最後一張捨牌，避免整池最後牌都被誤判為可吃目標。
- 允許同一張捨牌在同一個 `claim-window` 同時呈現紅色與黃色高亮，支援玩家保留做大牌或立即胡牌的判讀空間。
- 當 AI 以自摸或榮和結束牌局時，結果畫面必須亮出其實際手牌與副露，讓玩家可直接檢視它是如何成立和牌。
- 補齊對應的 Vue UI 與 browser / unit 測試契約，確保高亮完全由既有 snapshot 與合法宣告候選驅動。

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `mahjong-vue-table-shell`: 中央牌池在 `claim-window` 的捨牌高亮規則需改為白 / 紅 / 黃三種語意且允許紅黃共存，並在 AI 和牌終局時亮出其手牌證明。

## Impact

- Affected specs: `mahjong-vue-table-shell`
- Affected code:
  - Modified: `src/views/game/components/GameTableView.vue`, `src/views/game/types.ts`, `src/views/game/selectors.ts`, `src/core/types/result.ts`, `tests/ui/human-claim-window.test.ts`, `tests/ui/game-table-layout.test.ts`, `tests/ui/round-result-sync.test.ts`, `e2e/game-table.smoke.spec.ts`
  - New: none
  - Removed: none
