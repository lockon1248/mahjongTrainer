## Context

`taiwan-mahjong-match-stakes-and-victory-setup` 已建立開局設定 modal 與整場 match state，但目前初始籌碼驗證只有 `> 0`。使用者新規則要求最低值必須是 `100`，而且不能只靠 HTML `min`，store 也要有同等邊界保護。

## Goals / Non-Goals

**Goals:**

- 將初始籌碼最低值統一定義為 `100`
- modal 與 store 使用同一條驗證規則
- 小於 `100` 時不可開局

**Non-Goals:**

- 不修改預設初始籌碼 `1000`
- 不改動底 `30` / 台 `10`
- 不新增額外 UI 套件或複雜錯誤流程

## Decisions

### Use one shared minimum at the store boundary

權威規則由 store 邊界維護，避免測試或其他呼叫端繞過 modal 直接啟動非法 match。

### Keep modal validation consistent with store validation

modal 會把 input 的 `min` 改成 `100`，且 submit handler 也會拒絕 `<100`，避免只靠瀏覽器原生行為。

## Implementation Contract

- Behavior:
  - 使用者輸入初始籌碼小於 `100` 時，setup modal MUST NOT emit submit。
  - 呼叫 `startLocalRound({ initialChips: < 100 })` 時，store MUST 保持未開局並回報錯誤。
- Interface / data shape:
  - 最低籌碼值為固定常數，供 modal 與 store 共用。
- Failure modes:
  - 不得因為非法籌碼值而建立 round 或 match config。
- Acceptance criteria:
  - `tests/ui/match-setup-modal.test.ts` 驗證 `<100` 不送出。
  - `tests/ui/game-session.store.test.ts` 驗證 store 拒絕 `<100`。

