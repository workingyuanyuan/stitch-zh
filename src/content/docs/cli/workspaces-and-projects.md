---
title: 連接儲存庫
description: 把程式碼儲存庫連到 Stitch Workspace，讓 Stitch 依實際的路由與元件產生 UI 原型。
appliesTo: Stitch CLI（2026-11-20）
caveat: Workspace 功能屬於 Stitch Loop，只對從 waitlist 獲准的帳號有效；未獲准時指令仍會出現，但無法使用。
lastVerified: 2026-11-20
sources:
  - title: Stitch Docs：Connect a Repository
    url: https://stitch.google.com/docs/cli/workspaces-and-projects/
---

## Workspace 是什麼

逐一產生畫面適合從零開始。要讓 Stitch 理解既有的應用程式（路由、導覽、元件結構），就把儲存庫連到一個 Stitch Workspace。連上之後，Stitch 可以檢查實際的路由，依產品 loop 評估它們，並以真正的程式碼庫為基礎產生 UI 原型。

一個 Workspace 存放程式碼快照、loop、背景資料檔、insight，以及提出的解決方案。

## 啟用 Workspace 功能

`@google/stitch` CLI 預設以 Canvas 與 `DESIGN.md` 相關的指令為主。在這台電腦上執行一次 `stitch enable loop`，啟用 Workspace 功能：

```bash
stitch enable loop
```

它會：

- 開放所有 Workspace 指令：`workspace`、`loop`、`insight`、`solution`、`context`、`upload code`、`upload file`、`connect`、`github`、`api`、`cache`。
- 自動更新已安裝的 `/stitch` Skill（`.agents/skills/stitch/`），加入導入程式碼庫用的 playbook。

### 誰能用

| 帳號狀態 | 結果 |
| --- | --- |
| 已從 [waitlist](https://stitch.google.com/loop) 獲准使用 Stitch Loop | Workspace 指令可以用；CLI 第一次看到獲准通知時會自動啟用，不必自己執行 `stitch enable loop` |
| 尚未獲准 | `stitch enable loop` 仍會顯示 Workspace 指令，但指令無法運作 |
| 所有帳號 | Canvas 與 `DESIGN.md` 指令都能用 |

要關掉 Workspace 指令，執行 `stitch disable loop`。

## 用 `/stitch` Skill 導入儲存庫

最簡單的方式是讓 `/stitch` Skill 帶你走一遍。確認已安裝（`stitch agent-skills add`），在儲存庫裡呼叫 `/stitch`：

```text
/stitch I'd like Stitch to start proposing UI prototypes for our hiking club's booking site. Use this repo as the source: pick or make a workspace for it, and bring today's trail and booking pages onto the Canvas so the prototypes start from them.
```

這段要 agent 讓 Stitch 開始為登山社團的報名網站提出 UI 原型：以這個儲存庫為來源，選擇或建立一個 Workspace，並把現有的步道與報名頁面放上畫布，讓原型從這些頁面出發。

coding agent 會依序：

1. 檢查登入狀態。
2. 協助選擇或建立 Workspace。
3. 上傳程式碼快照。
4. 從本機開發伺服器擷取應用程式的路由。
5. 連結 Stitch Canvas 專案。

只有在要你決定用哪個 Workspace 或哪些路由時，才會停下來等你核准。

## 從終端機連接

自己執行時分三步：選 Workspace、讓 Stitch 讀得到程式碼、連結 Canvas 專案。

### 1. 建立並固定 Workspace

列出既有的 Workspace 或建立新的，再固定到儲存庫：

```bash
stitch find workspaces --limit 10
stitch create workspace --name "Ridge Line Booking"
stitch config set workspace <workspace-id>
```

固定後會存進 `.stitch.json`，之後的指令不必每次加 `--workspace`。

### 2. 上傳程式碼或連接 GitHub

| 方法 | 適合 |
| --- | --- |
| `stitch upload code .` | 最快：直接從終端機上傳工作樹中受 Git 追蹤的檔案，不必安裝 GitHub App |
| 連接 GitHub | 要讓 Stitch 和 GitHub 儲存庫保持同步，或自動開 pull request |

```bash
stitch upload code .
```

連接 GitHub：

```bash
stitch github login
stitch github install
stitch github repos
stitch edit workspace <workspace-id> --add-repo https://github.com/<owner>/<repo>
```

### 3. 連結 Stitch Canvas 專案

把 Stitch Canvas 專案綁到 Workspace，擷取的路由與產生的原型才會放到對的畫布上：

```bash
stitch loop link --project <project-id>
```

## 連接外部工具

團隊把產品資料放在外部工具時，可以瀏覽整合目錄，把連線或 webhook 加到 Workspace：

```bash
stitch connect --list
stitch connect <catalog-id>
stitch find connections
```

下一步：[設定 loop 與背景資料](/cli/priorities-and-context/)。
