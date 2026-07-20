## Context

這個 repo 已有 `.nvmrc` 指定 Node 22，但 shell 不會自動套用它；目前 package scripts 也沒有 preflight，因此 AI 可以先在 Node 18 啟動 Vitest/Vite，直到相依套件載入後才以不相干的 module error 失敗。測試層同時存在直接手工拼接 `BaselineRoundState` 的 fixture：claim window 未必由真實 discard 產生、流局可能仍有牌牆、win outcome 可能沒有合法 17 張有效牌。這些狀態讓局部綠測試與玩家真實流程分離。

工作流規則本身也有重複編號、錯掛段落，以及 audit、implementation、verification、closure 與 mainline lifecycle 互相衝突的條款。MVP 已封存；這次是獨立的 post-MVP maintenance change，不得為了追蹤它而復活 MVP current mainline board。

唯一已確認的產品行為 oracle 是：流局後原莊續莊。查聽、流局罰則與其他未定案 post-draw 商業規則仍不在本次範圍。

## Goals / Non-Goals

**Goals:**

- 讓所有正式 npm 開發、測試、建置、型別檢查與 E2E 入口在非 Node 22 時先以可理解訊息失敗。
- 讓牌局測試 fixture 能證明由 production round transitions 到達，並用共享 invariant checker 阻擋互相矛盾或違反實體牌數的狀態。
- 修正已知的 mainline、流局續局 E2E、claim priority 與 AI win reveal fixture。
- 將 regression 的 RED/GREEN 命令、exit code、錯誤層級與互動驗證寫入 change 的可追溯證據。
- 將 `AGENTS.md` 整理成可機械檢查的唯一編號與明確 workflow state machine。
- 將流局後原莊續莊設為唯一 dealer-continuation oracle。

**Non-Goals:**

- 不新增產品文案、計分規則、查聽、流局罰則或新互動。
- 不在本 change 建立 post-MVP mainline board，也不復活已封存的 MVP board。
- 不完成全部 25 筆 RuleCase 的 registry 與 coverage 對帳；這是獨立後續治理 change。
- 不要求每一個單元測試都改用 browser E2E；驗證強度仍依錯誤層級與互動範圍決定。
- 不引入新的 runtime version manager 或外部測試套件。

## Decisions

### Fail fast at every package entry with the repository Node policy

新增一個無第三方依賴的純 policy module，從 repo 根目錄的 `.nvmrc` 解析唯一允許的 major version；CLI wrapper 比對 `process.versions.node`。所有正式 package entry 透過 npm lifecycle pre-script 執行 wrapper，`package.json.engines.node` 設為 `22.x`，並以 `.npmrc` 的 `engine-strict=true` 阻擋錯誤 runtime 下的安裝。

錯誤訊息固定包含 required major、actual version 與 `nvm use` 修復指令，例如：`Node 22 is required by .nvmrc; current runtime is v18.20.8. Run "nvm use".`，並以 exit code 1 結束，底層 Vite、Vitest、TypeScript 或 Playwright 不得啟動。

替代方案是只保留 `.nvmrc` 或只使用 `engines`。前者依賴 shell 自動切換，後者在未啟用 engine strict 時只會警告，兩者都不能為每個 package command 提供相同的 fail-fast 行為。

### Build injected rounds through production transitions and invariant checks

新增 `core/testing` 的共享 scenario harness。它從合法的實體牌池安排初始 deal，呼叫 `createBaselineRound` 建局，再以 `discardTile`、`resolveClaimWindow`、`evaluateExhaustiveDraw` 或 `applyHumanSelfTurnAction` 產生目標狀態。scenario builder 不得直接寫入 phase、pending window、outcome 或衍生的 discard/result 配對。

公開介面為：

- `assertRoundScenarioInvariants(round: BaselineRoundState): void`
- `createReachableClaimWindowScenario(input): BaselineRoundState`
- `createReachableExhaustiveDrawScenario(input?): BaselineRoundState`
- `createReachableDiscardWinScenario(input): BaselineRoundState`
- `createReachableSelfDrawWinScenario(input): BaselineRoundState`

input 允許指定 seat、triggering tile、完整關鍵手牌與 rule config；未指定座位由剩餘合法實體牌補齊。builder 必須拒絕牌張數不符、同牌超過實體上限、claim tile 不在 discard 來源，或無法由 production transition 產生的案例。

