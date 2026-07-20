## Why

目前結算狀態增加多列摘要後會拉高固定舞台，桌機版因此觸發整體等比縮放，使牌桌、牌面文字與操作內容過小，並重新產生大量左右留白。使用者已確認要精簡資訊列、將和牌臺型移至舞台外彈窗，並讓桌機牌桌維持可讀尺寸。

## What Changes

- 將牌桌上方摘要收斂為單列，只保留局次、莊家、圈風、階段、剩餘牌牆與勝利條件。
- 移除目前操作、上次宣告、本局狀態／結果、總捨牌數、結算、是否結束等重複或不需要的畫面欄位。
- 將和牌結果收斂為和牌者、放槍者與總台數；流局結果僅保留流局原因，詳細結算統一移至彈窗。
- 和牌與流局後都自動開啟「本局結算」，由同一彈窗呈現結果、臺型（僅和牌）與四家籌碼分配。
- 彈窗脫離舞台縮放區；桌機版不再整體縮放牌桌，窄螢幕才保留安全縮放，並提高牌局文字與操作內容的可讀性。
- 新增元件與 browser E2E regression，鎖定欄位移除、彈窗互動、桌機無整體縮小／過量左右留白與既有續局流程。
- 修正寬但矮的桌機 viewport 不得因固定 `scale = 1` 與舞台裁切而讓真人手牌或操作列離開可視範圍，並以 `1489x658` 真實 viewport regression 保護。
- 當權威 match state 達成勝利條件時顯示全畫面整場結算，隱藏無效的「下一局」，並提供「重新開始」回到既有設定流程。
- 在 round-flow core 追蹤累加連莊次數，scoring core 以獨立「連莊 N 台」項目納入總台數；換莊歸零，莊家胡牌與流局續莊均累加。
- 放大真人手牌文字與點擊區，同時維持寬但矮 viewport 的完整可見性。
- 讓 `game-session` Pinia setup store 接管 Vite HMR，使開發中新增的 `resetMatch` action 能更新既存分頁的 store instance，不再出現新元件呼叫舊 store 的 runtime error。
- 將和牌與流局統一為自動開啟的「本局結算」彈窗：和牌顯示臺型，流局顯示原因，兩者都顯示四家本局增減與結算後籌碼；移除獨立臺型彈窗與「查看台型」。
- 終局結果先在牌桌保留 1.5 秒，再自動顯示「本局結算」，避免彈窗立即遮住和牌手牌或流局狀態。

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `mahjong-vue-table-shell`: 修改結算摘要、臺型明細互動與固定舞台在桌機／窄螢幕的縮放及可讀性要求。
- `mahjong-round-flow-core`: 新增權威連莊次數的累加、傳遞與換莊歸零規則。
- `mahjong-scoring-core`: 新增依連莊次數動態計台的結構化 scoring item。
- `mahjong-match-session`: 新增整場結束後重設至既有 match setup 的 session 行為。

## Impact

- Affected specs: `mahjong-vue-table-shell`
- Affected code:
  - Modified: `src/views/game/GameView.vue`
  - Modified: `src/views/game/components/GameTableView.vue`
  - Modified: `src/core/types/table.ts`
  - Modified: `src/core/rules/roundFlow.ts`
  - Modified: `src/core/scoring/types.ts`
  - Modified: `src/core/scoring/catalog.ts`
  - Modified: `src/core/scoring/patterns.ts`
  - Modified: `src/core/scoring/settlement.ts`
  - Modified: `src/stores/gameSession.ts`
  - Modified: `src/views/game/selectors.ts`
  - Modified: `src/views/game/types.ts`
  - Added: `tests/ui/game-session-hmr.test.ts`
  - Modified: `tests/ui/game-table-view.test.ts`
  - Modified: `tests/ui/round-result-sync.test.ts`
  - Modified: `e2e/game-table.smoke.spec.ts`
- No dependency additions or scoring-formula changes beyond the confirmed cumulative dealer-continuation tai and existing match payment formula.
