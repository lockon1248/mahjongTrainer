## Context

目前 store 只管理單局 `BaselineRoundState`，且結果摘要也只覆蓋單局和牌 / 流局。籌碼欄位雖存在於 player state，但 UI 明確避免把它當成真實產品資訊顯示，因為沒有任何整場規則驅動。使用者現在要求加入真正的開局設定與整場勝負條件，這代表需要一層 match session state 來承接多局累積資訊。

這份 change 同時會碰到：
- 開局前 modal gating
- 單局結果到整場籌碼結算
- 四風圈進度與整場終局判定

因此需要新的 match-level capability，而不是硬塞回單局 round model。

## Goals / Non-Goals

**Goals:**

- 在牌局開始前顯示設定彈窗，讓使用者輸入初始籌碼與選擇勝利條件。
- 以固定 `底 30 / 台 10` 將單局 `totalTai` 轉成整場籌碼增減。
- 支援兩種整場終局：
  - 任一家籌碼 `<= 0` 立即結束，由籌碼最多者獲勝
  - 打滿四風圈後總結算，由籌碼最多者獲勝
- 保持現有 Vue / Pinia 架構，不引入外部 UI 套件庫。

**Non-Goals:**

- 不在本 change 內擴充額外房規，如包牌、拉莊、查聽或封頂。
- 不重寫 core 單局 scoring catalog；本 change 只消費既有 `totalTai` 結果。
- 不在本 change 內加入網路同步、多人房或持久化設定。

## Decisions

### Add an explicit match-session state above round state

整場籌碼、設定與勝負條件 SHALL 由 store 中新的 match-session state 管理，而不是直接濫用 `round.players[*].score` 當成唯一來源。這能避免 round reset 時丟失累積資訊，也讓 UI truthfulness 有清楚來源。

替代方案是把籌碼直接寫回 core round player score，再在下一局複製。這會讓單局 domain model 混進 match lifecycle，邊界過差，因此不採用。

### Gate the first round behind a native project modal

開局時 SHALL 先顯示自製 Vue modal，只有完成設定後才初始化第一局。這個 modal 使用現有樣式語言實作，不引入外部 UI library。

替代方案是直接用 `prompt()` 或外部 modal 套件。前者不符合產品 UI，後者增加不必要依賴與樣式整合成本，因此不採用。

### Resolve chips from round result using fixed base and tai multiplier

整場籌碼結算 SHALL 使用固定公式，將單局和牌結果轉成籌碼變化，且由 match-session 在單局結束後套用。`底 = 30`、`台數 = 10` 作為本 change 內的權威設定。

替代方案是把籌碼公式塞回 scoring core。scoring core 的責任是產出 `totalTai` 與 `scoringItems`，不是管理整場籌碼，因此不採用。

### Track four prevailing-wind rounds at the match boundary

「打滿四風圈」 SHALL 在 match-session 層判定，而不是由單局 round-flow 自己直接結束整場。match-session 需要根據每次下一局建立前的 `dealerSeat` / `prevailingWind` progression 決定是否完成整場。

替代方案是只看局數計數。這會錯過實際風圈推進語意，因此不採用。

## Implementation Contract

- Behavior:
  - Before the first round starts, the user SHALL see a setup modal that requires an initial chip amount and a victory condition choice.
  - After each completed winning round, match chips SHALL update from the round `totalTai` using fixed `base = 30` and `taiValue = 10`.
  - If the selected victory mode is bankruptcy, the match SHALL end immediately when any seat has chips `<= 0`, and the seat with the highest chip total SHALL be declared match winner.
  - If the selected victory mode is four prevailing-wind rounds, the match SHALL continue until the full east/south/west/north prevailing-wind cycle completes, then declare the chip leader as match winner.
- Interface / data shape:
  - The store will expose match setup state, active match config, chip totals, match completion status, and match winner summary separately from round state.
  - The table snapshot / UI view model will include match-level fields required to render setup and real chip status.
- Failure modes:
  - The game SHALL NOT auto-start a round before setup is submitted.
  - UI chip labels SHALL NOT render placeholder values before match state exists.
- Acceptance criteria:
  - UI tests prove the setup modal blocks round start until configured.
  - Store tests prove chip totals update after a win and that both victory conditions terminate at the correct boundary.
  - `spectra validate --changes "taiwan-mahjong-match-stakes-and-victory-setup"` passes.
- Scope boundaries:
  - In scope: local setup modal, match config, chip settlement, match winner summary, four-wind loop tracking.
  - Out of scope: remote persistence, extra betting rules, alternate payment formulas, external component libraries.

## Risks / Trade-offs

- [Risk] Four-wind completion logic may drift from dealer progression semantics. → Mitigation: derive match progression from actual round dealer / prevailing-wind state instead of a separate guessed counter.
- [Risk] Match state may duplicate some round summary data. → Mitigation: keep match state minimal and derive display data in selectors.
