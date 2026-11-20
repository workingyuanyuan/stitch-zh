---
title: CLI 指令參考
description: Stitch CLI（@google/stitch）所有指令、旗標、環境變數與結束碼的查詢表。
appliesTo: Stitch CLI（@google/stitch 0.13.0，2026-11-20）
caveat: 標示 Workspace 的指令與資源要先在本機執行一次 stitch enable loop 才能使用；標示 Default 的不需要。
lastVerified: 2026-11-20
sources:
  - title: Stitch Docs：CLI Commands
    url: https://stitch.google.com/docs/cli/reference/commands/
  - title: Stitch Docs：Stitch CLI Quickstart
    url: https://stitch.google.com/docs/cli/overview/
  - title: "@google/stitch 0.13.0：README"
    url: https://unpkg.com/@google/stitch@0.13.0/README.md
---

## 指令總覽

`@google/stitch` CLI 的指令分成兩種：操作資源的動詞（`find`、`get`、`create`、`edit`、`delete`、`generate`、`open`、`url`），以及畫布、擷取與設定相關的指令。

「範圍」一欄是 `Default` 的指令不需要額外開啟；是 `Workspace` 的指令，要先在本機執行一次：

```shell
stitch enable loop
```

| 指令 | 類別 | 範圍 | 用途 |
| --- | --- | --- | --- |
| `stitch create` | 資源 | Default | 建立資源 |
| `stitch delete` | 資源 | Default | 依 ID 刪除資源 |
| `stitch edit` | 資源 | Default | 修改資源可變更的欄位 |
| `stitch find` | 資源 | Default | 依條件列出資源 |
| `stitch generate` | 資源 | Default | 產生畫面、變化版本、insight 或 solution |
| `stitch get` | 資源 | Default | 依 ID 取得資源，或評估診斷狀態機 |
| `stitch capture` | 動作與畫布 | Default | 把網頁擷取成可獨立開啟的 HTML |
| `stitch connect` | 動作與畫布 | Workspace | 以服務商的 OAuth 流程把工具接到 Workspace |
| `stitch open` | 動作與畫布 | Default | 在瀏覽器開啟專案或畫面 |
| `stitch serve` | 動作與畫布 | Default | 啟動本機預覽伺服器 |
| `stitch upload` | 動作與畫布 | Default | 上傳檔案、程式碼封存或設計素材 |
| `stitch url` | 動作與畫布 | Default | 印出專案或畫面的標準畫布網址 |
| `stitch config` | 驗證與設定 | Default | 讀寫 CLI 設定 |
| `stitch disable` | 驗證與設定 | Default | 關閉實驗性功能 |
| `stitch enable` | 驗證與設定 | Default | 開啟實驗性功能 |
| `stitch github` | 驗證與設定 | Workspace | 管理 GitHub 帳號連線與 GitHub App 安裝 |
| `stitch login` | 驗證與設定 | Default | 以 Google OAuth 登入，或儲存 API key |
| `stitch logout` | 驗證與設定 | Default | 登出並移除本機憑證 |
| `stitch privacy` | 驗證與設定 | Default | 查看與接受隱私權聲明及服務條款 |
| `stitch status` | 驗證與設定 | Default | 顯示驗證與 GitHub 狀態，或評估引導流程 |
| `stitch agent-skills` | 進階 | Default | 安裝與更新本機的 Stitch agent Skill |
| `stitch api` | 進階 | Workspace | 直接呼叫 REST API 或查看 schema |
| `stitch mcp` | 進階 | Default | 管理與啟動 Stitch MCP 伺服器 |
| `stitch cache` | 其他 | Workspace | 查看與清理本機快取 |
| `stitch download` | 其他 | Default | 下載畫面的 HTML 與截圖 |
| `stitch feedback` | 其他 | Default | 送出產品意見回饋 |
| `stitch dismiss` | 其他 | 只見於 README 0.13.0 | 把 insight 從推薦中隱藏 |

## 安裝與執行檔

需要 Node.js 20 以上：

```shell
npm install -g @google/stitch
```

也可以不安裝，直接用 `npx @google/stitch` 執行。套件 0.13.0 會安裝兩個執行檔：`stitch`，以及 `stitch-mcp`（等同 `stitch mcp start`）。

## 全域旗標

以下旗標可以加在任何 `stitch` 指令後面。

