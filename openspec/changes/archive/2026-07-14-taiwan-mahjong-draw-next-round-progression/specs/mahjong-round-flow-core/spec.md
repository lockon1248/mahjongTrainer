## MODIFIED Requirements

### Requirement: 流局結果

當牌牆已無法再支援下一次一般摸牌且尚無玩家胡牌時，round flow core SHALL 產生明確的流局結果，並 SHALL 透過 rule config policy 表示未定案的流局後分支，而不是自行發明最終商業結果。

#### 情境：流局後可建立下一局且原莊家續莊

- **WHEN** 一局已以流局 outcome 結束，且呼叫端要求建立下一局
- **THEN** round flow core SHALL 允許建立新的基礎牌局，且新的 `dealerSeat` MUST 維持上一局莊家

##### 範例：DRAW-DEALER-CONTINUE-001

- **GIVEN** 一局已結束，`outcome.status` 為 `draw`，且上一局 `dealerSeat` 為 `east`
- **WHEN** 呼叫端以新牌牆建立下一局
- **THEN** 新局的 `dealerSeat` MUST 為 `east`，`currentSeat` MUST 為 `east`，且 phase MUST 回到 `discard`

#### 情境：流局續局不得視為已解決所有流局後商業規則

- **WHEN** 一局以流局結束並建立下一局
- **THEN** round flow core SHALL NOT 因此推導查聽、流局罰則或其他未定案商業結果

##### 範例：DRAW-POST-DRAW-PENDING-001

- **GIVEN** 一個流局 outcome 所依據的 rule config 中，流局後 policy 仍為未定案
- **WHEN** 呼叫端建立下一局
- **THEN** core 只可建立下一局與保留原 rule config，不得額外補出查聽或結算結果
