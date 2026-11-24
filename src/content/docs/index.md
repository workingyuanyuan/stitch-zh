---
title: Stitch 中文教學
description: Google Stitch 是 Google 的 AI 介面設計工具，也能從 CLI、MCP、SDK 與 Agent Skills 操作。
appliesTo: Stitch 網頁版、CLI、MCP、SDK、DESIGN.md 與 Agent Skills（2026-11-20）
caveat: 功能、名稱與上限為 2026-11-20 的 Stitch；Stitch 仍在更新，之後的版本會有變動。
lastVerified: 2026-11-20
sources:
  - title: Stitch Docs（英文）
    url: https://stitch.google.com/docs/
  - title: Stitch
    url: https://stitch.google.com/
---

## Stitch 是什麼

輸入一段提示詞，Stitch 會產生網頁或 App 的畫面設計；之後用對話逐步修改，最後下載成 HTML 程式碼與圖片。

## Stitch 入門

| 順序 | 主題 | 內容 |
| --- | --- | --- |
| 1 | [快速上手](/learn/overview/) | 從第一個提示詞到下載成果的完整流程 |
| 2 | [提示詞寫法](/learn/prompting/) | 起頭、定調、逐個畫面修改、控制主題與圖片 |
| 3 | [裝置類型：App 與 Web](/learn/device-types/) | 兩種模式的差異，以及把 App 設計轉成 Web |
| 4 | [設計模式](/learn/design-modes/) | 四種 Design Mode 各適合什麼工作 |
| 5 | [變化版本（Variations）](/learn/variants/) | 一次產生多個選項，再從中挑選、繼續調整 |
| 6 | [畫布操作與快捷鍵](/learn/controls/) | 選取、平移、縮放工具與常用快捷鍵 |

## CLI

npm 套件 `@google/stitch`：在終端機或 coding agent 裡產生、預覽與修改設計。

- 開始使用：[CLI 快速上手](/cli/overview/)、[Agent Skills 與 MCP](/cli/mcp-and-skills/)
- 畫布工作流程：[產生與修改畫面](/cli/screens-and-variants/)、[和 coding agent 反覆修改](/cli/agent-bridge/)、[同步設計系統](/cli/design-systems/)、[擷取執行中的 App](/cli/capture-and-upload/)、[審查 App 介面](/cli/design-review/)
- Workspace 工作流程：[連接儲存庫](/cli/workspaces-and-projects/)、[Loop 與背景資料](/cli/priorities-and-context/)、[從程式碼庫產生原型](/cli/codebase-prototyping/)
- 參考：[CLI 指令參考](/cli/reference/commands/)、[CLI 內建 MCP 工具參考](/cli/reference/mcp-tools/)、[REST API 參考](/cli/reference/rest-api/)

## MCP

把遠端的 Stitch MCP 伺服器接到 Cursor、Claude Code 等 AI 工具。

- [MCP 設定與驗證](/mcp/setup/)、[MCP 使用指南](/mcp/guide/)、[Stitch MCP 工具參考](/mcp/reference/)

## SDK

TypeScript 套件 `@google/stitch-sdk`：用程式產生、修改與管理設計。

- 入門：[SDK 快速上手](/sdk/tutorial/)、[搭配 Vercel AI SDK](/sdk/ai-sdk/)、[Agent 工作流程](/sdk/agent-workflows/)
- 做法：[修改畫面](/sdk/edit-screen/)、[產生變化版本](/sdk/generate-variants/)、[下載 HTML 與截圖](/sdk/download-artifacts/)、[擷取主題](/sdk/extract-themes/)、[管理設計系統](/sdk/design-systems/)、[從 DESIGN.md 建立設計系統](/sdk/design-md/)、[上傳檔案](/sdk/upload-image/)
- 參考：[SDK 參考](/sdk/reference/)、[SDK 架構](/sdk/architecture/)

## DESIGN.md

人和 AI agent 都能讀、能改的純文字設計系統文件。

- [DESIGN.md 是什麼](/design-md/overview/)、[從程式碼取得 DESIGN.md](/design-md/get-instructions/)、[DESIGN.md 規格](/design-md/specification/)、[檢視、編輯與匯出](/design-md/usage/)、[用 CLI 驗證 DESIGN.md](/design-md/cli/)、[檢查規則](/design-md/linting-rules/)

## Agent Skills

給 coding agent 的設計指令包，透過 Stitch MCP 伺服器操作 Stitch。

- [開始使用 Agent Skills](/skills/get-started/)、[程式碼與設計來回轉換](/skills/roundtrip/)、[循環建站：stitch-loop](/skills/build-in-a-loop/)、[產生導覽影片：remotion](/skills/walkthrough-videos/)、[Taste：taste-design](/skills/taste/)、[Skill 一覽](/skills/reference/)

## 第一個提示詞

第一個提示詞寫三件事：要做什麼、想要的風格、頁面上的內容。另外可以附一張參考圖。

```text
Ridge Line is a hiking club in Taipei, and it needs a home page.
The mood is calm and outdoorsy: deep green on off-white, with plenty of space.
Show this weekend's hike at the top, then three more upcoming hikes and a button to join.
```

這段提示詞的三行分別是：台北登山社團「Ridge Line」需要一個首頁、沉穩的戶外風格與深綠配米白的配色、頁面最上方放本週的活動，接著是另外三場活動和加入按鈕。
