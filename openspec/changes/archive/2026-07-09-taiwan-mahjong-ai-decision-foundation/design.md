## Context

目前專案已完成 baseline 規則、scoring、round flow 與 rule config 核心，產品 spec 的 `階段 3` 只剩下 `中階 AI` 尚未落地。這代表系統已經具備讓 AI 消費合法局面與可配置規則的基礎，但還沒有一個正式的 AI 決策 contract 去驅動 3 位電腦玩家。

同時，產品目標只要求「中階，具基本牌效判斷與主動吃碰槓能力」，並未要求高階搜尋或最優解 AI。加上多項桌規仍未定案，例如特殊胡與部分後段結算規則，AI 不得擅自推導這些未定案規則，只能在已知 legal actions 與 config 範圍內做決策。

## Goals / Non-Goals

**Goals:**

- 建立 AI decision core，讓 AI 能在合法局面中選出一個可執行動作。
- 建立中階出牌 heuristic，優先維持手牌完成度、保留較有價值的搭子與已知台型前進機會。
- 建立 AI 對吃碰槓胡的決策入口，至少能做到「有胡先胡」、合理副露、可 pass。
- 讓 AI 僅透過 round flow / rule config 提供的資料做判斷，不自行定義規則。

**Non-Goals:**

- 不做深度搜尋、牌譜學習、Monte Carlo、期望值全表計算。
- 不在本 change 中建立 AI 動畫、思考延遲、UI 提示或玩家可視化說明。
- 不補完完整台型、特殊胡與所有未定案桌規。
- 不處理多人網路同步或任何後端能力。

## Decisions

### Drive AI only from legal state snapshots instead of letting it inspect hidden workflow internals

AI 應只讀取 round state、自己可見手牌、候選 legal actions 與 rule config，而不直接操作 workflow 內部狀態轉換。這樣 AI 的責任就只是「選擇」，不是「執行規則」。替代方案是讓 AI 直接調用低階規則函式探索局面，但那會讓 AI 和 round flow 強耦合。

### Use deterministic heuristics before introducing expensive search

目前產品只需要中階 AI，因此先採 deterministic heuristic：胡牌優先、可用副露優先級、手牌完成度分數、孤張與危險字牌的簡化處理。替代方案是直接做搜尋式 AI，但那會大幅增加實作、測試與調校成本，不符合目前階段目標。

### Separate discard scoring from claim scoring

出牌與宣告雖然都屬於 AI 決策，但評估維度不同：出牌要比較手牌前進性，宣告則要比較副露後的即時收益與是否破壞手牌。這次將兩者拆成不同 evaluator，再由統一入口包裝成 AI decision API。替代方案是單一巨型評分函式，但那會讓測試難以對焦。

### Keep unresolved rule handling conservative

若某個 AI 決策會依賴未定案規則，AI 必須選擇保守行為：只在已知 legal actions 中比較，不對未定案台型或未定案後續得失做額外加權。替代方案是替 unresolved rules 設臨時分數，但那會偷渡桌規假設。

## Implementation Contract

**Behavior**

- AI decision core 必須能在自己的回合為 concealed hand 選出一張 discard tile。
- AI decision core 必須能在 claim window 候選動作中選出 `win`、`kan-exposed`、`pon`、`chi` 或 `pass` 其中之一。
- 若 legal actions 中存在可胡選項，AI 必須優先回傳胡牌決策。
- AI 對未定案規則不得自行補出固定偏好，只能根據已知 legal actions、baseline heuristic 與 rule config 做決策。

**Interface / data shape**

- `src/core/ai/` 需提供 AI discard decision、claim decision、heuristic scoring 與必要型別匯出。
- discard decision input 至少需包含：seat、concealedTiles、melds、flowers、visible round state、rule config。
- claim decision input 至少需包含：candidate claims、current hand context、triggering discard、rule config。
- decision output 至少需包含：chosen action type、selected tile 或 claim、以及可測試的 reasoning markers / score summary。

**Failure modes**

- 若 AI 收到空的 legal action 集合，必須回傳明確錯誤或 null decision，而不是偽造動作。
- 若候選動作包含 AI 無法理解的未支援 action type，AI 不得默默選它。
- 若某個 heuristic 需要未定案規則內容，AI 必須忽略該額外加權而不是 inventing hidden assumptions。

**Acceptance criteria**

- `tests/core` 至少新增出牌決策、胡牌優先、合理副露、保守 pass 的 AI 測試。
- `npm test -- --run tests/core` 必須通過。
- `npm run typecheck` 必須通過。
- `spectra analyze taiwan-mahjong-ai-decision-foundation --json` 必須通過。

**Scope boundaries**

- In scope: discard heuristic、claim heuristic、AI decision API、必要 round state consumption 邊界、core tests。
- Out of scope: 高階搜尋、UI 動畫、玩家提示、線上同步、完整 EV 模型。

## Risks / Trade-offs

- [Risk] heuristic 太簡單會顯得 AI 呆板。 → Mitigation: 先確保行為穩定可測，再逐步增加局部牌效規則。
- [Risk] heuristic 若太多又會變成半套搜尋。 → Mitigation: 限制為 deterministic scoring，避免擴張成全局模擬。
- [Risk] AI 若直接依賴未定案規則，後續很難修正。 → Mitigation: unresolved rules 一律採保守處理，不加隱藏權重。
