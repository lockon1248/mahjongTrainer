## Context

這個專案的產品價值不是只有「能打一局」，而是要能讓玩家練習台數與計算。現在 repo 雖然已經有：

- 標準胡牌結構拆解
- 極少量示範台型（`莊家胡`、`自摸`）
- 可玩牌桌與 browser E2E 基建

但仍缺少三個核心能力：

1. 一份權威、可維護的完整台型 / 特殊胡型規則來源
2. 一條從 `win claim` / `self draw win` 一路接到 `totalTai` 與 `scoringItems` 的完整結果鏈
3. 能證明這些規則在 core、UI 與 browser 中都成立的測試主線

因此這個 change 不應再把 scoring 視為附屬工作，而要把它升為主線核心任務。

## Goals / Non-Goals

**Goals:**

- 建立 `mahjong-scoring-core` capability spec
- 把 `天胡`、`大小三元` 與完整台型規則補進權威規格工作
- 規劃最低胡牌台數、花牌計分、特殊胡型與結果接線的逐步實作路線
- 明確要求 core / store / UI / browser E2E 對 scoring 主線提供對應測試

**Non-Goals:**

- 不在這份 design 內憑空定出所有台型台數值
- 不在這一輪就完成全部 scoring implementation
- 不把 UI 視覺改版混進 scoring 主線

## Decisions

### 先補權威規則目錄，再補 scoring implementation

目前 repo 最大問題不是單一 bug，而是缺少一份正式的台型與特殊規則清單。因此第一步要先補 `rules baseline` 與 `rule test matrix`，把完整規則主線列清楚，再開始一批一批實作。

### scoring core 必須成為獨立 capability

目前主 specs 裡缺少獨立的 scoring capability，導致算台工作分散在 baseline、rule config 與 UI 摘要之間。這次直接建立 `mahjong-scoring-core` spec，讓後續所有算台變更都有固定的 capability 落點。

### discard-win 與 self-draw win 都必須經過同一條 scoring 結果鏈

現在 `self-draw` 會走 scoring evaluation，但 `claim-window` 的 `win` 直接建立結果摘要，導致 UI 看不到台數。之後不論 `榮和` 或 `自摸`，都必須經過同一條 scoring evaluation → settlement → round result → selector → UI summary 鏈路。

### 規則實作按批次前進，而不是一次塞滿

雖然產品最終需要完整台型，但實作上要按批次切：

1. 結果接線與最低胡牌台數主線
2. 基礎台型與特殊胡型第一批（至少含 `天胡`、`大小三元`）
3. 花牌與其餘台型擴充
4. browser E2E 與回歸擴充

### 每一批規則都要有對應測試與 browser 驗證

scoring 規則不是只靠 unit test 就算完成。每一批至少要對應：

1. core unit tests
2. round-flow / store regression
3. UI result summary test
4. browser E2E for user-visible win result

## Acceptance Criteria

- 有新的 `mahjong-scoring-core` spec delta
- `rules baseline` 與 `rule test matrix` 有明確列出要補的 scoring / 特殊規則主線
- tasks.md 能把規則補齊、結果接線、測試與 E2E 拆成可逐步完成的 task
- 主線 board 已把目前 active child change 更新為這個 scoring/rules change

## Scope Boundaries

**In scope**

- scoring / 特殊規則主線規劃
- 規則 baseline 與測試矩陣擴充
- scoring capability spec
- scoring 實作與驗證任務拆分

**Out of scope**

- 新牌桌 UI 視覺改版
- AI 策略優化
- 非 scoring 類的桌規改寫
