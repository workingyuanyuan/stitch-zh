---
title: Agent Skills 與 MCP
description: 把 /stitch Skill 與 Stitch MCP 伺服器裝進 Claude Code、Cursor 等 coding agent。
appliesTo: Stitch CLI（2026-11-20）
caveat: CLI 內建的 MCP 伺服器（stitch mcp start）在本機執行，工具是 stitch_find 等七個；雲端的遠端 Stitch MCP 伺服器用 create_project 等另一組工具。
lastVerified: 2026-11-20
sources:
  - title: Stitch Docs：Agent Skills & MCP
    url: https://stitch.google.com/docs/cli/mcp-and-skills/
  - title: Stitch Docs：Stitch via MCP
    url: https://stitch.google.com/docs/mcp/setup/
  - title: Stitch Docs：Reference
    url: https://stitch.google.com/docs/mcp/reference/
---

## 兩種接法

`@google/stitch` CLI 可以和 Claude Code、Claude Desktop、Cursor、Antigravity、VS Code 這些 coding agent 搭配。

| 接法 | 作用 | 安裝指令 |
| --- | --- | --- |
| `/stitch` Skill | 寫入一組說明檔，讓 agent 知道怎麼用 CLI 管理專案、同步 `DESIGN.md`、擷取頁面、做介面審查 | `stitch agent-skills add` |
| Stitch MCP 伺服器 | 透過 Model Context Protocol 提供 Stitch 工具 | `stitch mcp install` |

裝了 Skill，就不必自己記每個 CLI 旗標。

## 安裝 `/stitch` Skill

| 指令 | 寫入位置 | 用途 |
| --- | --- | --- |
| `stitch agent-skills add` | 專案內的 `.agents/skills/stitch/` | 只在這個專案使用 |
| `stitch agent-skills add --user` | `~/.agents/skills/stitch/` | 這台電腦上所有儲存庫都能用 |
| `stitch agent-skills add --target claude` | `.claude/skills/stitch/` | 寫進特定 client 的 Skill 資料夾 |

在專案資料夾裡安裝：

```bash
stitch agent-skills add
```

| 旗標 | 作用 |
| --- | --- |
| `--user` | 全域安裝到 `~/.agents/skills/stitch/` |
| `--target` | 指定 client：`claude`、`antigravity` 或 `all` |
| `--overwrite` | 已有一個不是 CLI 安裝的 `stitch` Skill 資料夾時，取代它；原本的檔案會備份 |
| `--dir` | 自訂 Skill 資料夾 |

## Skill 內容

裝好後，在 agent 的對話框輸入 `/stitch` 即可使用。內含三份 playbook：

| Playbook | 檔案 | 內容 |
| --- | --- | --- |
| Canvas & Screen Design | `.agents/skills/stitch/SKILL.md` | 建立專案、產生畫面、上傳參考素材、用 `stitch edit screen` 反覆修改 |
| Design System Sync | `.agents/skills/stitch/flows/design.md` | 依程式碼庫或設計需求說明撰寫 [`DESIGN.md`](/cli/design-systems/)，並綁定到 Stitch 專案 |
| Local UI Review | `.agents/skills/stitch/flows/review.md` | 從本機開發伺服器擷取頁面，拿 DOM 與截圖和 `DESIGN.md` 比對 |

```text
/stitch Look at the /reserve page of this beef noodle shop site and tell me where it breaks our visual rules. There is no DESIGN.md yet, so draft one from the existing CSS first and upload it to the linked Stitch project before you start.
```

這段要 agent 檢查牛肉麵店網站的 `/reserve` 頁面哪裡不符合視覺規則；因為還沒有 `DESIGN.md`，先依現有 CSS 寫一份，上傳到已連結的 Stitch 專案，再開始檢查。

啟用 Workspace 功能（`stitch enable loop`）時，CLI 會自動升級已安裝的 `.agents/skills/stitch` 資料夾，加入從程式碼庫產生原型的 playbook `flows/prototype.md`。

## 查看與更新 Skill

```bash
stitch agent-skills list
stitch agent-skills update
```

| 指令 | 作用 |
| --- | --- |
| `stitch agent-skills list` | 顯示 Skill 裝在哪裡 |
| `stitch agent-skills update` | 更新到符合目前 CLI 版本；保留你在 Skill 檔案裡的修改 |
| `stitch agent-skills update --overwrite` | 取代你的修改；會保留一份備份 |

## 註冊 Stitch MCP 伺服器

```bash
stitch mcp install
```

不加旗標時，`stitch mcp install` 會在所有支援的編輯器註冊名為 `stitch` 的 MCP 伺服器：Antigravity、Claude（Claude Code 與 Claude Desktop）、Cursor、VS Code。

### 只設定一個編輯器

用 `--target` 指定編輯器。想先看會改哪些 JSON，加 `--dry-run`。

```bash
stitch mcp install --target antigravity
stitch mcp install --target claude
stitch mcp install --target cursor
stitch mcp install --target vscode
```

`claude` 會同時設定 Claude Code（`~/.claude.json`）和 Claude Desktop（`claude_desktop_config.json`）。

### 自訂設定檔

MCP client 用自己的設定檔時，讓它透過 `stdio` 執行 `stitch mcp start`：

```json
{
  "mcpServers": {
    "stitch": {
      "command": "stitch",
      "args": ["mcp", "start"]
    }
  }
}
```

### 七個工具

這個 MCP 伺服器提供七個格式一致的工具，命名比照 CLI 的指令結構：`stitch_find`、`stitch_get`、`stitch_create`、`stitch_edit`、`stitch_generate`、`stitch_delete`、`stitch_url`。

各工具的參數見 [CLI 的 MCP 工具參考](/cli/reference/mcp-tools/)。

另有一個在雲端執行的遠端 Stitch MCP 伺服器（`https://stitch.googleapis.com/mcp`），它的工具是 `create_project`、`generate_screen_from_text`、`edit_screens` 等，見 [MCP 設定](/mcp/setup/)與 [MCP 參考](/mcp/reference/)。