| 旗標 | 型別 | 用途 |
| --- | --- | --- |
| `--access-token` | `string` | OAuth 2.0 存取權杖（環境變數 `STITCH_ACCESS_TOKEN`） |
| `--api-key` | `string` | 只在這次執行使用的 API key（環境變數 `STITCH_API_KEY`） |
| `--base-url` | `string` | API 基底網址（環境變數 `STITCH_BASE_URL`） |
| `--color` | `enum` | 何時輸出 ANSI 色碼：`auto`、`always`、`never`，預設 `auto` |
| `--debug` | `boolean` | 顯示除錯資訊，包含堆疊追蹤 |
| `--expand` | `boolean` | 詳細檢視時顯示完整內容（例如 context get、solutions get） |
| `--fields` | `string` | 以逗號分隔的欄位遮罩 |
| `--format`、`-f` | `enum` | 輸出格式：`table`、`markdown`、`json`、`ndjson`，預設自動判斷；README 0.13.0 寫在終端機中預設 `table` |
| `--json` | `boolean` | 輸出 JSON。README 0.13.0 寫作 `--json [payload]`：在 `create`、`edit`、`get`、`find`、`api` 也接受原始 JSON 輸入內容，例如 `--json '{...}'` |
| `--no-cache` | `boolean` | 略過本機快取，全部從網路取得 |
| `--quiet`、`-q` | `boolean` | 隱藏非必要的輸出與橫幅 |
| `--schema` | `boolean` | 自我描述：寫入類指令顯示 schema，讀取類指令顯示欄位清單。README 0.13.0 寫作印出指令或資源的 JSON Schema（Draft 2020-12） |
| `--trace` | `boolean` | 把原始 HTTP 追蹤與可重現的 cURL 指令輸出到 stderr |
| `--workspace`、`-w` | `string` | Workspace ID（用 `stitch find workspaces` 列出；環境變數 `STITCH_WORKSPACE`） |

README 0.13.0 的全域旗標表還列了 `--dry-run`：在會修改資料的指令上驗證並預覽，不呼叫後端。

`--schema` 可以只看一種資源，例如：

```shell
stitch generate --schema
stitch generate screen --schema
```

## 環境變數

| 變數 | 用途 |
| --- | --- |
| `STITCH_API_KEY` | 用 API key 代替 OAuth 登入，等同 `--api-key` |
| `STITCH_ACCESS_TOKEN` | OAuth 2.0 存取權杖，等同 `--access-token` |
| `STITCH_PROJECT_ID` | 預設的 Stitch 專案 ID，等同 `--project` |
| `STITCH_WORKSPACE` | 預設的 Workspace ID，等同 `--workspace` |
| `STITCH_BASE_URL` | API 基底網址，等同 `--base-url` |
| `STITCH_CANVAS_URL` | 產生畫布連結時使用的 Stitch 網頁主機，預設 `https://stitch.google.com` |
| `STITCH_FORMAT` | 預設輸出格式，等同 `--format` |
| `STITCH_QUIET` | 隱藏非必要的輸出與橫幅，等同 `--quiet` |
| `STITCH_NO_CACHE` | 設為 `1` 關閉本機快取 |
| `STITCH_NO_BROWSER` | 永不開啟瀏覽器，改為印出網址 |

README 0.13.0 寫：畫布指令（專案、畫面、設計系統）除了 OAuth 之外可能還需要 API key；指令以 `MISSING_CANVAS_CREDENTIALS` 失敗時，設定 `STITCH_API_KEY`：

```shell
export STITCH_API_KEY=your-api-key
```

