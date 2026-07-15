## Context

這個專案目前已完成最低胡牌門檻、天胡、大三元、小三元等起始 scoring 能力，但距離「台數練習器」仍差關鍵一段：缺少一份完整、可驗證、可逐批落地的權威牌型台數目錄。

目前權威來源分散在三處：
- `openspec/specs/taiwan-mahjong-rules-baseline.md` 已定義 baseline 與部分已定值規則。
- `openspec/specs/taiwan-mahjong-rule-test-matrix.md` 已固定第一批案例骨架。
- 使用者指定 `https://www.gametower.com.tw/Games/Freeplay/MJ/Star31/Data/i_ingame-count.aspx` 作為本輪擴充規則的參考來源。

問題在於該網頁同時包含一般台數表與「見花見字」遊戲內特殊規則，若不先把牌型目錄、衝突規則、疊加方式與 profile 邊界整理成權威 spec，後續 code 與 UI 很容易再次出現規則不完整卻先展示的假完成狀態。

## Goals / Non-Goals

**Goals:**

- 建立第一版完整牌型台數目錄的權威 spec change。
- 將牌型拆成可逐批實作與驗證的規則分類，避免一次性把所有 code 與測試混在同一輪完成。
- 明確規範 scoring catalog 必須包含名稱、台數、成立條件、衝突關係、可否疊加、是否受 profile 影響。
- 補出 rule config 與測試矩陣必須承接的 contract，讓未來 apply change 可直接對著做。
- 回填主線 board，讓目前 active child change 與下一步主線狀態一致。

**Non-Goals:**

- 這一輪不直接實作完整 scoring code。
- 這一輪不直接新增胡牌彈窗或 AI 和牌展示 UI。
- 這一輪不處理所有結算金額、台錢換算或 UI 排版細節。

## Decisions

### 以 GameTower 台數頁作為本輪牌型盤點來源，但先抽象成權威 scoring catalog

直接把網頁內容散寫進 tests 或 code 會讓規則來源再次分裂。本 change 先要求把網頁列出的台型整理成權威 scoring catalog，再由後續 apply change 落地到 baseline、rule config、patterns 與測試。

不採用「先想到什麼做什麼」的牌型追加方式，因為這會讓規則覆蓋率與 UI 顯示再次不同步。

### 牌型目錄必須分成基礎規則與 profile 規則

該網頁同時描述一般台數表與「見花見字」特殊規則，兩者在風牌、花牌、無字無花、槓牌等計法上存在明顯差異。本 change 先把 catalog contract 設計成支援 profile 分流，避免後續把互斥規則硬塞進同一條固定邏輯。

本輪已定案為同時支援兩套 profile：
- `classic-taiwan`: 一般台數表
- `flower-wind-bonus`: 見花見字特殊規則

不直接在這份 change 中決定唯一預設 profile，因為產品仍需保留規則切換能力，而不是把其中一套桌規永久寫死。

### 測試 contract 必須同時要求 core 與 browser E2E

過去問題已證明只有 unit test 不足以攔住假 UI 與接線缺漏。本 change 要求：
- 牌型判定、疊加、衝突與最低門檻由 core 測試覆蓋。
- 至少一條和牌結果顯示流程由 browser E2E 覆蓋。

不接受只有 spec 與 unit test、沒有真實畫面驗證入口的完成定義。

### 主線 board 必須在同一輪切換 active child change

既然這個子項已經開立，就不能讓主線 board 繼續停在 `none`。本 change 內同步修正主線 board 的 current active child change 與下一步描述，避免主線追蹤與實際工作脫節。

## Implementation Contract

### Task 1: 完整牌型台數 change artifact 建立完成

- Observable behavior:
  - `openspec/changes/taiwan-mahjong-complete-scoring-catalog/` 內存在有效的 `proposal.md`、`design.md`、`tasks.md` 與對應 delta specs。
- Interface / data shape:
  - delta specs 至少覆蓋 `mahjong-scoring-core` 與 `mahjong-rule-config-core`。
- Acceptance criteria:
  - `spectra validate taiwan-mahjong-complete-scoring-catalog --strict` 通過。
- Scope boundaries:
  - 僅建立權威變更 artifact，不在此 task 內直接改 runtime code。

### Task 2: scoring catalog contract 明確化

- Observable behavior:
  - spec 明確要求每個台型必須有名稱、台數、成立條件、疊加／覆蓋規則、profile 適用性與輸出識別。
- Interface / data shape:
  - scoring core 後續輸出的 `scoringItems` 必須能對應穩定牌型識別與台數來源。
  - rule config 後續必須能表達最低台數門檻、特殊胡型開關、profile 與封頂等設定。
- Failure modes:
  - 若某牌型只知道名稱但沒有台數或衝突規則，後續 apply 不得直接落地成正式 scoring 邏輯。
- Acceptance criteria:
  - delta specs 與 tasks 內都能看出這些欄位是必做項，而不是口頭描述。

### Task 3: 測試主線 contract 補齊

- Observable behavior:
  - tasks 明確要求每一批牌型都要有對應 core 測試，且至少一條和牌結果顯示流程要有 E2E。
- Interface / data shape:
  - `taiwan-mahjong-rule-test-matrix.md` 後續需補進穩定案例 ID 與分類。
- Acceptance criteria:
  - 後續 apply change 可直接依 tasks 展開 test-first 工作，而不是重新發明測試策略。

### Task 4: 主線 board 追蹤同步

- Observable behavior:
  - `openspec/changes/taiwan-mahjong-mainline-progress-board-live/design.md` 反映目前 active child change 為 `taiwan-mahjong-complete-scoring-catalog`。
- Acceptance criteria:
  - 主線 board 不再顯示 `none`，且下一步描述與本 change 一致。

## Risks / Trade-offs

- [規則來源同頁含多種 profile] → 先把 profile 差異收斂成 spec open question 與 config contract，避免過早寫死。
- [牌型數量多，容易 scope 膨脹] → 先完成權威目錄與測試矩陣，再以後續 apply 子任務分批落地。
- [只做 spec 容易被誤解成產品已完成] → 在 tasks 與主線 board 明確標示本 change 只完成規格與驗證 contract，不代表 scoring code 已補齊。
- [E2E 成本增加] → 限制為至少一條關鍵和牌顯示流程，但把 requirement 寫死，避免未來被省略。

## Open Questions

- 目前沒有。`連莊 / 拉莊 / 幸運柴神` 已定為排除於第一版完整練習器 catalog，保留後續擴充。
