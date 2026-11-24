---
title: Loop 與背景資料
description: 在 Stitch Workspace 設定長期的 UI 原型目標（loop），並附上規格文件與筆記。
appliesTo: Stitch CLI（2026-11-20）
caveat: loop 的目標不能修改：對 stitch edit loop 傳 --objective 會換成一個新 ID 的新 loop，之後要重新用 stitch find loops 查 ID。
lastVerified: 2026-11-20
sources:
  - title: Stitch Docs：Loops & Context
    url: https://stitch.google.com/docs/cli/priorities-and-context/
---

## loop 是什麼

在 Stitch Workspace 裡，loop 不是一次性的工單（例如「把按鈕改成藍色」），而是長期的設計目標，告訴 Stitch 要在應用程式的各個路由裡找哪一類 UX 改進。

Workspace 功能要先在這台電腦上執行一次 `stitch enable loop`，設定方式見[連接儲存庫](/cli/workspaces-and-projects/)。

## 用 `/stitch` Skill 設定 loop

用 `/stitch` Skill 導入儲存庫時，agent 會提議設定標準的 Scale Interactive Visual Prototyping loop（`ui-prototyping`）。之後也隨時可以請 `/stitch` 設定或調整 loop：

```text
/stitch Set up a UI prototyping loop that turns our /trails and /bookings lists into maps and calendars people can drag and tap.
```

這段要 agent 設定一個 UI 原型 loop，目標是把 `/trails` 與 `/bookings` 兩份清單變成可以拖曳、點選的地圖與行事曆。

## 從終端機用 UI 原型範本

CLI 內建範本，一步建立 loop 並調整 Workspace 的遠端分析 Skill：

```bash
stitch create loop --template ui-prototyping
```

這個指令同時做兩件事：

| 動作 | 內容 |
| --- | --- |
| 建立長期 loop | 自主程度設為 `CREATE_SUGGESTIONS`，Stitch 會持續提出 insight、解決方案規格與 Canvas 設計提示詞 |
| 同步三個 Workspace Skill | `design-synthesis`、`insight-guidelines`、`solution-guidelines`，引導 Stitch 後端的研究 agent 著重視覺 UI 原型，而不是一般的程式碼品質檢查 |

這三個 Workspace Skill 在 Stitch 後端運作，和裝在本機的 `/stitch` Skill 是不同的東西。

| 想先看其他範本 | 指令 |
| --- | --- |
| 列出所有入門範本 | `stitch create loop --templates` |
| 互動式挑選 | `stitch create loop -i` |

要鎖定特定路由或流程，在 `--template ui-prototyping` 之外加上 `--objective`。目標換成你的，UI 原型的 Skill 調整照樣保留：

```bash
stitch create loop \
  --template ui-prototyping \
  --objective "Turn the read-only trail list and booking table across /trails and /bookings into a map and a calendar that hikers can drag, tap, and filter directly."
```

這個目標要把 `/trails` 與 `/bookings` 上唯讀的步道清單與預約表格，變成登山客可以直接拖曳、點選、篩選的地圖與行事曆。

## 用預期成果描述目標

好的 loop 目標描述一個跨多個路由、長期成立的 UX 成果，而不是一件做完就結束的工作。

| 類型 | 例子 | 怎麼處理 |
| --- | --- | --- |
| 成果 | 讓 `/trails` 和 `/weather` 在手機上一眼就看懂、方便點選 | 寫成 loop 目標 |
| 小工作 | 修 `/bookings` 表格的內距、加一個篩選下拉選單 | 直接修改比較快，不必經過 Workspace 分析 |

### 管理 loop

焦點改變時，隨時可以列出、查看、更新或刪除 loop：

```bash
stitch find loops
stitch get loop <loop-id>
stitch edit loop <loop-id> --objective "..."
stitch delete loop <loop-id>
```

目標不能修改。對 `stitch edit loop` 傳 `--objective`，會把 loop 換成一個有新 ID 的新 loop，所以之後要重新執行 `stitch find loops` 取得新 ID。

### 查看 loop 的衡量方式

loop 有追蹤指標時，`stitch get loop <loop-id>` 會在 `How it's measured` 區段顯示，旁邊是這個 loop 的 insight 與解決方案。每個指標列出：

| 欄位 | 內容 |
| --- | --- |
| 最新數值 | 含單位，例如 `42 ms` 或 `98.5%` |
| 目標 | 有設定時才顯示 |
| 方向 | `↑ higher is better` 或 `↓ lower is better` |
| 上次衡量時間 | 尚未衡量時顯示 `no measurements yet` |

這個區段是唯讀的。指標載入失敗時，loop 的其他內容照常顯示。

## 附上規格與背景資料

產品需求、使用者研究筆記、架構文件這類會影響原型的資料，可以附到 Workspace。

| 檔案類型 | 用 `stitch upload file` 上傳後 |
| --- | --- |
| PDF、圖片、其他文件 | 存成 Workspace 的檔案 |
| Markdown、純文字 | 改存成 Workspace 的 context |

```bash
stitch upload file ./specs/trail-booking-prd.pdf
stitch find files
```

也可以用 `stitch create context` 直接在終端機加一則筆記：

```bash
stitch create context \
  --title "Booking Flow Goals" \
  --description "Let a hiker book a guided trail in one view instead of three separate steps."

stitch find contexts
```
