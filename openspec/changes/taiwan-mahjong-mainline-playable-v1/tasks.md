## 0. 主線現況盤點

- [x] 0.1 以 `openspec/specs/taiwan-mahjong-trainer.md` 為主，對照 `openspec/specs/*`、既有 archived change 與目前程式碼，回填主線已完成項目。
- [x] 0.2 將主線清單改成「已完成 / 進行中 / 未開始」格式，避免後續只看到未來待辦。
- [x] 0.3 建立主 spec 與子 change 的對照設計，集中記錄在 `design.md`。

## 1. 已完成：基礎工程與前端殼層

- [x] 1.1 完成 `at-path-alias-imports`：建立基本匯入路徑別名，讓前端與 core 可維持穩定模組邊界。
- [x] 1.2 完成 `taiwan-mahjong-vue-table-shell`：建立 Vue app scaffold、router、Pinia session 骨架與唯讀牌桌殼層。
- [x] 1.3 驗證前端可啟動、可進入首頁與牌局頁，且 UI 仍以唯讀映射為主。
- [x] 1.4 對應主 spec：
  - `階段 4` 的 `Vue app scaffold`、`router`、`pinia`、`牌桌 UI` 已有第一版落地。

## 2. 已完成：核心規則與 AI 基礎

- [x] 2.1 完成 `taiwan-mahjong-rule-config-foundation`：建立規則設定基礎與對應文件邊界。
- [x] 2.2 完成 `taiwan-mahjong-core-foundation`：建立核心型別、基礎 domain 邊界與共用核心出口。
- [x] 2.3 完成 `taiwan-mahjong-round-flow-foundation`：建立基本回合流程、宣告窗口與結果流轉基礎。
- [x] 2.4 完成 `taiwan-mahjong-scoring-foundation`：建立算台 / 結算核心基礎。
- [x] 2.5 完成 `taiwan-mahjong-ai-decision-foundation`：建立 AI 決策基礎與可被 round flow / store 使用的邊界。
- [x] 2.6 對應主 spec：
  - `階段 1` 的 `design / spec 對齊`、`rules baseline`、`rule test matrix`、`domain model`、`rule-case schema` 已完成。
  - `階段 2` 的 `牌型拆解`、`胡牌成立判定`、`台型比對`、`結算輸出` 已完成基礎版。
  - `階段 3` 的 `中階 AI` 已完成 foundation。

## 3. 已完成：互動摸打主線第一段

- [x] 3.1 完成 `taiwan-mahjong-interactive-turn-loop`：讓真人可打牌、AI 三家可自動摸打，主線能持續推進。
- [x] 3.2 驗證互動回合不再只是唯讀桌面，而是已有基本可操作牌局循環。
- [x] 3.3 對應主 spec：
  - `資料流` 的「玩家或 AI 發出動作 → store 送入 core/rules → store 更新狀態 → Vue 顯示狀態」已可運作。
  - `階段 3` 的 `摸打循環` 已完成第一段。

## 4. 進行中：真人 claim-window 宣告

- [ ] 4.1 完成 `taiwan-mahjong-human-claim-window`：讓真人在 `claim-window` 可選 `pass`、`chi`、`pon`、`kan-exposed`、`win`。
- [ ] 4.2 驗證真人有合法宣告時，牌局不會自動略過該座位。
- [ ] 4.3 完成後才可將主 spec `階段 3` 的 `宣告流程` 標記為主線完成。

## 5. 未開始：真人自回合動作完整化

- [ ] 5.1 建立 `taiwan-mahjong-human-self-turn-actions`：補齊真人自己回合可執行的動作入口。
- [ ] 5.2 納入自摸胡、暗槓、加槓與補牌流程的 core / store / UI 邊界。
- [ ] 5.3 驗證真人在自己回合不只可打牌，也能完成完整合法操作。
- [ ] 5.4 這一步完成後，主線才可宣稱真人端具備基本可玩操作閉環。

## 6. 未開始：流局與莊家流程

- [ ] 6.1 建立 `taiwan-mahjong-draw-outcome-and-dealer-flow`：補齊流局結果、莊家處理、下一局銜接。
- [ ] 6.2 依既有 rules baseline 已定案內容實作；未定案部分不得猜測。
- [ ] 6.3 驗證牌牆耗盡或流局條件成立時，牌局能正確結束或進入下一局。
- [ ] 6.4 這一步完成後，主 spec `階段 3` 的 `流局／莊家處理` 才能標記為主線完成。

## 7. 未開始：結算結果接回 UI

- [ ] 7.1 建立 `taiwan-mahjong-ui-round-result-sync`：讓胡牌 / 流局結果在牌桌 UI 完整反映。
- [ ] 7.2 顯示主線必要資訊：胡牌者、放槍者、結果摘要、是否結束本局。
- [ ] 7.3 驗證 UI 只做狀態映射，不在 view 層重算規則或結算。
- [ ] 7.4 這一步完成後，主線才能視為從 core 結果成功接回玩家可見畫面。

## 8. 未開始：AI 主線補強

- [ ] 8.1 建立 `taiwan-mahjong-ai-claim-quality-pass`：補齊 AI 在宣告與自回合的主線缺口。
- [ ] 8.2 確保 AI 至少具備主線可玩所需的吃、碰、槓、胡決策，不要求進階最佳化。
- [ ] 8.3 驗證 AI 不會因新增真人互動而失去既有自動推進能力。
- [ ] 8.4 這一步完成後，主 spec 的 `1 位真人玩家 + 3 位 AI` 才算主線閉環成立。

## 9. 未開始：主線回歸驗證

- [ ] 9.1 建立一組主線整合測試，覆蓋開局、摸打、宣告、胡牌或流局、結果同步。
- [ ] 9.2 執行 typecheck、UI 測試、core 測試與 Spectra 分析，確認主線 change 與子 change 一致。
- [ ] 9.3 任一子 change 完成後，立即回來更新本清單，打勾已完成項目並開始下一個主線任務。
- [ ] 9.4 這一步完成後，主 spec 的「可完整進行基本牌局流程」才可在主線層級標記為完成。
