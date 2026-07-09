# Vue Scaffold 邊界決策

本文件定義 `taiwan-mahjong-core-foundation` 這個 change 在進入 Vue app scaffold 前的明確邊界。
目的在於避免規則、算台、狀態模型尚未穩定時，過早把邏輯塞進 router、store 或 UI。

## 先做內容

以下內容必須優先完成，且屬於本 change 目前允許範圍：

- rules baseline
- rule test matrix
- core domain model
- rule-case schema

這些內容的共同原則是：

- 規則與資料形狀先以文件與純 TypeScript 型別固定
- 可配置規則不可在 UI 層提早寫死
- 後續 scoring / rules 實作要能直接依賴這些基礎，不需反向依賴 Vue

## 明確延後內容

以下內容在本 change 中明確延後，不應提前插入：

- Vue app scaffold
- router
- pinia
- 牌桌 UI
- 視覺元件切版
- 畫面互動流程
- 音效、動畫、提示文案

延後原因：

- 目前產品 spec 已明定開發順序為規則引擎優先，UI 延後
- 若過早建立 store 或畫面，容易把規則判定分散到 Vue 層
- 台型、特殊胡、查聽、封頂等規則仍有待確認項目，不適合先綁進互動流程

## 何時啟動 Vue scaffold

只有當下列基礎都已完成並穩定後，才允許啟動 Vue scaffold：

- 規則文件、規則測試矩陣、core domain model、rule-case schema 已完成
- 後續至少已有可實作的 `core/rules` 與 `core/scoring` 邊界
- store 與 view 層可以只做狀態協調與渲染，而不承擔規則判定

換句話說，Vue scaffold 不是本 change 的起點，而是規則核心有可依附介面後才開啟的下一階段工作。

## 啟動後第一批允許內容

啟動 Vue scaffold 後，第一批允許內容應只包含：

- Vue app scaffold
- router 基本頁面結構
- pinia session/store 骨架
- `GameTableView` 與必要頁面容器
- 將 core 狀態映射到 UI 的唯讀顯示

第一批不應包含：

- 在 component 內自行判斷胡牌、吃碰槓、補花是否合法
- 在 store 內重寫 scoring 或 rules 判定
- 以 UI 需求反推 core 型別

## 邊界守則

- `src/core` 保持 framework-independent
- `src/stores` 只協調 session 狀態，不重寫規則
- `src/views` 只顯示狀態與送出動作，不擁有規則判定
- 若 Vue 需求與 core 邊界衝突，優先回頭調整 spec 或 core contract，不在 UI 層繞過
