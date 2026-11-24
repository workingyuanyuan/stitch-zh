---
title: MCP 使用指南
description: 在 coding agent 裡用 Stitch MCP 查專案、下載 HTML 與圖片，再用 Agent Skill 轉成 React。
appliesTo: Stitch MCP（2026-11-20）
caveat: Stitch MCP 整合的是支援遠端 HTTP MCP 伺服器的 coding agent；使用前要先完成驗證。
lastVerified: 2026-11-20
sources:
  - title: Stitch Docs：Getting Started（MCP）
    url: https://stitch.google.com/docs/mcp/guide/
---

## Stitch MCP 能做什麼

Stitch MCP 把 Stitch 編輯器裡產生設計的能力帶進 IDE、CLI 或其他 AI 工具。在那裡可以產生新畫面，也可以把設計轉成程式碼，放進你的程式碼庫，用程式控制、自動化 Stitch。

一個提示詞就能讓 agent 把 Stitch 設計轉成結構清楚的一組 [React](http://react.dev) 元件，agent 依序執行這些步驟：

| 步驟 | 做什麼 |
| --- | --- |
| 1 | 請 agent 列出專案與畫面 |
| 2 | 下載畫面的 HTML 程式碼 |
| 3 | 下載畫面的圖片 |
| 4 | 安裝 Agent Skill，把整個畫面轉成 React 元件 |

## 開始之前

| 項目 | 說明 |
| --- | --- |
| 驗證 | 先完成 Stitch MCP 的驗證，見 [MCP 設定與驗證](/mcp/setup/) |
| coding agent | 用你習慣的就好；Stitch MCP 整合的是支援遠端 HTTP MCP 伺服器的 coding agent |

## 1. 列出專案與畫面

請 agent 列出你的 Stitch 專案，以及每個專案裡的畫面。

```text
What's in my Stitch account? Go project by project, and next to each screen name give me its ID.
```

| 提示詞片段 | 作用 |
| --- | --- |
| `What's in my Stitch account?` | 動作：要 agent 查什麼 |
| `Go project by project, and next to each screen name give me its ID.` | 格式：依專案分組列出畫面與 ID |

這段提示詞要 agent 盤點 Stitch 帳號裡的內容，逐一列出每個專案的畫面名稱，並在旁邊附上畫面 ID。

回應大致像下面這樣，實際內容依工具和模型而異：

```plaintext
1. Lotus Pond Bike Tours
Created: Sep 12, 2026 • Mobile • Dark Mode • Private

Screens (3):

- Tour List
- Route Detail
- Booking
```

一個 Stitch 專案可以有多個畫面。每個畫面包含設計的程式碼和圖片。

MCP 工具的用處在於把取得的資料交給 AI 模型理解：可以請 agent 解讀你的 Stitch 專案，也可以請它依你本機的內容產生新設計和程式碼。輕鬆的問題也可以問：

```text
Looking at all my Stitch projects, what kind of apps do I seem to enjoy building?
```

這段提示詞請 agent 從你的專案看出你喜歡做哪一類 App。

## 2. 下載 HTML 程式碼

agent 知道要處理哪個專案、哪個畫面後，就可以取得程式碼或產生的圖片。

```text
I want the markup behind Route Detail from Lotus Pond Bike Tours on disk. Write it to ./tmp/${screen-name}.html, fetching the file with curl -L.
```

| 提示詞片段 | 作用 |
| --- | --- |
| `the markup behind Route Detail from Lotus Pond Bike Tours` | 指定專案與畫面，要的是 HTML |
| `Write it to ./tmp/${screen-name}.html` | 動作：存成哪個檔案 |
| `fetching the file with curl -L` | 工具指引：用哪個工具下載 |

這段提示詞要 agent 把 Lotus Pond Bike Tours 專案裡 Route Detail 畫面的 HTML 存到本機的 `./tmp/${screen-name}.html`，下載時用 `curl -L`。

下載的 HTML 是一份完整的 `<html>` 文件，內含這個設計專用的 Tailwind CSS 設定。

### 轉成其他 UI 框架

LLM 很擅長把 HTML 轉成其他 UI 系統。以這份 HTML 為基礎，請 agent 轉換，可以得到 React、Vue、Handlebars，甚至 Flutter、Jetpack Compose 這類網頁以外的 UI 框架。

## 3. 下載圖片

圖片也用同樣的方式取得：指定畫面，請 agent 下載它的圖片，存成 `.png` 檔。

```text
Next, I also need a picture of Route Detail: grab its image with curl -L and keep it as ./tmp/${screen-name}.png.
```

這段提示詞接著要 agent 用 `curl -L` 抓同一個 Route Detail 畫面的圖片，存成 `./tmp/${screen-name}.png`。

## 4. 用 Agent Skill 轉成 React 元件

許多 coding agent 支援 [Agent Skill Open Standard](https://agentskills.io/home)。一個 Skill 把包含操作指示的提示詞，和一組資源（例如某個 MCP 伺服器的特定工具呼叫）包在一起。從 Stitch MCP 產生 React 元件系統，很適合用 Skill 來做。

### 安裝 Skill

`add-skill` 可以從 GitHub 網址，把 agent Skill 安裝到常用的 coding agent：

```shell
npx add-skill google-labs-code/stitch-skills --skill react:components --global
```

`react:components` 這個 Skill 告訴 agent 該用哪些 Stitch 工具、依序執行哪些步驟，以及拆分 React 元件的最佳做法。內容在 [Stitch Agent Skills 的 GitHub 儲存庫](https://github.com/google-labs-code/stitch-skills)。

### 觸發 Skill

安裝後，寫一個會觸發這個 Skill 的提示詞：

```text
Build me a React app from the Booking page of Lotus Pond Bike Tours, split into reusable components.
```

這段提示詞要 agent 以 Lotus Pond Bike Tours 的 Booking 畫面為來源，做出拆成可重複使用元件的 React App。

agent 完成後，會留下一個透過 [Vite](https://vite.dev) 在本機伺服器上執行的 React 應用程式。
