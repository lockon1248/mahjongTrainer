## Why

目前 repo 的 AI 工作流可以在錯誤 Node 版本、不可到達的牌局 fixture、互相矛盾的 closure 規則與不唯一的流局 oracle 下仍產生綠測試或 `all_done` 狀態，導致完成證據與真實玩家流程分離。這次 post-MVP maintenance change 要把 Harness Engineering 從敘述性提醒改成可機械失敗、可重跑、可追溯的工作契約。

## What Changes

- 建立 AI Harness Engineering capability，定義 Node 22 runtime preflight、RED/GREEN 證據、fixture reachability、分層回歸與 browser E2E closure gate。
- 整理 `AGENTS.md` 的重複編號、錯掛條款與互斥 lifecycle 規則，明確區分 audit、implementation、verification、closure 與 post-MVP one-off maintenance。
- 新增 Node 版本檢查腳本與 npm lifecycle preflight，讓錯誤 runtime 在 test、typecheck、build、dev、E2E 入口立即失敗。
- 建立共用 reachable round scenario builder 與 invariant checker，並修正 mainline、流局續局 E2E、claim priority、AI 和牌證明等半有效 fixture。
- 增加 workflow 結構測試與 Harness regression，要求 change 記錄 regression test ID、修正前失敗命令、修正後成功命令與 exit code。
- 移除已被後續規則取代的「流局不得建立下一局」requirement，統一採用已確認的流局後原莊續局 oracle。

## Capabilities

### New Capabilities

- `ai-harness-engineering`: repo 的 AI runtime、回歸測試、fixture reachability、驗證證據與 closure gate。

### Modified Capabilities

- `mahjong-round-flow-core`: 移除與現行 baseline/runtime 衝突的舊流局續局 requirement，保留流局後原莊續局為唯一行為。

## Impact

- Affected specs: `ai-harness-engineering`, `mahjong-round-flow-core`
- Affected code:
  - New: `.npmrc`
  - New: `scripts/node-version-policy.mjs`
  - New: `scripts/check-node-version.mjs`
  - New: `src/core/testing/roundScenario.ts`
  - New: `tests/smoke/node-version-policy.test.ts`
  - New: `tests/core/round-scenario-harness.test.ts`
  - New: `tests/docs/agents-workflow-policy.test.ts`
  - Modified: `AGENTS.md`
  - Modified: `package.json`
  - Modified: `package-lock.json`
  - Modified: `src/core/config/index.ts`
  - Modified: `src/core/index.ts`
  - Modified: `src/core/rules/roundFlow.ts`
  - Modified: `src/core/types/result.ts`
  - Modified: `src/views/game/e2eBridge.ts`
  - Modified: `tests/core/round-flow-claims.test.ts`
  - Modified: `tests/core/dealer-progression.test.ts`
  - Modified: `tests/core/rule-config-core.test.ts`
  - Modified: `tests/ui/game-session.store.test.ts`
  - Modified: `tests/ui/mainline-playable-flow.test.ts`
  - Modified: `e2e/game-table.smoke.spec.ts`
