## Context

這次暴露出的問題不是單純 `聽牌` 兩個字，而是 UI 已經把一個沒有真實規則驅動的內部欄位包裝成產品資訊。這代表目前流程缺少一個明確的檢核步驟：每個畫面上的狀態、標籤、提示與可操作性文案，在上線前都必須回答「它是被哪一段規則或業務邏輯驅動」。

若做不到，就不應該顯示成產品資訊。

## Goals / Non-Goals

**Goals:**

- 建立 UI 狀態真實性檢核主線。
- 列出牌桌目前所有需規則驅動的 UI 狀態欄位。
- 將欄位分成：
  1. 已有真實規則來源
  2. 只有 placeholder / flag
  3. 規則未定案，必須隱藏或等待
- 要求後續修正必須附帶對應 UI / E2E 驗證。

**Non-Goals:**

- 不在這個 change 內一次完成所有規則演算法。
- 不替未定案桌規補猜結果。

## Decisions

### UI 欄位必須有可追溯的規則來源

任何出現在產品 UI 的狀態欄位，都必須可以往下追到：
1. core rule
2. scoring evaluation
3. store business decision
4. 明確定義的 UI-only state machine

若找不到來源，該欄位不得保留為產品資訊。

### Placeholder state 不得偽裝成產品狀態

像 `declaredReady` 這種若目前不是實際聽牌判定結果，就不能直接以 `聽牌` 顯示給玩家。

### 稽核必須形成清單，不可只靠人工印象修補

這次不能只修 `聽牌` 一欄，必須把整張牌桌上所有狀態型 UI 做一次系統盤點，避免同類問題分散重演。

### 驗證要同時保護存在性與語意正確性

未來的 UI 測試不能只驗「有沒有顯示」，還要驗：
1. 顯示值來自正確規則來源
2. 未驅動欄位不會假裝有意義

## Audit Matrix

| UI 欄位 | 目前來源 | 判定 | 處置 |
| --- | --- | --- | --- |
| 莊家 | `round.table.dealerSeat` | 已驅動 | 保留 |
| 圈風 | `round.table.prevailingWind` | 已驅動 | 保留 |
| 目前操作 / 剛出牌 | `round.currentSeat` + `round.phase` | 已驅動 | 保留 |
| 階段 | `round.phase` | 已驅動 | 保留 |
| 上次宣告 | `round.lastClaimResolution` | 已驅動 | 保留 |
| 本局狀態 | `round.outcome.status` | 已驅動 | 保留 |
| 剩餘牌牆 | `round.table.wall.length` | 已驅動 | 保留 |
| 總捨牌數 | `round.table.discards` 聚合 | 已驅動 | 保留 |
| 結果摘要（和牌者 / 放槍者 / 總台數 / 流局原因 / 台型） | `round.outcome.result` | 已驅動 | 保留 |
| 玩家狀態徽章 | `round.phase`、`round.currentSeat`、human claim window | 已驅動 | 保留 |
| 手牌 / 花牌 / 副露 / 捨牌數量 | player 與 table 狀態 | 已驅動 | 保留 |
| 玩家分數 | `player.score` 預設值，未見結算回寫 | 未驅動 placeholder | 本次移除 |
| 聽牌 | `player.declaredReady` 預設值，未接實際聽牌判定 | 未驅動 placeholder | 本次移除 |

## Audit Outcome

本次盤點結果確認：

1. 真正的假 UI 項目為 `玩家分數` 與 `聽牌`
2. 其餘目前出現在牌桌上的狀態欄位皆可追溯到現有 round / store / result 驅動
3. 因已知假 UI 項目可直接在本 change 內修正，因此本輪不再拆出額外 child change

## Implementation Contract

### Task 1: UI 狀態盤點

- Observable behavior:
  - 建立一份牌桌 UI 狀態欄位清單。
  - 每個欄位都要標出規則來源、目前狀態與是否可信。
- Verification target:
  - change artifact 自身與後續修正任務映射

### Task 2: 分類與處置規則

- Observable behavior:
  - 每個欄位都必須被分類為：
    - 規則已驅動，可保留
    - 規則未驅動，需移除或隱藏
    - 規則待實作，需開後續 child change
- Verification target:
  - tasks 與後續 child change 映射

### Task 3: 驗證策略

- Observable behavior:
  - 對每一類會影響玩家判斷的 UI 狀態，後續修正必須補對應 UI test 或 E2E。
- Verification target:
  - `mahjong-vue-table-shell` spec delta

## Acceptance Criteria

- 有新的 UI 真實性 requirement 落在 `mahjong-vue-table-shell`
- task 已明確拆出盤點、分類、修正、驗證主線
- `AGENTS.md` 已寫入可跨專案使用的防呆規則

## Scope Boundaries

**In scope**

- 牌桌 UI 狀態真實性檢核主線
- workflow 防呆規則
- 後續 child change 拆分原則

**Out of scope**

- 任意猜測桌規
- 新 UI 視覺設計
