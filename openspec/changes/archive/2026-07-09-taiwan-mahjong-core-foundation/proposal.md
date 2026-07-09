# 提案：台灣 16 張麻將核心基礎

## 為什麼要做

目前專案只有最小 bootstrap，還沒有能支撐後續規則實作的基礎。若直接開始寫牌局流程或 UI，規則與算台邏輯很容易洩漏到 component 或 store，之後重寫成本會很高。

## 這次要改什麼

- 建立正式 rules baseline 文件
- 建立 rule test matrix 文件
- 建立 Vue scaffold 邊界決策文件
- 建立核心 TypeScript domain model
- 建立 rule-case schema，供後續 scoring / rules 測試重用
- 建立文件測試與核心型別測試

## 範圍

本次只做第一階段基礎：

- 文件
- 核心型別
- rule-case schema
- 文件與型別測試

本次不做：

- 胡牌拆解
- 算台演算法
- AI 行為
- Vue 畫面

## 權限與邊界

- 不接後端
- 不做保存
- 不存在使用者角色授權差異
- 不觸發瀏覽器敏感權限
- `src/core` 保持 framework-independent
- `src/views` 不得內嵌規則判定

## 成功條件

- `openspec` 裡有正式產品 spec
- `openspec` 裡有 change proposal 與可執行 task list
- 核心型別邊界已在程式中建立
- 文件與型別測試存在且可通過
