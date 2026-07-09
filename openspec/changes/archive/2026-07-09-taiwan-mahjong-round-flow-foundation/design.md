## Context

目前專案已完成 `rules baseline`、`rule test matrix`、`core domain model` 與 `scoring foundation`，但 `src/core` 仍缺少真正驅動單局流程的規則核心。現況只有型別與 scoring 能力，還沒有一套可重用的 round flow contract 去處理起手發牌、補花、回合摸打、宣告窗口與牌摸完流局。

同時，baseline 已明確要求多項規則不得寫死，例如流局查聽、流局後是否連莊、搶槓、過水與一炮多響。這代表本次 round flow foundation 只能實作已確認的流程骨架，把未定案分支保留在 config / future spec 邊界外。

## Goals / Non-Goals

**Goals:**

- 建立 round flow core 的可測邊界，讓單局能從起手發牌進入穩定的摸打循環。
- 讓補花與連續補花邏輯成為 round setup 與 draw action 的正式一部分，而不是外掛在 UI 或 store。
- 建立多人宣告時的統一解決入口，先支援 baseline 的 `胡 > 槓 > 碰 > 吃` 優先序。
- 讓流局結果在 core 層被明確表達，且不偷補未定案的查聽或連莊處理。

**Non-Goals:**

- 不實作 AI 決策、牌效評估或自動出牌策略。
- 不在本 change 中決定流局連莊、查聽、搶槓、過水或一炮多響。
- 不實作 Vue UI、Pinia store orchestration 或動畫節奏。
- 不在本 change 中補完整台型、特殊胡、花牌計分或最低台數。

## Decisions

### Separate round setup from per-turn actions

起手發牌與補花是單局初始化流程，摸打與宣告則是回合內重複流程。這次設計將 round setup 與 per-turn actions 切成兩段，以避免 store 必須同時管理「未開局」與「進行中回合」的雜湊狀態。替代方案是只暴露一個超大 `applyAction()` 入口，從 `start-game` 一路處理到流局；但那會讓初始化、副作用與錯誤模式難以測試。

### Model flower replacement as a deterministic draw pipeline

補花不應是額外的 UI 動作，而是 draw pipeline 的一部分：摸到花立即亮出、從牌尾補牌、補到花則持續遞迴直到取得非花牌。這樣可同時覆蓋起手補花與回合中摸花兩種情境。替代方案是讓 caller 多次手動呼叫補牌函式，但那會把 baseline 已確認的流程責任外漏。

### Resolve claims through an explicit pending claim window

吃碰槓胡的競爭不應直接由出牌者或下一位玩家分散判斷，而應透過單一 pending claim window 收集候選宣告，再由 resolution step 依優先序選出結果。這能讓 `胡 > 槓 > 碰 > 吃` 被集中驗證，也為未來 config 化優先序保留位置。替代方案是由每個 seat 直接搶同一張牌，但那會讓狀態更新順序不穩定。

### Keep exhaustive draw result separate from dealer progression rules

baseline 只明確定義「牌摸完仍無人胡牌即流局」，但沒有正式定義流局後是否查聽或連莊。因此 round flow foundation 只回傳 exhaustive draw result 與相關 context，不在此時決定下一局莊家、聽牌獎懲或額外 settlement。替代方案是一起做完流局後處理，但那會直接把未定案桌規寫死。

## Implementation Contract

**Behavior**

- round flow core 必須能建立一個 baseline 開局結果，完成 4 人起手發牌、莊家 17 張、閒家 16 張，以及必要的起手補花。
- 當玩家摸牌時，若摸到花牌，系統必須自動亮花並從牌尾持續補牌直到取得非花牌。
- 當進行打牌後宣告處理時，系統必須能收集多家宣告並依 baseline 優先序解決為單一結果或全體 pass。
- 當牌牆已不足以繼續摸牌且無人胡牌時，系統必須回傳明確的流局結果，而不是留給 caller 自行推斷。

**Interface / data shape**

- `src/core/rules/` 需提供 round setup、draw/discard transition、claim window resolution 與 exhaustive draw evaluation 的明確匯出入口。
- round setup result 至少需包含：玩家手牌、亮出花牌、牌牆剩餘狀態、當前輪到誰、是否存在待處理動作。
- claim resolution result 至少需包含：winning claim / kong claim / pong claim / chi claim / pass 的最終類型、採納 seat、來源 discard tile。
- draw result 或 round result 至少需區分：正常進行中、胡牌終局、流局終局，且流局結果不得夾帶未定案的查聽或連莊結論。
- `RuleCase` 若需擴充，只能加入本 change 的流程測試會直接驗證的欄位，例如 claim resolution、flower replacement 或 round outcome summary。

**Failure modes**

- 發牌或補花過程若無法取得足夠牌張，系統必須回傳明確失敗，而不是產生張數錯亂的半成品局面。
- 若 claim window 中出現不合法宣告，系統不得默默採納，必須將其排除或回傳 invalid resolution 結果。
- 若牌牆已耗盡，系統不得再允許新的 normal draw transition。
- 未定案規則相關結果不得被偽造，例如不可在流局結果中自動寫入連莊或查聽結論。

**Acceptance criteria**

- `tests/core` 至少新增並通過 `FLOWER-REPLACE-001`、`FLOWER-CHAIN-001`、`CLAIM-PRIORITY-001`、`DRAW-DEALER-001` 對應測試。
- round setup 與 flow 測試需能驗證莊家 / 閒家起手張數與補花後手牌仍維持正確數量。
- `npm test -- --run tests/core` 必須通過。
- `npm run typecheck` 必須通過。

**Scope boundaries**

- In scope: 起手發牌、起手補花、回合摸打轉換、摸花補牌、宣告窗口收集與優先序解決、牌牆耗盡流局訊號、必要型別與 rule-case 測試欄位調整。
- Out of scope: 流局查聽、流局連莊、搶槓、過水、一炮多響、AI 決策、Vue UI、持久化、完整對局結算。

## Risks / Trade-offs

- [Risk] round setup 與 per-turn flow 若拆得太細，後續 store 串接可能顯得繁瑣。 → Mitigation: 維持少數明確入口，避免把 UI orchestration 推回 core 外。
- [Risk] 補花流程若只處理起手情境，回合中摸花會產生第二套邏輯。 → Mitigation: 將補花建模為通用 draw pipeline。
- [Risk] claim window 若一次納入未定案規則，spec 會過早硬化。 → Mitigation: 本 change 僅接受 baseline 已確認的吃碰槓胡過與既定優先序。
- [Risk] 流局結果若混入後續莊家處理，容易與未定案桌規綁死。 → Mitigation: 將 exhaustive draw outcome 與 dealer progression 明確分離。
