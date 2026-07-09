## Context

目前專案已有 baseline 規則文件、scoring foundation 與 round flow foundation，但它們仍只是在行為上遵守 baseline，尚未形成正式的 `Rule Config` 邊界。這讓「不得硬編碼」仍停留在文件層，而不是程式層 contract：例如宣告優先序、自摸與放槍責任、花牌補牌方式、流局後是否查聽等規則，未來若要調整桌規，仍缺少一致的注入點。

同時，多項桌規仍未定案，例如特殊胡、封頂、查聽、流局後連莊、過水與一炮多響。這次設計不能替這些項目補結論，只能定義它們如何在 config 中被表示為 baseline default、explicit override 或 unresolved。

## Goals / Non-Goals

**Goals:**

- 建立 core 可共用的 rule config schema，集中表達 baseline 已確認桌規與可配置規則項。
- 建立 baseline default config，讓 round flow 與 scoring 能透過同一入口取得預設規則。
- 讓 round flow 至少將宣告優先序、花牌補牌方式與流局後未定案處理從固定常數提升為 config 驅動。
- 為 scoring 的支付責任、最低胡牌台數與未來特殊胡開出可擴充但不假定內容的注入邊界。

**Non-Goals:**

- 不補完完整台型清單、特殊胡細節、最低台數數值或封頂規則。
- 不在本 change 中完成 AI 決策、Pinia store、Vue UI 或整體牌桌狀態管理。
- 不在本 change 中直接落地所有 config 分支的完整業務邏輯，只建立正式 contract 與 baseline 對應能力。

## Decisions

### Model unresolved rules explicitly instead of hiding them behind partial booleans

對於未定案規則，不能只給一個模糊 boolean 預留位，否則 caller 很容易把 `false` 誤解成「已明確禁用」。這次將未定案項建模為 explicit unresolved / configured 狀態，讓 core 能區分「目前尚未決定」與「桌規明確關閉」。替代方案是先全部用 optional 欄位，但那會讓缺值語意不清。

### Keep a single baseline default config as the only hard-coded source

baseline 預設桌規仍然需要存在，但只能存在於單一 default config 建立函式，而不能散落在 scoring 與 round flow 模組。這讓後續新增桌規時只需修改單一預設來源。替代方案是各模組自己定 default fallback，但那會重新造成 drift。

### Pass rule config through narrow core interfaces rather than global mutable state

`src/core` 應維持純函式導向與可測性，因此 config 必須透過函式參數或明確 context 傳入，而不是掛在全域 singleton。這樣測試可以精準覆寫單一規則項，並保持同一批案例能對照不同桌規。替代方案是 global config registry，但那會污染測試隔離與後續 store 邊界。

### Update round flow first, leave scoring adoption incremental

目前 round flow 已有最明顯的硬編碼點：宣告優先序與流局後 unresolved 分支。因此這次先要求 round flow 對 config 可感知。scoring 也要拿到 config 邊界，但只需先完成 payment responsibility、最低胡牌門檻與 future pattern gating 的接口，不必一次實作全部 scoring config 分支。替代方案是 round flow 與 scoring 同步全面改寫，但那會把 change 範圍膨脹過頭。

## Implementation Contract

**Behavior**

- core 必須提供一個可序列化的 rule config shape，能表達 baseline default、explicit override 與 unresolved 規則項。
- 呼叫端若未提供 config，系統必須能取得 baseline default config，而不是各模組自行 fallback。
- round flow 在處理 claim priority、flower replacement mode 與 exhaustive draw unresolved branches 時，必須能讀取 rule config。
- scoring core 必須接受 rule config 或 scoring-relevant config slice，以便後續 payment responsibility、minimum tai gating 與 unresolved special patterns 可從統一入口取得規則。

**Interface / data shape**

- `src/core/config/` 需提供 rule config 型別、baseline default builder、override merge helper 與 unresolved rule marker。
- rule config 至少需涵蓋：claim priority order、flower replacement mode、self-draw payment mode、discard-win payment mode、minimum tai threshold、dealer continuation policy、ready-hand check policy、special hand switches。
- round flow 相關 API 需支援傳入完整 config 或 round-flow config slice，且不依賴 global mutable state。
- scoring 相關 API 至少需支援傳入 scoring-relevant config slice；未支援規則仍可保持 unresolved，但不得被默默寫死。

**Failure modes**

- 若 config 提供無效優先序或缺少 baseline 必需欄位，系統必須回傳明確錯誤或拒絕建立 config，而不是 silent fallback。
- 若 caller 嘗試在未定案規則上直接取得 settled business outcome，系統不得偽造結果，必須保留 unresolved 狀態或回傳明確空結果。
- 若 merge helper 收到未知 override key，系統不得默默接受並遺失資料。

**Acceptance criteria**

- `tests/core` 至少新增 baseline default config、config override、claim priority from config、unresolved policy preservation 的對應測試。
- `mahjong-round-flow-core` 的 delta spec 與新 `mahjong-rule-config-core` spec 必須通過 `spectra analyze`。
- `npm test -- --run tests/core` 與 `npm run typecheck` 在實作完成後必須通過。

**Scope boundaries**

- In scope: rule config 型別、default builder、override merge helper、round flow config adoption、scoring config boundary、必要 spec 與測試案例擴充。
- Out of scope: 完整特殊胡實作、完整台型台數表、AI 行為、Vue UI、Pinia store orchestration。

## Risks / Trade-offs

- [Risk] config schema 若一次塞進太多未定案規則，會讓 contract 變得模糊。 → Mitigation: 只納入已知會影響 core 邊界的規則項，未定案以 explicit unresolved 表達。
- [Risk] round flow 與 scoring 若用不同 config shape，後續會再次分裂。 → Mitigation: 維持單一 root config，再由 helper 提供 slice。
- [Risk] 讓 scoring 立即全面 config 化會拖慢進度。 → Mitigation: 本 change 只要求 scoring 建立接口與最小 adoption，不一次做完全部分支。
