---
title: Skill 一覽
description: Stitch Design Skills 的 13 個 Skill 分屬三個外掛，部分 Skill 要搭配其他 Skill 才能用。
appliesTo: Stitch Agent Skills（2026-11-20）
caveat: 很多 Skill 互相依賴，例如 code-to-design 需要另外三個 Skill；只裝部分 Skill 前先查好依賴，否則建議安裝完整外掛套件。
lastVerified: 2026-11-20
sources:
  - title: Stitch Docs：Skill reference
    url: https://stitch.google.com/docs/skills/reference/
---

## 全部 Skill

每個 Skill 都遵循 [Agent Skills](https://agentskills.io) 開放標準，相容的 coding agent 都能使用。

| 外掛 | Skill | 用途 |
| --- | --- | --- |
| `stitch-design` | `code-to-design` | 串起整個匯入流程，把現有前端匯入 Stitch |
| `stitch-design` | `generate-design` | 從文字或圖片產生畫面、修改畫面、產生變化版本 |
| `stitch-design` | `manage-design-system` | 上傳 DESIGN.md、建立專案的設計系統並套用到畫面 |
| `stitch-design` | `extract-design-md` | 從前端原始碼反推 `DESIGN.md` |
| `stitch-design` | `extract-static-html` | 把執行中的網頁應用程式存成可獨立使用的 HTML |
| `stitch-design` | `upload-to-stitch` | 把本機的圖片、HTML 檔案上傳到 Stitch REST API |
| `stitch-build` | `react-components` | 把 Stitch 畫面轉成模組化的 React 元件 |
| `stitch-build` | `remotion` | 用 Remotion 把 Stitch 專案做成導覽影片 |
| `stitch-build` | `shadcn-ui` | 整合 shadcn/ui 元件的指引 |
| `stitch-utilities` | `design-md` | 分析現有的 Stitch 畫面，整理出 `DESIGN.md` |
| `stitch-utilities` | `enhance-prompt` | 把模糊的想法改寫成可以直接產生的提示詞 |
| `stitch-utilities` | `stitch-loop` | 用接力棒模式自動產生多頁網站 |
| `stitch-utilities` | `taste-design` | 產生避開 AI 常見樣式的高標準 `DESIGN.md` |

Skill 由 coding agent 執行，提示詞寫給 coding agent。

## stitch-design

建立、擷取與管理設計的核心工作流程。

### code-to-design

串起整個匯入流程：偵測框架 → 擷取靜態 HTML → 擷取 design token → 上傳到 Stitch。

依賴：`extract-static-html`、`extract-design-md`、`upload-to-stitch`

```text
Our Kaohsiung bike-share site lives in ./bike-share. Move the whole frontend into a new Stitch project and call it "Kaohsiung Bike Share".
```

這段提示詞說明高雄公共自行車網站的位置，請 agent 把整個前端搬進名為 Kaohsiung Bike Share 的新 Stitch 專案。

### generate-design

從文字或圖片產生新畫面、修改現有畫面、產生設計的變化版本。

MCP 工具：`generate_screen_from_text`、`edit_screens`、`generate_variants`、`list_projects`、`create_project`、`list_design_systems`

```text
Make a booking tab for a mobile app that reserves private hot spring rooms in Beitou, with one card per bathhouse.
```

這段提示詞請 agent 為北投溫泉湯屋預約 App 做一個預約分頁，每間湯屋一張卡片。

### manage-design-system

上傳 DESIGN.md 規格、建立專案層級的設計系統，並套用到畫面上。

MCP 工具：`create_design_system_from_design_md`、`apply_design_system`、`list_design_systems`、`upload_design_md`

```text
Project 123456 has no design system yet. Build one from .stitch/DESIGN.md and apply it to the project's screens.
```

這段提示詞指出專案 123456 還沒有設計系統，請 agent 用 `.stitch/DESIGN.md` 建立一個並套用到專案的畫面。

### extract-design-md

從前端原始碼反推出 `DESIGN.md`，支援 React、Vue、Svelte、Angular、純 CSS 和 Tailwind，不需要先建置。

流程：掃描原始碼目錄 → 偵測框架 → 擷取 token → 正規化 → 去除重複 → 產生 DESIGN.md

```text
Without building it, read the Vue source of our temple guide in ./temple-guide/src and produce .stitch/DESIGN.md from what you find.
```

這段提示詞請 agent 不建置、直接讀廟宇導覽網站在 `./temple-guide/src` 的 Vue 原始碼，據此產生 `.stitch/DESIGN.md`。

### extract-static-html

從執行中的網頁應用程式擷取可獨立使用的 HTML 快照，CSS 內嵌，圖片轉成 base64。

```text
The menu page is running at http://localhost:5173/menu. Capture it, CSS and images included, as one file: .stitch/menu.html
```

這段提示詞請 agent 把本機執行中的菜單頁連同 CSS 與圖片存成單一檔案 `.stitch/menu.html`。

### upload-to-stitch

把本機檔案（圖片、HTML）上傳到 Stitch REST API。上傳由一支獨立的指令碼執行，不受 LLM 輸出 token 上限的限制。

```text
Push the night-market.html in this folder up to Stitch, into projects/987654321.
```

這段提示詞把這個資料夾裡的 `night-market.html` 上傳到 Stitch 專案 `projects/987654321`。

## stitch-build

從 Stitch 設計產生程式碼與影音內容。

### react-components

把 Stitch 畫面轉成模組化的 React 元件階層，會擷取 Tailwind 主題，並用 AST 驗證。

```text
Rebuild projects/123 in React: one component tree per screen, with the Tailwind theme pulled out into config.
```

這段提示詞請 agent 用 React 重建專案 `projects/123`，每個畫面一組元件階層，並把 Tailwind 主題抽到設定檔。

### remotion

用 Remotion 從 Stitch 專案產生導覽影片，有彈簧動態的縮放效果和可設定的轉場。詳見[產生導覽影片](/skills/walkthrough-videos/)。

```text
Make a short video that steps through each screen of Tainan Temple Guide, my project in Stitch.
```

這段提示詞請 agent 為 Stitch 專案 Tainan Temple Guide 做一支逐一走過每個畫面的短片。

### shadcn-ui

整合 shadcn/ui 元件的專家指引：尋找、安裝與自訂，搭配 Radix UI 和 Tailwind CSS。

```text
Add shadcn/ui to this app and use its components for a form where riders report a broken elevator at an MRT station.
```

這段提示詞請 agent 在應用程式裡加入 shadcn/ui，並用它的元件做一個讓乘客回報捷運站電梯故障的表單。

## stitch-utilities

在流程的兩端提升品質。

### design-md

分析現有的 Stitch 專案畫面，從渲染結果整理出 `DESIGN.md`。方向是「設計 → token」，和 `extract-design-md` 的「程式碼 → token」相反。

MCP 工具：`list_screens`、`get_screen`、`upload_design_md`、`list_projects`、`get_project`

```text
The hot spring booking screens already in Stitch project 123456 look right. Write down their colors, type and spacing as a DESIGN.md.
```

這段提示詞請 agent 把專案 123456 裡現有溫泉預約畫面的顏色、字體與間距整理成 DESIGN.md。

### enhance-prompt

把模糊的想法改寫成結構完整、可以直接產生的提示詞，補上 UI/UX 用語、設計系統脈絡與頁面結構。

```text
Enhance this prompt: "a page to reserve a table at a hot pot restaurant"
```

這段提示詞請 `enhance-prompt` 改寫一個火鍋店訂位頁的簡短想法。

### stitch-loop

用接力棒（relay baton）模式自動產生多頁網站。詳見[循環建站](/skills/build-in-a-loop/)。

```text
Using .stitch/next-prompt.md as the baton, execute the stitch-loop build cycle.
```

這段提示詞以 `.stitch/next-prompt.md` 為接力棒，執行一輪 `stitch-loop`。

### taste-design

產生高標準、避開 AI 常見樣式的 `DESIGN.md`：校準過的配色、依音程比例的字級、彈簧物理的動態，以及明列的反模式清單。詳見 [Taste：taste-design](/skills/taste/)。

```text
Night-market vendors use this app on small phones to track orders during the rush. Generate a premium DESIGN.md for it.
```

這段提示詞說明夜市攤商在尖峰時段用小螢幕手機追蹤訂單，請 agent 為這個 App 產生 premium 等級的 DESIGN.md。

## 只安裝部分 Skill

建議安裝完整的外掛套件。只需要特定 Skill 時：

```bash
# Design only (generate and edit screens)
npx skills add google-labs-code/stitch-skills \
  --skills stitch::generate-design,stitch::manage-design-system,enhance-prompt

# Import existing code (full migration pipeline)
npx skills add google-labs-code/stitch-skills \
  --skills stitch::code-to-design,stitch::extract-design-md,stitch::extract-static-html,stitch::upload-to-stitch

# Code generation (Stitch to React)
npx skills add google-labs-code/stitch-skills \
  --skills react:components,shadcn-ui
```

| 組合 | 包含 |
| --- | --- |
| 只做設計 | 產生與修改畫面 |
| 匯入現有程式碼 | 完整的遷移流程 |
| 產生程式碼 | 從 Stitch 轉成 React |

選擇性安裝時，要連同依賴的 Skill 一起安裝。
