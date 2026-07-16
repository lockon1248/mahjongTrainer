## MODIFIED Requirements

### Requirement: 需求：宣告視窗裁決

round flow core SHALL 透過單一 pending claim window 來裁決互相競爭的宣告候選，且 SHALL 從 rule config 推導有效的宣告優先序，而不是假設一個固定常數。

#### Scenario: 胡牌宣告優先於較低優先級宣告

- **WHEN** 多個座位對同一張捨牌提出宣告，且有效 rule config 將胡牌宣告排在其他合法宣告之前
- **THEN** round flow core SHALL 將該 claim window 裁決為胡牌宣告，而不是明槓、碰或吃

##### Example: CLAIM-PRIORITY-001 胡牌優先於碰牌

- **GIVEN** 一張捨牌同時讓 north 可以胡牌，south 可以碰牌
- **WHEN** 兩個宣告都在優先序為 `win > kan-exposed > pon > chi` 的同一 pending claim window 中送出
- **THEN** 裁決結果 MUST 為 north 的胡牌宣告

#### Scenario: 沒有胡牌時明槓優先於碰與吃

- **WHEN** pending claim window 中沒有胡牌宣告，且有效 rule config 將明槓排在較低優先級宣告之前
- **THEN** round flow core SHALL 將該 claim window 裁決為明槓，並 SHALL 在回到出牌階段前完成槓後補牌

##### Example: exposed kan draws a replacement tile before discard resumes

- **GIVEN** 一張捨牌讓 west 可以形成明槓，south 可以吃牌，且牌尾存在可補入 west 暗手的非花牌
- **WHEN** 兩個宣告都被送出，且在優先序為 `win > kan-exposed > pon > chi` 的 rule config 下不存在任何有效胡牌宣告
- **THEN** 裁決結果 MUST 為 west 的明槓宣告，west MUST 先完成槓後補牌，並且 west 回到 `discard` 時 MUST 保有合法的活牌張數

#### Scenario: 明槓補牌遇到花牌時持續補到非花牌

- **WHEN** pending claim window 接受 `kan-exposed`，且牌尾第一張 replacement tile 是花牌
- **THEN** round flow core SHALL 先將該花牌移入玩家花牌區，並 SHALL 持續從牌尾補牌直到取得一張非花牌後才回到 `discard`

##### Example: exposed kan replacement chains through flower tiles

| Wall tail sequence | Expected result before discard resumes |
| ----- | ----- |
| `spring`, `5-dot` | `spring` revealed to flowers, `5-dot` added to concealed tiles |
| `plum`, `orchid`, `red-dragon` | both flowers revealed, `red-dragon` added to concealed tiles |

#### Scenario: 所有可宣告者皆 pass 時推進牌局

- **WHEN** pending claim window 關閉，且沒有任何被接受的宣告
- **THEN** round flow core SHALL 將此次出牌裁決為 pass，並以下一家的一般摸牌轉換繼續推進牌局

##### Example: 所有宣告皆 pass

- **GIVEN** 一張捨牌沒有任何被接受的吃、碰、槓或胡宣告
- **WHEN** claim window 關閉
- **THEN** 裁決結果 MUST 為 pass，且下一個依序座位 MUST 取得下一次一般摸牌機會
