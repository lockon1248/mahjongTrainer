## Context

目前牌桌 UI 主要依賴 `src/styles/main.css` 與 `GameTableView.vue` 內部的區域 class 命名，同時把數字牌、風牌、三元牌、花牌、座位與階段等固定展示文案直接宣告在 component 內。這讓樣式系統與展示常數同時受到單一 view 綁死：新增新畫面或調整高亮語意時，必須同時修改大型 CSS 與 component 內部 mapping，測試也容易各自複寫。

這次 change 屬於跨模組重構：會新增 UnoCSS 依賴與建置設定、重整共用樣式入口、抽出共享展示常數模組，並要求既有牌桌畫面與測試改為復用同一份權威來源。

## Goals / Non-Goals

**Goals:**

- 導入 UnoCSS，建立前端 utility-first 樣式基礎，讓牌桌與後續 UI 可用可組合 class 表達。
- 把固定展示常數從 `GameTableView.vue` 抽出成共用 enum / 常數模組，讓 component、selector 與測試共用同一份定義。
- 保持既有中文 UI 行為、牌名輸出、座位文案與牌桌資訊不變，只改善樣式與常數管理方式。
- 為 apply 階段提供明確驗證基準，確保重構不是做出另一套假 UI 或文案漂移。

**Non-Goals:**

- 不在這份 change 內重做整體牌桌版型或新增新規則。
- 不把所有 CSS 一次性完全移除；結構性、reset 或少量難以 utility 化的樣式可暫留全域檔。
- 不在這份 change 內順手重命名核心規則型別或調整 scoring / round-flow 邏輯。

## Decisions

### Introduce UnoCSS as the primary utility styling layer

採用 UnoCSS 作為 Vite 前端的 utility class 來源，並保留 `src/styles/main.css` 作為 reset、基底 CSS 變數與少量非元件化樣式的承載處。這比持續把新 class 疊進大型自訂 CSS 更適合目前牌桌畫面持續演化的節奏，也能避免引入更重的 CSS framework。

替代方案是維持現況純手寫 CSS，或改導入 Tailwind。前者無法處理目前 style drift 與 class 擴張問題；後者可行，但在這個小型 Vite 專案裡配置與輸出成本高於 UnoCSS。

### Centralize fixed presentation values into shared enum and constant modules

所有固定展示值都集中到 `src/ui/constants/`，至少涵蓋數字牌文案、風牌文案、三元牌文案、花牌文案、座位標籤、圈風 / 階段 / 結果文案等，並由 view 與 selector 透過具名匯入復用。這裡的「enum」允許以 TypeScript `enum` 或 `as const` 常數物件實作，但對外必須形成單一權威來源，不可再把相同 mapping 複寫回 component。

替代方案是只把 tile label 搬出去，保留其他文案在 view 內。這會留下雙重來源，後續 UI 優化仍會重複發生漂移，因此拒絕。

### Guard the refactor with output-equivalence tests and build verification

這次是重構 change，因此驗證重點不是新增功能，而是「重構後輸出等價且建置可用」。apply 階段必須補上或更新 UI / selector 測試，覆蓋 tile label、seat label、round summary 與關鍵 table layout 呈現，同時加入 typecheck 與建置驗證，避免 UnoCSS 配置或常數抽取造成 runtime / build drift。

替代方案是只跑既有 smoke test。這不足以保證展示常數沒有漂移，也無法確保 UnoCSS 掃描與輸出真的接上 build pipeline。

## Implementation Contract

**Observable behavior**

- 牌桌 UI 的中文文字輸出、牌名、座位名稱、階段名稱與結果名稱在重構後 MUST 維持與目前產品一致。
- 前端樣式管線 MUST 接入 UnoCSS，讓 Vue SFC 中的 utility class 可被建置並實際套用。
- `GameTableView` 與相關展示組件 MUST 改用共享展示常數，而不是在 component 內自行定義一份固定 mapping。

**Interface / data shape**

- 新增 `uno.config.ts` 作為 UnoCSS 設定入口，並接入現有 Vite 流程。
- 新增 `src/ui/constants/` 下的展示常數模組，對外提供 tile / seat / phase / outcome 等具名匯出。
- `GameTableView.vue`、必要的 selector 與 UI tests MUST 透過共享匯出讀取固定展示值。

**Failure modes**

- 若 UnoCSS 未正確掛入 Vite，`npm run build` 或測試中的 class 驗證會失敗，這屬於 change 未完成。
- 若某個固定展示值仍在 component 內重複硬編碼，等價輸出測試或靜態搜尋檢查應能抓出 drift。
- 若共用常數改動導致中文文案漂移，UI 測試必須直接失敗，而不是默默接受。

**Acceptance criteria**

- `npm run typecheck` 通過。
- 與牌桌展示相關的 UI / selector 測試通過，且能證明重構前後輸出等價。
- `npm run build` 通過，證明 UnoCSS 已正確接入建置流程。
- 搜尋關鍵 mapping 時，不再只在 `GameTableView.vue` 內看到唯一實作，而是轉為引用共享常數模組。

**Scope boundaries**

- In scope: UnoCSS 導入、Vite / style 入口調整、共享展示常數抽取、牌桌與相關測試的引用改造。
- Out of scope: 新牌型規則、AI 決策、回合流程、重新設計桌面資訊架構、大規模視覺重製。

## Risks / Trade-offs

- [UnoCSS utility 化半途而廢，留下雙軌樣式系統] → 允許 reset / 結構樣式暫留全域 CSS，但要求新增與主要畫面 class 轉由 utility 驅動，避免純增加不收斂。
- [把 enum / 常數抽得過細，導致 import 碎片化] → 以展示領域分組，例如 tile、seat、round-status，而不是每個字串一個檔案。
- [重構後測試仍只驗證存在、不驗證內容] → 要求測試直接斷言中文牌名與座位 / 結果輸出，並驗證共享模組被使用。