invariant checker 至少驗證 phase/outcome 一致性、claim-window 與 pending action 一致性、triggering discard 的來源、exhaustive draw 的空牌牆、win result 與合法 winner/effective tile count，以及全局實體牌數上限。它回傳原 state 之外不建立任何測試專用產品行為。

替代方案是保留各測試自己的 object spread fixture。這無法集中維護 reachability 條件，也無法阻止未來綠測試再次建立不可能狀態。

### Separate audit, apply, verification, and closure as an explicit state machine

`AGENTS.md` 使用唯一且不重複的 hard-gate 編號，並明定狀態轉換：

`audit (read-only) → explicit repair authority → propose/apply → layer verification → explicit closure authority → archive/mainline sync`

「檢視、盤點、review、對帳」只授權 audit；「修正、實作」授權修改與驗證，但不自動授權 archive 或 mainline 回填；「封存、整理 workflow、回填主線」才授權 closure。若 implementation 已驗證但沒有 closure authority，change 保持 active/parked 並停止開啟下一個 change。

結構測試讀取 `AGENTS.md`，驗證 hard-gate heading ID 唯一、必要 workflow 狀態存在、closure authority 規則只有一份，且 lifecycle 條款不再以錯掛的 `Required behavior` 或散落 bullet 存在。

替代方案是只修文字而不加結構測試；這會讓後續編輯再次引入重複編號與互斥條款而沒有失敗訊號。

### Treat post-MVP one-off maintenance as self-contained unless a versioned board is explicitly established

已封存 MVP 之後，獨立 maintenance change 不是 child change，不需要虛構 current mainline mapping。只有使用者明確建立 post-MVP、incremental、maintenance 或 versioned mainline 時，該 board 才成為後續 child changes 的 mapping authority。

active board 只在已明確建立且尚未完成的 versioned mainline 期間必須存在；已完成的 board 必須 archive。若同一條尚未完成的 versioned mainline 需要 board handoff，才使用 successor board，且 successor 接手後才 archive 前一份 board。

替代方案是為每個 post-MVP 小修復建立 successor board。這會重現 completed-but-active board 與「為了滿足 board 規則而製造主線」的歷史錯誤。

### Make verification evidence part of change truth

每個 regression task 使用穩定 ID，並在該 change 的 `tasks.md` evidence ledger 記錄：

- user-visible reproduction 或最小重現；
- 判定的最低錯誤層級；
- 修正前 RED 命令、觀察到的非零 exit code 與失敗摘要；
- 修正後 GREEN 命令、exit code 0 與通過摘要；
- 跨 phase 或玩家互動時的 browser E2E 命令與結果。

`all_done`、typecheck、lint 或 build 都不能替代上述行為證據。apply 時必須先讓最低錯誤層的 regression test 失敗，再修 root cause，最後補上較高層與 E2E closure。

替代方案是另建非標準 verification 文件；這會製造 repo 工具不讀取的 mirror artifact，因此 evidence ledger 留在權威 change tracker。

### Use same-dealer continuation as the only draw oracle

baseline rule config 的 `postDraw.dealerContinuation` 改成 configured `true`。exhaustive draw result 不再列出 `dealer-continuation` 為 unresolved，但仍可列出 `ready-hand-check` 與 `ready-hand-payment`。從 draw outcome 建立下一局時必須保留上一局 `dealerSeat`。

替代方案是只刪除舊 spec 而保留 runtime 的 unresolved flag。這仍會讓 UI/store 消費到「行為已執行但結果宣告未定」的矛盾資料。

## Implementation Contract

### Runtime behavior and interfaces

`readRequiredNodeMajor(nvmrcText: string): number` 必須只接受可解析為正整數 major 的內容；`assertSupportedNodeVersion(actualVersion: string, requiredMajor: number): void` 必須接受任何 major 為 22 的 semantic version，並對其他 major 丟出固定格式錯誤。CLI 必須以自身檔案位置解析 repo 根目錄，不依賴呼叫者目前目錄。

正式入口包含 `dev`、`preview`、`build`、`test`、`test:watch`、`typecheck`、`test:e2e`、`test:e2e:headed`。每個入口在錯誤 runtime 下必須先 exit 1；Node 22 下 preflight 必須 exit 0 並執行原命令。

### Round scenario behavior and data shape

