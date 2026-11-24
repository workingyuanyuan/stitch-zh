---
title: CLI 快速上手
description: Stitch CLI 是 npm 套件 @google/stitch，在終端機或 coding agent 裡產生與預覽設計。
appliesTo: Stitch CLI（2026-11-20）
caveat: 在無圖形介面的環境或 CI 中，改用 STITCH_API_KEY 環境變數，或用 stitch config set 存全域的 apiKey 來驗證。
lastVerified: 2026-11-20
sources:
  - title: Stitch Docs：Stitch CLI Quickstart
    url: https://stitch.google.com/docs/cli/overview/
---

## 兩種用法

Stitch CLI 可以直接在終端機下指令，也可以裝上 `/stitch` Skill，讓 coding agent 代你操作。兩種方式都能從空資料夾開始，幾分鐘內在 `localhost` 看到可互動的設計。

| 用法 | 適合 | 起點 |
| --- | --- | --- |
| 終端機指令 | 想自己掌握每一步 | `stitch create project`、`stitch generate screen` |
| `/stitch` Skill | 使用 Claude Code、Antigravity 等 coding agent | `stitch agent-skills add --user` |

## 安裝

需要 Node.js 20 以上。用 npm 全域安裝 `@google/stitch`，再確認版本：

```bash
npm install -g @google/stitch
stitch --version
```

不想安裝時，可以用 `npx @google/stitch` 直接執行。

## 登入

`stitch login` 會開啟瀏覽器，用 Google OAuth 登入。登入一次，Stitch Canvas 專案和 Workspace 工作流程都通用。

```bash
stitch login
```

| 環境 | 驗證方式 |
| --- | --- |
| 有瀏覽器的電腦 | `stitch login` |
| 無圖形介面的環境、CI | 設定環境變數 `STITCH_API_KEY` |
| 無圖形介面的環境、CI | 把 API key 存進全域設定（指令如下） |

```bash
stitch config set apiKey "your_api_key_here" --global
```

隨時可以用 `stitch status` 查看登入狀態。

## 把 `/stitch` Skill 裝進 coding agent

使用 Claude Code、Antigravity 這類 coding agent 時，安裝 CLI 內附的 `/stitch` Skill，agent 就知道怎麼操作 CLI：

```bash
stitch agent-skills add --user
```

裝好後在 agent 的對話框輸入 `/stitch`，可以產生畫面、擷取與同步 [`DESIGN.md`](/cli/design-systems/)，或審查正在執行的 App。

```text
/stitch Create a new Stitch project called "Night Market Map" and generate a mobile screen that lists food stalls by row number, with a search bar at the top.
```

這段要求 agent 建立名為 Night Market Map 的專案，並產生一個依攤位排號列出小吃攤、上方有搜尋列的手機畫面。

## 在終端機產生第一個畫面

先建立 Stitch Canvas 專案，再把它固定到目前的資料夾。固定後，之後的指令不必每次加 `--project`。

```bash
stitch create project --title "Night Market Map"
stitch config set project <project-id>
```

用提示詞產生畫面：

```bash
stitch generate screen \
  --title "Stall List" \
  --device DESKTOP \
  --prompt "A food stall directory for a Taipei night market on a deep navy background (#1B2340) with lantern-orange accents, showing stall cards with photos, row numbers, and opening hours"
```

這段提示詞要一個台北夜市的攤位目錄：深藏青底色配燈籠橘強調色，卡片上有照片、攤位排號與營業時間。

畫面產生後，啟動本機預覽伺服器在 `localhost` 檢查實際的 HTML，或在瀏覽器開啟 Stitch Canvas 上的專案：

```bash
stitch serve
stitch open project
```

## 下一步

| 想做的事 | 做法 |
| --- | --- |
| 產生畫面、試變化版本、一次改一處 | [產生與修改畫面](/cli/screens-and-variants/) |
| 上傳自己的圖、在第一個提示詞明確設定構圖、在 `localhost` 加上互動 | [和 coding agent 反覆修改](/cli/agent-bridge/) |
| 用 `/stitch` 或 `stitch upload design` 把 `DESIGN.md` 綁到專案 | [同步設計系統](/cli/design-systems/) |
| 擷取本機開發伺服器上的頁面，上傳到 Stitch Canvas | [擷取執行中的 App](/cli/capture-and-upload/) |
| 拿執行中的 App 和 `DESIGN.md` 比對 | [審查 App 介面](/cli/design-review/) |

## 用在既有的儲存庫

要讓 Stitch 分析整個程式碼庫、找出路由，並依產品目標提出 UI 原型，先在這台電腦上啟用一次 Workspace 功能：

```bash
stitch enable loop
```

| 主題 | 內容 |
| --- | --- |
| [連接儲存庫](/cli/workspaces-and-projects/) | 把程式碼庫配對到 Stitch Workspace，並連結 Canvas 專案 |
| [Loop 與背景資料](/cli/priorities-and-context/) | 設定長期的 UI 原型目標，附上產品規格 |
| [從程式碼庫產生原型](/cli/codebase-prototyping/) | 把程式碼庫的 UX insight 與解決方案規格變成 Stitch Canvas 畫面 |
| [CLI 指令參考](/cli/reference/commands/) | 所有指令、子指令與旗標 |
