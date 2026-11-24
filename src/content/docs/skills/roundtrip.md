---
title: 程式碼與設計來回轉換
description: 把 React 應用程式的設計系統和畫面匯入 Stitch，改完設計後再匯出成 React 元件。
appliesTo: Stitch Agent Skills（2026-11-20）
caveat: 這個流程需要一個能啟動 dev server 的 React 應用程式，並且要先裝好 Node.js 18 以上與 puppeteer。
lastVerified: 2026-11-20
sources:
  - title: Stitch Docs：Code to Design roundtrip
    url: https://stitch.google.com/docs/skills/roundtrip/
---

## 整個流程

從一個現有的 React + Vite 應用程式出發，先把程式碼匯入 Stitch，再把修改後的設計匯出成程式碼：

| 步驟 | 方向 | 結果 | 負責的 Skill 或工具 |
| --- | --- | --- | --- |
| 1 擷取 design token | 程式碼 → DESIGN.md | 從原始碼反推出設計系統 | `extract-design-md` |
| 2 擷取靜態 HTML | 程式碼 → 靜態檔案 | 執行中的應用程式存成可獨立使用的 HTML | `extract-static-html` |
| 3 上傳 | 檔案 → Stitch | 設計系統與畫面匯入雲端 | `upload-to-stitch` |
| 4 修改設計 | Stitch → 更新後的設計 | 針對性的視覺修改 | `edit_screens` |
| 5 匯出 | Stitch → React | 從設計產生更新後的元件 | `react-components` |

## 事前準備

- 已完成[開始使用 Agent Skills](/skills/get-started/)：Skill 已安裝，MCP 已連線。
- 一個現有的 React 應用程式，dev server 能正常啟動。
- 已安裝 Node.js 18 以上與 `puppeteer`。

以下範例是一家台中便當店的網站。

## 步驟 1：從原始碼擷取 design token

掃描原始碼檔案，反推出一份設計系統文件，不需要先建置。

```text
Go through the components, Tailwind config and theme files under ./bento-shop/src, and save the design system you find as .stitch/DESIGN.md
```

這段提示詞請 agent 讀過便當店網站的元件、Tailwind 設定與主題檔，把找到的設計系統存成 `.stitch/DESIGN.md`。

`extract-design-md` 會讀元件、樣式表、Tailwind 設定檔和主題檔，找出顏色、字體排印、間距與元件模式。產生的 `.stitch/DESIGN.md` 包含：

| 部分 | 內容 |
| --- | --- |
| YAML frontmatter | 機器可讀的顏色 token |
| Markdown 段落 | 描述視覺氛圍、配色、字體排印與版面 |
| 描述性名稱 | 顏色用名稱加色碼表示，不只是一串色碼 |

## 步驟 2：擷取靜態 HTML 快照

先啟動 dev server，再把執行中的應用程式存成可獨立使用的 HTML：

```text
The dev server is up on port 5173. Capture the home page as one self-contained HTML file at .stitch/designs/home.html
```

這段提示詞告訴 agent dev server 已在 5173 埠執行，請它把首頁存成一個獨立的 HTML 檔 `.stitch/designs/home.html`。

這個 Skill 會啟動 headless Chrome，擷取完整渲染後的 DOM，把所有 CSS 內嵌進去，並把圖片轉成 base64 data URI。每個輸出檔都完全獨立，不依賴外部檔案。

有多個頁面時，每個路由各做一次：

```text
Do the same for the /menu route and name the file menu.html, in the same folder.
```

這段提示詞對菜單頁的路由 `/menu` 做同樣的事，存成同一個資料夾裡的 `menu.html`。

## 步驟 3：上傳到 Stitch

用一個提示詞就把全部檔案推到新的 Stitch 專案：

```text
Make a Stitch project named "Bento Shop Refresh", use .stitch/DESIGN.md as its design system, and bring in every HTML file from .stitch/designs/ as screens.
```

這段提示詞請 agent 建立名為 Bento Shop Refresh 的 Stitch 專案，以 `.stitch/DESIGN.md` 為設計系統，並把 `.stitch/designs/` 裡的每個 HTML 檔匯入成畫面。

打開 [Stitch](https://stitch.google.com) 就能看到專案，每個畫面都套用了設計系統。

## 步驟 4：修改設計

不碰程式碼，直接做針對性的視覺修改：

```text
On the home screen, put a small map card right under the opening hours, showing that the shop is a five-minute walk from Taichung Station.
```

這段提示詞請 agent 在首頁的營業時間下方加一張小地圖卡片，標出店家離台中車站步行五分鐘。

這個 Skill 會帶著你的指示呼叫 `edit_screens`，同時保留原有的設計系統。一次只改一件事效果最好：要改很多地方時，分成幾次修改，不要全部塞進同一個提示詞。

## 步驟 5：匯出回 React

把更新後的 Stitch 畫面轉回元件程式碼：

```text
Pull the latest screens from my Stitch project and rebuild this app's pages from them as React components.
```

這段提示詞請 agent 取回 Stitch 專案裡最新的畫面，據此把應用程式的頁面重建成 React 元件，負責的是 `react-components`。

`react-components` 會做這些事：

1. 下載最新的畫面 HTML。
2. 擷取 Tailwind 主題的值。
3. 把設計拆成模組化的元件。
4. 建立型別安全的介面（interface）。
5. 把靜態資料移到 `src/data/mockData.ts`。
6. 用 AST 驗證全部程式碼。

啟動 dev server，React 元件就會反映在 Stitch 裡做的修改，包括新加的地圖卡片。

## 下一步

| 想做的事 | 做法 |
| --- | --- |
| 擷取設計系統的其他方法，包括不需要 Skill 的提示詞 | [從程式碼匯入](/design-md/get-instructions/) |
| 產生避開 AI 常見樣式的設計系統 | [Taste：taste-design](/skills/taste/) |