所有共享 builder 必須回傳 `BaselineRoundState`，並在回傳前呼叫 `assertRoundScenarioInvariants`。claim-window scenario 的 pending triggering seat/tile 必須與最後一張 discard 相同；draw scenario 必須由空牌牆的 production transition 得到 `phase = ended` 與 `outcome.status = draw`；win scenario 必須通過 scoring/claim production path，而不是直接建立 `RoundResult`。

已知 fixture 遷移範圍為 claim-priority competing claims、mainline playable claim/draw、draw-next-round browser seed 與 AI win reveal。每一個遷移後 fixture 都必須通過 invariant checker；claim-priority 案例必須同時證明 win 與 pon 都是合法候選，最後由 priority 選中 win；AI win reveal 必須由合法 17 張有效牌與 production win action 結束。

### Workflow behavior

整理後的 `AGENTS.md` 必須保留所有非衝突的 repo hard gates，但每個 numbered H2 ID 只能出現一次。audit 不得寫檔；repair authority 不等於 closure authority；post-MVP standalone maintenance 不得被標成 MVP current mainline 的延續。結構測試必須在重複 ID、缺少必要狀態或重新引入互斥 closure 條款時失敗。

### Draw behavior

`createBaselineRuleConfig()` 必須回傳 configured-true dealer continuation。exhaustive draw 的 `unresolved` 不得包含 `dealer-continuation`；下一局必須以同一 dealer 建立。ready-hand check/payment 維持 unresolved，且本 change 不產生其結算。

### Acceptance criteria

- Node policy regression 在模擬 Node 18 時失敗、在 Node 22 時通過，package policy test 證明每個正式入口接上 preflight。
- AGENTS workflow policy test 證明 heading ID 唯一且 state/authority 語意完整。
- round scenario harness test 對合法案例通過，對 phase/outcome、claim/discard、wall/draw、tile inventory 的矛盾案例拋錯。
- 修正後的 core/store/component regression 皆在 Node 22 通過。
- draw-next-round 與受影響互動流程以 browser E2E 通過。
- `spectra validate post-mvp-harness-engineering-hardening` 通過。
- tasks evidence ledger 含每個 regression 的 RED/GREEN 命令、實際 exit code 與摘要。

### Scope boundaries

本 contract 僅治理本 change 列出的 runtime、workflow、round fixture 與 draw dealer oracle。RuleCase 全 registry、未定案 ready-hand 規則、產品 UI copy、計分新規則與新 mainline board 均不在範圍。

## Risks / Trade-offs

- [Risk] `engine-strict` 會讓未切換 Node 22 的安裝立即失敗 → 訊息與 AGENTS 指令都提供唯一修復命令 `nvm use`，不自動修改使用者 shell。
- [Risk] 嚴格實體牌數 invariant 會揭露更多既有半有效 fixture → 本 change 只遷移已列明的高風險 fixture，其餘發現記為後續 change，不擴張本次實作。
- [Risk] 測試用 builder 位於 source tree 可能被誤用於產品流程 → 模組放在明確的 `core/testing` namespace，只輸出 scenario 與 assertion，不加入 store/runtime product API。
- [Risk] AGENTS 結構測試可能對純排版調整敏感 → 測試鎖定唯一 ID 與必要語意 token，不鎖定行號或完整段落文字。
- [Risk] dealer continuation 從 unresolved 改為 configured 會影響讀取 rule config 的測試 → 以 core config、draw result、next-round 三層 regression 同步遷移，ready-hand 欄位維持不變。

## Migration Plan

1. 先以 RED 測試鎖定 Node policy、AGENTS 結構、round invariant 與流局 dealer oracle。
2. 實作 runtime gate 與 workflow 規則整理。
3. 實作共享 scenario harness，再逐一替換已知半有效 fixture。
4. 執行分層 regression、typecheck、build 與 browser E2E，將實際命令與 exit code 回填 tasks evidence ledger。
5. 驗證 Spectra artifacts；沒有明確 closure authority 時不 archive。

回滾時可逐層撤回：package preflight、AGENTS 結構整理、scenario harness/fixture migration、draw oracle。不得只回滾 spec 而保留相反 runtime，或只回滾 runtime 而保留相反 spec。

## Open Questions

無。本 change 的產品語意僅採用使用者已確認的「流局後原莊續莊」；其餘產品規則明確排除。