[CLI 快速入門](/cli/overview/) 的說法不同，見[差異表](#和已發布套件的差異)。

## 結束碼

| 結束碼 | 意思 |
| --- | --- |
| `0` | 成功 |
| `1` | 執行失敗：網路、驗證或 API 錯誤 |
| `2` | 用法錯誤：未知的指令或旗標、缺少必要引數、值或 JSON 內容無效 |
| `124` | `stitch generate insights --watch` 逾時（見 `--timeout`） |

## 資源與動詞對照

資源指令的寫法是 `stitch <動詞> [resource] [id] [flags]`。下表列出每種資源能搭配哪些動詞（✓ 表示支援）。表中的資源名稱是單數；指令範例中也使用複數，例如 `stitch find projects`、`stitch generate variants`。

| 資源 | 範圍 | 說明 | create | delete | edit | find | generate | get | open / url |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `project` | Default | 放生成畫面的 Stitch 畫布 | ✓ | ✓ | | ✓ | | ✓ | ✓ |
| `screen` | Default | 畫布上的單一生成設計 | ✓ | | ✓ | ✓ | ✓ | ✓ | ✓ |
| `design-system` | Default | 套用到生成畫面的共用視覺語言 | ✓ | | ✓ | ✓ | | ✓ | |
| `variant` | Default | 從既有畫面產生的設計變化版本 | | | | | ✓ | | |
| `status` | Default | Workspace 的 11 狀態引導與診斷狀態機 | | | | | | ✓ | |
| `workspace` | Workspace | 與 Stitch 配對的儲存庫，存放 loop、insight 與 context | ✓ | ✓ | ✓ | ✓ | | ✓ | |
| `context` | Workspace | 附加到 Workspace 的外部資料，讓 Stitch 不只參考程式碼 | ✓ | ✓ | ✓ | ✓ | | ✓ | |
| `file` | Workspace | 上傳到 Workspace 的單一檔案 | | ✓ | ✓ | ✓ | | ✓ | |
| `skill` | Workspace | 影響 Stitch agent 如何解讀 Workspace 的指示 | ✓ | ✓ | ✓ | ✓ | | ✓ | |
| `loop` | Workspace | 常設指令：目標加上自主等級，Stitch 持續朝它工作 | ✓ | ✓ | ✓ | ✓ | | ✓ | |
| `webhook` | Workspace | Workspace 事件發生時呼叫的 HTTP 回呼 | ✓ | ✓ | ✓ | ✓ | | ✓ | |
| `insight` | Workspace | Stitch 依 loop 分析程式碼時找到、對應到特定路由的改進機會 | | | | ✓ | ✓ | ✓ | |
| `solution` | Workspace | 回應某個 insight 的修改提案 | | | | ✓ | ✓ | ✓ | |
| `connection` | Workspace | 把 Workspace 接到外部工具（例如 Slack 或 MCP 伺服器）的整合 | ✓ | ✓ | | ✓ | | ✓ | |
| `organization` | Workspace | 組織設定與 GitHub App 安裝 | | | | ✓ | | ✓ | |

- `skill` 資源不同於 `stitch agent-skills`：後者是在本機寫入 `SKILL.md` 檔案。
- GitHub 不用 `connection` 連結，而是用 `stitch github install`（README 0.13.0 的寫法不同，見[差異表](#和已發布套件的差異)）。
- `priority`、`priorities` 是 loop 的舊名稱。README 0.13.0 寫明舊的資源名稱與 `--priority` 旗標仍然可用。
- 不是每種資源都支援每個動詞；`stitch <動詞> --schema` 會列出支援的資源。
- `stitch download` 只支援 `screen`。

## 資源指令

### stitch create

建立一個資源。語法：`stitch create [resource] [flags]`。

| 旗標 | 型別 | 用途 |
| --- | --- | --- |
| `--apply` | `boolean` | 把建立的設計系統自動套用到專案裡的畫面（僅 design-system） |
| `--autonomy-level` | `string` | 自主等級：`CREATE_SUGGESTIONS` 或 `CREATE_ASSETS`（僅 loop） |
| `--description` | `string` | loop 的說明，或 context 的內容（僅 loop 與 context） |
| `--dry-run` | `boolean` | 驗證內容並預覽變更，不呼叫 API |
| `--interactive`、`-i` | `boolean` | 從推薦的起始範本中挑選（僅 loop） |
| `--name` | `string` | Workspace 名稱（僅 workspace；也接受 `--title`） |
| `--objective` | `string` | loop 的目標敘述（僅 loop） |
| `--project`、`-p` | `string` | Stitch 專案 ID（用 `stitch find projects` 列出；環境變數 `STITCH_PROJECT_ID`） |
| `--provider` | `string` | 來自 `stitch find connections` 的服務商 ID，例如 `slack`、`linear`（僅 connection） |
| `--screen` | `string` | 要套用新設計系統的畫面 ID，多個以逗號分隔（僅 design-system） |
| `--template`、`-t` | `string` | 用範本 ID、標題或從 1 起算的序號建立（僅 loop） |
| `--templates` | `boolean` | 只列出推薦的起始範本，不建立任何東西（僅 loop） |
| `--title` | `string` | 專案標題，或 context 標籤（僅 project 與 context） |

```shell
stitch create project --title "Checkout Redesign"
stitch create workspace --name "Acme Web App"
stitch create loop --workspace <workspace-id> --template ui-prototyping
stitch create context --workspace <workspace-id> --title "Q3 Metrics" --description "Weekly active users grew 12% quarter over quarter."
stitch create connection --workspace <workspace-id> --provider slack
stitch create project --json '{"title":"Customer Dashboard Redesign"}'
```

最後一行是 README 0.13.0 的例子：用 `--json` 傳入原始內容，而不是用旗標。

要從 `DESIGN.md` 檔案建立設計系統，改用 `stitch upload design`。

### stitch delete

依 ID 刪除一個資源。語法：`stitch delete [resource] [id] [flags]`，ID 也可以用 `--id` 傳入。

| 旗標 | 型別 | 用途 |
| --- | --- | --- |
| `--dry-run` | `boolean` | 驗證並預覽刪除，不呼叫 API |
| `--force` | `boolean` | 不確認，直接刪除 |
| `--id` | `string` | 要刪除的資源 ID |
| `--project`、`-p` | `string` | Stitch 專案 ID |
| `--yes`、`-y` | `boolean` | 略過確認提示 |

```shell
stitch delete project <project-id> --force
stitch delete loop <loop-id> --workspace <workspace-id> --force
stitch delete context <context-id> --workspace <workspace-id> --force
```

不在互動式終端機裡執行時，沒加 `--yes`（或 `--force`）的 `stitch delete` 會失敗，所以在腳本與 CI 中要加上。

### stitch edit

修改資源中可變更的欄位；對畫面來說，是依提示詞重新生成。語法：`stitch edit [resource] [id] [flags]`，ID 也可以用可重複的 `--id <id>` 傳入。

| 旗標 | 型別 | 用途 |
| --- | --- | --- |
| `--add-repo` | `string` | 為 Workspace 加入儲存庫（網址、`owner/repo` 簡寫或 ID） |
| `--design-system` | `string` | 要套用到目標畫面的設計系統素材 ID |
| `--device` | `string` | 目標畫面的裝置類型：`DESKTOP` 或 `MOBILE` |
| `--dry-run` | `boolean` | 驗證內容並預覽變更，不呼叫 API |
| `--model` | `string` | 編輯畫面用的模型：`GEMINI_3_8_FLASH` 或 `GEMINI_3_5_FLASH_LITE` |
| `--objective` | `string` | 新的目標。目標不能修改，所以這會用一個新 ID 的 loop 取代原本的 loop（僅 loop） |
| `--project`、`-p` | `string` | Stitch 專案 ID |
| `--prompt` | `string` | 描述畫面修改方向與風格的提示詞 |
| `--remove-repo` | `string` | 從 Workspace 移除儲存庫（網址、`owner/repo` 簡寫或 ID） |

README 0.13.0 另列 `--json '{...}'`：傳入原始的 patch 內容，例如修改 `design-system` 時。

```shell
stitch edit screen <screen-id> --project <project-id> --prompt "Shrink the header and keep the order button visible"
stitch edit screen <screen-id> --project <project-id> --design-system <design-system-id>
stitch edit workspace <workspace-id> --add-repo <owner>/<repo>
stitch edit loop <loop-id> --workspace <workspace-id> --json '{"description":"Focus on mobile schedule views"}'
```

第一行的提示詞要求縮小頁首，並讓點餐按鈕保持可見。

### stitch find

依條件列出資源。語法：`stitch find [resource] [flags]`。

| 旗標 | 型別 | 用途 |
| --- | --- | --- |
| `--filter` | `string` | 篩選運算式 |
| `--insight` | `string` | 依 insight ID 篩選，多個以逗號分隔 |
| `--limit` | `string` | 最多回傳幾筆 |
| `--loop` | `string` | 依 loop ID 篩選，多個以逗號分隔 |
| `--page-size` | `string` | 每頁向 API 要求的筆數上限 |
| `--page-token` | `string` | 取下一頁結果用的權杖 |
| `--project`、`-p` | `string` | Stitch 專案 ID |

```shell
stitch find projects --limit 10
stitch find screens --project <project-id>
stitch find design-systems
stitch find loops --workspace <workspace-id>
stitch find insights --workspace <workspace-id> --loop <loop-id>
```

### stitch generate

觸發生成：畫面（`screen`）、變化版本（`variants`）、insight（`insights`）或 solution（`solutions`）。語法：`stitch generate [resource] [flags]`。

| 旗標 | 型別 | 用途 |
| --- | --- | --- |
| `--aspects` | `string` | 要變化的面向，以逗號分隔：`LAYOUT`、`COLOR_SCHEME`、`IMAGES`、`TEXT_FONT`、`TEXT_CONTENT` |
| `--count` | `string` | 變化版本的數量（1-5） |
| `--creative-range` | `string` | 變化版本離原畫面多遠：`REFINE`、`EXPLORE`、`REIMAGINE` |
| `--delay` | `boolean` | 延後執行 insight 生成 |
| `--device`、`-d` | `string` | 目標畫面的裝置類型：`DESKTOP` 或 `MOBILE` |
| `--dry-run` | `boolean` | 驗證內容並預覽動作，不呼叫後端 |
| `--insight` | `string` | 產生 solution 用的 insight ID，多個以逗號分隔 |
| `--interval` | `string` | 搭配 `--watch` 的輪詢間隔毫秒數（預設 2000，排隊中最長 60000） |
| `--loop` | `string` | 產生 insight 用的 loop ID，多個以逗號分隔 |
| `--model` | `string` | 生成模型 ID：`GEMINI_3_8_FLASH` 或 `GEMINI_3_5_FLASH_LITE` |
| `--new-project` | `string` | 建立新的 Stitch 專案，可附標題 |
| `--notify` | `boolean` | 搭配 `--watch`，結束時送出桌面通知 |
| `--project`、`-p` | `string` | Stitch 專案 ID |
| `--prompt` | `string` | 描述畫面或變化版本設計方向與風格的提示詞 |
| `--replace-existing` | `boolean` | 產生 solution 時取代既有未指派的 solution |
| `--screen` | `string` | 產生變化版本的來源畫面 ID |
| `--timeout` | `string` | 搭配 `--watch`，放棄前等待的秒數（預設 3600） |
| `--title` | `string` | 畫面標題，會寫進提示詞（Stitch 可能另取標題，此時會顯示警告）。搭配 `--new-project` 且沒有 `--project` 時，改為新專案的名稱 |
| `--watch` | `boolean` | 等到 insight 生成結束。結束碼：`0` 完成、`1` 失敗、`124` 逾時 |

```shell
stitch generate screen --project <project-id> --prompt "Bubble tea shop menu with a seasonal drinks carousel"
stitch generate screen --new-project "Hiking Club" --prompt "Trail sign-up form with date and difficulty pickers" --device MOBILE
stitch generate variants --screen <screen-id> --project <project-id> --count 2 --creative-range EXPLORE --prompt "Try a night market neon palette"
stitch generate insights --workspace <workspace-id> --loop <loop-id> --watch
stitch generate solutions --insight <insight-id>
```

前三行的提示詞分別要求：有季節飲品輪播的手搖飲菜單、選日期與難度的登山社報名表單、改用夜市霓虹配色的變化版本。

### stitch get

依 ID 取得一個資源，或以 `status` 評估診斷狀態機（要評估引導流程並取得目前步驟，改用 `stitch status --flow`）。語法：`stitch get [resource] [id] [flags]`。唯一的指令旗標是 `--project`（`-p`）。

```shell
stitch get project <project-id>
stitch get screen <screen-id> --project <project-id>
stitch get design-system <asset-id>
stitch get loop <loop-id> --workspace <workspace-id>
```

## 動作與畫布指令

### stitch capture

把網頁擷取成畫布可用、可獨立開啟的 HTML，常用寫法是 `stitch capture <url|path> [-o file]`，或用 `--tab` 擷取開著的分頁。完整語法：`stitch capture [target] [flags]` 或 `stitch capture <subcommand> [flags]`。`target` 是要載入的網址或本機 HTML 檔案路徑；用 `--tab` 時省略。

| 旗標 | 型別 | 用途 |
| --- | --- | --- |
| `--allow-redirect` | `boolean` | 頁面最後停在和要求不同的路由時，仍然儲存 |
| `--auth` | `string` | 登入狀態檔（Playwright storageState JSON） |
| `--origin` | `string` | 擷取檔案時，提供其根相對路徑素材的來源，例如 `http://localhost:3000` |
| `--output`、`-o` | `string` | HTML 存放位置（預設 `.stitch/captures/<route>.html`，例如 `/checkout` 存成 `.stitch/captures/checkout.html`；`-` 表示輸出到 stdout） |
| `--prepare` | `string` | 擷取前在頁面內執行的 JS 檔路徑（登入、準備資料）。用 `__stitchWaitFor("#selector")` 等待應用程式狀態 |
| `--settle-timeout` | `string` | 等待載入指示（骨架、`aria-busy`、轉圈）消失的最長毫秒數（預設 15000） |
| `--tab` | `string` | 不載入網址，直接擷取一個開著的 chrome-devtools 分頁（可附分頁 ID） |
| `--wait-for` | `string` | 擷取前等待出現的 CSS 選擇器 |
| `--wait-until` | `string` | 水合完成的判斷條件：`networkidle0`（預設）、`networkidle2`、`load`、`domcontentloaded` |

| 子指令 | 用途 |
| --- | --- |
| `capture browser` | （進階）在 Chrome 擷取網址，或用 `--tab` 擷取開著的分頁；等同 `stitch capture <url>` |
| `capture port` | （進階）透過 HTTP 取得伺服器端渲染的 HTML，不執行 JavaScript |
| `capture file` | （進階）把本機 HTML 檔或 stdin 變成可獨立開啟的檔案；等同 `stitch capture <path>` |
| `capture routes` | 列出在程式碼中找到的應用程式路由 |

```shell
stitch capture http://localhost:3000/library
stitch capture --tab --output .stitch/dashboard.html
stitch capture .stitch/page.html --origin http://localhost:3000
stitch capture http://localhost:3000/studio --auth .stitch/storage.json
stitch capture routes
```

### stitch connect（Workspace）

以服務商的 OAuth 流程，把工具或整合接到 Workspace。語法：`stitch connect [toolId] [flags]`。`toolId` 是工具或服務商 ID（例如 `github`、`slack`）；省略或加 `--list` 會列出可用選項。

| 旗標 | 型別 | 用途 |
| --- | --- | --- |
| `--all` | `boolean` | 列出所有可用整合，不限熱門前 25 個 |
| `--connected` | `boolean` | 只顯示已連線的整合 |
| `--list`、`-l` | `boolean` | 列出可連線的工具與服務商 ID |
| `--no-browser` | `boolean` | 不自動開啟瀏覽器 |
| `--search`、`-s` | `string` | 依 ID、顯示名稱或說明篩選整合 |
| `--timeout` | `string` | 等待連線的秒數（預設 120） |

```shell
stitch connect --list
stitch connect slack --no-browser --timeout 180
```

### stitch open

在瀏覽器開啟專案或畫面，資源只能是 `project` 或 `screen`。語法：`stitch open [resource] [id] [flags]`。`id` 可以是專案或畫面 ID、`projects/<p>/screens/<s>` 形式的名稱，或畫布網址；省略時使用這個資料夾的專案或參考畫面。

| 旗標 | 型別 | 用途 |
| --- | --- | --- |
| `--project`、`-p` | `string` | Stitch 專案 ID |
| `--url`、`-print` | `boolean` | 印出網址而不開啟（環境變數 `STITCH_NO_BROWSER`、`BROWSER`） |

```shell
stitch open project <project-id>
stitch open screen <screen-id> --project <project-id>
```

### stitch serve

為 Stitch 專案的畫面啟動本機預覽開發伺服器。語法：`stitch serve [flags]`。

| 旗標 | 型別 | 用途 |
| --- | --- | --- |
| `--dry-run` | `boolean` | 檢查伺服器設定，不佔住終端機 |
| `--port` | `string` | 監聽的本機連接埠（預設 3000） |
| `--project`、`-p` | `string` | 要預覽的 Stitch 專案 ID |

### stitch upload

上傳檔案、程式碼封存或設計素材。語法：`stitch upload <subcommand> [flags]`。

| 子指令 | 範圍 | 用途 |
| --- | --- | --- |
| `upload code` | Workspace | 上傳程式碼封存（`.zip` 或資料夾） |
| `upload design` | Default | 把 `DESIGN.md` 檔案上傳到 Stitch 畫布專案 |
| `upload file` | Workspace | 上傳檔案到 Workspace（`.md` 與 `.txt` 會存成 context） |
| `upload screen` | Default | 把 HTML 或圖片檔上傳成畫布上的畫面 |

| 子指令 | 旗標 | 用途 |
| --- | --- | --- |
| `upload code` | `--name`、`-n` | 程式碼封存的顯示名稱 |
| `upload code` | `--description` | 程式碼的說明 |
| `upload code` | `--dry-run` | 預覽變更，不執行 |
| `upload design` | `--project`、`-p` | 目標畫布專案 ID（預設為 manifest 的專案 ID） |
| `upload design` | `--apply` | 把上傳的設計系統自動套用到專案裡的畫面 |
| `upload design` | `--screen` | 要套用設計系統的畫面 ID，多個以逗號分隔 |
| `upload design` | `--cwd` | 目標工作資料夾 |
| `upload design` | `--dry-run` | 驗證內容並預覽上傳，不呼叫 API |
| `upload file` | `--name`、`-n` | 檔案的顯示名稱 |
| `upload file` | `--description` | 檔案的說明 |
| `upload file` | `--mime-type`、`-m` | 檔案的 MIME 類型（省略時依副檔名判斷） |
| `upload file` | `--dry-run` | 預覽變更，不執行 |
| `upload screen` | `--project`、`-p` | 目標畫布專案 ID（預設為已連結的專案） |
| `upload screen` | `--title` | 畫面標題（預設為檔名） |
| `upload screen` | `--route` | 把這個畫面記錄為 manifest 中該路由的參考畫面 |
| `upload screen` | `--cwd` | 目標工作資料夾 |
| `upload screen` | `--dry-run` | 驗證上傳，不呼叫 Stitch |

```shell
stitch upload design DESIGN.md --project <project-id> --apply
stitch upload screen .stitch/checkout.html --route /checkout --title Checkout
stitch upload file ./docs/architecture.pdf --name "Architecture Doc"
stitch upload code .
```

### stitch url

印出專案或畫面的標準畫布網址；需要連結時用它，不要自己猜網址。語法：`stitch url [resource] [id] [flags]`，`resource` 與 `id` 的寫法和 `stitch open` 相同。唯一的指令旗標是 `--project`（`-p`）。

```shell
stitch url project <project-id>
stitch url screen <screen-id> --project <project-id>
```

## 驗證與設定指令

### stitch config

讀寫 CLI 設定。語法：`stitch config <subcommand> [flags]`。

| 子指令 | 用途 |
| --- | --- |
| `config list` | 顯示依完整優先順序解析後的設定（`--global` 只看全域設定） |
| `config get` | 依鍵取得單一設定值 |
| `config set` | 設定一個值（寫入 `.stitch.json`；`--global` 寫入 `~/.stitch.json`） |
| `config unset` | 移除一個設定鍵（`--global` 從 `~/.stitch.json` 移除） |

`.stitch.json` 放每個儲存庫自己的預設值，例如專案與 Workspace：

```shell
stitch config set project 1234567890
stitch config get project
stitch config list
stitch config unset project
stitch config set workspace <workspace-id>
```

README 0.13.0 寫 `config list` 顯示從旗標、環境變數與設定檔解析出的值。

### stitch enable 與 stitch disable

在全域開啟或關閉實驗性功能。語法：`stitch enable [feature] [flags]`、`stitch disable [feature] [flags]`，兩者都有 `--dry-run`（預覽變更，不執行）。

`loop` 功能開啟後，可以使用 `api`、`connect` 等 Workspace 指令，以及 workspace、loop 等資源。README 0.13.0 寫 Loop 預設關閉，它的指令、API、資源與旗標可能在版本之間改變，不一定會升主版本號。

```shell
stitch enable loop
stitch disable loop
```

### stitch github（Workspace）

管理 GitHub 帳號連線、OAuth 授權與 GitHub App 的組織安裝。語法：`stitch github <subcommand> [flags]`。

| 子指令 | 用途 |
| --- | --- |
| `github login` | 在瀏覽器開啟 OAuth 授權頁登入 GitHub。別名 `github auth`；加 `--reauth` 強制重新驗證 |
| `github install` | 設定 GitHub App 的組織安裝與儲存庫存取權限。別名 `github configure` |
| `github status` | 查看 GitHub 整合狀態、已連結的組織與可存取的儲存庫 |
| `github repos` | 列出 Stitch GitHub App 能存取、可附加到 Workspace 的儲存庫 |

### stitch login 與 stitch logout

`stitch login` 以 Google OAuth 2.0 PKCE 驗證，或儲存一組永久 API key。唯一的指令旗標是 `--port`：本機回呼連接埠，預設 8085。README 0.13.0 補充：權杖存在本機並自動更新。

`stitch logout` 登出，並移除本機的 OAuth 憑證與已儲存的 API key。

### stitch privacy

管理與查看 Stitch 隱私權聲明及服務條款的確認狀態。語法：`stitch privacy <subcommand> [flags]`。

| 子指令 | 用途 |
| --- | --- |
| `privacy status` | 查看伺服器上的隱私權聲明確認狀態 |
| `privacy accept` | 在網頁開啟服務條款並等待接受 |
| `privacy show` | 顯示隱私權聲明與服務條款網頁的網址（`--open` 直接在瀏覽器開啟） |

### stitch status

顯示驗證、畫布憑證與 GitHub 狀態，或用 `--flow` 評估引導流程。語法：`stitch status [flowArg] [flags]`，`flowArg` 可以是 `design` 或 `loop`。

| 旗標 | 型別 | 用途 |
| --- | --- | --- |
| `--cwd` | `string` | 評估流程時使用的工作資料夾 |
| `--flow` | `string` | 評估引導流程並回傳目前步驟（`design` 或 `loop`） |
| `--token` | `boolean` | 印出有效的 OAuth bearer 存取權杖（過期時自動更新） |

## 進階指令

### stitch agent-skills

安裝與更新本機的 Stitch agent Skill。Workspace 裡的 Skill 要用 `stitch find skills` 查看。語法：`stitch agent-skills <subcommand> [flags]`。

| 子指令 | 用途 |
| --- | --- |
| `agent-skills add` | 依目前模式安裝 Stitch agent Skill |
| `agent-skills list` | 顯示目前模式與 Stitch Skill 的安裝位置 |
| `agent-skills update` | 讓已安裝的 Skill 跟上目前模式與 CLI 版本 |

| 子指令 | 旗標 | 用途 |
| --- | --- | --- |
| `add` | `--project`、`-p` | 安裝到這個專案的 `.agents/skills`（預設） |
| `add` | `--user`、`-u` | 安裝到 `~/.agents/skills`，所有專案共用（別名 `--global`、`-g`） |
| `add` | `--dir` | 專案內（加 `-u` 時為家目錄內）的 Skill 資料夾 |
| `add`、`list`、`update` | `--target` | 目標用戶端：`claude`、`antigravity` 或 `all` |
| `add` | `--overwrite` | 取代不是由 CLI 安裝的既有 stitch 資料夾（原檔會備份） |
| `update` | `--overwrite` | 取代在本機修改過的 Skill 檔案（會保留備份） |
| `add`、`update` | `--dry-run` | 預覽變更，不執行 |

### stitch api（Workspace）

直接對 Stitch 端點呼叫 REST API，或查看 OpenAPI／Discovery schema。語法：`stitch api [path] [flags]`。`path` 是端點路徑或 Discovery 方法 ID，例如 `/v2alpha/workspaces` 或 `workspaces.list`。端點清單見 [REST API 參考](/cli/reference/rest-api/)。

| 旗標 | 型別 | 用途 |
| --- | --- | --- |
| `--dryRun` | `boolean` | 驗證內容並預覽請求，不呼叫 API |
| `--filter` | `string` | 依關鍵字或條件篩選項目 |
| `--force` | `boolean` | 不確認，直接執行 |
| `--method`、`-X` | `string` | HTTP 方法：`GET`、`POST`、`PATCH`、`PUT`、`DELETE`（預設 `GET`） |
| `--yes`、`-y` | `boolean` | 略過確認提示 |

注意這個指令的預覽旗標是 `--dryRun`；其他有預覽旗標的指令用的是 `--dry-run`。

README 0.13.0 的範例（旗標與路徑的差異見[差異表](#和已發布套件的差異)）：

```shell
stitch api workspaces
stitch api workspaces/<id>/loops --schema
```

### stitch mcp

管理與啟動 CLI 內建的 Stitch MCP 伺服器。語法：`stitch mcp <subcommand> [flags]`。這個伺服器提供的工具見 [MCP 工具參考](/cli/reference/mcp-tools/)，設定步驟見 [Agent Skills 與 MCP](/cli/mcp-and-skills/)。

| 子指令 | 用途 |
| --- | --- |
| `mcp start` | 透過 stdio 啟動 Stitch MCP 伺服器。別名 `mcp run` |
| `mcp install` | 在 AI 編輯器中註冊 Stitch MCP 伺服器 |

| 子指令 | 旗標 | 用途 |
| --- | --- | --- |
| `install` | `--target` | 目標用戶端：`antigravity`、`claude`、`cursor`、`vscode` 或 `all`（預設 `all`） |
| `install` | `--dry-run` | 預覽變更，不執行 |

## 其他指令

### stitch cache（Workspace）

查看與清理本機快取（insight、solution 與其他唯讀資源）。語法：`stitch cache <subcommand> [flags]`。

| 子指令 | 用途 |
| --- | --- |
| `cache stats` | 顯示快取內容：項目數、大小、資源類型，以及中斷寫入留下的檔案 |
| `cache prune` | 移除中斷寫入留下的檔案；加 `--max-bytes` 時也淘汰最久未用的項目 |

兩個子指令都涵蓋所有 Workspace 的快取，除非加上 `--workspace`。

### stitch download

下載畫面的 HTML 與截圖。語法：`stitch download [resource] [id] [flags]`，`resource` 只能是 `screen`，`id` 是畫面 ID 或資源名稱。

| 旗標 | 型別 | 用途 |
| --- | --- | --- |
| `--format`、`-f` | `enum` | 檔案或輸出格式：`html`、`png`、`jpg`、`jpeg`、`image`、`json`、`table`、`markdown`、`ndjson` |
| `--html` | `boolean` | 下載畫面的 HTML |
| `--image`、`-screenshot` | `boolean` | 下載畫面的截圖（PNG 或 JPEG） |
| `--output`、`-o` | `string` | 輸出檔案或資料夾路徑（省略時把原始位元組寫到 stdout） |
| `--project`、`-p` | `string` | Stitch 專案 ID |

```shell
stitch download screen <screen-id> --project <project-id>
stitch download screen <screen-id> --project <project-id> --format png
stitch download screen <screen-id> --project <project-id> --html --image --output ./screens
```

### stitch feedback

送出產品意見回饋，或建立 Listnr 工單。語法：`stitch feedback [message] [flags]`；開頭多打的 `submit` 會被忽略。

| 旗標 | 型別 | 用途 |
| --- | --- | --- |
| `--description` | `string` | 回饋內容 |
| `--dry-run` | `boolean` | 預覽回饋內容，不送出 |
| `--product-data`、`-data` | `string` | 選填的產品中繼資料，JSON 或 `key=value,key2=val2` |
| `--screenshot` | `string` | 要附上的截圖檔路徑 |
| `--sentiment` | `string` | 評價：`positive`、`negative` 或 `unspecified` |

```shell
stitch feedback "Loving the CLI"
stitch feedback --description "Loving the CLI tool" --sentiment positive
```

### stitch dismiss（README 0.13.0）

README 0.13.0 的 Loop 段落列出這個指令：`stitch dismiss insights <id>` 把 insight 從推薦中隱藏。

| 旗標 | 用途 |
| --- | --- |
| `--concurrency` | 預設 `5` |
| `--dry-run` | 預覽，不執行 |

```shell
stitch dismiss insights <insight-id>
```

## 和已發布套件的差異

下表比較 Stitch 文件與 `@google/stitch` 0.13.0 的 README。0.13.0 於 2026-11-17 發布，是 2026-11-20 時 npm 的 `latest` 版本。

| 項目 | Stitch 文件 | README 0.13.0 |
| --- | --- | --- |
| 執行檔 | 只寫 `stitch` | `stitch` 與 `stitch-mcp`（等同 `stitch mcp start`） |
| `stitch dismiss insights` | 沒有列出 | 有，旗標 `--concurrency`（預設 `5`）、`--dry-run` |
| `priority`、`priorities`、`--priority` | 指令頁沒有列出 | loop 的舊名稱，仍可使用 |
| `--json` | `boolean`，輸出 JSON；範例卻傳入 JSON 內容 | `--json [payload]`：輸出 JSON，並在 `create`、`edit`、`get`、`find`、`api` 接受原始 JSON 輸入 |
| `--format` 預設 | 自動判斷 | 在終端機中為 `table` |
| `--schema` | 寫入類顯示 schema，讀取類顯示欄位清單 | 印出 JSON Schema（Draft 2020-12） |
| `--dry-run` | 各指令自己的旗標；`stitch api` 用 `--dryRun` | 列為全域旗標，用於會修改資料的指令 |
| `stitch github` 子指令 | `login`（別名 `auth`）、`install`（別名 `configure`）、`status`、`repos` | `login`、`configure`、`repos`、`status` |
| GitHub 與 `connection` | GitHub 用 `stitch github install` 連結 | `connection` 的例子包含 GitHub 與 Slack |
| `stitch api` 旗標 | `--dryRun`、`--filter`、`--force`、`--method`／`-X`、`--yes`／`-y` | `-X, --method`、`--json`、`--schema`、`-y, --yes` |
| `stitch api` 範例路徑 | REST 端點清單用 `goals` | `stitch api workspaces/<id>/loops` |
| 環境變數 | 另有 `STITCH_CANVAS_URL`、`STITCH_FORMAT`、`STITCH_QUIET`、`STITCH_NO_CACHE` | 沒有列出這四個 |
| 畫布指令的憑證 | 一次 `stitch login` 同時驗證畫布專案與 Workspace 工作流程 | 畫布指令可能除了 OAuth 還需要 API key（`MISSING_CANVAS_CREDENTIALS`） |
| Loop 的穩定性 | `enable` 開啟的是實驗性功能 | Loop 預設關閉，指令、API、資源與旗標可能在版本間改變 |
| 函式庫 | 沒有列出 | 匯出 `@google/stitch/ingest` 的 `defineIngest` |

## 完整欄位

加上全域旗標 `--schema` 可以在本機自我描述：寫入類指令顯示 schema，讀取類指令顯示欄位清單，例如 `stitch create --schema`。各指令的原文說明見 Stitch 文件的 [CLI Commands](https://stitch.google.com/docs/cli/reference/commands/)。
