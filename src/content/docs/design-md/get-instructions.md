---
title: 從程式碼取得 DESIGN.md
description: 用一段提示詞或 Stitch Design Skills，從既有程式碼擷取出 DESIGN.md。
appliesTo: DESIGN.md（2026-11-20）
caveat: extract-design-md 只掃描原始碼，不必建置或執行 App；code-to-design 則要從執行中的 App 擷取靜態 HTML。
lastVerified: 2026-11-20
sources:
  - title: Stitch Docs：Import from your codebase
    url: https://stitch.google.com/docs/design-md/get-instructions/
  - title: Stitch Docs：Get started with Agent Skills
    url: https://stitch.google.com/docs/skills/get-started/
---

## 該用哪種方法

既有的程式碼裡早就有一套設計語言：顏色散在各個樣式表，間距藏在元件檔案裡，字體寫在 Tailwind 設定中。把它們集中成一份 `DESIGN.md`，Stitch 產生的畫面就會像你的產品，而不是從空白預設開始。

| 情況 | 建議做法 |
| --- | --- |
| 快速擷取，不想安裝任何東西 | 把下面的提示詞貼給任何 coding agent |
| 要依框架徹底擷取 | 安裝 Skills，用 `extract-design-md` |
| 整個前端搬進 Stitch | 安裝 Skills，用 `code-to-design` |
| 從零開始手寫 | 格式見 [DESIGN.md 是什麼](/design-md/overview/) 與 [DESIGN.md 規格](/design-md/specification/) |

## 方法一：一段提示詞

在專案資料夾裡，把提示詞貼給任何 coding agent（Gemini、Claude Code、Cursor、Antigravity）。不需要 Skill 或外掛：agent 讀你的原始碼，再依讀到的內容寫出 `DESIGN.md`。

可以先加一段選用的背景說明，寫出程式碼的用途、關鍵檔案和目標：

```text
Before you start: this is a Vue app that a Kaohsiung ferry company uses to sell island tickets. Colors and fonts are defined in uno.config.ts, and most shared styling sits in app/theme/ and app/ui/. The goal is a DESIGN.md that Stitch can use for a redesign.
```

這段背景說明告訴 agent 專案是高雄渡輪公司的售票 App、設定與共用樣式放在哪些檔案和資料夾，以及要產出給 Stitch 用的 `DESIGN.md`。

接著是主要的指示：

```text
Work out how this product is organized by reading its core logic and data models, not only its documentation. If the data is really a schedule, a route map or a set of tickets, let that structure decide the page layout rather than a generic run of sections.

For the look, go through the code itself: gather every color value, font size scale, spacing value and recurring component style, even when they are spread over many files and never documented. If the project already has a design system, keep it.

All wording must come from the project. Use the README for the product name and headline copy, and use config files, command help, schemas and error messages for labels and terms. Leave out anything you cannot find in the repository or on its website; no filler text.

Whatever the README describes first is the most important feature, so size and place it before everything else. Save what you find as DESIGN.md.
```

這段提示詞要 agent 依核心邏輯與資料結構決定版面、從程式碼收集視覺識別並沿用既有的設計系統、所有文字都取自專案本身，並讓 README 最先介紹的功能在頁面上最突出，最後存成 `DESIGN.md`。

### 提示詞擷取的三層內容

| 層 | 內容 | 來源 |
| --- | --- | --- |
| 內容 | 產品名稱、標籤、文案；沒有填充文字或 lorem ipsum | 原始碼 |
| 視覺識別 | 顏色、字體、間距、元件模式 | 樣式表、主題檔、Tailwind 設定 |
| 資訊架構 | 產品資料的自然形狀，決定頁面怎麼組織 | 核心邏輯與資料結構 |

它是從程式碼往回推，而不是從範本往前套。產出的 `DESIGN.md` 放到 `.stitch/DESIGN.md`，就能直接用來產生畫面。

### 讓結果更好的寫法

- 指定資料夾：在背景說明裡寫出要看的位置，例如 `src/styles/`、`tailwind.config.ts`、`src/components/`。
- 說明技術組合：告訴 agent 這是 React + Tailwind + shadcn/ui 之類的專案，它才知道去哪裡找。
- 反覆修正：第一次擷取先掌握大方向，之後再用提示詞修正細節。

