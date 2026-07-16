## Why

目前 repo 內已經沒有 active mainline board，而且目前 active changes 的關閉狀態也不可信：存在未正確關閉的 child change，也存在我曾誤做 archive 後又必須撤回的 change。這違反主線 board 必須常駐、以及 completed / unarchived change 必須先修復 workflow state 的 repo 規則。

這個 change 的目的不是新增產品功能，而是把 mainline board 補回 `openspec/changes/`，並用它誠實反映目前狀態：先承認目前 active child changes 仍需重新盤點，不再把未經你同意關閉的 change 當成已完成。

## What Changes

- 建立新的 active mainline progress board，作為 repo 目前唯一 current board。
- 明確記錄目前 workflow state 仍待重新盤點，不把 recent changes 誤標為已完成。
- 先將目前不可信的 active child change 狀態收斂成待修復事項，再決定哪些 change 真的可關閉。

## Non-Goals

- 不新增產品需求。
- 不修改 `taiwan-mahjong-dealer-rotation-and-turn-pace` 的產品實作內容。
- 不替下一個尚未定案的 child change 發明功能名稱。
