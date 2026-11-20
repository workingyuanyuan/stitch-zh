---
title: 從程式碼庫產生原型
description: Stitch 分析已連接的程式碼庫，提出 UX insight 與解決方案，再在畫布上產生原型。
appliesTo: Stitch CLI（2026-11-20）
caveat: 上傳程式碼並建立 UI 原型 loop 後，Stitch 在背景分析路由；第一次分析程式碼通常約需 15 分鐘。
lastVerified: 2026-11-20
sources:
  - title: Stitch Docs：Codebase Prototypes
    url: https://stitch.google.com/docs/cli/codebase-prototyping/
---

## 前提與流程

儲存庫連到 Stitch Workspace、並搭配一個 [UI 原型 loop](/cli/priorities-and-context/) 之後，Stitch 會檢查應用程式實際的路由與元件，直接在 Stitch Canvas 上提出 UI 原型。

Workspace 功能要先在這台電腦上執行一次 `stitch enable loop`，設定方式見[連接儲存庫](/cli/workspaces-and-projects/)。

| 步驟 | 指令 |
| --- | --- |
| 1. 把現有路由放上畫布 | `stitch capture`、`stitch upload screen` |
| 2. 連結專案、同步 `DESIGN.md` | `stitch loop link`、`stitch upload design` |
| 3. 查看 insight 與解決方案 | `stitch find insights`、`stitch find solutions` |
| 4. 在畫布上產生原型 | `stitch generate screen` |
| 5. 預覽 | `stitch serve`、`stitch open screen` |

## 用 `/stitch` Skill 產生原型

在已連接的儲存庫裡呼叫 `/stitch`，coding agent 會處理多個路由的探索與原型流程：

```text
/stitch This tea delivery app is now connected to a workspace. When the analysis has ideas ready, walk me through them. Until then, work out the app's main views from the router and put snapshots of them on the Canvas.
```

這段告訴 agent 這個茶飲外送 App 已經連上 Workspace：分析有了構想就帶你看一遍；在那之前，先從路由找出主要畫面，把快照放上畫布。

agent 會：

1. 讀取路由定義，找出主要的畫面。
2. 從本機開發伺服器擷取即時快照，放上 Stitch Canvas 專案。
3. Workspace 分析一完成，就列出候選的解決方案。
4. 你選定一個解決方案後，在畫布上產生原型畫面。

## 把現有路由放上畫布

產生新功能的原型之前，Stitch Canvas 專案需要現有畫面的真實快照，以及 [`DESIGN.md`](/cli/design-systems/) 的 token。這樣新的原型才會像你的產品，而不是通用範本。

從本機開發伺服器擷取主要路由，上傳成參考畫面：

```bash
stitch capture http://localhost:5173/dashboard -o .stitch/dashboard.html
stitch upload screen .stitch/dashboard.html --route "/dashboard" --title "Dashboard"

stitch capture http://localhost:5173/schedule -o .stitch/schedule.html
stitch upload screen .stitch/schedule.html --route "/schedule" --title "Schedule"
```

再確認 Canvas 專案已連到 Workspace，`DESIGN.md` 也已同步：

```bash
stitch loop link --project <project-id>
stitch upload design DESIGN.md
```

擷取的旗標見[擷取執行中的 App](/cli/capture-and-upload/)。

## 查看 insight 與解決方案

程式碼已上傳（`stitch upload code .`）、UI 原型 loop 也已啟用（`stitch create loop --template ui-prototyping`）後，Stitch 會在背景分析路由，找出只能看不能操作的資料顯示、流程瓶頸與版面上的機會。

第一次分析程式碼通常約需 15 分鐘。隨時可以查看 Workspace 的 insight：

```bash
stitch find insights
stitch get insight <insight-id>
```

每個 insight 會產生一個或多個候選解決方案。每個解決方案是一份完整規格，包含：

| 內容 | 說明 |
| --- | --- |
| 領域隱喻（domain metaphor） | 介面取材自產品所屬領域的比喻 |
| `DESIGN.md` 規則 | 要遵守的設計規則 |
| Stitch Canvas 提示詞 | 校準過的提示詞，以你上傳的參考畫面為基準 |

```bash
stitch find solutions
stitch get solution <solution-id>
```

## 在畫布上產生原型

挑一個能解決你在意的問題的解決方案，取出它的設計提示詞，在已連結的 Stitch Canvas 專案上產生畫面：

```bash
stitch generate screen \
  --title "Interactive Schedule Workbench" \
  --device DESKTOP \
  --prompt "<prompt from stitch get solution>"
```

`--prompt` 換成 `stitch get solution` 輸出的提示詞。

在 `localhost` 把新原型和既有畫面放在一起預覽，或直接在 Stitch Canvas 開啟：

```bash
stitch serve
stitch open screen <screen-id>
```