修正細節的提示詞例如：

```text
Spacing in DESIGN.md looks too tight. The ticket cards in app/ui/ use 24px gaps, so base the spacing scale on that.
```

這段提示詞指出 `DESIGN.md` 的間距太窄，要 agent 以 `app/ui/` 裡票券卡片的 24px 間距為基準重訂間距級距。

## 方法二：Stitch Design Skills

提示詞在哪裡都能用，但只靠 agent 的一般推理。[Stitch Design Skills](https://github.com/google-labs-code/stitch-skills) 是專門寫好的 agent 指示，知道 React、Vue、Svelte、Angular、純 CSS 和 Tailwind 這些主要框架的 design token 放在哪裡。

它是開放原始碼的集合，共 13 個 agent skill，分成三個外掛：

| 外掛 | 用途 |
| --- | --- |
| `stitch-design` | 建立與擷取設計：從程式碼擷取 token、為執行中的 App 拍快照、上傳到 Stitch |
| `stitch-build` | 把設計變成程式碼：React 元件、操作示範影片、shadcn/ui 整合 |
| `stitch-utilities` | 提升品質：最佳化提示詞、進階設計系統、自動產生多個頁面 |

Skills 遵循 [Agent Skills](https://agentskills.io) 開放標準，可以用在任何相容的 coding agent。更多說明見 [Agent Skills 入門](/skills/get-started/)。

### 安裝

```bash
npx plugins add google-labs-code/stitch-skills --scope project --target claude-code
```

`--target` 依你用的 agent 換成 `cursor` 或 `gemini-cli`。這一頁的 Stitch 文件也列出 `antigravity`，但 [Agent Skills 入門](/skills/get-started/) 寫明 `plugins` CLI 目前還不支援 Antigravity 當 target，用 Antigravity 時要改用那一頁的個別安裝方式。

### 從原始碼擷取：extract-design-md

`extract-design-md` 直接掃描原始碼，不必建置或執行應用程式。

```text
I need a .stitch/DESIGN.md for this project. Build it from the design system you can find in the code under ./web/src; there is no need to run the app.
```

這段提示詞要 agent 從 `./web/src` 的程式碼找出設計系統，寫成 `.stitch/DESIGN.md`，不必執行 App。

這個 Skill 會自動偵測技術組合（Tailwind 設定、CSS 自訂屬性、主題檔、styled-components），然後逐一處理每個設計面向：

| 面向 | 擷取內容 |
| --- | --- |
| 視覺氛圍 | 整體情緒、留白的取捨、色溫 |
| 配色 | 合併重複的色值，再為每種顏色指定用途 |
| 字體排印 | 字體家族、字級層級、字重與字距模式 |
| 元件樣式 | 按鈕、卡片、導覽、輸入框，以及領域特有的元素 |
| 版面原則 | 格線系統、響應式斷點、間距策略 |

產出同時有 YAML front matter（機器可讀的 token）和 Markdown 內文（人可讀的設計理由）。這種雙層格式讓 `DESIGN.md` 同時適用於工具與 AI agent。

### 上傳到 Stitch：manage-design-system

有了 `DESIGN.md` 之後，把它推進一個 Stitch 專案，之後產生的每個畫面都會照這套設計系統：

```text
Make .stitch/DESIGN.md the design system of my Stitch project, so new screens use its colors and fonts.
```

這段提示詞要 agent 把 `.stitch/DESIGN.md` 設為 Stitch 專案的設計系統，讓之後的新畫面使用其中的顏色與字體。`manage-design-system` 負責上傳，並在專案層級註冊設計系統；之後的畫面都會自動沿用這些 token。

### 一次搬完：code-to-design

要一次完成設計系統擷取、靜態 HTML 擷取與上傳，交給 `code-to-design`，由它串接各步驟：

```text
Start a Stitch project called "Ferry Tickets Redesign" and bring in everything from the frontend under ./ferry-web: its pages and its design system.
```

這段提示詞要 agent 建立名為 `Ferry Tickets Redesign` 的 Stitch 專案，把 `./ferry-web` 前端的頁面與設計系統全部帶進去。

`code-to-design` 依序串起三個步驟：

1. 從執行中的 App 擷取靜態 HTML。
2. 從原始碼反推設計系統。
3. 把全部內容上傳到 Stitch。
