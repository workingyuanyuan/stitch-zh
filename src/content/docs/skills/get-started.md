---
title: 開始使用 Agent Skills
description: Stitch Design Skills 是給 coding agent 的一組設計指引，可產生畫面、整理設計系統、轉成 React 元件。
appliesTo: Stitch Agent Skills（2026-11-20）
caveat: Skill 透過 Stitch MCP 伺服器和 Stitch 溝通；裝好外掛後，還要另外註冊 MCP 伺服器並設定 API 憑證，才連得上 Stitch。
lastVerified: 2026-11-20
sources:
  - title: Stitch Docs：Get started with Agent Skills
    url: https://stitch.google.com/docs/skills/get-started/
---

## Stitch Design Skills 是什麼

Stitch Design Skills 是一組給 coding agent 的指令，讓 agent 能產生畫面、擷取設計系統、建立多頁網站，以及把設計轉成 React 元件。它們遵循 [Agent Skills](https://agentskills.io) 標準，支援這個標準的 agent 都能用，例如 Gemini CLI、Claude Code、Cursor、Antigravity。

| 步驟 | 做什麼 |
| --- | --- |
| 1 | 安裝外掛套件，取得全部 Skill |
| 2 | 連接 Stitch MCP 伺服器，並確認連線 |
| 3 | 用 `enhance-prompt` 改寫提示詞，再產生第一個畫面 |

## 安裝外掛套件

在專案資料夾裡執行，依使用的 agent 選一行：

```bash
# Claude Code
npx plugins add google-labs-code/stitch-skills --scope project --target claude-code

# Cursor
npx plugins add google-labs-code/stitch-skills --scope project --target cursor

# Gemini CLI
npx plugins add google-labs-code/stitch-skills --scope project --target gemini-cli
```

這會安裝三個外掛：`stitch-design`、`stitch-build`、`stitch-utilities`，合計 13 個 [Skill](/skills/reference/)。

`plugins` CLI 目前還不支援把 Antigravity 當成 `--target`。用 Antigravity 時，改用下一節的個別安裝指令。

### 只裝部分 Skill（選用）

執行下面的指令，再從清單裡勾選要的 Skill：

```bash
npx skills add google-labs-code/stitch-skills
```

很多 Skill 互相依賴。例如 `code-to-design` 需要 `extract-static-html`、`extract-design-md` 和 `upload-to-stitch`。安裝完整外掛套件比較不會漏掉。

## 連接 Stitch MCP 伺服器

Skill 透過 [Model Context Protocol](https://modelcontextprotocol.io) 和 Stitch 溝通。照 [MCP 設定](/mcp/setup/) 註冊伺服器、設定 API 憑證。

連上後，agent 就能使用 `list_projects`、`generate_screen_from_text`、`get_screen` 等工具。

### 確認連線

對 agent 輸入：

```text
Check my Stitch account and tell me the names of the projects in it.
```

這段提示詞請 agent 查看你的 Stitch 帳號，回報裡面有哪些專案。

會看到現有的專案；第一次用 Stitch 時則是空清單。出現錯誤時，檢查 MCP 伺服器是否在執行、API key 是否有效。

## 產生第一個畫面

先從粗略的想法開始。`enhance-prompt` 會把模糊的概念改寫成結構完整、可以直接拿去產生的提示詞。

```text
Enhance this prompt for Stitch: "Hualien surf school, beginner lessons, wants a home page that gets people to sign up"
```

這段提示詞請 `enhance-prompt` 把「花蓮衝浪學校想要一個吸引初學者報名的首頁」這個粗略想法，改寫成完整的提示詞。

改寫後的提示詞會多出這些內容，產生的結果比原本的一句話好得多：

| 加入的內容 | 說明 |
| --- | --- |
| 平台 | 指明是哪一種平台的設計 |
| 編號的區塊 | 把頁面拆成依序編號的段落 |
| UI/UX 用語 | 把含糊的字眼換成具體的介面用語 |
| 設計系統區塊 | 列出顏色與各自的角色 |

接著請 agent 產生畫面：

```text
Now take the improved version you just wrote and turn it into a Stitch screen.
```

這段提示詞請 agent 拿剛才改寫好的版本，在 Stitch 專案裡產生一個畫面。

產生需要 15 到 30 秒。完成後會顯示畫面 ID 和檔案路徑。打開產生的截圖，就能看到一個完整的到達頁，包含主視覺區塊、功能卡片、導覽列與頁尾。

## 下一步

| 想做的事 | 做法 |
| --- | --- |
| 從現有程式碼擷取 DESIGN.md | [從程式碼匯入](/design-md/get-instructions/) |
| 把 React 應用程式匯入 Stitch，改完設計再匯出成元件 | [程式碼與設計來回轉換](/skills/roundtrip/) |
| 從一個概念產生整個網站 | [循環建站](/skills/build-in-a-loop/) |
| 查全部 13 個 Skill | [Skill 一覽](/skills/reference/) |

## 疑難排解

| 問題 | 解法 |
| --- | --- |
| 找不到 `npx plugins` | 安裝 Node.js 18 以上，用 `node --version` 確認版本 |
| MCP 伺服器沒有回應 | 照 [MCP 設定](/mcp/setup/) 重新檢查 |
| agent 裡看不到 Skill | 安裝後重新啟動 agent 的工作階段 |
| 權限錯誤 | 用 `--scope project`，不要用 `--scope global` |
| API key 錯誤 | 確認 agent 的 MCP 設定裡的 key 沒有過期 |
